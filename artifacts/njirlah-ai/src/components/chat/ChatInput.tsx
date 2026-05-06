import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ArrowUp, Loader2, Paperclip, Mic, MicOff, X, GitCompare, Check } from "lucide-react";
import { useChatStore } from "@/store/chat-store";
import { useChat } from "@/hooks/useChat";
import { ModelSelector } from "@/components/chat/ModelSelector";

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

interface Attachment {
  name: string;
  content: string;
  type: string;
}

interface ChatInputProps {
  onOpenCompare?: () => void;
}

export function ChatInput({ onOpenCompare }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported] = useState(
    () => !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { isStreaming } = useChatStore();
  const { sendMessage } = useChat();

  const handleSend = useCallback(async () => {
    let msg = input.trim();
    if ((!msg && attachments.length === 0) || isStreaming) return;

    if (attachments.length > 0) {
      const attachText = attachments
        .map((a) => `[File: ${a.name}]\n\`\`\`\n${a.content}\n\`\`\``)
        .join("\n\n");
      msg = msg ? `${msg}\n\n${attachText}` : attachText;
    }

    setInput("");
    setAttachments([]);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    await sendMessage(msg);
  }, [input, attachments, isStreaming, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const MAX_SIZE = 200 * 1024;
    const newAttachments: Attachment[] = [];
    for (const file of files) {
      if (file.size > MAX_SIZE) continue;
      try {
        const content = await file.text();
        newAttachments.push({ name: file.name, content, type: file.type });
      } catch { /* skip binary files */ }
    }
    setAttachments((prev) => [...prev, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleVoice = useCallback(() => {
    if (!voiceSupported) return;
    const SpeechRec = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRec) return;
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    const recognition = new SpeechRec();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "id-ID";
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map((r) => r[0].transcript).join("");
      setInput(transcript);
    };
    recognitionRef.current = recognition;
    recognition.start();
  }, [isListening, voiceSupported]);

  useEffect(() => { return () => recognitionRef.current?.stop(); }, []);

  const hasContent = input.trim().length > 0 || attachments.length > 0;

  /* Send button magnetic spring */
  const btnX = useMotionValue(0);
  const btnY = useMotionValue(0);
  const sBtnX = useSpring(btnX, { stiffness: 280, damping: 20 });
  const sBtnY = useSpring(btnY, { stiffness: 280, damping: 20 });
  const sendBtnRef = useRef<HTMLButtonElement>(null);

  const handleSendMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!hasContent) return;
    const r = e.currentTarget.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    btnX.set((e.clientX - cx) * 0.35);
    btnY.set((e.clientY - cy) * 0.35);
  };

  const handleSendMouseLeave = () => { btnX.set(0); btnY.set(0); };

  /* Ripple on send */
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);
  const [justSent, setJustSent] = useState(false);

  const handleSendWithRipple = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!hasContent && !isStreaming) return;
    const r = e.currentTarget.getBoundingClientRect();
    setRipple({ x: e.clientX - r.left, y: e.clientY - r.top, id: Date.now() });
    setJustSent(true);
    setTimeout(() => setJustSent(false), 900);
    await handleSend();
  }, [hasContent, isStreaming, handleSend]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="px-4 pb-4 pt-2 border-t border-white/[0.06] flex-shrink-0"
      style={{ background: "#05050A" }}
    >
      <div className="max-w-3xl mx-auto space-y-2">

        {/* ── Model row + Compare button ── */}
        <div className="flex items-center gap-2 px-1">
          <span className="text-[10px] text-white/15 font-mono tracking-widest uppercase">Model</span>
          <ModelSelector />
          <div className="flex-1" />
          <motion.button
            onClick={onOpenCompare}
            whileHover={{ backgroundColor: "rgba(139,92,246,0.09)", borderColor: "rgba(139,92,246,0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-white/[0.07] text-[10px] font-mono text-white/25 hover:text-violet-300 transition-all"
            title="Compare two models side-by-side"
          >
            <GitCompare size={11} />
            <span className="hidden sm:inline">Compare</span>
          </motion.button>
        </div>

        {/* Attachment chips */}
        <AnimatePresence>
          {attachments.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-wrap gap-1.5 overflow-hidden"
            >
              {attachments.map((a, i) => (
                <motion.div
                  key={a.name}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-violet-500/[0.08] border border-violet-500/20 text-[10px] font-mono text-violet-300/70"
                >
                  <Paperclip size={9} className="text-violet-400/60" />
                  <span className="max-w-[120px] truncate">{a.name}</span>
                  <button onClick={() => setAttachments((prev) => prev.filter((_, j) => j !== i))}
                    className="text-white/30 hover:text-white/60 transition-colors">
                    <X size={9} />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice listening indicator */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-500/[0.06] border border-red-500/20"
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-red-400"
                animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.15, 0.9] }}
                transition={{ duration: 0.9, repeat: Infinity }}
              />
              <span className="text-[11px] font-mono text-red-300/70">Listening… speak now (id-ID)</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input bar */}
        <motion.div
          animate={{ borderColor: hasContent ? "rgba(139,92,246,0.35)" : "rgba(255,255,255,0.07)" }}
          transition={{ duration: 0.2 }}
          className="flex items-end gap-2 bg-white/[0.02] border rounded-xl px-3 py-2.5 focus-within:shadow-[0_0_0_1px_rgba(139,92,246,0.12)] transition-shadow"
        >
          {/* Attachment button */}
          <motion.button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            whileTap={{ scale: 0.92 }}
            className="p-1.5 rounded text-white/20 hover:text-white/55 transition-colors flex-shrink-0 mb-0.5"
            title="Attach file"
          >
            <Paperclip size={14} />
          </motion.button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".txt,.md,.csv,.json,.js,.ts,.tsx,.jsx,.py,.html,.css,.xml,.yaml,.yml,.sql,.sh,.env,.log"
            onChange={handleFileChange}
            className="hidden"
          />

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder="Message NJIRLAH AI..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-white/85 placeholder-white/20 resize-none focus:outline-none leading-relaxed max-h-44 scrollbar-thin font-sans"
          />

          {/* Voice button */}
          {voiceSupported && (
            <motion.button
              type="button"
              onClick={toggleVoice}
              whileHover={{ backgroundColor: isListening ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.05)" }}
              whileTap={{ scale: 0.92 }}
              animate={{ color: isListening ? "rgba(248,113,113,0.9)" : "rgba(255,255,255,0.2)" }}
              className="p-1.5 rounded transition-colors flex-shrink-0 mb-0.5"
            >
              {isListening ? <MicOff size={14} /> : <Mic size={14} />}
            </motion.button>
          )}

          {/* Send button — magnetic + ripple + icon morph */}
          <motion.button
            ref={sendBtnRef}
            onClick={handleSendWithRipple}
            onMouseMove={handleSendMouseMove}
            onMouseLeave={handleSendMouseLeave}
            disabled={!hasContent && !isStreaming}
            style={{ x: sBtnX, y: sBtnY }}
            whileHover={hasContent ? { scale: 1.08 } : {}}
            whileTap={hasContent ? { scale: 0.88 } : {}}
            animate={{ backgroundColor: hasContent ? "rgba(139,92,246,0.85)" : "rgba(255,255,255,0.04)" }}
            transition={{ duration: 0.2 }}
            className="relative p-2 rounded-lg flex-shrink-0 transition-all disabled:cursor-not-allowed mb-0.5 overflow-hidden"
          >
            {/* Ripple effect */}
            <AnimatePresence>
              {ripple && (
                <motion.span
                  key={ripple.id}
                  initial={{ scale: 0, opacity: 0.5 }}
                  animate={{ scale: 6, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  onAnimationComplete={() => setRipple(null)}
                  className="absolute rounded-full bg-white/30 pointer-events-none"
                  style={{ width: 16, height: 16, left: ripple.x - 8, top: ripple.y - 8 }}
                />
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {isStreaming
                ? <motion.div key="l" initial={{ opacity: 0, rotate: -90, scale: 0.6 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 90, scale: 0.6 }} transition={{ duration: 0.18 }}>
                    <Loader2 size={14} className="text-white/60 animate-spin" />
                  </motion.div>
                : justSent
                  ? <motion.div key="c" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ type: "spring", stiffness: 400, damping: 22 }}>
                      <Check size={14} className="text-white" />
                    </motion.div>
                  : <motion.div key="s" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.15 }}>
                      <ArrowUp size={14} className={hasContent ? "text-white" : "text-white/20"} />
                    </motion.div>
              }
            </AnimatePresence>
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[10px] text-white/15 text-center font-mono tracking-wide"
        >
          Enter ↵ send · Shift+Enter new line · 📎 attach · 🎤 voice
        </motion.p>
      </div>
    </motion.div>
  );
}
