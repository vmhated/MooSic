import React, { useMemo } from 'react';
import { usePlaylists } from '@/stores/playlistStore';
import { usePlayer } from '@/stores/playerContext';
import { useRouter } from '@/app/routes/router';
import { PLAYLIST_THEMES } from '@/constants/playlistThemes';
import { playlistDnaService } from '@/services/playlist/playlistDnaService';
import { PlaylistDNABar } from '@/components/playlist/PlaylistDNABar';
import { formatSecondsToTime } from '@/providers/lyrics/lrclibLyricsProvider';
import { TrackRow } from '@/components/music/TrackRow';
import { PlayButton } from '@/components/ui/PlayButton';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  Shuffle,
  Trash2,
  ArrowLeft,
  Clock,
  Sparkles,
  Flame,
  Radio,
  Zap,
  Compass,
  Disc,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Flame,
  Radio,
  Zap,
  Compass,
  Sparkles,
  Disc,
};

interface PlaylistViewProps {
  playlistId: string;
}

export const PlaylistView: React.FC<PlaylistViewProps> = ({ playlistId }) => {
  const { getPlaylistById, deletePlaylist, removeTrackFromPlaylist } = usePlaylists();
  const { setQueue, currentTrack, isPlaying, toggleLike, isLiked } = usePlayer();
  const { navigate } = useRouter();

  const playlist = getPlaylistById(playlistId);

  if (!playlist) {
    return (
      <div className="py-24 text-center space-y-4 select-none max-w-md mx-auto">
        <EmptyState
          title="Playlist não encontrada"
          description="Esta coleção pode ter sido removida ou não existe mais no seu acervo."
          actionLabel="Voltar para o Início"
          onAction={() => navigate('/app')}
        />
      </div>
    );
  }

  const theme = PLAYLIST_THEMES[playlist.themeId] || PLAYLIST_THEMES['cyberpunk-neon'];
  const IconComponent = ICON_MAP[theme.iconName] || Sparkles;

  const totalDuration = playlist.tracks.reduce(
    (acc, t) => acc + (t.durationSeconds || 30),
    0
  );

  const dna = useMemo(
    () => playlistDnaService.computePlaylistDNA(playlist.id, playlist.tracks),
    [playlist.id, playlist.tracks]
  );

  const handlePlayAll = () => {
    if (playlist.tracks.length > 0) {
      setQueue(playlist.tracks, 0, {
        type: 'playlist',
        id: playlist.id,
        title: playlist.title,
      });
    }
  };

  const handleShuffle = () => {
    if (playlist.tracks.length > 0) {
      const shuffled = [...playlist.tracks].sort(() => Math.random() - 0.5);
      setQueue(shuffled, 0, {
        type: 'playlist',
        id: playlist.id,
        title: `Mix: ${playlist.title}`,
      });
    }
  };

  const handlePlayIndex = (index: number) => {
    setQueue(playlist.tracks, index, {
      type: 'playlist',
      id: playlist.id,
      title: playlist.title,
      position: index,
    });
  };

  const handleDelete = () => {
    if (window.confirm(`Deseja realmente excluir a playlist "${playlist.title}"?`)) {
      deletePlaylist(playlist.id);
      navigate('/app/library');
    }
  };

  const isPlaylistCurrent = playlist.tracks.some((t) => t.id === currentTrack?.id);

  return (
    <div className="space-y-8 select-none w-full max-w-[1720px] mx-auto pb-32">
      {/* Botão Voltar */}
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-xs font-bold text-text-muted hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar</span>
      </button>

      {/* 1. Hero Editorial da Playlist */}
      <div
        className={`relative rounded-4xl p-6 sm:p-10 bg-gradient-to-br ${theme.gradient} border border-white/20 shadow-2xl overflow-hidden flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8`}
      >
        {/* Capa Principal ou Colagem */}
        <div className="relative z-10 w-44 h-44 sm:w-56 sm:h-56 rounded-3xl overflow-hidden bg-black/40 border border-white/20 shadow-2xl flex items-center justify-center flex-shrink-0">
          {playlist.tracks.length > 0 && playlist.tracks[0]?.coverUrl ? (
            <img
              src={playlist.tracks[0].coverUrl}
              alt={playlist.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <IconComponent className="w-16 h-16 text-white/80 stroke-[1.5]" />
          )}
        </div>

        {/* Informações da Playlist */}
        <div className="relative z-10 space-y-3 text-center sm:text-left min-w-0 flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-widest bg-black/40 text-white px-3 py-1 rounded-full border border-white/20 backdrop-blur-md">
              {theme.name}
            </span>
            <span className="text-xs text-white/80 font-mono">
              Playlist Autoral
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight truncate">
            {playlist.title}
          </h1>

          {playlist.description && (
            <p className="text-xs sm:text-sm text-white/85 max-w-xl line-clamp-2 font-medium">
              {playlist.description}
            </p>
          )}

          <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-white/80 font-medium">
            <span>{playlist.tracks.length} {playlist.tracks.length === 1 ? 'faixa' : 'faixas'}</span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatSecondsToTime(totalDuration)}</span>
            </span>
          </div>

          {/* Botões de Ação */}
          <div className="pt-2 flex items-center justify-center sm:justify-start gap-3">
            {playlist.tracks.length > 0 && (
              <>
                <button
                  onClick={handlePlayAll}
                  className="flex items-center gap-2.5 px-7 py-3 rounded-full bg-white text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                  <PlayButton isPlaying={isPlaylistCurrent && isPlaying} size="sm" variant="white" />
                  <span>Tocar Tudo</span>
                </button>

                <button
                  onClick={handleShuffle}
                  className="p-3 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/20 transition-all hover:scale-105"
                  title="Ordem Aleatória"
                >
                  <Shuffle className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              onClick={handleDelete}
              className="p-3 rounded-full bg-black/40 hover:bg-rose-500/30 text-white/70 hover:text-rose-400 border border-white/20 transition-all"
              title="Excluir Playlist"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Diagnóstico Espectral: Playlist DNA */}
      {dna.isAnalyzed && dna.totalTracks > 0 && (
        <section className="space-y-3">
          <PlaylistDNABar dna={dna} />
        </section>
      )}

      {/* 3. Tracklist da Playlist */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs text-text-muted font-mono px-2">
          <span>FAIXAS NA COLEÇÃO</span>
          <span>DURAÇÃO</span>
        </div>

        {playlist.tracks.length === 0 ? (
          <EmptyState
            title="Esta playlist está vazia"
            description="Explore as estações sonoras ou busque suas faixas favoritas e clique no ícone '+' para adicioná-las aqui."
            actionLabel="Explorar catálogo"
            onAction={() => navigate('/app/search')}
          />
        ) : (
          <div className="space-y-1.5">
            {playlist.tracks.map((track, idx) => (
              <TrackRow
                key={`pl-track-${track.id}-${idx}`}
                track={track}
                index={idx}
                isCurrent={currentTrack?.id === track.id}
                isPlaying={isPlaying && currentTrack?.id === track.id}
                isLiked={isLiked(track.id)}
                onPlay={() => handlePlayIndex(idx)}
                onToggleLike={() => toggleLike(track.id)}
                onRemove={() => removeTrackFromPlaylist(playlist.id, track.id)}
                onArtistClick={() => navigate(`/app/artist/${encodeURIComponent(track.artistName)}`)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
