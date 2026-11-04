import {
  SupportedLang,
  LanguageInfo,
  PhraseCategory,
  CategoryInfo,
  MultilingualEntry,
  Challenge,
  EvaluationResult,
} from './types';

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'fr', locale: 'fr-FR', name: 'Français', flag: '🇫🇷' },
  { code: 'en', locale: 'en-US', name: 'English', flag: '🇬🇧' },
  { code: 'es', locale: 'es-ES', name: 'Español', flag: '🇪🇸' },
  { code: 'de', locale: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', locale: 'it-IT', name: 'Italiano', flag: '🇮🇹' },
];

export const CATEGORIES_CONFIG: CategoryInfo[] = [
  { id: 'routine', label: 'Routines', description: 'Habitudes, matin, maison, météo' },
  { id: 'work', label: 'Travail', description: 'Bureau, réunions, projets, emails' },
  { id: 'food', label: 'Cuisine', description: 'Restaurant, plats, goûts, commandes' },
  { id: 'social', label: 'Relations', description: 'Discussions, soirées, émotions' },
  { id: 'travel', label: 'Voyage', description: 'Aéroports, gares, hôtels, ville' },
  { id: 'tech', label: 'Tech', description: 'Digital, visio, outils, télétravail' },
  { id: 'slang', label: 'Idiomes', description: 'Répliques naturelles, punchlines' },
];

