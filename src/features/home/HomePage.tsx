import React, { useState, useEffect } from 'react';
import { usePlayer } from '@/stores/playerContext';
import { usePlaylists } from '@/stores/playlistStore';
import { useRouter } from '@/app/routes/router';
import { musicService } from '@/services/music/musicService';
import { Track } from '@/types/domain/music';
import { useListeningSession } from '@/hooks/useListeningSession';
import { LastSessionRecap } from '@/components/session/LastSessionRecap';
import {
  FeaturedMusicCard,
  CompactMusicCard,
  MusicCard,
  TrackRow,
  ArtistCard,
} from '@/components/music';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { LoadingState } from '@/components/ui/LoadingState';
import { HomeRightSidebar } from './components/HomeRightSidebar';
import {
  Flame,
  Radio,
  Coffee,
  Compass,
  Zap,
  ArrowRight,
  Sparkles,
  Users,
} from 'lucide-react';

function getGreeting(): { title: string; subtitle: string } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return {
      title: 'Bom dia',
      subtitle: 'Sintonize a frequência perfeita para iniciar o seu dia.',
    };
  }
  if (hour >= 12 && hour < 18) {
    return {
      title: 'Boa tarde',
      subtitle: 'Mantenha o ritmo e a fluidez com a curadoria do momento.',
    };
  }
  return {
    title: 'Boa noite',
    subtitle: 'Mergulhe em texturas sonoras e frequências noturnas imersivas.',
  };
}

const FEATURED_ARTISTS = [
  {
    id: 'matue',
    name: 'Matuê',
    genre: 'Trap Brasil',
    avatarUrl: 'https://cdn-images.dzcdn.net/images/artist/c42fcb920963cca4d195b939e51f19d1/1000x1000-000000-80-0-0.jpg',
  },
  {
    id: 'the-weeknd',
    name: 'The Weeknd',
    genre: 'R&B / Synthpop',
    avatarUrl: 'https://cdn-images.dzcdn.net/images/artist/581693b4724a7fcfa754455101e13a44/1000x1000-000000-80-0-0.jpg',
  },
  {
    id: 'bk',
    name: "BK'",
    genre: 'Rap Nacional',
    avatarUrl: 'https://cdn-images.dzcdn.net/images/artist/7481fc25e9bf8f0d8c416ecb9104927d/1000x1000-000000-80-0-0.jpg',
  },
  {
    id: 'dua-lipa',
    name: 'Dua Lipa',
    genre: 'Disco Pop',
    avatarUrl: 'https://cdn-images.dzcdn.net/images/artist/877872aaf75694f11d53c318700ab2b5/1000x1000-000000-80-0-0.jpg',
  },
  {
    id: 'djonga',
    name: 'Djonga',
    genre: 'Lírica & Trap',
    avatarUrl: 'https://cdn-images.dzcdn.net/images/artist/a685bd7ab1fd1234b7b420c59ca5be4f/1000x1000-000000-80-0-0.jpg',
  },
];

