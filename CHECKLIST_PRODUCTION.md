# ✅ Checklist Mise en Production - Menhir

**Date de création** : 04 février 2026  
**Version** : 1.0

---

## 📊 État Actuel

### Progression : ~90% ✅

Le projet est **quasi prêt** pour une mise en production. Voici ce qui est fait et ce qui reste.

---

## ✅ COMPLÉTÉ - Prêt pour la Production

### Infrastructure & Déploiement
- [x] **Next.js 14** configuré avec App Router
- [x] **Base de données PostgreSQL** (Neon) connectée
- [x] **Prisma ORM** configuré avec schéma complet
- [x] **Déploiement Vercel** opérationnel
- [x] **Cron job Vercel** pour suppression messages > 7 jours
- [x] **Variables d'environnement** configurées (.env.local)

### Authentification & Sécurité
- [x] **NextAuth.js** pour membres inscrits
- [x] **Accès Rapide** pour visiteurs anonymes
- [x] **Contexte unifié** AuthContext
- [x] **Inscription** avec vérification email
- [x] **Récupération mot de passe** fonctionnelle
- [x] **Protection routes** authentifiées
- [x] **Validation serveur** (Zod) sur toutes les APIs
- [x] **Dual auth** (NextAuth + Quick Access) sur toutes les API routes

### Pages & Navigation
- [x] Page d'accueil (choix inscription/accès rapide)
- [x] Dashboard de découverte
- [x] Page profil (vue + édition)
- [x] Page messages (liste + chat)
- [x] Page likes (intelligente : online→chat, offline→popup)
- [x] Page recherche (filtres fonctionnels)
- [x] Pages paramètres (profil, mot de passe, bloqués)
- [x] Pages légales complètes (CGU, mentions légales, confidentialité, contact)
- [x] Navigation responsive (desktop + mobile bottom bar)

### Fonctionnalités Utilisateur
- [x] **CRUD profil** complet
- [x] **Système de likes** avec règles :
  - Anonymes ne peuvent pas liker (403)
  - On ne peut liker que des membres inscrits
  - Clic online → chat, offline → popup
- [x] **Système de blocage** (tous endpoints supportent dual auth)
- [x] **Système de signalement**
- [x] **Conversations & Messages** (polling 5s)
- [x] **Badge messages non lus** (polling 10s, pastille rouge animée)
- [x] **Recherche avancée** (âge, ville, pseudo, photo, connectés)
- [x] **Upload photos** (compression, validation, bloqué pour anonymes)

### UX & Design
- [x] **Mobile-first** responsive
- [x] **Bottom navigation** mobile
- [x] **Dark mode** supporté
- [x] **Toasts** (notifications visuelles)
- [x] **Modals** de confirmation
- [x] **Skeletons** de chargement
- [x] **Brand Menhir** (logo, couleurs, slogan)

### Monétisation
- [x] **Composants AdSense** (4 types : banner, horizontal, sidebar, native)
- [x] **Script AdSense** intégré dans layout
- [x] **Placements publicitaires** sur toutes les pages principales
- [x] **Variables d'environnement** pour slots AdSense
- [x] **Documentation** complète (`docs/ADSENSE_SETUP.md`)

---

## ⚠️ RESTE À FAIRE - Avant Mise en Production

### 🔴 BLOQUANT (À faire AVANT le lancement)

#### 1. Compte Google AdSense
**Impact** : Monétisation impossible sans ce compte  
**Difficulté** : Moyenne  
**Temps estimé** : 2-7 jours (validation Google)

**Actions** :
- [ ] Créer un compte Google AdSense
- [ ] Soumettre le site pour validation
- [ ] Obtenir l'ID Publisher et les IDs de slots
- [ ] Configurer les variables d'environnement en production :
  ```bash
  NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX
  NEXT_PUBLIC_AD_SLOT_BANNER=XXXXXXXXXX
  NEXT_PUBLIC_AD_SLOT_HORIZONTAL=XXXXXXXXXX
  NEXT_PUBLIC_AD_SLOT_SIDEBAR=XXXXXXXXXX
  NEXT_PUBLIC_AD_SLOT_NATIVE=XXXXXXXXXX
  ```
- [ ] Vérifier l'affichage des publicités en production

📖 **Guide** : Voir `docs/ADSENSE_SETUP.md`

---

#### 2. Configuration Email de Production
**Impact** : Vérification email et récupération mot de passe non fonctionnels  
**Difficulté** : Facile  
**Temps estimé** : 30 minutes

