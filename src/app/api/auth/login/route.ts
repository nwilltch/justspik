import { NextResponse } from 'next/server';
import {
  findUserByEmail,
  verifyPassword,
  createSessionToken,
  toSafeUser,
  storeVerificationCode,
} from '@/lib/userStore';
import { sendVerificationCodeEmail } from '@/lib/mailflot';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis.' },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect.' },
        { status: 401 }
      );
    }

    const isMatch = verifyPassword(password, user.passwordHash, user.salt);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect.' },
        { status: 401 }
      );
    }

    // Si le compte n'a pas encore validé son code email
    if (!user.isVerified) {
      const code = await storeVerificationCode(user.email, 'signup');
      await sendVerificationCodeEmail(user.email, code, user.name);

      return NextResponse.json({
        success: false,
        needVerification: true,
        email: user.email,
        message: 'Veuillez valider votre adresse email avec le code envoyé.',
      });
    }

    const sessionToken = createSessionToken(user.id);

    const response = NextResponse.json({
      success: true,
      user: toSafeUser(user),
    });

    response.cookies.set('justspik_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 3600, // 30 jours
    });

    return response;
  } catch (error) {
    console.error('Erreur API login:', error);
    return NextResponse.json(
      { error: 'Une erreur interne est survenue.' },
      { status: 500 }
    );
  }
}
