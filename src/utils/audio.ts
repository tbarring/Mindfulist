/**
 * Calm synthesized singing bowl and gentle bell sounds using standard Web Audio API.
 * Requires no external audio assets or network requests.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playZenChime(type: 'singing-bowl' | 'soft-chime' | 'bamboo-wood' | 'silent' = 'singing-bowl') {
  if (type === 'silent') return;

  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (type === 'singing-bowl') {
      // Warm, deep Tibetan singing bowl simulation
      const fundamental = 432; // A=432Hz natural frequency
      const harmonics = [1, 2.76, 5.4, 8.9];
      const gains = [0.4, 0.2, 0.08, 0.03];

      harmonics.forEach((h, index) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(fundamental * h, now);

        // Gentle strike with long soothing decay
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(gains[index], now + 0.04);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 3.0);
      });
    } else if (type === 'soft-chime') {
      // High, crystal-clear mindfulness bell
      const freqs = [880, 1320, 1760];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2 / (idx + 1), now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 2.0);
      });
    } else if (type === 'bamboo-wood') {
      // Soft organic wooden tap / resonant block
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.12);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch {
    // Graceful fallback if audio context is blocked
  }
}
