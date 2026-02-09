# 📋 État du Projet Menhir - Février 2026

Ce document résume l'état actuel du projet pour faciliter la reprise par un autre modèle ou développeur.

**Dernière mise à jour: 9 février 2026**

---

## 🎯 Résumé Exécutif

**Menhir** est une plateforme de rencontres entre hommes, gratuite et financée par la publicité.
- **Slogan**: "Solide comme la pierre"
- **Logo**: Icône Mountain (Lucide React)
- **🌐 EN PRODUCTION** : https://menhir.chat

### Progression Globale: ~96%

| Module | État | Notes |
|--------|------|-------|
| Frontend Pages | ✅ 100% | Toutes les pages créées |
| Authentification | ✅ 100% | NextAuth + Accès Rapide - Fix JWT avatar (9 fév 2026) |
| Vérification Email | ✅ 100% | Fix race condition (4 fév 2026) |
| Schema Prisma | ✅ 100% | Complet |
| Base de données | ✅ 100% | PostgreSQL LOCAL sur serveur Hetzner |
| API Routes | ✅ 100% | Toutes fonctionnelles avec dual auth |
| UX Mobile | ✅ 100% | Navigation bottom bar, layout optimisé |
| Upload Photos | ✅ 100% | Composant fonctionnel, blocage accès rapide |
| Recherche Filtres | ✅ 100% | Filtres ville, âge, connectés, pseudo, photo |
| Page Likes | ✅ 100% | Comportement intelligent online/offline |
| Composants UX | ✅ 100% | Toasts, modals, skeletons |
| Socket.io (Chat) | ⏳ 50% | Polling 5s (WebSocket nécessite serveur dédié) |
| AdSense (code) | ✅ 100% | Composants créés, placements faits, script conditionnel |
| AdSense (compte) | ❌ 0% | ⬅️ PROCHAINE ÉTAPE : créer compte + configurer variables |
| SEO | ✅ 100% | sitemap.xml, robots.txt, metadata, JSON-LD, manifest |
| Google Analytics | ✅ 100% | GA4 (G-BM9NGWE0SX) avec consentement RGPD |
| Cookie Consent RGPD | ✅ 100% | Bandeau cookies, GA ne charge qu'après consentement |
| Robustesse | ✅ 100% | Error Boundary, retry API, rate limiting, logger, sécurité |
| Déploiement | ✅ 100% | Hetzner CX23 + Nginx + PM2 + Cloudflare SSL |

---

## 🐛 Bugs Corrigés Récemment

### 9 février 2026 - Fix connexion NextAuth bloquée
- **Problème** : La connexion restait bloquée sur "Chargement..." 
- **Cause racine** : L'avatar base64 (~12KB) était stocké dans le JWT, rendant le cookie de session > 4KB (découpé en 5 parties)
- **Solution** : Ne plus stocker l'avatar dans le JWT. L'avatar est chargé dynamiquement depuis `/api/profile` via le AuthContext
- **Fichiers modifiés** : `src/lib/auth.ts`, `src/contexts/auth-context.tsx`

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
- [x] **Fix vérification email** (4 fév 2026) : Transaction Prisma pour éviter race condition
- [x] Récupération mot de passe
- [ ] ⚠️ **PROBLÈME** : Les utilisateurs peuvent se connecter SANS vérifier leur email

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
- [x] Likes (avec règles : anonymes ne peuvent pas liker, on ne peut liker que des inscrits)
- [x] Page likes intelligente (clic online→chat, clic offline→popup)
- [x] Blocage utilisateurs
- [x] Signalement
- [x] API conversations/messages (support dual auth)

---

## 📋 TODO - Par Priorité

### 🔴 HAUTE PRIORITÉ

#### 1. Validation Email Obligatoire ⚠️
**URGENT** - Actuellement les utilisateurs peuvent se connecter sans vérifier leur email
- [ ] Bloquer connexion NextAuth si `user.isVerified = false`
- [ ] Ajouter middleware de vérification sur routes (main)
- [ ] Message d'erreur : "Veuillez vérifier votre email avant de vous connecter"
- [ ] Bouton "Renvoyer l'email de vérification" sur page connexion
- [ ] API `/api/auth/resend-verification` (rate limiting 1 email/5min)

**Fichiers à modifier:**
- `src/lib/auth.ts` - Callback authorize() de NextAuth
- `src/app/(auth)/connexion/page.tsx` - UI message vérification
- `src/app/api/auth/resend-verification/route.ts` - Nouvelle API