export const HomePage: React.FC = () => {
  const { setQueue, currentTrack, isPlaying, toggleLike, isLiked } = usePlayer();
  const { openAddToPlaylistModal } = usePlaylists();
  const { lastSession } = useListeningSession();
  const { navigate } = useRouter();

  const [featuredTracks, setFeaturedTracks] = useState<Track[]>([]);
  const [trapTracks, setTrapTracks] = useState<Track[]>([]);
  const [popTracks, setPopTracks] = useState<Track[]>([]);
  const [chillTracks, setChillTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtro rápido de humor
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'trap' | 'pop' | 'chill' | 'artists'>('all');

  // Spotlight index para alternar faixa principal
  const [spotlightIndex, setSpotlightIndex] = useState(0);

  // Paginação nos carrosséis
  const [popIndex, setPopIndex] = useState(0);
  const [chillIndex, setChillIndex] = useState(0);

  const greeting = getGreeting();

  useEffect(() => {
    let mounted = true;

    async function loadFeeds() {
      try {
        const [featuredRes, trapRes, popRes, chillRes] = await Promise.allSettled([
          musicService.getFeaturedTracks(),
          musicService.search('Matue BK Djonga Trap Brasil'),
          musicService.search('The Weeknd Dua Lipa Pop Hits'),
          musicService.search('Lofi Chill Beats Study Synthwave'),
        ]);

        if (mounted) {
          if (featuredRes.status === 'fulfilled') setFeaturedTracks(featuredRes.value);
          if (trapRes.status === 'fulfilled') setTrapTracks(trapRes.value.tracks);
          if (popRes.status === 'fulfilled') setPopTracks(popRes.value.tracks);
          if (chillRes.status === 'fulfilled') setChillTracks(chillRes.value.tracks);
        }
      } catch {
        // Fallback gracioso
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadFeeds();

    return () => {
      mounted = false;
    };
  }, []);

  const handlePlayQueue = (tracksList: Track[], index: number, sectionTitle?: string) => {
    setQueue(tracksList, index, {
      type: 'home',
      title: sectionTitle || 'Home Editorial',
      position: index,
    });
  };

  const pool = featuredTracks.length > 0 ? featuredTracks : trapTracks;
  const spotlightTrack = pool[spotlightIndex] || pool[0];

  // Grade compacta para acesso rápido (combina destaques)
  const quickMixTracks = (featuredTracks.length > 0 ? featuredTracks : pool).slice(0, 8);

  // Composição assimétrica: Faixa destaque + Top 4 laterais
  const splitFeatured = trapTracks[0] || pool[0];
  const splitSideTracks = trapTracks.slice(1, 5);

  return (
    <div className="w-full max-w-[1720px] mx-auto select-none pb-32">
      {/* ================= 1. CONTEXT HEADER ================= */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2 pb-6 border-b border-white/[0.06] mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-light animate-pulse shadow-glow" />
            <span className="text-[11px] font-black uppercase tracking-widest text-brand-light">
              MooSic Live Stream
            </span>
            <span className="text-text-muted text-xs">•</span>
            <span className="text-[11px] text-text-muted font-mono">
              Frequência Pura 432Hz
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            {greeting.title}
          </h1>
          <p className="text-xs sm:text-sm text-text-muted font-medium">
            {greeting.subtitle}
          </p>

          {/* Chips de Filtro Rápido de Humor */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {[
              { id: 'all', label: 'Todas as Frequências', icon: Sparkles },
              { id: 'trap', label: 'Trap & Flow', icon: Flame },
              { id: 'pop', label: 'Pop & Hits', icon: Radio },
              { id: 'chill', label: 'Lo-Fi & Foco', icon: Coffee },
              { id: 'artists', label: 'Artistas em Alta', icon: Users },
            ].map((filter) => {
              const Icon = filter.icon;
              const isActive = selectedFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-brand-purple text-white shadow-glow'
                      : 'bg-white/[0.04] text-text-secondary hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => navigate('/app/search')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-text-secondary hover:text-white border border-white/10 transition-all self-start md:self-auto group flex-shrink-0"
        >
          <Compass className="w-3.5 h-3.5 text-brand-purple group-hover:rotate-45 transition-transform" />
          <span>Explorar Catálogo</span>
          <ArrowRight className="w-3 h-3 text-text-muted group-hover:translate-x-0.5 transition-transform" />
        </button>
      </header>

      {/* ================= 2. LAYOUT RESPONSIVO 2-COLUNAS (FEED + SIDEBAR LATERAL) ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* COLUNA PRINCIPAL (ESQUERDA / CENTRO) */}
        <div className="col-span-1 xl:col-span-8 space-y-10 sm:space-y-12 min-w-0">
          {/* 1. FEATURED MUSICAL EXPERIENCE (SPOTLIGHT) */}
          {(selectedFilter === 'all' || selectedFilter === 'trap') && (
            <div>
              {loading ? (
                <LoadingState type="hero" />
              ) : spotlightTrack ? (
                <FeaturedMusicCard
                  track={spotlightTrack}
                  isCurrent={currentTrack?.id === spotlightTrack.id}
                  isPlaying={isPlaying}
                  isLiked={isLiked(spotlightTrack.id)}
                  onPlay={() => handlePlayQueue(pool, spotlightIndex, 'Spotlight MooSic')}
                  onToggleLike={() => toggleLike(spotlightTrack.id)}
                  onAddToPlaylist={() => openAddToPlaylistModal(spotlightTrack)}
                  currentIndex={spotlightIndex}
                  totalCount={pool.length}
                  onNext={() => setSpotlightIndex((prev) => (prev + 1) % pool.length)}
                  onPrev={() => setSpotlightIndex((prev) => (prev - 1 + pool.length) % pool.length)}
                />
              ) : null}
            </div>
          )}

          {/* 2. CONTINUAR OUVINDO & MIXAGENS RÁPIDAS (GRADE COMPACTA) */}
          {selectedFilter === 'all' && !loading && quickMixTracks.length > 0 && (
            <section className="space-y-3.5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-text-muted flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-brand-purple" />
                  <span>Acesso Rápido & Frequências Recentes</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {quickMixTracks.map((track, idx) => (
                  <CompactMusicCard
                    key={`quick-${track.id}-${idx}`}
                    track={track}
                    isCurrent={currentTrack?.id === track.id}
                    isPlaying={isPlaying && currentTrack?.id === track.id}
                    onPlay={() => handlePlayQueue(quickMixTracks, idx, 'Acesso Rápido')}
                  />
                ))}
              </div>
            </section>
          )}

          {/* 3. RECAP DA ÚLTIMA SESSÃO DE ESCUTA */}
          {selectedFilter === 'all' && (
            <LastSessionRecap session={lastSession} />
          )}

          {/* 4. COMPOSIÇÃO EDITORIAL ASSIMÉTRICA: TRAP & RIMAS URBANAS */}
          {(selectedFilter === 'all' || selectedFilter === 'trap') && !loading && trapTracks.length > 0 && (
            <section className="space-y-4">
              <SectionHeader
                title="Trap & Rimas Urbanas"
                subtitle="Graves 808 marcantes, flow afiado e as maiores produções nacionais"
                icon={Flame}
                tag="Em Alta"
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
                {/* Bloco Esquerdo: Featured Card */}
                {splitFeatured && (
                  <div className="col-span-1 lg:col-span-5">
                    <MusicCard
                      track={splitFeatured}
                      isCurrent={currentTrack?.id === splitFeatured.id}
                      isPlaying={isPlaying && currentTrack?.id === splitFeatured.id}
                      isLiked={isLiked(splitFeatured.id)}
                      onPlay={() => handlePlayQueue(trapTracks, 0, 'Trap & Rimas Urbanas')}
                      onToggleLike={() => toggleLike(splitFeatured.id)}
                      onAddToPlaylist={() => openAddToPlaylistModal(splitFeatured)}
                      onArtistClick={() => navigate(`/app/artist/${encodeURIComponent(splitFeatured.artistName)}`)}
                      className="h-full"
                    />
                  </div>
                )}

                {/* Bloco Direito: Top 4 Faixas em TrackRows de Alta Densidade */}
                <div className="col-span-1 lg:col-span-7 space-y-2 p-3 sm:p-4 rounded-3xl bg-[#0D0E14] border border-white/[0.06] shadow-sm">
                  <div className="flex items-center justify-between px-3 pb-2 border-b border-white/[0.06] text-[10px] font-mono font-bold text-text-muted uppercase">
                    <span>Top Faixas</span>
                    <span>Duração</span>
                  </div>
                  <div className="space-y-1">
                    {splitSideTracks.map((track, idx) => {
                      const realIndex = idx + 1;
                      return (
                        <TrackRow
                          key={`trap-side-${track.id}-${idx}`}
                          track={track}
                          index={idx}
                          isCurrent={currentTrack?.id === track.id}
                          isPlaying={isPlaying && currentTrack?.id === track.id}
                          isLiked={isLiked(track.id)}
                          onPlay={() => handlePlayQueue(trapTracks, realIndex, 'Trap & Rimas Urbanas')}
                          onToggleLike={() => toggleLike(track.id)}
                          onAddToPlaylist={() => openAddToPlaylistModal(track)}
                          onArtistClick={() => navigate(`/app/artist/${encodeURIComponent(track.artistName)}`)}
                          showAlbum={false}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 5. POP & HITS GLOBAIS (GRADE EDITORIAL RESPONSIVA) */}
          {(selectedFilter === 'all' || selectedFilter === 'pop') && !loading && popTracks.length > 0 && (
            <section className="space-y-4">
              <SectionHeader
                title="Pop & Sucessos Globais"
                subtitle="Batidas contagiantes, vocais cintilantes e tendências internacionais"
                icon={Radio}
                hasScrollControls
                onScrollLeft={() => setPopIndex((prev) => Math.max(0, prev - 4))}
                onScrollRight={() => setPopIndex((prev) => Math.min(popTracks.length - 4, prev + 4))}
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-3.5 sm:gap-5">
                {popTracks.slice(popIndex, popIndex + 4).map((track, idx) => {
                  const realIndex = popIndex + idx;
                  return (
                    <MusicCard
                      key={`pop-${track.id}-${idx}`}
                      track={track}
                      isCurrent={currentTrack?.id === track.id}
                      isPlaying={isPlaying && currentTrack?.id === track.id}
                      isLiked={isLiked(track.id)}
                      onPlay={() => handlePlayQueue(popTracks, realIndex, 'Pop & Hits Globais')}
                      onToggleLike={() => toggleLike(track.id)}
                      onAddToPlaylist={() => openAddToPlaylistModal(track)}
                      onArtistClick={() => navigate(`/app/artist/${encodeURIComponent(track.artistName)}`)}
                    />
                  );
                })}
              </div>
            </section>
          )}

          {/* 6. LO-FI & FOCO CÓSMICO (ATMOSFERA SUAVE) */}
          {(selectedFilter === 'all' || selectedFilter === 'chill') && !loading && chillTracks.length > 0 && (
            <section className="space-y-4">
              <SectionHeader
                title="Sessão Lo-Fi & Foco Cósmico"
                subtitle="Texturas orgânicas e sintetizadores analógicos para estudo e desaceleração"
                icon={Coffee}
                hasScrollControls
                onScrollLeft={() => setChillIndex((prev) => Math.max(0, prev - 4))}
                onScrollRight={() => setChillIndex((prev) => Math.min(chillTracks.length - 4, prev + 4))}
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-3.5 sm:gap-5">
                {chillTracks.slice(chillIndex, chillIndex + 4).map((track, idx) => {
                  const realIndex = chillIndex + idx;
                  return (
                    <MusicCard
                      key={`chill-${track.id}-${idx}`}
                      track={track}
                      isCurrent={currentTrack?.id === track.id}
                      isPlaying={isPlaying && currentTrack?.id === track.id}
                      isLiked={isLiked(track.id)}
                      onPlay={() => handlePlayQueue(chillTracks, realIndex, 'Lo-Fi & Foco Cósmico')}
                      onToggleLike={() => toggleLike(track.id)}
                      onAddToPlaylist={() => openAddToPlaylistModal(track)}
                      onArtistClick={() => navigate(`/app/artist/${encodeURIComponent(track.artistName)}`)}
                    />
                  );
                })}
              </div>
            </section>
          )}

          {/* 7. ARTISTAS EM ALTA NO RADAR (CARROSSEL DE ARTISTAS) */}
          {(selectedFilter === 'all' || selectedFilter === 'artists') && (
            <section className="space-y-4">
              <SectionHeader
                title="Artistas em Destaque no Radar"
                subtitle="Os criadores e produtores mais ouvidos no ecossistema MooSic"
                icon={Users}
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
                {FEATURED_ARTISTS.map((artist) => (
                  <ArtistCard
                    key={artist.id}
                    id={artist.id}
                    name={artist.name}
                    genre={artist.genre}
                    avatarUrl={artist.avatarUrl}
                    onClick={() => navigate(`/app/artist/${encodeURIComponent(artist.name)}`)}
                    onPlay={() => {
                      musicService.search(artist.name).then((res) => {
                        if (res.tracks.length > 0) {
                          setQueue(res.tracks, 0, {
                            type: 'artist',
                            title: `Artista: ${artist.name}`,
                            position: 0,
                          });
                        }
                      });
                    }}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* COLUNA LATERAL DIREITA: RADAR & SINTONIA VIVA (VISÍVEL EM TELAS XL/2XL/DESKTOP) */}
        <div className="hidden xl:block xl:col-span-4 sticky top-6">
          <HomeRightSidebar fallbackTracks={featuredTracks} />
        </div>
      </div>
    </div>
  );
};
