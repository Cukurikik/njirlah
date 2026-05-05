import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";
import { ModelSelector } from "@/components/chat/ModelSelector";
import { useChatStore } from "@/store/chat-store";

export function Header() {
  const { selectedProvider, isStreaming } = useChatStore();
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const handleLogoClick = useCallback(() => {
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);
    if (newCount >= 3) {
      setShowEasterEgg(true);
      setLogoClickCount(0);
      setTimeout(() => setShowEasterEgg(false), 3500);
    }
  }, [logoClickCount]);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex items-center gap-4 px-4 h-12 border-b border-white/[0.06] bg-black flex-shrink-0"
      >
        {/* Logo */}
        <motion.button
          onClick={handleLogoClick}
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-2 select-none shrink-0"
          title="Click 3× for a surprise"
        >
          <span className="text-base leading-none">🦄</span>
          <span className="text-xs font-semibold text-white/50 font-mono-code tracking-widest uppercase hidden sm:block">
            NJIRLAH
          </span>
        </motion.button>

        <div className="w-px h-4 bg-white/[0.08]" />

        <ModelSelector />

        <div className="ml-auto flex items-center gap-3">
          {/* Provider badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedProvider}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className={`hidden sm:flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-mono font-medium tracking-wide ${
                selectedProvider === "cloudflare"
                  ? "border-violet-500/20 text-violet-400/70 bg-violet-500/[0.04]"
                  : "border-orange-500/20 text-orange-400/70 bg-orange-500/[0.04]"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${selectedProvider === "cloudflare" ? "bg-violet-400" : "bg-orange-400"}`} />
              {selectedProvider === "cloudflare" ? "CF Workers" : "OpenRouter"}
            </motion.div>
          </AnimatePresence>

          {/* Streaming indicator */}
          <AnimatePresence>
            {isStreaming && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5 text-[10px] text-white/40 font-mono"
              >
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  <Activity size={11} className="text-violet-400" />
                </motion.div>
                <span>streaming</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Easter Egg */}
      <AnimatePresence>
        {showEasterEgg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.3, rotate: -20, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.3, rotate: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 14 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                animate={{ y: [0, -24, 0, -16, 0], rotate: [-8, 8, -6, 6, 0] }}
                transition={{ duration: 2, repeat: 1 }}
                className="text-[100px] leading-none"
              >
                🦄
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold text-white font-space-grotesk tracking-tight"
              >
                NJIR LAH KEREN! ✨
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-sm text-white/40 font-mono"
              >
                you found the easter egg
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
