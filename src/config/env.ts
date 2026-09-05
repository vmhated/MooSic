const appVersion = '1.0.0';
const contactEmail = import.meta.env.VITE_MUSICBRAINZ_CONTACT_EMAIL || 'unconfigured-contact@moosic.local';

export const env = {
  appName: import.meta.env.VITE_APP_NAME || 'MooSic',
  appEnv: import.meta.env.VITE_APP_ENV || 'development',
  appVersion,
  musicProvider: import.meta.env.VITE_MUSIC_PROVIDER || 'hybrid',
  metadataProvider: import.meta.env.VITE_METADATA_PROVIDER || 'hybrid',
  lyricsProvider: import.meta.env.VITE_LYRICS_PROVIDER || 'lrclib',
  audioProvider: import.meta.env.VITE_AUDIO_PROVIDER || 'hybrid',
  musicBrainzUrl: import.meta.env.VITE_MUSICBRAINZ_API_URL || 'https://musicbrainz.org/ws/2',
  musicBrainzContactEmail: import.meta.env.VITE_MUSICBRAINZ_CONTACT_EMAIL || '',
  // Formato oficial exigido pelo MusicBrainz: MooSic/<version> ( <contact> )
  musicBrainzUserAgent: `MooSic/${appVersion} (${contactEmail})`,
};
