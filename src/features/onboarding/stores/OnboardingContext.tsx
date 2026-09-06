import { createContext, useContext, ReactNode } from 'react';
import { useOnboardingStateMachine } from '../hooks/useOnboardingStateMachine';
import { TasteProfileService, tasteProfileService } from '@/services/taste/tasteProfileService';
import { profileRepository } from '@/repositories/profile/profileRepository';
import { useAuth } from '@/stores/authContext';
import { useRouter } from '@/app/routes/router';

type StateMachine = ReturnType<typeof useOnboardingStateMachine>;

interface OnboardingContextValue extends StateMachine {
  service: TasteProfileService;
  skipOnboarding: () => Promise<void>;
  finishOnboarding: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const machine = useOnboardingStateMachine();
  const { user } = useAuth();
  const { navigate } = useRouter();

  const skipOnboarding = async () => {
    if (user?.id) {
      await profileRepository.updateProfile(user.id, { onboarding_status: 'skipped' });
    }
    machine.reset();
    navigate('/app');
  };

  const finishOnboarding = async () => {
    await tasteProfileService.saveOnboardingProgress(machine.draft);
    if (user?.id) {
      await profileRepository.updateProfile(user.id, { onboarding_status: 'completed' });
    }
    machine.reset(); // clears draft and goes back to start internally
    navigate('/app');
  };

  return (
    <OnboardingContext.Provider 
      value={{ 
        ...machine, 
        service: tasteProfileService,
        skipOnboarding,
        finishOnboarding
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
