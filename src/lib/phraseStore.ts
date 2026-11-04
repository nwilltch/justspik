import { promises as fs } from 'fs';
import path from 'path';
import { MultilingualEntry } from './types';
import { MULTILINGUAL_ENTRIES } from './data';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'phrases.json');

export async function getSavedPhrases(): Promise<MultilingualEntry[]> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    if (!data || !data.trim()) {
      return MULTILINGUAL_ENTRIES;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : MULTILINGUAL_ENTRIES;
  } catch (error) {
    console.warn('Erreur lecture phrases.json, utilisation fallback:', error);
    return MULTILINGUAL_ENTRIES;
  }
}

export async function saveNewPhrase(newEntry: MultilingualEntry): Promise<{
  success: boolean;
  totalCount: number;
  entry: MultilingualEntry;
}> {
  try {
    const existing = await getSavedPhrases();
    // Avoid exact duplicate
    const exists = existing.some(
      (e) =>
        e.translations.fr.toLowerCase().trim() ===
        newEntry.translations.fr.toLowerCase().trim()
    );

    if (exists) {
      return { success: true, totalCount: existing.length, entry: newEntry };
    }

    const updated = [...existing, newEntry];
    await fs.writeFile(DB_PATH, JSON.stringify(updated, null, 2), 'utf-8');
    return { success: true, totalCount: updated.length, entry: newEntry };
  } catch (error) {
    console.error('Erreur écriture phrases.json:', error);
    throw error;
  }
}
