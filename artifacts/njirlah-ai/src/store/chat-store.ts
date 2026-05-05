import { create } from "zustand";
import { nanoid } from "nanoid";

export type MessageRole = "user" | "assistant" | "system";
export type ModelProvider = "cloudflare" | "openrouter" | "replit";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  liked?: boolean | null;
  tokens?: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  model: string;
  provider: ModelProvider;
}

interface ChatStore {
  chats: Chat[];
  activeChatId: string | null;
  selectedModel: string;
  selectedProvider: ModelProvider;
  isStreaming: boolean;

  createChat: () => string;
  setActiveChat: (id: string) => void;
  deleteChat: (id: string) => void;
  addMessage: (chatId: string, message: Omit<Message, "id" | "timestamp">) => string;
  updateMessage: (chatId: string, messageId: string, updates: Partial<Message>) => void;
  appendToMessage: (chatId: string, messageId: string, content: string) => void;
  setTitle: (chatId: string, title: string) => void;
  setSelectedModel: (model: string, provider: ModelProvider) => void;
  setStreaming: (streaming: boolean) => void;
  getActiveChat: () => Chat | null;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  activeChatId: null,
  selectedModel: "gpt-5.4",
  selectedProvider: "replit",
  isStreaming: false,

  createChat: () => {
    const id = nanoid();
    const { selectedModel, selectedProvider } = get();
    set((state) => ({
      chats: [
        {
          id,
          title: "New Chat",
          messages: [],
          createdAt: Date.now(),
          model: selectedModel,
          provider: selectedProvider,
        },
        ...state.chats,
      ],
      activeChatId: id,
    }));
    return id;
  },

  setActiveChat: (id) => set({ activeChatId: id }),

  deleteChat: (id) =>
    set((state) => {
      const filtered = state.chats.filter((c) => c.id !== id);
      const newActive =
        state.activeChatId === id ? (filtered[0]?.id ?? null) : state.activeChatId;
      return { chats: filtered, activeChatId: newActive };
    }),

  addMessage: (chatId, message) => {
    const id = nanoid();
    set((state) => ({
      chats: state.chats.map((c) =>
        c.id === chatId
          ? { ...c, messages: [...c.messages, { ...message, id, timestamp: Date.now() }] }
          : c,
      ),
    }));
    return id;
  },

  updateMessage: (chatId, messageId, updates) =>
    set((state) => ({
      chats: state.chats.map((c) =>
        c.id === chatId
          ? {
              ...c,
              messages: c.messages.map((m) => (m.id === messageId ? { ...m, ...updates } : m)),
            }
          : c,
      ),
    })),

  appendToMessage: (chatId, messageId, content) =>
    set((state) => ({
      chats: state.chats.map((c) =>
        c.id === chatId
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.id === messageId ? { ...m, content: m.content + content } : m,
              ),
            }
          : c,
      ),
    })),

  setTitle: (chatId, title) =>
    set((state) => ({
      chats: state.chats.map((c) => (c.id === chatId ? { ...c, title } : c)),
    })),

  setSelectedModel: (model, provider) => set({ selectedModel: model, selectedProvider: provider }),

  setStreaming: (streaming) => set({ isStreaming: streaming }),

  getActiveChat: () => {
    const { chats, activeChatId } = get();
    return chats.find((c) => c.id === activeChatId) ?? null;
  },
}));
