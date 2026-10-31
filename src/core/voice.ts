import type { Lang } from './types';

// Uses the phone's built-in text-to-speech for now. Recorded Indic-TTS audio packs can replace this later.
const LANG_TAG: Record<Lang, string> = { en: 'en-IN', hi: 'hi-IN' };

let enabled = true;

export const setVoiceEnabled = (on: boolean) => {
  enabled = on;
  if (!on) stop();
};

const pickVoice = (lang: Lang): SpeechSynthesisVoice | undefined => {
  const voices = window.speechSynthesis.getVoices();
  const tag = LANG_TAG[lang].toLowerCase();
  return (
    voices.find((v) => v.lang.toLowerCase().replace('_', '-') === tag) ??
    voices.find((v) => v.lang.toLowerCase().startsWith(lang))
  );
};

export const speak = (text: string, lang: Lang) => {
  if (!enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = LANG_TAG[lang];
    const voice = pickVoice(lang);
    if (voice) u.voice = voice;
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  } catch {
    // Speech is a bonus; the text is always on screen.
  }
};

export const stop = () => {
  try {
    window.speechSynthesis?.cancel();
  } catch {
    /* ignore */
  }
};
