// Color palette matching the web app exactly
export const Colors = {
  bgPrimary: '#0f172a',
  bgSecondary: '#1e293b',
  bgTertiary: '#334155',
  bgHover: '#475569',
  textPrimary: '#f8fafc',
  textSecondary: '#cbd5e1',
  textMuted: '#94a3b8',
  accent: '#0ea5e9',
  accentHover: '#0284c7',
  success: '#10b981',
  danger: '#ef4444',
  border: '#334155',
};

// Role-based colors for messages
export const MessageColors = {
  user: {
    background: '#2563eb',
    text: '#ffffff',
    avatar: '👤',
  },
  assistant: {
    background: '#374151',
    text: '#f3f4f6',
    avatar: '🤖',
  },
  system: {
    background: '#92400e',
    text: '#fef3c7',
    avatar: '⚙️',
  },
  tool: {
    background: '#7c3aed',
    text: '#f3e8ff',
    avatar: '🔧',
  },
} as const;