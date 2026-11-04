// Ghost mode & personal records storage

const GHOST_RECORDS_KEY = 'justspik_ghost_records';
const STREAK_KEY = 'justspik_streak_data';

export interface GhostData {
  [phraseId: string]: {
    bestTimeSeconds: number;
    lastAttemptDate: string;
  };
}

export interface StreakData {
  count: number;
  lastActiveDate: string;
}

export function getGhostRecord(phraseId: string): number | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(GHOST_RECORDS_KEY);
    if (!raw) return null;
    const data: GhostData = JSON.parse(raw);
    return data[phraseId]?.bestTimeSeconds ?? null;
  } catch {
    return null;
  }
}

export function saveGhostRecord(
  phraseId: string,
  timeSeconds: number
): { isNewRecord: boolean; previousBest: number | null } {
  if (typeof window === 'undefined') return { isNewRecord: false, previousBest: null };
  try {
    const raw = localStorage.getItem(GHOST_RECORDS_KEY);
    const data: GhostData = raw ? JSON.parse(raw) : {};
    const previousBest = data[phraseId]?.bestTimeSeconds ?? null;

    let isNewRecord = false;
    if (previousBest === null || timeSeconds < previousBest) {
      isNewRecord = true;
      data[phraseId] = {
        bestTimeSeconds: Math.round(timeSeconds * 100) / 100,
        lastAttemptDate: new Date().toISOString(),
      };
      localStorage.setItem(GHOST_RECORDS_KEY, JSON.stringify(data));
    }

    return { isNewRecord, previousBest };
  } catch {
    return { isNewRecord: false, previousBest: null };
  }
}

export function getDailyStreak(): number {
  if (typeof window === 'undefined') return 1;
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return 1;
    const data: StreakData = JSON.parse(raw);
    const today = new Date().toDateString();
    const lastDate = new Date(data.lastActiveDate).toDateString();

    const diffDays = Math.floor(
      (new Date(today).getTime() - new Date(lastDate).getTime()) / (1000 * 3600 * 24)
    );

    if (diffDays === 0) return data.count;
    if (diffDays === 1) return data.count; // Still active
    return 1; // Reset if missed more than 1 day
  } catch {
    return 1;
  }
}

export function recordDayActivity(): number {
  if (typeof window === 'undefined') return 1;
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    const data: StreakData = raw
      ? JSON.parse(raw)
      : { count: 0, lastActiveDate: '' };

    const today = new Date().toDateString();
    const lastDate = data.lastActiveDate ? new Date(data.lastActiveDate).toDateString() : '';

    if (lastDate === today) {
      return data.count;
    }

    const diffDays = lastDate
      ? Math.floor(
          (new Date(today).getTime() - new Date(lastDate).getTime()) / (1000 * 3600 * 24)
        )
      : 1;

    let newCount = 1;
    if (diffDays === 1) {
      newCount = data.count + 1;
    }

    localStorage.setItem(
      STREAK_KEY,
      JSON.stringify({ count: newCount, lastActiveDate: new Date().toISOString() })
    );
    return newCount;
  } catch {
    return 1;
  }
}
