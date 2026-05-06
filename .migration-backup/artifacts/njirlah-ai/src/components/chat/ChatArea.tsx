import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "@/store/chat-store";
import { useChat } from "@/hooks/useChat";
import { ChatBubble, TypingIndicator } from "./ChatBubble";
import { HeroBrandText } from "@/components/ui/TypewriterText";
import { AILogo } from "@/components/ui/AILogo";
import {
  OpenAILogo, CloudflareLogo, MistralLogo, AnthropicLogo,
  LlamaLogo, GoogleGemmaLogo, DeepSeekLogo, XAILogo,
} from "@/components/ui/AIProviderLogos";
import { Sparkles, ShieldCheck, Zap, Layers } from "lucide-react";

const BENTO_FEATURES = [
  {
    logo: <OpenAILogo size={18} />,
    logoColor: "text-white",
    title: "NJIRLAH AI Built-in",
    desc: "GPT-5.4 streaming, no API key required",
    badge: "FREE",
    badgeColor: "text-green-400/80 border-green-500/20 bg-green-500/[0.05]",
    bg: "hover:border-green-500/20",
  },
  {
    logo: <CloudflareLogo size={18} />,
    logoColor: "text-orange-400",
    title: "Cloudflare Workers AI",
    desc: "12+ open-source models on global edge",
    badge: "FREE",
    badgeColor: "text-orange-400/80 border-orange-500/20 bg-orange-500/[0.05]",
    bg: "hover:border-orange-500/20",
  },
  {
    logo: <span className="flex items-center gap-0.5"><AnthropicLogo size={14} /><MistralLogo size={14} /><LlamaLogo size={14} /></span>,
    logoColor: "text-violet-400",
    title: "OpenRouter BYOK",
    desc: "200+ models — Claude, Mistral, Llama & more",
    badge: "BYOK",
    badgeColor: "text-violet-400/80 border-violet-500/20 bg-violet-500/[0.05]",
    bg: "hover:border-violet-500/20",
  },
  {
    logo: <span className="flex items-center gap-0.5"><GoogleGemmaLogo size={14} /><DeepSeekLogo size={14} /><XAILogo size={14} /></span>,
    logoColor: "text-blue-400",
    title: "Live Code Preview",
    desc: "Tailwind + shadcn/ui, element selection",
    badge: "DEV",
    badgeColor: "text-blue-400/80 border-blue-500/20 bg-blue-500/[0.05]",
    bg: "hover:border-blue-500/20",
  },
];

const VALUE_PROPS = [
  {
    icon: <Zap size={12} />,
    color: "text-green-400",
    bg: "bg-green-500/[0.06] border-green-500/15",
    title: "Free GPT-5.4, no key needed",
    desc: "Start instantly — no signup, no credit card.",
  },
  {
    icon: <ShieldCheck size={12} />,
    color: "text-violet-400",
    bg: "bg-violet-500/[0.06] border-violet-500/15",
    title: "Your keys stay on your device",
    desc: "AES-GCM encrypted locally. We never see them.",
  },
  {
    icon: <Layers size={12} />,
    color: "text-cyan-400",
    bg: "bg-cyan-500/[0.06] border-cyan-500/15",
    title: "One UI, 200+ models",
    desc: "Switch Cloudflare ↔ OpenRouter ↔ Built-in instantly.",
  },
];

const PROMPTS = [
  { lang: "html", text: "Build a responsive dashboard with Tailwind CSS and shadcn/ui components" },
  { lang: "tsx",  text: "Create a React TypeScript data table with sorting, filtering, and pagination" },
  { lang: "py",   text: "Write a FastAPI REST backend with JWT auth and PostgreSQL via SQLAlchemy" },
  { lang: "sql",  text: "Design a PostgreSQL schema for a SaaS app with multi-tenancy and RLS" },
];

const LANG_COLORS: Record<string, string> = {
  html: "text-rose-400/70 border-rose-500/15 bg-rose-500/[0.04]",
  tsx:  "text-cyan-400/70 border-cyan-500/15 bg-cyan-500/[0.04]",
  py:   "text-green-400/70 border-green-500/15 bg-green-500/[0.04]",
  sql:  "text-sky-400/70 border-sky-500/15 bg-sky-500/[0.04]",
};

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
  const { sendMessage } = useChat();
  const chat = getActiveChat();
  const messages = chat?.messages ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isStreaming]);

  if (!chat || messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-violet scrollbar-track-transparent">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="w-full max-w-2xl"
        >
          {/* Hero */}
          <motion.div variants={item} className="text-center mb-6">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 160, damping: 18, delay: 0.05 }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-violet-500/20 bg-violet-500/[0.04] mb-5"
            >
              <AILogo size={40} animated />
            </motion.div>
            <HeroBrandText />
          </motion.div>

          {/* Value proposition — why NJIRLAH vs ChatGPT/Claude */}
          <motion.div variants={item} className="grid grid-cols-3 gap-2 mb-5">
            {VALUE_PROPS.map((v) => (
              <div
                key={v.title}
                className={`flex flex-col gap-1.5 p-3 rounded-lg border ${v.bg} cursor-default`}
              >
                <span className={`${v.color} flex-shrink-0`}>{v.icon}</span>
                <p className="text-[11px] font-semibold text-white/70 leading-tight">{v.title}</p>
                <p className="text-[10px] text-white/30 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </motion.div>

          {/* Provider bento grid */}
          <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {BENTO_FEATURES.map((f) => (
              <motion.div
                key={f.title}
                whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.022)" }}
                transition={{ duration: 0.15 }}
                className={`relative p-3 rounded-lg border border-white/[0.06] bg-white/[0.01] cursor-default transition-colors ${f.bg}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={f.logoColor}>{f.logo}</span>
                  <span className={`text-[9px] font-bold tracking-widest font-mono border px-1.5 py-0.5 rounded ${f.badgeColor}`}>
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
                  onClick={() => sendMessage(p.text)}
                  whileHover={{ x: 3, backgroundColor: "rgba(255,255,255,0.025)" }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full text-left px-3.5 py-2.5 rounded-lg border border-white/[0.05] hover:border-white/[0.09] text-xs text-white/35 hover:text-white/60 transition-all flex items-center gap-3 group"
                >
                  <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded border flex-shrink-0 ${LANG_COLORS[p.lang] ?? "text-white/40 border-white/10"}`}>
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
        {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
          <TypingIndicator />
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
