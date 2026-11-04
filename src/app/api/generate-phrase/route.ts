import { NextResponse } from 'next/server';
import { MultilingualEntry, PhraseCategory } from '@/lib/types';
import { getSavedPhrases, saveNewPhrase } from '@/lib/phraseStore';

const TARGET_MILESTONE = 2000;

// Fallback bank if no API key is provided
const CURATED_GENERATOR_POOL: Omit<MultilingualEntry, 'id'>[] = [
  {
    category: 'routine',
    translations: {
      fr: 'Je te rappelle dès que je termine cette tâche.',
      en: "I'll call you back as soon as I finish this task.",
      es: 'Te devuelvo la llamada en cuanto termine esta tarea.',
      de: 'Ich rufe dich zurück, sobald ich diese Aufgabe erledigt habe.',
      it: 'Ti richiamo non appena finisco questo compito.',
    },
    explanations: {
      en: 'Après "as soon as", utilise le présent simple ("finish") et non le futur ("will finish").',
      es: '"En cuanto" est toujours suivi du subjonctif ("termine") pour une action future.',
      de: '"Sobald" renvoie le verbe composé à la fin ("erledigt habe").',
      it: '"Non appena" suivi du présent traduit l\'immédiateté naturelle.',
      fr: 'Formule d\'engagement rapide dans la journée.',
    },
    targetTimeSec: 3.4,
  },
  {
    category: 'routine',
    translations: {
      fr: 'Je bois toujours un grand café avant de commencer.',
      en: 'I always have a big cup of coffee before starting.',
      es: 'Siempre me tomo un café grande antes de empezar.',
      de: 'Ich trinke immer eine große Tasse Kaffee, bevor ich anfange.',
      it: 'Bevo sempre un bel caffè prima di iniziare.',
    },
    explanations: {
      en: '"Have a coffee" est plus naturel en anglais que "drink a coffee".',
      es: '"Tomarse un café" avec le pronom réfléchi est la formule native habituelle.',
      de: '"Bevor ich anfange" subordonnée avec verbe à particule séparable.',
      it: '"Un bel caffè" exprime le plaisir du rituel matinal.',
      fr: 'Habitude du matin classique.',
    },
    targetTimeSec: 3.0,
  },
  {
    category: 'work',
    translations: {
      fr: 'Pourrions-nous reporter notre réunion à demain ?',
      en: 'Could we reschedule our meeting for tomorrow?',
      es: '¿Podríamos posponer nuestra reunión para mañana?',
      de: 'Könnten wir unser Treffen auf morgen verschieben?',
      it: 'Potremmo rimandare la nostra riunione a domani?',
    },
    explanations: {
      en: '"Reschedule" est le terme professionnel dédié. "Could we" apporte la politesse nécessaire.',
      es: '"Posponer para mañana" est la formule de politesse en entreprise.',
      de: '"Verschieben auf" (+ accusatif) indique le report temporel.',
      it: '"Rimandare a domani" est le terme professionnel approprié.',
      fr: 'Formule professionnelle courtoise pour les imprévus d\'agenda.',
    },
    targetTimeSec: 3.2,
  },
  {
    category: 'food',
    translations: {
      fr: 'Une table pour deux personnes en terrasse, c’est possible ?',
      en: 'Could we have a table for two on the terrace?',
      es: '¿Sería posible una mesa para dos en la terraza?',
      de: 'Wäre ein Tisch für zwei auf der Terrasse möglich?',
      it: 'Sarebbe possibile un tavolo per due in terrazza?',
    },
    explanations: {
      en: '"On the terrace" ou "outside" pour la terrasse au restaurant.',
      es: '"Una mesa para dos" est la demande directe et courtoise.',
      de: '"Auf der Terrasse" utilise l\'article dative pour le lieu statique.',
      it: '"In terrazza" avec la préposition in.',
      fr: 'La question d\'accueil au restaurant par beau temps.',
    },
    targetTimeSec: 3.0,
  },
  {
    category: 'tech',
    translations: {
      fr: 'Je te partage mon écran pour que tu puisses voir.',
      en: "I'll share my screen so that you can see.",
      es: 'Te comparto mi pantalla para que lo veas.',
      de: 'Ich teile meinen Bildschirm, damit du es sehen kannst.',
      it: 'Condivido il mio schermo così puoi vedere.',
    },
    explanations: {
      en: '"Share my screen" est la formule consacrée en travail digital.',
      es: '"Para que lo veas" prend le subjonctif présent après "para que".',
      de: '"Damit" introduit le but avec le verbe en fin de proposition.',
      it: '"Condivido lo schermo" est immédiat et direct.',
      fr: 'L\'action universelle du travail sur ordinateur.',
    },
    targetTimeSec: 3.0,
  },
];

