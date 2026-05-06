import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { DeviceMode, deviceWidth } from "./DeviceSimulator";

const ROUTES = [
  "localhost:3000/",
  "localhost:3000/chat",
  "localhost:3000/compare",
  "localhost:3000/settings",
  "localhost:3000/animations",
];

interface BrowserFrameProps {
  mode: DeviceMode;
  children: React.ReactNode;
}

export function BrowserFrame({ mode, children }: BrowserFrameProps) {
  const [routeIdx, setRouteIdx] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [showRoutes, setShowRoutes] = useState(false);

  const handleRefresh = () => {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 650);
  };

  const width = deviceWidth(mode);

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex items-center gap-2 px-4 py-2.5 border-b flex-shrink-0"
        style={{ background: "#1a1a2e", borderColor: "#374151" }}
      >
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button className="text-gray-600 hover:text-gray-400 transition-colors p-0.5">
            <ChevronLeft size={14} />
          </button>
          <button className="text-gray-600 hover:text-gray-400 transition-colors p-0.5">
            <ChevronRight size={14} />
          </button>
          <motion.button
            onClick={handleRefresh}
            animate={{ rotate: spinning ? 360 : 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="text-gray-600 hover:text-gray-400 transition-colors p-0.5"
          >
            <RotateCcw size={13} />
          </motion.button>
        </div>

        <div className="flex-1 relative">
          <button
            onClick={() => setShowRoutes((v) => !v)}
            className="w-full flex items-center gap-2 bg-white/5 border border-white/10 rounded-md px-3 py-1 text-left hover:border-white/20 transition-colors"
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 flex-shrink-0 text-green-400">
              <rect x="1" y="1" width="14" height="14" rx="3" stroke="currentColor" strokeWidth={1.5} />
              <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-mono text-[13px] text-gray-300 truncate">{ROUTES[routeIdx]}</span>
          </button>

          <AnimatePresence>
            {showRoutes && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full mt-1 left-0 right-0 z-50 rounded-lg border border-white/10 overflow-hidden"
                style={{ background: "#1a1a2e" }}
              >
                {ROUTES.map((r, i) => (
                  <button
                    key={r}
                    onClick={() => { setRouteIdx(i); setShowRoutes(false); }}
                    className={`w-full text-left px-3 py-2 font-mono text-xs transition-colors ${
                      i === routeIdx ? "bg-blue-600/20 text-blue-400" : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex items-stretch justify-center" style={{ background: "#0d0d15" }}>
        <motion.div
          layout
          animate={{ width }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="h-full overflow-hidden border-x"
          style={{ borderColor: "#1f2937", minWidth: 0 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
