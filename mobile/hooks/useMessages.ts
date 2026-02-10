import { useState, useEffect, useCallback, useRef } from 'react';
import type { SessionMessage, MessageHistoryResponse } from '../lib/types';
import { GatewayClient } from '../lib/gateway';

export function useMessages(client: GatewayClient | null, sessionKey: string | null) {
  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageCountRef = useRef(0);

  const fetchMessages = useCallback(async (showLoading = false) => {
    if (!client || !sessionKey) {
      setMessages([]);
      return;
    }

    if (showLoading) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const result = await client.getSessionHistory(sessionKey, 50, false);
      if (result.success && result.data) {
        setMessages(result.data.messages);
        setHasMore(result.data.hasMore || false);
        lastMessageCountRef.current = result.data.messages.length;
      } else {
        setError(result.error || 'Failed to fetch messages');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }, [client, sessionKey]);

  // Send a message
  const sendMessage = useCallback(async (content: string): Promise<boolean> => {
    if (!client || !sessionKey || !content.trim()) return false;

    setIsSending(true);
    setError(null);

    try {
      const result = await client.sendMessage(sessionKey, content.trim());
      if (result.success) {
        // Fetch messages immediately after sending
        await fetchMessages();
        return true;
      } else {
        setError(result.error || 'Failed to send message');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      return false;
    } finally {
      setIsSending(false);
    }
  }, [client, sessionKey, fetchMessages]);

  // Initial load when session changes
  useEffect(() => {
    if (sessionKey) {
      fetchMessages(true);
      lastMessageCountRef.current = 0;
    } else {
      setMessages([]);
      setError(null);
    }
  }, [sessionKey, fetchMessages]);

  // Poll for new messages every 5 seconds
  useEffect(() => {
    if (!client || !sessionKey) {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      return;
    }

    const poll = async () => {
      try {
        const result = await client.getSessionHistory(sessionKey, 50, false);
        if (result.success && result.data) {
          const newMessageCount = result.data.messages.length;
          // Only update if message count changed to avoid unnecessary re-renders
          if (newMessageCount !== lastMessageCountRef.current) {
            setMessages(result.data.messages);
            setHasMore(result.data.hasMore || false);
            lastMessageCountRef.current = newMessageCount;
          }
        }
      } catch (err) {
        // Silent fail for polling - don't show errors for background updates
        console.warn('Message polling failed:', err);
      }
    };

    pollIntervalRef.current = setInterval(poll, 5000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [client, sessionKey]);

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  return {
    messages,
    isLoading,
    isSending,
    error,
    hasMore,
    sendMessage,
    refetch: () => fetchMessages(true),
  };
}