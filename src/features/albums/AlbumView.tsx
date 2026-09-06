import React, { useState, useEffect } from 'react';
import { usePlayer } from '@/stores/playerContext';
import { usePlaylists } from '@/stores/playlistStore';
import { useRouter } from '@/app/routes/router';
import { musicService } from '@/services/music/musicService';
import { albumMetadataService, AlbumMetadata, DEFAULT_NEUTRAL_COVER } from '@/services/metadata/albumMetadataService';
import { Track } from '@/types/domain/music';
import { TrackRow } from '@/components/music/TrackRow';
import { PlayButton } from '@/components/ui/PlayButton';
import { Badge } from '@/components/ui/Badge';
import { formatSecondsToTime } from '@/providers/lyrics/lrclibLyricsProvider';
import {
  ArrowLeft,
  Disc,
  Clock,
  Calendar,
  Building2,
  Edit3,
  Save,
  X,
  Radio,
} from 'lucide-react';

interface AlbumViewProps {
  albumId: string;
}

export const AlbumView: React.FC<AlbumViewProps> = ({ albumId }) => {
  const { setQueue, currentTrack, isPlaying, toggleLike, isLiked } = usePlayer();
  const { openAddToPlaylistModal } = usePlaylists();
  const { navigate } = useRouter();

  const [tracks, setTracks] = useState<Track[]>([]);
  const [albumTitle, setAlbumTitle] = useState<string>('Álbum');
  const [artistName, setArtistName] = useState<string>('Artista');
  const [metadata, setMetadata] = useState<AlbumMetadata | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal de edição de metadados do álbum
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  const [editCoverUrl, setEditCoverUrl] = useState('');
  const [editReleaseYear, setEditReleaseYear] = useState<number>(2024);
  const [editLabel, setEditLabel] = useState('');
  const [editGenre, setEditGenre] = useState('');

  useEffect(() => {
    let mounted = true;

    async function fetchAlbumData() {
      try {
        const decodedTitle = decodeURIComponent(albumId.replace(/-/g, ' '));
        setAlbumTitle(decodedTitle);

        // 1. Busca metadados oficiais curados e de alta definição primeiro
        const meta = await albumMetadataService.getAlbumMetadata(decodedTitle);

        // 2. Busca faixas do álbum no motor federado
        let searchResult = await musicService.search(
          meta.artistName && meta.artistName !== 'Artista MooSic'
            ? `${decodedTitle} ${meta.artistName}`
            : decodedTitle
        );

        if (searchResult.tracks.length === 0) {
          searchResult = await musicService.search(decodedTitle);
        }

        const resolvedArtist = meta.artistName || searchResult.tracks[0]?.artistName || 'Artista';
        if (resolvedArtist) setArtistName(resolvedArtist);

        // 3. Garante que cada faixa da lista receba a capa oficial de estúdio do álbum
        const enrichedTracks = searchResult.tracks.map((t: Track) => ({
          ...t,
          coverUrl: meta.coverUrl || t.coverUrl,
          albumTitle: t.albumTitle || decodedTitle,
          artistName: t.artistName || resolvedArtist,
        }));

        if (mounted) {
          setTracks(enrichedTracks);
          setMetadata(meta);
          setEditCoverUrl(meta.coverUrl);
          setEditReleaseYear(meta.releaseYear);
          setEditLabel(meta.label);
          setEditGenre(meta.genre);
        }
      } catch {
        // Fallback
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchAlbumData();

    return () => {
      mounted = false;
    };
  }, [albumId]);

  const totalDuration = tracks.reduce((acc, t) => acc + (t.durationSeconds || 30), 0);

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      setQueue(tracks, 0, {
        type: 'album',
        title: albumTitle,
      });
    }
  };

  const handlePlayTrack = (index: number) => {
    setQueue(tracks, index, {
      type: 'album',
      title: albumTitle,
      position: index,
    });
  };

  const handleSaveCustomMetadata = (e: React.FormEvent) => {
    e.preventDefault();
    if (!metadata) return;

    const updated = albumMetadataService.updateAlbumMetadata(albumTitle, artistName, {
      coverUrl: editCoverUrl.trim() || metadata.coverUrl,
      releaseYear: editReleaseYear || metadata.releaseYear,
      label: editLabel.trim() || metadata.label,
      genre: editGenre.trim() || metadata.genre,
    });

    setMetadata(updated);
    setIsEditingMetadata(false);
  };

  const heroCover =
    metadata?.coverUrl ||
    tracks[0]?.coverUrl ||
    DEFAULT_NEUTRAL_COVER;

  const isAlbumCurrent = tracks.some((t) => t.id === currentTrack?.id);

  return (
    <div className="space-y-8 select-none w-full max-w-[1720px] mx-auto pb-32">
      {/* Barra de Navegação Superior */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-xs font-bold text-text-muted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        <button
          onClick={() => setIsEditingMetadata(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-[11px] font-bold text-text-secondary hover:text-white border border-white/[0.08] transition-all"
          title="Editar ou atualizar capa e metadados salvos do álbum"
        >
          <Edit3 className="w-3.5 h-3.5 text-brand-light" />
          <span>Ajustar Metadados</span>
        </button>
      </div>

      {/* 1. Hero do Álbum com Capa em Alta Definição */}
      <div className="relative rounded-4xl p-6 sm:p-10 bg-gradient-to-r from-[#0D0E14] via-[#141520] to-[#0A0B10] border border-white/[0.1] shadow-2xl overflow-hidden flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 filter blur-3xl pointer-events-none transition-all duration-700"
          style={{ backgroundImage: `url(${heroCover})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07080B] via-[#07080B]/85 to-transparent pointer-events-none" />

        {/* Capa Quadrada Autêntica */}
        <div className="relative z-10 w-44 h-44 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex-shrink-0 group">
          <img
            src={heroCover}
            alt={albumTitle}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_NEUTRAL_COVER;
            }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Informações Editoriais */}
        <div className="relative z-10 space-y-3 text-center sm:text-left min-w-0 flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <Badge variant="brand" icon={<Disc className="w-3 h-3 text-brand-light" />}>
              Álbum Oficial
            </Badge>
            <Badge variant="hires">
              {metadata?.hiResBadge || 'Master 24b / 96kHz'}
            </Badge>
            {metadata?.genre && (
              <span className="text-[11px] font-mono font-bold text-text-secondary bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-white/[0.06]">
                {metadata.genre}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight truncate">
            {albumTitle}
          </h1>

          <p
            onClick={() => navigate(`/app/artist/${encodeURIComponent(artistName)}`)}
            className="text-sm sm:text-base font-bold text-brand-light hover:underline cursor-pointer inline-block"
          >
            {artistName}
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-text-muted font-medium flex-wrap">
            {metadata?.releaseYear && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-text-muted" />
                <span>{metadata.releaseYear}</span>
              </span>
            )}
            {metadata?.label && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 text-text-secondary">
                  <Building2 className="w-3.5 h-3.5 text-brand-purple" />
                  <span>{metadata.label}</span>
                </span>
              </>
            )}
            <span>•</span>
            <span>{tracks.length} faixas</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-text-muted" />
              <span>{formatSecondsToTime(totalDuration)}</span>
            </span>
          </div>

          <div className="pt-2 flex items-center justify-center sm:justify-start gap-3">
            <button
              onClick={handlePlayAll}
              className="flex items-center gap-2.5 px-7 py-3 rounded-full bg-white hover:bg-neutral-100 text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              <PlayButton isPlaying={isAlbumCurrent && isPlaying} size="sm" variant="white" />
              <span>Tocar Álbum</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Tracklist do Álbum */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Radio className="w-4 h-4 text-brand-purple" />
            <span>Faixas do Álbum</span>
          </h2>
          <span className="text-xs font-mono text-text-muted">
            {tracks.length} gravações no disco
          </span>
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 rounded-2xl bg-white/[0.03] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-1.5">
            {tracks.map((track, idx) => (
              <TrackRow
                key={`${track.id}-${idx}`}
                track={track}
                index={idx}
                isCurrent={currentTrack?.id === track.id}
                isPlaying={isPlaying && currentTrack?.id === track.id}
                isLiked={isLiked(track.id)}
                onPlay={() => handlePlayTrack(idx)}
                onToggleLike={() => toggleLike(track.id)}
                onAddToPlaylist={() => openAddToPlaylistModal(track)}
                showAlbum={false}
              />
            ))}
          </div>
        )}
      </section>

      {/* 3. Modal de Edição e Persistência de Metadados do Álbum */}
      {isEditingMetadata && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#10111A] border border-white/15 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-brand-light" />
                <h3 className="text-base font-black text-white">
                  Editar Metadados: {albumTitle}
                </h3>
              </div>
              <button
                onClick={() => setIsEditingMetadata(false)}
                className="p-1 rounded-full text-text-muted hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomMetadata} className="space-y-4 text-xs">
              <div>
                <label className="block text-text-secondary font-bold mb-1">
                  URL da Capa Oficial (1000x1000 HD):
                </label>
                <input
                  type="url"
                  value={editCoverUrl}
                  onChange={(e) => setEditCoverUrl(e.target.value)}
                  placeholder="https://exemplo.com/capa-album.jpg"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-secondary font-bold mb-1">
                    Ano de Lançamento:
                  </label>
                  <input
                    type="number"
                    value={editReleaseYear}
                    onChange={(e) => setEditReleaseYear(parseInt(e.target.value, 10) || 2024)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary font-bold mb-1">
                    Gênero do Disco:
                  </label>
                  <input
                    type="text"
                    value={editGenre}
                    onChange={(e) => setEditGenre(e.target.value)}
                    placeholder="Rap / Trap / Pop"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-secondary font-bold mb-1">
                  Gravadora / Selo Fonográfico:
                </label>
                <input
                  type="text"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  placeholder="30PRAUM / Sony Music / Warner"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingMetadata(false)}
                  className="px-4 py-2 rounded-xl text-text-muted hover:text-white font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-purple hover:bg-brand-purple/90 text-white font-bold shadow-glow"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Metadados</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
