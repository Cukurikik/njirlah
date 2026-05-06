export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  pricing?: { prompt: string; completion: string };
  free: boolean;
  source: "openrouter" | "cloudflare" | "replit";
  description?: string;
  contextLength?: number;
}

export interface OpenRouterRawModel {
  id: string;
  name: string;
  description?: string;
  pricing?: { prompt: string; completion: string };
  context_length?: number;
  top_provider?: { id: string; name: string };
}

export interface CloudflareRawModel {
  id: string;
  name: string;
  description?: string;
  task?: { name: string };
}
