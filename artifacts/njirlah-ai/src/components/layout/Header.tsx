import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Terminal, Code2, Eye } from "lucide-react";
import { ModelSelector } from "@/components/chat/ModelSelector";
import { useChatStore } from "@/store/chat-store";
import { AILogo } from "@/components/ui/AILogo";
import { GlitchText } from "@/components/ui/TypewriterText";

interface HeaderProps {
  onToggleDevPanel?: () => void;
  devPanelOpen?: boolean;
}

export function Header({ onToggleDevPanel, devPanelOpen }: HeaderProps) {
  const { selectedProvider, isStreaming } = useChatStore();

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" as const }}
      className="flex items-center gap-3 px-4 h-12 border-b border-white/[0.06] bg-black flex-shrink-0"
    >
      {/* Logo */}
      <motion.div
        className="flex items-center gap-2 select-none shrink-0 group"
      >
        <motion.div
          whileHover={{ scale: 1.08 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <AILogo size={22} animated />
        </motion.div>
        <GlitchText
          text="NJIRLAH"
          className="text-[11px] font-black tracking-[0.22em] text-white/45 group-hover:text-white/70 transition-colors font-orbitron hidden sm:block"
        />
      </motion.div>

      <div className="w-px h-4 bg-white/[0.07]" />

      <ModelSelector />

      <div className="ml-auto flex items-center gap-2">
        {/* Dev Panel toggle */}
        {onToggleDevPanel && (
          <motion.button
            onClick={onToggleDevPanel}
            whileHover={{ backgroundColor: "rgba(139,92,246,0.1)" }}
            whileTap={{ scale: 0.93 }}
            animate={{
              borderColor: devPanelOpen ? "rgba(139,92,246,0.35)" : "rgba(255,255,255,0.07)",
              color: devPanelOpen ? "rgba(167,139,250,0.9)" : "rgba(255,255,255,0.3)",
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded border text-[10px] font-mono tracking-widest uppercase transition-all"
            title="Toggle Dev Panel"
          >
            <Code2 size={11} />
            <span>Dev</span>
          </motion.button>
        )}

        {/* Provider pill */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedProvider}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className={`hidden sm:flex items-center gap-1.5 px-2 py-1 rounded border text-[9px] font-mono font-bold tracking-widest uppercase ${
              selectedProvider === "cloudflare"
                ? "border-violet-500/20 text-violet-400/60 bg-violet-500/[0.03]"
                : "border-orange-500/20 text-orange-400/60 bg-orange-500/[0.03]"
            }`}
          >
            <motion.span
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${selectedProvider === "cloudflare" ? "bg-violet-400" : "bg-orange-400"}`}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            {selectedProvider === "cloudflare" ? "CF Workers" : "OpenRouter"}
          </motion.div>
        </AnimatePresence>

        {/* Streaming badge */}
        <AnimatePresence>
          {isStreaming && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1.5 text-[9px] text-white/35 font-mono tracking-widest uppercase"
            >
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity }}>
                <Activity size={11} className="text-violet-400" />
              </motion.div>
              streaming
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
