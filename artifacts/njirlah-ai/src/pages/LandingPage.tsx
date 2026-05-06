import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "@/store/chat-store";
import { useChat } from "@/hooks/useChat";
import { useApiKeyStore } from "@/store/api-key-store";
import { useByokStore } from "@/store/byok-store";
import { ChatBubble, TypingIndicator } from "@/components/chat/ChatBubble";
import { ModelSelector } from "@/components/chat/ModelSelector";
import { Background } from "@/components/layout/Background";
import { NJIRLAHLogo } from "@/components/layout/NJIRLAHLogo";
import { AppearanceApplier } from "@/components/layout/AppearanceApplier";
import { SettingsModal } from "@/components/chat/SettingsModal";
import { ApiKeyModal } from "@/components/chat/ApiKeyModal";
import {
  Plus, MessageSquare, Trash2, Search, X, PanelLeftClose, PanelLeft,
  ArrowUp, Paperclip, Settings, Sparkles, Key, ChevronRight,
  Zap, Bot, Code2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const SUGGESTIONS = [
  { icon: "✍️", label: "Tulis puisi", prompt: "Tulis puisi tentang kecerdasan buatan dan masa depan manusia" },
  { icon: "📊", label: "Analisis data", prompt: "Jelaskan cara menganalisis data penjualan dan metrik apa yang penting" },
  { icon: "💻", label: "Review kode", prompt: "Apa praktik terbaik untuk menulis kode TypeScript yang bersih?" },
  { icon: "💡", label: "Brainstorm", prompt: "Berikan 10 ide startup inovatif di bidang AI untuk 2025" },
];

function navigate(path: string) {
  window.history.pushState({}, "", path);
  window.location.reload();
}

/* ── Sidebar ── */
function Sidebar({ collapsed, onCollapse, onOpenSettings, onOpenApiKey }: {
  collapsed: boolean; onCollapse: () => void; onOpenSettings: () => void; onOpenApiKey: () => void;
}) {
  const [search, setSearch] = useState("");
  const { chats, activeChatId, createChat, setActiveChat, deleteChat } = useChatStore();

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return chats;
    return chats.filter((c) =>
      c.title.toLowerCase().includes(q) || c.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  }, [chats, search]);

  return (
    <motion.div
      animate={{ width: collapsed ? 54 : 248 }}
      transition={{ type: "spring", stiffness: 340, damping: 30 }}
      className="flex flex-col h-full flex-shrink-0 overflow-hidden relative"
      style={{ background: "rgba(5,5,12,0.98)", borderRight: "1px solid rgba(139,92,246,0.08)" }}
    >
      {/* Subtle violet top line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)" }} />

      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 h-[54px]" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.15 }}>
              <NJIRLAHLogo size={18} showText />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          onClick={onCollapse}
          whileHover={{ backgroundColor: "rgba(139,92,246,0.08)" }}
          whileTap={{ scale: 0.92 }}
          className={`p-1.5 rounded-lg text-white/25 hover:text-violet-400 transition-all ${collapsed ? "mx-auto" : ""}`}
        >
          {collapsed ? <PanelLeft size={14} /> : <PanelLeftClose size={14} />}
        </motion.button>
      </div>

      {/* New Chat */}
      <div className="px-2.5 pt-3 pb-2">
        <motion.button
          onClick={() => createChat()}
          whileHover={{ borderColor: "rgba(139,92,246,0.35)", backgroundColor: "rgba(139,92,246,0.07)" }}
          whileTap={{ scale: 0.97 }}
          className={`w-full flex items-center rounded-xl px-3 py-2.5 border transition-all group ${collapsed ? "justify-center border-white/[0.06]" : "gap-2.5 border-white/[0.07]"}`}
          style={{ background: "rgba(139,92,246,0.04)" }}
        >
          <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
            <Plus size={13} className="text-violet-400/80 group-hover:text-violet-300 flex-shrink-0 transition-colors" />
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }}
                className="text-[11.5px] font-medium text-white/45 group-hover:text-white/75 whitespace-nowrap overflow-hidden transition-colors">
                Chat Baru
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Search */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-2.5 pb-2 overflow-hidden">
            <div className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-all"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <Search size={11} className="text-white/20 flex-shrink-0" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari chat…"
                className="flex-1 bg-transparent text-[11px] text-white/55 placeholder-white/20 focus:outline-none min-w-0 font-mono" />
              {search && <button onClick={() => setSearch("")} className="text-white/20 hover:text-white/50 transition-colors"><X size={10} /></button>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {filtered.map((chat, i) => (
            <motion.div key={chat.id}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0, transition: { delay: i * 0.025, duration: 0.18 } }} exit={{ opacity: 0, x: -10 }}
              onClick={() => setActiveChat(chat.id)}
              className={`group relative mx-2 mb-0.5 flex items-center gap-2 px-2.5 py-2 rounded-xl cursor-pointer transition-all ${
                activeChatId === chat.id
                  ? "text-white"
                  : "hover:bg-white/[0.025] text-white/35 hover:text-white/65 border border-transparent"
              }`}
              style={activeChatId === chat.id ? {
                background: "rgba(139,92,246,0.08)",
                border: "1px solid rgba(139,92,246,0.15)",
              } : {}}
            >
              {activeChatId === chat.id && (
                <motion.div layoutId="active-bar-lp" className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-full"
                  style={{ background: "linear-gradient(180deg, #a78bfa, #7c3aed)" }} />
              )}
              <MessageSquare size={12} className={`flex-shrink-0 transition-colors ${activeChatId === chat.id ? "text-violet-400" : "text-white/18"}`} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium truncate">{chat.title}</p>
                    <p className="text-[9px] text-white/20 font-mono">{formatDistanceToNow(chat.createdAt, { addSuffix: true, locale: idLocale })}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              {!collapsed && (
                <button onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded-md text-white/20 hover:text-red-400 transition-all flex-shrink-0">
                  <Trash2 size={10} />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {!search && chats.length === 0 && !collapsed && (
          <div className="text-center py-10 px-4">
            <MessageSquare size={20} className="mx-auto mb-2 text-white/8" />
            <p className="text-[10px] text-white/15 font-mono">Belum ada chat</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-2.5 py-2.5 space-y-0.5" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        {[
          { icon: <Key size={12} />, label: "API NJIR", onClick: () => navigate("/api-njir"), color: "text-violet-400/75 hover:text-violet-300", hoverBg: "rgba(139,92,246,0.08)" },
          { icon: <Code2 size={12} />, label: "Agent Dev", onClick: () => navigate("/app"), color: "text-blue-400/60 hover:text-blue-300", hoverBg: "rgba(59,130,246,0.06)" },
          { icon: <Settings size={12} />, label: "Pengaturan", onClick: onOpenSettings, color: "text-white/30 hover:text-white/65", hoverBg: "rgba(255,255,255,0.03)" },
        ].map((item) => (
          <motion.button key={item.label} onClick={item.onClick}
            whileHover={{ backgroundColor: item.hoverBg }}
            whileTap={{ scale: 0.97 }}
            className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-[11px] transition-all ${item.color} ${collapsed ? "justify-center" : ""}`}>
            {item.icon}
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap font-mono font-medium">{item.label}</motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Input Bar ── */
function ChatInputBar({ onOpenApiKey }: { onOpenApiKey: () => void }) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isStreaming } = useChatStore();
  const { sendMessage } = useChat();
  const { openRouterKey } = useApiKeyStore();

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }, [input]);

  const send = async () => {
    const msg = input.trim();
    if (!msg || isStreaming) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    await sendMessage(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setInput((prev) => prev + (prev ? "\n\n" : "") + `[File: ${file.name}]\n\`\`\`\n${text.slice(0, 8000)}\n\`\`\``);
  };

  const needsKey = !openRouterKey;
  const canSend = input.trim() && !isStreaming;

  return (
    <div className="px-5 pb-5 pt-2 flex-shrink-0">
      <div className="max-w-3xl mx-auto">
        {needsKey && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="mb-3 flex items-center justify-between px-4 py-2.5 rounded-xl transition-all"
            style={{ border: "1px solid rgba(251,191,36,0.12)", background: "rgba(251,191,36,0.04)" }}>
            <div className="flex items-center gap-2 text-[11px] text-amber-400/70">
              <Zap size={11} /> Pakai GPT bawaan NJIRLAH — gratis, tanpa key
            </div>
            <button onClick={onOpenApiKey} className="text-[11px] text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1 transition-colors">
              Tambah Key <ChevronRight size={10} />
            </button>
          </motion.div>
        )}

        {/* Input container */}
        <div className="relative rounded-2xl overflow-hidden transition-all"
          style={{
            background: "#0e0e18",
            border: `1px solid ${canSend ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.07)"}`,
            boxShadow: canSend ? "0 0 24px rgba(139,92,246,0.08), 0 -4px 20px rgba(0,0,0,0.4)" : "0 -4px 20px rgba(0,0,0,0.4)",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}>
          <textarea ref={textareaRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
            placeholder="Tanyakan apa saja…" rows={1}
            className="w-full px-5 pt-4 pb-2 text-sm text-white/85 placeholder-white/20 bg-transparent resize-none focus:outline-none leading-relaxed"
            style={{ fontFamily: "inherit" }} />

          <div className="flex items-center gap-2 px-4 pb-3.5 pt-1">
            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFile} />
            <motion.button onClick={() => fileInputRef.current?.click()} whileTap={{ scale: 0.9 }}
              className="p-1.5 rounded-lg text-white/25 hover:text-white/55 hover:bg-white/[0.05] transition-all" title="Lampirkan file">
              <Paperclip size={13} />
            </motion.button>
            <div className="flex-1">
              <ModelSelector />
            </div>
            <motion.button onClick={send} disabled={!canSend}
              whileHover={canSend ? { scale: 1.08, boxShadow: "0 0 20px rgba(109,40,217,0.5)" } : {}}
              whileTap={canSend ? { scale: 0.93 } : {}}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-20 flex-shrink-0"
              style={{ background: canSend ? "linear-gradient(135deg, #6d28d9, #8b5cf6)" : "rgba(255,255,255,0.05)" }}>
              {isStreaming
                ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <Zap size={13} className="text-violet-300" />
                  </motion.div>
                : <ArrowUp size={13} className="text-white" />}
            </motion.button>
          </div>
        </div>

        <p className="text-center text-[10px] text-white/12 mt-2 font-mono">
          Enter ↵ kirim · Shift+Enter baris baru
        </p>
      </div>
    </div>
  );
}

/* ── Empty State ── */
function EmptyState({ onSend }: { onSend: (p: string) => void }) {
  return (
    <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-2xl">
        {/* Logo / Icon */}
        <div className="flex flex-col items-center mb-10">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
            className="relative mb-6"
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(109,40,217,0.2), rgba(139,92,246,0.08))",
                border: "1px solid rgba(139,92,246,0.25)",
                boxShadow: "0 0 40px rgba(109,40,217,0.15)",
              }}>
              <Sparkles size={28} className="text-violet-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #10b981, #059669)", border: "2px solid #05050A" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-3xl font-bold mb-3 tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif", background: "linear-gradient(135deg, #fff 0%, rgba(167,139,250,0.9) 50%, rgba(56,189,248,0.8) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Ada yang bisa dibantu?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-sm text-white/35 text-center max-w-xs leading-relaxed">
            Tanyakan apa saja — penjelasan, kode, tulisan, brainstorm, atau sekadar ngobrol.
          </motion.p>
        </div>

        {/* Suggestion grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="grid grid-cols-2 gap-2.5 mb-8">
          {SUGGESTIONS.map((s, i) => (
            <motion.button key={s.label} onClick={() => onSend(s.prompt)}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 + i * 0.05 }}
              whileHover={{ y: -2, borderColor: "rgba(139,92,246,0.2)", backgroundColor: "rgba(139,92,246,0.04)" }}
              whileTap={{ scale: 0.98 }}
              className="text-left p-4 rounded-xl border border-white/[0.06] transition-all group">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">{s.icon}</span>
                <p className="text-xs font-semibold text-white/60 group-hover:text-white/80 transition-colors">{s.label}</p>
              </div>
              <p className="text-[11px] text-white/28 leading-relaxed group-hover:text-white/40 transition-colors">{s.prompt}</p>
            </motion.button>
          ))}
        </motion.div>

        {/* Status bar */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
          className="flex items-center justify-center gap-3 text-[10px] text-white/20 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            GPT built-in gratis
          </span>
          <span className="w-px h-3 bg-white/10" />
          <span>model lain dengan API key</span>
          <span className="w-px h-3 bg-white/10" />
          <motion.button onClick={() => navigate("/api-njir")} className="text-violet-400/50 hover:text-violet-400 flex items-center gap-1 transition-colors">
            <Key size={9} /> API NJIR
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ── Chat body ── */
function ChatBody() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { getActiveChat, isStreaming } = useChatStore();
  const { sendMessage } = useChat();
  const chat = getActiveChat();
  const messages = chat?.messages ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isStreaming]);

  if (!chat || messages.length === 0) return <EmptyState onSend={sendMessage} />;

  return (
    <div className="flex-1 overflow-y-auto py-8 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
      <div className="max-w-3xl mx-auto px-5">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <ChatBubble key={msg.id} message={msg} chatId={chat.id} isLast={i === messages.length - 1} index={i} />
          ))}
        </AnimatePresence>
        {isStreaming && messages[messages.length - 1]?.role !== "assistant" && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function LandingPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKeyOpen, setApiKeyOpen] = useState(false);
  const { chats, createChat } = useChatStore();
  const { loadKey } = useApiKeyStore();
  const { loadAll } = useByokStore();

  useEffect(() => { loadKey(); loadAll(); }, [loadKey, loadAll]);
  useEffect(() => { if (chats.length === 0) createChat(); }, []);

  return (
    <div className="relative flex h-screen w-screen overflow-hidden" style={{ background: "#05050A" }}>
      <AppearanceApplier />
      <Background />

      <div className="relative z-10 flex w-full h-full">
        <Sidebar
          collapsed={collapsed}
          onCollapse={() => setCollapsed((v) => !v)}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenApiKey={() => setApiKeyOpen(true)}
        />

        {/* Main content */}
        <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 h-[54px] flex-shrink-0"
            style={{ background: "rgba(5,5,12,0.95)", borderBottom: "1px solid rgba(139,92,246,0.06)" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #6d28d9, #8b5cf6)", boxShadow: "0 0 12px rgba(109,40,217,0.3)" }}>
                <Bot size={13} className="text-white" />
              </div>
              <span className="text-sm font-bold text-white/70" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>NJIRLAH AI</span>
              <span className="text-[9px] font-mono font-bold text-violet-400/60 px-1.5 py-0.5 rounded border"
                style={{ borderColor: "rgba(139,92,246,0.2)", background: "rgba(139,92,246,0.06)" }}>CHAT</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => navigate("/api-njir")}
                whileHover={{ scale: 1.02, borderColor: "rgba(139,92,246,0.4)" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] text-violet-300/80 hover:text-violet-200 font-mono font-semibold transition-all"
                style={{ border: "1px solid rgba(139,92,246,0.2)", background: "rgba(139,92,246,0.06)" }}>
                <Key size={11} /> API NJIR
              </motion.button>
              <motion.button
                onClick={() => setSettingsOpen(true)}
                whileTap={{ scale: 0.93 }}
                className="p-2 rounded-xl text-white/30 hover:text-white/65 transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                <Settings size={14} />
              </motion.button>
            </div>
          </div>

          <ChatBody />
          <ChatInputBar onOpenApiKey={() => setApiKeyOpen(true)} />
        </div>
      </div>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <ApiKeyModal open={apiKeyOpen} onClose={() => setApiKeyOpen(false)} />
    </div>
  );
}
