import { NextResponse } from 'next/server';
import { getSavedPhrases, saveNewPhrase } from '@/lib/phraseStore';
import { MultilingualEntry, PhraseCategory } from '@/lib/types';

export const dynamic = 'force-dynamic';

const MAX_PHRASES = 2000;
const CATEGORIES: PhraseCategory[] = [
  'routine',
  'work',
  'food',
  'social',
  'travel',
  'tech',
  'slang',
];

// Verrou en mémoire pour éviter que 10 requêtes simultanées ne spamment l'API DeepSeek
let isGeneratingLock = false;

async function generateSinglePhraseWithDeepSeek(
  category: PhraseCategory,
  apiKey: string,
  existingList: MultilingualEntry[]
): Promise<MultilingualEntry | null> {
  try {
    const recentPhrases = existingList
      .filter((p) => p.category === category)
      .slice(-20)
      .map((p) => p.translations.fr)
      .join(' | ');

    const systemPrompt = `Tu es le moteur linguistique natif de JustSpik (apprentissage des langues par réflexes oraux rapides).
Tu dois créer 1 phrase du quotidien, percutante, utile, réaliste et idiomatique.
Elle doit être traduite fidèlement et naturellement dans les 5 langues : fr, en, es, de, it.
Fournis un conseil réflexe d'élocution court pour chaque langue.
Réponds EXCLUSIVEMENT en JSON valide, sans formatage markdown ni balises.`;

    const userPrompt = `Génère 1 phrase naturelle pour la catégorie : "${category}".
Phrases récentes à ne pas dupliquer : ${recentPhrases || 'aucune'}.

Format JSON attendu :
{
  "category": "${category}",
  "translations": {
    "fr": "...",
    "en": "...",
    "es": "...",
    "de": "...",
    "it": "..."
  },
  "explanations": {
    "fr": "Astuce réflexe",
    "en": "Speaking tip",
    "es": "Consejo rápido",
    "de": "Schneller Tipp",
    "it": "Consiglio rapido"
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
        temperature: 0.75,
      }),
    });

    if (!res.ok) {
      console.warn('[Fill-Phrases] Erreur réponse DeepSeek:', res.status, await res.text());
      return null;
    }

    const json = await res.json();
    const content = json.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);
    if (!parsed.translations?.fr || !parsed.translations?.en) return null;

    return {
      id: `auto-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      category: parsed.category || category,
      translations: parsed.translations,
      explanations: parsed.explanations || {},
      targetTimeSec: Number(parsed.targetTimeSec) || 3.2,
    };
  } catch (err) {
    console.error('[Fill-Phrases Exception]', err);
    return null;
  }
}

async function handleAutoFill() {
  const existing = await getSavedPhrases();
  const currentCount = existing.length;

  // 1. GARDE-FOU ABSOLU DES 2 000 PHRASES
  if (currentCount >= MAX_PHRASES) {
    return NextResponse.json({
      success: true,
      isFull: true,
      message: `Objectif de ${MAX_PHRASES} phrases atteint ! La génération automatique est définitivement arrêtée.`,
      totalCount: currentCount,
      target: MAX_PHRASES,
    });
  }

  // 2. Gestion de la concurrence (verrou simple)
  if (isGeneratingLock) {
    return NextResponse.json({
      success: true,
      skipped: true,
      message: 'Une génération est déjà en cours d’exécution en tâche de fond.',
      totalCount: currentCount,
    });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      success: false,
      error: 'DEEPSEEK_API_KEY non configurée.',
      totalCount: currentCount,
    });
  }

  isGeneratingLock = true;

  try {
    // 3. Équilibrage : choisir la catégorie la moins représentée
    const categoryCounts: Record<string, number> = {};
    CATEGORIES.forEach((cat) => {
      categoryCounts[cat] = 0;
    });
    existing.forEach((p) => {
      if (categoryCounts[p.category] !== undefined) {
        categoryCounts[p.category]++;
      }
    });

    // Trouve la catégorie ayant le moins de phrases
    let minCat: PhraseCategory = 'routine';
    let minCount = Infinity;
    for (const cat of CATEGORIES) {
      if (categoryCounts[cat] < minCount) {
        minCount = categoryCounts[cat];
        minCat = cat;
      }
    }

    // 4. Génération IA avec DeepSeek
    const newEntry = await generateSinglePhraseWithDeepSeek(minCat, apiKey, existing);

    if (!newEntry) {
      return NextResponse.json({
        success: false,
        error: 'Échec de génération IA.',
        totalCount: currentCount,
      });
    }

    // 5. Sauvegarde
    const saved = await saveNewPhrase(newEntry);

    return NextResponse.json({
      success: true,
      added: true,
      category: minCat,
      phraseFr: newEntry.translations.fr,
      phraseEn: newEntry.translations.en,
      totalCount: saved.totalCount,
      remainingTo2000: Math.max(0, MAX_PHRASES - saved.totalCount),
      isFull: saved.totalCount >= MAX_PHRASES,
    });
  } finally {
    isGeneratingLock = false;
  }
}

// Support des requêtes POST (déclencheur client lors du clic "Suivant")
export async function POST() {
  return handleAutoFill();
}

// Support des requêtes GET (pour les cron jobs serveur, GitHub Actions ou curl)
export async function GET() {
  return handleAutoFill();
}
