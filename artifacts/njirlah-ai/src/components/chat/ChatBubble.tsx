import { motion, AnimatePresence } from "framer-motion";
import { Copy, RefreshCw, ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { useState } from "react";
import { useChatStore, type Message } from "@/store/chat-store";
import { useChat } from "@/hooks/useChat";
import { MarkdownContent } from "./MarkdownContent";
import { UnicornIcon } from "@/components/ui/UnicornLogo";

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
      <div className="w-6 h-6 rounded border border-violet-500/20 bg-violet-500/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden">
        <UnicornIcon size={16} />
      </div>
      <div className="flex items-center gap-1.5 h-8 px-3.5 rounded-md border border-white/[0.06] bg-white/[0.02]">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1 h-1 rounded-full bg-violet-400"
            animate={{ y: [0, -4, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 0.65, repeat: Infinity, delay: i * 0.16, ease: "easeInOut" }}
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
      transition={{ duration: 0.25, ease: "easeOut" as const, delay: Math.min(index * 0.02, 0.2) }}
      className={`flex items-start gap-3 mb-6 group ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`w-6 h-6 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden ${
          isUser
            ? "border-violet-500/25 bg-violet-500/[0.08]"
            : "border-white/[0.07] bg-[#0a0a0a]"
        }`}
      >
        {isUser ? (
          <span className="text-[10px] font-bold text-violet-300 font-mono">U</span>
        ) : (
          <UnicornIcon size={16} />
        )}
      </div>

      <div className={`flex-1 min-w-0 flex flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}>
        {/* Role label */}
        <span className="text-[10px] text-white/20 font-mono tracking-wide px-0.5">
          {isUser ? "you" : "njirlah ai"}
        </span>

        {/* Message bubble */}
        <div
          className={`max-w-[85%] rounded-lg text-sm leading-relaxed ${
            isUser
              ? "bg-violet-500/[0.09] border border-violet-500/20 text-white/90 rounded-tr-sm px-4 py-2.5"
              : "w-full bg-white/[0.02] border border-white/[0.06] text-white/80 rounded-tl-sm px-4 py-3"
          }`}
        >
          {isUser ? (
            <>
              <span className="whitespace-pre-wrap break-words">{message.content}</span>
              {message.isStreaming && (
                <span className="inline-block w-[2px] h-3.5 bg-violet-400 ml-0.5 align-middle cursor-blink rounded-full" />
              )}
            </>
          ) : (
            <MarkdownContent content={message.content} isStreaming={message.isStreaming} />
          )}
        </div>

        {/* Action toolbar */}
        {!isUser && !message.isStreaming && message.content && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            className="flex items-center gap-0.5 group-hover:opacity-100 opacity-0 transition-opacity duration-150"
          >
            {[
              {
                icon: copied
                  ? <Check size={11} className="text-green-400" />
                  : <Copy size={11} />,
                onClick: handleCopy,
                title: "Copy",
              },
              ...(isLast
                ? [{ icon: <RefreshCw size={11} />, onClick: regenerate, title: "Regenerate" }]
                : []),
              {
                icon: <ThumbsUp size={11} />,
                onClick: () => handleLike(true),
                title: "Good",
                active: message.liked === true,
                activeClass: "text-green-400",
              },
              {
                icon: <ThumbsDown size={11} />,
                onClick: () => handleLike(false),
                title: "Bad",
                active: message.liked === false,
                activeClass: "text-red-400",
              },
            ].map((action, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.05)" }}
                whileTap={{ scale: 0.9 }}
                onClick={action.onClick}
                title={action.title}
                className={`p-1.5 rounded text-white/20 hover:text-white/55 transition-colors ${"active" in action && action.active ? (action.activeClass ?? "") : ""}`}
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
