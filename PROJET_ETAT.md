# 📋 État du Projet Menhir - Janvier 2025

Ce document résume l'état actuel du projet pour faciliter la reprise par un autre modèle ou développeur.

---

## 🎯 Résumé Exécutif

**Menhir** est une plateforme de rencontres entre hommes, gratuite et financée par la publicité.
- **Slogan**: "Solide comme la pierre"
- **Logo**: Icône Mountain (Lucide React)

### Progression Globale: ~85%

| Module | État | Notes |
|--------|------|-------|
| Frontend Pages | ✅ 100% | Toutes les pages créées |
| Authentification | ✅ 100% | NextAuth + Accès Rapide |
| Schema Prisma | ✅ 100% | Complet |
| Base de données | ✅ 100% | PostgreSQL (Neon) |
| API Routes | ✅ 95% | Fonctionnelles |
| UX Mobile | ✅ 100% | Navigation bottom bar, layout optimisé |
| Upload Photos | ✅ 100% | Composant fonctionnel, blocage accès rapide |
| Recherche Filtres | ✅ 100% | Filtres ville, âge, connectés, pseudo, photo |
| Composants UX | ✅ 100% | Toasts, modals, skeletons |
| Socket.io (Chat) | ⏳ 50% | Polling 5s (WebSocket nécessite serveur dédié) |
| AdSense | ✅ 100% | Composants créés, slots configurables |

---

## ✅ Ce qui est FAIT

### Infrastructure
- [x] Next.js 14 avec App Router
- [x] PostgreSQL (Neon) + Prisma ORM
- [x] Déploiement Vercel
- [x] Cron job suppression messages > 7 jours

### Authentification
- [x] NextAuth.js (membres inscrits)
- [x] Accès Rapide (anonyme avec pseudo `Menhir_XXXXX`)
- [x] Contexte unifié `AuthContext`
- [x] Inscription avec vérification email
- [x] Récupération mot de passe

### Pages
- [x] Accueil avec choix inscription/accès rapide
- [x] Dashboard découverte profils
- [x] Profil (vue + édition)
- [x] Messagerie (conversations + chat)
- [x] Likes (envoyés/reçus)
- [x] Recherche (UI seulement)
- [x] Paramètres (profil, mot de passe, bloqués)
- [x] Pages légales complètes

### UX Mobile
- [x] Interface mobile-first
- [x] Bottom navigation bar
- [x] Liste membres cachée sur mobile (dashboard)
- [x] Titre "Ta recherche" sur mobile
- [x] Menu Profil/Paramètres masqué pour accès rapide

### Fonctionnalités
- [x] CRUD profil
- [x] Likes
- [x] Blocage utilisateurs
- [x] Signalement
- [x] API conversations/messages

---

## 📋 TODO - Par Priorité

### 🔴 HAUTE PRIORITÉ

#### 1. Badge Messages Non Lus ✅
**FAIT** - Pastille rouge animée dans la navigation
- [x] API `/api/messages/unread` dédiée (plus rapide)
- [x] Polling toutes les 10 secondes
- [x] Style visible : rouge vif, animation pulse, bordure

#### 2. Recherche Fonctionnelle ✅
**FAIT** - Filtres opérationnels
- [x] Filtre "Connectés" (par défaut ON)
- [x] Filtre par ville (texte libre)
- [x] Filtre par tranche d'âge
- [x] Filtre par photo
- [x] Recherche par pseudo

#### 3. Chat Temps Réel (Socket.io)
**NOTE**: Vercel ne supporte pas les WebSockets natifs. Options:
- Pusher/Ably (services tiers temps réel)
- Polling optimisé (actuellement: 5s dans le chat)
- Serveur Node.js dédié pour Socket.io

Actuellement: **Polling fonctionnel** (5 secondes)
- [ ] Migration vers Pusher/Ably pour temps réel vrai
- [ ] Statut en ligne/hors ligne temps réel
- [ ] Indicateur "en train d'écrire"

#### 4. Upload Photos ✅
**FAIT** - Composant AvatarUpload fonctionnel
- [x] Compression automatique 300x300
- [x] Validation type/taille
- [x] **BLOQUÉ pour comptes accès rapide** (message d'incitation à s'inscrire)

### 🟡 PRIORITÉ MOYENNE

#### 5. Amélioration UX ✅
**FAIT** - Composants UX ajoutés
- [x] Modal de confirmation personnalisée (suppression compte)
- [x] Système de Toasts (feedback visuel)
- [x] Composants Skeleton réutilisables

#### 6. Publicité (Monétisation) ✅
**FAIT** - Intégration AdSense complète
- [x] Composants AdBanner, AdBannerHorizontal, AdBannerSidebar, AdBannerNative
- [x] Script AdSense dans layout.tsx
- [x] Placements sur dashboard, explorer, messages, likes, recherche
- [x] Variables d'environnement pour slots
- [x] Documentation de configuration (`docs/ADSENSE_SETUP.md`)
- [ ] Compte AdSense à créer et configurer (dépend du déploiement)

### 🟢 VERSION PAYANTE FUTURE

#### 7. Fonctionnalités Premium
- [ ] Indicateur "en train d'écrire..."
- [ ] Indicateur de lecture (vu/non vu)
- [ ] Mode invisible
- [ ] Voir qui a consulté son profil

---

## ❌ NON PRÉVU

- ~~Page notifications dédiée~~
- ~~Affichage "Match" (like mutuel)~~
- ~~Envoi photos dans chat~~
- ~~Salons collectifs~~

---

## 🗂️ Structure Clé

```
src/
├── app/
│   ├── (auth)/          # Connexion, inscription, accès rapide
│   ├── (main)/          # Dashboard, chat, profil, paramètres
│   └── api/             # Routes API
├── components/
│   ├── layout/          # MainLayout avec navigation
│   └── ui/              # Button, Input, Avatar...
├── contexts/
│   └── auth-context.tsx # Auth unifiée
└── lib/
    ├── auth.ts          # Config NextAuth
    ├── prisma.ts        # Client Prisma
    └── quick-access.ts  # Helpers accès rapide
```

---

## 🔑 Points Techniques Importants

### Authentification Duale
```typescript
// Vérifier l'utilisateur dans une API route
import { getUserFromRequest } from "@/lib/quick-access";

const user = await getUserFromRequest(request);
if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

// Dans un composant client
const { user, isAuthenticated, isQuickAccess } = useAuth();
```

### Différence Inscrits vs Accès Rapide
| Feature | Inscrit | Accès Rapide |
|---------|---------|--------------|
| Pseudo | Choisi | Auto-généré |
| Photo profil | ✅ | ❌ |
| Menu Profil/Paramètres | ✅ Visible | ❌ Masqué |
| Chat/Likes | ✅ | ✅ |

---

## 🚀 Prochaine Étape Recommandée

**Créer un compte Google AdSense** car :
1. L'intégration technique est complète
2. Il suffit de configurer les variables d'environnement
3. Voir `docs/ADSENSE_SETUP.md` pour le guide complet

---

## 📞 Références

- Instructions Copilot: `.github/copilot-instructions.md`
- Schéma DB: `prisma/schema.prisma`
- Contexte Auth: `src/contexts/auth-context.tsx`
- **Guide AdSense: `docs/ADSENSE_SETUP.md`**
