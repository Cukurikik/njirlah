import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { useChatStore } from "@/store/chat-store";
import { ChatBubble, TypingIndicator } from "./ChatBubble";

export function ChatArea() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { getActiveChat, isStreaming } = useChatStore();
  const chat = getActiveChat();
  const messages = chat?.messages ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isStreaming]);

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-7xl mb-6"
          >
            🦄
          </motion.div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent font-space-grotesk mb-3">
            NJIRLAH AI
          </h2>
          <p className="text-gray-400 text-lg mb-2">Chat AI Tersesat, Bebas Pake Kunci Sendiri</p>
          <p className="text-gray-600 text-sm">
            Pilih model di atas, lalu mulai chat. Cloudflare AI langsung jalan, OpenRouter butuh API key kamu.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-3 text-left">
            {[
              { icon: "☁️", title: "Cloudflare Workers AI", desc: "Built-in, langsung pakai, gratis" },
              { icon: "⚡", title: "OpenRouter BYOK", desc: "Ratusan model, kunci milikmu sendiri" },
              { icon: "🔒", title: "Enkripsi AES-GCM", desc: "API key disimpan aman di browsermu" },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
              >
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <MessageSquare size={48} className="mx-auto mb-4 text-purple-400/50" />
          <p className="text-gray-400 text-lg">Mulai percakapan baru!</p>
          <p className="text-gray-600 text-sm mt-1">Ketik pesanmu di bawah</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <ChatBubble
              key={msg.id}
              message={msg}
              chatId={chat.id}
              isLast={i === messages.length - 1}
            />
          ))}
        </AnimatePresence>
        {isStreaming && messages[messages.length - 1]?.isStreaming === false && (
          <TypingIndicator />
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