#### 2. Badge Messages Non Lus ✅
**FAIT** - Pastille rouge animée dans la navigation
- [x] API `/api/messages/unread` dédiée (plus rapide)
- [x] Polling toutes les 10 secondes
- [x] Style visible : rouge vif, animation pulse, bordure

#### 3. Recherche Fonctionnelle ✅
**FAIT** - Filtres opérationnels
- [x] Filtre "Connectés" (par défaut ON)
- [x] Filtre par ville (texte libre)
- [x] Filtre par tranche d'âge
- [x] Filtre par photo
- [x] Recherche par pseudo

#### 4. Chat Temps Réel (Socket.io)
**NOTE**: Vercel ne supporte pas les WebSockets natifs. Options:
- Pusher/Ably (services tiers temps réel)
- Polling optimisé (actuellement: 5s dans le chat)
- Serveur Node.js dédié pour Socket.io

Actuellement: **Polling fonctionnel** (5 secondes)
- [ ] Migration vers Pusher/Ably pour temps réel vrai
- [ ] Statut en ligne/hors ligne temps réel
- [ ] Indicateur "en train d'écrire"

#### 5. Upload Photos ✅
**FAIT** - Composant AvatarUpload fonctionnel
- [x] Compression automatique 300x300
- [x] Validation type/taille
- [x] **BLOQUÉ pour comptes accès rapide** (message d'incitation à s'inscrire)

### 🟡 PRIORITÉ MOYENNE

#### 6. Amélioration UX ✅
**FAIT** - Composants UX ajoutés
- [x] Modal de confirmation personnalisée (suppression compte)
- [x] Système de Toasts (feedback visuel)
- [x] Composants Skeleton réutilisables

#### 7. Publicité (Monétisation) - Code ✅ / Compte ❌
**Code 100% terminé** - Il ne reste que la partie administrative
- [x] Composants AdBanner, AdBannerHorizontal, AdBannerSidebar, AdBannerNative
- [x] Script AdSense conditionnel dans layout.tsx
- [x] Placements sur dashboard, explorer, messages, likes, recherche
- [x] Variables d'environnement préparées
- [x] Documentation de configuration (`docs/ADSENSE_SETUP.md`)
- [x] Placeholders en mode dev (cadres gris "Publicité")

**⬅️ PROCHAINE ÉTAPE - Compte AdSense :**
- [ ] Créer compte sur https://www.google.com/adsense/ avec URL https://www.menhir.chat
- [ ] Attendre validation Google
- [ ] Récupérer ID Publisher (`ca-pub-XXX`)
- [ ] Créer 3 blocs : `menhir-header-horizontal` (Display 728×90), `menhir-sidebar` (Display 300×250), `menhir-native-feed` (In-feed)
- [ ] Sur le serveur, ajouter dans `/home/menhir/menhir/.env.production` :
  - `NEXT_PUBLIC_ADSENSE_ID="ca-pub-XXX"`
  - `NEXT_PUBLIC_AD_SLOT_HEADER="slot_horizontal"`
  - `NEXT_PUBLIC_AD_SLOT_SIDEBAR="slot_sidebar"`
  - `NEXT_PUBLIC_AD_SLOT_NATIVE="slot_native"`
- [ ] Rebuild + PM2 restart
- [ ] Vérifier affichage sur mobile et desktop

### 🟢 VERSION PAYANTE FUTURE

#### 8. Fonctionnalités Premium
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
1. Le site est en production sur https://menhir.chat ✅
2. Les pages légales sont en place (CGU, confidentialité, mentions légales, contact) ✅
3. L'intégration technique est 100% complète (composants + placements) ✅
4. Il suffit de créer le compte, récupérer les IDs, et configurer 4 variables d'env sur le serveur
5. Voir `docs/ADSENSE_SETUP.md` pour le guide complet étape par étape

**Procédure rapide :**
1. https://www.google.com/adsense/ → Créer compte avec URL https://www.menhir.chat
2. Attendre validation Google (quelques jours)
3. Récupérer ID Publisher + créer 3 blocs d'annonces
4. Demander à Copilot de configurer les variables sur le serveur et déployer

---

## 📞 Références

- Instructions Copilot: `.github/copilot-instructions.md`
- Schéma DB: `prisma/schema.prisma`
- Contexte Auth: `src/contexts/auth-context.tsx`
- **Guide AdSense: `docs/ADSENSE_SETUP.md`**
