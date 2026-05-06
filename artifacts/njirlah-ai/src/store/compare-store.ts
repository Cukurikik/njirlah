import { create } from "zustand";
import type { ModelProvider } from "@/store/chat-store";

export interface CompareRound {
  id: string;
  prompt: string;
  responseA: string;
  responseB: string;
  isStreamingA: boolean;
  isStreamingB: boolean;
  errorA?: string;
  errorB?: string;
}

interface CompareStore {
  isActive: boolean;
  modelA: string;
  providerA: ModelProvider;
  modelB: string;
  providerB: ModelProvider;
  rounds: CompareRound[];

  setActive: (active: boolean) => void;
  setModelA: (id: string, provider: ModelProvider) => void;
  setModelB: (id: string, provider: ModelProvider) => void;
  addRound: (prompt: string) => string;
  appendA: (id: string, chunk: string) => void;
  appendB: (id: string, chunk: string) => void;
  finalizeA: (id: string, content: string, error?: string) => void;
  finalizeB: (id: string, content: string, error?: string) => void;
  clearHistory: () => void;
}

export const useCompareStore = create<CompareStore>((set) => ({
  isActive: false,
  modelA: "gpt-5.4",
  providerA: "replit",
  modelB: "@cf/meta/llama-3.1-8b-instruct",
  providerB: "cloudflare",
  rounds: [],

  setActive: (isActive) => set({ isActive, rounds: isActive ? [] : [] }),
  setModelA: (modelA, providerA) => set({ modelA, providerA }),
  setModelB: (modelB, providerB) => set({ modelB, providerB }),

  addRound: (prompt) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    set((s) => ({
      rounds: [
        ...s.rounds,
        { id, prompt, responseA: "", responseB: "", isStreamingA: true, isStreamingB: true },
      ],
    }));
    return id;
  },

  appendA: (id, chunk) =>
    set((s) => ({
      rounds: s.rounds.map((r) =>
        r.id === id ? { ...r, responseA: r.responseA + chunk } : r,
      ),
    })),

  appendB: (id, chunk) =>
    set((s) => ({
      rounds: s.rounds.map((r) =>
        r.id === id ? { ...r, responseB: r.responseB + chunk } : r,
      ),
    })),

  finalizeA: (id, content, error) =>
    set((s) => ({
      rounds: s.rounds.map((r) =>
        r.id === id ? { ...r, responseA: content, isStreamingA: false, errorA: error } : r,
      ),
    })),

  finalizeB: (id, content, error) =>
    set((s) => ({
      rounds: s.rounds.map((r) =>
        r.id === id ? { ...r, responseB: content, isStreamingB: false, errorB: error } : r,
      ),
    })),

  clearHistory: () => set({ rounds: [] }),
}));
