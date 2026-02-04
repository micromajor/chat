# Instructions Copilot - Projet Menhir

## 📌 RÈGLE IMPORTANTE - Maintenance Documentation

**À chaque accomplissement de tâche, TOUJOURS mettre à jour :**
1. Ce fichier (`copilot-instructions.md`) - Section "État Actuel"
2. Le fichier `PROJET_ETAT.md` - Progression et TODO
3. Commiter les changements avec un message descriptif

---

## 🎯 Vision du Projet

**Menhir** est une plateforme de rencontres et de chat entre hommes, gratuite et financée par la publicité.
- **Slogan**: "Solide comme la pierre"
- **Logo**: Icône Mountain (Lucide React)
- Le site se distingue par son interface épurée, sa fiabilité et son système de messagerie privée uniquement (pas de salons collectifs).

---

## 🚀 État Actuel du Projet (Février 2025)

### Progression Globale: ~85%

### Ce qui est implémenté ✅

#### Infrastructure
- [x] Architecture complète Next.js 14 avec App Router
- [x] PostgreSQL configuré (Neon) avec Prisma ORM
- [x] Déploiement Vercel fonctionnel
- [x] Schéma Prisma complet avec toutes les relations

#### Authentification
- [x] Système dual : NextAuth.js (inscrits) + Accès Rapide (anonyme)
- [x] Contexte d'authentification unifié (`AuthContext`)
- [x] Générateur de pseudos format `Menhir_XXXXX`
- [x] Inscription complète avec vérification email
- [x] Récupération mot de passe
- [x] Protection des routes authentifiées

#### Pages & Navigation
- [x] Page d'accueil avec choix inscription/accès rapide
- [x] Dashboard de découverte des profils
- [x] Pages de profil (vue + édition)
- [x] Page de messagerie (liste conversations + chat)
- [x] Page des likes (envoyés/reçus)
- [x] Page de recherche avec filtres fonctionnels
- [x] Pages paramètres (profil, mot de passe, utilisateurs bloqués)
- [x] Pages légales (CGU, mentions légales, confidentialité, contact)

#### UX Mobile
- [x] Interface mobile-first responsive
- [x] Navigation bottom bar sur mobile
- [x] Dashboard optimisé mobile (liste cachée, titre "Ta recherche")
- [x] Profil/Paramètres masqués pour accès rapide dans la nav

#### Fonctionnalités CORE ✅
- [x] CRUD profil utilisateur
- [x] Système de likes
- [x] Système de blocage
- [x] Système de signalement
- [x] Conversations et messages (API + polling 5s)
- [x] Suppression automatique des messages > 7 jours (cron Vercel)
- [x] **Badge messages non lus** (pastille rouge animée, API dédiée, polling 10s)
- [x] **Recherche fonctionnelle** (filtres ville, âge, connectés, pseudo, photo)
- [x] **Upload photos** (bloqué pour accès rapide, compression auto)

#### Composants UX ✅
- [x] Système de Toasts (success, error, info, warning)
- [x] Modal de confirmation personnalisée
- [x] Composants Skeleton pour chargement

### TODO - Ce qui reste à faire 📋

#### 🔴 Priorité Haute

1. **Chat temps réel** (Polling 5s actuellement)
   - NOTE: Vercel ne supporte pas WebSockets natifs
   - [ ] Migrer vers Pusher ou Ably pour temps réel vrai
   - [ ] Indicateur "en train d'écrire..."

#### 🟡 Priorité Moyenne

2. **Publicité (Monétisation)**
   - [ ] Intégrer Google AdSense
   - [ ] Banner header sur pages principales
   - [ ] Sidebar sur desktop

#### 🟢 Priorité Basse / Version Future Payante

3. **Fonctionnalités Premium (V2)**
   - [ ] Indicateur de lecture (vu/non vu)
   - [ ] Mode invisible
   - [ ] Voir qui a consulté son profil

