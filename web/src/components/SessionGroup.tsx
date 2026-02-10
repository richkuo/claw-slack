"use client";

import type { SessionGroup as SessionGroupType } from '@/lib/types';

interface SessionGroupProps {
  group: SessionGroupType;
  activeSessionKey: string | null;
  onSessionSelect: (sessionKey: string) => void;
}

export default function SessionGroup({
  group,
  activeSessionKey,
  onSessionSelect
}: SessionGroupProps) {
  const kindLabels: Record<string, string> = {
    'main': '💬 Main',
    'isolated': '🔒 Isolated', 
    'agent': '🤖 Agents',
    'temp': '⏱️ Temporary',
    'shared': '👥 Shared',
  };

  const kindLabel = kindLabels[group.kind] || `📁 ${group.kind}`;

  return (
    <div className="mb-4">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
        {kindLabel}
      </h3>
      <div className="space-y-1">
        {group.sessions.map((session) => {
          const isActive = session.sessionKey === activeSessionKey;
          const displayName = session.label || session.sessionKey;
          
          return (
            <button
              key={session.sessionKey}
              onClick={() => onSessionSelect(session.sessionKey)}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <div className="truncate text-sm font-medium">
                {displayName}
              </div>
              {session.status && (
                <div className="text-xs text-slate-400 truncate">
                  {session.status}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}