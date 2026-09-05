import React from 'react';
import { usePlaylists } from '@/stores/playlistStore';
import { usePlayer } from '@/stores/playerContext';
import { useRouter } from '@/app/routes/router';
import { PLAYLIST_THEMES } from '@/constants/playlistThemes';
import { formatSecondsToTime } from '@/providers/lyrics/lrclibLyricsProvider';
import {
  Play,
  Shuffle,
  Trash2,
  Heart,
  ArrowLeft,
  Compass,
  Clock,
  Sparkles,
  Flame,
  Radio,
  Zap,
  Disc,
} from 'lucide-react';

const ICON_MAP = {
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
      <div className="py-24 text-center space-y-4 select-none">
        <h2 className="text-2xl font-black text-white">Playlist não encontrada</h2>
        <p className="text-xs text-text-muted">Esta coleção pode ter sido removida ou não existe mais.</p>
        <button
          onClick={() => navigate('/app')}
          className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-xs hover:scale-105 transition-all shadow-lg"
        >
          Voltar para o Início
        </button>
      </div>
    );
  }

  const theme = PLAYLIST_THEMES[playlist.themeId] || PLAYLIST_THEMES['cyberpunk-neon'];
  const IconComponent = ICON_MAP[theme.iconName] || Sparkles;

  const totalDuration = playlist.tracks.reduce(
    (acc, t) => acc + (t.durationSeconds || 30),
    0
  );

  const handlePlayAll = () => {
    if (playlist.tracks.length > 0) {
      setQueue(playlist.tracks, 0);
    }
  };

  const handleShuffle = () => {
    if (playlist.tracks.length > 0) {
      const shuffled = [...playlist.tracks].sort(() => Math.random() - 0.5);
      setQueue(shuffled, 0);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Deseja realmente excluir a playlist "${playlist.title}"?`)) {
      deletePlaylist(playlist.id);
      navigate('/app');
    }
  };

  return (
    <div className="space-y-8 select-none max-w-6xl pb-16">
      {/* Botão de Retorno */}
      <button
        onClick={() => navigate('/app')}
        className="flex items-center gap-2 text-xs font-bold text-text-muted hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Voltar</span>
      </button>

      {/* Hero Header da Playlist */}
      <div
        className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-r ${theme.gradient} border border-white/20 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-end gap-6`}
        style={{
          boxShadow: `0 20px 50px -10px ${theme.bgGlow}`,
        }}
      >
        {/* Capa com Ícone */}
        <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-2xl bg-black/35 backdrop-blur-md border border-white/20 flex items-center justify-center flex-shrink-0 shadow-inner">
          <IconComponent className="w-16 h-16 sm:w-20 sm:h-20 text-white drop-shadow-xl" />
        </div>

        {/* Metadados e Ações */}
        <div className="space-y-3 flex-1 min-w-0">
          <span className="text-[10px] font-black uppercase tracking-widest bg-black/40 text-white/90 px-3 py-1 rounded-full border border-white/15">
            Playlist Pessoal MooSic
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {playlist.title}
          </h1>

          <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
            {playlist.description}
          </p>

          <p className="text-xs font-semibold text-white/70">
            {playlist.tracks.length} músicas • {formatSecondsToTime(totalDuration)} no total
          </p>

          {/* Botões de Ação */}
          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <button
              onClick={handlePlayAll}
              disabled={playlist.tracks.length === 0}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-white/90 text-black font-extrabold text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>Tocar Playlist</span>
            </button>

            <button
              onClick={handleShuffle}
              disabled={playlist.tracks.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white font-bold text-xs border border-white/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Aleatório</span>
            </button>

            <button
              onClick={handleDelete}
              className="p-2.5 rounded-full bg-black/40 hover:bg-red-500/20 text-white/70 hover:text-red-400 border border-white/20 hover:border-red-500/30 transition-all ml-auto"
              title="Excluir playlist"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabela de Músicas da Playlist */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-3 py-1 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-white/[0.06]">
          <div className="flex items-center gap-4">
            <span className="w-6 text-center">#</span>
            <span>Título & Artista</span>
          </div>
          <div className="flex items-center gap-8">
            <span className="hidden sm:inline-block">Álbum</span>
            <Clock className="w-3.5 h-3.5 mr-8" />
          </div>
        </div>

        {playlist.tracks.length === 0 ? (
          <div className="py-16 text-center space-y-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
            <p className="text-sm font-semibold text-white">
              Sua playlist ainda está vazia!
            </p>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              Adicione faixas facilmente clicando no ícone "+" ao lado de qualquer música na Busca ou no Início.
            </p>
            <button
              onClick={() => navigate('/app/search')}
              className="flex items-center gap-2 mx-auto px-5 py-2 rounded-xl bg-brand-purple hover:bg-brand-hover text-white text-xs font-bold shadow-lg transition-all"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explorar e Adicionar Músicas</span>
            </button>
          </div>
        ) : (
          playlist.tracks.map((track, idx) => {
            const isCurrent = currentTrack?.id === track.id;
            const liked = isLiked(track.id);

            return (
              <div
                key={`${track.id}-${idx}`}
                onClick={() => setQueue(playlist.tracks, idx)}
                className={`group flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-white/[0.08] border-white/25 shadow-lg'
                    : 'bg-white/[0.02] hover:bg-white/[0.06] border-transparent hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <span className="w-6 text-center text-xs font-mono font-bold text-text-muted group-hover:hidden">
                    {isCurrent && isPlaying ? (
                      <span className="inline-flex gap-0.5 items-end h-3">
                        <span className="w-0.5 h-full bg-brand-light animate-bounce" />
                        <span className="w-0.5 h-2 bg-brand-light animate-bounce" style={{ animationDelay: '0.15s' }} />
                        <span className="w-0.5 h-3 bg-brand-light animate-bounce" style={{ animationDelay: '0.3s' }} />
                      </span>
                    ) : (
                      idx + 1
                    )}
                  </span>
                  <button className="w-6 hidden group-hover:flex items-center justify-center text-white">
                    <Play className="w-4 h-4 fill-current text-brand-light" />
                  </button>

                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-11 h-11 rounded-xl object-cover shadow flex-shrink-0"
                  />

                  <div className="min-w-0 pr-4">
                    <p
                      className={`font-bold text-xs sm:text-sm truncate transition-colors ${
                        isCurrent ? 'text-brand-light' : 'text-white group-hover:text-brand-light'
                      }`}
                    >
                      {track.title}
                    </p>
                    <p className="text-[11px] text-text-muted truncate font-medium">
                      {track.artistName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
                  <span className="text-xs text-text-muted hidden md:inline-block max-w-[140px] truncate">
                    {track.albumTitle || 'Single'}
                  </span>

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

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTrackFromPlaylist(playlist.id, track.id);
                    }}
                    className="p-1.5 rounded-full text-text-muted hover:text-red-400 hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remover da playlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <span className="text-xs text-text-muted font-mono w-10 text-right">
                    {formatSecondsToTime(track.durationSeconds || 30)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
};
