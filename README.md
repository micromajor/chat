# 🏔️ Menhir

**Menhir** - Plateforme de rencontres et de chat privé entre hommes.

> 🪨 *"Solide comme la pierre"*

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-blue)](https://www.postgresql.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-green)](https://www.prisma.io/)

## 🎯 Concept

Un site de rencontres gratuit, financé par la publicité, offrant une expérience de chat privé (1-to-1) dans un environnement fiable et respectueux.

## ✨ Fonctionnalités

- 💬 **Chat privé uniquement** - Conversations individuelles, pas de salons collectifs
- 👤 **Double mode d'accès** :
  - **Inscription complète** - Pseudo + mot de passe + vérification email
  - **Accès rapide** - Pseudo auto-généré (`Menhir_XXXXX`), accès immédiat
- 🗑️ **Suppression automatique** - Messages supprimés après 15 min (inscrits) ou immédiatement (anonymes)
- 📸 **Photo de profil** - 1 photo par utilisateur, compression automatique
- 🔍 **Recherche avancée** - Filtres par âge, localisation, statut en ligne
- ❤️ **Système de likes** - Montrez votre intérêt
- 🔒 **Sécurité** - Blocage, signalement, modération
- 📱 **Responsive** - Optimisé mobile et desktop
- 🌙 **Dark mode** - Interface adaptable

## 🛠️ Stack Technique

| Technologie | Usage |
|-------------|-------|
| Next.js 14 | Framework React avec App Router |
| TypeScript | Typage statique |
| Tailwind CSS | Styles |
| Prisma | ORM base de données |
| PostgreSQL | Base de données |
| Socket.io | Chat temps réel (à implémenter) |
| NextAuth.js | Authentification |

## 🎨 Identité Visuelle

- **Nom**: Menhir
- **Logo**: Icône Mountain (lucide-react)
- **Couleurs**:
  - Primaire: Rouge (#DC2626)
  - Accent: Ambre (#F59E0B)
  - Fond: Stone (clair: #F5F5F4, sombre: #1C1917)

## 📁 Structure du Projet

```
src/
├── app/                    # Routes Next.js (App Router)
│   ├── (auth)/            # Authentification (connexion, inscription, accès rapide)
│   ├── (main)/            # Pages principales (dashboard, chat, profil)
│   ├── api/               # API Routes
│   └── [pages légales]/   # CGU, mentions légales, etc.
├── components/            # Composants React
├── contexts/              # Contextes React (AuthContext)
├── lib/                   # Utilitaires et configurations
├── hooks/                 # Custom hooks
├── types/                 # Types TypeScript
└── styles/                # Styles globaux
```

## 🚀 Installation

### Prérequis
- Node.js 18+ installé
- PostgreSQL 15+ installé et démarré
- Git

### Installation Rapide

```bash
# 1. Cloner le projet
git clone [url-du-repo]
cd menhir

# 2. Installer les dépendances
npm install

# 3. Configurer PostgreSQL
# Créer la base de données :
psql -U postgres -c "CREATE DATABASE menhir;"

# 4. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env et mettre à jour DATABASE_URL

# 5. Initialiser la base de données
npx prisma db push
npx prisma generate

# 6. Lancer le serveur de développement
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

### Installation PostgreSQL

**Windows** : Télécharger sur [postgresql.org](https://www.postgresql.org/download/windows/)

**Alternative gratuite en ligne** :
- [Supabase](https://supabase.com) (recommandé)
- [Neon](https://neon.tech)

Voir [`POSTGRESQL_SETUP.md`](POSTGRESQL_SETUP.md) pour les détails.

## ⚙️ Variables d'Environnement

```env
# Base de données PostgreSQL (REQUIS)
DATABASE_URL="postgresql://postgres:password@localhost:5432/menhir?schema=public"

# NextAuth (REQUIS)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generer-avec-openssl-rand-base64-32"

# Email - Optionnel pour commencer
SMTP_HOST="smtp.mailtrap.io"
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASSWORD=""
EMAIL_FROM="Menhir <noreply@menhir.chat>"

# URL publique
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Google AdSense - Optionnel
NEXT_PUBLIC_ADSENSE_ID="ca-pub-XXXXXXXXXXXXXXXX"
```

## 📋 Scripts Disponibles

```bash
npm run dev        # Serveur de développement
npm run build      # Build de production
npm run start      # Démarrer en production
npm run lint       # Vérification ESLint
npx prisma db push # Pousser le schéma vers la DB
npx prisma studio  # Interface graphique Prisma
```

## 🔑 Système d'Authentification

### 1. Inscription Complète
- Pseudo unique + mot de passe
- Email pour vérification et récupération
- Profil complet avec photo

### 2. Accès Rapide (Anonyme)
- Pseudo **auto-généré** par le système (`Menhir_XXXXX`)
- Photo optionnelle
- Même accès que les inscrits complets
- Token stocké en localStorage

## 🔒 Sécurité & Conformité

- ✅ RGPD compliant
- ✅ Site réservé aux majeurs (18+)
- ✅ Mots de passe hashés (bcrypt)
- ✅ Validation côté serveur (Zod)
- ✅ Protection XSS
- ✅ CGU, mentions légales, politique de confidentialité inclus

## 📧 Contact & Documentation

- **Site**: https://www.menhir.fr
- **Contact**: contact@menhir.fr
- **Support**: support@menhir.fr

### 📚 Documentation Complète

- [`PROJET_ETAT.md`](PROJET_ETAT.md) - État du projet et architecture
- [`SUPPRESSION_MESSAGES.md`](SUPPRESSION_MESSAGES.md) - Gestion des messages
- [`PHOTO_PROFIL.md`](PHOTO_PROFIL.md) - Upload et compression photos
- [`POSTGRESQL_SETUP.md`](POSTGRESQL_SETUP.md) - Configuration PostgreSQL
- [`.github/copilot-instructions.md`](.github/copilot-instructions.md) - Instructions Copilot

## 🎯 État du Projet

**Progression : 90%**

✅ Frontend complet  
✅ Authentification dual  
✅ Base de données configurée  
✅ Gestion messages automatique  
✅ Upload photos avec compression  
⚠️ Chat temps réel Socket.io à implémenter  
⚠️ AdSense à configurer  

## 👥 Contribution

Ce projet respecte les standards suivants :
- TypeScript strict
- Commits en français
- Messages de commit : `type(scope): description`
- Code review obligatoire

## 📄 Licence

Propriétaire - Tous droits réservés
- **Support**: support@menhir.fr
- **Signalement**: signalement@menhir.fr

## 📄 Licence

Projet privé - Tous droits réservés.
