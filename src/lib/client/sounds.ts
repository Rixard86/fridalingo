const NOTE_F3 = 174.61;
const NOTE_A3 = 220;
const NOTE_C5 = 523.25;
const NOTE_E5 = 659.25;
const NOTE_G5 = 783.99;
const NOTE_C6 = 1046.5;

const VOLUME = 0.18;
const SILENT = 0.0001;
const NOTE_LENGTH_SECONDS = 0.16;
const NOTE_GAP_SECONDS = 0.1;
const MUTE_KEY = "fridalingo-muted";

let audioContext: AudioContext | null = null;

interface ToneTiming {
  delay: number;
  wave: OscillatorType;
}

export function isMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setMuted(muted: boolean): void {
  try {
    localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
  } catch {}
}

function context(): AudioContext | null {
  if (typeof window === "undefined" || isMuted()) return null;
  audioContext ??= new AudioContext();
  return audioContext;
}

function tone(frequency: number, timing: ToneTiming): void {
  const audio = context();
  if (!audio) return;
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  const start = audio.currentTime + timing.delay;
  oscillator.type = timing.wave;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(VOLUME, start);
  gain.gain.exponentialRampToValueAtTime(SILENT, start + NOTE_LENGTH_SECONDS);
  oscillator.connect(gain).connect(audio.destination);
  oscillator.start(start);
  oscillator.stop(start + NOTE_LENGTH_SECONDS);
}

function melody(notes: number[], wave: OscillatorType): void {
  notes.forEach((note, index) => tone(note, { delay: index * NOTE_GAP_SECONDS, wave }));
}

export function playCorrect(): void {
  melody([NOTE_E5, NOTE_C6], "sine");
}

export function playWrong(): void {
  melody([NOTE_A3, NOTE_F3], "triangle");
}

export function playPop(): void {
  melody([NOTE_G5], "sine");
}

export function playFanfare(): void {
  melody([NOTE_C5, NOTE_E5, NOTE_G5, NOTE_C6, NOTE_G5, NOTE_C6], "triangle");
}
