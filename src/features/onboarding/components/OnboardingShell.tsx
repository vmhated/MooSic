import React from 'react';
import { useOnboarding } from '../stores/OnboardingContext';
import { WelcomeStep } from './steps/WelcomeStep';
import { ArtistPicker } from './steps/ArtistPicker';
import { GenrePicker } from './steps/GenrePicker';
import { DiscoveryStylePicker } from './steps/DiscoveryStylePicker';
import { ProfileReveal } from './steps/ProfileReveal';

export const OnboardingShell: React.FC = () => {
  const { currentStep, isRestored } = useOnboarding();

  if (!isRestored) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="w-8 h-8 border-4 border-brand-light border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeStep />;
      case 'artist_selection':
        return <ArtistPicker />;
      case 'genre_selection':
        return <GenrePicker />;
      case 'discovery_style':
        return <DiscoveryStylePicker />;
      case 'profile_reveal':
        return <ProfileReveal />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0A0A0A] text-white z-50 overflow-hidden flex flex-col font-jakarta">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-brand-main blur-[120px] mix-blend-screen opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-900 blur-[140px] mix-blend-screen opacity-30"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col w-full h-full max-h-screen overflow-y-auto overflow-x-hidden">
        {renderStep()}
      </div>
    </div>
  );
};
