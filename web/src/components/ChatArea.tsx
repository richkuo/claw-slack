"use client";

import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import type { SessionMessage, GatewaySession } from '@/lib/types';

interface ChatAreaProps {
  session: GatewaySession | null;
  messages: SessionMessage[];
  isLoading: boolean;
  error?: string | null;
}

export default function ChatArea({
  session,
  messages,
  isLoading,
  error
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="text-6xl mb-4">🦞</div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Welcome to claw-slack
          </h2>
          <p className="text-slate-400">
            Select a session from the sidebar to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white">
              {session.label || session.sessionKey}
            </h1>
            <p className="text-sm text-slate-400">
              {session.kind} session
              {session.status && ` • ${session.status}`}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400">
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Messages */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-6 py-4"
      >
        {error && (
          <div className="mb-4 p-4 bg-red-900 border border-red-700 rounded-lg">
            <div className="text-red-300 text-sm font-medium mb-1">
              Error loading messages
            </div>
            <div className="text-red-400 text-sm">{error}</div>
          </div>
        )}

        {messages.length === 0 && !isLoading && !error && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-medium text-white mb-2">
                No messages yet
              </h3>
              <p className="text-slate-400">
                Start a conversation in this session
              </p>
            </div>
          </div>
        )}

        <div className="space-y-1">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
            />
          ))}
        </div>

        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}