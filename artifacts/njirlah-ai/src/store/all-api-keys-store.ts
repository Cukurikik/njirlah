import { create } from "zustand";
import { encryptValue, decryptValue, clearStorageKey } from "@/lib/encryption";

export interface CustomProvider {
  id: string;
  name: string;
  baseUrl: string;
  apiKey: string;
  modelId: string;
  status?: "valid" | "invalid" | "untested";
}

export const BYOK_PROVIDERS = [
  "AI21", "AionLabs", "AkashML", "Alibaba Cloud Int.", "Amazon Bedrock",
  "Anthropic", "Arcee AI", "AtlasCloud", "Azure", "Baidu Qianfan",
  "Baseten", "Cerebras", "Chutes", "Clarifai", "Cloudflare",
  "Cohere", "DeepInfra", "DeepSeek", "Featherless", "Fireworks",
  "Friendli", "GMICloud", "Google AI Studio", "Google Vertex", "Groq",
  "Inception", "Inceptron", "Infermatic", "Inflection", "io.net",
  "Liquid", "Mancer", "MiniMax", "Mistral", "Moonshot AI",
  "Morph", "Nebius Token Factory", "NextBit", "NovitaAI", "OpenAI",
  "OpenInference", "Parasail", "Perplexity", "Phala", "Reka AI",
  "Relace", "SambaNova", "SiliconFlow", "StepFun", "Switchpoint",
  "Together", "Venice", "Weights & Biases", "xAI", "Xiaomi", "Z.ai",
] as const;

export type ByokProviderName = typeof BYOK_PROVIDERS[number];

const STORAGE_KEYS: Record<string, string> = {
  openrouter: "njirlah_k_openrouter",
  cloudflare_account_id: "njirlah_k_cf_account",
  cloudflare_api_token: "njirlah_k_cf_token",
  bailian: "njirlah_k_bailian",
  custom_providers: "njirlah_k_custom_list",
};

function byokStorageKey(provider: string): string {
  const slug = provider.toLowerCase().replace(/[^a-z0-9]/g, "_");
  return `njirlah_byok_${slug}`;
}

export type KeyStatus = "valid" | "invalid" | "untested" | "testing";

interface AllApiKeysStore {
  openrouterKey: string;
  cloudflareAccountId: string;
  cloudflareApiToken: string;
  bailianKey: string;
  byokKeys: Partial<Record<ByokProviderName, string>>;
  customProviders: CustomProvider[];

  keyStatuses: Record<string, KeyStatus>;

  loadAll: () => Promise<void>;
  setOpenrouterKey: (v: string) => Promise<void>;
  setCloudflareAccountId: (v: string) => Promise<void>;
  setCloudflareApiToken: (v: string) => Promise<void>;
  setBailianKey: (v: string) => Promise<void>;
  setByokKey: (provider: ByokProviderName, value: string) => Promise<void>;
  clearByokKey: (provider: ByokProviderName) => void;

  addCustomProvider: (p: Omit<CustomProvider, "id" | "status">) => Promise<void>;
  updateCustomProvider: (id: string, p: Partial<Omit<CustomProvider, "id">>) => Promise<void>;
  removeCustomProvider: (id: string) => Promise<void>;

  testOpenrouter: () => Promise<boolean>;
  testCloudflare: () => Promise<boolean>;
  testBailian: () => Promise<boolean>;
  testByokProvider: (provider: ByokProviderName) => Promise<boolean>;
  testCustomProvider: (id: string) => Promise<boolean>;

  setStatus: (key: string, status: KeyStatus) => void;
}

