import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, RotateCcw, Save } from "lucide-react";
import { useChatStore } from "@/store/chat-store";

interface CustomInstructionsModalProps {
  open: boolean;
  onClose: () => void;
}

const PLACEHOLDER = `Examples:
- Always respond in Indonesian
- You are a senior backend engineer, prefer Go and PostgreSQL
- Be concise and skip preamble
- Format code with detailed inline comments`;

export function CustomInstructionsModal({ open, onClose }: CustomInstructionsModalProps) {
  const { customInstructions, setCustomInstructions } = useChatStore();
  const [draft, setDraft] = useState(customInstructions);

  useEffect(() => {
    if (open) setDraft(customInstructions);
  }, [open, customInstructions]);

  const save = () => {
    setCustomInstructions(draft.trim());
    onClose();
  };

  const reset = () => setDraft("");

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 26 } }}
            exit={{ opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.15 } }}
            className="relative w-full max-w-lg flex flex-col rounded-xl border border-white/[0.08] shadow-2xl overflow-hidden"
            style={{ background: "#05050A" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
              <div className="p-1.5 rounded-md bg-violet-500/[0.08] border border-violet-500/20">
                <SlidersHorizontal size={13} className="text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold text-white/85">Custom Instructions</h2>
                <p className="text-[10px] text-white/30 font-mono mt-0.5">Applied to every conversation as system context</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded text-white/25 hover:text-white/60 hover:bg-white/[0.04] transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-white/35 tracking-widest uppercase">
                  How should NJIRLAH AI behave?
                </label>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={PLACEHOLDER}
                  rows={8}
                  className="w-full bg-white/[0.02] border border-white/[0.07] rounded-lg px-4 py-3 text-[12px] text-white/75 placeholder-white/15 focus:outline-none focus:border-violet-500/35 resize-none font-mono leading-relaxed transition-colors scrollbar-thin scrollbar-thumb-violet"
                />
                <p className="text-[10px] text-white/20 font-mono text-right">
                  {draft.length} chars
                </p>
              </div>

              {/* Privacy note */}
              <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400/60 mt-1 flex-shrink-0" />
                <p className="text-[10px] text-white/30 leading-relaxed">
                  Instructions are stored locally on your device and never sent to our servers. They are only included in your AI requests.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-t border-white/[0.06]">
              <motion.button
                onClick={reset}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] text-white/30 hover:text-white/60 transition-colors font-mono border border-transparent hover:border-white/[0.07]"
              >
                <RotateCcw size={11} /> Reset
              </motion.button>
              <div className="flex-1" />
              <motion.button
                onClick={onClose}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                whileTap={{ scale: 0.96 }}
                className="px-4 py-1.5 rounded-md text-[11px] text-white/40 hover:text-white/60 transition-colors font-mono"
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={save}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-[11px] font-mono font-medium bg-violet-500/80 hover:bg-violet-500/90 text-white transition-colors"
              >
                <Save size={11} /> Save
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
