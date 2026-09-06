import { TasteProfile } from '@/types/domain/taste';

const STORAGE_KEY = 'moosic_onboarding_draft';
const STORAGE_STEP_KEY = 'moosic_onboarding_step';

export const onboardingStorage = {
  saveDraft: (profile: Partial<TasteProfile>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save onboarding draft', e);
    }
  },

  getDraft: (): Partial<TasteProfile> | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  clearDraft: () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_STEP_KEY);
  },

  saveStep: (stepId: string) => {
    localStorage.setItem(STORAGE_STEP_KEY, stepId);
  },

  getStep: (): string | null => {
    return localStorage.getItem(STORAGE_STEP_KEY);
  }
};
