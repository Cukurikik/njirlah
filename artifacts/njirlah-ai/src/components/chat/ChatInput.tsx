import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Loader2 } from "lucide-react";
import { useChatStore } from "@/store/chat-store";
import { useChat } from "@/hooks/useChat";

export function ChatInput() {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isStreaming } = useChatStore();
  const { sendMessage } = useChat();

  const handleSend = useCallback(async () => {
    const msg = input.trim();
    if (!msg || isStreaming) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    await sendMessage(msg);
  }, [input, isStreaming, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  };

  const hasContent = input.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="px-4 pb-4 pt-3 border-t border-white/[0.06] bg-black flex-shrink-0"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          animate={{
            borderColor: hasContent
              ? "rgba(139,92,246,0.35)"
              : "rgba(255,255,255,0.07)",
          }}
          transition={{ duration: 0.2 }}
          className="flex items-end gap-3 bg-white/[0.02] border rounded-lg px-4 py-3 focus-within:shadow-[0_0_0_1px_rgba(139,92,246,0.15)] transition-shadow"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder="Message NJIRLAH AI..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-white/85 placeholder-white/20 resize-none focus:outline-none leading-relaxed max-h-44 scrollbar-thin scrollbar-thumb-violet scrollbar-track-transparent font-sans"
          />

          <motion.button
            onClick={handleSend}
            disabled={!hasContent && !isStreaming}
            whileHover={hasContent ? { scale: 1.05 } : {}}
            whileTap={hasContent ? { scale: 0.92 } : {}}
            animate={{
              backgroundColor: hasContent
                ? "rgba(139,92,246,0.85)"
                : "rgba(255,255,255,0.04)",
            }}
            transition={{ duration: 0.2 }}
            className="p-2 rounded-md flex-shrink-0 transition-all disabled:cursor-not-allowed"
          >
            <AnimatePresence mode="wait">
              {isStreaming ? (
                <motion.div key="loading" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                  <Loader2 size={14} className="text-white/60 animate-spin" />
                </motion.div>
              ) : (
                <motion.div key="send" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                  <ArrowUp size={14} className={hasContent ? "text-white" : "text-white/20"} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[10px] text-white/15 text-center mt-2 font-mono tracking-wide"
        >
          Enter ↵ send · Shift+Enter new line · NJIRLAH AI can be wrong
        </motion.p>
      </div>
    </motion.div>
  );
}