### ❌ Fonctionnalités NON prévues
- Pas de page notifications dédiée
- Pas d'affichage "Match" (like mutuel)
- Pas d'envoi de photos dans le chat (modération complexe)
- Pas de salons collectifs (messagerie privée uniquement)

---

## 📋 Règles de Développement

### Architecture Technique
- **Frontend**: Next.js 14+ avec App Router, TypeScript, Tailwind CSS
- **Backend**: API Routes Next.js + Prisma ORM
- **Base de données**: PostgreSQL
- **Temps réel**: Socket.io pour le chat (à implémenter)
- **Auth**: NextAuth.js (inscription complète) + Token localStorage (accès rapide)
- **Stockage**: Cloudinary ou S3 pour les photos de profil
- **Pub**: Google AdSense + emplacements publicitaires stratégiques

### Conventions de Code
- Utiliser TypeScript strict (`"strict": true`)
- Nommage des fichiers: kebab-case pour les fichiers, PascalCase pour les composants
- Commentaires en français
- Messages de commit en français, format: `type(scope): description`
- Toujours utiliser des composants serveur par défaut, "use client" uniquement si nécessaire

### Structure des Dossiers
```
src/
├── app/                    # App Router Next.js
│   ├── (auth)/            # Routes d'authentification
│   │   ├── acces-rapide/  # Accès anonyme (pseudo auto-généré)
│   │   ├── connexion/     # Login par pseudo + mot de passe
│   │   ├── inscription/   # Inscription complète
│   │   ├── mot-de-passe-oublie/
│   │   ├── reinitialisation/
│   │   └── verification/
│   ├── (main)/            # Routes principales (authentifié requis)
│   │   ├── chat/          # Messagerie privée
│   │   ├── dashboard/     # Page d'accueil connecté
│   │   ├── parametres/    # Paramètres utilisateur
│   │   └── profil/        # Visualisation/édition profil
│   ├── api/               # API Routes
│   │   ├── auth/          # NextAuth + quick-register
│   │   ├── chat/          # Conversations et messages
│   │   ├── profile/       # CRUD profil
│   │   └── users/         # Recherche, likes, blocks
│   ├── cgu/               # Conditions générales
│   ├── confidentialite/   # Politique de confidentialité
│   ├── contact/           # Formulaire de contact
│   ├── explorer/          # Découverte de profils
│   ├── mentions-legales/  # Mentions légales
│   └── layout.tsx
├── components/
│   ├── ui/                # Composants UI réutilisables (Button, Input, Card...)
│   ├── chat/              # ChatWindow, MessageBubble, ConversationList
│   ├── profile/           # ProfileCard, ProfileForm, AvatarUpload
│   ├── ads/               # AdBanner, AdSidebar, AdNative
│   └── layout/            # Header, Footer, Sidebar, Navigation
├── contexts/
│   └── auth-context.tsx   # Contexte unifié NextAuth + QuickAccess
├── lib/
│   ├── prisma.ts          # Client Prisma singleton
│   ├── auth.ts            # Configuration NextAuth
│   ├── quick-access.ts    # Helpers accès rapide (token verification)
│   ├── pseudo-generator.ts # Générateur Menhir_XXXXX
│   ├── email.ts           # Templates d'emails
│   ├── utils.ts           # Utilitaires (cn, formatDate...)
│   └── validations.ts     # Schémas Zod de validation
├── hooks/                 # Custom hooks React
├── types/                 # Types TypeScript globaux
└── styles/                # Styles globaux
```

---

## 🔑 Système d'Authentification DUAL

### 1. Inscription Complète (NextAuth.js)
- Login par **pseudo** (pas email) + mot de passe
- Vérification email obligatoire
- Accès à toutes les fonctionnalités

