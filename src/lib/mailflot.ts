/**
 * Service d'envoi d'emails transactionnels avec Mailflot (https://mailflot.app)
 */

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export async function sendMailflotEmail({
  to,
  subject,
  html,
  text,
  from,
}: SendEmailParams): Promise<{ success: boolean; error?: string; id?: string }> {
  const apiKey = process.env.MAILFLOT_API_KEY;
  const defaultFrom =
    process.env.MAILFLOT_FROM || 'JustSpik <notifications@justspik.com>';

  // Si pas de clé en développement, on log le message dans la console pour faciliter les tests
  if (!apiKey) {
    console.log('\n=================== [MAILFLOT DEV LOG] ===================');
    console.log(`Pour: ${to}`);
    console.log(`Objet: ${subject}`);
    console.log(`Contenu texte: ${text || html.replace(/<[^>]*>/g, '')}`);
    console.log('==========================================================\n');
    return { success: true, id: 'dev-mock-id' };
  }

  try {
    const response = await fetch('https://mailflot.app/api/v1/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: from || defaultFrom,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Mailflot Error]', response.status, errorText);
      return { success: false, error: errorText };
    }

    const data = await response.json();
    return { success: true, id: data?.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Mailflot Exception]', message);
    return { success: false, error: message };
  }
}

/**
 * Modèle d'email pour l'envoi du code de vérification (Inscription)
 */
export async function sendVerificationCodeEmail(to: string, code: string, name?: string) {
  const subject = `${code} est votre code de confirmation JustSpik`;
  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fafaf9; margin: 0; padding: 40px 20px; color: #1c1917; }
        .card { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e7e5e4; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .logo { font-size: 20px; font-weight: 700; color: #1c1917; margin-bottom: 24px; }
        .logo span { color: #0d9488; }
        .code-box { background: #f0fdfa; border: 1px dashed #0d9488; border-radius: 12px; padding: 18px; text-align: center; margin: 28px 0; }
        .code { font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #0f766e; font-family: monospace; }
        .text { font-size: 15px; line-height: 1.6; color: #44403c; margin: 12px 0; }
        .footer { font-size: 12px; color: #a8a29e; text-align: center; margin-top: 32px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">just<span>spik</span></div>
        <p class="text">Bonjour${name ? ' ' + name : ''},</p>
        <p class="text">Bienvenue sur JustSpik ! Utilisez le code de confirmation suivant pour finaliser votre inscription :</p>
        <div class="code-box">
          <div class="code">${code}</div>
        </div>
        <p class="text" style="font-size: 13px; color: #78716c;">Ce code expire dans 15 minutes. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.</p>
        <div class="footer">
          © ${new Date().getFullYear()} JustSpik — Reflex Speech Training.
        </div>
      </div>
    </body>
    </html>
  `;

  return sendMailflotEmail({ to, subject, html });
}

/**
 * Modèle d'email pour la réinitialisation de mot de passe
 */
export async function sendPasswordResetEmail(to: string, code: string) {
  const subject = `${code} est votre code de réinitialisation JustSpik`;
  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fafaf9; margin: 0; padding: 40px 20px; color: #1c1917; }
        .card { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e7e5e4; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .logo { font-size: 20px; font-weight: 700; color: #1c1917; margin-bottom: 24px; }
        .logo span { color: #0d9488; }
        .code-box { background: #fef2f2; border: 1px dashed #ef4444; border-radius: 12px; padding: 18px; text-align: center; margin: 28px 0; }
        .code { font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #b91c1c; font-family: monospace; }
        .text { font-size: 15px; line-height: 1.6; color: #44403c; margin: 12px 0; }
        .footer { font-size: 12px; color: #a8a29e; text-align: center; margin-top: 32px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">just<span>spik</span></div>
        <p class="text">Bonjour,</p>
        <p class="text">Une demande de réinitialisation de mot de passe a été demandée pour votre compte JustSpik. Saisissez ce code pour définir votre nouveau mot de passe :</p>
        <div class="code-box">
          <div class="code">${code}</div>
        </div>
        <p class="text" style="font-size: 13px; color: #78716c;">Ce code expire dans 15 minutes. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email et votre mot de passe restera inchangé.</p>
        <div class="footer">
          © ${new Date().getFullYear()} JustSpik — Reflex Speech Training.
        </div>
      </div>
    </body>
    </html>
  `;

  return sendMailflotEmail({ to, subject, html });
}
