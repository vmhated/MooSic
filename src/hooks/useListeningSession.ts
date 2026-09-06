import { useState, useEffect } from 'react';
import { sessionService } from '@/services/session/sessionService';
import { ListeningSession, HistoryItem } from '@/types/domain/session';

export function useListeningSession() {
  const [activeSession, setActiveSession] = useState<ListeningSession | null>(() =>
    sessionService.getActiveSession()
  );
  const [lastSession, setLastSession] = useState<ListeningSession | null>(() =>
    sessionService.getLastCompletedSession()
  );
  const [recentSessions, setRecentSessions] = useState<ListeningSession[]>(() =>
    sessionService.getRecentSessions(10)
  );
  const [history, setHistory] = useState<HistoryItem[]>(() => sessionService.getHistory(50));

  useEffect(() => {
    const update = () => {
      setActiveSession(sessionService.getActiveSession());
      setLastSession(sessionService.getLastCompletedSession());
      setRecentSessions(sessionService.getRecentSessions(10));
      setHistory(sessionService.getHistory(50));
    };

    update();
    const unsubscribe = sessionService.subscribe(update);
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    activeSession,
    lastSession,
    recentSessions,
    history,
    clearHistory: () => sessionService.clearHistory(),
  };
}
