# 📧 Configuration Brevo pour Menhir

**Brevo** (ex-Sendinblue) est configuré et prêt à l'emploi !

---

## ✅ Configuration Actuelle

Votre fichier `.env.local` est configuré avec :

```bash
SMTP_HOST="smtp-relay.brevo.com"
SMTP_PORT="587"
SMTP_USER="votre-email@example.com"  # À REMPLACER
SMTP_PASSWORD="xsmtpsib-754f..." # ✅ CONFIGURÉ
EMAIL_FROM="Menhir <noreply@menhir.chat>"
```

---

## 🔧 Étapes Restantes

### 1. Vérifier le Domaine dans Brevo

1. Connectez-vous sur [app.brevo.com](https://app.brevo.com/)
2. Allez dans **Settings** → **Senders, Domains & Dedicated IPs**
3. Cliquez sur **Domains** → **Add a Domain**
4. Entrez : `menhir.chat`
5. Brevo vous donnera des enregistrements DNS à configurer

### 2. Configurer les DNS chez Cloudflare

Ajoutez ces enregistrements dans votre zone DNS Cloudflare pour `menhir.chat` :

#### SPF Record
```
Type: TXT
Name: @
Value: v=spf1 include:spf.brevo.com ~all
TTL: Auto
```

#### DKIM Record
```
Type: TXT
Name: mail._domainkey
Value: [fourni par Brevo - ressemble à k=rsa; p=MIGfMA0GCS...]
TTL: Auto
```

#### DMARC Record (optionnel mais recommandé)
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:postmaster@menhir.chat
TTL: Auto
```

### 3. Mettre à Jour SMTP_USER dans .env.local

Remplacez `votre-email@example.com` par l'email de votre compte Brevo :

```bash
SMTP_USER="votre-email@brevo.com"
```

---

## 🧪 Tester l'Envoi d'Email

### Test Rapide en Local

Créez un fichier de test `test-email.js` :

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: 'votre-email@example.com', // Votre email Brevo
    pass: 'votre-clé-smtp-brevo-ici'
  }
});

transporter.sendMail({
  from: 'Menhir <noreply@menhir.chat>',
  to: 'votre-email-test@example.com',
  subject: 'Test Brevo - Menhir',
  html: '<h1>✅ Email envoyé avec succès !</h1><p>Brevo fonctionne correctement.</p>'
}, (error, info) => {
  if (error) {
    console.error('❌ Erreur:', error);
  } else {
    console.log('✅ Email envoyé:', info.messageId);
  }
});
```

Exécuter :
```bash
node test-email.js
```

### Test via l'Application

1. Lancez le serveur : `npm run dev`
2. Allez sur `/inscription`
3. Créez un compte avec votre vrai email
4. Vérifiez que vous recevez l'email de vérification

---

## 📊 Limites Gratuites Brevo

- ✅ **300 emails/jour** (9000 emails/mois)
- ✅ **Illimité dans le temps**
- ✅ Pas de carte bancaire requise
- ✅ Tous les emails transactionnels inclus

---

## 🔍 Résolution de Problèmes

### Email non reçu ?

1. **Vérifiez les spams** (surtout Gmail)
2. **Vérifiez le domaine dans Brevo** : doit être validé (vert)
3. **Vérifiez les DNS** : 
   - Utilisez [MXToolbox](https://mxtoolbox.com/spf.aspx) pour tester SPF
   - Attendez 24-48h pour la propagation DNS
4. **Vérifiez les logs Brevo** : 
   - Allez dans **Campaigns** → **Transactional** → **Logs**

### Erreur SMTP Authentication Failed ?

- Vérifiez que `SMTP_USER` est bien l'email de votre compte Brevo
- Vérifiez que `SMTP_PASSWORD` est bien votre clé SMTP (pas votre mot de passe)
- Régénérez une nouvelle clé SMTP si nécessaire

### Email marqué comme spam ?

1. Complétez **tous** les enregistrements DNS (SPF, DKIM, DMARC)
2. Utilisez un domaine vérifié (`noreply@menhir.chat` et non `noreply@gmail.com`)
3. Évitez les mots spam dans le sujet ("gratuit", "promo", etc.)
4. Ajoutez un lien de désinscription dans les emails marketing (pas nécessaire pour transactionnels)

---

## 🚀 En Production (Vercel)

Configurez les mêmes variables d'environnement dans Vercel :

1. Allez dans votre projet Vercel → **Settings** → **Environment Variables**
2. Ajoutez :
   ```
   SMTP_HOST=smtp-relay.brevo.com
   SMTP_PORT=587
   SMTP_USER=votre-email@example.com
   SMTP_PASSWORD=xsmtpsib-754f...
   EMAIL_FROM=Menhir <noreply@menhir.chat>
   ```
3. Redéployez : `vercel --prod`

---

## 📧 Types d'Emails Utilisés par Menhir

| Email | Description | Fréquence |
|-------|-------------|-----------|
| **Vérification email** | Inscription nouveau membre | 1x par utilisateur |
| **Récupération mot de passe** | Reset password | Occasionnel |
| **Notifications** (futur) | Nouveau message, like | Variable |

**Estimation** : Pour 100 utilisateurs actifs/mois = ~150 emails/mois
➡️ Largement dans les limites gratuites ! 🎉

---

## ✅ Checklist Finale

- [x] Clé SMTP Brevo configurée dans `.env.local`
- [ ] Email `SMTP_USER` mis à jour dans `.env.local`
- [ ] Domaine `menhir.chat` ajouté dans Brevo
- [ ] Enregistrements DNS configurés dans Cloudflare
- [ ] Domaine vérifié dans Brevo (badge vert)
- [ ] Test d'envoi effectué avec succès
- [ ] Variables d'environnement configurées dans Vercel (production)

---

**Brevo est prêt ! 📧 Vos utilisateurs recevront leurs emails de vérification. 🚀**