export const MULTILINGUAL_ENTRIES: MultilingualEntry[] = [
  {
    id: 'entry-1',
    category: 'routine',
    translations: {
      fr: 'Je ne pense pas qu’il viendra ce soir.',
      en: "I don't think he will come tonight.",
      es: 'No creo que venga esta noche.',
      de: 'Ich glaube nicht, dass er heute Abend kommt.',
      it: 'Non penso che verrà stasera.',
    },
    explanations: {
      en: 'En anglais, utilise la contraction "don\'t think" suivie de "will come" ou "is coming".',
      es: 'Après "no creo que", le verbe se conjugue au subjonctif présent ("venga").',
      de: 'La conjonction "dass" renvoie le verbe conjugué "kommt" en fin de proposition subordonnée.',
      it: 'Après "non penso che", on utilise le futur "verrà" ou le subjonctif "venga".',
      fr: 'En français, "je ne pense pas qu\'il viendra" ou "vienne" au subjonctif sont admis.',
    },
    targetTimeSec: 3.5,
  },
  {
    id: 'entry-2',
    category: 'social',
    translations: {
      fr: 'J’ai vraiment hâte d’avoir de tes nouvelles !',
      en: "I'm looking forward to hearing from you!",
      es: '¡Tengo muchas ganas de tener noticias tuyas!',
      de: 'Ich freue mich schon darauf, von dir zu hören!',
      it: 'Non vedo l’ora di sentirti!',
    },
    explanations: {
      en: 'Attention : après "look forward to", on emploie toujours le gérondif en "-ing" ("hearing").',
      es: '"Tener ganas de" est la formule naturelle pour exprimer l\'impatience bienveillante.',
      de: '"Sich freuen auf" (+ accusatif) exprime l\'anticipation joyeuse d\'un événement futur.',
      it: '"Non vedo l\'ora di" est la tournure idiomatique incontournable pour "j\'ai hâte".',
      fr: 'Formule chaleureuse et dynamique en fin de message personnel ou amical.',
    },
    targetTimeSec: 3.2,
  },
  {
    id: 'entry-3',
    category: 'work',
    translations: {
      fr: 'Faisons le point sur le budget d’ici vendredi.',
      en: "Let's touch base on the budget by Friday.",
      es: 'Revisemos el presupuesto de aquí al viernes.',
      de: 'Lass uns bis Freitag den Haushalt besprechen.',
      it: 'Facciamo il punto sul budget entro venerdì.',
    },
    explanations: {
      en: '"Touch base" ou "sync up" sont les formules business idiomatiques pour "faire le point". "By" indique l\'échéance.',
      es: '"De aquí al viernes" traduit l\'échéance limite de manière fluide.',
      de: '"Bis Freitag" marque la date limite, le verbe se plaçant avec fluidité.',
      it: '"Entro venerdì" marque l\'échéance exacte d\'ici la fin de semaine.',
      fr: '"Faire le point d\'ici..." est le classique du management de projet.',
    },
    targetTimeSec: 3.8,
  },
  {
    id: 'entry-4',
    category: 'work',
    translations: {
      fr: 'Nous sommes enfin sur la même longueur d’onde.',
      en: "We are finally on the same page.",
      es: 'Por fin estamos en la misma sintonía.',
      de: 'Wir sind endlich auf derselben Wellenlänge.',
      it: 'Siamo finalmente sulla stessa lunghezza d’onda.',
    },
    explanations: {
      en: '"On the same page" est la métaphore standard en entreprise anglo-saxonne.',
      es: '"En la misma sintonía" ou "en la misma página" expriment l\'alignement d\'équipe.',
      de: '"Auf derselben Wellenlänge" est très naturel et couramment employé.',
      it: '"Sulla stessa longueur d\'onda" est la formule consacrée.',
      fr: 'Expression imagée classique pour exprimer l\'alignement mutuel.',
    },
    targetTimeSec: 3.2,
  },
  {
    id: 'entry-5',
    category: 'food',
    translations: {
      fr: 'Pourrions-nous avoir l’addition et un peu d’eau s’il vous plaît ?',
      en: 'Could we have the check and some water please?',
      es: '¿Nos trae la cuenta y un poco de agua por favor?',
      de: 'Könnten wir bitte die Rechnung und etwas Wasser haben?',
      it: 'Potremmo avere il conto e un po’ d’acqua per favore?',
    },
    explanations: {
      en: '"Check" (US) ou "bill" (UK) s\'emploient pour l\'addition au restaurant.',
      es: '"Nos trae la cuenta" est direct et fluide dans un restaurant hispanophone.',
      de: '"Die Rechnung, bitte" est la formule polie standard.',
      it: '"Il conto per favore" est la réplique classique en fin de repas.',
      fr: 'Formule polie standard au restaurant.',
    },
    targetTimeSec: 3.2,
  },
  {
    id: 'entry-6',
    category: 'food',
    translations: {
      fr: 'Ce plat est délicieux mais un peu trop épicé pour moi.',
      en: 'This dish is delicious but a bit too spicy for me.',
      es: 'Este plato está delicioso pero un poco demasiado picante para mí.',
      de: 'Dieses Gericht ist köstlich, aber etwas zu scharf für mich.',
      it: 'Questo piatto è delizioso ma un po’ troppo piccante per me.',
    },
    explanations: {
      en: '"A bit too spicy" est la nuance idéale pour un plat épicé.',
      es: '"Picante" désigne ce qui pique en cuisine.',
      de: '"Scharf" est le mot juste pour un plat épicé.',
      it: '"Piccante" est le terme classique pour les plats relevés.',
      fr: 'Nuance gustative classique lors d\'un repas.',
    },
    targetTimeSec: 3.0,
  },
  {
    id: 'entry-7',
    category: 'travel',
    translations: {
      fr: 'Pourriez-vous me déposer au coin de la rue ?',
      en: 'Could you drop me off at the corner?',
      es: '¿Podría dejarme en la esquina de la calle?',
      de: 'Könnten Sie mich an der Straßenecke absetzen?',
      it: 'Potrebbe lasciarmi all’angolo della strada?',
    },
    explanations: {
      en: 'Le phrasal verb "drop off" signifie déposer un passager.',
      es: '"Dejarme en la esquina" est la demande polie en taxi ou VTC.',
      de: '"Absetzen" est le verbe adapté pour déposer quelqu\'un en véhicule.',
      it: '"Lasciarmi all\'angolo" s\'utilise directement avec le chauffeur.',
      fr: 'Formule polie au conditionnel pour les trajets en transport.',
    },
    targetTimeSec: 3.0,
  },
  {
    id: 'entry-8',
    category: 'tech',
    translations: {
      fr: 'Mon micro était coupé, tu m’entends bien maintenant ?',
      en: 'I was on mute, can you hear me properly now?',
      es: 'Tenía el micrófono silenciado, ¿me escuchas bien ahora?',
      de: 'Ich war stummgeschaltet, kannst du mich jetzt gut hören?',
      it: 'Ero su muto, mi senti bene adesso?',
    },
    explanations: {
      en: '"I was on mute" est la phrase n°1 des réunions visio modernes.',
      es: '"Estar silenciado" est l\'expression consacrée en visio.',
      de: '"Stummgeschaltet sein" traduit exactement le micro coupé.',
      it: '"Ero su muto" s\'est imposé dans le travail à distance.',
      fr: 'La réplique quotidienne universelle en télétravail.',
    },
    targetTimeSec: 3.1,
  },
  {
    id: 'entry-9',
    category: 'slang',
    translations: {
      fr: 'Laisse tomber, ça n’en vaut pas la peine.',
      en: "Never mind, it's not worth it.",
      es: 'Déjalo, no vale la pena.',
      de: 'Lass gut sein, das ist es nicht wert.',
      it: 'Lascia perdere, non ne vale la pena.',
    },
    explanations: {
      en: '"Never mind" ou "forget it" sont les répliques immédiates.',
      es: '"Déjalo" ou "olvídalo" expriment directement "laisse tomber".',
      de: '"Lass gut sein" est l\'équivalent allemand idiomatique décontracté.',
      it: '"Lascia perdere" est la formule spontanée la plus courante.',
      fr: 'Expression quotidienne spontanée.',
    },
    targetTimeSec: 2.8,
  },
];

