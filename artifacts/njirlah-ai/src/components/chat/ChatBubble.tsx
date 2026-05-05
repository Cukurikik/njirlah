import { motion } from "framer-motion";
import { Copy, RefreshCw, ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { useState } from "react";
import { useChatStore, type Message } from "@/store/chat-store";
import { useChat } from "@/hooks/useChat";

interface ChatBubbleProps {
  message: Message;
  chatId: string;
  isLast: boolean;
  index: number;
}

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-start gap-3 mb-4"
    >
      <div className="w-6 h-6 rounded border border-white/[0.08] bg-violet-500/10 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
        🦄
      </div>
      <div className="flex items-center gap-1 h-8 px-3 rounded-md border border-white/[0.06] bg-white/[0.02]">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1 h-1 rounded-full bg-violet-400"
            animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export function ChatBubble({ message, chatId, isLast, index }: ChatBubbleProps) {
  const [copied, setCopied] = useState(false);
  const { updateMessage } = useChatStore();
  const { regenerate } = useChat();
  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = (liked: boolean) => {
    updateMessage(chatId, message.id, { liked: message.liked === liked ? null : liked });
  };

  if (message.isStreaming && !message.content) return <TypingIndicator />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: index * 0.02 }}
      className={`flex items-start gap-3 mb-5 group ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`w-6 h-6 rounded border flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5 ${
          isUser
            ? "border-violet-500/30 bg-violet-500/10 text-violet-300"
            : "border-white/[0.08] bg-white/[0.03] text-sm"
        }`}
      >
        {isUser ? "U" : "🦄"}
      </motion.div>

      <div className={`max-w-[78%] flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        {/* Message */}
        <div
          className={`px-3.5 py-2.5 rounded-md text-sm leading-relaxed whitespace-pre-wrap break-words ${
            isUser
              ? "bg-violet-500/10 border border-violet-500/20 text-white/90 rounded-tr-sm"
              : "bg-white/[0.03] border border-white/[0.06] text-white/85 rounded-tl-sm"
          }`}
        >
          {message.content}
          {message.isStreaming && (
            <span className="inline-block w-[2px] h-3.5 bg-violet-400 ml-0.5 align-middle cursor-blink rounded-full" />
          )}
        </div>

        {/* Actions */}
        {!isUser && !message.isStreaming && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="flex items-center gap-0.5 group-hover:opacity-100 transition-opacity"
          >
            {[
              { icon: copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />, onClick: handleCopy, title: "Copy" },
              ...(isLast ? [{ icon: <RefreshCw size={11} />, onClick: regenerate, title: "Regenerate" }] : []),
              { icon: <ThumbsUp size={11} />, onClick: () => handleLike(true), title: "Good", active: message.liked === true, activeClass: "text-green-400" },
              { icon: <ThumbsDown size={11} />, onClick: () => handleLike(false), title: "Bad", active: message.liked === false, activeClass: "text-red-400" },
            ].map((action, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.06)" }}
                whileTap={{ scale: 0.9 }}
                onClick={action.onClick}
                title={action.title}
                className={`p-1.5 rounded text-white/25 hover:text-white/60 transition-colors ${"active" in action && action.active ? action.activeClass ?? "" : ""}`}
              >
                {action.icon}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
