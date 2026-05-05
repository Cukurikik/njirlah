import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Send, Square, Loader2 } from "lucide-react";
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
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    await sendMessage(msg);
  }, [input, isStreaming, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  return (
    <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-md">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-purple-500/40 focus-within:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder="Ketik pesanmu di sini... (Enter kirim, Shift+Enter baris baru)"
            rows={1}
            className="flex-1 bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none text-sm leading-relaxed max-h-48 scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent"
          />
          <motion.button
            onClick={handleSend}
            disabled={!input.trim() && !isStreaming}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${
              input.trim() && !isStreaming
                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                : isStreaming
                ? "bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30"
                : "bg-white/5 text-gray-600 cursor-not-allowed"
            }`}
          >
            {isStreaming ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </motion.button>
        </div>
        <p className="text-center text-xs text-gray-600 mt-2">
          NJIRLAH AI bisa saja salah. Verifikasi info penting ya.
        </p>
      </div>
    </div>
  );
}
