import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CustomPlaylist, PlaylistThemeId } from '@/types/domain/playlist';
import { Track } from '@/types/domain/music';

interface PlaylistContextType {
  playlists: CustomPlaylist[];
  createPlaylist: (data: {
    title: string;
    description?: string;
    themeId?: PlaylistThemeId;
    initialTracks?: Track[];
  }) => CustomPlaylist;
  updatePlaylist: (id: string, updates: Partial<CustomPlaylist>) => void;
  deletePlaylist: (id: string) => void;
  addTrackToPlaylist: (playlistId: string, track: Track) => boolean;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  getPlaylistById: (id: string) => CustomPlaylist | undefined;

  // Modais Globais
  activeModal: 'create-playlist' | 'add-to-playlist' | 'resonator' | null;
  pendingTrackForPlaylist: Track | null;
  openCreatePlaylistModal: (initialTracks?: Track[]) => void;
  openAddToPlaylistModal: (track: Track) => void;
  openResonatorModal: () => void;
  closeModals: () => void;
}

const PlaylistContext = createContext<PlaylistContextType | null>(null);

const STORAGE_KEY = 'moosic_custom_playlists_v1';

const DEFAULT_PLAYLISTS: CustomPlaylist[] = [
  {
    id: 'pl-frequencia-cosmica',
    title: 'Frequência Cósmica & Foco',
    description: 'Imersão harmônica com sintetizadores e melodias para acelerar estados de foco profundo.',
    themeId: 'cyberpunk-neon',
    createdAt: Date.now() - 86400000 * 3,
    isPinned: true,
    tracks: [
      {
        id: 'seed-1',
        title: 'Starboy',
        artistName: 'The Weeknd ft. Daft Punk',
        artistId: 'the-weeknd',
        albumTitle: 'Starboy',
        durationSeconds: 230,
        coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        accent: '#D946EF',
        isExplicit: true,
        providerId: 'itunes',
        providerTrackId: 'seed-1',
      },
      {
        id: 'seed-2',
        title: 'Veridis Quo',
        artistName: 'Daft Punk',
        artistId: 'daft-punk',
        albumTitle: 'Discovery',
        durationSeconds: 345,
        coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
        accent: '#8B5CF6',
        isExplicit: false,
        providerId: 'itunes',
        providerTrackId: 'seed-2',
      },
    ],
  },
  {
    id: 'pl-sunset-trap',
    title: 'Sunset & Flow Noturno',
    description: 'Graves 808 aveludados, melodias quentes e a vibe definitiva para o fim de tarde.',
    themeId: 'sunset-gold',
    createdAt: Date.now() - 86400000 * 2,
    isPinned: true,
    tracks: [
      {
        id: 'seed-3',
        title: 'Anos Luz',
        artistName: 'Matuê',
        artistId: 'matue',
        albumTitle: '333',
        durationSeconds: 264,
        coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
        accent: '#F59E0B',
        isExplicit: true,
        providerId: 'deezer',
        providerTrackId: 'seed-3',
      },
    ],
  },
];

export const PlaylistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playlists, setPlaylists] = useState<CustomPlaylist[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignora erro
    }
    return DEFAULT_PLAYLISTS;
  });

  const [activeModal, setActiveModal] = useState<'create-playlist' | 'add-to-playlist' | 'resonator' | null>(null);
  const [pendingTrackForPlaylist, setPendingTrackForPlaylist] = useState<Track | null>(null);

  // Persistência automática no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
    } catch {
      // Ignora erro de quota
    }
  }, [playlists]);

  const createPlaylist = useCallback(
    (data: {
      title: string;
      description?: string;
      themeId?: PlaylistThemeId;
      initialTracks?: Track[];
    }) => {
      const newPlaylist: CustomPlaylist = {
        id: `pl-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        title: data.title.trim() || 'Nova Playlist Sem Título',
        description: data.description?.trim() || 'Playlist criada por você no MooSic.',
        themeId: data.themeId || 'cyberpunk-neon',
        createdAt: Date.now(),
        tracks: data.initialTracks || [],
      };

      setPlaylists((prev) => [newPlaylist, ...prev]);
      return newPlaylist;
    },
    []
  );

  const updatePlaylist = useCallback((id: string, updates: Partial<CustomPlaylist>) => {
    setPlaylists((prev) =>
      prev.map((pl) => (pl.id === id ? { ...pl, ...updates } : pl))
    );
  }, []);

  const deletePlaylist = useCallback((id: string) => {
    setPlaylists((prev) => prev.filter((pl) => pl.id !== id));
  }, []);

  const addTrackToPlaylist = useCallback((playlistId: string, track: Track): boolean => {
    let added = false;
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id !== playlistId) return pl;
        if (pl.tracks.some((t) => t.id === track.id)) return pl; // Já existe
        added = true;
        return {
          ...pl,
          tracks: [track, ...pl.tracks],
        };
      })
    );
    return added;
  }, []);

  const removeTrackFromPlaylist = useCallback((playlistId: string, trackId: string) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id !== playlistId) return pl;
        return {
          ...pl,
          tracks: pl.tracks.filter((t) => t.id !== trackId),
        };
      })
    );
  }, []);

  const getPlaylistById = useCallback(
    (id: string) => {
      return playlists.find((pl) => pl.id === id);
    },
    [playlists]
  );

  const openCreatePlaylistModal = useCallback((_initialTracks?: Track[]) => {
    setActiveModal('create-playlist');
  }, []);

  const openAddToPlaylistModal = useCallback((track: Track) => {
    setPendingTrackForPlaylist(track);
    setActiveModal('add-to-playlist');
  }, []);

  const openResonatorModal = useCallback(() => {
    setActiveModal('resonator');
  }, []);

  const closeModals = useCallback(() => {
    setActiveModal(null);
    setPendingTrackForPlaylist(null);
  }, []);

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        createPlaylist,
        updatePlaylist,
        deletePlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        getPlaylistById,
        activeModal,
        pendingTrackForPlaylist,
        openCreatePlaylistModal,
        openAddToPlaylistModal,
        openResonatorModal,
        closeModals,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylists = (): PlaylistContextType => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error('usePlaylists deve ser usado dentro de um PlaylistProvider');
  }
  return context;
};
