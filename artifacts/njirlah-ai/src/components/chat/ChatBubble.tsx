import { motion } from "framer-motion";
import { Copy, RefreshCw, ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { useState } from "react";
import { useChatStore, type Message } from "@/store/chat-store";
import { useChat } from "@/hooks/useChat";

interface ChatBubbleProps {
  message: Message;
  chatId: string;
  isLast: boolean;
}

export function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
        🦄
      </div>
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-purple-400"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ChatBubble({ message, chatId, isLast }: ChatBubbleProps) {
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

  if (message.isStreaming && !message.content) {
    return <TypingIndicator />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`flex items-end gap-3 mb-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
          isUser
            ? "bg-gradient-to-br from-pink-500 to-purple-500 text-white"
            : "bg-gradient-to-br from-purple-500 to-cyan-500 text-white"
        }`}
      >
        {isUser ? "U" : "🦄"}
      </div>

      <div className={`max-w-[75%] group ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
            isUser
              ? "bg-gradient-to-br from-purple-600/80 to-pink-600/80 border border-purple-500/30 text-white rounded-br-sm"
              : "backdrop-blur-xl bg-white/5 border border-white/10 text-gray-100 rounded-bl-sm"
          }`}
        >
          {message.content}
          {message.isStreaming && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.7, repeat: Infinity }}
              className="inline-block w-0.5 h-4 bg-purple-400 ml-0.5 align-middle"
            />
          )}
        </div>

        {!isUser && !message.isStreaming && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
              title="Salin"
            >
              {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
            </button>
            {isLast && (
              <button
                onClick={regenerate}
                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                title="Generate ulang"
              >
                <RefreshCw size={13} />
              </button>
            )}
            <button
              onClick={() => handleLike(true)}
              className={`p-1.5 rounded-lg hover:bg-white/10 transition-all ${
                message.liked === true ? "text-green-400" : "text-gray-400 hover:text-green-400"
              }`}
            >
              <ThumbsUp size={13} />
            </button>
            <button
              onClick={() => handleLike(false)}
              className={`p-1.5 rounded-lg hover:bg-white/10 transition-all ${
                message.liked === false ? "text-red-400" : "text-gray-400 hover:text-red-400"
              }`}
            >
              <ThumbsDown size={13} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
