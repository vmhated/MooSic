/**
 * Grafo de Artistas Relacionados e Afinidades de Gênero do MooSic.
 * Permite que o MooSic Flow encontre continuidades musicais naturais,
 * conectando artistas da mesma cena, época e assinatura sonora.
 */

export interface ArtistAffinityProfile {
  name: string;
  genres: string[];
  relatedArtists: string[];
  discoveryGenres: string[];
}

export const ARTIST_AFFINITY_GRAPH: Record<string, ArtistAffinityProfile> = {
  // === R&B & FLOW CONTEMPORÂNEO ===
  'caio ocean': {
    name: 'Caio Ocean',
    genres: ['R&B Nacional', 'Neo Soul', 'Indie R&B', 'Trap R&B'],
    relatedArtists: ['Frank Ocean', 'Luccas Carlos', 'BK', 'Baco Exu do Blues', 'Djonga', 'KayBlack'],
    discoveryGenres: ['Soul Brasileiro', 'Lo-Fi Chill', 'Alternative R&B'],
  },
  'frank ocean': {
    name: 'Frank Ocean',
    genres: ['Alternative R&B', 'Neo Soul', 'Indie Pop'],
    relatedArtists: ['Caio Ocean', 'Tyler, The Creator', 'Steve Lacy', 'Daniel Caesar', 'Brent Faiyaz', 'SZA'],
    discoveryGenres: ['Neo-Psychedelia', 'Contemporary Soul'],
  },
  'luccas carlos': {
    name: 'Luccas Carlos',
    genres: ['R&B Nacional', 'Trap Soul', 'Pop Urbano'],
    relatedArtists: ['BK', 'Caio Ocean', 'Baco Exu do Blues', 'KayBlack', 'Gloria Groove', 'Pedro Lotto'],
    discoveryGenres: ['Neo Soul', 'Afrobeats Brasil'],
  },
  'brent faiyaz': {
    name: 'Brent Faiyaz',
    genres: ['R&B', 'Contemporary R&B', 'Soul'],
    relatedArtists: ['Frank Ocean', 'Daniel Caesar', 'Giveon', 'SZA', 'The Weeknd', 'Lucky Daye'],
    discoveryGenres: ['Neo Soul', 'Indie Soul'],
  },
  'sza': {
    name: 'SZA',
    genres: ['Contemporary R&B', 'Neo Soul', 'Pop'],
    relatedArtists: ['Frank Ocean', 'Summer Walker', 'Daniel Caesar', 'The Weeknd', 'Doja Cat', 'Kehlani'],
    discoveryGenres: ['Indie Pop', 'Alternative R&B'],
  },
  'the weeknd': {
    name: 'The Weeknd',
    genres: ['R&B', 'Synthpop', 'Pop', 'Dark Wave'],
    relatedArtists: ['Daft Punk', 'Dua Lipa', 'Bruno Mars', 'Post Malone', 'SZA', 'Kendrick Lamar'],
    discoveryGenres: ['Synthwave', 'Nu-Disco', '80s Electro Pop'],
  },

  // === RAP NACIONAL & TRAP BRASIL ===
  'matue': {
    name: 'Matuê',
    genres: ['Trap Brasil', 'Hip-Hop', 'Cloud Rap'],
    relatedArtists: ['Teto', 'WIU', 'KayBlack', 'Veigh', 'BK', 'Djonga', 'Filipe Ret', 'Orochi'],
    discoveryGenres: ['Boom Bap', 'Drill Brasil', 'Afro Trap'],
  },
  'teto': {
    name: 'Teto',
    genres: ['Trap Brasil', 'Melodic Trap'],
    relatedArtists: ['Matue', 'WIU', 'Veigh', 'KayBlack', 'Filipe Ret', 'Cabelinho'],
    discoveryGenres: ['Afrobeats Brasil', 'Pluggnb'],
  },
  'wiu': {
    name: 'WIU',
    genres: ['Trap Brasil', 'Pop Trap', 'Reggaeton'],
    relatedArtists: ['Matue', 'Teto', 'Veigh', 'L7NNON', 'KayBlack', 'Cabelinho'],
    discoveryGenres: ['Latin Pop', 'Afro-Pop'],
  },
  'veigh': {
    name: 'Veigh',
    genres: ['Trap Brasil', 'Trap Romântico', 'R&B Trap'],
    relatedArtists: ['KayBlack', 'Matue', 'Teto', 'WIU', 'Cabelinho', 'Vulgo FK'],
    discoveryGenres: ['R&B Nacional', 'Urban Pop'],
  },
  'bk': {
    name: "BK'",
    genres: ['Rap Nacional', 'Lírica Urbana', 'Boom Bap', 'Hip-Hop'],
    relatedArtists: ['Djonga', 'Filipe Ret', 'Luccas Carlos', 'Froid', 'Sabotage', 'Racionais MCs', 'Don L'],
    discoveryGenres: ['Jazz Rap', 'Neo Soul', 'Conscious Hip-Hop'],
  },
  'djonga': {
    name: 'Djonga',
    genres: ['Rap Nacional', 'Hip-Hop', 'Trap Lírico'],
    relatedArtists: ['BK', 'Filipe Ret', 'Froid', 'Criolo', 'Racionais MCs', 'Emicida', 'Baco Exu do Blues'],
    discoveryGenres: ['Afrobeat', 'Samba Rap', 'Boom Bap'],
  },
  'racionais mcs': {
    name: "Racionais MC's",
    genres: ['Rap Nacional', 'Hip-Hop Clássico', 'G-Funk Brasil'],
    relatedArtists: ['Sabotage', 'Facção Central', 'Criolo', 'Emicida', 'Djonga', 'BK', 'Dexter'],
    discoveryGenres: ['Soul 70s', 'Funk 70s', 'Boom Bap'],
  },
  'sabotage': {
    name: 'Sabotage',
    genres: ['Rap Nacional', 'Hip-Hop Clássico', 'Boom Bap'],
    relatedArtists: ['Racionais MCs', 'Criolo', 'Black Alien', 'RZO', 'BK', 'Djonga', 'Pavilhão 9'],
    discoveryGenres: ['Samba Clássico', 'Jazz Urbano'],
  },
  'criolo': {
    name: 'Criolo',
    genres: ['Rap Nacional', 'MPB', 'Samba', 'Afrobeat'],
    relatedArtists: ['Emicida', 'Racionais MCs', 'Sabotage', 'Baco Exu do Blues', 'Caetano Veloso', 'BaianaSystem'],
    discoveryGenres: ['Tropicália', 'Samba Raiz', 'Soul Brasil'],
  },
  'baco exu do blues': {
    name: 'Baco Exu do Blues',
    genres: ['Rap Nacional', 'Blues Urbano', 'R&B Brasil', 'MPB'],
    relatedArtists: ['BK', 'Djonga', 'Luccas Carlos', 'Criolo', 'Liniker', 'Marina Sena'],
    discoveryGenres: ['Blues Rock', 'Afro-Soul', 'Neo MPB'],
  },

  // === POP & GLOBAL HITS ===
  'dua lipa': {
    name: 'Dua Lipa',
    genres: ['Pop', 'Disco Pop', 'Dance Pop', 'Nu-Disco'],
    relatedArtists: ['The Weeknd', 'Calvin Harris', 'Miley Cyrus', 'Olivia Rodrigo', 'Lady Gaga', 'Charli XCX'],
    discoveryGenres: ['French House', '80s Electro Pop', 'Synthpop'],
  },
  'calvin harris': {
    name: 'Calvin Harris',
    genres: ['EDM', 'Dance Pop', 'Nu-Disco', 'House'],
    relatedArtists: ['Dua Lipa', 'David Guetta', 'The Weeknd', 'Avicii', 'Tiësto', 'Swedish House Mafia'],
    discoveryGenres: ['Electro House', 'Funk Wav'],
  },
  'daft punk': {
    name: 'Daft Punk',
    genres: ['French House', 'Electronic', 'Synthpop', 'Disco'],
    relatedArtists: ['The Weeknd', 'Justice', 'Pharrell Williams', 'Kavinsky', 'Gorillaz', 'Empire of the Sun'],
    discoveryGenres: ['Nu-Disco', 'Space Disco', 'Synthwave'],
  },

  // === LO-FI, FOCO & CHILLHOP ===
  'lofi girl': {
    name: 'Lofi Girl',
    genres: ['Lofi Chill', 'Study Beats', 'Chillhop', 'Ambient'],
    relatedArtists: ['ChilledCow', 'Kupla', 'Idealism', 'Jinsang', 'Tomppabeats', 'Nujabes'],
    discoveryGenres: ['Jazzhop', 'Ambient Electronic', 'Synthwave Relax'],
  },
  'nujabes': {
    name: 'Nujabes',
    genres: ['Jazzhop', 'Lofi Hip-Hop', 'Instrumental Hip-Hop'],
    relatedArtists: ['J Dilla', 'Lofi Girl', 'Idealism', 'Fat Jon', 'Shing02', 'Uyama Hiroto'],
    discoveryGenres: ['Modal Jazz', 'Chillhop'],
  },
};

/**
 * Normaliza o nome do artista para busca no grafo de afinidade
 */
export function normalizeArtistKey(name?: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Encontra perfil de afinidade para um artista ou retorna estimativa contextual
 */
export function getArtistAffinity(artistName: string): ArtistAffinityProfile | null {
  const key = normalizeArtistKey(artistName);
  
  // 1. Busca exata no grafo
  for (const [k, profile] of Object.entries(ARTIST_AFFINITY_GRAPH)) {
    if (normalizeArtistKey(k) === key) {
      return profile;
    }
  }

  // 2. Busca parcial (se o nome contém substring)
  for (const [k, profile] of Object.entries(ARTIST_AFFINITY_GRAPH)) {
    const normK = normalizeArtistKey(k);
    if (key.includes(normK) || normK.includes(key)) {
      return profile;
    }
  }

  return null;
}
