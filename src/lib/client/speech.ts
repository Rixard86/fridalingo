const ENGLISH_LANG = "en-GB";
const BRITISH = "en-gb";
const ENGLISH = "en";
const NORMAL_RATE = 0.9;
const SLOW_RATE = 0.5;
const VOICE_QUALITY_TIERS = [/natural|neural|premium|enhanced|siri/i, /google|online/i];

type Voice = Pick<SpeechSynthesisVoice, "name" | "lang" | "voiceURI">;

function langOf(voice: Voice): string {
  return voice.lang.replace("_", "-").toLowerCase();
}

function qualityRank(voice: Voice): number {
  const label = `${voice.name} ${voice.voiceURI}`;
  const tier = VOICE_QUALITY_TIERS.findIndex((pattern) => pattern.test(label));
  return tier === -1 ? VOICE_QUALITY_TIERS.length : tier;
}

export function bestEnglishVoice<T extends Voice>(voices: T[]): T | undefined {
  const british = voices.filter((voice) => langOf(voice) === BRITISH);
  const candidates = british.length > 0 ? british : voices.filter((voice) => langOf(voice).startsWith(ENGLISH));
  return [...candidates].sort((first, second) => qualityRank(first) - qualityRank(second))[0];
}

export function speak(text: string, slow = false): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = ENGLISH_LANG;
  utterance.rate = slow ? SLOW_RATE : NORMAL_RATE;
  const voice = bestEnglishVoice(window.speechSynthesis.getVoices());
  if (voice) utterance.voice = voice;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}
