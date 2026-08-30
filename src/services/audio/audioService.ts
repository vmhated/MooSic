import { IAudioProvider, IAudioStream } from '@/providers/audio/IAudioProvider';

/**
 * Service de Orquestração do Player de Áudio.
 * Gerencia a comunicação entre a UI/Store e os Provedores de Áudio.
 */
export class AudioService {
  private provider: IAudioProvider | null = null;

  constructor(provider?: IAudioProvider) {
    if (provider) {
      this.provider = provider;
    }
  }

  public setProvider(provider: IAudioProvider): void {
    this.provider = provider;
  }

  public async getStream(trackId: string): Promise<IAudioStream | null> {
    if (!this.provider) throw new Error('AudioProvider não inicializado.');
    return this.provider.getAudioStreamUrl(trackId);
  }
}

export const audioService = new AudioService();
