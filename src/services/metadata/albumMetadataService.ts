import { AUTHENTIC_ALBUMS, AuthenticAlbumInfo, AUTHENTIC_ARTISTS } from './authenticCatalogRegistry';

export interface AlbumMetadata {
  id: string;
  title: string;
  artistName: string;
  coverUrl: string;
  releaseYear: number;
  label: string;
  genre: string;
  totalTracks: number;
  hiResBadge: string;
  isCustom?: boolean;
  updatedAt: number;
}

export const STORAGE_KEY = 'moosic_album_metadata_cache_v6';
export const DEFAULT_NEUTRAL_COVER = 'https://cdn-images.dzcdn.net/images/cover/9ad06bcb9f0bfe52bbd5e6ff464e4ca4/1000x1000-000000-80-0-0.jpg';

function normalizeString(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

export class AlbumMetadataService {
  private memoryCache: Map<string, AlbumMetadata> = new Map();
  private initialized = false;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined' || this.initialized) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed === 'object' && parsed !== null) {
          Object.entries(parsed).forEach(([key, val]) => {
            this.memoryCache.set(key, val as AlbumMetadata);
          });
        }
      }
    } catch {
      // Storage safe
    } finally {
      this.initialized = true;
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const obj: Record<string, AlbumMetadata> = {};
      this.memoryCache.forEach((v, k) => {
        obj[k] = v;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    } catch {
      // Storage safe
    }
  }

  public findInCuratedRegistry(query: string, artistQuery?: string): AuthenticAlbumInfo | null {
    const normTitle = normalizeString(query);
    const normArtist = artistQuery ? normalizeString(artistQuery) : '';
    if (!normTitle) return null;

    // 1. Busca por chave direta ou normalizada
    for (const [key, album] of Object.entries(AUTHENTIC_ALBUMS)) {
      if (normalizeString(key) === normTitle) {
        return album;
      }
    }

    // 2. Busca por título e artista
    for (const album of Object.values(AUTHENTIC_ALBUMS)) {
      const matchTitle = normalizeString(album.title);
      const matchArtist = normalizeString(album.artistName);

      const titleMatches =
        matchTitle === normTitle ||
        matchTitle.includes(normTitle) ||
        normTitle.includes(matchTitle);

      const artistMatches =
        !normArtist ||
        matchArtist.includes(normArtist) ||
        normArtist.includes(matchArtist);

      if (titleMatches && artistMatches) {
        return album;
      }

      for (const alt of album.normalizedTitles) {
        const normAlt = normalizeString(alt);
        if (normAlt === normTitle || normAlt.includes(normTitle) || normTitle.includes(normAlt)) {
          return album;
        }
      }
    }

    // 3. Se não achou álbum direto, mas o título coincide com o nome de um artista do registro (ex: "Matuê" ou "BK"), retorna o álbum principal
    for (const artist of Object.values(AUTHENTIC_ARTISTS)) {
      const matchArtist = normalizeString(artist.name);
      if (matchArtist === normTitle || normTitle.includes(matchArtist)) {
        // Encontra o primeiro álbum curado deste artista
        const album = Object.values(AUTHENTIC_ALBUMS).find(
          (a) => normalizeString(a.artistName) === matchArtist
        );
        if (album) return album;
      }
    }

    return null;
  }

  private async fetchITunesAlbum(title: string, artist?: string): Promise<Partial<AlbumMetadata> | null> {
    const query = artist ? `${title} ${artist}` : title;
    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=album&limit=1`
      );
      if (!res.ok) return null;
      const data = await res.json();
      if (data && data.results && data.results.length > 0) {
        const item = data.results[0];
        let coverUrl = item.artworkUrl100 || '';
        if (coverUrl.includes('100x100bb')) {
          coverUrl = coverUrl.replace('100x100bb', '1000x1000bb');
        } else if (coverUrl.includes('60x60bb')) {
          coverUrl = coverUrl.replace('60x60bb', '1000x1000bb');
        }
        const releaseYear = item.releaseDate ? new Date(item.releaseDate).getFullYear() : 2024;
        return {
          id: `itunes-album-${item.collectionId}`,
          title: item.collectionName || title,
          artistName: item.artistName || artist || 'Artista',
          coverUrl: coverUrl || undefined,
          releaseYear,
          label: item.copyright || 'Gravadora Oficial',
          genre: item.primaryGenreName || 'Áudio Master',
          totalTracks: item.trackCount || 10,
          hiResBadge: 'Apple Digital Master 24b',
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  public async getAlbumMetadata(
    albumTitle: string,
    artistName?: string,
    fallbackCover?: string
  ): Promise<AlbumMetadata> {
    this.loadFromStorage();
    const cacheKey = normalizeString(`${albumTitle}-${artistName || ''}`);

    const cached = this.memoryCache.get(cacheKey);
    if (cached && cached.isCustom) {
      return cached;
    }

    const curated = this.findInCuratedRegistry(albumTitle, artistName);
    if (curated) {
      const meta: AlbumMetadata = {
        id: curated.id,
        title: curated.title,
        artistName: curated.artistName,
        coverUrl: curated.coverUrl,
        releaseYear: curated.releaseYear,
        label: curated.label,
        genre: curated.genre,
        totalTracks: curated.totalTracks,
        hiResBadge: curated.hiResBadge,
        isCustom: false,
        updatedAt: Date.now(),
      };
      this.memoryCache.set(cacheKey, meta);
      this.saveToStorage();
      return meta;
    }

    if (cached) {
      return cached;
    }

    try {
      const dynamicAlbum = await this.fetchITunesAlbum(albumTitle, artistName);
      if (dynamicAlbum && dynamicAlbum.coverUrl) {
        const meta: AlbumMetadata = {
          id: dynamicAlbum.id || `album-${cacheKey}`,
          title: dynamicAlbum.title || albumTitle,
          artistName: dynamicAlbum.artistName || artistName || 'Artista',
          coverUrl: dynamicAlbum.coverUrl,
          releaseYear: dynamicAlbum.releaseYear || 2024,
          label: dynamicAlbum.label || 'Produção Independente',
          genre: dynamicAlbum.genre || 'Estúdio',
          totalTracks: dynamicAlbum.totalTracks || 10,
          hiResBadge: dynamicAlbum.hiResBadge || 'Master 24b / 48kHz',
          isCustom: false,
          updatedAt: Date.now(),
        };
        this.memoryCache.set(cacheKey, meta);
        this.saveToStorage();
        return meta;
      }
    } catch {
      // Ignora erro externo
    }

    const fallbackImage = fallbackCover || DEFAULT_NEUTRAL_COVER;
    const fallbackMeta: AlbumMetadata = {
      id: `album-${cacheKey || 'generic'}`,
      title: albumTitle,
      artistName: artistName || 'Artista MooSic',
      coverUrl: fallbackImage,
      releaseYear: 2024,
      label: 'MooSic Master Series',
      genre: 'Hi-Fi Audio',
      totalTracks: 10,
      hiResBadge: 'Hi-Res Lossless',
      isCustom: false,
      updatedAt: Date.now(),
    };

    this.memoryCache.set(cacheKey, fallbackMeta);
    this.saveToStorage();
    return fallbackMeta;
  }

  public updateAlbumMetadata(
    albumTitle: string,
    artistName: string,
    patch: Partial<AlbumMetadata>
  ): AlbumMetadata {
    this.loadFromStorage();
    const cacheKey = normalizeString(`${albumTitle}-${artistName || ''}`);
    const current = this.memoryCache.get(cacheKey) || {
      id: `album-${cacheKey}`,
      title: albumTitle,
      artistName: artistName || 'Artista',
      coverUrl: '',
      releaseYear: 2024,
      label: 'Gravadora',
      genre: 'Música',
      totalTracks: 10,
      hiResBadge: 'Hi-Res',
      isCustom: true,
      updatedAt: Date.now(),
    };

    const updated: AlbumMetadata = {
      ...current,
      ...patch,
      isCustom: true,
      updatedAt: Date.now(),
    };

    this.memoryCache.set(cacheKey, updated);
    this.saveToStorage();
    return updated;
  }
}

export const albumMetadataService = new AlbumMetadataService();
