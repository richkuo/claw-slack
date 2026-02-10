import type { 
  GatewaySession, 
  SessionMessage, 
  GatewayConfig, 
  GatewayStatus, 
  ApiResponse,
  MessageHistoryResponse 
} from './types';

export class GatewayClient {
  private config: GatewayConfig;

  constructor(config: GatewayConfig) {
    this.config = config;
  }

  updateConfig(config: GatewayConfig) {
    this.config = config;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.config.url}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.config.token}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Gateway request failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getStatus(): Promise<ApiResponse<GatewayStatus>> {
    return this.request<GatewayStatus>('/api/status');
  }

  async getSessions(): Promise<ApiResponse<GatewaySession[]>> {
    return this.request<GatewaySession[]>('/api/sessions');
  }

  async getSessionHistory(
    sessionKey: string, 
    limit: number = 50,
    includeTools: boolean = false
  ): Promise<ApiResponse<MessageHistoryResponse>> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      includeTools: includeTools.toString(),
    });
    
    const result = await this.request<SessionMessage[]>(
      `/api/sessions/${encodeURIComponent(sessionKey)}/history?${params}`
    );
    
    if (result.success && result.data) {
      return {
        success: true,
        data: {
          messages: result.data,
          hasMore: false, // TODO: Implement pagination
        }
      };
    }
    
    return {
      success: false,
      error: result.error
    };
  }

  async sendMessage(
    sessionKey: string, 
    message: string
  ): Promise<ApiResponse<void>> {
    return this.request<void>(
      `/api/sessions/${encodeURIComponent(sessionKey)}/message`,
      {
        method: 'POST',
        body: JSON.stringify({ message }),
      }
    );
  }

  isConfigured(): boolean {
    return !!(this.config.url && this.config.token);
  }
}