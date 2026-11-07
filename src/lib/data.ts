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
  { id: 'essential', label: 'Top 500 Chunks', description: 'Structures & réflexes clés du quotidien' },
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

export interface PingPongQuestion {
  id: string;
  category: PhraseCategory;
  questions: Record<SupportedLang, string>;
  suggestedAnswers: Record<SupportedLang, string>;
  nativePolish: Record<SupportedLang, string>;
}

export const PINGPONG_QUESTIONS: PingPongQuestion[] = [
  {
    id: 'pq-1',
    category: 'routine',
    questions: {
      en: 'What did you do first thing this morning?',
      fr: 'Qu’as-tu fait en tout premier ce matin ?',
      es: '¿Qué fue lo primero que hiciste esta mañana?',
      de: 'Was hast du heute Morgen als Erstes gemacht?',
      it: 'Cos’hai fatto come prima cosa stamattina?',
    },
    suggestedAnswers: {
      en: 'I woke up early, had a hot coffee and went for a run.',
      fr: 'Je me suis réveillé tôt, j’ai pris un café chaud et je suis allé courir.',
      es: 'Me desperté temprano, tomé un café caliente y salí a correr.',
      de: 'Ich bin früh aufgewacht, habe Kaffee getrunken und bin joggen gegangen.',
      it: 'Mi sono svegliato presto, ho preso un caffè caldo e sono andato a correre.',
    },
    nativePolish: {
      en: 'First thing I did was grab a fresh cup of coffee to kick off the day.',
      fr: 'La toute première chose a été d’avaler un café pour attaquer la journée.',
      es: 'Lo primero que hice fue prepararme un buen café para arrancar con energía.',
      de: 'Als Erstes habe ich mir einen Kaffee geschnappt, um in die Gänge zu kommen.',
      it: 'La primissima cosa è stata bermi un bel caffè per carburare.',
    },
  },
  {
    id: 'pq-2',
    category: 'essential',
    questions: {
      en: 'How do you usually unwind after a busy day?',
      fr: 'Comment décompresses-tu d’habitude après une grosse journée ?',
      es: '¿Cómo sueles desconectar después de un día ajetreado?',
      de: 'Wie entspannst du dich normalerweise nach einem anstrengenden Tag?',
      it: 'Come ti rilassi di solito dopo una giornata intensa?',
    },
    suggestedAnswers: {
      en: 'I like listening to music, cooking a nice meal, or watching a movie.',
      fr: 'J’aime écouter de la musique, cuisiner un bon plat ou regarder un film.',
      es: 'Me gusta escuchar música, cocinar algo rico o ver una película.',
      de: 'Ich höre gerne Musik, koche mir etwas Schönes oder schaue einen Film.',
      it: 'Mi piace ascoltare musica, cucinare un buon piatto o guardare un film.',
    },
    nativePolish: {
      en: 'Honestly, I just crash on the couch with a good podcast to clear my head.',
      fr: 'Franchement, je me pose sur le canapé avec un bon podcast pour me vider la tête.',
      es: 'La verdad es que me tumbo en el sofá con un buen podcast para despejarme.',
      de: 'Ehrlich gesagt chille ich einfach auf dem Sofa mit einem Podcast zum Abschalten.',
      it: 'A dire il vero mi butto sul divano con un bel podcast per staccare la spina.',
    },
  },
  {
    id: 'pq-3',
    category: 'travel',
    questions: {
      en: 'If you could travel anywhere tomorrow, where would you go?',
      fr: 'Si tu pouvais voyager n’importe où demain, où irais-tu ?',
      es: 'Si pudieras viajar a cualquier lugar mañana, ¿adónde irías?',
      de: 'Wenn du morgen überall hinreisen könntest, wohin würdest du gehen?',
      it: 'Se potessi viaggiare ovunque domani, dove andresti?',
    },
    suggestedAnswers: {
      en: 'I would go to Japan to explore Tokyo and eat delicious ramen.',
      fr: 'J’irais au Japon pour explorer Tokyo et manger de délicieux ramens.',
      es: 'Iría a Japón para explorar Tokio y comer un ramen delicioso.',
      de: 'Ich würde nach Japan fliegen, um Tokio zu erkunden und leckere Ramen zu essen.',
      it: 'Andrei in Giappone per esplorare Tokyo e mangiare deliziosi ramen.',
    },
    nativePolish: {
      en: 'Without a second thought, I’d book a one-way ticket to Kyoto.',
      fr: 'Sans hésiter une seconde, je prendrais un billet direct pour Kyoto.',
      es: 'Sin pensármelo dos veces, me pillaría un billete directo a Kioto.',
      de: 'Ohne zu zögern würde ich mir ein One-Way-Ticket nach Kyoto buchen.',
      it: 'Senza pensarci due volte, prenderei un biglietto di sola andata per Kyoto.',
    },
  },
  {
    id: 'pq-4',
    category: 'work',
    questions: {
      en: 'What’s a goal or project you are currently working on?',
      fr: 'Sur quel projet ou objectif travailles-tu en ce moment ?',
      es: '¿En qué objetivo o proyecto estás trabajando ahora mismo?',
      de: 'An welchem Ziel oder Projekt arbeitest du im Moment?',
      it: 'A quale obiettivo o progetto stai lavorando in questo momento?',
    },
    suggestedAnswers: {
      en: 'I am building an app to help people speak foreign languages with confidence.',
      fr: 'Je développe une application pour aider les gens à parler une langue avec confiance.',
      es: 'Estoy creando una aplicación para ayudar a la gente a hablar idiomas con confianza.',
      de: 'Ich entwickle eine App, mit der Leute selbstbewusst Fremdsprachen sprechen.',
      it: 'Sto sviluppando un’app per aiutare le persone a parlare lingue con sicurezza.',
    },
    nativePolish: {
      en: 'I’ve been pouring my energy into launching an oral fluency training tool.',
      fr: 'Je mets toute mon énergie dans le lancement d’un outil pour débloquer l’aisance orale.',
      es: 'Le estoy metiendo caña al lanzamiento de una herramienta para hablar fluido.',
      de: 'Ich stecke gerade meine ganze Energie in den Launch eines Sprachtraining-Tools.',
      it: 'Sto mettendo tutta la mia energia nel lancio di uno strumento per parlare fluente.',
    },
  },
  {
    id: 'pq-5',
    category: 'essential',
    questions: {
      en: 'Why is becoming fluent in this language important to you?',
      fr: 'Pourquoi devenir bilingue dans cette langue est important pour toi ?',
      es: '¿Por qué es importante para ti llegar a hablar este idioma con fluidez?',
      de: 'Warum ist es dir wichtig, diese Sprache fließend zu beherrschen?',
      it: 'Perché è importante per te parlare fluentemente questa lingua?',
    },
    suggestedAnswers: {
      en: 'It unlocks global opportunities, travel freedom, and deeper connections with people.',
      fr: 'Ça ouvre des opportunités mondiales, la liberté de voyager et de vraies connexions.',
      es: 'Abre oportunidades globales, libertad para viajar y conectar de verdad con la gente.',
      de: 'Es eröffnet weltweite Chancen, Reisefreiheit und echte Verbindungen zu Menschen.',
      it: 'Apre opportunità globali, libertà di viaggiare e connessioni autentiche con le persone.',
    },
    nativePolish: {
      en: 'It completely levels up my career and lets me feel at home anywhere in the world.',
      fr: 'Ça fait passer ma carrière à la vitesse supérieure et je me sens chez moi partout.',
      es: 'Le da un salto total a mi carrera y me permite sentirme como en casa en cualquier lugar.',
      de: 'Es bringt meine Karriere aufs nächste Level und ich fühle mich überall zuhause.',
      it: 'Dà una svolta alla mia carriera e mi fa sentire a casa ovunque nel mondo.',
    },
  },
];

