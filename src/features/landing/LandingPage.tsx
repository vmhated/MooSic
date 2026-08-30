import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { BrandRevealHero } from './components/BrandRevealHero';
import { ArtworkCarousel } from './components/ArtworkCarousel';
import { StoryMovement } from './components/StoryMovement';
import { StoryLyrics } from './components/StoryLyrics';
import { StoryDiscovery } from './components/StoryDiscovery';
import { PlayerPreviewSection } from './components/PlayerPreviewSection';
import { Footer } from './components/Footer';
import { MOCK_HERO_TRACKS, MockTrack } from './data/mockMusicData';

export function LandingPage() {
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const currentTrack: MockTrack = MOCK_HERO_TRACKS[activeTrackIndex] || MOCK_HERO_TRACKS[0];

  const handleStartListening = () => {
    const el = document.getElementById('player-preview');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans antialiased overflow-x-hidden selection:bg-brand-purple selection:text-white relative">
      {/* Top Navbar */}
      <Navbar onStartClick={handleStartListening} />

      {/* Main Content Sections */}
      <main className="relative">
        {/* SECTION 1: HERO & BRAND REVEAL (O + O -> ∞ -> MooSic) */}
        <BrandRevealHero
          activeAccentColor={currentTrack.accent}
          onExploreClick={handleStartListening}
        />

        {/* SECTION 2: ARTWORK SCROLL CAROUSEL (Middle of Hero - Continuous Discovery) */}
        <div className="relative -mt-6 sm:-mt-10 pb-16">
          <ArtworkCarousel
            tracks={MOCK_HERO_TRACKS}
            activeIndex={activeTrackIndex}
            onActiveChange={setActiveTrackIndex}
            onTrackSelect={(track) => {
              const idx = MOCK_HERO_TRACKS.findIndex((t) => t.id === track.id);
              if (idx !== -1) setActiveTrackIndex(idx);
            }}
          />
        </div>

        {/* SECTION 3: STORYTELLING (Music that moves with you, Every song has a story, Discover without limits) */}
        <div id="storytelling" className="relative space-y-8 divide-y divide-surface-border/40">
          <StoryMovement />
          <StoryLyrics />
          <StoryDiscovery />
        </div>

        {/* SECTION 4: PLAYER PREVIEW */}
        <div id="player-preview" className="relative">
          <PlayerPreviewSection currentTrack={currentTrack} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
