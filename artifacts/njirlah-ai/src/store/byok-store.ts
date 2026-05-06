import { create } from "zustand";

const STORAGE_KEYS = {
  openrouter: "njirlah_or_key",
  cloudflare_id: "njirlah_cf_id",
  cloudflare_token: "njirlah_cf_token",
  openai: "njirlah_oai_key",
  anthropic: "njirlah_ant_key",
  google: "njirlah_goog_key",
} as const;

type KeyName = keyof typeof STORAGE_KEYS;

function saveRaw(key: string, value: string) {
  try { localStorage.setItem(key, btoa(value)); } catch { /* ignore */ }
}

function loadRaw(key: string): string {
  try {
    const v = localStorage.getItem(key);
    return v ? atob(v) : "";
  } catch { return ""; }
}

function clearRaw(key: string) {
  try { localStorage.removeItem(key); } catch { /* ignore */ }
}

interface ByokStore {
  openrouterKey: string;
  cloudflareAccountId: string;
  cloudflareApiToken: string;
  openaiKey: string;
  anthropicKey: string;
  googleKey: string;

  loadAll: () => void;
  setKey: (name: KeyName, value: string) => void;
  clearKey: (name: KeyName) => void;
  clearAll: () => void;

  testOpenRouter: () => Promise<boolean>;
  testCloudflare: () => Promise<boolean>;
}

export const useByokStore = create<ByokStore>((set, get) => ({
  openrouterKey: "",
  cloudflareAccountId: "",
  cloudflareApiToken: "",
  openaiKey: "",
  anthropicKey: "",
  googleKey: "",

  loadAll: () => {
    set({
      openrouterKey: loadRaw(STORAGE_KEYS.openrouter),
      cloudflareAccountId: loadRaw(STORAGE_KEYS.cloudflare_id),
      cloudflareApiToken: loadRaw(STORAGE_KEYS.cloudflare_token),
      openaiKey: loadRaw(STORAGE_KEYS.openai),
      anthropicKey: loadRaw(STORAGE_KEYS.anthropic),
      googleKey: loadRaw(STORAGE_KEYS.google),
    });
  },

  setKey: (name, value) => {
    saveRaw(STORAGE_KEYS[name], value);
    switch (name) {
      case "openrouter": set({ openrouterKey: value }); break;
      case "cloudflare_id": set({ cloudflareAccountId: value }); break;
      case "cloudflare_token": set({ cloudflareApiToken: value }); break;
      case "openai": set({ openaiKey: value }); break;
      case "anthropic": set({ anthropicKey: value }); break;
      case "google": set({ googleKey: value }); break;
    }
  },

  clearKey: (name) => {
    clearRaw(STORAGE_KEYS[name]);
    switch (name) {
      case "openrouter": set({ openrouterKey: "" }); break;
      case "cloudflare_id": set({ cloudflareAccountId: "" }); break;
      case "cloudflare_token": set({ cloudflareApiToken: "" }); break;
      case "openai": set({ openaiKey: "" }); break;
      case "anthropic": set({ anthropicKey: "" }); break;
      case "google": set({ googleKey: "" }); break;
    }
  },

  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(clearRaw);
    set({
      openrouterKey: "",
      cloudflareAccountId: "",
      cloudflareApiToken: "",
      openaiKey: "",
      anthropicKey: "",
      googleKey: "",
    });
  },

  testOpenRouter: async () => {
    const { openrouterKey } = get();
    if (!openrouterKey) return false;
    try {
      const res = await fetch("https://openrouter.ai/api/v1/models", {
        headers: { Authorization: `Bearer ${openrouterKey}` },
      });
      return res.ok;
    } catch { return false; }
  },

  testCloudflare: async () => {
    const { cloudflareAccountId, cloudflareApiToken } = get();
    if (!cloudflareAccountId || !cloudflareApiToken) return false;
    try {
      const res = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/ai/models/search`,
        { headers: { Authorization: `Bearer ${cloudflareApiToken}` } }
      );
      return res.ok;
    } catch { return false; }
  },
}));
