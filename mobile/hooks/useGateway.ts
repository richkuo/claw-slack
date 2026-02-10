import { useState, useEffect, useCallback } from 'react';
import { GatewayClient } from '../lib/gateway';
import { getGatewayConfig, setGatewayConfig } from '../lib/storage';
import type { GatewayConfig, GatewayStatus } from '../lib/types';

export function useGateway() {
  const [client, setClient] = useState<GatewayClient | null>(null);
  const [config, setConfig] = useState<GatewayConfig | null>(null);
  const [status, setStatus] = useState<GatewayStatus | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Load config from AsyncStorage on mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const savedConfig = await getGatewayConfig();
        if (savedConfig) {
          setConfig(savedConfig);
          setClient(new GatewayClient(savedConfig));
        }
      } catch (error) {
        console.error('Failed to load gateway config:', error);
      }
    };

    loadConfig();
  }, []);

  // Check status when client changes
  useEffect(() => {
    if (client) {
      checkStatus();
    }
  }, [client]);

  const updateConfig = useCallback(async (newConfig: GatewayConfig) => {
    try {
      setConfig(newConfig);
      await setGatewayConfig(newConfig);
      setClient(new GatewayClient(newConfig));
      setConnectionError(null);
    } catch (error) {
      setConnectionError(error instanceof Error ? error.message : 'Failed to save config');
    }
  }, []);

  const checkStatus = useCallback(async () => {
    if (!client) return;

    setIsConnecting(true);
    setConnectionError(null);

    try {
      const result = await client.getStatus();
      if (result.success && result.data) {
        setStatus(result.data);
      } else {
        setConnectionError(result.error || 'Failed to get status');
        setStatus(null);
      }
    } catch (error) {
      setConnectionError(error instanceof Error ? error.message : 'Connection failed');
      setStatus(null);
    } finally {
      setIsConnecting(false);
    }
  }, [client]);

  const isConnected = !!(status && !connectionError);
  const isConfigured = !!(config?.url && config?.token);

  return {
    client,
    config,
    status,
    isConnected,
    isConfigured,
    isConnecting,
    connectionError,
    updateConfig,
    checkStatus,
  };
}