import type { GatewayConfig } from './types';

const STORAGE_KEYS = {
  GATEWAY_CONFIG: 'claw-slack-gateway-config',
  ACTIVE_SESSION: 'claw-slack-active-session',
} as const;

export function getGatewayConfig(): GatewayConfig | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.GATEWAY_CONFIG);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function setGatewayConfig(config: GatewayConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GATEWAY_CONFIG, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save gateway config:', error);
  }
}

export function getActiveSession(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
  } catch {
    return null;
  }
}

export function setActiveSession(sessionKey: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, sessionKey);
  } catch (error) {
    console.error('Failed to save active session:', error);
  }
}