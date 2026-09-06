export type DiscoveryStyle = 
  | 'familiar' 
  | 'explorer' 
  | 'balanced' 
  | 'niche_hunter';

export type SignalSource = 'declared' | 'inferred' | 'behavioral';

export interface TasteEntity {
  provider: string; // e.g. 'deezer', 'itunes'
  provider_id: string;
  name: string;
  cover_url?: string;
  source: SignalSource;
  confidence: number; // 0.0 to 1.0
  added_at: string;
}

export interface TasteProfile {
  id: string; // auth.uid()
  favorite_artists: TasteEntity[];
  favorite_genres: TasteEntity[];
  favorite_tracks: TasteEntity[];
  favorite_albums: TasteEntity[];
  disliked_artists: TasteEntity[];
  languages: string[];
  decades: string[];
  moods: string[];
  moments: string[];
  discovery_style: DiscoveryStyle | null;
  created_at: string;
  updated_at: string;
}
