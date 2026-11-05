import { NextResponse } from 'next/server';
import {
  findUserByEmail,
  verifyOtpCode,
  updateUser,
  hashPassword,
  createSessionToken,
  toSafeUser,
} from '@/lib/userStore';

export async function POST(req: Request) {
  try {
    const { email, code, newPassword } = await req.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { error: 'Email, code et nouveau mot de passe requis.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit comporter au moins 6 caractères.' },
        { status: 400 }
      );
    }

    const isValid = await verifyOtpCode(email, code, 'reset-password');
    if (!isValid) {
      return NextResponse.json(
        { error: 'Code invalide ou expiré.' },
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

    const { hash, salt } = hashPassword(newPassword);
    const updated = await updateUser(user.id, {
      passwordHash: hash,
      salt,
      isVerified: true, // valider au passage s'il ne l'était pas
    });

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
      message: 'Mot de passe réinitialisé avec succès !',
    });

    response.cookies.set('justspik_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 3600,
    });

    return response;
  } catch (error) {
    console.error('Erreur API reset-password:', error);
    return NextResponse.json(
      { error: 'Une erreur interne est survenue.' },
      { status: 500 }
    );
  }
}
