import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Key, Eye, EyeOff, CheckCircle, AlertCircle, ExternalLink, Loader2 } from "lucide-react";
import { useApiKeyStore } from "@/store/api-key-store";
import { validateOpenRouterKey } from "@/lib/openrouter";

interface ApiKeyModalProps {
  open: boolean;
  onClose: () => void;
}

export function ApiKeyModal({ open, onClose }: ApiKeyModalProps) {
  const [inputKey, setInputKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [testMessage, setTestMessage] = useState("");
  const { saveKey, isValidating } = useApiKeyStore();

  const handleTest = async () => {
    if (!inputKey.trim()) return;
    setTestStatus("testing");
    setTestMessage("");
    const valid = await validateOpenRouterKey(inputKey.trim());
    if (valid) {
      setTestStatus("success");
      setTestMessage("Koneksi berhasil! API key valid.");
    } else {
      setTestStatus("error");
      setTestMessage("API key tidak valid atau terjadi kesalahan.");
    }
  };

  const handleSave = async () => {
    if (!inputKey.trim()) return;
    await saveKey(inputKey.trim());
    setInputKey("");
    setTestStatus("idle");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30">
                  <Key size={20} className="text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-space-grotesk">OpenRouter API Key</h2>
                  <p className="text-xs text-gray-400">BYOK – Kunci kamu, privasi terjaga</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-sm text-purple-300">
                <p>Kuncimu <strong>tidak pernah dikirim ke server</strong>. Disimpan terenkripsi AES-GCM di browser kamu saja. 🔒</p>
              </div>

              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all text-sm font-mono"
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <AnimatePresence>
                {testStatus !== "idle" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
                      testStatus === "success"
                        ? "bg-green-500/10 border border-green-500/20 text-green-400"
                        : testStatus === "error"
                        ? "bg-red-500/10 border border-red-500/20 text-red-400"
                        : "bg-yellow-500/10 border border-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {testStatus === "testing" && <Loader2 size={14} className="animate-spin" />}
                    {testStatus === "success" && <CheckCircle size={14} />}
                    {testStatus === "error" && <AlertCircle size={14} />}
                    <span>{testStatus === "testing" ? "Menguji koneksi..." : testMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-3">
                <button
                  onClick={handleTest}
                  disabled={!inputKey.trim() || testStatus === "testing"}
                  className="flex-1 py-2.5 rounded-xl border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Test Koneksi
                </button>
                <button
                  onClick={handleSave}
                  disabled={!inputKey.trim() || isValidating}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium text-sm hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isValidating ? "Menyimpan..." : "Simpan Key"}
                </button>
              </div>

              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 text-xs text-gray-500 hover:text-purple-400 transition-colors"
              >
                <span>Buat API key gratis di OpenRouter</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
