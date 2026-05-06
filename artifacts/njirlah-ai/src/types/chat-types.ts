export type MessageRole = "user" | "assistant" | "system";
export type ModelProvider = "cloudflare" | "openrouter" | "replit";

export interface TokenUsage {
  prompt: number;
  completion: number;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  liked?: boolean | null;
  tokens?: number;
  tokenUsage?: TokenUsage;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  model: string;
  provider: ModelProvider;
  modelSource?: ModelProvider;
  modelId?: string;
}

export interface ApiMessage {
  role: MessageRole;
  content: string;
}
