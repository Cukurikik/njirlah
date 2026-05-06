export interface ORModel {
  id: string;
  name: string;
  provider: string;
  context: number;
  tier: "free" | "cheap" | "mid" | "premium";
  tags: string[];
  description: string;
}

export const OR_MODELS: ORModel[] = [
  // ── OpenAI ──
  { id: "openai/gpt-4o", name: "GPT-4o", provider: "OpenAI", context: 128000, tier: "premium", tags: ["vision", "coding", "reasoning", "flagship"], description: "Model terbaik OpenAI, multimodal, cepat" },
  { id: "openai/gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI", context: 128000, tier: "cheap", tags: ["fast", "coding", "vision"], description: "GPT-4o versi ringan, murah dan cepat" },
  { id: "openai/gpt-4-turbo", name: "GPT-4 Turbo", provider: "OpenAI", context: 128000, tier: "premium", tags: ["vision", "coding", "reasoning"], description: "GPT-4 versi turbo dengan context panjang" },
  { id: "openai/gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI", context: 16385, tier: "cheap", tags: ["fast", "chat"], description: "Model cepat dan murah untuk chat umum" },
  { id: "openai/o1", name: "o1", provider: "OpenAI", context: 200000, tier: "premium", tags: ["reasoning", "coding", "math", "flagship"], description: "Model reasoning canggih OpenAI" },
  { id: "openai/o1-mini", name: "o1-mini", provider: "OpenAI", context: 128000, tier: "mid", tags: ["reasoning", "coding", "math"], description: "o1 versi hemat untuk reasoning" },
  { id: "openai/o3-mini", name: "o3-mini", provider: "OpenAI", context: 200000, tier: "mid", tags: ["reasoning", "coding", "math", "fast"], description: "o3 versi mini, reasoning cepat" },
  { id: "openai/o4-mini", name: "o4-mini", provider: "OpenAI", context: 200000, tier: "mid", tags: ["reasoning", "coding", "vision", "fast"], description: "o4 mini — reasoning + vision" },

  // ── Anthropic ──
  { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", context: 200000, tier: "premium", tags: ["coding", "reasoning", "flagship", "vision"], description: "Model Anthropic terbaik, sangat bagus untuk coding" },
  { id: "anthropic/claude-3.5-haiku", name: "Claude 3.5 Haiku", provider: "Anthropic", context: 200000, tier: "mid", tags: ["fast", "coding", "vision"], description: "Claude cepat dan efisien untuk tugas sehari-hari" },
  { id: "anthropic/claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic", context: 200000, tier: "premium", tags: ["reasoning", "writing", "flagship"], description: "Claude paling kuat untuk analisis mendalam" },
  { id: "anthropic/claude-3-sonnet", name: "Claude 3 Sonnet", provider: "Anthropic", context: 200000, tier: "mid", tags: ["coding", "reasoning"], description: "Claude 3 versi seimbang" },
  { id: "anthropic/claude-3-haiku", name: "Claude 3 Haiku", provider: "Anthropic", context: 200000, tier: "cheap", tags: ["fast", "chat"], description: "Claude 3 tercepat dan termurah" },
  { id: "anthropic/claude-opus-4", name: "Claude Opus 4", provider: "Anthropic", context: 200000, tier: "premium", tags: ["reasoning", "coding", "flagship", "writing"], description: "Claude generasi ke-4 paling kuat" },
  { id: "anthropic/claude-sonnet-4", name: "Claude Sonnet 4", provider: "Anthropic", context: 200000, tier: "premium", tags: ["coding", "reasoning", "vision"], description: "Claude Sonnet gen 4 — cepat & powerful" },

  // ── Google ──
  { id: "google/gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "Google", context: 1000000, tier: "premium", tags: ["reasoning", "coding", "vision", "flagship", "long-context"], description: "Gemini terbaru Google dengan 1M token context" },
  { id: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "Google", context: 1000000, tier: "cheap", tags: ["fast", "vision", "long-context"], description: "Gemini Flash — cepat dengan context sangat panjang" },
  { id: "google/gemini-2.0-flash", name: "Gemini 2.0 Flash", provider: "Google", context: 1000000, tier: "cheap", tags: ["fast", "vision", "multimodal"], description: "Gemini 2.0 Flash — multimodal dan cepat" },
  { id: "google/gemini-pro-1.5", name: "Gemini 1.5 Pro", provider: "Google", context: 2000000, tier: "mid", tags: ["vision", "long-context", "coding"], description: "Gemini 1.5 Pro dengan 2M token context" },
  { id: "google/gemini-flash-1.5", name: "Gemini 1.5 Flash", provider: "Google", context: 1000000, tier: "cheap", tags: ["fast", "vision"], description: "Gemini 1.5 versi cepat dan murah" },
  { id: "google/gemma-3-27b-it", name: "Gemma 3 27B", provider: "Google", context: 128000, tier: "cheap", tags: ["open-source", "coding"], description: "Gemma 3 open source dari Google" },
  { id: "google/gemma-3-12b-it", name: "Gemma 3 12B", provider: "Google", context: 128000, tier: "free", tags: ["open-source", "fast"], description: "Gemma 3 12B — ringan dan gratis" },

  // ── Meta ──
  { id: "meta-llama/llama-4-scout", name: "Llama 4 Scout", provider: "Meta", context: 10000000, tier: "cheap", tags: ["open-source", "vision", "long-context", "fast"], description: "Llama 4 Scout — 10M context, multimodal" },
  { id: "meta-llama/llama-4-maverick", name: "Llama 4 Maverick", provider: "Meta", context: 1000000, tier: "mid", tags: ["open-source", "vision", "reasoning"], description: "Llama 4 Maverick — MoE model canggih" },
  { id: "meta-llama/llama-3.3-70b-instruct", name: "Llama 3.3 70B", provider: "Meta", context: 131072, tier: "cheap", tags: ["open-source", "coding", "reasoning"], description: "Llama 3.3 70B — model open source terbaik" },
  { id: "meta-llama/llama-3.1-405b-instruct", name: "Llama 3.1 405B", provider: "Meta", context: 131072, tier: "mid", tags: ["open-source", "reasoning", "coding", "flagship"], description: "Llama terbesar — 405B parameter" },
  { id: "meta-llama/llama-3.1-70b-instruct", name: "Llama 3.1 70B", provider: "Meta", context: 131072, tier: "cheap", tags: ["open-source", "coding"], description: "Llama 3.1 70B — performa tinggi open source" },
  { id: "meta-llama/llama-3.1-8b-instruct", name: "Llama 3.1 8B", provider: "Meta", context: 131072, tier: "free", tags: ["open-source", "fast"], description: "Llama 3.1 8B — kecil dan cepat" },
  { id: "meta-llama/llama-3-70b-instruct", name: "Llama 3 70B", provider: "Meta", context: 8192, tier: "cheap", tags: ["open-source", "coding"], description: "Llama 3 generasi sebelumnya" },

  // ── DeepSeek ──
  { id: "deepseek/deepseek-r1", name: "DeepSeek R1", provider: "DeepSeek", context: 64000, tier: "cheap", tags: ["reasoning", "coding", "math", "open-source"], description: "Model reasoning terbaik DeepSeek — setara o1" },
  { id: "deepseek/deepseek-r1-distill-llama-70b", name: "R1 Distill Llama 70B", provider: "DeepSeek", context: 131072, tier: "cheap", tags: ["reasoning", "coding", "math", "fast"], description: "R1 distilled ke Llama 70B — lebih cepat" },
  { id: "deepseek/deepseek-r1-distill-qwen-32b", name: "R1 Distill Qwen 32B", provider: "DeepSeek", context: 131072, tier: "cheap", tags: ["reasoning", "coding", "math"], description: "R1 distilled ke Qwen 32B" },
  { id: "deepseek/deepseek-v3", name: "DeepSeek V3", provider: "DeepSeek", context: 131072, tier: "cheap", tags: ["coding", "reasoning", "open-source", "fast"], description: "DeepSeek V3 — MoE dengan performa luar biasa" },
  { id: "deepseek/deepseek-v3-base:free", name: "DeepSeek V3 (Free)", provider: "DeepSeek", context: 131072, tier: "free", tags: ["coding", "reasoning", "open-source", "free"], description: "DeepSeek V3 versi gratis" },
  { id: "deepseek/deepseek-chat", name: "DeepSeek Chat", provider: "DeepSeek", context: 131072, tier: "cheap", tags: ["chat", "coding"], description: "DeepSeek untuk chat umum" },
  { id: "deepseek/deepseek-r2", name: "DeepSeek R2", provider: "DeepSeek", context: 128000, tier: "mid", tags: ["reasoning", "coding", "math", "flagship"], description: "R2 — generasi terbaru reasoning DeepSeek" },

  // ── xAI / Grok ──
  { id: "x-ai/grok-3-beta", name: "Grok 3 Beta", provider: "xAI", context: 131072, tier: "premium", tags: ["reasoning", "coding", "flagship"], description: "Grok 3 — model terbaru xAI dengan reasoning" },
  { id: "x-ai/grok-3-mini-beta", name: "Grok 3 Mini", provider: "xAI", context: 131072, tier: "mid", tags: ["reasoning", "fast", "coding"], description: "Grok 3 Mini — lebih cepat dan murah" },
  { id: "x-ai/grok-2-1212", name: "Grok 2", provider: "xAI", context: 131072, tier: "mid", tags: ["coding", "reasoning"], description: "Grok 2 — generasi sebelumnya" },
  { id: "x-ai/grok-2-vision-1212", name: "Grok 2 Vision", provider: "xAI", context: 32768, tier: "mid", tags: ["vision", "coding"], description: "Grok 2 dengan kemampuan vision" },

  // ── Mistral ──
  { id: "mistralai/mistral-large", name: "Mistral Large", provider: "Mistral", context: 131072, tier: "premium", tags: ["coding", "reasoning", "multilingual"], description: "Model terbesar Mistral untuk tugas kompleks" },
  { id: "mistralai/mistral-medium", name: "Mistral Medium", provider: "Mistral", context: 131072, tier: "mid", tags: ["coding", "chat", "multilingual"], description: "Mistral Medium — seimbang performa & biaya" },
  { id: "mistralai/mistral-small", name: "Mistral Small", provider: "Mistral", context: 131072, tier: "cheap", tags: ["fast", "chat", "coding"], description: "Mistral Small — cepat dan efisien" },
  { id: "mistralai/mistral-7b-instruct", name: "Mistral 7B", provider: "Mistral", context: 32768, tier: "free", tags: ["open-source", "fast", "free"], description: "Mistral 7B — model open source populer" },
  { id: "mistralai/mixtral-8x7b-instruct", name: "Mixtral 8x7B", provider: "Mistral", context: 32768, tier: "cheap", tags: ["open-source", "coding", "reasoning"], description: "Mixtral MoE — 8 expert, efisien" },
  { id: "mistralai/mixtral-8x22b-instruct", name: "Mixtral 8x22B", provider: "Mistral", context: 65536, tier: "mid", tags: ["open-source", "coding", "reasoning"], description: "Mixtral 8x22B — MoE terbesar Mistral" },
  { id: "mistralai/codestral-2501", name: "Codestral", provider: "Mistral", context: 256000, tier: "mid", tags: ["coding", "open-source"], description: "Model khusus coding dari Mistral" },
  { id: "mistralai/magistral-medium", name: "Magistral Medium", provider: "Mistral", context: 131072, tier: "mid", tags: ["reasoning", "coding", "multilingual"], description: "Magistral — model reasoning Mistral" },

  // ── Alibaba / Qwen ──
  { id: "qwen/qwen-2.5-72b-instruct", name: "Qwen 2.5 72B", provider: "Alibaba", context: 131072, tier: "cheap", tags: ["coding", "multilingual", "open-source"], description: "Qwen 2.5 72B — sangat bagus untuk coding & bahasa Asia" },
  { id: "qwen/qwen-2.5-7b-instruct", name: "Qwen 2.5 7B", provider: "Alibaba", context: 131072, tier: "free", tags: ["fast", "open-source", "free"], description: "Qwen 2.5 7B — kecil dan gratis" },
  { id: "qwen/qwen-2.5-coder-32b-instruct", name: "Qwen 2.5 Coder 32B", provider: "Alibaba", context: 131072, tier: "cheap", tags: ["coding", "open-source"], description: "Qwen Coder — model khusus coding terbaik" },
  { id: "qwen/qwen3-235b-a22b", name: "Qwen3 235B MoE", provider: "Alibaba", context: 131072, tier: "mid", tags: ["reasoning", "coding", "multilingual", "flagship"], description: "Qwen3 terbesar dengan MoE" },
  { id: "qwen/qwen3-32b", name: "Qwen3 32B", provider: "Alibaba", context: 131072, tier: "cheap", tags: ["reasoning", "coding", "multilingual"], description: "Qwen3 32B — kuat dan efisien" },
  { id: "qwen/qwen3-8b", name: "Qwen3 8B", provider: "Alibaba", context: 131072, tier: "free", tags: ["fast", "open-source", "free"], description: "Qwen3 8B — ringan dengan reasoning" },
  { id: "qwen/qvq-72b-preview", name: "QVQ 72B", provider: "Alibaba", context: 131072, tier: "mid", tags: ["vision", "reasoning", "coding"], description: "Qwen Vision + Reasoning 72B" },

  // ── Cohere ──
  { id: "cohere/command-r-plus", name: "Command R+", provider: "Cohere", context: 128000, tier: "premium", tags: ["reasoning", "coding", "rag", "multilingual"], description: "Command R+ — terbaik Cohere untuk RAG & reasoning" },
  { id: "cohere/command-r", name: "Command R", provider: "Cohere", context: 128000, tier: "mid", tags: ["rag", "chat", "multilingual"], description: "Command R — dioptimalkan untuk RAG" },
  { id: "cohere/command-r7b-12-2024", name: "Command R7B", provider: "Cohere", context: 128000, tier: "cheap", tags: ["fast", "rag"], description: "Command R versi kecil 7B" },
  { id: "cohere/command-a-03-2025", name: "Command A", provider: "Cohere", context: 256000, tier: "premium", tags: ["coding", "reasoning", "flagship"], description: "Command A — flagship terbaru Cohere" },

  // ── Microsoft / Phi ──
  { id: "microsoft/phi-4", name: "Phi-4", provider: "Microsoft", context: 16384, tier: "cheap", tags: ["reasoning", "math", "coding", "open-source"], description: "Phi-4 — kecil tapi powerful untuk reasoning" },
  { id: "microsoft/phi-4-multimodal-instruct", name: "Phi-4 Multimodal", provider: "Microsoft", context: 131072, tier: "cheap", tags: ["vision", "reasoning", "coding"], description: "Phi-4 dengan kemampuan vision" },
  { id: "microsoft/phi-3-medium-128k-instruct", name: "Phi-3 Medium", provider: "Microsoft", context: 128000, tier: "cheap", tags: ["coding", "reasoning", "open-source"], description: "Phi-3 Medium dengan context panjang" },
  { id: "microsoft/wizardlm-2-8x22b", name: "WizardLM 2 8x22B", provider: "Microsoft", context: 65536, tier: "mid", tags: ["reasoning", "coding", "open-source"], description: "WizardLM 2 — MoE terbaik untuk instruksi" },

  // ── 01.AI / Yi ──
  { id: "01-ai/yi-large", name: "Yi Large", provider: "01.AI", context: 32768, tier: "mid", tags: ["multilingual", "coding", "reasoning"], description: "Yi Large — model besar 01.AI" },
  { id: "01-ai/yi-lightning", name: "Yi Lightning", provider: "01.AI", context: 16384, tier: "cheap", tags: ["fast", "chat"], description: "Yi Lightning — sangat cepat" },

  // ── Amazon / Nova ──
  { id: "amazon/nova-pro-v1", name: "Nova Pro", provider: "Amazon", context: 300000, tier: "mid", tags: ["vision", "reasoning", "coding", "multimodal"], description: "Amazon Nova Pro — flagship multimodal" },
  { id: "amazon/nova-lite-v1", name: "Nova Lite", provider: "Amazon", context: 300000, tier: "cheap", tags: ["vision", "fast", "multimodal"], description: "Nova Lite — cepat dan terjangkau" },
  { id: "amazon/nova-micro-v1", name: "Nova Micro", provider: "Amazon", context: 128000, tier: "cheap", tags: ["fast", "chat"], description: "Nova Micro — paling ringan Amazon" },

  // ── Perplexity ──
  { id: "perplexity/sonar-pro", name: "Sonar Pro", provider: "Perplexity", context: 200000, tier: "premium", tags: ["search", "reasoning", "online"], description: "Sonar Pro — dengan akses internet real-time" },
  { id: "perplexity/sonar", name: "Sonar", provider: "Perplexity", context: 200000, tier: "mid", tags: ["search", "online", "fast"], description: "Sonar — search grounded AI" },
  { id: "perplexity/sonar-reasoning-pro", name: "Sonar Reasoning Pro", provider: "Perplexity", context: 131072, tier: "premium", tags: ["reasoning", "search", "online", "flagship"], description: "Sonar Reasoning Pro — search + deep reasoning" },

  // ── Nous Research ──
  { id: "nousresearch/hermes-3-llama-3.1-405b", name: "Hermes 3 405B", provider: "Nous Research", context: 131072, tier: "mid", tags: ["coding", "reasoning", "open-source", "function-calling"], description: "Hermes 3 — terbaik untuk function calling" },
  { id: "nousresearch/hermes-3-llama-3.1-70b", name: "Hermes 3 70B", provider: "Nous Research", context: 131072, tier: "cheap", tags: ["coding", "function-calling", "open-source"], description: "Hermes 3 70B — function calling" },

  // ── Groq / Fast ──
  { id: "groq/llama-3.1-70b-versatile", name: "Llama 3.1 70B (Groq)", provider: "Groq", context: 131072, tier: "cheap", tags: ["fast", "coding", "open-source"], description: "Llama 3.1 70B di Groq — super cepat" },

  // ── Together ──
  { id: "togethercomputer/llama-3-70b", name: "Llama 3 70B (Together)", provider: "Together", context: 8192, tier: "cheap", tags: ["open-source", "coding"], description: "Llama 3 70B di Together AI" },

  // ── AI21 ──
  { id: "ai21/jamba-1-5-large", name: "Jamba 1.5 Large", provider: "AI21", context: 256000, tier: "mid", tags: ["long-context", "coding", "reasoning"], description: "Jamba — arsitektur hybrid Mamba" },
  { id: "ai21/jamba-1-5-mini", name: "Jamba 1.5 Mini", provider: "AI21", context: 256000, tier: "cheap", tags: ["long-context", "fast"], description: "Jamba Mini — cepat dengan context panjang" },

  // ── Inflection ──
  { id: "inflection/inflection-3-productivity", name: "Inflection 3 Productivity", provider: "Inflection", context: 8192, tier: "mid", tags: ["chat", "reasoning"], description: "Pi versi productivity" },

  // ── Writer ──
  { id: "writer/palmyra-x-004", name: "Palmyra X 004", provider: "Writer", context: 128000, tier: "premium", tags: ["writing", "coding", "reasoning"], description: "Palmyra — terbaik untuk penulisan profesional" },

  // ── Free models ──
  { id: "google/gemma-2-9b-it:free", name: "Gemma 2 9B (Free)", provider: "Google", context: 8192, tier: "free", tags: ["free", "open-source", "fast"], description: "Gemma 2 9B gratis tanpa key" },
  { id: "meta-llama/llama-3.2-3b-instruct:free", name: "Llama 3.2 3B (Free)", provider: "Meta", context: 131072, tier: "free", tags: ["free", "open-source", "fast"], description: "Llama 3.2 3B — gratis sangat kecil" },
  { id: "mistralai/mistral-7b-instruct:free", name: "Mistral 7B (Free)", provider: "Mistral", context: 32768, tier: "free", tags: ["free", "open-source", "fast"], description: "Mistral 7B gratis" },
  { id: "qwen/qwen-2.5-7b-instruct:free", name: "Qwen 2.5 7B (Free)", provider: "Alibaba", context: 32768, tier: "free", tags: ["free", "open-source", "multilingual"], description: "Qwen 2.5 7B gratis" },
  { id: "huggingfaceh4/zephyr-7b-beta:free", name: "Zephyr 7B (Free)", provider: "HuggingFace", context: 4096, tier: "free", tags: ["free", "open-source"], description: "Zephyr 7B — gratis di HuggingFace" },
  { id: "openchat/openchat-7b:free", name: "OpenChat 7B (Free)", provider: "OpenChat", context: 8192, tier: "free", tags: ["free", "chat"], description: "OpenChat 7B — model chat gratis" },
  { id: "deepseek/deepseek-v3-base:free", name: "DeepSeek V3 (Free)", provider: "DeepSeek", context: 131072, tier: "free", tags: ["free", "coding", "open-source"], description: "DeepSeek V3 gratis" },
  { id: "nousresearch/nous-capybara-7b:free", name: "Nous Capybara 7B (Free)", provider: "Nous Research", context: 4096, tier: "free", tags: ["free", "open-source"], description: "Capybara 7B — gratis" },

  // ── Coding specialists ──
  { id: "aion-labs/aion-1.0", name: "Aion 1.0", provider: "Aion Labs", context: 131072, tier: "premium", tags: ["coding", "reasoning", "agent"], description: "Aion 1.0 — dioptimalkan untuk coding agent" },
  { id: "qwen/qwen-2.5-coder-7b-instruct", name: "Qwen 2.5 Coder 7B", provider: "Alibaba", context: 131072, tier: "free", tags: ["coding", "open-source", "free"], description: "Qwen Coder 7B — spesialis coding kecil" },

  // ── Long context ──
  { id: "anthropic/claude-3.5-sonnet-20241022", name: "Claude 3.5 Sonnet (Oct)", provider: "Anthropic", context: 200000, tier: "premium", tags: ["coding", "reasoning", "vision", "long-context"], description: "Claude 3.5 Sonnet versi Oktober 2024" },
  { id: "google/gemini-exp-1206", name: "Gemini Experimental", provider: "Google", context: 2000000, tier: "mid", tags: ["experimental", "long-context", "vision"], description: "Gemini experimental dengan 2M context" },
];

export const OR_PROVIDERS = [...new Set(OR_MODELS.map((m) => m.provider))].sort();

export const OR_TAGS = [
  "free", "fast", "coding", "reasoning", "vision", "math", "writing",
  "multilingual", "open-source", "flagship", "long-context", "rag",
  "search", "online", "function-calling", "agent", "multimodal",
];

export const TIER_LABEL: Record<string, string> = {
  free: "Gratis",
  cheap: "Murah",
  mid: "Sedang",
  premium: "Premium",
};

export const TIER_COLOR: Record<string, { text: string; bg: string; border: string }> = {
  free:    { text: "rgb(74,222,128)",  bg: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.2)" },
  cheap:   { text: "rgb(56,189,248)",  bg: "rgba(6,182,212,0.08)",   border: "rgba(6,182,212,0.2)" },
  mid:     { text: "rgb(251,191,36)",  bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.2)" },
  premium: { text: "rgb(196,181,253)", bg: "rgba(139,92,246,0.08)",  border: "rgba(139,92,246,0.2)" },
};

export function formatContext(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 0)}K`;
  return String(n);
}