export function extractPowerChunks(
  text: string,
  lang: SupportedLang
): { chunk: string; translation: string; tip?: string }[] {
  const commonChunks: Record<
    string,
    Partial<Record<SupportedLang, string>> & { fr: string; en: string; tip?: string }
  > = {
    'as far as i know': {
      fr: 'à ma connaissance',
      en: 'as far as I know',
      es: 'que yo sepa',
      tip: 'Indispensable pour nuancer sans affirmer à 100%',
    },
    'to be honest': {
      fr: 'pour être franc',
      en: 'to be honest',
      es: 'para ser sincero',
      tip: 'Connecteur oral très naturel en début de réplique',
    },
    'it turns out': {
      fr: 'il s’avère que',
      en: 'it turns out',
      es: 'resulta que',
      tip: 'Formule clé pour raconter un dénouement inattendu',
    },
    'look forward to': {
      fr: 'avoir hâte de',
      en: 'look forward to',
      es: 'tener muchas ganas de',
      tip: 'Toujours suivi d’un gérondif (-ing)',
    },
    'touch base': {
      fr: 'faire le point',
      en: 'touch base',
      es: 'ponerse al día',
      tip: 'Collocation pro américaine incontournable',
    },
    'figure out': {
      fr: 'comprendre / résoudre',
      en: 'figure out',
      es: 'resolver / descifrar',
      tip: 'Verbe à particule le plus fréquent au quotidien',
    },
    'no wonder': {
      fr: 'pas étonnant que',
      en: 'no wonder',
      es: 'con razón',
      tip: 'Remplace avantageusement "it is not surprising"',
    },
    'make sense': {
      fr: 'être logique / avoir du sens',
      en: 'make sense',
      es: 'tener sentido',
      tip: 'Utilisé pour valider l’idée de son interlocuteur',
    },
    'catch up': {
      fr: 'se donner des nouvelles',
      en: 'catch up',
      es: 'ponerse al día',
      tip: 'Idéal pour proposer de se revoir',
    },
    'give a hand': {
      fr: 'donner un coup de main',
      en: 'give a hand',
      es: 'echar una mano',
      tip: 'Formule amicale pour demander de l’aide',
    },
    'run late': {
      fr: 'être en retard',
      en: 'run late',
      es: 'ir con retraso',
      tip: 'Plus naturel que "I am late"',
    },
    'slip my mind': {
      fr: 'sortir de la tête',
      en: 'slip my mind',
      es: 'pasar por alto',
      tip: 'Excuse naturelle et élégante pour un oubli',
    },
    'long story short': {
      fr: 'pour faire court',
      en: 'long story short',
      es: 'en resumidas cuentas',
      tip: 'Pour résumer une histoire sans s’éterniser',
    },
  };

  const lower = text.toLowerCase();
  const matched: { chunk: string; translation: string; tip?: string }[] = [];

  for (const [key, info] of Object.entries(commonChunks)) {
    if (lower.includes(key)) {
      matched.push({
        chunk: info[lang] || key,
        translation: lang === 'fr' ? info.en : info.fr,
        tip: info.tip,
      });
    }
  }

  return matched;
}

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

  const nativeAlternative = entry.nativeAlternatives?.[targetLang];
  const vocabularyChunks =
    entry.vocabularyChunks?.[targetLang] || extractPowerChunks(optimalAnswer, targetLang);

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
    nativeAlternative,
    vocabularyChunks,
  };
}

