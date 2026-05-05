import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "@/store/chat-store";
import { ChatBubble, TypingIndicator } from "./ChatBubble";
import { Sparkles, Cpu, Zap, Lock } from "lucide-react";

const welcomeFeatures = [
  { icon: <Cpu size={14} />, title: "Cloudflare Workers AI", desc: "12+ models built-in, zero config", badge: "FREE" },
  { icon: <Zap size={14} />, title: "OpenRouter BYOK", desc: "Hundreds of models, your key", badge: "BYOK" },
  { icon: <Lock size={14} />, title: "AES-GCM Encrypted", desc: "Key stays in your browser only", badge: "SECURE" },
];

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
      <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-xl"
        >
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-center mb-10"
          >
            <motion.div
              animate={{ rotate: [0, 8, -6, 4, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
              className="text-5xl mb-5 inline-block"
            >
              🦄
            </motion.div>
            <h1 className="text-3xl font-bold text-white tracking-tight font-space-grotesk mb-2">
              NJIRLAH AI
            </h1>
            <p className="text-sm text-white/35 font-mono tracking-wide">
              Chat AI Tersesat, Bebas Pake Kunci Sendiri
            </p>
          </motion.div>

          {/* Bento feature grid */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {welcomeFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.3, ease: "easeOut" }}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.03)", y: -2 }}
                className="relative p-3.5 rounded-lg border border-white/[0.06] bg-white/[0.01] cursor-default transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/30">{f.icon}</span>
                  <span className="text-[9px] font-bold tracking-widest text-violet-400/60 font-mono">{f.badge}</span>
                </div>
                <p className="text-xs font-medium text-white/70 mb-1">{f.title}</p>
                <p className="text-[11px] text-white/25 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Prompt suggestions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-1.5"
          >
            <p className="text-[10px] text-white/20 font-mono tracking-widest uppercase mb-2">Try asking</p>
            {[
              "Jelaskan cara kerja transformer architecture",
              "Tulis fungsi Python untuk sorting algoritma",
              "Apa perbedaan React dan Svelte?",
            ].map((prompt, i) => (
              <motion.button
                key={prompt}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.06 }}
                whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.03)" }}
                whileTap={{ scale: 0.99 }}
                className="w-full text-left px-3.5 py-2.5 rounded-md border border-white/[0.05] text-xs text-white/40 hover:text-white/65 transition-colors flex items-center gap-2 group"
              >
                <Sparkles size={11} className="text-violet-400/30 group-hover:text-violet-400/60 flex-shrink-0 transition-colors" />
                {prompt}
              </motion.button>
            ))}
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
        {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
          <TypingIndicator />
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
