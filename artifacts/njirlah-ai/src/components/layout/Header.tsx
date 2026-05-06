import { motion, AnimatePresence } from "framer-motion";
import { Activity, Code2, Menu, Settings } from "lucide-react";
import { useChatStore } from "@/store/chat-store";
import { AILogo } from "@/components/ui/AILogo";
import { GlitchText } from "@/components/ui/TypewriterText";
import { ApiStatusBadge } from "@/components/chat/ApiStatusBadge";

interface HeaderProps {
  onToggleDevPanel?: () => void;
  devPanelOpen?: boolean;
  onOpenMobileSidebar?: () => void;
  onOpenSettings?: () => void;
}

export function Header({ onToggleDevPanel, devPanelOpen, onOpenMobileSidebar, onOpenSettings }: HeaderProps) {
  const { isStreaming } = useChatStore();

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" as const }}
      className="flex items-center gap-3 px-4 h-12 border-b border-white/[0.06] flex-shrink-0"
      style={{ background: "#05050A" }}
    >
      {/* Mobile hamburger */}
      <motion.button
        onClick={onOpenMobileSidebar}
        whileTap={{ scale: 0.92 }}
        className="p-1.5 rounded text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors md:hidden flex-shrink-0"
      >
        <Menu size={16} />
      </motion.button>

      {/* Logo */}
      <motion.div className="flex items-center gap-2 select-none shrink-0 group">
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

      {/* Spacer */}
      <div className="flex-1" />

      <div className="flex items-center gap-2">
        {/* API status */}
        <ApiStatusBadge />

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

        {/* Settings */}
        <motion.button
          onClick={onOpenSettings}
          whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
          whileTap={{ scale: 0.93 }}
          className="p-1.5 rounded border border-white/[0.06] text-white/25 hover:text-white/55 transition-colors"
          title="Settings"
        >
          <Settings size={13} />
        </motion.button>

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
