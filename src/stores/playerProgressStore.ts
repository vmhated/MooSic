import { useSyncExternalStore } from 'react';

export interface PlayerProgressState {
  currentTime: number;
  duration: number;
  progressPercent: number;
}

class PlayerProgressStore {
  private state: PlayerProgressState = {
    currentTime: 0,
    duration: 30,
    progressPercent: 0,
  };

  private listeners = new Set<() => void>();

  public subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  public getSnapshot = (): PlayerProgressState => {
    return this.state;
  };

  public getServerSnapshot = (): PlayerProgressState => {
    return this.state;
  };

  public setProgress = (currentTime: number, duration: number) => {
    const validDuration = duration > 0 && isFinite(duration) ? duration : 30;
    const validCurrent = Math.max(0, Math.min(validDuration, isNaN(currentTime) ? 0 : currentTime));
    const progressPercent = Math.min(100, Math.max(0, (validCurrent / validDuration) * 100));

    // Só notifica se houver mudança perceptível para evitar micro-notificações desnecessárias
    const timeDelta = Math.abs(this.state.currentTime - validCurrent);
    if (timeDelta < 0.05 && this.state.duration === validDuration) {
      return;
    }

    this.state = {
      currentTime: validCurrent,
      duration: validDuration,
      progressPercent,
    };

    this.listeners.forEach((listener) => listener());
  };

  public reset = () => {
    this.state = {
      currentTime: 0,
      duration: 30,
      progressPercent: 0,
    };
    this.listeners.forEach((listener) => listener());
  };
}

export const playerProgressStore = new PlayerProgressStore();

/**
 * Hook de escuta de alta frequência para componentes que REALMENTE dependem do progresso
 * (Ex: Scrubber do Player, Letras Sincronizadas).
 * Componentes gerais (Home, Busca, Playlist, Library) NÃO devem usar este hook.
 */
export function usePlayerProgress(): PlayerProgressState {
  return useSyncExternalStore(
    playerProgressStore.subscribe,
    playerProgressStore.getSnapshot,
    playerProgressStore.getServerSnapshot
  );
}
