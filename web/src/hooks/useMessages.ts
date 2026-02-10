"use client";

import { useState, useEffect, useCallback } from 'react';
import type { SessionMessage } from '@/lib/types';
import { GatewayClient } from '@/lib/gateway';

export function useMessages(
  client: GatewayClient | null, 
  sessionKey: string | null,
  autoRefresh = true
) {
  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!client || !sessionKey) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await client.getSessionHistory(sessionKey, 100, false);
      if (result.success && result.data) {
        // Convert messages to expected format with IDs
        const formattedMessages: SessionMessage[] = result.data.messages.map((msg, index) => ({
          id: `${sessionKey}-${index}-${Date.now()}`,
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp || new Date().toISOString(),
          toolCall: msg.toolCall,
          toolName: msg.toolName,
        }));
        setMessages(formattedMessages);
      } else {
        setError(result.error || 'Failed to fetch messages');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [client, sessionKey]);

  const sendMessage = useCallback(async (content: string) => {
    if (!client || !sessionKey) return false;

    try {
      const result = await client.sendMessage(sessionKey, content);
      if (result.success) {
        // Add the user message immediately for better UX
        const userMessage: SessionMessage = {
          id: `user-${Date.now()}`,
          role: 'user',
          content,
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, userMessage]);
        
        // Refresh to get the assistant's response
        setTimeout(fetchMessages, 500);
        return true;
      } else {
        setError(result.error || 'Failed to send message');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    }
  }, [client, sessionKey, fetchMessages]);

  // Load messages when session changes
  useEffect(() => {
    if (sessionKey) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [sessionKey, fetchMessages]);

  // Auto-refresh messages every 5 seconds when session is active
  useEffect(() => {
    if (!client || !sessionKey || !autoRefresh) return;

    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [client, sessionKey, autoRefresh, fetchMessages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    refetch: fetchMessages,
  };
}