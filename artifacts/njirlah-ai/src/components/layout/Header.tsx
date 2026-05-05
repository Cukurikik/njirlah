import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, WifiOff, Sparkles } from "lucide-react";
import { ModelSelector } from "@/components/chat/ModelSelector";
import { useChatStore } from "@/store/chat-store";

interface HeaderProps {
  onOpenApiKey: () => void;
}

export function Header({ onOpenApiKey }: HeaderProps) {
  const { selectedProvider, isStreaming, getActiveChat } = useChatStore();
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const chat = getActiveChat();

  const handleLogoClick = useCallback(() => {
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);
    if (newCount >= 3) {
      setShowEasterEgg(true);
      setLogoClickCount(0);
      setTimeout(() => setShowEasterEgg(false), 3000);
    }
  }, [logoClickCount]);

  return (
    <>
      <header className="flex items-center gap-3 px-4 py-3 border-b border-white/10 backdrop-blur-2xl bg-black/30 flex-shrink-0">
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 select-none"
          title="Klik 3x untuk surprise!"
        >
          <motion.span
            whileTap={{ scale: 0.85, rotate: 15 }}
            className="text-2xl cursor-pointer"
          >
            🦄
          </motion.span>
          <span className="text-lg font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent font-space-grotesk hidden sm:block">
            NJIRLAH AI
          </span>
        </button>

        <div className="w-px h-6 bg-white/10 mx-1" />

        <ModelSelector />

        <div className="ml-auto flex items-center gap-3">
          {chat && (
            <div className="flex items-center gap-1.5 text-xs">
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${
                  selectedProvider === "cloudflare"
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                    : "bg-orange-500/10 border-orange-500/30 text-orange-400"
                }`}
              >
                {selectedProvider === "cloudflare" ? "☁️ Cloudflare" : "⚡ OpenRouter"}
              </span>
              {isStreaming && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1 text-purple-400 text-xs"
                >
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Wifi size={12} />
                  </motion.span>
                  Streaming
                </motion.span>
              )}
            </div>
          )}
        </div>
      </header>

      <AnimatePresence>
        {showEasterEgg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="text-center"
            >
              <motion.div
                animate={{
                  y: [0, -30, 0, -20, 0],
                  rotate: [0, -15, 15, -10, 0],
                }}
                transition={{ duration: 1.5, repeat: 2 }}
                className="text-[120px]"
              >
                🦄
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent font-space-grotesk"
              >
                NJIR LAH KEREN! ✨
              </motion.p>
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: (Math.random() - 0.5) * 400,
                    y: (Math.random() - 0.5) * 400,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{ duration: 1.5, delay: i * 0.05 }}
                >
                  {["✨", "💜", "🌈", "⭐", "💫"][i % 5]}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
