import { NextResponse } from 'next/server';
import { findUserByEmail, storeVerificationCode } from '@/lib/userStore';
import { sendVerificationCodeEmail, sendPasswordResetEmail } from '@/lib/mailflot';

export async function POST(req: Request) {
  try {
    const { email, type } = await req.json();

    if (!email || !type || !['signup', 'reset-password'].includes(type)) {
      return NextResponse.json(
        { error: 'Email et type de vérification valides requis.' },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur introuvable.' },
        { status: 404 }
      );
    }

    const code = await storeVerificationCode(email, type);

    if (type === 'signup') {
      await sendVerificationCodeEmail(email, code, user.name);
    } else {
      await sendPasswordResetEmail(email, code);
    }

    return NextResponse.json({
      success: true,
      message: 'Un nouveau code vous a été envoyé.',
    });
  } catch (error) {
    console.error('Erreur API resend-code:', error);
    return NextResponse.json(
      { error: 'Une erreur interne est survenue.' },
      { status: 500 }
    );
  }
}
