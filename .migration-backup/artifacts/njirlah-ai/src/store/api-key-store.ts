import { create } from "zustand";
import { encryptApiKey, decryptApiKey, clearApiKey, hasStoredApiKey } from "@/lib/encryption";

interface ApiKeyStore {
  openRouterKey: string | null;
  isLoading: boolean;
  isValidating: boolean;
  hasKey: boolean;
  loadKey: () => Promise<void>;
  saveKey: (key: string) => Promise<void>;
  removeKey: () => void;
}

export const useApiKeyStore = create<ApiKeyStore>((set) => ({
  openRouterKey: null,
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

  removeKey: () => {
    clearApiKey();
    set({ openRouterKey: null, hasKey: false });
  },
}));
