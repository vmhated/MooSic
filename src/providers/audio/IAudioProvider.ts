/**
 * Interface para Provedores de Stream de Áudio
 */
export interface IAudioStream {
  url: string;
  format: 'mp3' | 'aac' | 'flac' | 'ogg';
  bitrate?: number;
  expiresAt?: number;
}

export interface IAudioProvider {
  readonly id: string;
  readonly name: string;

  getAudioStreamUrl(trackId: string): Promise<IAudioStream | null>;
}
