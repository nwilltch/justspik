import { NextResponse } from 'next/server';
import {
  findUserByEmail,
  createUser,
  storeVerificationCode,
  updateUser,
  hashPassword,
} from '@/lib/userStore';
import { sendVerificationCodeEmail } from '@/lib/mailflot';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit comporter au moins 6 caractères.' },
        { status: 400 }
      );
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser && existingUser.isVerified) {
      return NextResponse.json(
        { error: 'Un compte avec cet email existe déjà. Veuillez vous connecter.' },
        { status: 400 }
      );
    }

    let user = existingUser;
    if (!user) {
      user = await createUser({
        email,
        name: name || email.split('@')[0],
        password,
        isVerified: false,
      });
    } else {
      // Met à jour les infos si non encore vérifié
      const { hash, salt } = hashPassword(password);
      user = await updateUser(user.id, {
        name: name || user.name,
        passwordHash: hash,
        salt,
      });
    }

    // Génération et envoi du code par email via Mailflot
    const code = await storeVerificationCode(email, 'signup');
    await sendVerificationCodeEmail(email, code, user?.name);

    return NextResponse.json({
      success: true,
      needVerification: true,
      email,
      message: 'Code de vérification envoyé à votre adresse email.',
    });
  } catch (error) {
    console.error('Erreur API signup:', error);
    return NextResponse.json(
      { error: 'Une erreur interne est survenue.' },
      { status: 500 }
    );
  }
}
