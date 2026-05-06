export interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  pricing?: {
    prompt: string;
    completion: string;
  };
  context_length?: number;
  top_provider?: {
    id: string;
    name: string;
  };
}

export const FREE_MODEL_IDS = new Set([
  "google/gemma-2-9b-it:free",
  "google/learnlm-1.5-pro-experimental:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "meta-llama/llama-3.1-70b-instruct:free",
  "meta-llama/llama-3.2-1b-instruct:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "mistralai/pixtral-12b:free",
  "mistralai/mistral-7b-instruct:free",
  "qwen/qwen-2-7b-instruct:free",
  "qwen/qwen-2.5-7b-instruct:free",
  "qwen/qwen-2.5-coder-32b-instruct:free",
  "nvidia/llama-3.1-nemotron-70b-instruct:free",
  "microsoft/phi-3-medium-128k-instruct:free",
  "microsoft/phi-3-mini-128k-instruct:free",
  "gryphe/mythomax-l2-13b:free",
  "openrouter/auto:free",
]);

export function isModelFree(model: OpenRouterModel): boolean {
  if (FREE_MODEL_IDS.has(model.id)) return true;
  if (model.id.endsWith(":free")) return true;
  if (model.pricing) {
    const prompt = parseFloat(model.pricing.prompt);
    const completion = parseFloat(model.pricing.completion);
    return prompt === 0 && completion === 0;
  }
  return false;
}

export async function fetchOpenRouterModels(apiKey: string): Promise<OpenRouterModel[]> {
  const response = await fetch("https://openrouter.ai/api/v1/models", {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as { data: OpenRouterModel[] };
  return data.data || [];
}

export async function validateOpenRouterKey(apiKey: string): Promise<boolean> {
  try {
    await fetchOpenRouterModels(apiKey);
    return true;
  } catch {
    return false;
  }
}

export function getProviderFromModelId(modelId: string): string {
  const parts = modelId.split("/");
  if (parts.length >= 1) {
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  }
  return "Unknown";
}
