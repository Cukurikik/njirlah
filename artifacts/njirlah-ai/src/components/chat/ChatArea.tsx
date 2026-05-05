import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "@/store/chat-store";
import { ChatBubble, TypingIndicator } from "./ChatBubble";
import { HeroBrandText } from "@/components/ui/TypewriterText";
import { AILogo } from "@/components/ui/AILogo";
import { Cpu, Zap, Lock, Code2, Sparkles } from "lucide-react";

const BENTO_FEATURES = [
  { icon: <Cpu size={13} />, title: "Cloudflare Workers AI", desc: "12+ built-in models, no setup", badge: "FREE", color: "violet" },
  { icon: <Zap size={13} />, title: "OpenRouter BYOK", desc: "200+ models with your API key", badge: "BYOK", color: "orange" },
  { icon: <Lock size={13} />, title: "AES-GCM Encrypted", desc: "Key never leaves your browser", badge: "SECURE", color: "green" },
  { icon: <Code2 size={13} />, title: "Syntax Highlighting", desc: "20+ languages with live preview", badge: "DEV", color: "blue" },
];

const BADGE_COLORS: Record<string, string> = {
  violet: "text-violet-400/70 border-violet-500/20 bg-violet-500/[0.05]",
  orange: "text-orange-400/70 border-orange-500/20 bg-orange-500/[0.05]",
  green: "text-green-400/70 border-green-500/20 bg-green-500/[0.05]",
  blue: "text-blue-400/70 border-blue-500/20 bg-blue-500/[0.05]",
};

const PROMPTS = [
  { lang: "py", text: "Tulis REST API dengan FastAPI dan PostgreSQL" },
  { lang: "js", text: "Buat komponen React dengan TypeScript dan Tailwind" },
  { lang: "html", text: "Buat landing page modern dengan animasi CSS" },
  { lang: "sql", text: "Optimasi query SQL dengan indexing strategy" },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

export function ChatArea() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { getActiveChat, isStreaming } = useChatStore();
  const chat = getActiveChat();
  const messages = chat?.messages ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isStreaming]);

  if (!chat || messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="w-full max-w-2xl"
        >
          {/* Hero brand */}
          <motion.div variants={item} className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 160, damping: 18, delay: 0.05 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border border-violet-500/20 bg-violet-500/[0.04] mb-5"
            >
              <AILogo size={44} animated />
            </motion.div>
            <HeroBrandText />
          </motion.div>

          {/* Bento grid */}
          <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
            {BENTO_FEATURES.map((f) => (
              <motion.div
                key={f.title}
                whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.025)" }}
                transition={{ duration: 0.15 }}
                className="relative p-3.5 rounded-lg border border-white/[0.06] bg-white/[0.01] cursor-default"
              >
                <div className="flex items-start justify-between mb-2.5">
                  <span className="text-white/25">{f.icon}</span>
                  <span className={`text-[9px] font-bold tracking-widest font-mono border px-1.5 py-0.5 rounded ${BADGE_COLORS[f.color]}`}>
                    {f.badge}
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-white/65 mb-0.5 leading-tight">{f.title}</p>
                <p className="text-[10px] text-white/25 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Prompt suggestions */}
          <motion.div variants={item}>
            <p className="text-[9px] text-white/15 font-mono tracking-[0.18em] uppercase mb-2 px-0.5">
              Try asking
            </p>
            <div className="space-y-1">
              {PROMPTS.map((p) => (
                <motion.button
                  key={p.text}
                  whileHover={{ x: 3, backgroundColor: "rgba(255,255,255,0.025)" }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full text-left px-3.5 py-2.5 rounded-lg border border-white/[0.05] hover:border-white/[0.09] text-xs text-white/35 hover:text-white/60 transition-all flex items-center gap-3 group"
                >
                  <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded border flex-shrink-0 ${
                    p.lang === "py" ? "text-green-400/60 border-green-500/15 bg-green-500/[0.04]"
                    : p.lang === "js" ? "text-yellow-400/60 border-yellow-500/15 bg-yellow-500/[0.04]"
                    : p.lang === "html" ? "text-rose-400/60 border-rose-500/15 bg-rose-500/[0.04]"
                    : "text-sky-400/60 border-sky-500/15 bg-sky-500/[0.04]"
                  }`}>
                    {p.lang.toUpperCase()}
                  </span>
                  <span className="flex-1">{p.text}</span>
                  <Sparkles size={11} className="text-violet-400/20 group-hover:text-violet-400/50 flex-shrink-0 transition-colors" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-violet scrollbar-track-transparent">
      <div className="max-w-3xl mx-auto">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <ChatBubble
              key={msg.id}
              message={msg}
              chatId={chat.id}
              isLast={i === messages.length - 1}
              index={i}
            />
          ))}
        </AnimatePresence>
        {isStreaming && messages[messages.length - 1]?.role !== "assistant" && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
