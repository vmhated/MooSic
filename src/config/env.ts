export const env = {
  appName: import.meta.env.VITE_APP_NAME || 'MooSic',
  appEnv: import.meta.env.VITE_APP_ENV || 'development',
  musicProvider: import.meta.env.VITE_MUSIC_PROVIDER || 'mock',
  metadataProvider: import.meta.env.VITE_METADATA_PROVIDER || 'mock',
  lyricsProvider: import.meta.env.VITE_LYRICS_PROVIDER || 'mock',
  audioProvider: import.meta.env.VITE_AUDIO_PROVIDER || 'mock',
  musicBrainzUrl: import.meta.env.VITE_MUSICBRAINZ_API_URL || 'https://musicbrainz.org/ws/2',
};
