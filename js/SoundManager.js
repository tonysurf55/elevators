/**
 * SoundManager
 * Singleton that produces a short arrival sound via the Web Audio API.
 */
class SoundManager {
  /** @type {SoundManager} */
  static instance = null;

  /** @type {AudioContext|null} */
  ctx = null;

  constructor() {
    if (SoundManager.instance) return SoundManager.instance;
    SoundManager.instance = this;
  }

  /** Initialise AudioContext */
  getContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this.ctx;
  }

  /** Play a short two-tone arrival sound */
  playArrival() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      
      const notes = [880, 1109];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.13);

        gain.gain.setValueAtTime(0, now + i * 0.13);
        gain.gain.linearRampToValueAtTime(0.18, now + i * 0.13 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.13 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.13);
        osc.stop(now + i * 0.13 + 0.35);
      });
    } catch {
      // Silently fail if audio is not available
    }
  }
}