// DeepSeek API integration (OpenAI-compatible)
async function generateWithDeepSeek(
  category: PhraseCategory,
  apiKey: string,
  existingList: MultilingualEntry[]
): Promise<MultilingualEntry | null> {
  try {
    const systemPrompt = `Tu es le moteur linguistique de JustSpik, une application d'entraînement au réflexe d'élocution rapide sous chronomètre.
Tu dois générer une phrase courte, utile et idiomatique dans la thématique demandée.
La phrase doit être traduite fidèlement et naturellement dans les 5 langues: Français (fr), Anglais (en), Espagnol (es), Allemand (de), Italien (it).
Fournis également une explication réflexe courte (1 phrase max) pour chaque langue.
Réponds STRICTEMENT sous forme d'un objet JSON valide sans balises markdown.`;

    const userPrompt = `Génère 1 phrase naturelle pour la thématique : "${category}".
Phrases déjà existantes : ${existingList.map((e) => e.translations.fr).slice(-15).join(' | ')}.
Ne répète aucune phrase existante.
Structure JSON attendue :
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
    "fr": "Astuce en 1 phrase",
    "en": "Reflex rule in 1 sentence",
    "es": "Regla clave en 1 frase",
    "de": "Schlüsselregel in 1 Satz",
    "it": "Regola chiave in 1 frase"
  },
  "targetTimeSec": 3.0
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
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      console.error('Erreur appel DeepSeek API:', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);
    return {
      id: `phrase-${Date.now()}`,
      category: parsed.category || category,
      translations: parsed.translations,
      explanations: parsed.explanations || {},
      targetTimeSec: parsed.targetTimeSec || 3.0,
    };
  } catch (err) {
    console.error('Exception DeepSeek:', err);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { category = 'routine' } = await request.json().catch(() => ({}));
    const existing = await getSavedPhrases();
    const deepseekKey = process.env.DEEPSEEK_API_KEY;

    let newEntry: MultilingualEntry | null = null;

    // Call DeepSeek if key is configured
    if (deepseekKey) {
      newEntry = await generateWithDeepSeek(category, deepseekKey, existing);
    }

    // Fallback if no key or error
    if (!newEntry) {
      const candidates = CURATED_GENERATOR_POOL.filter(
        (c) =>
          c.category === category &&
          !existing.some(
            (e) =>
              e.translations.fr.toLowerCase().trim() ===
              c.translations.fr.toLowerCase().trim()
          )
      );

      const template =
        candidates[0] ||
        CURATED_GENERATOR_POOL.find(
          (c) =>
            !existing.some(
              (e) =>
                e.translations.fr.toLowerCase().trim() ===
                c.translations.fr.toLowerCase().trim()
            )
        ) ||
        CURATED_GENERATOR_POOL[Math.floor(Math.random() * CURATED_GENERATOR_POOL.length)];

      newEntry = {
        id: `phrase-${Date.now()}`,
        ...template,
      };
    }

    const saved = await saveNewPhrase(newEntry);

    return NextResponse.json({
      entry: newEntry,
      totalCount: saved.totalCount,
      milestone: TARGET_MILESTONE,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