export function buildPingPongChallenge(
  pq: PingPongQuestion,
  sourceLang: SupportedLang,
  targetLang: SupportedLang
): Challenge {
  const questionText = pq.questions[targetLang] || pq.questions.en;
  const optimalAnswer = pq.suggestedAnswers[targetLang] || pq.suggestedAnswers.en;
  const nativeAlternative = pq.nativePolish[targetLang] || pq.nativePolish.en;

  return {
    id: `pingpong-${pq.id}-${targetLang}`,
    category: pq.category,
    sourceLang,
    targetLang,
    sourceText: questionText,
    optimalAnswer,
    acceptedVariations: [optimalAnswer.toLowerCase()],
    explanation: `Question directe en ${getLanguageInfo(targetLang).name} : réponds avec tes propres mots !`,
    difficulty: 'Medium',
    targetTimeSec: 6.0,
    nativeAlternative,
    pingpongQuestion: questionText,
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
  timeSeconds: number,
  isPingPong: boolean = false
): EvaluationResult {
  const cleanedTrans = cleanText(transcript);
  const cleanedOptimal = cleanText(challenge.optimalAnswer);

  if (isPingPong) {
    const words = cleanedTrans.split(' ').filter(Boolean);
    const wordCount = words.length;
    let accuracy = 0;
    if (wordCount >= 5) {
      accuracy = 95;
    } else if (wordCount >= 3) {
      accuracy = 85;
    } else if (wordCount >= 1) {
      accuracy = 65;
    }

    const isCorrect = accuracy >= 70;
    const speedRating: EvaluationResult['speedRating'] =
      timeSeconds <= 3.5 ? 'lightning' : timeSeconds <= 6.0 ? 'fast' : 'hesitant';

    const diffTokens = words.map((w) => ({ text: w, status: 'correct' as const }));

    return {
      transcript,
      accuracy,
      timeSeconds,
      speedRating,
      isCorrect,
      optimalAnswer: challenge.optimalAnswer,
      targetLang: challenge.targetLang,
      explanation: 'Réponse orale spontanée enregistrée ! Découvre ci-dessous la version ultra-native.',
      diffTokens,
      nativeAlternative: challenge.nativeAlternative,
      vocabularyChunks: challenge.vocabularyChunks,
      isPingPong: true,
      fluencyScore: Math.min(100, Math.round((wordCount / (timeSeconds || 1)) * 40)),
    };
  }

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
    nativeAlternative: challenge.nativeAlternative,
    vocabularyChunks: challenge.vocabularyChunks,
  };
}

export const INITIAL_CHALLENGES: Challenge[] = MULTILINGUAL_ENTRIES.map((e) =>
  buildChallenge(e, 'fr', 'en')
);
