import React from 'react';
import { OnboardingProvider, OnboardingShell } from '../onboarding';

export const WelcomePage: React.FC = () => {
  return (
    <OnboardingProvider>
      <OnboardingShell />
    </OnboardingProvider>
  );
};
