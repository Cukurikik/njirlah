import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Share2, Maximize2, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import type { AgentFile } from "@/types/agent-types";
import { buildPreviewHtml } from "@/lib/build-preview-html";

type DeviceMode = "desktop" | "tablet" | "mobile";

const deviceWidths: Record<DeviceMode, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

function DeviceButton({
  mode,
  active,
  onClick,
  children,
}: {
  mode: DeviceMode;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative flex items-center justify-center w-7 h-7 rounded-md transition-colors ${
        active ? "text-white" : "text-gray-500 hover:text-gray-300"
      }`}
    >
      {active && (
        <motion.div
          layoutId="live-device-indicator"
          className="absolute inset-0 rounded-md bg-blue-600"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

interface LivePreviewPanelProps {
  files: Record<string, AgentFile>;
  fileOrder: string[];
  isGenerating: boolean;
}

export function LivePreviewPanel({ files, fileOrder, isGenerating }: LivePreviewPanelProps) {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshRotation, setRefreshRotation] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [previewHtml, setPreviewHtml] = useState<string>("");

  const hasDoneFiles = fileOrder.some((f) => files[f]?.isDone);

  useEffect(() => {
    if (hasDoneFiles) {
      const html = buildPreviewHtml(files);
      setPreviewHtml(html);
    }
  }, [fileOrder.filter((f) => files[f]?.isDone).join(","), hasDoneFiles]);

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
    setRefreshRotation((r) => r + 360);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "#0d0d15" }}>
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs font-medium">Live Preview</span>
          {isGenerating && (
            <motion.span
              className="inline-flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-medium rounded-full px-2 py-0.5"
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              Generating...
            </motion.span>
          )}
          {!isGenerating && hasDoneFiles && (
            <span className="inline-flex items-center gap-1 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-medium rounded-full px-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Live
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 bg-white/5 rounded-lg p-1 border border-white/10">
            <DeviceButton mode="desktop" active={deviceMode === "desktop"} onClick={() => setDeviceMode("desktop")}>
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                <rect x="1" y="2" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth={1.3} />
                <path d="M5 14h6M8 12v2" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" />
              </svg>
            </DeviceButton>
            <DeviceButton mode="tablet" active={deviceMode === "tablet"} onClick={() => setDeviceMode("tablet")}>
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                <rect x="3" y="1" width="10" height="14" rx="1.5" stroke="currentColor" strokeWidth={1.3} />
                <circle cx="8" cy="13" r="0.7" fill="currentColor" />
              </svg>
            </DeviceButton>
            <DeviceButton mode="mobile" active={deviceMode === "mobile"} onClick={() => setDeviceMode("mobile")}>
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                <rect x="4" y="1" width="8" height="14" rx="1.5" stroke="currentColor" strokeWidth={1.3} />
                <circle cx="8" cy="13" r="0.7" fill="currentColor" />
              </svg>
            </DeviceButton>
          </div>

          <motion.button
            onClick={handleRefresh}
            animate={{ rotate: refreshRotation }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <RefreshCw size={12} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <Share2 size={12} />
          </motion.button>

          <motion.button
            animate={isGenerating ? { scale: [1, 1.04, 1] } : { scale: 1 }}
            transition={{ repeat: isGenerating ? Infinity : 0, duration: 2 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(34,197,94,0.35)" }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-white text-[11px] font-bold rounded-lg px-3 py-1.5 transition-colors"
          >
            <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3">
              <path d="M7 1l1.5 4H13l-3.5 2.5 1.5 4L7 9l-4 2.5 1.5-4L1 5h4.5L7 1z" fill="currentColor" />
            </svg>
            Deploy
          </motion.button>
        </div>
      </div>

      <div
        className="flex items-center gap-2 px-4 py-2 border-b flex-shrink-0"
        style={{ background: "#1a1a2e", borderColor: "#374151" }}
      >
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        </div>
        <div className="flex items-center gap-1 ml-1">
          <button className="text-gray-600 hover:text-gray-400 transition-colors">
            <ChevronLeft size={13} />
          </button>
          <button className="text-gray-600 hover:text-gray-400 transition-colors">
            <ChevronRight size={13} />
          </button>
          <button onClick={handleRefresh} className="text-gray-600 hover:text-gray-400 transition-colors">
            <RotateCcw size={12} />
          </button>
        </div>
        <div className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-1 flex items-center gap-2">
          <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3 text-green-400 flex-shrink-0">
            <rect x="1" y="1" width="12" height="12" rx="2.5" stroke="currentColor" strokeWidth={1.3} />
            <path d="M4 7l2 2 4-4" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-mono text-[12px] text-gray-400">localhost:3000/</span>
        </div>
      </div>

      <div className="flex-1 flex items-stretch justify-center overflow-hidden" style={{ background: "#111" }}>
        <motion.div
          layout
          animate={{ width: deviceWidths[deviceMode] }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="h-full overflow-hidden border-x border-gray-800"
          style={{ minWidth: 0 }}
        >
          {previewHtml ? (
            <iframe
              key={refreshKey}
              srcDoc={previewHtml}
              sandbox="allow-scripts allow-same-origin"
              className="w-full h-full border-0 bg-white"
              title="Live Preview"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-[#0d0d15] text-gray-600">
              {isGenerating ? (
                <>
                  <motion.div
                    className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  />
                  <p className="text-sm">Building preview...</p>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
                    <rect x="4" y="8" width="40" height="32" rx="3" stroke="currentColor" strokeWidth={2} />
                    <path d="M4 16h40" stroke="currentColor" strokeWidth={2} />
                    <circle cx="10" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="15" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="20" cy="12" r="1.5" fill="currentColor" />
                    <path d="M18 28l-5-4 5-4M30 20l5 4-5 4M23 34l2-8" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">No preview yet</p>
                    <p className="text-xs text-gray-600 mt-1">Generate code to see a live preview</p>
                  </div>
                </>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
