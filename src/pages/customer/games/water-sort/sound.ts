// Lightweight, dependency-free sound effects synthesized with the Web Audio
// API — no audio files to ship. Nothing plays until a real user gesture
// triggers a game action (tap/click), so this never fights autoplay policies.

type SfxName = 'select' | 'pour' | 'invalid' | 'win' | 'click';

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return null;
  if (!ctx) ctx = new AudioCtor();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq: number, duration: number, startOffset = 0, type: OscillatorType = 'sine', peakGain = 0.08) {
  const audio = getContext();
  if (!audio) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const start = audio.currentTime + startOffset;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(peakGain, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

const players: Record<SfxName, () => void> = {
  select: () => tone(520, 0.09, 0, 'sine', 0.06),
  click: () => tone(440, 0.06, 0, 'sine', 0.05),
  invalid: () => {
    tone(180, 0.12, 0, 'sawtooth', 0.05);
    tone(140, 0.14, 0.05, 'sawtooth', 0.04);
  },
  pour: () => {
    tone(660, 0.08, 0, 'sine', 0.05);
    tone(880, 0.1, 0.06, 'sine', 0.04);
  },
  win: () => {
    [523, 659, 784, 1047].forEach((freq, i) => tone(freq, 0.22, i * 0.09, 'triangle', 0.07));
  },
};

export function playSfx(name: SfxName, enabled: boolean): void {
  if (!enabled) return;
  try {
    players[name]();
  } catch {
    // audio unavailable — the game is fully playable without sound
  }
}
