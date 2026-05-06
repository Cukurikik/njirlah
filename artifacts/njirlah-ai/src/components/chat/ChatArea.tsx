import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "@/store/chat-store";
import { useChat } from "@/hooks/useChat";
import { ChatBubble, TypingIndicator } from "./ChatBubble";
import { Zap, ArrowRight } from "lucide-react";
import { useDevModeStore } from "@/store/dev-mode-store";

const PROMPT_SETS = {
  website: [
    { tag: "React",   text: "Build a responsive dashboard with Tailwind CSS and shadcn/ui" },
    { tag: "Next.js", text: "Create a landing page with animated hero section and pricing table" },
    { tag: "HTML",    text: "Build a portfolio site with dark mode and smooth scroll animations" },
    { tag: "Vue",     text: "Create an e-commerce product page with cart functionality" },
  ],
  mobile: [
    { tag: "Expo",    text: "Build a React Native onboarding flow with animated slides" },
    { tag: "RN",      text: "Create a social feed app with infinite scroll and like animations" },
    { tag: "Flutter", text: "Build a fitness tracker app with charts and workout history" },
    { tag: "Expo",    text: "Create a camera app with filters and gallery view" },
  ],
  fullstack: [
    { tag: "Next.js", text: "Build a SaaS starter with auth, Prisma ORM, and Stripe payments" },
    { tag: "FastAPI", text: "Create a REST API with JWT auth, PostgreSQL, and auto docs" },
    { tag: "T3",      text: "Build a full-stack todo app with tRPC, Drizzle, and Clerk auth" },
    { tag: "Node",    text: "Create a real-time chat app with Socket.io and Redis" },
  ],
};

const TAG_COLORS: Record<string, string> = {
  "React":   "text-cyan-400/70 border-cyan-500/15",
  "Next.js": "text-white/50 border-white/10",
  "HTML":    "text-orange-400/70 border-orange-500/15",
  "Vue":     "text-green-400/70 border-green-500/15",
  "Expo":    "text-violet-400/70 border-violet-500/15",
  "RN":      "text-blue-400/70 border-blue-500/15",
  "Flutter": "text-sky-400/70 border-sky-500/15",
  "FastAPI": "text-emerald-400/70 border-emerald-500/15",
  "T3":      "text-pink-400/70 border-pink-500/15",
  "Node":    "text-green-400/70 border-green-500/15",
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

function EmptyState() {
  const { sendMessage } = useChat();
  const { activeMode } = useDevModeStore();
  const prompts = PROMPT_SETS[activeMode];

  return (
    <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl"
      >
        {/* Logo mark */}
        <motion.div variants={fadeUp} className="flex flex-col items-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 160, damping: 18 }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
            style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.15), rgba(168,85,247,0.08))", border: "1px solid rgba(139,92,246,0.2)" }}
          >
            <Zap size={20} className="text-violet-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white/85 mb-2 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            What are we building?
          </h2>
          <p className="text-sm text-white/35 text-center max-w-xs leading-relaxed">
            Describe your idea and NJIRLAH AI will generate production-ready code instantly.
          </p>
        </motion.div>

        {/* Suggestions */}
        <motion.div variants={fadeUp} className="space-y-2">
          <p className="text-[10px] font-mono text-white/20 tracking-[0.2em] uppercase px-1 mb-3">Suggested prompts</p>
          {prompts.map((p) => (
            <motion.button
              key={p.text}
              onClick={() => sendMessage(p.text)}
              whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.025)", borderColor: "rgba(255,255,255,0.08)" }}
              whileTap={{ scale: 0.99 }}
              className="w-full text-left px-4 py-3.5 rounded-xl border border-white/[0.05] text-sm text-white/45 hover:text-white/75 transition-all flex items-center gap-3 group"
            >
              <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border flex-shrink-0 ${TAG_COLORS[p.tag] ?? "text-white/35 border-white/10"}`}>
                {p.tag}
              </span>
              <span className="flex-1 leading-relaxed">{p.text}</span>
              <ArrowRight size={12} className="text-white/15 group-hover:text-white/40 flex-shrink-0 transition-colors" />
            </motion.button>
          ))}
        </motion.div>

        {/* Hint */}
        <motion.div variants={fadeUp} className="mt-8 flex items-center justify-center gap-6">
          {[
            { label: "Free GPT-5.4 built-in", dot: "bg-green-400" },
            { label: "200+ models with BYOK", dot: "bg-violet-400" },
            { label: "All code stays local", dot: "bg-blue-400" },
          ].map((h) => (
            <div key={h.label} className="flex items-center gap-1.5 text-[11px] text-white/25">
              <span className={`w-1.5 h-1.5 rounded-full ${h.dot}`} />
              {h.label}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

export function ChatArea() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { getActiveChat, isStreaming } = useChatStore();
  const chat = getActiveChat();
  const messages = chat?.messages ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isStreaming]);

  if (!chat || messages.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex-1 overflow-y-auto py-8 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
      <div className="max-w-3xl mx-auto px-6">
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
