import { motion, AnimatePresence } from "framer-motion";
import {
  X, Settings2, Trash2, ShieldCheck, Database, Lock,
  Eye, EyeOff, FileX, Globe, Info, Palette,
} from "lucide-react";
import { useChatStore } from "@/store/chat-store";
import { useAppearanceStore, type AccentColor, type Density } from "@/store/appearance-store";
import { useState } from "react";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

type Section = "general" | "appearance" | "privacy";

const ACCENT_OPTIONS: { key: AccentColor; label: string; dot: string; active: string }[] = [
  { key: "violet",  label: "Violet",  dot: "#7c3aed", active: "border-violet-500/60  text-violet-300  bg-violet-500/10" },
  { key: "blue",    label: "Blue",    dot: "#2563eb", active: "border-blue-500/60    text-blue-300    bg-blue-500/10" },
  { key: "cyan",    label: "Cyan",    dot: "#0891b2", active: "border-cyan-500/60    text-cyan-300    bg-cyan-500/10" },
  { key: "emerald", label: "Emerald", dot: "#059669", active: "border-emerald-500/60 text-emerald-300 bg-emerald-500/10" },
  { key: "rose",    label: "Rose",    dot: "#e11d48", active: "border-rose-500/60    text-rose-300    bg-rose-500/10" },
  { key: "amber",   label: "Amber",   dot: "#d97706", active: "border-amber-500/60   text-amber-300   bg-amber-500/10" },
];

const DENSITY_OPTIONS: { key: Density; label: string; desc: string }[] = [
  { key: "compact",  label: "Compact",  desc: "Tighter spacing · more content visible" },
  { key: "default",  label: "Default",  desc: "Balanced layout" },
  { key: "relaxed",  label: "Relaxed",  desc: "Spacious · easier to read" },
];