**Actions** :
- [ ] Configurer un service d'envoi d'emails :
  - **Option 1** : Brevo (recommandé, gratuit jusqu'à 9000 emails/mois) ✅
  - **Option 2** : Resend (gratuit jusqu'à 3000 emails/mois)
  - **Option 3** : SendGrid (gratuit jusqu'à 100 emails/jour)
  - **Option 4** : AWS SES (très fiable, payant)
  
- [ ] Obtenir les credentials API
- [ ] Configurer les variables d'environnement :
  ```bash
  # Pour Brevo :
  SMTP_HOST=smtp-relay.brevo.com
  SMTP_PORT=587
  SMTP_USER=votre-email@example.com
  SMTP_PASSWORD=votre-clé-smtp-brevo
  EMAIL_FROM=noreply@menhir.chat
  ```

- [ ] Configurer le domaine d'envoi (`noreply@menhir.chat` ou `contact@menhir.chat`)
- [ ] Tester l'envoi depuis la production

📖 **Ressources** :- [Brevo](https://www.brevo.com/) (recommandé)- [Resend](https://resend.com/)
- [SendGrid](https://sendgrid.com/)

---

#### 3. Domaine et DNS
**Impact** : Site accessible uniquement via URL Vercel  
**Difficulté** : Facile  
**Temps estimé** : 1 heure

**Actions** :
- [ ] Acheter le domaine `menhir.chat` (Namecheap, OVH, etc.)
- [ ] Configurer les DNS pour pointer vers Vercel
- [ ] Ajouter le domaine dans Vercel
- [ ] Configurer le certificat SSL (automatique via Vercel)
- [ ] Mettre à jour la variable `NEXTAUTH_URL` :
  ```bash
  NEXTAUTH_URL=https://www.menhir.chat
  ```

---

#### 4. Variables d'Environnement de Production
**Impact** : Fonctionnalités essentielles cassées  
**Difficulté** : Facile  
**Temps estimé** : 15 minutes

**Actions** :
- [ ] Vérifier que TOUTES les variables sont configurées dans Vercel :
  ```bash
  # Base de données
  DATABASE_URL=postgresql://...
  
  # NextAuth
  NEXTAUTH_SECRET=<générer avec: openssl rand -base64 32>
  NEXTAUTH_URL=https://www.menhir.chat
  
  # Email (Brevo)
  SMTP_HOST=smtp-relay.brevo.com
  SMTP_PORT=587
  SMTP_USER=votre-email@example.com
  SMTP_PASSWORD=votre-clé-smtp
  EMAIL_FROM=noreply@menhir.chat
  
  # AdSense
  NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX
  NEXT_PUBLIC_AD_SLOT_BANNER=XXXXXXXXXX
  NEXT_PUBLIC_AD_SLOT_HORIZONTAL=XXXXXXXXXX
  NEXT_PUBLIC_AD_SLOT_SIDEBAR=XXXXXXXXXX
  NEXT_PUBLIC_AD_SLOT_NATIVE=XXXXXXXXXX
  ```

- [ ] Redéployer après configuration

---

### 🟡 IMPORTANT (Améliore l'expérience, mais non bloquant)

#### 5. Stockage Photos Externe
**État actuel** : Photos stockées en base64 dans PostgreSQL  
**Problème** : Performances dégradées si beaucoup de photos  
**Difficulté** : Moyenne  
**Temps estimé** : 2 heures

**Actions** :
- [ ] Choisir un service de stockage :
  - **Option 1** : Cloudinary (gratuit jusqu'à 25GB, transformation d'images)
  - **Option 2** : AWS S3 (très fiable, payant)
  - **Option 3** : Vercel Blob (intégré, payant)

- [ ] Créer un compte et obtenir les credentials
- [ ] Modifier `AvatarUpload` pour uploader vers le service
- [ ] Migrer les photos existantes (script à créer)

**Pour le lancement** : Base64 fonctionne pour les premiers utilisateurs (< 1000)

---

#### 6. Chat Temps Réel (WebSocket)
**État actuel** : Polling toutes les 5 secondes  
**Problème** : Latence de 5s max, consommation serveur  
**Difficulté** : Élevée  
**Temps estimé** : 1-2 jours

**Actions** :
- [ ] Choisir une solution :
  - **Option 1** : Pusher (gratuit jusqu'à 200k messages/jour, facile)
  - **Option 2** : Ably (gratuit jusqu'à 6M messages/mois)
  - **Option 3** : Serveur Node.js dédié avec Socket.io (complexe)

- [ ] Intégrer le SDK choisi
- [ ] Modifier les composants de chat
- [ ] Tester en production

**Pour le lancement** : Le polling fonctionne correctement, optimisation possible plus tard

📖 **Ressources** :
- [Pusher](https://pusher.com/)
- [Ably](https://ably.com/)

---

#### 7. Analytics
**Impact** : Pas de statistiques de trafic  
**Difficulté** : Facile  
**Temps estimé** : 30 minutes

**Actions** :
- [ ] Créer un compte Google Analytics 4
- [ ] Obtenir l'ID de mesure (G-XXXXXXXXXX)
- [ ] Ajouter le script dans `src/app/layout.tsx` :
  ```tsx
  <Script
    src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
    strategy="afterInteractive"
  />
  ```
- [ ] Configurer le consentement RGPD pour les cookies

---

### 🟢 OPTIONNEL (Améliorations futures)

#### 8. Monitoring & Logs
**Outils recommandés** :
- **Sentry** : Tracking des erreurs JavaScript
- **Vercel Analytics** : Performances du site
- **LogRocket** : Session replay pour debug

#### 9. Tests Automatisés
- Tests E2E avec Playwright
- Tests unitaires des API routes
- Tests de performance (Lighthouse CI)

#### 10. SEO
- Sitemap.xml
- Robots.txt
- Meta tags optimisées
- Schema.org markup

#### 11. Fonctionnalités Premium (V2)
- Indicateur "en train d'écrire..."
- Mode invisible
- Voir qui a consulté son profil
- Indicateur de lecture (vu/non vu)

---

## 🔒 Sécurité - Vérifications Finales

### Avant le lancement, vérifier :

- [ ] **Pas de credentials** dans le code (utiliser .env uniquement)
- [ ] **NEXTAUTH_SECRET** différent entre dev et prod
- [ ] **CORS** configuré correctement
- [ ] **Rate limiting** activé sur les APIs sensibles (à implémenter si traffic élevé)
- [ ] **HTTPS** forcé (automatique via Vercel)
- [ ] **Validation serveur** sur toutes les entrées utilisateur
- [ ] **Sanitization** des messages (XSS)
- [ ] **Pages légales** complètes et conformes RGPD
- [ ] **Consentement cookies** pour AdSense

---

## 📋 Checklist de Déploiement

### Pré-déploiement
- [ ] `npm run build` sans erreurs
- [ ] `npm run lint` sans erreurs
- [ ] Toutes les variables d'environnement configurées
- [ ] Base de données de production migrée (`npx prisma db push`)
- [ ] Tests manuels en environnement de staging

### Déploiement
- [ ] Push vers `main` → Vercel déploie automatiquement
- [ ] Vérifier le déploiement dans Vercel Dashboard
- [ ] Tester les fonctionnalités principales en production
- [ ] Vérifier les logs (pas d'erreurs)

### Post-déploiement
- [ ] Créer quelques comptes de test
- [ ] Envoyer des messages de test
- [ ] Vérifier l'affichage des publicités
- [ ] Tester sur mobile réel
- [ ] Vérifier les emails (inscription, récupération)

---

## 🚀 Timeline Suggérée pour le Lancement

| Jour | Tâche | Durée |
|------|-------|-------|
| J-7 | Créer compte AdSense | 5 jours (validation Google) |
| J-2 | Acheter domaine + configurer DNS | 1h |
| J-1 | Configurer service email | 30min |
| J-1 | Configurer toutes les variables d'env | 30min |
| J-1 | Tests complets en staging | 2h |
| **J-0** | **🚀 MISE EN PRODUCTION** | - |
| J+1 | Monitoring + corrections bugs | Continu |

---

## 📞 Ressources & Support

### Documentation
- **Guide AdSense** : `docs/ADSENSE_SETUP.md`
- **Instructions Copilot** : `.github/copilot-instructions.md`
- **État du Projet** : `PROJET_ETAT.md`

### Services Recommandés
- **Hébergement** : Vercel (actuel) ✅
- **Base de données** : Neon PostgreSQL (actuel) ✅
- **Email** : Resend (à configurer)
- **Photos** : Cloudinary (à configurer)
- **WebSocket** : Pusher (optionnel)
- **Analytics** : Google Analytics 4 (à configurer)

### Contacts
- **Email technique** : contact@menhir.chat (à configurer)
- **Support** : support@menhir.chat (à configurer)
- **Signalement** : signalement@menhir.chat (à configurer)

---

## ✅ Validation Finale

Avant de cliquer sur "Lancer", assure-toi que :

1. ✅ Le compte AdSense est **validé** et configuré
2. ✅ Les emails de vérification **fonctionnent**
3. ✅ Le domaine pointe vers Vercel avec **HTTPS**
4. ✅ Toutes les variables d'environnement sont configurées
5. ✅ Les pages légales sont **complètes et conformes**
6. ✅ Tu as testé **TOUTES** les fonctionnalités en production
7. ✅ Tu as un plan de **monitoring** des erreurs

---

**Le projet est solide comme la pierre ! 🪨**

Bonne chance pour le lancement ! 🚀
