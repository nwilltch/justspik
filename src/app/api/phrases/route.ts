import { NextResponse } from 'next/server';
import { getSavedPhrases, saveNewPhrase } from '@/lib/phraseStore';

const TARGET_MILESTONE = 2000;

export async function GET() {
  const phrases = await getSavedPhrases();
  return NextResponse.json({
    phrases,
    totalCount: phrases.length,
    milestone: TARGET_MILESTONE,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await saveNewPhrase(body);
    return NextResponse.json({
      ...result,
      milestone: TARGET_MILESTONE,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
