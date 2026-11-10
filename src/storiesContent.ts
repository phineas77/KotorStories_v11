/** Single source of truth for narration: content/stories.json.
 * Editing content/stories.json now changes both the Qwen generator input
 * and the displayed EN / ME texts in the app after restarting Metro.
 */
import chapters from '../content/stories.json';
export type TextChapter = {
  number: number;
  title_en: string;
  title_me: string;
  zone: string;
  en: string;
  me: string;
  sources: string[];
  targetSeconds: number;
  estimatedEnglishSeconds: number;
  estimatedMontenegrinSeconds: number;
};
export const storiesContent: TextChapter[] = chapters;
