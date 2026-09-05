/**
 * Motor de Síntese Sonora Web Audio em Tempo Real para o MooSic Resonator.
 * Permite mesclar frequências harmônicas (432Hz, 528Hz, Binaural Alpha 10Hz, Brown Noise)
 * diretamente com a reprodução musical sem latência.
 */

export type ResonatorPresetId = '432hz' | '528hz' | 'alpha10hz' | 'brown-noise';

class BinauralResonatorService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: { stop: () => void }[] = [];

  private isRunning = false;
  private activePreset: ResonatorPresetId = '432hz';
  private volume = 0.25; // Nível ideal para mesclar com música sem ofuscar

  private listeners: Set<(state: { isRunning: boolean; preset: ResonatorPresetId; volume: number }) => void> = new Set();

  private initCtx(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      if (this.ctx && !this.masterGain) {
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
      return !!this.ctx && !!this.masterGain;
    } catch {
      return false;
    }
  }

  public subscribe(fn: (state: { isRunning: boolean; preset: ResonatorPresetId; volume: number }) => void) {
    this.listeners.add(fn);
    fn({ isRunning: this.isRunning, preset: this.activePreset, volume: this.volume });
    return () => {
      this.listeners.delete(fn);
    };
  }

  private notify() {
    this.listeners.forEach((fn) =>
      fn({ isRunning: this.isRunning, preset: this.activePreset, volume: this.volume })
    );
  }

  public start(preset?: ResonatorPresetId) {
    if (preset) this.activePreset = preset;
    if (!this.initCtx() || !this.ctx || !this.masterGain) return;

    this.stopNodes();

    if (this.activePreset === '432hz') {
      this.startSine(432);
    } else if (this.activePreset === '528hz') {
      this.startSine(528);
    } else if (this.activePreset === 'alpha10hz') {
      this.startBinaural(200, 210); // 10Hz de batimento binaural estéreo
    } else if (this.activePreset === 'brown-noise') {
      this.startBrownNoise();
    }

    this.isRunning = true;
    this.notify();
  }

  public stop() {
    this.stopNodes();
    this.isRunning = false;
    this.notify();
  }

  public toggle(preset?: ResonatorPresetId) {
    if (this.isRunning && (!preset || preset === this.activePreset)) {
      this.stop();
    } else {
      this.start(preset || this.activePreset);
    }
  }

  public setPreset(preset: ResonatorPresetId) {
    this.activePreset = preset;
    if (this.isRunning) {
      this.start(preset);
    } else {
      this.notify();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
    this.notify();
  }

  public getState() {
    return {
      isRunning: this.isRunning,
      preset: this.activePreset,
      volume: this.volume,
    };
  }

  private stopNodes() {
    this.activeNodes.forEach((node) => {
      try {
        node.stop();
      } catch {
        // Ignora
      }
    });
    this.activeNodes = [];
  }

  private startSine(freq: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Filtro passa-baixa suave para aveludar o som harmônico
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 1.5, this.ctx.currentTime);

    // Fade-in suave de 200ms
    gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.35, this.ctx.currentTime + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start();

    this.activeNodes.push({
      stop: () => {
        if (!this.ctx) return;
        gain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.1);
        setTimeout(() => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {
            // Ignora
          }
        }, 150);
      },
    });
  }

  private startBinaural(freqL: number, freqR: number) {
    if (!this.ctx || !this.masterGain) return;

    // Split stereo channels
    const merger = this.ctx.createChannelMerger(2);

    const oscL = this.ctx.createOscillator();
    const oscR = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    oscL.type = 'sine';
    oscL.frequency.setValueAtTime(freqL, this.ctx.currentTime);

    oscR.type = 'sine';
    oscR.frequency.setValueAtTime(freqR, this.ctx.currentTime);

    oscL.connect(merger, 0, 0); // Canal Esquerdo
    oscR.connect(merger, 0, 1); // Canal Direito

    gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.35, this.ctx.currentTime + 0.3);

    merger.connect(gain);
    gain.connect(this.masterGain);

    oscL.start();
    oscR.start();

    this.activeNodes.push({
      stop: () => {
        if (!this.ctx) return;
        gain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.1);
        setTimeout(() => {
          try {
            oscL.stop();
            oscR.stop();
            oscL.disconnect();
            oscR.disconnect();
          } catch {
            // Ignora
          }
        }, 150);
      },
    });
  }

  private startBrownNoise() {
    if (!this.ctx || !this.masterGain) return;

    // Gera buffer de 4 segundos em loop de ruído browniano
    const bufferSize = this.ctx.sampleRate * 4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Ganho de compensação
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.4, this.ctx.currentTime + 0.3);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start();

    this.activeNodes.push({
      stop: () => {
        if (!this.ctx) return;
        gain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.1);
        setTimeout(() => {
          try {
            whiteNoise.stop();
            whiteNoise.disconnect();
          } catch {
            // Ignora
          }
        }, 150);
      },
    });
  }
}

export const binauralResonator = new BinauralResonatorService();
