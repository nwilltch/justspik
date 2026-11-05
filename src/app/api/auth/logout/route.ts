import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Déconnecté avec succès.' });
  response.cookies.delete('justspik_session');
  return response;
}
