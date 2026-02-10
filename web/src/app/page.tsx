"use client";

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatArea from '@/components/ChatArea';
import MessageInput from '@/components/MessageInput';
import SettingsModal from '@/components/SettingsModal';
import ConnectionStatus from '@/components/ConnectionStatus';
import { useGateway } from '@/hooks/useGateway';
import { useSessions } from '@/hooks/useSessions';
import { useMessages } from '@/hooks/useMessages';
import { getActiveSession, setActiveSession } from '@/lib/storage';

export default function Home() {
  const {
    client,
    config,
    isConnected,
    isConfigured,
    isConnecting,
    connectionError,
    updateConfig,
  } = useGateway();

  const {
    sessionGroups,
    isLoading: sessionsLoading,
    error: sessionsError,
  } = useSessions(client);

  const [activeSessionKey, setActiveSessionKey] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeSession = sessionGroups
    .flatMap(group => group.sessions)
    .find(session => session.sessionKey === activeSessionKey) || null;

  const {
    messages,
    isLoading: messagesLoading,
    error: messagesError,
    sendMessage,
  } = useMessages(client, activeSessionKey);

  // Load active session from storage on mount
  useEffect(() => {
    const savedSession = getActiveSession();
    if (savedSession) {
      setActiveSessionKey(savedSession);
    }
  }, []);

  // Show settings modal if not configured
  useEffect(() => {
    if (!isConfigured) {
      setShowSettings(true);
    }
  }, [isConfigured]);

  // Save active session to storage
  useEffect(() => {
    if (activeSessionKey) {
      setActiveSession(activeSessionKey);
    }
  }, [activeSessionKey]);

  const handleSessionSelect = (sessionKey: string) => {
    setActiveSessionKey(sessionKey);
    setSidebarOpen(false); // Close sidebar on mobile
  };

  const handleSendMessage = async (message: string): Promise<boolean> => {
    if (!activeSessionKey) return false;
    return await sendMessage(message);
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        sessionGroups={sessionGroups}
        activeSessionKey={activeSessionKey}
        onSessionSelect={handleSessionSelect}
        isLoading={sessionsLoading}
        error={sessionsError}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar - mobile only */}
        <div className="md:hidden bg-slate-800 border-b border-slate-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-slate-300 hover:text-white"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zM3 9h14a1 1 0 010 2H3a1 1 0 010-2zM3 13h14a1 1 0 010 2H3a1 1 0 010-2z"/>
              </svg>
            </button>

            <div className="flex items-center gap-4">
              <ConnectionStatus
                isConnected={isConnected}
                isConnecting={isConnecting}
                error={connectionError}
              />
              
              <button
                onClick={() => setShowSettings(true)}
                className="text-slate-300 hover:text-white"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop header */}
        <div className="hidden md:block bg-slate-800 border-b border-slate-700 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-white">claw-slack</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <ConnectionStatus
                isConnected={isConnected}
                isConnecting={isConnecting}
                error={connectionError}
              />
              
              <button
                onClick={() => setShowSettings(true)}
                className="text-slate-300 hover:text-white p-1 rounded"
                title="Settings"
              >
                ⚙️
              </button>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <ChatArea
          session={activeSession}
          messages={messages}
          isLoading={messagesLoading}
          error={messagesError}
        />

        {/* Message input */}
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={!isConnected || !activeSessionKey}
          placeholder={
            !isConnected
              ? "Not connected to gateway"
              : !activeSessionKey
              ? "Select a session to start chatting"
              : "Type a message..."
          }
        />
      </div>

      {/* Settings modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        config={config}
        onSave={updateConfig}
        isConnected={isConnected}
        connectionError={connectionError}
      />
    </div>
  );
}