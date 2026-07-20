const API_BASE = import.meta.env.DEV ? "http://localhost:3001" : "";

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
  warnings?: string[];
}

export async function processPrompt(request: ProcessRequest): Promise<ProcessResponse> {
  const response = await fetch(`${API_BASE}/api/process`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.error || `API error: ${response.status}`);
  }

  return response.json();
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
