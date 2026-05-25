export interface ProviderConfig {
  name: string;
  version: string;
  apiKey?: string;
}

export interface ProcessRequest {
  prompt: string;
  settings?: {
    temperature?: number;
    maxTokens?: number;
  };
}

export interface ProcessResponse {
  content: string;
  tokensUsed: number;
  model: string;
  provider: string;
}

export interface ProviderError {
  code: string;
  message: string;
  statusCode: number;
}
