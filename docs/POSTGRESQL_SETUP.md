# Configuration PostgreSQL pour Menhir

Ce document explique comment configurer PostgreSQL pour le projet.

## 🐘 Installation de PostgreSQL

### Windows

1. **Télécharger PostgreSQL**
   - Aller sur https://www.postgresql.org/download/windows/
   - Télécharger l'installeur (version 15 ou plus récente)

2. **Installer PostgreSQL**
   - Exécuter l'installeur
   - Port par défaut : `5432`
   - Définir un mot de passe pour l'utilisateur `postgres`
   - Installer pgAdmin 4 (inclus)

3. **Créer la base de données**
   ```sql
   -- Se connecter avec pgAdmin ou psql
   CREATE DATABASE menhir;
   CREATE USER menhir_user WITH PASSWORD 'votre_mot_de_passe_securise';
   GRANT ALL PRIVILEGES ON DATABASE menhir TO menhir_user;
   ```

4. **Mettre à jour le fichier .env**
   ```env
   DATABASE_URL="postgresql://menhir_user:votre_mot_de_passe_securise@localhost:5432/menhir?schema=public"
   ```

### Alternative : PostgreSQL en ligne (gratuit)

#### Supabase (Recommandé)
1. Créer un compte sur https://supabase.com
2. Créer un nouveau projet
3. Copier la "Connection string" (section Settings > Database)
4. Coller dans `.env` :
   ```env
   DATABASE_URL="postgresql://postgres:[VOTRE-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```

#### Neon (Alternative)
1. Créer un compte sur https://neon.tech
2. Créer un nouveau projet
3. Copier la connection string
4. Coller dans `.env`

## 🚀 Initialisation de la base de données

Une fois PostgreSQL configuré :

```bash
# 1. Générer le client Prisma
npx prisma generate

# 2. Pousser le schéma vers la base de données
npx prisma db push

# 3. (Optionnel) Ouvrir Prisma Studio pour visualiser les données
npx prisma studio
```

## 📊 Vérification

Pour vérifier que tout fonctionne :

```bash
# Tester la connexion
npx prisma db pull
```

Si aucune erreur n'apparaît, la connexion est établie !

## 🔒 Sécurité

⚠️ **IMPORTANT** :
- Ne jamais commiter le fichier `.env`
- Utiliser des mots de passe forts
- En production, utiliser des variables d'environnement sécurisées
- Activer SSL pour les connexions en production

## 🛠️ Dépannage

### Erreur "Connection refused"
- Vérifier que PostgreSQL est démarré
- Vérifier le port (5432 par défaut)
- Vérifier les credentials

### Erreur "Database does not exist"
- Créer la base de données manuellement avec pgAdmin ou psql

### Erreur "Password authentication failed"
- Vérifier le mot de passe dans `.env`
- Vérifier que l'utilisateur existe
