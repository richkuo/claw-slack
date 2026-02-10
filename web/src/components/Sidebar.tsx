"use client";

import SessionGroup from './SessionGroup';
import type { SessionGroup as SessionGroupType } from '@/lib/types';

interface SidebarProps {
  sessionGroups: SessionGroupType[];
  activeSessionKey: string | null;
  onSessionSelect: (sessionKey: string) => void;
  isLoading: boolean;
  error?: string | null;
  isOpen: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  sessionGroups,
  activeSessionKey,
  onSessionSelect,
  isLoading,
  error,
  isOpen,
  onClose
}: SidebarProps) {
  const handleSessionSelect = (sessionKey: string) => {
    onSessionSelect(sessionKey);
    // Close sidebar on mobile after selection
    if (onClose && window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-slate-800 border-r border-slate-700
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-xl">🦞</span>
                claw-slack
              </h1>
              {onClose && (
                <button
                  onClick={onClose}
                  className="md:hidden text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Sessions */}
          <div className="flex-1 overflow-y-auto p-2">
            {isLoading && sessionGroups.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <div className="text-slate-400 text-sm">Loading sessions...</div>
              </div>
            )}

            {error && sessionGroups.length === 0 && (
              <div className="p-4 text-center">
                <div className="text-red-400 text-sm mb-2">Failed to load sessions</div>
                <div className="text-slate-500 text-xs">{error}</div>
              </div>
            )}

            {sessionGroups.length === 0 && !isLoading && !error && (
              <div className="p-4 text-center">
                <div className="text-slate-400 text-sm">No sessions found</div>
                <div className="text-slate-500 text-xs mt-1">
                  Check your gateway connection
                </div>
              </div>
            )}

            {sessionGroups.map((group) => (
              <SessionGroup
                key={group.kind}
                group={group}
                activeSessionKey={activeSessionKey}
                onSessionSelect={handleSessionSelect}
              />
            ))}
          </div>

          {/* Refresh hint */}
          {sessionGroups.length > 0 && (
            <div className="p-3 border-t border-slate-700">
              <div className="text-xs text-slate-500 text-center">
                Sessions refresh every 30s
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}