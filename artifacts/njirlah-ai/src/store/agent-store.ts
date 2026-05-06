import { create } from "zustand";

export type FileStatus = "pending" | "streaming" | "done";

export interface AgentFileEntry {
  content: string;
  status: FileStatus;
}

export type AgentStatus = "idle" | "generating" | "done" | "error" | "stopped";

interface AgentStore {
  files: Record<string, AgentFileEntry>;
  fileOrder: string[];
  activeFile: string | null;
  isGenerating: boolean;
  agentStatus: AgentStatus;
  logs: string[];
  error: string | null;

  startGeneration: () => void;
  stopGeneration: () => void;
  setDone: () => void;
  setError: (message: string) => void;
  addFileStart: (filename: string) => void;
  appendChunk: (filename: string, chunk: string) => void;
  setFileDone: (filename: string, content?: string) => void;
  setActiveFile: (filename: string | null) => void;
  addLog: (message: string) => void;
  reset: () => void;
}

export const useAgentStore = create<AgentStore>((set, get) => ({
  files: {},
  fileOrder: [],
  activeFile: null,
  isGenerating: false,
  agentStatus: "idle",
  logs: [],
  error: null,

  startGeneration: () =>
    set({
      files: {},
      fileOrder: [],
      activeFile: null,
      isGenerating: true,
      agentStatus: "generating",
      logs: [],
      error: null,
    }),

  stopGeneration: () =>
    set({ isGenerating: false, agentStatus: "stopped" }),

  setDone: () =>
    set({ isGenerating: false, agentStatus: "done" }),

  setError: (message) =>
    set({ isGenerating: false, agentStatus: "error", error: message }),

  addFileStart: (filename) => {
    const { files, fileOrder, activeFile } = get();
    set({
      files: {
        ...files,
        [filename]: { content: "", status: "streaming" },
      },
      fileOrder: fileOrder.includes(filename) ? fileOrder : [...fileOrder, filename],
      activeFile: activeFile ?? filename,
    });
  },

  appendChunk: (filename, chunk) => {
    const { files } = get();
    const existing = files[filename] ?? { content: "", status: "streaming" as FileStatus };
    set({
      files: {
        ...files,
        [filename]: { ...existing, content: existing.content + chunk },
      },
    });
  },

  setFileDone: (filename, content) => {
    const { files } = get();
    const existing = files[filename] ?? { content: "", status: "streaming" as FileStatus };
    set({
      files: {
        ...files,
        [filename]: {
          content: content ?? existing.content,
          status: "done",
        },
      },
    });
  },

  setActiveFile: (filename) => set({ activeFile: filename }),

  addLog: (message) => {
    const { logs } = get();
    set({ logs: [...logs.slice(-49), message] });
  },

  reset: () =>
    set({
      files: {},
      fileOrder: [],
      activeFile: null,
      isGenerating: false,
      agentStatus: "idle",
      logs: [],
      error: null,
    }),
}));
