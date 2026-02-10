export interface GatewaySession {
  sessionKey: string;
  kind: string;
  label?: string;
  status?: string;
  created?: string;
  lastActivity?: string;
}

export interface SessionMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: string;
  toolCall?: boolean;
  toolName?: string;
}

export interface GatewayConfig {
  url: string;
  token: string;
}

export interface GatewayStatus {
  status: string;
  version?: string;
  uptime?: number;
}

export interface SessionGroup {
  kind: string;
  sessions: GatewaySession[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface MessageHistoryResponse {
  messages: SessionMessage[];
  hasMore?: boolean;
}