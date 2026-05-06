import { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Share2, Rocket } from "lucide-react";
import { DeviceSimulator, DeviceMode } from "./DeviceSimulator";
import { BrowserFrame } from "./BrowserFrame";

function NjirlahPreview() {
  return (
    <div className="w-full h-full overflow-auto bg-[#05050A] flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white text-xs font-bold">N</div>
          <span className="text-white text-sm font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>NJIRLAH AI</span>
        </div>
        <div className="flex gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-blue-500/60" />
          </div>
          <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            <div className="w-3 h-0.5 bg-gray-500" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <span className="text-white text-xl font-bold">N</span>
        </div>
        <div>
          <h1 className="text-white text-xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Selamat datang di NJIRLAH AI
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
            Asisten AI multi-model yang cepat, cerdas, dan siap membantu.
          </p>
        </div>
        <div className="w-full max-w-sm mt-2">
          <div className="relative">
            <div className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-500 text-left">
              Tanya apa saja...
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center">
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-white">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-1">
          {["Jelaskan konsep AI", "Tulis kode Python", "Buat rangkuman"].map((s) => (
            <span key={s} className="text-xs text-gray-400 border border-white/10 rounded-full px-3 py-1 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AppPreviewPanel() {
  const [mode, setMode] = useState<DeviceMode>("desktop");
  const [refreshRotation, setRefreshRotation] = useState(0);

  const handleRefresh = () => setRefreshRotation((r) => r + 360);

  return (
    <div className="flex flex-col h-full" style={{ background: "#0d0d15" }}>
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs font-medium">App Preview</span>
          <span className="inline-flex items-center gap-1 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-medium rounded-full px-2 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Live
          </span>
        </div>

        <div className="flex items-center gap-2">
          <DeviceSimulator mode={mode} onChange={setMode} />

          <div className="flex items-center gap-1">
            <motion.button
              onClick={handleRefresh}
              animate={{ rotate: refreshRotation }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={13} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-colors"
              title="Share"
            >
              <Share2 size={13} />
            </motion.button>

            <motion.button
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(34,197,94,0.4)" }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-lg px-3 py-2 transition-colors shadow-lg"
            >
              <Rocket size={12} />
              Deploy to Production
            </motion.button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <BrowserFrame mode={mode}>
          <NjirlahPreview />
        </BrowserFrame>
      </div>
    </div>
  );
}
