import { motion, AnimatePresence } from "framer-motion";
import { Copy, RefreshCw, ThumbsUp, ThumbsDown, Check, Pencil, X, CornerDownRight, Zap } from "lucide-react";
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
  const bars = [4, 10, 7, 14, 5, 11, 4];
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3 mb-8"
    >
      <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.15), rgba(168,85,247,0.08))", border: "1px solid rgba(139,92,246,0.2)" }}>
        <AIIcon size={15} />
      </div>
      <div className="flex items-center gap-[3px] px-4 rounded-2xl border border-violet-500/10 bg-violet-500/[0.04]" style={{ height: "36px" }}>
        {bars.map((maxH, i) => (
          <motion.span
            key={i}
            className="block w-[2.5px] rounded-full bg-violet-400/70"
            animate={{ height: [`${Math.max(2, maxH * 0.25)}px`, `${maxH}px`, `${Math.max(2, maxH * 0.25)}px`], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.08, ease: "easeInOut" }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export function ChatBubble({ message, chatId, isLast, index }: ChatBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLikedState] = useState<boolean | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.content);
  const editRef = useRef<HTMLTextAreaElement>(null);

  /* Token tracking */
  const streamStartRef = useRef<number | null>(null);
  const [tokensPerSec, setTokensPerSec] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);
  const [finalSpeed, setFinalSpeed] = useState<{ tps: number; total: number } | null>(null);

  const { updateMessage, truncateChat } = useChatStore();
  const { sendMessage, regenerate } = useChat();
  const isUser = message.role === "user";

  useEffect(() => {
    if (!isUser && message.isStreaming && message.content) {
      if (!streamStartRef.current) streamStartRef.current = Date.now();
      const elapsed = (Date.now() - streamStartRef.current) / 1000;
      const approx = Math.floor(message.content.length / 4);
      setTotalTokens(approx);
      if (elapsed > 0.3) setTokensPerSec(Math.round(approx / elapsed));
    }
    if (!isUser && !message.isStreaming && streamStartRef.current) {
      const elapsed = (Date.now() - streamStartRef.current) / 1000;
      const approx = Math.floor(message.content.length / 4);
      if (elapsed > 0.3 && approx > 0) setFinalSpeed({ tps: Math.round(approx / elapsed), total: approx });
      streamStartRef.current = null;
      setTokensPerSec(0);
      setTotalTokens(0);
    }
  }, [message.content, message.isStreaming, isUser]);

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

  const handleLike = (val: boolean) => {
    const next = liked === val ? null : val;
    setLikedState(next);
    updateMessage(chatId, message.id, { liked: next });
  };

  const handleEditStart = () => { setEditValue(message.content); setIsEditing(true); };
  const handleEditCancel = () => { setIsEditing(false); setEditValue(message.content); };

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

  /* ── User message ── */
  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="flex justify-end mb-6 group"
      >
        <div className="max-w-[75%]">
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                ref={editRef}
                value={editValue}
                onChange={(e) => { setEditValue(e.target.value); e.target.style.height = "auto"; e.target.style.height = `${e.target.scrollHeight}px`; }}
                onKeyDown={handleEditKeyDown}
                className="w-full bg-white/[0.04] border border-violet-500/25 rounded-2xl px-4 py-3 text-sm text-white/85 resize-none focus:outline-none focus:border-violet-500/45 leading-relaxed transition-colors scrollbar-thin"
                style={{ minHeight: "72px", fontFamily: "inherit" }}
              />
              <div className="flex items-center gap-2 justify-end">
                <button onClick={handleEditCancel}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-mono text-white/35 hover:text-white/60 border border-white/[0.06] hover:border-white/[0.1] transition-all">
                  Cancel
                </button>
                <button onClick={handleEditConfirm}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-violet-600/80 hover:bg-violet-500/80 text-white transition-colors">
                  <CornerDownRight size={10} /> Re-send
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-end gap-2">
              {/* Edit btn */}
              <motion.button
                onClick={handleEditStart}
                initial={{ opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-white/20 hover:text-white/55 transition-all flex-shrink-0 mb-1"
              >
                <Pencil size={11} />
              </motion.button>
              <div
                className="px-4 py-3 rounded-2xl rounded-br-md text-sm text-white/90 leading-relaxed whitespace-pre-wrap break-words"
                style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.18), rgba(139,92,246,0.1))", border: "1px solid rgba(139,92,246,0.2)" }}
              >
                {message.content}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  /* ── AI message ── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: Math.min(index * 0.015, 0.1) }}
      className="flex items-start gap-3 mb-8 group"
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0 mt-0.5">
        {message.isStreaming && (
          <motion.div
            className="absolute -inset-[2px] rounded-xl pointer-events-none"
            style={{ background: "conic-gradient(from var(--a, 0deg), #7c3aed, #a855f7, #22d3ee, #ec4899, #7c3aed)", borderRadius: "12px" }}
            animate={{ "--a": ["0deg", "360deg"] } as unknown as Record<string, string>}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        )}
        <div className="relative w-7 h-7 rounded-xl flex items-center justify-center overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.15), rgba(168,85,247,0.08))", border: "1px solid rgba(139,92,246,0.2)" }}>
          <AIIcon size={15} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-mono text-white/20 mb-2 tracking-wide">NJIRLAH AI</p>

        <div className="text-sm text-white/80 leading-relaxed">
          <MarkdownContent content={message.content} isStreaming={message.isStreaming} />
        </div>

        {/* Token speed — while streaming */}
        {message.isStreaming && message.content && tokensPerSec > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5 mt-2 text-[10px] font-mono text-white/20">
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.8, repeat: Infinity }}>
              <Zap size={9} className="text-violet-400/60" />
            </motion.div>
            <span>{tokensPerSec} tok/s</span>
            <span className="text-white/10">·</span>
            <span>~{totalTokens} tokens</span>
          </motion.div>
        )}

        {/* Final speed */}
        {!message.isStreaming && finalSpeed && finalSpeed.tps > 0 && message.content && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5 mt-2 text-[10px] font-mono text-white/15">
            <Zap size={9} className="text-white/15" />
            <span>{finalSpeed.tps} tok/s · {finalSpeed.total} tokens</span>
          </motion.div>
        )}

        {/* Action toolbar */}
        {!message.isStreaming && message.content && (
          <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              onClick={handleCopy}
              whileHover={{ scale: 1.08, backgroundColor: "rgba(255,255,255,0.06)" }}
              whileTap={{ scale: 0.9 }}
              className="p-1.5 rounded-lg text-white/25 hover:text-white/65 transition-colors"
              title="Copy"
            >
              {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
            </motion.button>

            {isLast && (
              <motion.button
                onClick={regenerate}
                whileHover={{ scale: 1.04, backgroundColor: "rgba(139,92,246,0.1)" }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/[0.07] text-white/30 hover:text-violet-300 hover:border-violet-500/25 transition-all text-[10px] font-mono"
              >
                <RefreshCw size={10} />
                Regenerate
              </motion.button>
            )}

            <motion.button
              onClick={() => handleLike(true)}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.05)" }}
              whileTap={{ scale: 0.9 }}
              className={`p-1.5 rounded-lg transition-colors ${liked === true ? "text-green-400" : "text-white/25 hover:text-white/55"}`}
            >
              <ThumbsUp size={12} />
            </motion.button>

            <motion.button
              onClick={() => handleLike(false)}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.05)" }}
              whileTap={{ scale: 0.9 }}
              className={`p-1.5 rounded-lg transition-colors ${liked === false ? "text-red-400" : "text-white/25 hover:text-white/55"}`}
            >
              <ThumbsDown size={12} />
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
