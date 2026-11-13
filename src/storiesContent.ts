/** Single source of truth for narration: content/stories.json.
 * Editing content/stories.json now changes both the Qwen generator input
 * and the displayed EN / ME texts in the app after restarting Metro.
 */
import chapters from '../content/stories.json';
import it from '../content/translations/it.json';
import de from '../content/translations/de.json';
import fr from '../content/translations/fr.json';
import es from '../content/translations/es.json';
import type { Language } from './stops';
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

export type TranslatedChapter = {number:number; title:string; text:string};
const drafts: Record<string, {language:string; reviewStatus:string; chapters:TranslatedChapter[]}> = {it,de,fr,es};
export const translationCount = (language:Language):number => {
  if (language==='en'||language==='me') return 29;
  return drafts[language]?.chapters?.filter(c=>!!c.text?.trim())?.length || 0;
};
export const translationReady = (language:Language):boolean => translationCount(language) === 29;
export const translatedTitle = (language:Language, number:number):string => {
  const chapter = storiesContent[number-1];
  if(language==='me')return chapter.title_me;
  if(language==='en')return chapter.title_en;
  return drafts[language]?.chapters?.find(c=>c.number===number)?.title?.trim() || chapter.title_en;
};
export const translatedText = (language:Language, number:number):string => {
  const chapter = storiesContent[number-1];
  if(language==='me')return chapter.me;
  if(language==='en')return chapter.en;
  return drafts[language]?.chapters?.find(c=>c.number===number)?.text?.trim() || chapter.en;
};
