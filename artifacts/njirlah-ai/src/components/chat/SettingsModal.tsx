import { motion, AnimatePresence } from "framer-motion";
import { X, Settings2, Trash2, ShieldCheck, Database, Sun, Moon } from "lucide-react";
import { useChatStore } from "@/store/chat-store";
import { useState } from "react";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

type Section = "general" | "privacy";

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { chats, clearAllChats } = useChatStore();
  const [section, setSection] = useState<Section>("general");
  const [confirmClear, setConfirmClear] = useState(false);

  const handleClearAll = () => {
    if (!confirmClear) { setConfirmClear(true); return; }
    clearAllChats();
    setConfirmClear(false);
    onClose();
  };

  const NAV: { id: Section; icon: React.ReactNode; label: string }[] = [
    { id: "general", icon: <Settings2 size={12} />, label: "General" },
    { id: "privacy", icon: <ShieldCheck size={12} />, label: "Privacy & Data" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 26 } }}
            exit={{ opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.15 } }}
            className="relative w-full max-w-xl flex flex-col rounded-xl border border-white/[0.08] shadow-2xl overflow-hidden"
            style={{ background: "#05050A" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
              <div className="p-1.5 rounded-md bg-white/[0.04] border border-white/[0.07]">
                <Settings2 size={13} className="text-white/50" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-white/85">Settings</h2>
                <p className="text-[10px] text-white/25 font-mono mt-0.5">NJIRLAH AI preferences</p>
              </div>
              <button onClick={onClose} className="p-1.5 rounded text-white/25 hover:text-white/60 hover:bg-white/[0.04] transition-colors">
                <X size={14} />
              </button>
            </div>

            <div className="flex flex-1 min-h-0">
              {/* Nav */}
              <div className="w-40 border-r border-white/[0.05] p-2 space-y-0.5 flex-shrink-0">
                {NAV.map((n) => (
                  <motion.button
                    key={n.id}
                    onClick={() => setSection(n.id)}
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-[11px] font-mono transition-colors text-left ${
                      section === n.id
                        ? "text-violet-400 bg-violet-500/[0.07] border border-violet-500/15"
                        : "text-white/35 hover:text-white/60 border border-transparent"
                    }`}
                  >
                    {n.icon}{n.label}
                  </motion.button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 p-5 space-y-5 overflow-y-auto">
                {section === "general" && (
                  <>
                    {/* Chat history stats */}
                    <div className="space-y-1.5">
                      <h3 className="text-[10px] font-mono text-white/30 tracking-widest uppercase">Chat History</h3>
                      <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                        <Database size={12} className="text-white/30" />
                        <div className="flex-1">
                          <p className="text-[12px] text-white/60">{chats.length} conversation{chats.length !== 1 ? "s" : ""} stored</p>
                          <p className="text-[10px] text-white/25 font-mono">Saved locally in your browser</p>
                        </div>
                      </div>

                      <motion.button
                        onClick={handleClearAll}
                        whileHover={{ backgroundColor: confirmClear ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.03)" }}
                        whileTap={{ scale: 0.97 }}
                        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border text-[12px] transition-all ${
                          confirmClear
                            ? "border-red-500/30 text-red-400 bg-red-500/[0.05]"
                            : "border-white/[0.06] text-white/40 hover:text-white/65"
                        }`}
                      >
                        <Trash2 size={12} />
                        {confirmClear ? "Click again to confirm — this cannot be undone" : "Clear all chat history"}
                      </motion.button>
                      {confirmClear && (
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={() => setConfirmClear(false)}
                          className="text-[10px] text-white/25 font-mono hover:text-white/50 transition-colors"
                        >
                          ← cancel
                        </motion.button>
                      )}
                    </div>

                    {/* Appearance */}
                    <div className="space-y-1.5">
                      <h3 className="text-[10px] font-mono text-white/30 tracking-widest uppercase">Appearance</h3>
                      <div className="flex gap-2">
                        {[
                          { label: "Dark", icon: <Moon size={11} />, active: true },
                          { label: "Darker", icon: <Moon size={11} />, active: false },
                        ].map((t) => (
                          <button
                            key={t.label}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[11px] font-mono transition-all ${
                              t.active
                                ? "border-violet-500/30 text-violet-400 bg-violet-500/[0.07]"
                                : "border-white/[0.06] text-white/30 hover:text-white/55 hover:border-white/[0.1]"
                            }`}
                          >
                            {t.icon}{t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Keyboard shortcuts */}
                    <div className="space-y-1.5">
                      <h3 className="text-[10px] font-mono text-white/30 tracking-widest uppercase">Keyboard Shortcuts</h3>
                      <div className="space-y-1 text-[11px]">
                        {[
                          ["Send message", "Enter ↵"],
                          ["New line", "Shift + Enter"],
                          ["New chat", "—"],
                          ["Toggle Dev Panel", "—"],
                        ].map(([action, key]) => (
                          <div key={action} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/[0.015] border border-white/[0.04]">
                            <span className="text-white/40">{action}</span>
                            <span className="font-mono text-white/25 text-[10px] border border-white/[0.07] px-1.5 py-0.5 rounded">{key}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {section === "privacy" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {[
                        {
                          icon: <ShieldCheck size={14} className="text-green-400" />,
                          title: "Your API keys never leave your browser",
                          desc: "Keys are encrypted with AES-GCM and stored in localStorage. They are only sent directly to the AI provider (OpenRouter) — never through our servers.",
                        },
                        {
                          icon: <Database size={14} className="text-violet-400" />,
                          title: "Chat history is stored locally",
                          desc: "All conversations are persisted in your browser's localStorage only. We have no database of your conversations.",
                        },
                        {
                          icon: <Sun size={14} className="text-amber-400" />,
                          title: "No training on your data",
                          desc: "We do not store, log, or use your conversations to train AI models. Your prompts go directly to the AI provider per their own privacy policy.",
                        },
                        {
                          icon: <Trash2 size={14} className="text-red-400" />,
                          title: "Delete your data anytime",
                          desc: "Use 'Clear all chat history' in General settings to immediately remove all locally stored conversations and preferences.",
                        },
                      ].map((item) => (
                        <div key={item.title} className="flex gap-3 px-3 py-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                          <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
                          <div>
                            <p className="text-[12px] font-medium text-white/65 mb-0.5">{item.title}</p>
                            <p className="text-[11px] text-white/30 leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-white/[0.05] flex items-center justify-between">
              <p className="text-[10px] text-white/15 font-mono">NJIRLAH AI · All data local</p>
              <motion.button
                onClick={onClose}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                whileTap={{ scale: 0.96 }}
                className="px-4 py-1.5 rounded-md text-[11px] font-mono text-white/40 hover:text-white/60 transition-colors"
              >
                Done
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
