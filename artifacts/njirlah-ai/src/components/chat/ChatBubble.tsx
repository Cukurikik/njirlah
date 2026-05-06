import { motion, AnimatePresence } from "framer-motion";
import { Copy, RefreshCw, ThumbsUp, ThumbsDown, Check, Pencil, X, CornerDownRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useChatStore, type Message } from "@/store/chat-store";
import { useChat } from "@/hooks/useChat";
import { MarkdownContent } from "./MarkdownContent";
import { AIIcon } from "@/components/ui/AILogo";

interface ChatBubbleProps {
  message: Message;
  chatId: string;
  isLast: boolean;
  index: number;
}

export function TypingIndicator() {
  const bars = [6, 14, 10, 18, 8, 14, 6];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.22 }}
      className="flex items-start gap-3 mb-4"
    >
      <div className="w-7 h-7 rounded-md border border-violet-500/25 bg-gradient-to-br from-violet-600/10 to-blue-600/10 flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden">
        <AIIcon size={16} />
      </div>
      <div className="flex items-center gap-[3px] px-4 rounded-xl border border-violet-500/15 bg-gradient-to-r from-violet-500/[0.05] to-blue-500/[0.02]" style={{ height: "36px" }}>
        {bars.map((maxH, i) => (
          <motion.span
            key={i}
            className="block w-[3px] rounded-full"
            style={{
              background: "linear-gradient(to top, rgba(124,58,237,0.5), rgba(167,139,250,0.95))",
              minHeight: "3px",
            }}
            animate={{
              height: [`${Math.max(3, maxH * 0.3)}px`, `${maxH}px`, `${Math.max(3, maxH * 0.3)}px`],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 0.85,
              repeat: Infinity,
              delay: i * 0.09,
              ease: [0.4, 0, 0.6, 1],
            }}
          />
        ))}
      </div>
      <span className="text-[10px] text-white/20 font-mono self-end pb-1 tracking-wide">generating</span>
    </motion.div>
  );
}

export function ChatBubble({ message, chatId, isLast, index }: ChatBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.content);
  const editRef = useRef<HTMLTextAreaElement>(null);
  const { updateMessage, truncateChat } = useChatStore();
  const { sendMessage, regenerate } = useChat();
  const isUser = message.role === "user";

  useEffect(() => {
    if (isEditing && editRef.current) {
      editRef.current.focus();
      editRef.current.style.height = "auto";
      editRef.current.style.height = `${editRef.current.scrollHeight}px`;
    }
  }, [isEditing]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = (liked: boolean) => {
    updateMessage(chatId, message.id, { liked: message.liked === liked ? null : liked });
  };

  const handleEditStart = () => {
    setEditValue(message.content);
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditValue(message.content);
  };

  const handleEditConfirm = async () => {
    const trimmed = editValue.trim();
    if (!trimmed) return;
    setIsEditing(false);
    truncateChat(chatId, message.id);
    await sendMessage(trimmed);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleEditConfirm(); }
    if (e.key === "Escape") handleEditCancel();
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
          <AIIcon size={16} />
        )}
      </div>

      <div className={`flex-1 min-w-0 flex flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}>
        {/* Role label */}
        <span className="text-[10px] text-white/20 font-mono tracking-wide px-0.5">
          {isUser ? "you" : "njirlah ai"}
        </span>

        {/* Message bubble or edit mode */}
        {isEditing ? (
          <div className="max-w-[85%] w-full space-y-2">
            <textarea
              ref={editRef}
              value={editValue}
              onChange={(e) => {
                setEditValue(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onKeyDown={handleEditKeyDown}
              className="w-full bg-violet-500/[0.06] border border-violet-500/30 rounded-lg px-4 py-2.5 text-sm text-white/85 resize-none focus:outline-none leading-relaxed focus:border-violet-500/50 transition-colors scrollbar-thin font-sans"
              style={{ minHeight: "72px" }}
            />
            <div className="flex items-center gap-1.5 justify-end">
              <motion.button
                onClick={handleEditCancel}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] text-white/35 hover:text-white/60 font-mono border border-transparent hover:border-white/[0.07] transition-all"
              >
                <X size={10} /> Cancel
              </motion.button>
              <motion.button
                onClick={handleEditConfirm}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 px-3 py-1 rounded text-[11px] font-mono font-medium bg-violet-500/80 hover:bg-violet-500/90 text-white transition-colors"
              >
                <CornerDownRight size={10} /> Re-send
              </motion.button>
            </div>
          </div>
        ) : (
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
        )}

        {/* AI action toolbar — always visible, not hover-only */}
        {!isUser && !message.isStreaming && message.content && (
          <div className="flex items-center gap-0.5 mt-0.5">
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.06)" }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
              title="Copy response"
              className="p-1.5 rounded text-white/20 hover:text-white/55 transition-colors"
            >
              {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
            </motion.button>

            {isLast && (
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(124,58,237,0.12)" }}
                whileTap={{ scale: 0.9 }}
                onClick={regenerate}
                title="Regenerate response"
                className="flex items-center gap-1 px-2 py-1 rounded border border-violet-500/20 text-violet-400/70 hover:text-violet-300 hover:border-violet-500/40 transition-all text-[10px] font-mono"
              >
                <RefreshCw size={10} />
                <span>Regenerate</span>
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.05)" }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleLike(true)}
              title="Good response"
              className={`p-1.5 rounded transition-colors ${message.liked === true ? "text-green-400" : "text-white/20 hover:text-white/55"}`}
            >
              <ThumbsUp size={11} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.05)" }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleLike(false)}
              title="Bad response"
              className={`p-1.5 rounded transition-colors ${message.liked === false ? "text-red-400" : "text-white/20 hover:text-white/55"}`}
            >
              <ThumbsDown size={11} />
            </motion.button>
          </div>
        )}

        {/* User edit button */}
        {isUser && !message.isStreaming && !isEditing && (
          <motion.button
            onClick={handleEditStart}
            initial={{ opacity: 0 }}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
            whileTap={{ scale: 0.92 }}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded text-white/20 hover:text-white/55 transition-all"
            title="Edit and re-send"
          >
            <Pencil size={11} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
