import { useState, useEffect } from 'react';
import { useRouter } from '@/app/routes/router';
import { usePlayer } from '@/stores/playerContext';
import { Navbar } from './components/Navbar';
import { BrandIntro } from './components/BrandIntro';
import { BrandRevealHero } from './components/BrandRevealHero';
import { ArtworkCarousel } from './components/ArtworkCarousel';
import { DynamicAtmosphereSection } from './components/DynamicAtmosphereSection';
import { StoryLyrics } from './components/StoryLyrics';
import { PlayerPreviewSection } from './components/PlayerPreviewSection';
import { InfiniteDissolveLoop } from '@/components/common/InfiniteDissolveLoop';
import { FinalCTASection } from './components/FinalCTASection';
import { Footer } from './components/Footer';
import { ApiInspector } from '@/components/common/ApiInspector';
import { PersistentBottomPlayer } from '@/components/player';
import { useFeaturedTracks } from '@/hooks/useFeaturedTracks';
import { Track } from '@/types/domain/music';

export function LandingPage() {
  const { navigate } = useRouter();
  const { play, currentTrack: globalTrack } = usePlayer();
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [trackList, setTrackList] = useState<Track[]>([]);
  const [showIntro, setShowIntro] = useState(true);
  const { tracks: initialTracks } = useFeaturedTracks();

  // Sincroniza a lista de faixas inicial
  useEffect(() => {
    if (initialTracks && initialTracks.length > 0) {
      setTrackList((prev) => (prev.length === 0 ? initialTracks : prev));
    }
  }, [initialTracks]);

  const activeTracks = trackList.length > 0 ? trackList : initialTracks;
  const currentTrack: Track = activeTracks[activeTrackIndex] || activeTracks[0];

  // Inicia o Web Player ao clicar em Ouvir Agora
  const handleStartListening = () => {
    if (currentTrack) {
      play(currentTrack);
    }
    navigate('/app');
  };

  /**
   * Quando uma música é selecionada no carrossel ou aplicada pela busca do Deezer:
   * 1. Se já está na lista, ativa o índice dela.
   * 2. Se for uma nova música (ex: Caio Ocean), adiciona ao topo da lista do carrossel e ativa ela!
   * 3. Dispara a reprodução no motor global de áudio.
   */
  const handleSelectTrack = (track: Track) => {
    const existingIndex = activeTracks.findIndex((t) => t.id === track.id);
    if (existingIndex !== -1) {
      setActiveTrackIndex(existingIndex);
    } else {
      setTrackList([track, ...activeTracks.filter((t) => t.id !== track.id)]);
      setActiveTrackIndex(0);
    }
    play(track);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans antialiased overflow-x-hidden selection:bg-brand-purple selection:text-white relative">
      {/* 0. CINEMATIC BRAND INTRO (O + O -> ∞ -> MooSic -> Landing Page) */}
      {showIntro && <BrandIntro onComplete={() => setShowIntro(false)} />}

      {/* Top Product Navbar */}
      <Navbar onStartClick={handleStartListening} />

      {/* Main Single Narrative Flow */}
      <main className={`relative transition-all duration-700 ${showIntro ? 'filter blur-sm contrast-90 pointer-events-none' : ''} ${globalTrack ? 'pb-24' : ''}`}>
        {/* 1. HERO EXPERIENCE: O som no fluxo do infinito */}
        <BrandRevealHero
          activeTrack={currentTrack}
          onStartClick={handleStartListening}
        />

        {/* 2. DISCOVERY: Fluxo de Descoberta */}
        <ArtworkCarousel
          tracks={activeTracks}
          activeIndex={activeTrackIndex}
          onActiveChange={setActiveTrackIndex}
          onTrackSelect={handleSelectTrack}
        />

        {/* 3. DYNAMIC ATMOSPHERE: Sua música. Sua frequência visual. */}
        <DynamicAtmosphereSection
          tracks={activeTracks}
          activeTrack={currentTrack}
          onSelectTrack={handleSelectTrack}
        />

        {/* 4. SYNCHRONIZED LYRICS: Toda música carrega uma história */}
        <StoryLyrics currentTrack={currentTrack} />

        {/* 5. THE PLAYER: Esculpido para a pureza do áudio */}
        <PlayerPreviewSection currentTrack={currentTrack} />

        {/* 5.5. INFINITE DISSOLVE LOOP: O símbolo do infinito que se desfaz e dá a volta em si mesmo */}
        <InfiniteDissolveLoop />

        {/* 6. CLOSING CTA: Entre no fluxo do infinito. ∞ */}
        <FinalCTASection onStartClick={handleStartListening} />
      </main>

      {/* Product Footer */}
      <Footer />

      {/* Live Deezer Music Engine Inspector */}
      <ApiInspector
        activeTrack={currentTrack}
        onApplyTrack={handleSelectTrack}
      />

      {/* Player Persistente Fixo no Rodapé (se houver música ativa) */}
      {globalTrack && <PersistentBottomPlayer />}
    </div>
  );
}
