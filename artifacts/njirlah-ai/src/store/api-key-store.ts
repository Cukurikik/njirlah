import { create } from "zustand";
import { encryptApiKey, decryptApiKey, clearApiKey, hasStoredApiKey } from "@/lib/encryption";
import { validateOpenRouterKey } from "@/lib/openrouter";

interface ApiKeyStore {
  openRouterKey: string | null;
  isKeyValid: boolean;
  isLoading: boolean;
  isValidating: boolean;
  hasKey: boolean;
  loadKey: () => Promise<void>;
  saveKey: (key: string) => Promise<void>;
  setKey: (key: string) => Promise<void>;
  removeKey: () => void;
  clearKey: () => void;
  testConnection: () => Promise<boolean>;
}

export const useApiKeyStore = create<ApiKeyStore>((set, get) => ({
  openRouterKey: null,
  isKeyValid: false,
  isLoading: true,
  isValidating: false,
  hasKey: hasStoredApiKey(),

  loadKey: async () => {
    set({ isLoading: true });
    const key = await decryptApiKey();
    set({ openRouterKey: key, isLoading: false, hasKey: key !== null });
  },

  saveKey: async (key: string) => {
    set({ isValidating: true });
    await encryptApiKey(key);
    set({ openRouterKey: key, isValidating: false, hasKey: true });
  },

  setKey: async (key: string) => {
    set({ isValidating: true });
    await encryptApiKey(key);
    const valid = await validateOpenRouterKey(key);
    set({ openRouterKey: key, isKeyValid: valid, isValidating: false, hasKey: true });
  },

  removeKey: () => {
    clearApiKey();
    set({ openRouterKey: null, isKeyValid: false, hasKey: false });
  },

  clearKey: () => {
    clearApiKey();
    set({ openRouterKey: null, isKeyValid: false, hasKey: false });
  },

  testConnection: async (): Promise<boolean> => {
    const { openRouterKey } = get();
    if (!openRouterKey) return false;
    set({ isValidating: true });
    try {
      const valid = await validateOpenRouterKey(openRouterKey);
      set({ isKeyValid: valid, isValidating: false });
      return valid;
    } catch {
      set({ isKeyValid: false, isValidating: false });
      return false;
    }
  },
}));
