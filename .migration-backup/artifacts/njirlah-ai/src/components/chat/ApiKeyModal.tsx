import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Key, Eye, EyeOff, CheckCircle2, AlertCircle, ExternalLink, Loader2, Lock } from "lucide-react";
import { useApiKeyStore } from "@/store/api-key-store";
import { validateOpenRouterKey } from "@/lib/openrouter";

interface ApiKeyModalProps {
  open: boolean;
  onClose: () => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 280, damping: 26 } },
  exit: { opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.18 } },
};

export function ApiKeyModal({ open, onClose }: ApiKeyModalProps) {
  const [inputKey, setInputKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [testMessage, setTestMessage] = useState("");
  const { saveKey, isValidating } = useApiKeyStore();

  const handleTest = async () => {
    if (!inputKey.trim()) return;
    setTestStatus("testing");
    const valid = await validateOpenRouterKey(inputKey.trim());
    if (valid) { setTestStatus("success"); setTestMessage("Connection successful — API key is valid."); }
    else { setTestStatus("error"); setTestMessage("Invalid API key or connection failed."); }
  };

  const handleSave = async () => {
    if (!inputKey.trim()) return;
    await saveKey(inputKey.trim());
    setInputKey("");
    setTestStatus("idle");
    onClose();
  };

  const handleClose = () => {
    setInputKey("");
    setTestStatus("idle");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-md bg-[#080808] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Top accent line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg border border-violet-500/20 bg-violet-500/[0.06]">
                    <Key size={16} className="text-violet-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white tracking-tight">OpenRouter API Key</h2>
                    <p className="text-[11px] text-white/30 font-mono mt-0.5">BYOK — Bring Your Own Key</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className="p-1.5 rounded-md text-white/25 hover:text-white/60 transition-colors"
                >
                  <X size={15} />
                </motion.button>
              </div>

              {/* Security note */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-start gap-2.5 p-3 rounded-lg border border-white/[0.05] bg-white/[0.01] mb-5"
              >
                <Lock size={12} className="text-white/25 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-white/35 leading-relaxed">
                  Your key is <span className="text-white/55 font-medium">never sent to our server</span>. Encrypted with AES-GCM in your browser using a PBKDF2-derived key from your device fingerprint.
                </p>
              </motion.div>

              {/* Input */}
              <div className="space-y-3 mb-5">
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="sk-or-v1-..."
                    className="w-full px-3.5 py-2.5 pr-10 rounded-lg bg-white/[0.03] border border-white/[0.07] text-white/85 placeholder-white/15 focus:outline-none focus:border-violet-500/35 transition-all text-xs font-mono"
                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                  >
                    {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {testStatus !== "idle" && (
                    <motion.div
                      key={testStatus}
                      initial={{ opacity: 0, y: -6, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-mono ${
                        testStatus === "success" ? "border border-green-500/20 bg-green-500/[0.04] text-green-400"
                        : testStatus === "error" ? "border border-red-500/20 bg-red-500/[0.04] text-red-400"
                        : "border border-white/[0.05] bg-white/[0.02] text-white/40"
                      }`}
                    >
                      {testStatus === "testing" && <Loader2 size={11} className="animate-spin" />}
                      {testStatus === "success" && <CheckCircle2 size={11} />}
                      {testStatus === "error" && <AlertCircle size={11} />}
                      <span>{testStatus === "testing" ? "Testing connection..." : testMessage}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <motion.button
                  onClick={handleTest}
                  disabled={!inputKey.trim() || testStatus === "testing"}
                  whileHover={inputKey.trim() ? { backgroundColor: "rgba(255,255,255,0.04)" } : {}}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 py-2.5 rounded-lg border border-white/[0.08] text-xs text-white/45 hover:text-white/65 font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Test Connection
                </motion.button>
                <motion.button
                  onClick={handleSave}
                  disabled={!inputKey.trim() || isValidating}
                  whileHover={inputKey.trim() ? { backgroundColor: "rgba(139,92,246,0.9)" } : {}}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 py-2.5 rounded-lg bg-violet-600/80 hover:bg-violet-500/80 text-xs text-white font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {isValidating ? "Saving..." : "Save Key"}
                </motion.button>
              </div>

              <div className="flex items-center justify-center mt-4">
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] text-white/20 hover:text-white/45 transition-colors font-mono"
                >
                  Get a free key at openrouter.ai
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
