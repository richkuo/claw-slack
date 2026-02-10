import { useState, useEffect, useCallback } from 'react';
import type { GatewaySession, SessionGroup } from '../lib/types';
import { GatewayClient } from '../lib/gateway';

export function useSessions(client: GatewayClient | null, autoRefresh = true) {
  const [sessions, setSessions] = useState<GatewaySession[]>([]);
  const [sessionGroups, setSessionGroups] = useState<SessionGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    if (!client) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await client.getSessions();
      if (result.success && result.data) {
        setSessions(result.data);
        
        // Group sessions by kind
        const groups = groupSessionsByKind(result.data);
        setSessionGroups(groups);
      } else {
        setError(result.error || 'Failed to fetch sessions');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  // Auto-refresh sessions every 30 seconds
  useEffect(() => {
    if (!client || !autoRefresh) return;

    fetchSessions();
    const interval = setInterval(fetchSessions, 30000);
    return () => clearInterval(interval);
  }, [client, autoRefresh, fetchSessions]);

  return {
    sessions,
    sessionGroups,
    isLoading,
    error,
    refetch: fetchSessions,
  };
}

function groupSessionsByKind(sessions: GatewaySession[]): SessionGroup[] {
  const groups = sessions.reduce((acc, session) => {
    const kind = session.kind || 'unknown';
    if (!acc[kind]) {
      acc[kind] = [];
    }
    acc[kind].push(session);
    return acc;
  }, {} as Record<string, GatewaySession[]>);

  return Object.entries(groups).map(([kind, sessions]) => ({
    kind,
    sessions: sessions.sort((a, b) => {
      // Sort by label if available, otherwise by sessionKey
      const aLabel = a.label || a.sessionKey;
      const bLabel = b.label || b.sessionKey;
      return aLabel.localeCompare(bLabel);
    }),
  }));
}