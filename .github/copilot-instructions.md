# Instructions Copilot - Projet Menhir

## 🎯 Vision du Projet

**Menhir** est une plateforme de rencontres et de chat entre hommes, gratuite et financée par la publicité.
- **Slogan**: "Solide comme la pierre"
- **Logo**: Icône Mountain (Lucide React)
- Le site se distingue par son interface épurée, sa fiabilité et son système de messagerie privée uniquement (pas de salons collectifs).

---

## 🚀 État Actuel du Projet (Février 2026)

### Ce qui est implémenté ✅
- Architecture complète Next.js 14 avec App Router
- Système d'authentification dual : NextAuth.js + Accès Rapide (anonyme)
- Toutes les pages frontend (connexion, inscription, accès rapide, dashboard, chat, profil, paramètres, explorer)
- Schéma Prisma complet avec PostgreSQL
- Contexte d'authentification unifié (`AuthContext`)
- Générateur de pseudos format `Menhir_XXXXX`
- Pages légales (CGU, mentions légales, confidentialité, contact)
- Composants publicitaires (banner, sidebar)
- Dark mode support

### Ce qui reste à faire ⚠️
- Configurer PostgreSQL (DATABASE_URL dans .env)
- Exécuter `npx prisma db push` pour créer les tables
- Implémenter Socket.io pour le chat temps réel
- Intégrer Cloudinary ou S3 pour le stockage des photos
- Configurer Google AdSense

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
- Photo de profil optionnelle
- Un seul clic pour accéder au site
- Mêmes fonctionnalités que l'inscription complète

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
- Indicateur de lecture (vu/non vu)
- Indicateur "en train d'écrire..."
- Envoi de photos dans le chat (avec modération)
- Liste des conversations avec preview du dernier message
- Notifications temps réel

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
