import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Loader2, X, RotateCcw, Copy, Check, Zap, GitCompare } from "lucide-react";
import { useCompareStore } from "@/store/compare-store";
import { useCompareChat } from "@/hooks/useCompareChat";
import { CompareModelPicker } from "./CompareModelPicker";
import { MarkdownContent } from "@/components/chat/MarkdownContent";
import type { ModelProvider } from "@/store/chat-store";

function TokenBadge({ text, isStreaming }: { text: string; isStreaming: boolean }) {
  const approx = Math.floor(text.length / 4);
  if (approx < 5) return null;
  return (
    <div className={`flex items-center gap-1 text-[10px] font-mono ${isStreaming ? "text-white/30" : "text-white/15"}`}>
      <motion.div animate={isStreaming ? { opacity: [0.4, 1, 0.4] } : { opacity: 1 }} transition={{ duration: 0.7, repeat: isStreaming ? Infinity : 0 }}>
        <Zap size={9} className={isStreaming ? "text-violet-400/60" : "text-white/15"} />
      </motion.div>
      <span>~{approx} tokens</span>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <motion.button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="p-1 rounded text-white/20 hover:text-white/55 transition-colors"
      title="Copy response"
    >
      {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
    </motion.button>
  );
}

interface ColumnProps {
  label: string;
  model: string;
  provider: ModelProvider;
  onModelChange: (id: string, provider: ModelProvider) => void;
  accentColor: string;
  borderColor: string;
  labelColor: string;
  rounds: { id: string; prompt: string; response: string; isStreaming: boolean; error?: string }[];
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

function CompareColumn({ label, model, provider, onModelChange, accentColor, borderColor, labelColor, rounds, scrollRef }: ColumnProps) {
  return (
    <div className={`flex flex-col flex-1 min-w-0 border-r ${borderColor} last:border-r-0`}>
      {/* Column header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.05] flex-shrink-0">
        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${accentColor}`} />
        <span className={`text-[10px] font-bold tracking-widest uppercase font-mono flex-shrink-0 ${labelColor}`}>{label}</span>
        <CompareModelPicker
          value={model}
          provider={provider}
          onChange={onModelChange}
          accentColor={accentColor.includes("violet") ? "violet" : "blue"}
        />
      </div>

      {/* Responses */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {rounds.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-[11px] text-white/15 font-mono text-center">
              Type a prompt below<br />to compare responses
            </p>
          </div>
        )}

        {rounds.map((round) => (
          <div key={round.id} className="space-y-2">
            {/* Prompt echo */}
            <div className="flex items-start gap-2">
              <span className="text-[9px] font-mono text-white/15 mt-0.5 flex-shrink-0">Q</span>
              <p className="text-xs text-white/30 leading-relaxed">{round.prompt}</p>
            </div>

            {/* Response */}
            <div className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${
              round.isStreaming
                ? "border-white/[0.08] bg-white/[0.015]"
                : "border-white/[0.05] bg-white/[0.01]"
            }`}>
              {round.response ? (
                <MarkdownContent content={round.response} isStreaming={round.isStreaming} />
              ) : round.isStreaming ? (
                <div className="flex items-center gap-2 py-1">
                  {[0,1,2].map((i) => (
                    <motion.div key={i} className="w-1 h-1 rounded-full bg-white/30"
                      animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            {/* Footer */}
            {!round.isStreaming && round.response && (
              <div className="flex items-center gap-2 px-1">
                <TokenBadge text={round.response} isStreaming={false} />
                <div className="flex-1" />
                <CopyButton text={round.response} />
              </div>
            )}
            {round.isStreaming && round.response && (
              <TokenBadge text={round.response} isStreaming />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CompareView({ onClose }: { onClose: () => void }) {
  const { modelA, providerA, modelB, providerB, rounds, setModelA, setModelB, clearHistory } = useCompareStore();
  const { compare, isComparing } = useCompareChat();
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollA = useRef<HTMLDivElement>(null);
  const scrollB = useRef<HTMLDivElement>(null);

  /* Auto-scroll both columns on new content */
  useEffect(() => {
    scrollA.current?.scrollTo({ top: scrollA.current.scrollHeight, behavior: "smooth" });
    scrollB.current?.scrollTo({ top: scrollB.current.scrollHeight, behavior: "smooth" });
  }, [rounds]);

  const handleSend = useCallback(async () => {
    const msg = input.trim();
    if (!msg || isComparing) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    await compare(msg);
  }, [input, isComparing, compare]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  /* Map rounds into per-column format */
  const colARounds = rounds.map((r) => ({ id: r.id, prompt: r.prompt, response: r.responseA, isStreaming: r.isStreamingA, error: r.errorA }));
  const colBRounds = rounds.map((r) => ({ id: r.id, prompt: r.prompt, response: r.responseB, isStreaming: r.isStreamingB, error: r.errorB }));

  const anyStreaming = rounds.some((r) => r.isStreamingA || r.isStreamingB);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col w-full h-full"
      style={{ background: "#05050A" }}
    >
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.06] flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-violet-500/[0.08] border border-violet-500/20">
            <GitCompare size={12} className="text-violet-400" />
          </div>
          <span className="text-xs font-semibold text-white/60 tracking-wide">Compare Models</span>
          <span className="text-[10px] font-mono text-violet-400/40 border border-violet-500/15 px-1.5 py-0.5 rounded">BETA</span>
        </div>

        <div className="flex-1" />

        <AnimatePresence>
          {anyStreaming && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-[10px] text-white/25 font-mono">
              <motion.div className="w-1.5 h-1.5 rounded-full bg-violet-400"
                animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.7, repeat: Infinity }} />
              comparing…
            </motion.div>
          )}
        </AnimatePresence>

        {rounds.length > 0 && (
          <motion.button
            onClick={clearHistory}
            whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
            whileTap={{ scale: 0.94 }}
            className="flex items-center gap-1.5 px-2 py-1 rounded border border-white/[0.06] text-[10px] font-mono text-white/25 hover:text-white/55 transition-all"
            title="Clear all rounds"
          >
            <RotateCcw size={10} /> Clear
          </motion.button>
        )}

        <motion.button
          onClick={onClose}
          whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
          whileTap={{ scale: 0.94 }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-white/[0.06] text-[10px] font-mono text-white/25 hover:text-white/55 transition-all"
        >
          <X size={10} /> Exit Compare
        </motion.button>
      </div>

      {/* ── Split columns ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <CompareColumn
          label="Model A"
          model={modelA}
          provider={providerA}
          onModelChange={setModelA}
          accentColor="bg-violet-400"
          borderColor="border-white/[0.05]"
          labelColor="text-violet-400/60"
          rounds={colARounds}
          scrollRef={scrollA}
        />
        <CompareColumn
          label="Model B"
          model={modelB}
          provider={providerB}
          onModelChange={setModelB}
          accentColor="bg-blue-400"
          borderColor="border-white/[0.05]"
          labelColor="text-blue-400/60"
          rounds={colBRounds}
          scrollRef={scrollB}
        />
      </div>

      {/* ── Shared input ── */}
      <div className="px-4 pb-4 pt-2 border-t border-white/[0.06] flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <motion.div
            animate={{ borderColor: input.trim() ? "rgba(139,92,246,0.35)" : "rgba(255,255,255,0.07)" }}
            className="flex items-end gap-2 bg-white/[0.02] border rounded-xl px-3 py-2.5"
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onInput={() => {
                const el = textareaRef.current;
                if (!el) return;
                el.style.height = "auto";
                el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
              }}
              placeholder="Ask both models the same question…"
              rows={1}
              className="flex-1 bg-transparent text-sm text-white/85 placeholder-white/20 resize-none focus:outline-none leading-relaxed max-h-36 font-sans"
            />

            <motion.button
              onClick={handleSend}
              disabled={!input.trim() || isComparing}
              whileHover={input.trim() && !isComparing ? { scale: 1.05 } : {}}
              whileTap={input.trim() && !isComparing ? { scale: 0.92 } : {}}
              animate={{ backgroundColor: input.trim() && !isComparing ? "rgba(139,92,246,0.85)" : "rgba(255,255,255,0.04)" }}
              className="p-2 rounded-lg flex-shrink-0 mb-0.5 transition-all disabled:cursor-not-allowed"
            >
              <AnimatePresence mode="wait">
                {isComparing
                  ? <motion.div key="l" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                      <Loader2 size={14} className="text-white/60 animate-spin" />
                    </motion.div>
                  : <motion.div key="s" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                      <ArrowUp size={14} className={input.trim() ? "text-white" : "text-white/20"} />
                    </motion.div>
                }
              </AnimatePresence>
            </motion.button>
          </motion.div>

          <p className="text-[10px] text-white/12 text-center font-mono mt-1.5 tracking-wide">
            Enter ↵ sends to <span className="text-violet-400/40">Model A</span> + <span className="text-blue-400/40">Model B</span> simultaneously
          </p>
        </div>
      </div>
    </motion.div>
  );
}