export function buildChallenge(
  entry: MultilingualEntry,
  sourceLang: SupportedLang,
  targetLang: SupportedLang
): Challenge {
  const sourceText = entry.translations[sourceLang] || entry.translations.fr;
  const optimalAnswer = entry.translations[targetLang] || entry.translations.en;
  const explanation =
    entry.explanations[targetLang] ||
    `Traduction idiomatique en ${getLanguageInfo(targetLang).name}.`;

  return {
    id: `${entry.id}-${sourceLang}-${targetLang}`,
    category: entry.category,
    sourceLang,
    targetLang,
    sourceText,
    optimalAnswer,
    acceptedVariations: [optimalAnswer.toLowerCase()],
    explanation,
    difficulty: 'Medium',
    targetTimeSec: entry.targetTimeSec,
  };
}

export function getLanguageInfo(code: SupportedLang): LanguageInfo {
  return (
    SUPPORTED_LANGUAGES.find((lang) => lang.code === code) || SUPPORTED_LANGUAGES[0]
  );
}

export function cleanText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"’¿¡]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function evaluateSpokenAnswer(
  transcript: string,
  challenge: Challenge,
  timeSeconds: number
): EvaluationResult {
  const cleanedTrans = cleanText(transcript);
  const cleanedOptimal = cleanText(challenge.optimalAnswer);

  let bestScore = 0;
  if (cleanedTrans === cleanedOptimal) {
    bestScore = 100;
  } else {
    for (const variation of challenge.acceptedVariations) {
      if (cleanedTrans === cleanText(variation)) {
        bestScore = 100;
        break;
      }
    }
  }

  // Token overlap matching
  if (bestScore === 0) {
    const userWords = cleanedTrans.split(' ').filter(Boolean);
    const targetWords = cleanedOptimal.split(' ').filter(Boolean);

    if (userWords.length === 0) {
      bestScore = 0;
    } else {
      let matchedCount = 0;
      targetWords.forEach((tw) => {
        if (userWords.includes(tw)) {
          matchedCount++;
        }
      });
      const precision =
        (matchedCount / Math.max(targetWords.length, userWords.length)) * 100;
      bestScore = Math.min(100, Math.round(precision));
    }
  }

  let speedRating: EvaluationResult['speedRating'] = 'slow';
  if (timeSeconds <= 2.5) {
    speedRating = 'lightning';
  } else if (timeSeconds <= 4.0) {
    speedRating = 'fast';
  } else if (timeSeconds <= 6.5) {
    speedRating = 'hesitant';
  } else {
    speedRating = 'slow';
  }

  const isCorrect = bestScore >= 70;

  const userWords = cleanedTrans.split(' ');
  const targetWords = cleanedOptimal.split(' ');
  const diffTokens: EvaluationResult['diffTokens'] = targetWords.map((tw) => {
    if (userWords.includes(tw)) {
      return { text: tw, status: 'correct' };
    }
    return { text: tw, status: 'missing' };
  });

  return {
    transcript,
    accuracy: bestScore,
    timeSeconds,
    speedRating,
    isCorrect,
    optimalAnswer: challenge.optimalAnswer,
    targetLang: challenge.targetLang,
    explanation: challenge.explanation,
    diffTokens,
  };
}

export const INITIAL_CHALLENGES: Challenge[] = MULTILINGUAL_ENTRIES.map((e) =>
  buildChallenge(e, 'fr', 'en')
);
