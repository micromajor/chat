# 🗑️ Gestion de la Suppression des Messages - Menhir

## 🎯 Règles de Conservation

### Utilisateurs Inscrits (NextAuth)
- Messages conservés **15 minutes** après la dernière connexion
- À la déconnexion : `expiresAt = now + 15 minutes`
- À la reconnexion : `expiresAt = null` (annulation)

### Utilisateurs Anonymes (Accès Rapide)
- Messages supprimés **immédiatement** à la déconnexion
- À la déconnexion : `expiresAt = now` (suppression immédiate)
- Pas de conservation entre les sessions

## 🏗️ Implémentation

### 1. Schéma de Base de Données

Le champ `expiresAt` a été ajouté au modèle `Message` :

```prisma
model Message {
  id             String       @id @default(cuid())
  content        String       @db.Text
  imageUrl       String?
  isRead         Boolean      @default(false)
  isDeleted      Boolean      @default(false)
  createdAt      DateTime     @default(now())
  expiresAt      DateTime?    // Date d'expiration
  
  // ... relations
  
  @@index([expiresAt]) // Index pour performance
}
```

### 2. Fonctions de Gestion ([`message-cleanup.ts`](src/lib/message-cleanup.ts))

#### `setMessagesExpirationForUser(userId)`
Appelée lors de la **déconnexion** :
```typescript
// Détermine automatiquement le délai selon le type d'utilisateur
// - Anonyme : now (immédiat)
// - Inscrit : now + 15 min
await setMessagesExpirationForUser(userId);
```

#### `cancelMessagesExpirationForUser(userId)`
Appelée lors de la **reconnexion** :
```typescript
// Annule l'expiration des messages
await cancelMessagesExpirationForUser(userId);
```

#### `cleanupExpiredMessages()`
Appelée par le **cron job** :
```typescript
// Supprime tous les messages dont expiresAt <= now
await cleanupExpiredMessages();
```

### 3. API de Déconnexion ([`/api/auth/logout`](src/app/api/auth/logout/route.ts))

```typescript
POST /api/auth/logout

// Authentification : NextAuth session OU Quick Access token
// Actions :
// 1. Met isOnline = false
// 2. Met à jour lastSeenAt
// 3. Définit expiresAt sur les messages
```

### 4. Cron Job ([`/api/cleanup/messages`](src/app/api/cleanup/messages/route.ts))

Configuration dans [`vercel.json`](vercel.json) :
```json
{
  "crons": [{
    "path": "/api/cleanup/messages",
    "schedule": "*/5 * * * *"
  }]
}
```

**Fréquence recommandée** : Toutes les 5 minutes

## 🔄 Flux Utilisateur

### Scénario 1 : Utilisateur Inscrit

```
1. Utilisateur se connecte
   └─> expiresAt = null (tous ses messages)

2. Utilisateur chatte
   └─> Messages créés avec expiresAt = null

3. Utilisateur se déconnecte
   └─> expiresAt = now + 15 min (tous ses messages)

4. Cron job s'exécute (toutes les 5 min)
   └─> Si expiresAt <= now, messages supprimés

5. Si reconnexion avant 15 min
   └─> expiresAt = null (messages réactivés)
```

### Scénario 2 : Utilisateur Anonyme

```
1. Utilisateur accède rapidement
   └─> Pseudo généré : Menhir_12345

2. Utilisateur chatte
   └─> Messages créés avec expiresAt = null

3. Utilisateur se déconnecte
   └─> expiresAt = now (suppression immédiate)

4. Cron job s'exécute
   └─> Messages supprimés instantanément
```

## 📊 Performance

### Index Optimisés
```sql
-- Index sur expiresAt pour requêtes de nettoyage
CREATE INDEX "Message_expiresAt_idx" ON "Message"("expiresAt");

-- Index combiné pour recherche rapide
CREATE INDEX "Message_conversationId_createdAt_idx" 
  ON "Message"("conversationId", "createdAt");
```

### Requêtes Optimisées
- `cleanupExpiredMessages()` : 1 requête DELETE avec filtre
- `setMessagesExpirationForUser()` : 2 requêtes UPDATE (envoyés + reçus)
- Utilisation de `updateMany()` pour performance

## 🔧 Maintenance

### Surveillance
```typescript
// Logger les suppressions
console.log(`[Cleanup] ${count} messages expirés supprimés`);

// Monitoring recommandé :
// - Nombre de messages supprimés par jour
// - Temps d'exécution du cron job
// - Taille de la table Message
```

### Backup
⚠️ **Important** : Les messages supprimés sont **définitifs**.
- Pas de soft delete (pas de `deletedAt`)
- Considérer des backups réguliers de la DB si nécessaire

## 🚀 Déploiement

### Vercel (Recommandé)
Le cron job est configuré via `vercel.json` et s'exécute automatiquement.

### Autre Hébergeur
Configurer un cron job système :
```bash
# Crontab (Linux/Mac)
*/5 * * * * curl -X POST https://menhir.fr/api/cleanup/messages

# Task Scheduler (Windows)
# Créer une tâche qui appelle l'API toutes les 5 minutes
```

## 🧪 Tests

### Test Manuel
```bash
# 1. Se connecter et envoyer des messages
# 2. Se déconnecter
# 3. Appeler manuellement le cleanup
curl -X POST http://localhost:3000/api/cleanup/messages

# 4. Vérifier les messages dans Prisma Studio
npx prisma studio
```

### Test Automatique (à créer)
```typescript
describe("Message Cleanup", () => {
  it("should delete messages immediately for quick access users", async () => {
    // Créer utilisateur anonyme
    // Créer messages
    // Déconnecter
    // Exécuter cleanup
    // Vérifier suppression
  });

  it("should keep messages for 15 min for registered users", async () => {
    // Créer utilisateur inscrit
    // Créer messages
    // Déconnecter
    // Exécuter cleanup avant 15 min
    // Vérifier messages toujours présents
  });
});
```

## 💡 Améliorations Futures

- [ ] Archivage des messages importants (marqués par l'utilisateur)
- [ ] Export des conversations avant suppression
- [ ] Notification avant expiration des messages
- [ ] Statistiques sur les messages supprimés
- [ ] Politique de rétention configurable par utilisateur
