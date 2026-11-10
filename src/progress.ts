import Storage from 'expo-sqlite/kv-store';
import { Language } from './stops';

const KEY = 'kotor-stories-progress-v03';
export type SavedProgress = {
  language: Language;
  liveCompleted: string[];
  demoCompleted: string[];
  heard: string[];
};
const validLanguages = ['en','de','it','fr','es','me'];
export async function loadProgress(validStops: string[]): Promise<SavedProgress> {
  try {
    const raw = await Storage.getItem(KEY);
    if (!raw) throw Error('Nothing stored');
    const parsed = JSON.parse(raw);
    const keep = (ids: unknown) => Array.isArray(ids) ? ids.filter((x): x is string => typeof x === 'string' && validStops.includes(x)) : [];
    return {
      language: validLanguages.includes(parsed.language) ? parsed.language : 'en',
      liveCompleted: keep(parsed.liveCompleted),
      demoCompleted: keep(parsed.demoCompleted),
      heard: keep(parsed.heard),
    };
  } catch {
    return { language: 'en', liveCompleted: [], demoCompleted: [], heard: [] };
  }
}
export async function saveProgress(value: SavedProgress): Promise<void> {
  await Storage.setItem(KEY, JSON.stringify(value));
}
