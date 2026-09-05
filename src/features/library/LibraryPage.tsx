import React, { useState, useEffect } from 'react';
import { usePlayer } from '@/stores/playerContext';
import { usePlaylists } from '@/stores/playlistStore';
import { useRouter } from '@/app/routes/router';
import { musicService } from '@/services/music/musicService';
import { Track } from '@/types/domain/music';
import { formatSecondsToTime } from '@/providers/lyrics/lrclibLyricsProvider';
import { Heart, Play, Compass, Music, Plus } from 'lucide-react';

export const LibraryPage: React.FC = () => {
  const { likedTrackIds, setQueue, currentTrack, isLiked, toggleLike } = usePlayer();
  const { openAddToPlaylistModal } = usePlaylists();
  const { navigate } = useRouter();
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    let mounted = true;
    async function loadTracks() {
      try {
        const featured = await musicService.getFeaturedTracks();
        if (mounted) {
          // Filtra ou inclui as faixas curtidas com base no catálogo disponível
          const liked = featured.filter((t) => likedTrackIds.includes(t.id));
          // Se não curtiu nenhuma ainda ou as curtidas não estão no featured, mantém featured de apoio
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
      setQueue(tracks, 0);
    }
  };

  const handlePlayIndex = (index: number) => {
    setQueue(tracks, index);
  };

  return (
    <div className="space-y-8 select-none max-w-6xl">
      {/* Hero Banner da Biblioteca */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900/40 via-surface-elevated to-surface border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 flex items-center justify-center shadow-[0_10px_30px_rgba(236,72,153,0.3)] flex-shrink-0">
          <Heart className="w-16 h-16 text-white fill-current animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-brand-light bg-brand-purple/20 px-2.5 py-0.5 rounded-full border border-brand-purple/30">
            Playlist Pessoal
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Músicas Curtidas
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary">
            {likedTrackIds.length} faixas salvas no seu fluxo sonoro
          </p>

          <div className="pt-2">
            <button
              onClick={handlePlayAll}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-purple hover:bg-brand-hover text-white font-bold text-xs shadow-lg hover:shadow-brand-purple/30 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>Tocar Tudo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Faixas */}
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
    </div>
  );
};
