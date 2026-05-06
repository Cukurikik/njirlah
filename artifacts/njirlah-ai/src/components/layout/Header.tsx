import { motion, AnimatePresence } from "framer-motion";
import { Activity, Menu, Settings, Command, PanelRight } from "lucide-react";
import { useChatStore } from "@/store/chat-store";
import { NJIRLAHLogo } from "@/components/layout/NJIRLAHLogo";
import { ApiStatusBadge } from "@/components/chat/ApiStatusBadge";
import { DevModeSelector } from "@/components/workspace/DevModeSelector";

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
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="relative flex items-center gap-3 px-4 h-13 border-b border-white/[0.05] flex-shrink-0"
      style={{ background: "#07070f", height: "52px" }}
    >
      {/* Streaming indicator */}
      <AnimatePresence>
        {isStreaming && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="absolute top-0 left-0 right-0 h-[1px] origin-left"
            style={{ background: "linear-gradient(90deg, transparent, #7c3aed, #a855f7, #7c3aed, transparent)" }}
          />
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <motion.button
        onClick={onOpenMobileSidebar}
        whileTap={{ scale: 0.9 }}
        className="p-1.5 rounded-lg text-white/30 hover:text-white/65 hover:bg-white/[0.05] transition-colors md:hidden flex-shrink-0"
      >
        <Menu size={16} />
      </motion.button>

      {/* Logo */}
      <NJIRLAHLogo size={20} showText className="shrink-0" />

      {/* Center — Dev mode */}
      <div className="flex-1 flex items-center justify-center">
        <DevModeSelector />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1.5">
        <ApiStatusBadge />

        {onToggleDevPanel && (
          <motion.button
            onClick={onToggleDevPanel}
            whileTap={{ scale: 0.92 }}
            animate={{
              color: devPanelOpen ? "rgba(167,139,250,0.9)" : "rgba(255,255,255,0.3)",
              backgroundColor: devPanelOpen ? "rgba(139,92,246,0.08)" : "transparent",
            }}
            className="p-2 rounded-lg border border-white/[0.06] transition-all hover:border-white/[0.1] hover:text-white/60"
            title="Dev Panel"
          >
            <PanelRight size={14} />
          </motion.button>
        )}

        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }))}
          className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-white/[0.06] text-[10px] font-mono text-white/25 hover:text-white/50 hover:border-white/[0.1] transition-all"
          title="⌘K"
        >
          <Command size={10} />
          K
        </motion.button>

        <motion.button
          onClick={onOpenSettings}
          whileTap={{ scale: 0.92 }}
          className="p-2 rounded-lg border border-white/[0.06] text-white/30 hover:text-white/65 hover:border-white/[0.1] transition-all"
          title="Settings"
        >
          <Settings size={14} />
        </motion.button>

        <AnimatePresence>
          {isStreaming && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1.5 text-[9px] text-white/30 font-mono tracking-widest uppercase"
            >
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }}>
                <Activity size={10} className="text-violet-400" />
              </motion.div>
              streaming
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
