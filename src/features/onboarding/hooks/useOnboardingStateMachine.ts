import { useState, useCallback, useEffect } from 'react';
import { TasteProfile } from '@/types/domain/taste';
import { onboardingStorage } from '../utils/onboardingStorage';

export type OnboardingStepId = 
  | 'welcome' 
  | 'artist_selection'
  | 'genre_selection'
  | 'track_selection'
  | 'album_selection'
  | 'language_selection'
  | 'era_selection'
  | 'mood_selection'
  | 'moment_selection'
  | 'intensity_selection'
  | 'discovery_style'
  | 'disliked_artists'
  | 'profile_reveal'
  | 'completed';

export interface OnboardingState {
  currentStep: OnboardingStepId;
  history: OnboardingStepId[];
  draft: Partial<TasteProfile>;
  isRestored: boolean;
}

export function useOnboardingStateMachine() {
  const [state, setState] = useState<OnboardingState>({
    currentStep: 'welcome',
    history: [],
    draft: {
      favorite_artists: [],
      favorite_genres: [],
      favorite_tracks: [],
      favorite_albums: [],
      disliked_artists: [],
      languages: [],
      decades: [],
      moods: [],
      moments: [],
      discovery_style: null,
    },
    isRestored: false,
  });

  // Restore draft from local storage on mount
  useEffect(() => {
    const savedDraft = onboardingStorage.getDraft();
    const savedStep = onboardingStorage.getStep() as OnboardingStepId;
    
    if (savedDraft) {
      setState(prev => ({
        ...prev,
        draft: { ...prev.draft, ...savedDraft },
        currentStep: savedStep && savedStep !== 'completed' ? savedStep : 'welcome',
        isRestored: true
      }));
    } else {
      setState(prev => ({ ...prev, isRestored: true }));
    }
  }, []);

  const updateDraft = useCallback((updates: Partial<TasteProfile>) => {
    setState(prev => {
      const newDraft = { ...prev.draft, ...updates };
      onboardingStorage.saveDraft(newDraft);
      return { ...prev, draft: newDraft };
    });
  }, []);

  const transitionTo = useCallback((nextStep: OnboardingStepId) => {
    setState(prev => {
      const newHistory = [...prev.history, prev.currentStep];
      onboardingStorage.saveStep(nextStep);
      return {
        ...prev,
        history: newHistory,
        currentStep: nextStep
      };
    });
  }, []);

  const back = useCallback(() => {
    setState(prev => {
      if (prev.history.length === 0) return prev;
      const newHistory = [...prev.history];
      const previousStep = newHistory.pop()!;
      onboardingStorage.saveStep(previousStep);
      return {
        ...prev,
        history: newHistory,
        currentStep: previousStep
      };
    });
  }, []);

  // Adaptive Decision Engine
  const next = useCallback(() => {
    const { currentStep, draft } = state;

    switch (currentStep) {
      case 'welcome':
        transitionTo('artist_selection');
        break;
      
      case 'artist_selection':
        // Se escolheu artistas suficientes, pula gêneros temporariamente e vai para perfil
        // No momento, vamos direto para genre_selection ou tracks.
        // O usuário pediu "Welcome -> ArtistPicker -> next decision".
        // Vamos simular a decisão:
        if ((draft.favorite_artists?.length || 0) > 3) {
          transitionTo('discovery_style'); // Se já escolheu vários, talvez pular direto pra descoberta
        } else {
          transitionTo('genre_selection'); // Se escolheu pouco, aprofundar em gêneros
        }
        break;

      case 'genre_selection':
        transitionTo('discovery_style');
        break;
        
      case 'discovery_style':
        transitionTo('profile_reveal');
        break;
        
      case 'profile_reveal':
        transitionTo('completed');
        onboardingStorage.clearDraft(); // Limpar ao finalizar
        break;

      default:
        console.warn('Unhandled transition from', currentStep);
    }
  }, [state, transitionTo]);

  const reset = useCallback(() => {
    onboardingStorage.clearDraft();
    setState({
      currentStep: 'welcome',
      history: [],
      draft: {
        favorite_artists: [],
        favorite_genres: [],
        favorite_tracks: [],
        favorite_albums: [],
        disliked_artists: [],
        languages: [],
        decades: [],
        moods: [],
        moments: [],
        discovery_style: null,
      },
      isRestored: true,
    });
  }, []);

  return {
    currentStep: state.currentStep,
    draft: state.draft,
    isRestored: state.isRestored,
    canGoBack: state.history.length > 0,
    updateDraft,
    next,
    back,
    transitionTo,
    reset,
  };
}
