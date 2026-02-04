# Configuration Google AdSense - Menhir

## 📋 Prérequis

1. Un site web en ligne accessible publiquement
2. Contenu original et conforme aux règles AdSense
3. Pages légales obligatoires (déjà présentes sur Menhir) :
   - Mentions légales (/mentions-legales)
   - Politique de confidentialité (/confidentialite)
   - CGU (/cgu)
   - Page de contact (/contact)

## 🚀 Étapes de Configuration

### 1. Créer un compte Google AdSense

1. Aller sur [Google AdSense](https://www.google.com/adsense/)
2. Cliquer sur "Commencer"
3. Se connecter avec un compte Google
4. Entrer l'URL du site : `https://www.menhir.chat`
5. Sélectionner le pays (France) et accepter les conditions

### 2. Vérification du site

Google va vérifier que le site respecte les règles AdSense.
Cela peut prendre quelques jours à quelques semaines.

### 3. Récupérer l'ID Publisher

Une fois approuvé, dans le tableau de bord AdSense :
1. Aller dans "Compte" > "Informations sur le compte"
2. Copier l'ID Publisher (format : `ca-pub-XXXXXXXXXXXXXXXX`)

### 4. Créer les Blocs d'Annonces (Ad Units)

Dans AdSense, créer les blocs suivants :

#### A. Banner Header (728x90)
- Nom : `menhir-header-horizontal`
- Type : Display
- Taille : Responsive horizontal
- → Copier le `data-ad-slot` généré

#### B. Sidebar (300x250)
- Nom : `menhir-sidebar`
- Type : Display
- Taille : Responsive
- → Copier le `data-ad-slot` généré

#### C. Publicité Native (In-Feed)
- Nom : `menhir-native-feed`
- Type : In-feed
- → Copier le `data-ad-slot` généré

### 5. Configurer les Variables d'Environnement

Dans le fichier `.env.local` (pour le développement local) ou dans Vercel Dashboard :

```env
# Google AdSense
NEXT_PUBLIC_ADSENSE_ID="ca-pub-XXXXXXXXXXXXXXXX"
NEXT_PUBLIC_AD_SLOT_HEADER="1234567890"
NEXT_PUBLIC_AD_SLOT_SIDEBAR="0987654321"
NEXT_PUBLIC_AD_SLOT_NATIVE="1122334455"
```

### 6. Configuration Vercel

Dans le dashboard Vercel :
1. Aller dans le projet Menhir
2. Settings > Environment Variables
3. Ajouter les variables ci-dessus pour l'environnement "Production"

## 📍 Emplacements des Publicités

| Emplacement | Format | Composant | Visibilité |
|-------------|--------|-----------|------------|
| Header | 728x90 | `AdBannerHorizontal` | Desktop uniquement |
| Sidebar Dashboard | 300x250 | `AdBannerSidebar` | Desktop (XL+) |
| Sidebar Explorer | 300x250 | `AdBannerSidebar` | Desktop (LG+) |
| Sidebar Messages | 300x250 | `AdBanner` | Desktop (LG+) |
| Grille Profils | Native | `AdBannerNative` | Tous écrans |

## ⚠️ Règles Importantes

### Ce qu'on fait ✅
- Pub non-intrusive
- Respect de l'expérience utilisateur
- Pub clairement identifiée
- Responsive (adaptée mobile/desktop)

### Ce qu'on ne fait PAS ❌
- Pub dans le chat actif
- Pop-ups ou interstitiels agressifs
- Incitation au clic
- Pub trompeuse

## 🔧 Dépannage

### Les pubs ne s'affichent pas
1. Vérifier que `NEXT_PUBLIC_ADSENSE_ID` est bien défini
2. Vérifier que le site est en production (pas localhost)
3. Attendre 24-48h après validation AdSense
4. Vérifier la console pour les erreurs

### Revenus faibles
- Ajouter plus de contenu de qualité
- Augmenter le trafic
- Optimiser les emplacements
- Tester différents formats

## 📊 Suivi des Performances

Dans le dashboard AdSense, surveiller :
- RPM (Revenue per Mille)
- CTR (Click-Through Rate)
- Impressions
- Revenus estimés

## 📝 Notes

- Les pubs n'apparaissent qu'en production
- En développement, des placeholders gris sont affichés
- Les composants sont dans `src/components/ads/ad-banner.tsx`
- Le script AdSense est chargé dans `src/app/layout.tsx`
