import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Monitor, Code2, RefreshCw, Maximize2, ExternalLink } from "lucide-react";

interface LivePreviewModalProps {
  open: boolean;
  onClose: () => void;
  code: string;
  language: string;
}

export function LivePreviewModal({ open, onClose, code, language }: LivePreviewModalProps) {
  const [view, setView] = useState<"preview" | "source">("preview");
  const [key, setKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const htmlContent = language === "html"
    ? code
    : `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">${code}</svg>`;

  const fullHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; background: #000; color: #f0f0f0; font-family: system-ui, sans-serif; }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.4); border-radius: 2px; }
</style>
</head>
<body>${htmlContent}</body>
</html>`;

  const openExternal = () => {
    const win = window.open("", "_blank");
    win?.document.write(fullHtml);
    win?.document.close();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 24 } }}
            exit={{ opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.15 } }}
            className="relative w-full max-w-4xl h-[80vh] flex flex-col bg-[#050505] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl"
          >
            {/* Title bar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-white/[0.01] flex-shrink-0">
              {/* Traffic lights */}
              <div className="flex items-center gap-1.5">
                <motion.div whileHover={{ scale: 1.2 }} onClick={onClose} className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600/40 cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50 border border-yellow-600/30" />
                <div className="w-3 h-3 rounded-full bg-green-500/50 border border-green-600/30" />
              </div>

              <div className="flex-1 flex justify-center">
                {/* View toggle */}
                <div className="flex items-center gap-0.5 p-0.5 bg-white/[0.03] border border-white/[0.06] rounded-md">
                  {([
                    { id: "preview", icon: <Monitor size={12} />, label: "Preview" },
                    { id: "source", icon: <Code2 size={12} />, label: "Source" },
                  ] as const).map((tab) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => setView(tab.id)}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-mono font-medium transition-all ${
                        view === tab.id
                          ? "bg-violet-500/20 text-violet-300 border border-violet-500/25"
                          : "text-white/30 hover:text-white/55"
                      }`}
                    >
                      {tab.icon}{tab.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <motion.button
                  onClick={() => setKey(k => k + 1)}
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                  className="p-1.5 rounded text-white/25 hover:text-white/55 hover:bg-white/[0.04] transition-colors"
                  title="Reload"
                >
                  <RefreshCw size={13} />
                </motion.button>
                <motion.button
                  onClick={openExternal}
                  whileHover={{ scale: 1.05 }}
                  className="p-1.5 rounded text-white/25 hover:text-white/55 hover:bg-white/[0.04] transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink size={13} />
                </motion.button>
                <motion.button
                  onClick={onClose}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 rounded text-white/25 hover:text-white/60 transition-colors ml-1"
                >
                  <X size={14} />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {view === "preview" ? (
                  <motion.div
                    key={`preview-${key}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0"
                  >
                    <iframe
                      ref={iframeRef}
                      key={key}
                      srcDoc={fullHtml}
                      sandbox="allow-scripts allow-same-origin allow-forms"
                      className="w-full h-full border-0"
                      title="Code Preview"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="source"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 overflow-auto p-4 scrollbar-thin scrollbar-thumb-violet"
                  >
                    <pre className="text-[11px] text-white/60 font-mono leading-relaxed whitespace-pre-wrap">
                      {code}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Status bar */}
            <div className="flex items-center gap-4 px-4 py-1.5 border-t border-white/[0.04] bg-white/[0.01] flex-shrink-0">
              <span className="text-[10px] text-white/15 font-mono">{language.toUpperCase()} · Live Preview</span>
              <span className="text-[10px] text-white/10 font-mono ml-auto">sandbox: allow-scripts</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
