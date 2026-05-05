import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileText, FileJson, Check } from "lucide-react";
import { useState } from "react";
import { useChatStore } from "@/store/chat-store";

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
}

export function ExportModal({ open, onClose }: ExportModalProps) {
  const [exported, setExported] = useState<"md" | "json" | null>(null);
  const { getActiveChat, chats } = useChatStore();
  const chat = getActiveChat();

  const exportMarkdown = () => {
    if (!chat) return;
    const lines = [`# ${chat.title}`, `*Exported from NJIRLAH AI — ${new Date().toLocaleString("id-ID")}*`, ""];
    for (const msg of chat.messages) {
      lines.push(`**${msg.role === "user" ? "You" : "🦄 NJIRLAH AI"}**`);
      lines.push(msg.content);
      lines.push("");
    }
    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${chat.title.replace(/\s+/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setExported("md");
    setTimeout(() => setExported(null), 2000);
  };

  const exportJSON = () => {
    if (!chat) return;
    const data = {
      id: chat.id,
      title: chat.title,
      model: chat.model,
      provider: chat.provider,
      createdAt: new Date(chat.createdAt).toISOString(),
      exportedAt: new Date().toISOString(),
      messages: chat.messages.map(({ role, content, timestamp }) => ({
        role, content, timestamp: new Date(timestamp).toISOString(),
      })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${chat.title.replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExported("json");
    setTimeout(() => setExported(null), 2000);
  };

  const exportAllJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      totalChats: chats.length,
      chats: chats.map((c) => ({
        id: c.id,
        title: c.title,
        model: c.model,
        provider: c.provider,
        createdAt: new Date(c.createdAt).toISOString(),
        messages: c.messages.map(({ role, content, timestamp }) => ({
          role, content, timestamp: new Date(timestamp).toISOString(),
        })),
      })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `njirlah-ai-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasMessages = (chat?.messages.length ?? 0) > 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 26 } }}
            exit={{ opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.15 } }}
            className="relative w-full max-w-sm bg-[#080808] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
            <div className="p-5">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md border border-violet-500/20 bg-violet-500/[0.06]">
                    <Download size={14} className="text-violet-400" />
                  </div>
                  <h2 className="text-sm font-semibold text-white tracking-tight">Export Chat</h2>
                </div>
                <motion.button
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-1.5 rounded-md text-white/25 hover:text-white/60 transition-colors"
                >
                  <X size={14} />
                </motion.button>
              </div>

              {!hasMessages ? (
                <p className="text-xs text-white/25 font-mono text-center py-6">No messages to export in current chat.</p>
              ) : (
                <div className="space-y-2 mb-4">
                  <p className="text-[10px] text-white/20 font-mono tracking-widest uppercase mb-3">Current chat</p>

                  {[
                    { label: "Export as Markdown", desc: "Human-readable .md file", icon: <FileText size={14} />, action: exportMarkdown, format: "md" as const },
                    { label: "Export as JSON", desc: "Structured data with metadata", icon: <FileJson size={14} />, action: exportJSON, format: "json" as const },
                  ].map((item) => (
                    <motion.button
                      key={item.format}
                      onClick={item.action}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.04)", x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center gap-3 px-3.5 py-3 rounded-lg border border-white/[0.06] transition-all text-left"
                    >
                      <span className="text-white/30">{item.icon}</span>
                      <div className="flex-1">
                        <p className="text-xs text-white/65 font-medium">{item.label}</p>
                        <p className="text-[10px] text-white/25 font-mono">{item.desc}</p>
                      </div>
                      <AnimatePresence mode="wait">
                        {exported === item.format ? (
                          <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                            <Check size={13} className="text-green-400" />
                          </motion.div>
                        ) : (
                          <motion.div key="dl" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <Download size={13} className="text-white/20" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  ))}
                </div>
              )}

              {chats.length > 1 && (
                <>
                  <div className="border-t border-white/[0.06] my-3" />
                  <p className="text-[10px] text-white/20 font-mono tracking-widest uppercase mb-2">All chats</p>
                  <motion.button
                    onClick={exportAllJSON}
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 px-3.5 py-3 rounded-lg border border-white/[0.06] transition-all text-left"
                  >
                    <FileJson size={14} className="text-white/25" />
                    <div className="flex-1">
                      <p className="text-xs text-white/55 font-medium">Export all {chats.length} chats</p>
                      <p className="text-[10px] text-white/20 font-mono">Full history as JSON</p>
                    </div>
                    <Download size={13} className="text-white/20" />
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
