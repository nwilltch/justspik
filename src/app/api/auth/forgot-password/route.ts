import { NextResponse } from 'next/server';
import { findUserByEmail, storeVerificationCode } from '@/lib/userStore';
import { sendPasswordResetEmail } from '@/lib/mailflot';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis.' },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);

    // Pour des raisons de sécurité, on renvoie un message générique même si l'utilisateur n'existe pas
    if (user) {
      const code = await storeVerificationCode(email, 'reset-password');
      await sendPasswordResetEmail(email, code);
    }

    return NextResponse.json({
      success: true,
      message: 'Si cette adresse existe, un code de réinitialisation vous a été envoyé.',
    });
  } catch (error) {
    console.error('Erreur API forgot-password:', error);
    return NextResponse.json(
      { error: 'Une erreur interne est survenue.' },
      { status: 500 }
    );
  }
}
