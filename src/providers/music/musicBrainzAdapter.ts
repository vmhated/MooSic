import { Track, SearchResults } from '@/types/domain/music';

// Curated high-resolution musical artworks
const HIGH_RES_COVERS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1445985543470-41fdd6ce388d?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1000&q=85',
];

const ACCENT_PALETTES = [
  { accent: '#8B5CF6', rgb: '139, 92, 246', genre: 'Hi-Res Lossless' },
  { accent: '#3B82F6', rgb: '59, 130, 246', genre: 'Master Audio' },
  { accent: '#EC4899', rgb: '236, 72, 153', genre: 'Spatial Sound' },
  { accent: '#10B981', rgb: '16, 185, 129', genre: 'Ultra HD' },
  { accent: '#F59E0B', rgb: '245, 158, 11', genre: 'Direct DAC' },
  { accent: '#A855F7', rgb: '168, 85, 247', genre: 'Studio Master' },
];

// Top iconic tracks catalog for instant hit resolution
const FAMOUS_ARTIST_HITS: Record<string, Array<{ title: string; album: string; genre: string; lyrics: string[] }>> = {
  queen: [
    {
      title: 'Bohemian Rhapsody',
      album: 'A Night at the Opera',
      genre: 'Classic Rock / Progressive',
      lyrics: [
        'Is this the real life? Is this just fantasy?',
        'Caught in a landslide, no escape from reality',
        'Open your eyes, look up to the skies and see',
        "Because I'm easy come, easy go, little high, little low",
      ],
    },
    {
      title: "Don't Stop Me Now",
      album: 'Jazz',
      genre: 'Glam Rock / Pop Rock',
      lyrics: [
        "Tonight I'm gonna have myself a real good time",
        'I feel alive and the world, I’ll turn it inside out, yeah',
        "I'm floating around in ecstasy, so don't stop me now",
        "'Cause I'm having a good time, having a good time",
      ],
    },
    {
      title: 'Another One Bites the Dust',
      album: 'The Game',
      genre: 'Funk Rock',
      lyrics: [
        'Steve walks warily down the street with the brim pulled way down low',
        'Ain’t no sound but the sound of his feet, machine guns ready to go',
        'Another one bites the dust, and another one gone',
        'Another one bites the dust, yeah!',
      ],
    },
    {
      title: 'Under Pressure',
      album: 'Hot Space',
      genre: 'Rock / Art Rock',
      lyrics: [
        'Pressure pushing down on me, pressing down on you',
        "Under pressure that burns a building down, splits a family in two",
        "It's the terror of knowing what this world is about",
        'Watching some good friends screaming: Let me out!',
      ],
    },
    {
      title: 'We Will Rock You',
      album: 'News of the World',
      genre: 'Arena Rock',
      lyrics: [
        'Buddy, you’re a boy, make a big noise playing in the street',
        'Gonna be a big man someday, you got mud on your face',
        'We will, we will rock you!',
        'Sing it: We will, we will rock you!',
      ],
    },
  ],
  'daft punk': [
    {
      title: 'Get Lucky',
      album: 'Random Access Memories',
      genre: 'Disco Funk / Electronic',
      lyrics: [
        'Like the legend of the phoenix, all ends with beginnings',
        'What keeps the planet spinning, the force from the beginning',
        "We've come too far to give up who we are",
        "So let's raise the bar and our cups to the stars",
      ],
    },
    {
      title: 'Harder, Better, Faster, Stronger',
      album: 'Discovery',
      genre: 'French House / Synth',
      lyrics: [
        'Work it, make it, do it, makes us',
        'Harder, better, faster, stronger',
        'More than ever, hour after, our work is never over',
        'Work it harder, make it better, do it faster, makes us stronger',
      ],
    },
    {
      title: 'One More Time',
      album: 'Discovery',
      genre: 'Electronic / Dance',
      lyrics: [
        "One more time, we're gonna celebrate",
        'Oh yeah, alright, somebody dance with me',
        'Music’s got me feeling so free, we’re gonna celebrate',
        "One more time, music’s got me feeling so free",
      ],
    },
    {
      title: 'Around the World',
      album: 'Homework',
      genre: 'House / Classic Electronic',
      lyrics: [
        'Around the world, around the world',
        'Around the world, around the world',
        'Around the world, around the world',
        'The bassline pulsates into the night',
      ],
    },
  ],
  'the weeknd': [
    {
      title: 'Blinding Lights',
      album: 'After Hours',
      genre: 'Synthwave / R&B Pop',
      lyrics: [
        "I've been on my own for long enough",
        'Maybe you can show me how to love, maybe',
        "I'm running out of time, 'cause I can see the sun light up the sky",
        "I said, ooh, I'm blinded by the lights",
      ],
    },
    {
      title: 'Starboy',
      album: 'Starboy',
      genre: 'Electro-R&B',
      lyrics: [
        "I'm tryna put you in the worst mood, ah",
        'P1 cleaner than your church shoes, ah',
        'Look what you’ve done, I’m a motherfucking starboy',
        'Every day a star is born, clap if you feel me',
      ],
    },
    {
      title: 'Save Your Tears',
      album: 'After Hours',
      genre: 'Synth-Pop',
      lyrics: [
        'I saw you dancing in a crowded room',
        'You look so happy when I’m not with you',
        'Save your tears for another day',
        'Girl, I’ll make you cry when I run away',
      ],
    },
  ],
  'billie eilish': [
    {
      title: 'Bad Guy',
      album: 'When We All Fall Asleep, Where Do We Go?',
      genre: 'Electropop / Alt-Pop',
      lyrics: [
        'White shirt now red, my bloody nose',
        "Sleepin', you're on your tippy toes",
        'Creepin’ around like no one knows',
        "So you're a tough guy, like it really rough guy",
      ],
    },
    {
      title: 'Birds of a Feather',
      album: 'Hit Me Hard and Soft',
      genre: 'Indie Pop / Dream Pop',
      lyrics: [
        "I want you to stay 'til I'm in the grave",
        "'Til I'm rotting away, dead and buried",
        "'Til I'm in the casket you carry",
        'If you go, I’m going too, birds of a feather',
      ],
    },
    {
      title: 'Ocean Eyes',
      album: "Don't Smile at Me",
      genre: 'Dream Pop / Ballad',
      lyrics: [
        'I’ve been watching you for some time',
        "Can't stop staring at those ocean eyes",
        'Burning cities and napalm skies',
        'Fifteen minutes of dreaming inside your eyes',
      ],
    },
  ],
  coldplay: [
    {
      title: 'Viva La Vida',
      album: 'Viva la Vida or Death and All His Friends',
      genre: 'Baroque Pop / Symphonic Rock',
      lyrics: [
        'I used to rule the world, seas would rise when I gave the word',
        'Now in the morning I sleep alone, sweep the streets I used to own',
        'I hear Jerusalem bells a-ringing, Roman Cavalry choirs are singing',
        'Be my mirror, my sword and shield, my missionaries in a foreign field',
      ],
    },
    {
      title: 'Yellow',
      album: 'Parachutes',
      genre: 'Post-Britpop / Alternative',
      lyrics: [
        'Look at the stars, look how they shine for you',
        'And everything you do, yeah they were all yellow',
        'I came along, I wrote a song for you',
        'And all the things you do, and it was called Yellow',
      ],
    },
    {
      title: 'The Scientist',
      album: 'A Rush of Blood to the Head',
      genre: 'Piano Rock / Ballad',
      lyrics: [
        'Come up to meet you, tell you I’m sorry',
        'You don’t know how lovely you are',
        'I had to find you, tell you I need you',
        'Tell you I set you apart',
      ],
    },
  ],
};

function getStableHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function formatDuration(ms?: number): string {
  if (!ms || ms <= 0) return '3:45';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export class MusicBrainzAdapter {
  /**
   * Converte uma gravação bruta do MusicBrainz em entidade de domínio Track
   */
  static toDomainTrack(raw: any, index = 0): Track {
    const artistCredit = raw['artist-credit']?.[0];
    const artistName = artistCredit?.name || artistCredit?.artist?.name || 'Artista Desconhecido';
    const artistId = artistCredit?.artist?.id || `mb-artist-${raw.id}`;

    const release = raw.releases?.[0];
    const albumTitle = release?.title || 'Studio Album';
    const albumId = release?.id || `mb-release-${raw.id}`;

    const title = raw.title || 'Faixa sem título';
    const hash = getStableHash(`${title}-${artistName}`);
    const coverUrl = HIGH_RES_COVERS[hash % HIGH_RES_COVERS.length];
    const palette = ACCENT_PALETTES[(index + hash) % ACCENT_PALETTES.length];
    const durationSeconds = raw.length ? Math.floor(raw.length / 1000) : 210;

    return {
      id: raw.id,
      title,
      artistId,
      artistName,
      albumId,
      albumTitle,
      coverUrl,
      durationSeconds,
      durationFormatted: formatDuration(raw.length),
      genre: raw.tags?.[0]?.name || palette.genre,
      accent: palette.accent,
      accentRgb: palette.rgb,
      badge: 'MusicBrainz Verified',
      lyricsSnippet: undefined,
      isExplicit: Boolean(raw.disambiguation?.toLowerCase().includes('explicit')),
      providerId: 'musicbrainz',
      providerTrackId: raw.id,
    };
  }

  /**
   * Converte gravações com desduplicação inteligente e priorização de sucessos reais
   */
  static toDomainSearchResults(recordings: any[], query?: string): SearchResults {
    const cleanQuery = (query || '').toLowerCase().trim();

    // 1. Se a busca bater com artistas icônicos, adicionamos os sucessos oficiais no topo
    let curatedHits: Track[] = [];
    for (const [artistKey, hits] of Object.entries(FAMOUS_ARTIST_HITS)) {
      if (cleanQuery.includes(artistKey) || artistKey.includes(cleanQuery)) {
        const formattedArtist = artistKey
          .split(' ')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');

        curatedHits = hits.map((hit, idx) => {
          const hash = getStableHash(`${hit.title}-${formattedArtist}`);
          const palette = ACCENT_PALETTES[(idx + hash) % ACCENT_PALETTES.length];
          return {
            id: `curated-${artistKey}-${idx}`,
            title: hit.title,
            artistId: `mb-artist-${artistKey}`,
            artistName: formattedArtist,
            albumId: `mb-album-${artistKey}-${idx}`,
            albumTitle: hit.album,
            coverUrl: HIGH_RES_COVERS[hash % HIGH_RES_COVERS.length],
            durationSeconds: 230,
            durationFormatted: '3:50',
            genre: hit.genre,
            accent: palette.accent,
            accentRgb: palette.rgb,
            badge: 'MooSic Master',
            lyricsSnippet: hit.lyrics.map((text, i) => ({
              time: `0:${15 + i * 18}`,
              text,
              highlight: i === 1,
            })),
            isExplicit: false,
            providerId: 'musicbrainz',
            providerTrackId: `curated-${artistKey}-${idx}`,
          };
        });
        break;
      }
    }

    // 2. Desduplicação de gravações da API do MusicBrainz (remove títulos repetidos)
    const seenTitles = new Set<string>();
    curatedHits.forEach((t) => seenTitles.add(t.title.toLowerCase().trim()));

    const uniqueApiTracks: Track[] = [];
    for (let i = 0; i < recordings.length; i++) {
      const raw = recordings[i];
      const titleKey = (raw.title || '').toLowerCase().trim();

      // Ignora títulos duplicados ou vazios
      if (!titleKey || seenTitles.has(titleKey)) continue;
      seenTitles.add(titleKey);

      uniqueApiTracks.push(MusicBrainzAdapter.toDomainTrack(raw, uniqueApiTracks.length));
      if (uniqueApiTracks.length >= 10) break;
    }

    const merged = [...curatedHits, ...uniqueApiTracks];

    return {
      tracks: merged,
      artists: [],
      albums: [],
      playlists: [],
    };
  }
}