### 2. Accès Rapide (Anonyme)
- **Pseudo auto-généré** par le site (format `Menhir_XXXXX`)
- L'utilisateur ne peut PAS modifier son pseudo
- Photo de profil optionnelle (base64 ou upload)
- Token stocké en localStorage (`quickAccessToken`)
- Accès COMPLET au site (chat, likes, etc.)
- Header `X-Quick-Access-Token` pour les appels API

### Contexte AuthContext
```typescript
// src/contexts/auth-context.tsx
const { user, isAuthenticated, isQuickAccess, logout } = useAuth();
```

### Vérification côté API
```typescript
// Utiliser getUserFromRequest de src/lib/quick-access.ts
import { getUserFromRequest } from "@/lib/quick-access";

const user = await getUserFromRequest(request);
if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
```

---

## 🔒 Règles de Sécurité OBLIGATOIRES

### Données Utilisateurs
- **JAMAIS** stocker de mots de passe en clair (bcrypt obligatoire)
- Validation côté serveur de TOUTES les entrées utilisateur (Zod)
- Sanitization des messages pour éviter XSS
- Rate limiting sur toutes les API
- RGPD: consentement explicite, droit à l'effacement

### Chat Privé
- Un utilisateur ne peut voir QUE ses propres conversations
- Système de blocage d'utilisateurs fonctionnel
- Signalement de comportements abusifs

### Modération
- Système de signalement intégré
- Bannissement possible par les admins

---

## 💰 Monétisation par Publicité

### Emplacements Publicitaires
1. **Banner header** (728x90) - Toutes les pages sauf chat actif
2. **Sidebar** (300x250) - Pages de liste/recherche
3. **Interstitiel** - Entre les actions (ex: après envoi de 5 messages)
4. **Native ads** - Dans la liste des profils (1 pub tous les 6 profils)

### Règles Pub
- Pas de pub dans la fenêtre de chat active (UX prioritaire)
- Pub non-intrusive, pas de pop-up
- Respecter les guidelines AdSense

---

## 👤 Fonctionnalités Utilisateur

