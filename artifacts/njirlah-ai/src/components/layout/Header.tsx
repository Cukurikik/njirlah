import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";
import { ModelSelector } from "@/components/chat/ModelSelector";
import { useChatStore } from "@/store/chat-store";
import { UnicornLogo } from "@/components/ui/UnicornLogo";
import { GlitchText } from "@/components/ui/TypewriterText";

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
        transition={{ duration: 0.3, ease: "easeOut" as const }}
        className="flex items-center gap-3 px-4 h-12 border-b border-white/[0.06] bg-black flex-shrink-0"
      >
        {/* Logo */}
        <motion.button
          onClick={handleLogoClick}
          whileTap={{ scale: 0.88 }}
          className="flex items-center gap-2 select-none shrink-0 group"
          title="Click 3× for a surprise"
        >
          <motion.div
            whileHover={{ scale: 1.08 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <UnicornLogo size={22} animated />
          </motion.div>
          <GlitchText
            text="NJIRLAH"
            className="text-[11px] font-black tracking-[0.22em] text-white/45 group-hover:text-white/70 transition-colors font-orbitron hidden sm:block"
          />
        </motion.button>

        <div className="w-px h-4 bg-white/[0.07]" />

        <ModelSelector />

        <div className="ml-auto flex items-center gap-3">
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
              className="flex flex-col items-center gap-5"
            >
              <motion.div
                animate={{ y: [0, -28, 0, -18, 0], rotate: [-8, 8, -6, 6, 0] }}
                transition={{ duration: 2, repeat: 1 }}
              >
                <UnicornLogo size={100} animated />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-black text-white font-orbitron tracking-widest"
              >
                NJIR LAH KEREN!
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-xs text-white/30 font-mono tracking-[0.2em] uppercase"
              >
                easter egg unlocked ✦
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
