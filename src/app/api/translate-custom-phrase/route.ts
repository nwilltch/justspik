import { NextResponse } from 'next/server';
import { MultilingualEntry, PhraseCategory, SupportedLang } from '@/lib/types';
import { getLanguageInfo } from '@/lib/data';
import { saveNewPhrase } from '@/lib/phraseStore';

async function processCustomPhraseWithDeepSeek(
  sourceText: string,
  sourceLang: SupportedLang,
  apiKey: string
): Promise<MultilingualEntry | null> {
  try {
    const langInfo = getLanguageInfo(sourceLang);
    const systemPrompt = `Tu es le moteur linguistique de JustSpik.
Un utilisateur soumet une phrase brute en ${langInfo.name} (${sourceLang}).
Ton rôle :
1. Corrige la phrase source si elle contient des fautes ou maladresses, en gardant son sens naturel.
2. Traduis fidèlement et de façon parfaitement idiomatique dans les 5 langues :
   - Français (fr)
   - Anglais (en)
   - Espagnol (es)
   - Allemand (de)
   - Italien (it)
3. Rédige une astuce réflexe courte (1 phrase max) pour chaque langue.
4. Assigne la catégorie la plus adaptée parmi : "routine", "work", "food", "social", "travel", "tech", "slang".
5. Estime un temps cible d'élocution rapide (entre 2.5 et 4.0 secondes).

Réponds STRICTEMENT par un objet JSON valide sans balises markdown ni texte additionnel.`;

    const userPrompt = `Phrase soumise par l'utilisateur : "${sourceText}"
Langue source : ${sourceLang}

Format JSON attendu :
{
  "category": "work",
  "translations": {
    "fr": "...",
    "en": "...",
    "es": "...",
    "de": "...",
    "it": "..."
  },
  "explanations": {
    "fr": "...",
    "en": "...",
    "es": "...",
    "de": "...",
    "it": "..."
  },
  "targetTimeSec": 3.2
}`;

    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      console.error('Erreur DeepSeek custom phrase:', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);
    return {
      id: `custom-${Date.now()}`,
      category: (parsed.category as PhraseCategory) || 'work',
      translations: parsed.translations,
      explanations: parsed.explanations || {},
      targetTimeSec: parsed.targetTimeSec || 3.2,
    };
  } catch (err) {
    console.error('Exception DeepSeek custom phrase:', err);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { sourceText, sourceLang = 'fr' } = await request.json();
    if (!sourceText || !sourceText.trim()) {
      return NextResponse.json(
        { error: 'Veuillez fournir une phrase à traduire.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    let entry: MultilingualEntry | null = null;

    if (apiKey) {
      entry = await processCustomPhraseWithDeepSeek(sourceText.trim(), sourceLang, apiKey);
    }

    // Fallback if DeepSeek is offline or no key
    if (!entry) {
      entry = {
        id: `custom-${Date.now()}`,
        category: 'work',
        translations: {
          fr: sourceText.trim(),
          en: sourceText.trim(),
          es: sourceText.trim(),
          de: sourceText.trim(),
          it: sourceText.trim(),
        },
        explanations: {
          [sourceLang]: 'Phrase personnalisée ajoutée.',
        },
        targetTimeSec: 3.2,
      };
    }

    // Persist automatically to phrases.json!
    const saved = await saveNewPhrase(entry);

    return NextResponse.json({
      entry,
      totalCount: saved.totalCount,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