const NAV: { id: Section; icon: React.ReactNode; label: string }[] = [
  { id: "general",    icon: <Settings2 size={12} />,   label: "General" },
  { id: "appearance", icon: <Palette size={12} />,     label: "Appearance" },
  { id: "privacy",    icon: <ShieldCheck size={12} />, label: "Privacy & Data" },
];

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { chats, clearAllChats } = useChatStore();
  const { accent, density, setAccent, setDensity } = useAppearanceStore();
  const [section, setSection] = useState<Section>("general");
  const [confirmClear, setConfirmClear] = useState(false);
  const [cleared, setCleared] = useState(false);

  const totalMessages = chats.reduce((sum, c) => sum + c.messages.length, 0);

  const handleClearAll = () => {
    if (!confirmClear) { setConfirmClear(true); return; }
    clearAllChats();
    setConfirmClear(false);
    setCleared(true);
    setTimeout(() => { setCleared(false); onClose(); }, 1200);
  };

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
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 26 } }}
            exit={{ opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.15 } }}
            className="relative w-full max-w-xl flex flex-col rounded-2xl border border-white/[0.08] shadow-2xl overflow-hidden"
            style={{ background: "#07070F", maxHeight: "min(600px, 90vh)" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06] flex-shrink-0">
              <div className="p-1.5 rounded-md bg-violet-500/[0.08] border border-violet-500/15">
                <Settings2 size={13} className="text-violet-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-white/85">Settings</h2>
                <p className="text-[10px] text-white/25 font-mono mt-0.5">NJIRLAH AI · Preferences</p>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg text-white/25 hover:text-white/60 hover:bg-white/[0.04] transition-colors">
                <X size={14} />
              </button>
            </div>

            <div className="flex flex-1 min-h-0 overflow-hidden">
              {/* Nav */}
              <div className="w-44 border-r border-white/[0.05] p-2 space-y-0.5 flex-shrink-0 bg-white/[0.01]">
                {NAV.map((n) => (
                  <motion.button
                    key={n.id}
                    onClick={() => setSection(n.id)}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[11px] font-mono transition-all text-left ${
                      section === n.id
                        ? "text-violet-300 bg-violet-500/[0.1] border border-violet-500/20"
                        : "text-white/30 hover:text-white/60 hover:bg-white/[0.03] border border-transparent"
                    }`}
                  >
                    {n.icon}{n.label}
                  </motion.button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 p-5 space-y-5 overflow-y-auto">

                {/* ── GENERAL ── */}
                {section === "general" && (
                  <>
                    <div className="space-y-2">
                      <h3 className="text-[10px] font-mono text-white/25 tracking-widest uppercase">Chat History</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                          <span className="text-[10px] text-white/25 font-mono">Conversations</span>
                          <span className="text-lg font-bold text-white/70 font-mono">{chats.length}</span>
                        </div>
                        <div className="flex flex-col gap-1 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                          <span className="text-[10px] text-white/25 font-mono">Total Messages</span>
                          <span className="text-lg font-bold text-white/70 font-mono">{totalMessages}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.015] border border-white/[0.04]">
                        <Database size={11} className="text-white/20 flex-shrink-0" />
                        <p className="text-[11px] text-white/30 font-mono">Stored locally in your browser only</p>
                      </div>

                      <AnimatePresence mode="wait">
                        {cleared ? (
                          <motion.div key="cleared" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-green-500/25 text-green-400 bg-green-500/[0.05] text-sm">
                            ✓ All chat history cleared
                          </motion.div>
                        ) : (
                          <motion.button key="clear-btn" onClick={handleClearAll}
                            whileHover={{ backgroundColor: confirmClear ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.02)" }}
                            whileTap={{ scale: 0.97 }}
                            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border text-[12px] transition-all text-left ${
                              confirmClear
                                ? "border-red-500/30 text-red-400 bg-red-500/[0.04]"
                                : "border-white/[0.06] text-white/35 hover:text-white/60"
                            }`}
                          >
                            <Trash2 size={12} />
                            {confirmClear ? "Click again to confirm — cannot be undone" : "Clear all chat history"}
                          </motion.button>
                        )}
                      </AnimatePresence>

                      {confirmClear && !cleared && (
                        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          onClick={() => setConfirmClear(false)}
                          className="text-[10px] text-white/20 font-mono hover:text-white/45 transition-colors">
                          ← cancel
                        </motion.button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-[10px] font-mono text-white/25 tracking-widest uppercase">Keyboard Shortcuts</h3>
                      <div className="space-y-1 text-[11px]">
                        {[
                          ["Send message",      "Enter ↵"],
                          ["New line",          "Shift + Enter"],
                          ["Edit last message", "↑ Arrow"],
                          ["Voice input",       "Click 🎤"],
                          ["Attach file",       "Click 📎"],
                        ].map(([action, key]) => (
                          <div key={action} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/[0.015] border border-white/[0.04]">
                            <span className="text-white/35">{action}</span>
                            <span className="font-mono text-white/20 text-[10px] border border-white/[0.07] px-1.5 py-0.5 rounded">{key}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-[10px] font-mono text-white/25 tracking-widest uppercase mb-2">About</h3>
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.015] border border-white/[0.04]">
                        <Info size={11} className="text-white/20" />
                        <div>
                          <p className="text-[11px] text-white/40 font-mono">NJIRLAH AI · v1.0.0</p>
                          <p className="text-[10px] text-white/20 font-mono">React · Vite · Tailwind CSS 4 · Framer Motion</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* ── APPEARANCE ── */}
                {section === "appearance" && (
                  <>
                    <div className="space-y-2">
                      <h3 className="text-[10px] font-mono text-white/25 tracking-widest uppercase">Accent Color</h3>
                      <p className="text-[10px] text-white/20 font-mono px-0.5">Changes instantly — affects buttons, borders, highlights and the typing indicator.</p>
                      <div className="grid grid-cols-3 gap-2">
                        {ACCENT_OPTIONS.map((a) => (
                          <motion.button
                            key={a.key}
                            onClick={() => setAccent(a.key)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-[11px] font-mono transition-all ${
                              accent === a.key
                                ? a.active
                                : "border-white/[0.06] text-white/30 hover:text-white/55 hover:border-white/[0.1]"
                            }`}
                          >
                            <span className="w-3 h-3 rounded-full flex-shrink-0 ring-2 ring-white/10" style={{ backgroundColor: a.dot }} />
                            {a.label}
                            {accent === a.key && <span className="ml-auto text-[8px]">✓</span>}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-[10px] font-mono text-white/25 tracking-widest uppercase">Message Density</h3>
                      <div className="space-y-1.5">
                        {DENSITY_OPTIONS.map((d) => (
                          <motion.button
                            key={d.key}
                            onClick={() => setDensity(d.key)}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-left transition-all ${
                              density === d.key
                                ? "border-violet-500/25 bg-violet-500/[0.07] text-violet-300"
                                : "border-white/[0.06] text-white/35 hover:text-white/60 hover:border-white/[0.1]"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-[12px] font-medium">{d.label}</span>
                              {density === d.key && <span className="text-[9px] font-mono text-violet-400/70">active</span>}
                            </div>
                            <span className="text-[10px] font-mono text-white/20">{d.desc}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-[10px] font-mono text-white/25 tracking-widest uppercase">Theme</h3>
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-violet-500/20 bg-violet-500/[0.04]">
                        <span className="text-[11px] text-violet-400/80 font-mono">Dark Mode Only</span>
                        <span className="ml-auto text-[10px] text-white/20 font-mono">Light mode coming soon</span>
                      </div>
                    </div>
                  </>
                )}

                {/* ── PRIVACY & DATA ── */}
                {section === "privacy" && (
                  <div className="space-y-4">
                    <div className="px-3 py-3 rounded-xl border border-green-500/20 bg-green-500/[0.04]">
                      <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck size={13} className="text-green-400" />
                        <span className="text-[12px] font-semibold text-green-300">Privacy-first by design</span>
                      </div>
                      <p className="text-[11px] text-white/35 leading-relaxed font-mono">
                        NJIRLAH AI is built so your data never leaves your device. No account required. No data collection. No telemetry.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-[10px] font-mono text-white/25 tracking-widest uppercase">What We Store</h3>
                      {[
                        { icon: <Lock size={12} className="text-violet-400" />, title: "API Keys", desc: "Encrypted with AES-GCM in your browser's localStorage. Never transmitted anywhere.", status: "Local only" },
                        { icon: <Database size={12} className="text-blue-400" />, title: "Chat History", desc: "Persisted in localStorage via Zustand persist. We have zero access to your conversations.", status: "Local only" },
                        { icon: <Palette size={12} className="text-amber-400" />, title: "Preferences", desc: "Theme, accent, density settings stored in localStorage.", status: "Local only" },
                      ].map((item) => (
                        <div key={item.title} className="flex gap-3 px-3 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                          <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <p className="text-[12px] font-medium text-white/65">{item.title}</p>
                              <span className="text-[9px] font-mono font-bold border border-green-500/20 text-green-400/60 px-1.5 py-0.5 rounded flex-shrink-0">{item.status}</span>
                            </div>
                            <p className="text-[10px] text-white/25 leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-[10px] font-mono text-white/25 tracking-widest uppercase">What We Don't Do</h3>
                      {[
                        { icon: <EyeOff size={11} className="text-red-400/70" />, text: "We do not log, read, or analyze your messages" },
                        { icon: <Globe size={11} className="text-red-400/70" />,   text: "We do not send prompts to any analytics service" },
                        { icon: <FileX size={11} className="text-red-400/70" />,   text: "We do not train AI models on your conversations" },
                        { icon: <Eye size={11} className="text-red-400/70" />,     text: "We have no backend database of users or conversations" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.015] border border-white/[0.04]">
                          {item.icon}
                          <span className="text-[11px] text-white/35">{item.text}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-[10px] font-mono text-white/25 tracking-widest uppercase">Third-Party Providers</h3>
                      <div className="px-3 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                        <p className="text-[11px] text-white/30 leading-relaxed">
                          Messages go directly from your browser to the AI provider you selected (OpenAI, Anthropic, Cloudflare, OpenRouter). Each provider has their own privacy policy. NJIRLAH AI is only a client — we are never in the middle of that connection.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-white/[0.05] flex items-center justify-between flex-shrink-0">
              <p className="text-[10px] text-white/15 font-mono">All data stays on your device</p>
              <motion.button
                onClick={onClose}
                whileHover={{ backgroundColor: "rgba(124,58,237,0.08)" }}
                whileTap={{ scale: 0.96 }}
                className="px-4 py-1.5 rounded-lg text-[11px] font-mono text-violet-400/60 hover:text-violet-300 border border-violet-500/15 hover:border-violet-500/30 transition-all"
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
