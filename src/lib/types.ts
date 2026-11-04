export type SupportedLang = 'fr' | 'en' | 'es' | 'de' | 'it';

export type PhraseCategory =
  | 'routine'
  | 'work'
  | 'food'
  | 'social'
  | 'travel'
  | 'tech'
  | 'slang'
  | 'custom';

export interface CategoryInfo {
  id: PhraseCategory;
  label: string;
  icon?: string;
  description: string;
}

export interface LanguageInfo {
  code: SupportedLang;
  locale: string;
  name: string;
  flag: string;
}

export interface MultilingualEntry {
  id: string;
  category: PhraseCategory;
  translations: Record<SupportedLang, string>;
  explanations: Partial<Record<SupportedLang, string>>;
  targetTimeSec: number;
}

export interface Challenge {
  id: string;
  category: PhraseCategory;
  sourceLang: SupportedLang;
  targetLang: SupportedLang;
  sourceText: string;
  optimalAnswer: string;
  acceptedVariations: string[];
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Pro';
  targetTimeSec: number;
}

export interface EvaluationResult {
  transcript: string;
  accuracy: number; // 0 to 100
  timeSeconds: number;
  speedRating: 'lightning' | 'fast' | 'hesitant' | 'slow';
  isCorrect: boolean;
  optimalAnswer: string;
  targetLang: SupportedLang;
  explanation: string;
  diffTokens: { text: string; status: 'correct' | 'wrong' | 'missing' }[];
}
