import { AUTHENTIC_ARTISTS, AuthenticArtistInfo } from './authenticCatalogRegistry';

export interface ArtistMetadata {
  id: string;
  name: string;
  avatarUrl: string;
  bannerUrl: string;
  genre: string;
  monthlyListeners: string;
  bio: string;
  origin: string;
  verified: boolean;
  topAlbums?: string[];
  isCustom?: boolean;
  updatedAt: number;
}

export const STORAGE_KEY = 'moosic_artist_metadata_cache_v6';
export const DEFAULT_NEUTRAL_COVER = 'https://cdn-images.dzcdn.net/images/cover/9ad06bcb9f0bfe52bbd5e6ff464e4ca4/1000x1000-000000-80-0-0.jpg';

function normalizeString(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

export class ArtistMetadataService {
  private memoryCache: Map<string, ArtistMetadata> = new Map();
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
            this.memoryCache.set(key, val as ArtistMetadata);
          });
        }
      }
    } catch {
      // Ignora erro no storage
    } finally {
      this.initialized = true;
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const obj: Record<string, ArtistMetadata> = {};
      this.memoryCache.forEach((v, k) => {
        obj[k] = v;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    } catch {
      // Storage safe
    }
  }

  public findInCuratedRegistry(query: string): AuthenticArtistInfo | null {
    const norm = normalizeString(query);
    if (!norm) return null;

    // 1. Busca por chave direta ou normalizada
    for (const [key, artist] of Object.entries(AUTHENTIC_ARTISTS)) {
      if (normalizeString(key) === norm) {
        return artist;
      }
    }

    // 2. Busca por nome do artista
    for (const artist of Object.values(AUTHENTIC_ARTISTS)) {
      const matchName = normalizeString(artist.name);
      if (matchName === norm || matchName.includes(norm) || norm.includes(matchName)) {
        return artist;
      }
      for (const alt of artist.normalizedNames) {
        const normAlt = normalizeString(alt);
        if (normAlt === norm || normAlt.includes(norm) || norm.includes(normAlt)) {
          return artist;
        }
      }
    }

    return null;
  }

  private async fetchITunesArtist(name: string): Promise<Partial<ArtistMetadata> | null> {
    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(name)}&entity=musicArtist&limit=1`
      );
      if (!res.ok) return null;
      const data = await res.json();
      if (data && data.results && data.results.length > 0) {
        const item = data.results[0];
        
        // Busca álbum principal do artista para obter arte 1000x1000bb
        const albumRes = await fetch(
          `https://itunes.apple.com/lookup?id=${item.artistId}&entity=album&limit=1`
        );
        if (albumRes.ok) {
          const albumData = await albumRes.json();
          const albumItem = albumData.results?.find((r: any) => r.wrapperType === 'collection');
          if (albumItem && albumItem.artworkUrl100) {
            let artwork = albumItem.artworkUrl100.replace('100x100bb', '1000x1000bb');
            return {
              id: `itunes-artist-${item.artistId}`,
              name: item.artistName || name,
              avatarUrl: artwork,
              bannerUrl: artwork,
              genre: item.primaryGenreName || 'Artista Oficial',
              monthlyListeners: 'Catálogo Apple Music',
            };
          }
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  private async fetchDeezerArtist(name: string): Promise<Partial<ArtistMetadata> | null> {
    if (typeof window === 'undefined') return null;

    return new Promise((resolve) => {
      const callbackName = `dz_art_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      const url = `https://api.deezer.com/search/artist?q=${encodeURIComponent(name)}&limit=1&output=jsonp&callback=${callbackName}`;

      const script = document.createElement('script');
      script.src = url;
      script.async = true;

      const timer = setTimeout(() => {
        cleanup();
        resolve(null);
      }, 2500);

      const cleanup = () => {
        clearTimeout(timer);
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        delete (window as any)[callbackName];
      };

      (window as any)[callbackName] = (data: any) => {
        cleanup();
        if (data && data.data && data.data.length > 0) {
          const item = data.data[0];
          const avatarUrl = item.picture_xl || item.picture_big || item.picture_medium || item.picture;
          resolve({
            id: `dz-artist-${item.id}`,
            name: item.name,
            avatarUrl: avatarUrl || undefined,
            bannerUrl: avatarUrl || undefined,
            monthlyListeners: item.nb_fan ? `${(item.nb_fan / 1000000).toFixed(1)}M fãs Deezer` : 'Em ascensão',
          });
        } else {
          resolve(null);
        }
      };

      script.onerror = () => {
        cleanup();
        resolve(null);
      };

      document.body.appendChild(script);
    });
  }

  public async getArtistMetadata(artistName: string, fallbackCover?: string): Promise<ArtistMetadata> {
    this.loadFromStorage();
    const norm = normalizeString(artistName);

    // Se houver personalização explícita do usuário salva, respeita ela
    const cached = this.memoryCache.get(norm);
    if (cached && cached.isCustom) {
      return cached;
    }

    // Prioriza sempre o catálogo autêntico curado oficial
    const curated = this.findInCuratedRegistry(artistName);
    if (curated) {
      const meta: ArtistMetadata = {
        id: curated.id,
        name: curated.name,
        avatarUrl: curated.avatarUrl,
        bannerUrl: curated.bannerUrl || curated.avatarUrl,
        genre: curated.genre,
        monthlyListeners: curated.monthlyListeners,
        bio: curated.bio,
        origin: curated.origin,
        verified: curated.verified,
        topAlbums: curated.topAlbums,
        isCustom: false,
        updatedAt: Date.now(),
      };
      this.memoryCache.set(norm, meta);
      this.saveToStorage();
      return meta;
    }

    // Se já estiver em cache válido e verificado
    if (cached && cached.verified) {
      return cached;
    }

    // Busca Dinâmica Apple Music & Deezer
    try {
      const [itunesArt, dynamicDz] = await Promise.allSettled([
        this.fetchITunesArtist(artistName),
        this.fetchDeezerArtist(artistName),
      ]);

      const art =
        (itunesArt.status === 'fulfilled' && itunesArt.value) ||
        (dynamicDz.status === 'fulfilled' && dynamicDz.value);

      if (art && art.avatarUrl) {
        const meta: ArtistMetadata = {
          id: art.id || `artist-${norm}`,
          name: art.name || artistName,
          avatarUrl: art.avatarUrl,
          bannerUrl: art.bannerUrl || art.avatarUrl,
          genre: art.genre || 'Artista Verificado',
          monthlyListeners: art.monthlyListeners || '1.2M ouvintes mensais',
          bio: `${art.name || artistName} com discografia oficial e áudio em alta definição no MooSic.`,
          origin: 'MooSic Global Catalog',
          verified: true,
          isCustom: false,
          updatedAt: Date.now(),
        };
        this.memoryCache.set(norm, meta);
        this.saveToStorage();
        return meta;
      }
    } catch {
      // Ignora erro externo
    }

    // Fallback de segurança com a capa da primeira faixa se houver
    const fallbackImage = fallbackCover || DEFAULT_NEUTRAL_COVER;
    const fallbackMeta: ArtistMetadata = {
      id: `artist-${norm || 'generic'}`,
      name: artistName,
      avatarUrl: fallbackImage,
      bannerUrl: fallbackImage,
      genre: 'Artista MooSic',
      monthlyListeners: 'Ouvintes em sintonia',
      bio: `${artistName} com presença na frequência 432Hz do MooSic.`,
      origin: 'Brasil / Internacional',
      verified: false,
      isCustom: false,
      updatedAt: Date.now(),
    };

    this.memoryCache.set(norm, fallbackMeta);
    this.saveToStorage();
    return fallbackMeta;
  }

  public updateArtistMetadata(artistName: string, patch: Partial<ArtistMetadata>): ArtistMetadata {
    this.loadFromStorage();
    const norm = normalizeString(artistName);
    const current = this.memoryCache.get(norm) || {
      id: `artist-${norm}`,
      name: artistName,
      avatarUrl: '',
      bannerUrl: '',
      genre: 'Gênero Musical',
      monthlyListeners: 'Ouvintes ativos',
      bio: '',
      origin: '',
      verified: true,
      isCustom: true,
      updatedAt: Date.now(),
    };

    const updated: ArtistMetadata = {
      ...current,
      ...patch,
      isCustom: true,
      updatedAt: Date.now(),
    };

    this.memoryCache.set(norm, updated);
    this.saveToStorage();
    return updated;
  }

  public getCachedAvatar(artistName: string, fallbackUrl?: string): string {
    const norm = normalizeString(artistName);
    const cached = this.memoryCache.get(norm);
    if (cached && cached.avatarUrl) {
      return cached.avatarUrl;
    }
    const curated = this.findInCuratedRegistry(artistName);
    if (curated && curated.avatarUrl) {
      return curated.avatarUrl;
    }
    return fallbackUrl || DEFAULT_NEUTRAL_COVER;
  }
}

export const artistMetadataService = new ArtistMetadataService();
