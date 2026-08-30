/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_ENV?: string;
  readonly VITE_MUSIC_PROVIDER?: string;
  readonly VITE_METADATA_PROVIDER?: string;
  readonly VITE_LYRICS_PROVIDER?: string;
  readonly VITE_AUDIO_PROVIDER?: string;
  readonly VITE_MUSICBRAINZ_API_URL?: string;
  readonly VITE_JAMENDO_CLIENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
