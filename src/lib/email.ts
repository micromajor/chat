const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://menhir.chat";

/**
 * Envoie un email via l'API REST Brevo
 */
async function sendBrevoEmail(to: string, subject: string, htmlContent: string) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const EMAIL_FROM = process.env.EMAIL_FROM || "Menhir <noreply@menhir.chat>";

  if (!BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY manquante dans .env");
  }

  // Parse EMAIL_FROM pour extraire name et email
  const fromMatch = EMAIL_FROM.match(/^(.+?)\s*<(.+?)>$/);
  const fromName = fromMatch ? fromMatch[1].trim() : "Menhir";
  const fromEmail = fromMatch ? fromMatch[2].trim() : EMAIL_FROM;

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: fromName,
        email: fromEmail,
      },
      to: [{ email: to }],
      subject,
      htmlContent,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Erreur Brevo: ${JSON.stringify(error)}`);
  }

  return response.json();
}

/**
 * Envoie un email de vérification
 */
export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${baseUrl}/verification?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Vérifiez votre email - Le Menhir</title>
      <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700&display=swap" rel="stylesheet">
    </head>
    <body style="font-family: 'Comic Neue', 'Comic Sans MS', cursive; background-color: #FFF8E7; margin: 0; padding: 20px; background-image: radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px); background-size: 20px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #FFFDF4; border-radius: 16px; overflow: hidden; border: 3px solid #1A1A1A; box-shadow: 6px 6px 0 #1A1A1A;">
        <!-- Header BD -->
        <div style="background: linear-gradient(135deg, #1B4F8A 0%, #0D2B4A 100%); padding: 28px; text-align: center; border-bottom: 3px solid #1A1A1A;">
          <h1 style="font-family: 'Bangers', cursive; color: #FFB800; margin: 0; font-size: 36px; letter-spacing: 3px; text-transform: uppercase; text-shadow: 2px 2px 0 #1A1A1A;">⛰ Le Menhir</h1>
          <p style="font-family: 'Comic Neue', cursive; color: #FFD54F; margin: 6px 0 0; font-size: 13px; font-style: italic;">Solide comme la pierre</p>
        </div>
        <!-- Contenu -->
        <div style="padding: 36px 30px;">
          <h2 style="font-family: 'Bangers', cursive; color: #1A1A1A; margin-top: 0; font-size: 24px; letter-spacing: 1px;">Bienvenue sur Le Menhir ! 👋</h2>
          <p style="color: #333; line-height: 1.7; font-size: 15px;">
            Merci de vous être inscrit. Pour activer votre compte et commencer à faire des rencontres, 
            veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${verifyUrl}" 
               style="font-family: 'Bangers', cursive; background-color: #1B4F8A; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 12px; font-size: 18px; letter-spacing: 1.5px; text-transform: uppercase; display: inline-block; border: 2px solid #1A1A1A; box-shadow: 4px 4px 0 #1A1A1A;">
              Vérifier mon email
            </a>
          </div>
          <p style="color: #666; font-size: 13px;">
            Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
            <br>
            <a href="${verifyUrl}" style="color: #1B4F8A; word-break: break-all; font-weight: bold;">${verifyUrl}</a>
          </p>
          <p style="color: #666; font-size: 13px;">
            ⏳ Ce lien expire dans 24 heures.
          </p>
        </div>
        <!-- Footer BD -->
        <div style="background-color: #FFB800; padding: 16px; text-align: center; border-top: 3px solid #1A1A1A;">
          <p style="font-family: 'Comic Neue', cursive; color: #1A1A1A; font-size: 12px; margin: 0;">
            Si vous n'avez pas créé de compte sur Le Menhir, ignorez cet email.
          </p>
          <p style="font-family: 'Bangers', cursive; color: #0D2B4A; font-size: 11px; margin: 8px 0 0; letter-spacing: 1px;">
            © 2026 Le Menhir — <a href="https://menhir.chat" style="color: #0D2B4A; text-decoration: underline;">menhir.chat</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendBrevoEmail(email, "Vérifiez votre email - Menhir", html);
}

/**
 * Envoie un email de réinitialisation de mot de passe
 */
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${baseUrl}/reinitialisation?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Réinitialisation du mot de passe - Le Menhir</title>
      <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700&display=swap" rel="stylesheet">
    </head>
    <body style="font-family: 'Comic Neue', 'Comic Sans MS', cursive; background-color: #FFF8E7; margin: 0; padding: 20px; background-image: radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px); background-size: 20px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #FFFDF4; border-radius: 16px; overflow: hidden; border: 3px solid #1A1A1A; box-shadow: 6px 6px 0 #1A1A1A;">
        <!-- Header BD -->
        <div style="background: linear-gradient(135deg, #1B4F8A 0%, #0D2B4A 100%); padding: 28px; text-align: center; border-bottom: 3px solid #1A1A1A;">
          <h1 style="font-family: 'Bangers', cursive; color: #FFB800; margin: 0; font-size: 36px; letter-spacing: 3px; text-transform: uppercase; text-shadow: 2px 2px 0 #1A1A1A;">⛰ Le Menhir</h1>
          <p style="font-family: 'Comic Neue', cursive; color: #FFD54F; margin: 6px 0 0; font-size: 13px; font-style: italic;">Solide comme la pierre</p>
        </div>
        <!-- Contenu -->
        <div style="padding: 36px 30px;">
          <h2 style="font-family: 'Bangers', cursive; color: #1A1A1A; margin-top: 0; font-size: 24px; letter-spacing: 1px;">Réinitialisation du mot de passe 🔐</h2>
          <p style="color: #333; line-height: 1.7; font-size: 15px;">
            Vous avez demandé à réinitialiser votre mot de passe. 
            Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" 
               style="font-family: 'Bangers', cursive; background-color: #1B4F8A; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 12px; font-size: 18px; letter-spacing: 1.5px; text-transform: uppercase; display: inline-block; border: 2px solid #1A1A1A; box-shadow: 4px 4px 0 #1A1A1A;">
              Réinitialiser mon mot de passe
            </a>
          </div>
          <p style="color: #666; font-size: 13px;">
            Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
            <br>
            <a href="${resetUrl}" style="color: #1B4F8A; word-break: break-all; font-weight: bold;">${resetUrl}</a>
          </p>
          <p style="color: #666; font-size: 13px;">
            ⏳ Ce lien expire dans 1 heure.
          </p>
        </div>
        <!-- Footer BD -->
        <div style="background-color: #FFB800; padding: 16px; text-align: center; border-top: 3px solid #1A1A1A;">
          <p style="font-family: 'Comic Neue', cursive; color: #1A1A1A; font-size: 12px; margin: 0;">
            Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. 
            Votre mot de passe restera inchangé.
          </p>
          <p style="font-family: 'Bangers', cursive; color: #0D2B4A; font-size: 11px; margin: 8px 0 0; letter-spacing: 1px;">
            © 2026 Le Menhir — <a href="https://menhir.chat" style="color: #0D2B4A; text-decoration: underline;">menhir.chat</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendBrevoEmail(email, "Réinitialisation du mot de passe - Menhir", html);
}

/**
 * Envoie une notification de nouveau message
 */
export async function sendNewMessageNotification(
  email: string,
  senderPseudo: string
) {
  const loginUrl = `${baseUrl}/connexion`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nouveau message - Le Menhir</title>
      <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700&display=swap" rel="stylesheet">
    </head>
    <body style="font-family: 'Comic Neue', 'Comic Sans MS', cursive; background-color: #FFF8E7; margin: 0; padding: 20px; background-image: radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px); background-size: 20px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #FFFDF4; border-radius: 16px; overflow: hidden; border: 3px solid #1A1A1A; box-shadow: 6px 6px 0 #1A1A1A;">
        <!-- Header BD -->
        <div style="background: linear-gradient(135deg, #1B4F8A 0%, #0D2B4A 100%); padding: 28px; text-align: center; border-bottom: 3px solid #1A1A1A;">
          <h1 style="font-family: 'Bangers', cursive; color: #FFB800; margin: 0; font-size: 36px; letter-spacing: 3px; text-transform: uppercase; text-shadow: 2px 2px 0 #1A1A1A;">⛰ Le Menhir</h1>
          <p style="font-family: 'Comic Neue', cursive; color: #FFD54F; margin: 6px 0 0; font-size: 13px; font-style: italic;">Solide comme la pierre</p>
        </div>
        <!-- Contenu -->
        <div style="padding: 36px 30px;">
          <h2 style="font-family: 'Bangers', cursive; color: #1A1A1A; margin-top: 0; font-size: 24px; letter-spacing: 1px;">Nouveau message ! 💬</h2>
          <p style="color: #333; line-height: 1.7; font-size: 15px;">
            <strong style="color: #1B4F8A;">${senderPseudo}</strong> vous a envoyé un message sur Le Menhir.
          </p>
          <!-- Bulle de dialogue BD -->
          <div style="text-align: center; margin: 28px 0;">
            <div style="display: inline-block; background: #E8F0FE; border: 2px solid #1A1A1A; border-radius: 20px 20px 20px 4px; padding: 14px 22px; box-shadow: 3px 3px 0 #1A1A1A; font-size: 14px; color: #333; max-width: 80%;">
              💬 Vous avez reçu un nouveau message...
            </div>
          </div>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${loginUrl}" 
               style="font-family: 'Bangers', cursive; background-color: #1B4F8A; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 12px; font-size: 18px; letter-spacing: 1.5px; text-transform: uppercase; display: inline-block; border: 2px solid #1A1A1A; box-shadow: 4px 4px 0 #1A1A1A;">
              Voir le message
            </a>
          </div>
        </div>
        <!-- Footer BD -->
        <div style="background-color: #FFB800; padding: 16px; text-align: center; border-top: 3px solid #1A1A1A;">
          <p style="font-family: 'Comic Neue', cursive; color: #1A1A1A; font-size: 12px; margin: 0;">
            Pour ne plus recevoir ces notifications, modifiez vos préférences dans les paramètres.
          </p>
          <p style="font-family: 'Bangers', cursive; color: #0D2B4A; font-size: 11px; margin: 8px 0 0; letter-spacing: 1px;">
            © 2026 Le Menhir — <a href="https://menhir.chat" style="color: #0D2B4A; text-decoration: underline;">menhir.chat</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendBrevoEmail(
    email,
    `${senderPseudo} vous a envoyé un message - Menhir`,
    html
  );
}
