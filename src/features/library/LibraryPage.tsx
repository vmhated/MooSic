import React, { useState, useEffect } from 'react';
import { usePlayer } from '@/stores/playerContext';
import { usePlaylists } from '@/stores/playlistStore';
import { useListeningSession } from '@/hooks/useListeningSession';
import { useRouter } from '@/app/routes/router';
import { musicService } from '@/services/music/musicService';
import { Track } from '@/types/domain/music';
import { ListeningSession, HistoryItem } from '@/types/domain/session';
import { TrackRow, PlaylistCard } from '@/components/music';
import { PlayButton } from '@/components/ui/PlayButton';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  Heart,
  Play,
  Shuffle,
  Plus,
  History,
  Activity,
  ListMusic,
  Trash2,
} from 'lucide-react';

type LibraryTab = 'liked' | 'playlists' | 'history' | 'sessions';

export const LibraryPage: React.FC = () => {
  const { likedTrackIds, setQueue, currentTrack, isLiked, toggleLike, isPlaying } = usePlayer();
  const { playlists, openCreatePlaylistModal } = usePlaylists();
  const { history, recentSessions, clearHistory } = useListeningSession();
  const { navigate } = useRouter();

  const [activeTab, setActiveTab] = useState<LibraryTab>('liked');
  const [likedTracks, setLikedTracks] = useState<Track[]>([]);

  useEffect(() => {
    let mounted = true;
    async function loadTracks() {
      try {
        const featured = await musicService.getFeaturedTracks();
        if (mounted) {
          const liked = featured.filter((t) => likedTrackIds.includes(t.id));
          setLikedTracks(liked.length > 0 ? liked : featured.slice(0, 4));
        }
      } catch {
        // Fallback
      }
    }
    loadTracks();
    return () => {
      mounted = false;
    };
  }, [likedTrackIds]);

  const handlePlayLikedAll = () => {
    if (likedTracks.length > 0) {
      setQueue(likedTracks, 0, {
        type: 'library',
        title: 'Músicas Curtidas',
      });
    }
  };

  const handleShuffleLiked = () => {
    if (likedTracks.length > 0) {
      const shuffled = [...likedTracks].sort(() => Math.random() - 0.5);
      setQueue(shuffled, 0, {
        type: 'library',
        title: 'Mix: Músicas Curtidas',
      });
    }
  };

  const handlePlayLikedIndex = (index: number) => {
    setQueue(likedTracks, index, {
      type: 'library',
      title: 'Músicas Curtidas',
      position: index,
    });
  };

  const handlePlayHistoryItem = (_item: HistoryItem, idx: number) => {
    const historyTracks = history.map((h) => h.track);
    setQueue(historyTracks, idx, {
      type: 'library',
      title: 'Histórico de Escuta',
      position: idx,
    });
  };

  const handlePlaySessionTracks = (session: ListeningSession) => {
    const sessionTracks: Track[] = session.tracks.map((t) => ({
      id: t.trackId,
      title: t.title,
      artistId: 'artist-session',
      artistName: t.artist,
      coverUrl: t.coverUrl || 'https://cdn-images.dzcdn.net/images/cover/9ad06bcb9f0bfe52bbd5e6ff464e4ca4/1000x1000-000000-80-0-0.jpg',
      durationSeconds: t.durationSeconds || 30,
      genre: session.story?.dominantVibe || 'Sessão MooSic',
      isExplicit: false,
      providerId: 'moosic',
      providerTrackId: t.trackId,
    }));

    if (sessionTracks.length > 0) {
      setQueue(sessionTracks, 0, {
        type: 'flow',
        title: session.story?.title || 'Sessão Anterior',
      });
    }
  };

  const isLikedPlaying = isPlaying && likedTracks.some((t) => t.id === currentTrack?.id);

  return (
    <div className="space-y-8 select-none w-full max-w-[1720px] mx-auto pb-32">
      {/* 1. Topo Editorial da Biblioteca */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-brand-light">
              Acervo Pessoal
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Sua Biblioteca Musical
          </h1>
          <p className="text-xs sm:text-sm text-text-muted font-medium">
            Seus favoritos, playlists autorais, histórico e sessões sonoras arquivadas.
          </p>
        </div>

        {/* Abas de Navegação */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0D0E14] border border-white/10 self-start sm:self-auto overflow-x-auto max-w-full">
          {[
            { id: 'liked', label: 'Curtidas', icon: Heart, count: likedTracks.length },
            { id: 'playlists', label: 'Playlists', icon: ListMusic, count: playlists.length },
            { id: 'history', label: 'Histórico', icon: History, count: history.length },
            { id: 'sessions', label: 'Sessões', icon: Activity, count: recentSessions.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as LibraryTab)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                  isActive
                    ? 'bg-brand-purple text-white shadow-glow'
                    : 'text-text-muted hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className="text-[10px] font-mono opacity-75">({tab.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= ABA 1: MÚSICAS CURTIDAS ================= */}
      {activeTab === 'liked' && (
        <div className="space-y-6">
          {likedTracks.length === 0 ? (
            <EmptyState
              title="Sua biblioteca está em silêncio"
              description="Você ainda não curtiu nenhuma música. Explore o catálogo e clique no coração para adicionar faixas aqui!"
              actionLabel="Explorar músicas"
              onAction={() => navigate('/app/search')}
            />
          ) : (
            <>
              {/* Hero Banner das Curtidas */}
              <div className="relative rounded-4xl p-6 sm:p-8 bg-gradient-to-r from-purple-950 via-[#12131C] to-[#0A0B10] border border-white/10 shadow-xl overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-pink-500 via-rose-600 to-purple-700 flex items-center justify-center text-white shadow-2xl flex-shrink-0">
                    <Heart className="w-10 h-10 fill-current" />
                  </div>
                  <div className="space-y-1 text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl font-black text-white">Músicas Curtidas</h2>
                    <p className="text-xs text-text-muted font-medium">
                      {likedTracks.length} {likedTracks.length === 1 ? 'faixa favoritada' : 'faixas favoritadas'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePlayLikedAll}
                    className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-white hover:bg-neutral-100 text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all"
                  >
                    <PlayButton isPlaying={isLikedPlaying} size="sm" variant="white" />
                    <span>Tocar Todas</span>
                  </button>

                  <button
                    onClick={handleShuffleLiked}
                    className="p-3 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/15 transition-all hover:scale-105"
                    title="Ordem Aleatória"
                  >
                    <Shuffle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lista de Faixas */}
              <div className="space-y-1.5">
                {likedTracks.map((track, idx) => (
                  <TrackRow
                    key={`liked-track-${track.id}-${idx}`}
                    track={track}
                    index={idx}
                    isCurrent={currentTrack?.id === track.id}
                    isPlaying={isPlaying && currentTrack?.id === track.id}
                    isLiked={isLiked(track.id)}
                    onPlay={() => handlePlayLikedIndex(idx)}
                    onToggleLike={() => toggleLike(track.id)}
                    onArtistClick={() => navigate(`/app/artist/${encodeURIComponent(track.artistName)}`)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ================= ABA 2: PLAYLISTS AUTORAIS ================= */}
      {activeTab === 'playlists' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-text-muted">
              Suas Coleções ({playlists.length})
            </h2>
            <button
              onClick={() => openCreatePlaylistModal()}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple hover:bg-brand-hover text-white text-xs font-bold shadow-glow hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova Playlist</span>
            </button>
          </div>

          {playlists.length === 0 ? (
            <EmptyState
              title="Nenhuma playlist criada ainda"
              description="Crie sua primeira playlist autoral, personalize com temas e analise o DNA sonoro em tempo real."
              actionLabel="Criar primeira playlist"
              onAction={() => openCreatePlaylistModal()}
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
              {playlists.map((playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  onClick={() => navigate(`/app/playlist/${playlist.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= ABA 3: HISTÓRICO DE ESCUTA ================= */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-text-muted">
              Faixas Reproduzidas Recentemente
            </h2>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-rose-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpar histórico</span>
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <EmptyState
              title="Seu histórico está vazio"
              description="As músicas que você tocar no Web Player aparecerão aqui cronologicamente."
            />
          ) : (
            <div className="space-y-1.5">
              {history.map((item, idx) => (
                <TrackRow
                  key={`history-row-${item.track.id}-${idx}`}
                  track={item.track}
                  index={idx}
                  isCurrent={currentTrack?.id === item.track.id}
                  isPlaying={isPlaying && currentTrack?.id === item.track.id}
                  isLiked={isLiked(item.track.id)}
                  onPlay={() => handlePlayHistoryItem(item, idx)}
                  onToggleLike={() => toggleLike(item.track.id)}
                  onArtistClick={() => navigate(`/app/artist/${encodeURIComponent(item.track.artistName)}`)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= ABA 4: SESSÕES ANTERIORES ================= */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-text-muted">
            Sessões Sonoras Arquivadas
          </h2>

          {recentSessions.length === 0 ? (
            <EmptyState
              title="Nenhuma sessão consolidada"
              description="O MooSic agrupa suas faixas ouvidas em sessões contínuas com diagnósticos narrativos."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentSessions.map((session) => {
                const story = session.story;
                if (!story) return null;
                const durationMin = Math.max(1, Math.round(session.totalDurationSeconds / 60));

                return (
                  <div
                    key={`lib-sess-${session.id}`}
                    className="p-5 sm:p-6 rounded-3xl bg-[#0D0E14] border border-white/[0.08] space-y-3 hover:border-white/15 transition-all shadow-md"
                  >
                    <div className="flex items-center justify-between text-xs text-text-muted font-mono">
                      <span className="text-brand-light font-bold uppercase">{story.dominantVibe || 'Sessão MooSic'}</span>
                      <span>{durationMin} min • {session.trackCount} faixas</span>
                    </div>

                    <h3 className="text-base font-bold text-white tracking-tight">
                      {story.title}
                    </h3>

                    <p className="text-xs text-text-secondary leading-relaxed">
                      {story.narrative}
                    </p>

                    <button
                      onClick={() => handlePlaySessionTracks(session)}
                      className="mt-2 flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple hover:bg-brand-hover text-white text-xs font-bold shadow-md transition-all hover:scale-105 active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Reouvir Esta Sessão</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
