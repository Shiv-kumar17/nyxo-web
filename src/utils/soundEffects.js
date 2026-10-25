// Synthetic Web Audio API Sound Effects (Zero external assets needed)
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle(state) {
    this.enabled = typeof state === 'boolean' ? state : !this.enabled;
    if (this.enabled) this.init();
    return this.enabled;
  }

  playBeep(freq = 600, duration = 0.05, type = 'sine') {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (_) {}
  }

  playLock() {
    if (!this.enabled || !this.ctx) return;
    this.playBeep(880, 0.04, 'triangle');
    setTimeout(() => this.playBeep(1320, 0.06, 'triangle'), 35);
  }

  playSuccess() {
    if (!this.enabled || !this.ctx) return;
    this.playBeep(523.25, 0.08, 'sine');
    setTimeout(() => this.playBeep(659.25, 0.08, 'sine'), 60);
    setTimeout(() => this.playBeep(783.99, 0.12, 'sine'), 120);
    setTimeout(() => this.playBeep(1046.50, 0.25, 'sine'), 180);
  }

  playLaunch() {
    if (!this.enabled || !this.ctx) return;
    this.playBeep(220, 0.1, 'sawtooth');
    setTimeout(() => this.playBeep(440, 0.15, 'sine'), 80);
    setTimeout(() => this.playBeep(880, 0.2, 'sine'), 160);
  }
}

export const sound = new SoundFX();
