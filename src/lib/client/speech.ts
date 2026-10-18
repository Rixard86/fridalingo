const ENGLISH_LANG = "en-GB";
const NORMAL_RATE = 0.9;
const SLOW_RATE = 0.5;

function englishVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  return voices.find((voice) => voice.lang === ENGLISH_LANG) ?? voices.find((voice) => voice.lang.startsWith("en"));
}

export function speak(text: string, slow = false): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = ENGLISH_LANG;
  utterance.rate = slow ? SLOW_RATE : NORMAL_RATE;
  const voice = englishVoice();
  if (voice) utterance.voice = voice;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}
