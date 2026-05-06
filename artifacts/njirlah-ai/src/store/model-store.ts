import { create } from "zustand";
import { fetchOpenRouterModels, isModelFree, getProviderFromModelId } from "@/lib/openrouter";
import { fetchCloudflareModels } from "@/lib/cloudflare";
import type { ModelInfo } from "@/types/model-types";

interface ModelStore {
  openrouterModels: ModelInfo[];
  cloudflareModels: ModelInfo[];
  isLoadingOpenrouter: boolean;
  isLoadingCloudflare: boolean;
  openrouterError: string | null;
  cloudflareError: string | null;

  fetchOpenRouterModels: (apiKey: string) => Promise<void>;
  fetchCloudflareModels: () => Promise<void>;
  clearOpenRouterModels: () => void;
}

export const useModelStore = create<ModelStore>((set) => ({
  openrouterModels: [],
  cloudflareModels: [],
  isLoadingOpenrouter: false,
  isLoadingCloudflare: false,
  openrouterError: null,
  cloudflareError: null,

  fetchOpenRouterModels: async (apiKey: string) => {
    set({ isLoadingOpenrouter: true, openrouterError: null });
    try {
      const raw = await fetchOpenRouterModels(apiKey);
      const models: ModelInfo[] = raw.map((m) => ({
        id: m.id,
        name: m.name ?? m.id,
        provider: getProviderFromModelId(m.id),
        pricing: m.pricing,
        free: isModelFree(m),
        source: "openrouter" as const,
        description: m.description,
        contextLength: m.context_length,
      }));
      set({ openrouterModels: models, isLoadingOpenrouter: false });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch OpenRouter models";
      set({ openrouterError: msg, isLoadingOpenrouter: false });
    }
  },

  fetchCloudflareModels: async () => {
    set({ isLoadingCloudflare: true, cloudflareError: null });
    try {
      const raw = await fetchCloudflareModels();
      const models: ModelInfo[] = raw.map((m) => ({
        id: m.id,
        name: m.name ?? m.id,
        provider: "Cloudflare",
        free: true,
        source: "cloudflare" as const,
        description: m.description,
      }));
      set({ cloudflareModels: models, isLoadingCloudflare: false });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch Cloudflare models";
      set({ cloudflareError: msg, isLoadingCloudflare: false });
    }
  },

  clearOpenRouterModels: () => {
    set({ openrouterModels: [], openrouterError: null });
  },
}));
