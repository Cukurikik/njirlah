import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowUp, Plus, Zap, Copy, Check,
  ThumbsUp, ThumbsDown, RefreshCw, MessageSquare, Sparkles
} from "lucide-react";

interface Msg {
  id: string;
  role: "user" | "assistant";
  content: string;
  loading?: boolean;
}

const SUGGESTIONS = [
  "Jelaskan perbedaan antara REST API dan GraphQL",
  "Tulis puisi tentang teknologi dan mimpi",
  "Apa itu machine learning? Jelaskan untuk pemula",
  "Bantu saya menulis email profesional ke klien",
];

const BASE = import.meta.env.BASE_URL ?? "/";

function navigate(path: string) {
  window.history.pushState({}, "", path);
  window.location.reload();
}

async function callAI(messages: { role: string; content: string }[]): Promise<ReadableStream<string>> {
  const resp = await fetch(`${BASE}api/replit/chat`.replace("//", "/"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages,
      model: "gpt-4o-mini",
      stream: true,
    }),
  });
  if (!resp.ok) throw new Error("API error");
  const reader = resp.body!.getReader();
  const decoder = new TextDecoder();
  return new ReadableStream<string>({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) { controller.close(); return; }
      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter((l) => l.startsWith("data: ") && l !== "data: [DONE]");
      for (const line of lines) {
        try {
          const json = JSON.parse(line.replace("data: ", ""));
          const delta = json.choices?.[0]?.delta?.content ?? "";
          if (delta) controller.enqueue(delta);
        } catch {}
      }
    },
  });
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");

    const userMsg: Msg = { id: Date.now().toString(), role: "user", content };
    const asstId = (Date.now() + 1).toString();
    const asstMsg: Msg = { id: asstId, role: "assistant", content: "", loading: true };

    setMessages((prev) => [...prev, userMsg, asstMsg]);
    setLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));
      const stream = await callAI(history);
      const reader = stream.getReader();
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += value;
        setMessages((prev) =>
          prev.map((m) => (m.id === asstId ? { ...m, content: full, loading: false } : m))
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === asstId ? { ...m, content: "Maaf, terjadi kesalahan. Coba lagi.", loading: false } : m
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden" style={{ background: "#0d0d0d", fontFamily: "'Space Grotesk', Inter, sans-serif" }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-5 h-14 border-b border-white/[0.05] flex-shrink-0" style={{ background: "#111111" }}>
        <motion.button
          onClick={() => navigate("/")}
          whileHover={{ backgroundColor: "rgba(255,255,255,0.06)" }}
          whileTap={{ scale: 0.94 }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/45 hover:text-white/75 transition-colors"
        >
          <ArrowLeft size={14} />
          Home
        </motion.button>

        <div className="h-4 w-px bg-white/[0.08]" />

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6d28d9, #a855f7)" }}>
            <MessageSquare size={12} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-white/70">AI Chat</span>
          <span className="text-[10px] font-mono text-violet-400/60 bg-violet-500/[0.08] border border-violet-500/15 px-2 py-0.5 rounded-full">BIASA</span>
        </div>

        <div className="flex-1" />

        <motion.button
          onClick={() => setMessages([])}
          whileHover={{ backgroundColor: "rgba(255,255,255,0.06)" }}
          whileTap={{ scale: 0.94 }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-white/35 hover:text-white/65 transition-colors"
        >
          <Plus size={12} />
          New chat
        </motion.button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {messages.length === 0 ? (
            /* Empty state */
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center pt-16 pb-8"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 160, damping: 18 }}
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.2), rgba(168,85,247,0.1))", border: "1px solid rgba(139,92,246,0.25)" }}
              >
                <Sparkles size={24} className="text-violet-400" />
              </motion.div>
              <h2 className="text-xl font-bold text-white/85 mb-2">AI Serba Bisa</h2>
              <p className="text-sm text-white/35 mb-10 max-w-xs leading-relaxed">
                Tanya apa saja — tidak ada coding agent di sini, hanya AI biasa yang siap ngobrol dan membantu.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {SUGGESTIONS.map((s) => (
                  <motion.button
                    key={s}
                    onClick={() => send(s)}
                    whileHover={{ y: -2, borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.03)" }}
                    whileTap={{ scale: 0.98 }}
                    className="text-left px-4 py-3.5 rounded-xl border border-white/[0.06] text-sm text-white/45 hover:text-white/75 transition-all leading-snug"
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <MsgBubble key={msg.id} msg={msg} onRegenerate={() => {}} />
              ))}
            </AnimatePresence>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 pb-6 pt-2" style={{ background: "#0d0d0d" }}>
        <div className="max-w-2xl mx-auto">
          <div className="relative rounded-2xl border border-white/[0.09] overflow-hidden"
            style={{ background: "#1a1a1a", boxShadow: "0 0 0 1px rgba(255,255,255,0.03), 0 -8px 32px rgba(0,0,0,0.3)" }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Tulis pesan..."
              rows={1}
              className="w-full px-5 pt-4 pb-2 text-sm text-white/85 placeholder-white/20 bg-transparent resize-none focus:outline-none leading-relaxed"
              style={{ fontFamily: "inherit" }}
            />
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-[11px] font-mono text-white/20">Enter ↵ kirim · Shift+Enter baris baru</span>
              <motion.button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.93 }}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-25"
                style={{ background: input.trim() && !loading ? "linear-gradient(135deg, #6d28d9, #7c3aed)" : "rgba(255,255,255,0.07)" }}
              >
                {loading
                  ? <Zap size={14} className="text-violet-300 animate-pulse" />
                  : <ArrowUp size={14} className="text-white" />}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Single Message Bubble ── */
function MsgBubble({ msg, onRegenerate }: { msg: Msg; onRegenerate: () => void }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === "user";

  const copy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex mb-6 ${isUser ? "justify-end" : "justify-start"} group`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mr-3 mt-0.5"
          style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.15), rgba(168,85,247,0.08))", border: "1px solid rgba(139,92,246,0.2)" }}>
          <Sparkles size={14} className="text-violet-400" />
        </div>
      )}

      <div className={`max-w-[80%] ${!isUser ? "flex-1" : ""}`}>
        {isUser ? (
          <div className="px-4 py-3 rounded-2xl rounded-br-md text-sm text-white/90 leading-relaxed whitespace-pre-wrap break-words"
            style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.18), rgba(139,92,246,0.1))", border: "1px solid rgba(139,92,246,0.2)" }}>
            {msg.content}
          </div>
        ) : (
          <div>
            {msg.loading && !msg.content ? (
              <div className="flex items-center gap-2 py-3">
                {[0,1,2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-2 h-2 rounded-full bg-violet-400/60"
                    animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
                    transition={{ duration: 0.9, delay: i * 0.15, repeat: Infinity }}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
            )}

            {!msg.loading && msg.content && (
              <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.button onClick={copy} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  className="p-1.5 rounded-lg text-white/25 hover:text-white/65 transition-colors">
                  {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  className="p-1.5 rounded-lg text-white/25 hover:text-green-400 transition-colors">
                  <ThumbsUp size={12} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  className="p-1.5 rounded-lg text-white/25 hover:text-red-400 transition-colors">
                  <ThumbsDown size={12} />
                </motion.button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
