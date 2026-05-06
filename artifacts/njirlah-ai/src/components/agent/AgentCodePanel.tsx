import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Square, ChevronDown } from "lucide-react";
import { FileTree } from "./FileTree";
import { CodeEditor } from "./CodeEditor";
import type { AgentFile, AgentStatus } from "@/types/agent-types";
import { useApiKeyStore } from "@/store/api-key-store";
import { useModelStore } from "@/store/model-store";

const API_BASE = "/api";

const DEFAULT_PROMPTS = [
  "Landing page dengan hero section, navbar, dan footer",
  "To-do app dengan dark mode dan animasi",
  "Dashboard analytics dengan chart dan statistik",
  "Portfolio pribadi dengan galeri proyek",
];

interface AgentCodePanelProps {
  files: Record<string, AgentFile>;
  fileOrder: string[];
  activeFile: string | null;
  status: AgentStatus;
  logs: string[];
  error: string | null;
  onFileSelect: (filename: string) => void;
  onFilesUpdate: (updater: (prev: Record<string, AgentFile>) => Record<string, AgentFile>) => void;
  onFileOrderUpdate: (updater: (prev: string[]) => string[]) => void;
  onStatusChange: (status: AgentStatus) => void;
  onLogsUpdate: (updater: (prev: string[]) => string[]) => void;
  onErrorChange: (error: string | null) => void;
  onActiveFileChange: (filename: string | null) => void;
}

