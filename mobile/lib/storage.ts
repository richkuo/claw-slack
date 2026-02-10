import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GatewayConfig } from './types';

const STORAGE_KEYS = {
  GATEWAY_CONFIG: 'claw-slack-gateway-config',
  ACTIVE_SESSION: 'claw-slack-active-session',
} as const;

export async function getGatewayConfig(): Promise<GatewayConfig | null> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.GATEWAY_CONFIG);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to get gateway config:', error);
    return null;
  }
}

export async function setGatewayConfig(config: GatewayConfig): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.GATEWAY_CONFIG, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save gateway config:', error);
    throw error;
  }
}

export async function getActiveSession(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
  } catch (error) {
    console.error('Failed to get active session:', error);
    return null;
  }
}

export async function setActiveSession(sessionKey: string): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, sessionKey);
  } catch (error) {
    console.error('Failed to save active session:', error);
    throw error;
  }
}

export async function clearStorage(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.GATEWAY_CONFIG,
      STORAGE_KEYS.ACTIVE_SESSION,
    ]);
  } catch (error) {
    console.error('Failed to clear storage:', error);
    throw error;
  }
}