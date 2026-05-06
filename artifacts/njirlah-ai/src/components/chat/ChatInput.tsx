import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ArrowUp, Loader2, Paperclip, Mic, MicOff, X, GitCompare, Check, Zap } from "lucide-react";
import { useChatStore } from "@/store/chat-store";
import { useChat } from "@/hooks/useChat";
import { ModelSelector } from "@/components/chat/ModelSelector";
import { useDevModeStore } from "@/store/dev-mode-store";

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => ISpeechRecognition;
    webkitSpeechRecognition?: new () => ISpeechRecognition;
  }
}

interface Attachment {
  name: string;
  content: string;
  type: string;
}

interface SlashCommand {
  cmd: string;
  desc: string;
  icon: string;
  expand: (input: string) => string;
}

const SLASH_COMMANDS: SlashCommand[] = [
  {
    cmd: "/explain",
    desc: "Explain the selected code in detail",
    icon: "📖",
    expand: (input) => input.replace("/explain", "Please explain this code in detail, step by step:"),
  },
  {
    cmd: "/refactor",
    desc: "Refactor for readability and performance",
    icon: "♻️",
    expand: (input) => input.replace("/refactor", "Please refactor this code for better readability, maintainability, and performance:"),
  },
  {
    cmd: "/debug",
    desc: "Find and fix bugs",
    icon: "🐛",
    expand: (input) => input.replace("/debug", "Please analyze this code, identify any bugs or issues, and provide fixes:"),
  },
  {
    cmd: "/test",
    desc: "Write unit tests",
    icon: "✅",
    expand: (input) => input.replace("/test", "Please write comprehensive unit tests for this code using the appropriate testing framework:"),
  },
  {
    cmd: "/docs",
    desc: "Generate documentation",
    icon: "📝",
    expand: (input) => input.replace("/docs", "Please generate complete documentation (JSDoc/docstrings, README, usage examples) for this code:"),
  },
  {
    cmd: "/optimize",
    desc: "Optimize for speed and efficiency",
    icon: "⚡",
    expand: (input) => input.replace("/optimize", "Please optimize this code for maximum performance, efficiency, and speed:"),
  },
  {
    cmd: "/convert",
    desc: "Convert to another language/framework",
    icon: "🔄",
    expand: (input) => input.replace("/convert", "Please convert this code to the target language/framework while maintaining all functionality:"),
  },
  {
    cmd: "/review",
    desc: "Code review with suggestions",
    icon: "🔍",
    expand: (input) => input.replace("/review", "Please do a thorough code review and provide detailed suggestions for improvement:"),
  },
];

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
  const [slashOpen, setSlashOpen] = useState(false);
  const [slashFilter, setSlashFilter] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const { isStreaming } = useChatStore();
  const { sendMessage } = useChat();
  const { getActiveConfig } = useDevModeStore();
  const devConfig = getActiveConfig();

  const handleSend = useCallback(async () => {
    let msg = input.trim();
    if ((!msg && attachments.length === 0) || isStreaming) return;

    // Expand slash command if present
    const matchedCmd = SLASH_COMMANDS.find((c) => msg.startsWith(c.cmd));
    if (matchedCmd) msg = matchedCmd.expand(msg);

    if (attachments.length > 0) {
      const attachText = attachments
        .map((a) => `[File: ${a.name}]\n\`\`\`\n${a.content}\n\`\`\``)
        .join("\n\n");
      msg = msg ? `${msg}\n\n${attachText}` : attachText;
    }

    setInput("");
    setAttachments([]);
    setSlashOpen(false);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    await sendMessage(msg);
  }, [input, attachments, isStreaming, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (slashOpen) {
      if (e.key === "Escape") { e.preventDefault(); setSlashOpen(false); return; }
    }
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);

    // Slash command detection
    if (val.startsWith("/") && !val.includes(" ")) {
      const filter = val.slice(1).toLowerCase();
      setSlashFilter(filter);
      setSlashOpen(true);
    } else {
      setSlashOpen(false);
    }
  };

  const applySlashCommand = (cmd: SlashCommand) => {
    setInput(cmd.cmd + " ");
    setSlashOpen(false);
    textareaRef.current?.focus();
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

  const filteredCommands = SLASH_COMMANDS.filter((c) =>
    !slashFilter || c.cmd.slice(1).includes(slashFilter) || c.desc.toLowerCase().includes(slashFilter)
  );

  /* Send button magnetic spring */
  const btnX = useMotionValue(0);
  const btnY = useMotionValue(0);
  const sBtnX = useSpring(btnX, { stiffness: 280, damping: 20 });
  const sBtnY = useSpring(btnY, { stiffness: 280, damping: 20 });
  const sendBtnRef = useRef<HTMLButtonElement>(null);

  const handleSendMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!hasContent) return;
    const r = e.currentTarget.getBoundingClientRect();
    btnX.set((e.clientX - r.left - r.width / 2) * 0.35);
    btnY.set((e.clientY - r.top - r.height / 2) * 0.35);
  };
  const handleSendMouseLeave = () => { btnX.set(0); btnY.set(0); };

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

        {/* ── Model row + mode badge + Compare + Templates ── */}
        <div className="flex items-center gap-2 px-1">
          <span className="text-[10px] text-white/15 font-mono tracking-widest uppercase">Model</span>
          <ModelSelector />
          <div className="flex-1" />

          {/* Dev mode stacks hint */}
          <div className="hidden md:flex items-center gap-1">
            {devConfig.stacks.slice(0, 3).map((s) => (
              <span key={s} className="text-[9px] font-mono text-white/15 border border-white/[0.04] px-1.5 py-0.5 rounded">
                {s}
              </span>
            ))}
          </div>

          {/* Templates */}
          <motion.button
            onClick={() => { window.history.pushState({}, "", "/templates"); window.location.reload(); }}
            whileHover={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-white/[0.07] text-[10px] font-mono text-white/25 hover:text-violet-300 transition-all"
            title="Prompt Templates"
          >
            <Zap size={11} />
            <span className="hidden sm:inline">Templates</span>
          </motion.button>

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

        {/* Slash command picker */}
        <AnimatePresence>
          {slashOpen && filteredCommands.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="rounded-xl border border-white/[0.08] overflow-hidden shadow-2xl"
              style={{ background: "#07070F" }}
            >
              <div className="px-3 py-2 border-b border-white/[0.05]">
                <p className="text-[9px] font-mono text-white/20 tracking-widest uppercase">Slash Commands · press Esc to close</p>
              </div>
              {filteredCommands.map((cmd) => (
                <motion.button
                  key={cmd.cmd}
                  onClick={() => applySlashCommand(cmd)}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                  className="w-full text-left flex items-center gap-3 px-3 py-2.5 transition-colors"
                >
                  <span className="text-base flex-shrink-0">{cmd.icon}</span>
                  <span className="text-[12px] font-mono text-violet-300 font-semibold w-20 flex-shrink-0">{cmd.cmd}</span>
                  <span className="text-[11px] text-white/35">{cmd.desc}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

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
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder={`Message NJIRLAH AI… (${devConfig.label}) · type / for slash commands`}
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

          {/* Send button */}
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
          Enter ↵ send · Shift+Enter new line · / slash commands · 📎 attach · 🎤 voice
        </motion.p>
      </div>
    </motion.div>
  );
}