### Inscription/Connexion
- **Pseudo + mot de passe** (PAS d'email pour le login)
- Email requis uniquement pour vérification et récupération
- Âge minimum: 18 ans (vérification déclarative)
- Acceptation CGU et politique de confidentialité

### Accès Rapide
- Pseudo **attribué automatiquement** (Menhir_XXXXX)
- **PAS de photo de profil** (réservé aux membres inscrits)
- Un seul clic pour accéder au site
- Mêmes fonctionnalités que l'inscription complète (chat, likes, etc.)
- Menu Profil/Paramètres masqué dans la navigation

### Profil Utilisateur
- Photo de profil (modération avant publication)
- Pseudo, âge, ville/région
- Description courte (280 caractères max)
- Critères de recherche (âge min/max, distance)
- Statut: en ligne / hors ligne / invisible

### Recherche & Découverte
- Liste des utilisateurs en ligne
- Filtres: âge, localisation, nouveaux inscrits
- Système de "like" pour montrer son intérêt
- Historique des profils consultés

### Chat Privé
- Messagerie 1-to-1 uniquement
- Liste des conversations avec preview du dernier message
- **Badge messages non lus** bien visible (pastille rouge dans navigation)
- Indicateur de lecture (vu/non vu) - **VERSION PAYANTE FUTURE**
- Indicateur "en train d'écrire..." - **VERSION PAYANTE FUTURE**
- Pas d'envoi de photos dans le chat (modération complexe)

---

## 🎨 Design & UX

### Identité Visuelle
- **Nom**: Menhir
- **Slogan**: "Solide comme la pierre"
- **Logo**: Icône Mountain (lucide-react)
- **Couleurs principales**: 
  - Primaire: Rouge chaleureux (#DC2626 / red-600)
  - Accent: Ambre (#F59E0B / amber-500)
  - Fond clair: Gris chaud (#F5F5F4 / stone-100)
  - Fond sombre: Gris foncé (#1C1917 / stone-900)
  - Texte: Gris pierre (#44403C / stone-700)
- **Typographie**: Inter pour le texte, Montserrat pour les titres
- **Style**: Moderne, épuré, chaleureux, accueillant

### Classes CSS principales
```tsx
// Bouton primaire
className="bg-red-600 hover:bg-red-700 text-white"

// Bouton secondaire
className="bg-amber-500 hover:bg-amber-600 text-white"

// Gradient logo/header
className="bg-gradient-to-r from-red-600 to-amber-500 bg-clip-text text-transparent"

// Card
className="bg-white dark:bg-stone-800 rounded-xl shadow-lg"
```

### Principes UX
- Mobile-first (responsive obligatoire)
- Temps de chargement < 3 secondes
- Accessibilité WCAG 2.1 niveau AA
- Dark mode disponible
- Feedback visuel sur toutes les actions

---

## 🗄️ Modèle de Données (Prisma)

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String    // Hashé avec bcrypt
  pseudo        String    @unique
  birthDate     DateTime
  city          String?
  region        String?
  description   String?   @db.VarChar(280)
  avatar        String?   // URL ou base64
  
  // Préférences de recherche
  searchAgeMin  Int       @default(18)
  searchAgeMax  Int       @default(99)
  searchDistance Int?
  
  // Accès rapide
  isQuickAccess    Boolean   @default(false)
  quickAccessToken String?   @unique
  
  // Statuts
  isOnline      Boolean   @default(false)
  isInvisible   Boolean   @default(false)
  isVerified    Boolean   @default(false)
  isBanned      Boolean   @default(false)
  lastSeenAt    DateTime  @default(now())
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  sentMessages      Message[]
  receivedMessages  Message[]
  conversations     ConversationParticipant[]
  likesSent         Like[]
  likesReceived     Like[]
  blockedUsers      Block[]
  blockedByUsers    Block[]
  reports           Report[]
  reportedBy        Report[]
  profileViews      ProfileView[]
  viewedBy          ProfileView[]
  notifications     Notification[]
}
```

Voir `prisma/schema.prisma` pour le schéma complet.

---

## ✅ Checklist Avant Commit

- [ ] TypeScript compile sans erreur (`npm run build`)
- [ ] Pas de `any` non justifié
- [ ] Validation des inputs côté serveur (Zod)
- [ ] Tests des cas limites
- [ ] Responsive vérifié (mobile, tablet, desktop)
- [ ] Console sans erreurs/warnings
- [ ] Accessibilité vérifiée (labels, contraste, navigation clavier)
- [ ] Branding "Menhir" partout (pas de MenConnect)

---

## 🚫 À NE JAMAIS FAIRE

- Exposer des données d'autres utilisateurs via l'API
- Permettre l'accès à une conversation sans y participer
- Stocker des données sensibles en localStorage (sauf quickAccessToken)
- Ignorer les erreurs côté serveur (toujours logger)
- Utiliser des dépendances non maintenues
- Hardcoder des credentials ou clés API
- Laisser "MenConnect" dans le code (renommé en Menhir)
- Permettre à un visiteur de choisir son pseudo en accès rapide

---

## 📝 Notes Importantes

Ce projet doit respecter les lois françaises concernant:
- La protection des données personnelles (RGPD)
- L'interdiction aux mineurs (site 18+)
- Les obligations légales des hébergeurs (LCEN)
- La modération des contenus

Le site doit afficher clairement:
- Les mentions légales
- La politique de confidentialité
- Les CGU
- Un moyen de contact pour signalement

---

## 🔧 Commandes Utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Prisma - Pousser le schéma
npx prisma db push

# Prisma - Générer le client
npx prisma generate

# Prisma - Studio (GUI)
npx prisma studio

# Linter
npm run lint
```

---

## 📧 URLs et Emails

- **Site**: https://www.menhir.fr
- **Contact**: contact@menhir.fr
- **Support**: support@menhir.fr
- **Signalement**: signalement@menhir.fr
