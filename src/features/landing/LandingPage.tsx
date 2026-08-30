import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { BrandIntro } from './components/BrandIntro';
import { BrandRevealHero } from './components/BrandRevealHero';
import { ArtworkCarousel } from './components/ArtworkCarousel';
import { DynamicAtmosphereSection } from './components/DynamicAtmosphereSection';
import { StoryLyrics } from './components/StoryLyrics';
import { PlayerPreviewSection } from './components/PlayerPreviewSection';
import { FinalCTASection } from './components/FinalCTASection';
import { Footer } from './components/Footer';
import { MOCK_HERO_TRACKS, MockTrack } from './data/mockMusicData';

export function LandingPage() {
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const currentTrack: MockTrack = MOCK_HERO_TRACKS[activeTrackIndex] || MOCK_HERO_TRACKS[0];

  const handleStartListening = () => {
    const el = document.getElementById('player');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectTrack = (track: MockTrack) => {
    const idx = MOCK_HERO_TRACKS.findIndex((t) => t.id === track.id);
    if (idx !== -1) setActiveTrackIndex(idx);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans antialiased overflow-x-hidden selection:bg-brand-purple selection:text-white relative">
      {/* 0. CINEMATIC BRAND INTRO (O + O -> ∞ -> MooSic -> Landing Page) */}
      {showIntro && <BrandIntro onComplete={() => setShowIntro(false)} />}

      {/* Top Product Navbar */}
      <Navbar onStartClick={handleStartListening} />

      {/* Main Single Narrative Flow */}
      <main className={`relative transition-all duration-700 ${showIntro ? 'filter blur-sm contrast-90 pointer-events-none' : ''}`}>
        {/* 1. HERO EXPERIENCE: Sound in Infinite Flow */}
        <BrandRevealHero
          activeTrack={currentTrack}
          onStartClick={handleStartListening}
        />

        {/* 2. DISCOVER WITHOUT LIMITS: Infinite Music Flow */}
        <ArtworkCarousel
          tracks={MOCK_HERO_TRACKS}
          activeIndex={activeTrackIndex}
          onActiveChange={setActiveTrackIndex}
          onTrackSelect={handleSelectTrack}
        />

        {/* 3. DYNAMIC ATMOSPHERE: Your music. Your atmosphere. */}
        <DynamicAtmosphereSection
          tracks={MOCK_HERO_TRACKS}
          activeTrack={currentTrack}
          onSelectTrack={handleSelectTrack}
        />

        {/* 4. SYNCHRONIZED LYRICS: Every song has a story */}
        <StoryLyrics currentTrack={currentTrack} />

        {/* 5. THE PLAYER: Crafted for pure listening */}
        <PlayerPreviewSection currentTrack={currentTrack} />

        {/* 6. CLOSING CTA: Music never stops. ∞ */}
        <FinalCTASection onStartClick={handleStartListening} />
      </main>

      {/* Product Footer */}
      <Footer />
    </div>
  );
}
