import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, findUserById, toSafeUser } from '@/lib/userStore';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('justspik_session')?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ user: null });
    }

    const user = await findUserById(payload.userId);
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: toSafeUser(user) });
  } catch (error) {
    console.error('Erreur API me:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