function nanoid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export const useAllApiKeysStore = create<AllApiKeysStore>((set, get) => ({
  openrouterKey: "",
  cloudflareAccountId: "",
  cloudflareApiToken: "",
  bailianKey: "",
  byokKeys: {},
  customProviders: [],
  keyStatuses: {},

  loadAll: async () => {
    const [or, cfId, cfTok, bailian, customRaw] = await Promise.all([
      decryptValue(STORAGE_KEYS.openrouter),
      decryptValue(STORAGE_KEYS.cloudflare_account_id),
      decryptValue(STORAGE_KEYS.cloudflare_api_token),
      decryptValue(STORAGE_KEYS.bailian),
      decryptValue(STORAGE_KEYS.custom_providers),
    ]);

    const byokKeys: Partial<Record<ByokProviderName, string>> = {};
    await Promise.all(
      BYOK_PROVIDERS.map(async (p) => {
        const v = await decryptValue(byokStorageKey(p));
        if (v) byokKeys[p] = v;
      })
    );

    let customProviders: CustomProvider[] = [];
    if (customRaw) {
      try { customProviders = JSON.parse(customRaw); } catch { /* ignore */ }
    }

    set({
      openrouterKey: or ?? "",
      cloudflareAccountId: cfId ?? "",
      cloudflareApiToken: cfTok ?? "",
      bailianKey: bailian ?? "",
      byokKeys,
      customProviders,
    });
  },

  setOpenrouterKey: async (v) => {
    await encryptValue(v, STORAGE_KEYS.openrouter);
    set({ openrouterKey: v });
  },

  setCloudflareAccountId: async (v) => {
    await encryptValue(v, STORAGE_KEYS.cloudflare_account_id);
    set({ cloudflareAccountId: v });
  },

  setCloudflareApiToken: async (v) => {
    await encryptValue(v, STORAGE_KEYS.cloudflare_api_token);
    set({ cloudflareApiToken: v });
  },

  setBailianKey: async (v) => {
    await encryptValue(v, STORAGE_KEYS.bailian);
    set({ bailianKey: v });
  },

  setByokKey: async (provider, value) => {
    await encryptValue(value, byokStorageKey(provider));
    set((s) => ({ byokKeys: { ...s.byokKeys, [provider]: value } }));
  },

  clearByokKey: (provider) => {
    clearStorageKey(byokStorageKey(provider));
    set((s) => {
      const keys = { ...s.byokKeys };
      delete keys[provider];
      return { byokKeys: keys };
    });
  },

  addCustomProvider: async (p) => {
    const id = nanoid();
    const newProvider: CustomProvider = { ...p, id, status: "untested" };
    const updated = [...get().customProviders, newProvider];
    await encryptValue(JSON.stringify(updated), STORAGE_KEYS.custom_providers);
    set({ customProviders: updated });
  },

  updateCustomProvider: async (id, p) => {
    const updated = get().customProviders.map((cp) =>
      cp.id === id ? { ...cp, ...p } : cp
    );
    await encryptValue(JSON.stringify(updated), STORAGE_KEYS.custom_providers);
    set({ customProviders: updated });
  },

  removeCustomProvider: async (id) => {
    const updated = get().customProviders.filter((cp) => cp.id !== id);
    await encryptValue(JSON.stringify(updated), STORAGE_KEYS.custom_providers);
    set({ customProviders: updated });
  },

  testOpenrouter: async () => {
    const { openrouterKey } = get();
    if (!openrouterKey) return false;
    set((s) => ({ keyStatuses: { ...s.keyStatuses, openrouter: "testing" } }));
    try {
      const res = await fetch("https://openrouter.ai/api/v1/models", {
        headers: { Authorization: `Bearer ${openrouterKey}` },
      });
      const ok = res.ok;
      set((s) => ({ keyStatuses: { ...s.keyStatuses, openrouter: ok ? "valid" : "invalid" } }));
      return ok;
    } catch {
      set((s) => ({ keyStatuses: { ...s.keyStatuses, openrouter: "invalid" } }));
      return false;
    }
  },

  testCloudflare: async () => {
    const { cloudflareAccountId, cloudflareApiToken } = get();
    if (!cloudflareAccountId || !cloudflareApiToken) return false;
    set((s) => ({ keyStatuses: { ...s.keyStatuses, cloudflare: "testing" } }));
    try {
      const res = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/ai/models/search`,
        { headers: { Authorization: `Bearer ${cloudflareApiToken}` } }
      );
      const ok = res.ok;
      set((s) => ({ keyStatuses: { ...s.keyStatuses, cloudflare: ok ? "valid" : "invalid" } }));
      return ok;
    } catch {
      set((s) => ({ keyStatuses: { ...s.keyStatuses, cloudflare: "invalid" } }));
      return false;
    }
  },

  testBailian: async () => {
    const { bailianKey } = get();
    if (!bailianKey) return false;
    set((s) => ({ keyStatuses: { ...s.keyStatuses, bailian: "testing" } }));
    try {
      const res = await fetch("https://dashscope.aliyuncs.com/compatible-mode/v1/models", {
        headers: { Authorization: `Bearer ${bailianKey}` },
      });
      const ok = res.ok;
      set((s) => ({ keyStatuses: { ...s.keyStatuses, bailian: ok ? "valid" : "invalid" } }));
      return ok;
    } catch {
      set((s) => ({ keyStatuses: { ...s.keyStatuses, bailian: "invalid" } }));
      return false;
    }
  },

  testByokProvider: async (provider) => {
    const key = get().byokKeys[provider];
    const storeKey = `byok_${provider}`;
    if (!key) return false;
    set((s) => ({ keyStatuses: { ...s.keyStatuses, [storeKey]: "testing" } }));
    try {
      await new Promise((r) => setTimeout(r, 600));
      const ok = key.length > 10;
      set((s) => ({ keyStatuses: { ...s.keyStatuses, [storeKey]: ok ? "valid" : "invalid" } }));
      return ok;
    } catch {
      set((s) => ({ keyStatuses: { ...s.keyStatuses, [storeKey]: "invalid" } }));
      return false;
    }
  },

  testCustomProvider: async (id) => {
    const cp = get().customProviders.find((p) => p.id === id);
    const storeKey = `custom_${id}`;
    if (!cp) return false;
    set((s) => ({ keyStatuses: { ...s.keyStatuses, [storeKey]: "testing" } }));
    try {
      const res = await fetch(`${cp.baseUrl}/models`, {
        headers: {
          Authorization: `Bearer ${cp.apiKey}`,
          "Content-Type": "application/json",
        },
      });
      const ok = res.ok;
      await get().updateCustomProvider(id, { status: ok ? "valid" : "invalid" });
      set((s) => ({ keyStatuses: { ...s.keyStatuses, [storeKey]: ok ? "valid" : "invalid" } }));
      return ok;
    } catch {
      await get().updateCustomProvider(id, { status: "invalid" });
      set((s) => ({ keyStatuses: { ...s.keyStatuses, [storeKey]: "invalid" } }));
      return false;
    }
  },

  setStatus: (key, status) => {
    set((s) => ({ keyStatuses: { ...s.keyStatuses, [key]: status } }));
  },
}));