export function AgentCodePanel({
  files,
  fileOrder,
  activeFile,
  status,
  logs,
  error,
  onFileSelect,
  onFilesUpdate,
  onFileOrderUpdate,
  onStatusChange,
  onLogsUpdate,
  onErrorChange,
  onActiveFileChange,
}: AgentCodePanelProps) {
  const [prompt, setPrompt] = useState("");
  const [modelSource, setModelSource] = useState<"openrouter" | "cloudflare">("cloudflare");
  const [selectedModel, setSelectedModel] = useState("");
  const [showModelPicker, setShowModelPicker] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const { openRouterKey } = useApiKeyStore();
  const { cloudflareModels, openrouterModels } = useModelStore();

  const isGenerating = status === "generating";

  const availableModels =
    modelSource === "openrouter" ? openrouterModels : cloudflareModels;

  const currentModelLabel =
    selectedModel ||
    (modelSource === "cloudflare"
      ? "@cf/meta/llama-3.1-8b-instruct"
      : "openai/gpt-4o-mini");

  const addLog = useCallback(
    (msg: string) => onLogsUpdate((prev) => [...prev.slice(-49), msg]),
    [onLogsUpdate],
  );

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    onFilesUpdate(() => ({}));
    onFileOrderUpdate(() => []);
    onStatusChange("generating");
    onErrorChange(null);
    onActiveFileChange(null);
    onLogsUpdate(() => []);
    addLog("Menghubungi agen AI...");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (modelSource === "openrouter" && openRouterKey) {
        headers["x-api-key"] = openRouterKey;
      }

      const res = await fetch(`${API_BASE}/agent/generate`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          prompt: prompt.trim(),
          modelSource,
          modelId: selectedModel || undefined,
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error(`Server error: ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let firstFileSet = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        let eventType = "";
        let eventData = "";

        for (const line of lines) {
          if (line.startsWith("event: ")) {
            eventType = line.slice(7).trim();
          } else if (line.startsWith("data: ")) {
            eventData = line.slice(6).trim();
          } else if (line === "" && eventType && eventData) {
            try {
              const parsed = JSON.parse(eventData) as Record<string, string>;

              if (eventType === "agent_log") {
                addLog(parsed.message ?? "");
              } else if (eventType === "file_start") {
                const { filename } = parsed;
                if (!firstFileSet) {
                  firstFileSet = true;
                  onActiveFileChange(filename);
                }
                onFileOrderUpdate((prev) =>
                  prev.includes(filename) ? prev : [...prev, filename],
                );
                onFilesUpdate((prev) => ({
                  ...prev,
                  [filename]: {
                    filename,
                    content: "",
                    isStreaming: true,
                    isDone: false,
                  },
                }));
                addLog(`📄 Membuat ${filename}...`);
              } else if (eventType === "file_chunk") {
                const { filename, chunk } = parsed;
                onFilesUpdate((prev) => ({
                  ...prev,
                  [filename]: {
                    ...(prev[filename] ?? {
                      filename,
                      content: "",
                      isStreaming: true,
                      isDone: false,
                    }),
                    content: (prev[filename]?.content ?? "") + chunk,
                  },
                }));
              } else if (eventType === "file_end") {
                const { filename, content } = parsed;
                onFilesUpdate((prev) => ({
                  ...prev,
                  [filename]: {
                    ...(prev[filename] ?? { filename }),
                    content: content ?? prev[filename]?.content ?? "",
                    isStreaming: false,
                    isDone: true,
                  },
                }));
                addLog(`✅ ${filename} selesai`);
              } else if (eventType === "done") {
                onStatusChange("done");
                addLog("🎉 " + (parsed.message ?? "Selesai!"));
              } else if (eventType === "error") {
                onStatusChange("error");
                onErrorChange(parsed.message ?? "Unknown error");
                addLog("❌ Error: " + (parsed.message ?? ""));
              }
            } catch {}
            eventType = "";
            eventData = "";
          }
        }
      }

      if (status !== "error") onStatusChange("done");
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        onStatusChange("stopped");
        addLog("⏹ Dihentikan.");
      } else {
        onStatusChange("error");
        const msg = (err as Error).message ?? "Unknown error";
        onErrorChange(msg);
        addLog("❌ " + msg);
      }
    } finally {
      abortRef.current = null;
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
    onStatusChange("stopped");
  };

  const statusColors: Record<AgentStatus, string> = {
    idle: "text-gray-500",
    generating: "text-blue-400",
    done: "text-green-400",
    error: "text-red-400",
    stopped: "text-yellow-400",
  };

  const statusLabels: Record<AgentStatus, string> = {
    idle: "Siap",
    generating: "Generating...",
    done: "Selesai",
    error: "Error",
    stopped: "Dihentikan",
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "#0d0d18" }}>
      <div className="px-4 pt-4 pb-3 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2
            className="text-white text-[17px] font-semibold"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Agent Code Generator
          </h2>
          <div className={`flex items-center gap-1.5 text-xs ${statusColors[status]}`}>
            {isGenerating && (
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-blue-400"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              />
            )}
            {statusLabels[status]}
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <div
          className="w-44 flex-shrink-0 border-r border-white/5 overflow-y-auto flex flex-col"
          style={{ background: "#080810" }}
        >
          <div className="px-3 py-2 text-[10px] text-gray-600 uppercase tracking-wider font-semibold flex-shrink-0">
            Files
          </div>
          <div className="flex-1">
            <FileTree
              files={files}
              fileOrder={fileOrder}
              activeFile={activeFile}
              onSelectFile={onFileSelect}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1 min-h-0 overflow-hidden" style={{ background: "#0a0a12" }}>
            <CodeEditor
              file={activeFile ? files[activeFile] ?? null : null}
              filename={activeFile}
            />
          </div>

          {logs.length > 0 && (
            <div
              className="border-t border-white/5 px-3 py-2 overflow-y-auto flex-shrink-0"
              style={{ maxHeight: "80px", background: "#06060e" }}
            >
              {logs.slice(-8).map((log, i) => (
                <div key={i} className="text-[10px] font-mono text-gray-500 leading-5">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-4 pb-4 pt-3 border-t border-white/5 space-y-3 flex-shrink-0">
        {error && (
          <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div className="relative">
          <button
            onClick={() => setShowModelPicker((v) => !v)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-xs text-gray-300 hover:border-white/20 transition-colors"
          >
            <span className="truncate font-mono">{currentModelLabel}</span>
            <ChevronDown size={12} className={`flex-shrink-0 transition-transform ${showModelPicker ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {showModelPicker && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full mb-1 left-0 right-0 z-50 rounded-xl border border-white/10 overflow-hidden shadow-2xl"
                style={{ background: "#1a1a2e", maxHeight: "240px", overflowY: "auto" }}
              >
                <div className="flex border-b border-white/5">
                  {(["cloudflare", "openrouter"] as const).map((src) => (
                    <button
                      key={src}
                      onClick={() => { setModelSource(src); setSelectedModel(""); }}
                      className={`flex-1 py-2 text-xs font-medium capitalize transition-colors ${
                        modelSource === src ? "bg-blue-600/20 text-blue-400" : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      {src === "cloudflare" ? "☁️ Cloudflare" : "🔑 OpenRouter"}
                    </button>
                  ))}
                </div>
                {modelSource === "openrouter" && !openRouterKey && (
                  <div className="px-4 py-3 text-[11px] text-yellow-400/80 text-center">
                    Set your OpenRouter API key in Settings first
                  </div>
                )}
                {availableModels.slice(0, 20).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedModel(m.id); setShowModelPicker(false); }}
                    className={`w-full text-left px-3 py-2 text-[11px] transition-colors font-mono ${
                      selectedModel === m.id ? "bg-blue-600/20 text-blue-400" : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {m.id}
                  </button>
                ))}
                {availableModels.length === 0 && (
                  <div className="px-4 py-3 text-[11px] text-gray-500 text-center">
                    {modelSource === "cloudflare" ? "Using default Cloudflare model" : "Load OpenRouter models first"}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {DEFAULT_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => setPrompt(p)}
                className="text-[10px] text-gray-500 border border-white/8 rounded-full px-2 py-0.5 hover:text-gray-300 hover:border-white/20 transition-colors truncate max-w-[160px]"
              >
                {p}
              </button>
            ))}
          </div>

          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate();
              }}
              placeholder="Describe the app you want to build... (⌘+Enter to generate)"
              rows={3}
              className="w-full bg-transparent border border-white/15 rounded-xl px-4 py-3 pr-12 text-white text-sm placeholder-gray-600 outline-none focus:border-blue-500/50 resize-none transition-colors"
              style={{ fontFamily: "Inter, sans-serif" }}
              disabled={isGenerating}
            />
            <div className="absolute right-3 bottom-3 flex gap-1.5">
              {isGenerating ? (
                <motion.button
                  onClick={handleStop}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors"
                  title="Stop generation"
                >
                  <Square size={13} />
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleGenerate}
                  disabled={!prompt.trim()}
                  whileHover={prompt.trim() ? { scale: 1.1 } : {}}
                  whileTap={prompt.trim() ? { scale: 0.9 } : {}}
                  animate={prompt.trim() ? { boxShadow: ["0 0 0px #3B82F6", "0 0 10px #3B82F666", "0 0 0px #3B82F6"] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Generate (⌘+Enter)"
                >
                  <Send size={13} />
                </motion.button>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-700 pb-0.5">
          Dibuat dengan sepenuh hati oleh{" "}
          <span className="text-gray-600">Andikaa Saputraa</span>
        </p>
      </div>
    </div>
  );
}
