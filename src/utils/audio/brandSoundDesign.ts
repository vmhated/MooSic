/**
 * Motor de Sound Design Imersivo para a Abertura MooSic com Indicador de Infinito.
 * 1. Entrada de "MooSic" (Ambient Pad Entry)
 * 2. Fusão no Infinito / Início do carregamento (Harmonic Chime & Continuous Resonance)
 * 3. Conclusão do carregamento e abertura da plataforma (Clean Resolution Chime)
 */

class BrandSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted = false;

  public init(): boolean {
    if (typeof window === 'undefined') return false;

    try {
      if (!this.ctx) {
        const AudioCtxClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtxClass) {
          this.ctx = new AudioCtxClass();
        }
      }

      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      return !!this.ctx;
    } catch {
      return false;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * 1. Entrada de "MooSic"
   */
  public playNameEntrySound() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const freqs = [196, 293.66, 392, 587.33];

      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        const volume = idx === 0 ? 0.18 : 0.06;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(volume, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 1.85);
      });
    } catch {
      // Ignora silenciosamente
    }
  }

  /**
   * 2. Fusão no Infinito & Início do Carregamento
   */
  public playInfinityLoadingSound() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const freqs = [220, 277.18, 329.63, 440, 659.25];

      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.01, now + 2.0);

        const volume = 0.08 / (idx + 1);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(volume, now + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 2.05);
      });
    } catch {
      // Ignora silenciosamente
    }
  }

  /**
   * 3. Conclusão e Abertura da Plataforma
   */
  public playPlatformRevealSound() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const freqs = [261.63, 329.63, 392, 523.25, 659.25, 783.99];

      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        const peakVol = 0.08 / (idx + 1);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(peakVol, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 2.25);
      });
    } catch {
      // Ignora silenciosamente
    }
  }
}

export const brandSound = new BrandSoundEngine();
