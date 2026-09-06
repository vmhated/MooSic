import React, { useState, useEffect } from 'react';
import { usePlayer } from '@/stores/playerContext';
import { usePlaylists } from '@/stores/playlistStore';
import { useListeningSession } from '@/hooks/useListeningSession';
import { useRouter } from '@/app/routes/router';
import { musicService } from '@/services/music/musicService';
import { Track } from '@/types/domain/music';
import { ListeningSession, HistoryItem } from '@/types/domain/session';
import { formatSecondsToTime } from '@/providers/lyrics/lrclibLyricsProvider';
import {
  Heart,
  Play,
  Compass,
  Music,
  Plus,
  History,
  Sparkles,
  Clock,
  Trash2,
  CheckCircle2,
  FastForward,
  Layers,
} from 'lucide-react';

type LibraryTab = 'liked' | 'history' | 'sessions';

export const LibraryPage: React.FC = () => {
  const { likedTrackIds, setQueue, currentTrack, isLiked, toggleLike } = usePlayer();
  const { openAddToPlaylistModal } = usePlaylists();
  const { history, recentSessions, clearHistory } = useListeningSession();
  const { navigate } = useRouter();

  const [activeTab, setActiveTab] = useState<LibraryTab>('liked');
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    let mounted = true;
    async function loadTracks() {
      try {
        const featured = await musicService.getFeaturedTracks();
        if (mounted) {
          const liked = featured.filter((t) => likedTrackIds.includes(t.id));
          setTracks(liked.length > 0 ? liked : featured.slice(0, 4));
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

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      setQueue(tracks, 0, {
        type: 'library',
        title: 'Músicas Curtidas',
      });
    }
  };

  const handlePlayIndex = (index: number) => {
    setQueue(tracks, index, {
      type: 'library',
      title: 'Músicas Curtidas',
      position: index,
    });
  };

  const handlePlayHistoryItem = (item: HistoryItem) => {
    setQueue([item.track], 0, {
      type: 'library',
      title: 'Histórico de Escuta',
    });
  };

  const handlePlaySessionTracks = (session: ListeningSession) => {
    const sessionTracks: Track[] = session.tracks.map((t) => ({
      id: t.trackId,
      title: t.title,
      artistId: 'artist-session',
      artistName: t.artist,
      coverUrl: t.coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop',
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

  const formatPlayedAt = (timestamp: number) => {
    const d = new Date(timestamp);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    if (isToday) return `Hoje às ${timeStr}`;
    return `${d.getDate()}/${d.getMonth() + 1} às ${timeStr}`;
  };

  return (
    <div className="space-y-8 select-none max-w-6xl">
      {/* Hero Banner da Biblioteca */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900/40 via-surface-elevated to-surface border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 flex items-center justify-center shadow-[0_10px_30px_rgba(236,72,153,0.3)] flex-shrink-0">
          {activeTab === 'liked' && <Heart className="w-16 h-16 text-white fill-current animate-pulse" />}
          {activeTab === 'history' && <History className="w-16 h-16 text-white animate-pulse" />}
          {activeTab === 'sessions' && <Sparkles className="w-16 h-16 text-white animate-pulse" />}
        </div>

        <div className="space-y-2 flex-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-brand-light bg-brand-purple/20 px-2.5 py-0.5 rounded-full border border-brand-purple/30">
            {activeTab === 'liked' && 'Playlist Pessoal'}
            {activeTab === 'history' && 'Fluxo Contínuo'}
            {activeTab === 'sessions' && 'Inteligência de Sessão'}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {activeTab === 'liked' && 'Músicas Curtidas'}
            {activeTab === 'history' && 'Histórico de Escuta'}
            {activeTab === 'sessions' && 'Sessões Gravadas'}
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary">
            {activeTab === 'liked' && `${likedTrackIds.length} faixas salvas no seu fluxo sonoro`}
            {activeTab === 'history' && `${history.length} faixas tocadas recentemente`}
            {activeTab === 'sessions' && `${recentSessions.length} sessões de escuta identificadas`}
          </p>

          {activeTab === 'liked' && (
            <div className="pt-2">
              <button
                onClick={handlePlayAll}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-purple hover:bg-brand-hover text-white font-bold text-xs shadow-lg hover:shadow-brand-purple/30 transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Tocar Tudo</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Seletor de Abas da Biblioteca */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('liked')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'liked'
                ? 'bg-brand-purple text-white shadow-md'
                : 'text-text-muted hover:text-white hover:bg-white/5'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${activeTab === 'liked' ? 'fill-current' : ''}`} />
            <span>Curtidas ({likedTrackIds.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-brand-purple text-white shadow-md'
                : 'text-text-muted hover:text-white hover:bg-white/5'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Histórico ({history.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sessions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'sessions'
                ? 'bg-brand-purple text-white shadow-md'
                : 'text-text-muted hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sessões ({recentSessions.length})</span>
          </button>
        </div>

        {activeTab === 'history' && history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
            title="Limpar histórico de escuta"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Limpar Histórico</span>
          </button>
        )}
      </div>

      {/* ABA 1: MÚSICAS CURTIDAS */}
      {activeTab === 'liked' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Music className="w-4 h-4 text-brand-purple" />
              <span>Faixas na sua Biblioteca</span>
            </h2>
            <button
              onClick={() => navigate('/app/search')}
              className="text-xs text-brand-light hover:underline flex items-center gap-1"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explorar mais músicas</span>
            </button>
          </div>

          <div className="space-y-1.5">
            {tracks.map((track, idx) => {
              const isCurrent = currentTrack?.id === track.id;
              const liked = isLiked(track.id);

              return (
                <div
                  key={`${track.id}-${idx}`}
                  onClick={() => handlePlayIndex(idx)}
                  className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-brand-purple/15 border-brand-purple/30 text-brand-light'
                      : 'bg-white/[0.02] hover:bg-white/[0.06] border-transparent hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <span className="w-5 text-center text-xs font-mono text-text-muted group-hover:hidden">
                      {idx + 1}
                    </span>
                    <button className="w-5 hidden group-hover:flex items-center justify-center text-white">
                      <Play className="w-3.5 h-3.5 fill-current text-brand-light" />
                    </button>

                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-10 h-10 rounded-lg object-cover shadow flex-shrink-0"
                    />

                    <div className="min-w-0 pr-4">
                      <p className="font-bold text-xs sm:text-sm text-white truncate group-hover:text-brand-light transition-colors">
                        {track.title}
                      </p>
                      <p className="text-[11px] text-text-muted truncate">{track.artistName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openAddToPlaylistModal(track);
                      }}
                      className="p-1.5 rounded-full text-text-muted hover:text-white hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                      title="Adicionar à Playlist"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(track.id);
                      }}
                      className={`p-1.5 rounded-full transition-colors ${
                        liked ? 'text-pink-500' : 'text-text-muted hover:text-white'
                      }`}
                      aria-label="Curtir"
                    >
                      <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                    </button>

                    <span className="text-xs text-text-muted font-mono hidden sm:inline-block w-10 text-right">
                      {formatSecondsToTime(track.durationSeconds || 30)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ABA 2: HISTÓRICO DE ESCUTA */}
      {activeTab === 'history' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-brand-purple" />
              <span>Reproduções Recentes</span>
            </h2>
            <span className="text-xs text-text-muted">
              {history.length} faixas registradas
            </span>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <Clock className="w-10 h-10 text-text-muted mx-auto" />
              <p className="text-sm font-bold text-white">Nenhum histórico registrado ainda</p>
              <p className="text-xs text-text-secondary max-w-sm mx-auto">
                Comece a ouvir faixas na Home ou na Busca. Cada momento será registrado cronologicamente aqui.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {history.map((item) => {
                const isCurrent = currentTrack?.id === item.track.id;
                const liked = isLiked(item.track.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => handlePlayHistoryItem(item)}
                    className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-brand-purple/15 border-brand-purple/30 text-brand-light'
                        : 'bg-white/[0.02] hover:bg-white/[0.06] border-transparent hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <button className="w-5 flex items-center justify-center text-text-muted group-hover:text-brand-light">
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>

                      <div className="min-w-0 pr-4">
                        <p className="font-bold text-xs sm:text-sm text-white truncate group-hover:text-brand-light transition-colors">
                          {item.track.title}
                        </p>
                        <p className="text-[11px] text-text-muted truncate">{item.track.artistName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      {/* Contexto de onde veio */}
                      {item.playbackContext && (
                        <span className="hidden md:inline-block text-[10px] font-mono uppercase bg-white/5 px-2 py-0.5 rounded text-text-muted border border-white/5">
                          {item.playbackContext.title || item.playbackContext.type}
                        </span>
                      )}

                      {/* Status da reprodução */}
                      {item.completed && (
                        <span className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Completa</span>
                        </span>
                      )}
                      {item.skipped && (
                        <span className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          <FastForward className="w-3 h-3" />
                          <span>Skip ({item.durationPlayedSeconds}s)</span>
                        </span>
                      )}

                      {/* Hora da escuta */}
                      <span className="text-[11px] font-mono text-text-muted">
                        {formatPlayedAt(item.playedAt)}
                      </span>

                      {/* Like rápido */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(item.track.id);
                        }}
                        className={`p-1.5 rounded-full transition-colors ${
                          liked ? 'text-pink-500' : 'text-text-muted hover:text-white'
                        }`}
                        aria-label="Curtir"
                      >
                        <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ABA 3: SESSÕES DE ESCUTA */}
      {activeTab === 'sessions' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-purple" />
              <span>Sessões Narradas pelo MooSic</span>
            </h2>
            <span className="text-xs text-text-muted">
              {recentSessions.length} sessões registradas
            </span>
          </div>

          {recentSessions.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <Sparkles className="w-10 h-10 text-brand-purple mx-auto animate-pulse" />
              <p className="text-sm font-bold text-white">Nenhuma sessão consolidada ainda</p>
              <p className="text-xs text-text-secondary max-w-sm mx-auto">
                O MooSic agrupa suas sequências contínuas de escuta em histórias temporais. Ouça algumas faixas para gerar sua primeira narrativa.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentSessions.map((sess) => {
                const durationMin = Math.max(1, Math.round(sess.totalDurationSeconds / 60));
                return (
                  <div
                    key={sess.id}
                    className="p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-brand-purple/30 transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-brand-light bg-brand-purple/20 px-2 py-0.5 rounded-full border border-brand-purple/30">
                          {sess.story?.dominantVibe || 'Sessão'}
                        </span>
                        <span className="text-[11px] font-mono text-text-muted">
                          {formatPlayedAt(sess.startedAt)}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white">
                        {sess.story?.title || `Sessão com ${sess.trackCount} faixas`}
                      </h3>

                      <p className="text-xs text-text-secondary line-clamp-2">
                        {sess.story?.narrative}
                      </p>

                      {sess.story?.insight && (
                        <div className="flex items-center gap-1.5 text-[11px] text-brand-light/90 bg-white/[0.02] p-2 rounded-lg border border-white/5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          <span className="truncate">{sess.story.insight}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <div className="flex items-center gap-3 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{durationMin} min</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Layers className="w-3 h-3" />
                          <span>{sess.trackCount} faixas</span>
                        </span>
                      </div>

                      <button
                        onClick={() => handlePlaySessionTracks(sess)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-brand-purple text-white text-xs font-bold transition-all hover:scale-105 active:scale-95"
                      >
                        <Play className="w-3 h-3 fill-current ml-0.5" />
                        <span>Reouvir</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
