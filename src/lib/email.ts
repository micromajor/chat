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
      <title>Vérifiez votre email - Menhir</title>
    </head>
    <body style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; background-color: #F5F5F4; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
        <div style="background: linear-gradient(to right, #DC2626, #F59E0B); padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: 1px;">⛰ Menhir</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 13px; font-style: italic;">Solide comme la pierre</p>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #1C1917; margin-top: 0;">Bienvenue sur Menhir ! 👋</h2>
          <p style="color: #44403C; line-height: 1.6;">
            Merci de vous être inscrit. Pour activer votre compte et commencer à faire des rencontres, 
            veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" 
               style="background-color: #DC2626; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
              Vérifier mon email
            </a>
          </div>
          <p style="color: #78716C; font-size: 14px;">
            Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
            <br>
            <a href="${verifyUrl}" style="color: #DC2626; word-break: break-all;">${verifyUrl}</a>
          </p>
          <p style="color: #78716C; font-size: 14px;">
            Ce lien expire dans 24 heures.
          </p>
        </div>
        <div style="background-color: #F5F5F4; padding: 20px; text-align: center; border-top: 1px solid #E7E5E4;">
          <p style="color: #A8A29E; font-size: 12px; margin: 0;">
            Si vous n'avez pas créé de compte sur Menhir, ignorez cet email.
          </p>
          <p style="color: #A8A29E; font-size: 11px; margin: 8px 0 0;">
            © 2026 Menhir — <a href="https://menhir.chat" style="color: #DC2626; text-decoration: none;">menhir.chat</a>
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
      <title>Réinitialisation du mot de passe - Menhir</title>
    </head>
    <body style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; background-color: #F5F5F4; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
        <div style="background: linear-gradient(to right, #DC2626, #F59E0B); padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: 1px;">⛰ Menhir</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 13px; font-style: italic;">Solide comme la pierre</p>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #1C1917; margin-top: 0;">Réinitialisation du mot de passe 🔐</h2>
          <p style="color: #44403C; line-height: 1.6;">
            Vous avez demandé à réinitialiser votre mot de passe. 
            Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #DC2626; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
              Réinitialiser mon mot de passe
            </a>
          </div>
          <p style="color: #78716C; font-size: 14px;">
            Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
            <br>
            <a href="${resetUrl}" style="color: #DC2626; word-break: break-all;">${resetUrl}</a>
          </p>
          <p style="color: #78716C; font-size: 14px;">
            Ce lien expire dans 1 heure.
          </p>
        </div>
        <div style="background-color: #F5F5F4; padding: 20px; text-align: center; border-top: 1px solid #E7E5E4;">
          <p style="color: #A8A29E; font-size: 12px; margin: 0;">
            Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. 
            Votre mot de passe restera inchangé.
          </p>
          <p style="color: #A8A29E; font-size: 11px; margin: 8px 0 0;">
            © 2026 Menhir — <a href="https://menhir.chat" style="color: #DC2626; text-decoration: none;">menhir.chat</a>
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
      <title>Nouveau message - Menhir</title>
    </head>
    <body style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; background-color: #F5F5F4; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
        <div style="background: linear-gradient(to right, #DC2626, #F59E0B); padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: 1px;">⛰ Menhir</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 13px; font-style: italic;">Solide comme la pierre</p>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #1C1917; margin-top: 0;">Vous avez un nouveau message ! 💬</h2>
          <p style="color: #44403C; line-height: 1.6;">
            <strong>${senderPseudo}</strong> vous a envoyé un message sur Menhir.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginUrl}" 
               style="background-color: #DC2626; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
              Voir le message
            </a>
          </div>
        </div>
        <div style="background-color: #F5F5F4; padding: 20px; text-align: center; border-top: 1px solid #E7E5E4;">
          <p style="color: #A8A29E; font-size: 12px; margin: 0;">
            Pour ne plus recevoir ces notifications, modifiez vos préférences dans les paramètres de votre compte.
          </p>
          <p style="color: #A8A29E; font-size: 11px; margin: 8px 0 0;">
            © 2026 Menhir — <a href="https://menhir.chat" style="color: #DC2626; text-decoration: none;">menhir.chat</a>
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
