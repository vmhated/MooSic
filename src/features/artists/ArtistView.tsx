import React, { useState, useEffect } from 'react';
import { usePlayer } from '@/stores/playerContext';
import { usePlaylists } from '@/stores/playlistStore';
import { useRouter } from '@/app/routes/router';
import { musicService } from '@/services/music/musicService';
import { artistMetadataService, ArtistMetadata, DEFAULT_NEUTRAL_COVER } from '@/services/metadata/artistMetadataService';
import { AUTHENTIC_ALBUMS, AuthenticAlbumInfo } from '@/services/metadata/authenticCatalogRegistry';
import { Track } from '@/types/domain/music';
import { TrackRow } from '@/components/music/TrackRow';
import { AlbumCard } from '@/components/music/AlbumCard';
import { PlayButton } from '@/components/ui/PlayButton';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Users,
  MapPin,
  Edit3,
  Save,
  X,
  Radio,
  Disc,
} from 'lucide-react';

interface ArtistViewProps {
  artistId: string;
}

function normalizeString(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

export const ArtistView: React.FC<ArtistViewProps> = ({ artistId }) => {
  const { setQueue, currentTrack, isPlaying, toggleLike, isLiked } = usePlayer();
  const { openAddToPlaylistModal } = usePlaylists();
  const { navigate } = useRouter();

  const [tracks, setTracks] = useState<Track[]>([]);
  const [artistName, setArtistName] = useState<string>('Artista');
  const [metadata, setMetadata] = useState<ArtistMetadata | null>(null);
  const [artistAlbums, setArtistAlbums] = useState<AuthenticAlbumInfo[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado do Modal de Edição de Metadados
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editMonthlyListeners, setEditMonthlyListeners] = useState('');
  const [editOrigin, setEditOrigin] = useState('');
  const [editGenre, setEditGenre] = useState('');

  useEffect(() => {
    let mounted = true;

    async function fetchArtistData() {
      try {
        const decodedName = decodeURIComponent(artistId.replace(/-/g, ' '));
        setArtistName(decodedName);

        const [searchResult, meta] = await Promise.all([
          musicService.search(decodedName),
          artistMetadataService.getArtistMetadata(decodedName),
        ]);

        if (mounted) {
          setTracks(searchResult.tracks);
          setMetadata(meta);
          setEditAvatarUrl(meta.avatarUrl);
          setEditBio(meta.bio);
          setEditMonthlyListeners(meta.monthlyListeners);
          setEditOrigin(meta.origin);
          setEditGenre(meta.genre);

          // Encontra todos os álbuns associados a este artista
          const normArtist = normalizeString(decodedName);
          const albumsFound = Object.values(AUTHENTIC_ALBUMS).filter((album) => {
            const matchArtist = normalizeString(album.artistName);
            return (
              matchArtist === normArtist ||
              matchArtist.includes(normArtist) ||
              normArtist.includes(matchArtist)
            );
          });
          setArtistAlbums(albumsFound);
        }
      } catch {
        // Fallback gracioso
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchArtistData();

    return () => {
      mounted = false;
    };
  }, [artistId]);

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      setQueue(tracks, 0, {
        type: 'artist',
        title: artistName,
      });
    }
  };

  const handlePlayTrack = (index: number) => {
    setQueue(tracks, index, {
      type: 'artist',
      title: artistName,
      position: index,
    });
  };

  const handleSaveCustomMetadata = (e: React.FormEvent) => {
    e.preventDefault();
    if (!metadata) return;

    const updated = artistMetadataService.updateArtistMetadata(artistName, {
      avatarUrl: editAvatarUrl.trim() || metadata.avatarUrl,
      bio: editBio.trim() || metadata.bio,
      monthlyListeners: editMonthlyListeners.trim() || metadata.monthlyListeners,
      origin: editOrigin.trim() || metadata.origin,
      genre: editGenre.trim() || metadata.genre,
    });

    setMetadata(updated);
    setIsEditingMetadata(false);
  };

  const heroCover =
    metadata?.avatarUrl ||
    artistMetadataService.getCachedAvatar(artistName) ||
    tracks[0]?.coverUrl ||
    DEFAULT_NEUTRAL_COVER;

  const isArtistCurrent = tracks.some((t) => t.id === currentTrack?.id);

  return (
    <div className="space-y-10 select-none w-full max-w-[1720px] mx-auto pb-32">
      {/* Barra Superior de Ações */}
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
          title="Editar ou atualizar foto e metadados salvos"
        >
          <Edit3 className="w-3.5 h-3.5 text-brand-light" />
          <span>Ajustar Metadados</span>
        </button>
      </div>

      {/* 1. Hero do Artista com Retrato Oficial e Atmosfera Dinâmica */}
      <div className="relative rounded-4xl p-6 sm:p-10 bg-gradient-to-r from-[#0D0E14] via-[#141520] to-[#0A0B10] border border-white/[0.1] shadow-2xl overflow-hidden flex flex-col md:flex-row items-center gap-8">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 filter blur-3xl pointer-events-none transition-all duration-700"
          style={{ backgroundImage: `url(${heroCover})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07080B] via-[#07080B]/85 to-transparent pointer-events-none" />

        {/* Retrato Circular Oficial de Alta Resolução */}
        <div className="relative z-10 w-44 h-44 sm:w-56 sm:h-56 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl flex-shrink-0 group">
          <img
            src={heroCover}
            alt={artistName}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                tracks[0]?.coverUrl || DEFAULT_NEUTRAL_COVER;
            }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {metadata?.verified && (
            <div className="absolute bottom-2 right-2 bg-brand-purple text-white p-1 rounded-full shadow-lg border border-white/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Informações Editoriais e Metadados Oficiais */}
        <div className="relative z-10 space-y-3 text-center md:text-left min-w-0 flex-1">
          <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
            <Badge variant="brand" icon={<Sparkles className="w-3 h-3 text-brand-light" />}>
              {metadata?.verified ? 'Artista Oficial Verificado' : 'Artista do Catálogo'}
            </Badge>
            <Badge variant="hires">
              Hi-Res Audio 24-bit
            </Badge>
            {metadata?.genre && (
              <span className="text-[11px] font-mono font-bold text-text-secondary bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-white/[0.06]">
                {metadata.genre}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight truncate">
            {artistName}
          </h1>

          {/* Dados Estatísticos e Origem */}
          <div className="flex items-center justify-center md:justify-start gap-4 text-xs sm:text-sm text-text-muted font-medium flex-wrap">
            {metadata?.monthlyListeners && (
              <span className="flex items-center gap-1.5 text-text-secondary">
                <Users className="w-3.5 h-3.5 text-brand-light" />
                <span>{metadata.monthlyListeners}</span>
              </span>
            )}
            {metadata?.origin && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-purple" />
                <span>{metadata.origin}</span>
              </span>
            )}
            <span>•</span>
            <span>
              {tracks.length} {tracks.length === 1 ? 'faixa disponível' : 'faixas no acervo'}
            </span>
          </div>

          {/* Biografia Curada */}
          {metadata?.bio && (
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl pt-1 line-clamp-2 sm:line-clamp-3">
              {metadata.bio}
            </p>
          )}

          {/* Botões de Ação */}
          <div className="pt-2 flex items-center justify-center md:justify-start gap-3">
            <button
              onClick={handlePlayAll}
              className="flex items-center gap-2.5 px-7 py-3 rounded-full bg-white text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              <PlayButton isPlaying={isArtistCurrent && isPlaying} size="sm" variant="white" />
              <span>Tocar Discografia</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Seção de Discografia & Álbuns Oficiais (se houver) */}
      {artistAlbums.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Disc className="w-4 h-4 text-brand-light" />
              <span>Discografia & Álbuns Oficiais</span>
            </h2>
            <span className="text-xs font-mono text-text-muted">
              {artistAlbums.length} {artistAlbums.length === 1 ? 'álbum oficial' : 'álbuns oficiais'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
            {artistAlbums.map((album) => (
              <AlbumCard
                key={album.id}
                id={album.id}
                title={album.title}
                artistName={album.artistName}
                coverUrl={album.coverUrl}
                year={album.releaseYear}
                trackCount={album.totalTracks}
                onClick={() => navigate(`/app/album/${encodeURIComponent(album.title)}`)}
                onPlay={() => navigate(`/app/album/${encodeURIComponent(album.title)}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 3. Faixas Populares do Artista */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Radio className="w-4 h-4 text-brand-purple" />
            <span>Faixas em Destaque</span>
          </h2>
          <span className="text-xs font-mono text-text-muted">
            {tracks.length} gravações encontradas
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
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. Modal de Edição e Persistência de Metadados */}
      {isEditingMetadata && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#10111A] border border-white/15 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-brand-light" />
                <h3 className="text-base font-black text-white">
                  Editar Metadados & Foto: {artistName}
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
                  URL da Foto Oficial (Retrato HD):
                </label>
                <input
                  type="url"
                  value={editAvatarUrl}
                  onChange={(e) => setEditAvatarUrl(e.target.value)}
                  placeholder="https://exemplo.com/foto-artista.jpg"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-secondary font-bold mb-1">
                    Gênero Principal:
                  </label>
                  <input
                    type="text"
                    value={editGenre}
                    onChange={(e) => setEditGenre(e.target.value)}
                    placeholder="Trap / Rap / Pop"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary font-bold mb-1">
                    Ouvintes Mensais:
                  </label>
                  <input
                    type="text"
                    value={editMonthlyListeners}
                    onChange={(e) => setEditMonthlyListeners(e.target.value)}
                    placeholder="8.4M ouvintes mensais"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-secondary font-bold mb-1">
                  Origem / Cidade:
                </label>
                <input
                  type="text"
                  value={editOrigin}
                  onChange={(e) => setEditOrigin(e.target.value)}
                  placeholder="São Paulo, SP - Brasil"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div>
                <label className="block text-text-secondary font-bold mb-1">
                  Biografia do Artista:
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  placeholder="Biografia e história artística..."
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-purple resize-none"
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
