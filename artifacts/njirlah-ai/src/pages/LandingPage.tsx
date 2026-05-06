import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useRef } from "react";
import { useChatStore } from "@/store/chat-store";
import { useChat } from "@/hooks/useChat";
import { useApiKeyStore } from "@/store/api-key-store";
import { useByokStore } from "@/store/byok-store";
import { ChatArea } from "@/components/chat/ChatArea";
import { ChatBubble, TypingIndicator } from "@/components/chat/ChatBubble";
import { ModelSelector } from "@/components/chat/ModelSelector";
import { Background } from "@/components/layout/Background";
import { NJIRLAHLogo } from "@/components/layout/NJIRLAHLogo";
import { AppearanceApplier } from "@/components/layout/AppearanceApplier";
import { SettingsModal } from "@/components/chat/SettingsModal";
import { ApiKeyModal } from "@/components/chat/ApiKeyModal";
import {
  Plus, MessageSquare, Trash2, Search, X, PanelLeftClose, PanelLeft,
  ArrowUp, Paperclip, Settings, Code2, Zap, Sparkles, ArrowRight
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const SUGGESTIONS = [
  { label: "Tulis puisi", prompt: "Tulis puisi tentang kecerdasan buatan dan masa depan manusia" },
  { label: "Analisis data", prompt: "Jelaskan cara menganalisis data penjualan dan metrik apa yang penting" },
  { label: "Review kode", prompt: "Apa praktik terbaik untuk menulis kode TypeScript yang bersih dan mudah dipelihara?" },
  { label: "Brainstorm", prompt: "Berikan 10 ide startup inovatif di bidang AI dan teknologi untuk 2025" },
];

function navigate(path: string) {
  window.history.pushState({}, "", path);
  window.location.reload();
}

function Sidebar({
  collapsed, onCollapse, onOpenSettings, onOpenApiKey
}: {
  collapsed: boolean;
  onCollapse: () => void;
  onOpenSettings: () => void;
  onOpenApiKey: () => void;
}) {
  const [search, setSearch] = useState("");
  const { chats, activeChatId, createChat, setActiveChat, deleteChat } = useChatStore();

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return chats;
    return chats.filter((c) =>
      c.title.toLowerCase().includes(q) ||
      c.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  }, [chats, search]);

  return (
    <motion.div
      animate={{ width: collapsed ? 52 : 240 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className="flex flex-col h-full border-r border-white/[0.05] flex-shrink-0 overflow-hidden"
      style={{ background: "#09090f" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-white/[0.05] h-[52px]">
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <NJIRLAHLogo size={18} showText />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          onClick={onCollapse}
          whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          whileTap={{ scale: 0.92 }}
          className={`p-1.5 rounded-lg text-white/25 hover:text-white/60 transition-colors ${collapsed ? "mx-auto" : ""}`}
        >
          {collapsed ? <PanelLeft size={14} /> : <PanelLeftClose size={14} />}
        </motion.button>
      </div>

      {/* New Chat */}
      <div className="px-2 py-2">
        <motion.button
          onClick={() => createChat()}
          whileHover={{ backgroundColor: "rgba(139,92,246,0.08)", borderColor: "rgba(139,92,246,0.22)" }}
          whileTap={{ scale: 0.96 }}
          className={`w-full flex items-center border border-white/[0.06] rounded-xl px-2.5 py-2 transition-all group ${collapsed ? "justify-center" : "gap-2.5"}`}
        >
          <Plus size={13} className="text-violet-400/70 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }}
                className="text-[11px] font-medium text-white/40 group-hover:text-white/70 whitespace-nowrap overflow-hidden transition-colors">
                New Chat
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Search */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-2 pb-1.5 overflow-hidden">
            <div className="flex items-center gap-2 bg-white/[0.02] border border-white/[0.05] rounded-lg px-2.5 py-1.5 focus-within:border-violet-500/20 transition-colors">
              <Search size={11} className="text-white/20 flex-shrink-0" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari chat…"
                className="flex-1 bg-transparent text-[11px] text-white/55 placeholder-white/20 focus:outline-none min-w-0" />
              {search && <button onClick={() => setSearch("")} className="text-white/20 hover:text-white/50"><X size={10} /></button>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {filtered.map((chat, i) => (
            <motion.div key={chat.id}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0, transition: { delay: i * 0.03, duration: 0.2 } }} exit={{ opacity: 0, x: -8 }}
              onClick={() => setActiveChat(chat.id)}
              className={`group relative mx-2 mb-0.5 flex items-center gap-2 px-2.5 py-2 rounded-xl cursor-pointer transition-all ${
                activeChatId === chat.id ? "bg-white/[0.06] border border-white/[0.08] text-white" : "hover:bg-white/[0.03] text-white/35 hover:text-white/65 border border-transparent"
              }`}
            >
              {activeChatId === chat.id && (
                <motion.div layoutId="active-bar" className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-violet-400 rounded-full" />
              )}
              <MessageSquare size={12} className={`flex-shrink-0 ${activeChatId === chat.id ? "text-violet-400" : "text-white/20"}`} />
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
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-white/20 hover:text-red-400 transition-all flex-shrink-0">
                  <Trash2 size={10} />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {!search && chats.length === 0 && !collapsed && (
          <p className="text-[10px] text-white/15 text-center py-8 px-4 font-mono">belum ada chat</p>
        )}
      </div>

      {/* Footer */}
      <div className="px-2 py-2 border-t border-white/[0.05] space-y-0.5">
        <motion.button onClick={() => navigate("/app")} whileHover={{ backgroundColor: "rgba(139,92,246,0.07)" }}
          className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-[11px] text-violet-400/60 hover:text-violet-400 transition-colors ${collapsed ? "justify-center" : ""}`}>
          <Code2 size={12} className="flex-shrink-0" />
          <AnimatePresence>{!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap font-mono">Agent Dev</motion.span>}</AnimatePresence>
        </motion.button>
        <motion.button onClick={onOpenSettings} whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
          className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-[11px] text-white/30 hover:text-white/65 transition-colors ${collapsed ? "justify-center" : ""}`}>
          <Settings size={12} className="flex-shrink-0" />
          <AnimatePresence>{!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap font-mono">Settings</motion.span>}</AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
}

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

  return (
    <div className="px-6 pb-5 pt-2 flex-shrink-0">
      <div className="max-w-3xl mx-auto">
        {needsKey && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="mb-3 flex items-center justify-between px-4 py-2.5 rounded-xl border border-amber-500/15 bg-amber-500/[0.04] text-[11px] text-amber-400/70">
            <div className="flex items-center gap-2"><Zap size={11} /> Menggunakan GPT bawaan NJIRLAH — gratis, tanpa key</div>
            <button onClick={onOpenApiKey} className="text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1 transition-colors">Tambah Key <ArrowRight size={10} /></button>
          </motion.div>
        )}

        <div className="relative rounded-2xl border border-white/[0.08] overflow-hidden"
          style={{ background: "#111118", boxShadow: "0 0 0 1px rgba(255,255,255,0.03), 0 -4px 24px rgba(0,0,0,0.3)" }}>
          <textarea ref={textareaRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
            placeholder="Tanyakan apa saja..." rows={1}
            className="w-full px-5 pt-4 pb-2 text-sm text-white/85 placeholder-white/20 bg-transparent resize-none focus:outline-none leading-relaxed"
            style={{ fontFamily: "inherit" }} />

          <div className="flex items-center gap-2 px-4 pb-3">
            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFile} />
            <motion.button onClick={() => fileInputRef.current?.click()} whileTap={{ scale: 0.9 }}
              className="p-1.5 rounded-lg text-white/25 hover:text-white/55 hover:bg-white/[0.05] transition-all" title="Lampirkan file">
              <Paperclip size={13} />
            </motion.button>

            <div className="flex-1">
              <ModelSelector />
            </div>

            <motion.button onClick={send} disabled={!input.trim() || isStreaming}
              whileHover={{ scale: 1.06, boxShadow: "0 0 16px rgba(109,40,217,0.4)" }} whileTap={{ scale: 0.93 }}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-25 flex-shrink-0"
              style={{ background: input.trim() && !isStreaming ? "linear-gradient(135deg, #6d28d9, #7c3aed)" : "rgba(255,255,255,0.06)" }}>
              {isStreaming
                ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Zap size={13} className="text-violet-300" /></motion.div>
                : <ArrowUp size={13} className="text-white" />}
            </motion.button>
          </div>
        </div>

        <p className="text-center text-[10px] text-white/15 mt-2.5 font-mono">
          Enter ↵ kirim · Shift+Enter baris baru
        </p>
      </div>
    </div>
  );
}

function EmptyState({ onSend }: { onSend: (p: string) => void }) {
  return (
    <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="w-full max-w-2xl">
        <div className="flex flex-col items-center mb-10">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 160, damping: 18 }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
            style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.18), rgba(168,85,247,0.08))", border: "1px solid rgba(139,92,246,0.22)" }}>
            <Sparkles size={22} className="text-violet-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white/85 mb-2 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Ada yang bisa dibantu?
          </h2>
          <p className="text-sm text-white/35 text-center max-w-xs leading-relaxed">
            Tanyakan apa saja — penjelasan, tulisan, kode, brainstorm, atau sekedar ngobrol.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-8">
          {SUGGESTIONS.map((s) => (
            <motion.button key={s.label} onClick={() => onSend(s.prompt)}
              whileHover={{ y: -2, borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.025)" }}
              whileTap={{ scale: 0.98 }}
              className="text-left p-4 rounded-xl border border-white/[0.06] transition-all group">
              <p className="text-xs font-semibold text-white/55 group-hover:text-white/80 mb-1.5 transition-colors">{s.label}</p>
              <p className="text-[11px] text-white/30 leading-relaxed">{s.prompt}</p>
            </motion.button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[10px] text-white/20 font-mono">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          GPT built-in gratis · model lain dengan API key sendiri
          <motion.button onClick={() => navigate("/app")} className="ml-3 text-violet-400/50 hover:text-violet-400 flex items-center gap-1 transition-colors">
            <Code2 size={10} /> Agent Dev
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

function ChatBody() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { getActiveChat, isStreaming } = useChatStore();
  const { sendMessage } = useChat();
  const chat = getActiveChat();
  const messages = chat?.messages ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isStreaming]);

  if (!chat || messages.length === 0) {
    return <EmptyState onSend={sendMessage} />;
  }

  return (
    <div className="flex-1 overflow-y-auto py-8 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
      <div className="max-w-3xl mx-auto px-6">
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
    <div className="relative flex h-screen w-screen overflow-hidden" style={{ background: "#08080f" }}>
      <AppearanceApplier />
      <Background />

      <div className="relative z-10 flex w-full h-full">
        <Sidebar collapsed={collapsed} onCollapse={() => setCollapsed((v) => !v)} onOpenSettings={() => setSettingsOpen(true)} onOpenApiKey={() => setApiKeyOpen(true)} />

        <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 h-[52px] border-b border-white/[0.05] flex-shrink-0" style={{ background: "#09090f" }}>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white/55" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>NJIRLAH AI</span>
              <span className="text-[10px] font-mono text-white/20 px-2 py-0.5 rounded-full border border-white/[0.06]">Chat</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.button onClick={() => navigate("/app")} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-violet-500/20 bg-violet-500/[0.06] text-[11px] text-violet-300/80 hover:text-violet-200 hover:border-violet-500/35 transition-all font-mono">
                <Code2 size={11} /> Agent Dev
              </motion.button>
              <motion.button onClick={() => setSettingsOpen(true)} whileTap={{ scale: 0.93 }}
                className="p-2 rounded-xl border border-white/[0.06] text-white/30 hover:text-white/65 hover:border-white/[0.1] transition-all">
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
