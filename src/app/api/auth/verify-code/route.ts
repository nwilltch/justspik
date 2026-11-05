import { NextResponse } from 'next/server';
import {
  findUserByEmail,
  verifyOtpCode,
  updateUser,
  createSessionToken,
  toSafeUser,
} from '@/lib/userStore';

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email et code à 6 chiffres requis.' },
        { status: 400 }
      );
    }

    const isValid = await verifyOtpCode(email, code, 'signup');
    if (!isValid) {
      return NextResponse.json(
        { error: 'Code invalide ou expiré. Veuillez réessayer.' },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé.' },
        { status: 404 }
      );
    }

    // Valider le compte
    const updated = await updateUser(user.id, { isVerified: true });
    if (!updated) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour.' },
        { status: 500 }
      );
    }

    const sessionToken = createSessionToken(updated.id);

    const response = NextResponse.json({
      success: true,
      user: toSafeUser(updated),
      message: 'Compte validé avec succès !',
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
    console.error('Erreur API verify-code:', error);
    return NextResponse.json(
      { error: 'Une erreur interne est survenue.' },
      { status: 500 }
    );
  }
}
