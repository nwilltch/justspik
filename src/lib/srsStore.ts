// Système de répétition espacée et de mémorisation (SRS - Spaced Repetition System)

export interface SrsCard {
  id: string; // phrase ID
  repetitions: number;
  intervalDays: number;
  lastReviewedAt: number;
  nextReviewAt: number;
  status: 'review_needed' | 'learning' | 'mastered';
  lastAccuracy?: number;
  lastSpeedSeconds?: number;
}

const STORAGE_KEY = 'justspik_srs_cards';

export function getSrsCards(): Record<string, SrsCard> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveSrsCards(cards: Record<string, SrsCard>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch (err) {
    console.warn('Erreur sauvegarde SRS:', err);
  }
}

export function markPhraseForReview(
  phraseId: string,
  accuracy: number = 0,
  speedSeconds: number = 0
): void {
  const cards = getSrsCards();
  const existing = cards[phraseId] || {
    id: phraseId,
    repetitions: 0,
    intervalDays: 1,
    lastReviewedAt: Date.now(),
    nextReviewAt: Date.now(),
    status: 'review_needed',
  };

  existing.status = 'review_needed';
  existing.lastReviewedAt = Date.now();
  existing.nextReviewAt = Date.now();
  existing.lastAccuracy = accuracy;
  existing.lastSpeedSeconds = speedSeconds;

  cards[phraseId] = existing;
  saveSrsCards(cards);
}

export function markPhraseMastered(phraseId: string, speedSeconds: number = 0): void {
  const cards = getSrsCards();
  const existing = cards[phraseId];
  if (!existing) return;

  existing.repetitions = (existing.repetitions || 0) + 1;
  // Intervalle espacé : 1 jour -> 3 jours -> 7 jours -> 14 jours
  existing.intervalDays = Math.min(30, Math.round(existing.intervalDays * 2.5));
  existing.nextReviewAt = Date.now() + existing.intervalDays * 24 * 3600 * 1000;
  existing.status = existing.repetitions >= 2 ? 'mastered' : 'learning';
  existing.lastAccuracy = 100;
  existing.lastSpeedSeconds = speedSeconds;

  cards[phraseId] = existing;
  saveSrsCards(cards);
}

export function togglePhraseReview(phraseId: string): boolean {
  const cards = getSrsCards();
  if (cards[phraseId]?.status === 'review_needed') {
    delete cards[phraseId];
    saveSrsCards(cards);
    return false;
  } else {
    markPhraseForReview(phraseId, 0, 0);
    return true;
  }
}

export function isPhraseInReview(phraseId: string): boolean {
  const cards = getSrsCards();
  return cards[phraseId]?.status === 'review_needed';
}

export function getReviewPhraseIds(): string[] {
  const cards = getSrsCards();
  return Object.values(cards)
    .filter((c) => c.status === 'review_needed')
    .map((c) => c.id);
}

export function getReviewCount(): number {
  return getReviewPhraseIds().length;
}
