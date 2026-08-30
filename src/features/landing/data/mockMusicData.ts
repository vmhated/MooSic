export interface MockTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  artwork: string;
  accent: string; // Hex color for subtle ambient backlight
  accentRgb: string;
  duration: string;
  genre: string;
  badge?: string;
  lyricsSnippet?: {
    time: string;
    text: string;
    highlight?: boolean;
  }[];
}

export const MOCK_HERO_TRACKS: MockTrack[] = [
  {
    id: 'track-1',
    title: 'Neon Orbit',
    artist: 'Aether Echo',
    album: 'Parallel Horizons',
    artwork: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    accent: '#8B5CF6', // MooSic Purple
    accentRgb: '139, 92, 246',
    duration: '3:42',
    genre: 'Electronic Ambient',
    badge: 'Hi-Res Lossless',
    lyricsSnippet: [
      { time: '0:14', text: 'Lost in the frequency of endless sound' },
      { time: '0:28', text: 'Where echoes meet the morning ground', highlight: true },
      { time: '0:42', text: 'Drifting further than we used to know' },
      { time: '0:56', text: 'Caught inside the infinite flow' },
    ],
  },
  {
    id: 'track-2',
    title: 'Midnight Resonance',
    artist: 'Kaelen Vance',
    album: 'Silent Signals',
    artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    accent: '#3B82F6', // Electric Indigo/Blue
    accentRgb: '59, 130, 246',
    duration: '4:15',
    genre: 'Neo-Soul / Synth',
    badge: 'Master Quality',
    lyricsSnippet: [
      { time: '1:02', text: 'Shadows dancing on the city wire' },
      { time: '1:18', text: 'Every heartbeat sparks another fire', highlight: true },
      { time: '1:34', text: 'We hold the rhythm till the daylight breaks' },
      { time: '1:50', text: 'No turning back from the steps we take' },
    ],
  },
  {
    id: 'track-3',
    title: 'Velvet Horizon',
    artist: 'Sora & The Tide',
    album: 'Cerulean Nights',
    artwork: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    accent: '#EC4899', // Vivid Magenta / Pink
    accentRgb: '236, 72, 153',
    duration: '3:18',
    genre: 'Dream Pop',
    badge: 'Spatial Audio',
    lyricsSnippet: [
      { time: '0:30', text: 'Soft whispers in the purple haze' },
      { time: '0:45', text: 'Guided by the melody of yesterday', highlight: true },
      { time: '1:00', text: 'We breathe in rhythm with the open sea' },
      { time: '1:15', text: 'Infinite voices learning to be free' },
    ],
  },
  {
    id: 'track-4',
    title: 'Solar Meridian',
    artist: 'Maison Luna',
    album: 'Equinox Chapters',
    artwork: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
    accent: '#F59E0B', // Warm Amber
    accentRgb: '245, 158, 11',
    duration: '4:52',
    genre: 'Cinematic Ambient',
    badge: 'Hi-Fi 24-Bit',
    lyricsSnippet: [
      { time: '0:50', text: 'Golden light across the desert plain' },
      { time: '1:12', text: 'Washing memories clean of all the pain', highlight: true },
      { time: '1:35', text: 'The sun aligns with what we came to find' },
      { time: '1:58', text: 'Leaving every shadow far behind' },
    ],
  },
  {
    id: 'track-5',
    title: 'Cascading Echoes',
    artist: 'Lyra Monolith',
    album: 'Deep Bloom',
    artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    accent: '#10B981', // Emerald Mint
    accentRgb: '16, 185, 129',
    duration: '3:58',
    genre: 'Organic House',
    badge: 'Ultra HD',
    lyricsSnippet: [
      { time: '0:22', text: 'Water falling through the canopy' },
      { time: '0:40', text: 'Finding peace inside the harmony', highlight: true },
      { time: '1:05', text: 'The pulse of nature starts to gently beat' },
      { time: '1:24', text: 'A sanctuary in the summer heat' },
    ],
  },
  {
    id: 'track-6',
    title: 'Obsidian Pulse',
    artist: 'Vektor 9',
    album: 'Dark Matter Waves',
    artwork: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
    accent: '#A855F7', // Deep Violet
    accentRgb: '168, 85, 247',
    duration: '4:06',
    genre: 'Deep Techno',
    badge: 'MooSic Master',
    lyricsSnippet: [
      { time: '1:10', text: 'Heavy sub-bass rolling through the dark' },
      { time: '1:30', text: 'Igniting energy with just a single spark', highlight: true },
      { time: '1:55', text: 'We resonate across the atmosphere' },
      { time: '2:15', text: 'The only truth is what we feel right here' },
    ],
  },
];
