import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Monitor, Code2, RefreshCw, ExternalLink,
  MousePointer2, AlertTriangle, Send, ChevronDown,
} from "lucide-react";
import { useChat } from "@/hooks/useChat";

interface LivePreviewModalProps {
  open: boolean;
  onClose: () => void;
  code: string;
  language: string;
}

type IframeMessage =
  | { type: "njirlah_elementSelected"; tag: string; id: string | null; className: string | null; text: string; outerHTML: string }
  | { type: "njirlah_runtimeError"; message: string; source?: string | null; line?: number; col?: number };

const ELEMENT_SELECTOR_SCRIPT = `
<script>
(function() {
  var _ov = null;
  function _setOv(el) {
    _rmOv();
    if (!el || el === document.body || el === document.documentElement || el === document) return;
    var r = el.getBoundingClientRect();
    _ov = document.createElement('div');
    _ov.id = '__nj_ov__';
    _ov.style.cssText = 'position:fixed;pointer-events:none;z-index:2147483647;box-sizing:border-box;'
      + 'border:2px solid rgba(139,92,246,0.9);background:rgba(139,92,246,0.08);'
      + 'border-radius:3px;transition:all 0.08s ease;'
      + 'top:' + r.top + 'px;left:' + r.left + 'px;width:' + r.width + 'px;height:' + r.height + 'px;';
    var label = document.createElement('div');
    label.style.cssText = 'position:absolute;bottom:calc(100% + 4px);left:0;background:rgba(139,92,246,0.95);'
      + 'color:white;font-size:10px;padding:2px 6px;border-radius:3px;font-family:monospace;white-space:nowrap;'
      + 'pointer-events:none;z-index:1;';
    label.textContent = (el.tagName||'').toLowerCase()
      + (el.id ? '#'+el.id : '')
      + (el.className && typeof el.className === 'string' ? '.'+el.className.trim().split(/\\s+/).join('.') : '');
    _ov.appendChild(label);
    document.body.appendChild(_ov);
  }
  function _rmOv() { if (_ov) { _ov.remove(); _ov = null; } }
  document.addEventListener('mouseover', function(e) { _setOv(e.target); }, true);
  document.addEventListener('mouseout', function() { _rmOv(); }, true);
  document.addEventListener('click', function(e) {
    e.preventDefault(); e.stopPropagation();
    var el = e.target;
    if (!el || el === document.body) return;
    window.parent.postMessage({
      type: 'njirlah_elementSelected',
      tag: (el.tagName||'unknown').toLowerCase(),
      id: el.id || null,
      className: (typeof el.className === 'string' ? el.className : null),
      text: (el.textContent||'').substring(0,120).trim(),
      outerHTML: (el.outerHTML||'').substring(0,600),
    }, '*');
  }, true);
  window.onerror = function(msg, src, line, col) {
    window.parent.postMessage({
      type: 'njirlah_runtimeError',
      message: String(msg),
      source: src ? src.split('/').pop() : null,
      line: line, col: col,
    }, '*');
    return false;
  };
  window.addEventListener('unhandledrejection', function(e) {
    window.parent.postMessage({
      type: 'njirlah_runtimeError',
      message: String(e.reason && e.reason.message ? e.reason.message : e.reason),
    }, '*');
  });
})();
</script>
`;

function buildPreviewHtml(code: string, language: string, selectionMode: boolean): string {
  const isHtml = ["html", "svg"].includes(language);
  const isSvg = language === "svg";

  const bodyContent = isHtml
    ? (isSvg ? `<svg xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">${code}</svg>` : code)
    : `<pre style="padding:20px;font-family:'JetBrains Mono',monospace;font-size:12px;line-height:1.6;color:#e2e8f0;white-space:pre-wrap;word-break:break-all;">${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<script src="https://cdn.tailwindcss.com"><\/script>
<style>
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; background: #050505; color: #e2e8f0; font-family: system-ui, sans-serif; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.4); border-radius: 2px; }
  ${selectionMode ? "[data-nj-hover]{outline:2px solid rgba(139,92,246,0.7);outline-offset:1px;}" : ""}
</style>
${selectionMode ? ELEMENT_SELECTOR_SCRIPT : ""}
</head>
<body>${bodyContent}</body>
</html>`;
}

export function LivePreviewModal({ open, onClose, code, language }: LivePreviewModalProps) {
  const [view, setView] = useState<"preview" | "source">("preview");
  const [key, setKey] = useState(0);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedEl, setSelectedEl] = useState<IframeMessage & { type: "njirlah_elementSelected" } | null>(null);
  const [runtimeError, setRuntimeError] = useState<{ message: string; source?: string | null; line?: number } | null>(null);
  const [instruction, setInstruction] = useState("");
  const instructionRef = useRef<HTMLInputElement>(null);
  const { sendMessage } = useChat();

  const srcDoc = buildPreviewHtml(code, language, selectionMode);

  const openExternal = () => {
    const win = window.open("", "_blank");
    if (win) { win.document.write(srcDoc); win.document.close(); }
  };

  const handleMessage = useCallback((e: MessageEvent) => {
    if (!e.data || typeof e.data !== "object") return;
    const msg = e.data as IframeMessage;
    if (msg.type === "njirlah_elementSelected") {
      setSelectedEl(msg);
      setRuntimeError(null);
      setTimeout(() => instructionRef.current?.focus(), 50);
    } else if (msg.type === "njirlah_runtimeError") {
      setRuntimeError({ message: msg.message, source: msg.source, line: msg.line });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  useEffect(() => {
    if (!open) { setSelectedEl(null); setRuntimeError(null); setSelectionMode(false); }
  }, [open]);

  const applyInstruction = () => {
    if (!instruction.trim() || !selectedEl) return;
    const prompt = `I have this element in my HTML preview:\n\`\`\`html\n${selectedEl.outerHTML}\n\`\`\`\n\n${instruction.trim()}`;
    sendMessage(prompt);
    setInstruction("");
    setSelectedEl(null);
    onClose();
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
            className="relative w-full max-w-4xl flex flex-col bg-[#050505] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl"
            style={{ height: "82vh" }}
          >
            {/* ── Title bar ── */}
            <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.01] flex-shrink-0">
              {/* Traffic lights */}
              <div className="flex items-center gap-1.5">
                <motion.div whileHover={{ scale: 1.2 }} onClick={onClose} className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600/40 cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50 border border-yellow-600/30" />
                <div className="w-3 h-3 rounded-full bg-green-500/50 border border-green-600/30" />
              </div>

              {/* View toggle */}
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-0.5 p-0.5 bg-white/[0.03] border border-white/[0.06] rounded-md">
                  {([
                    { id: "preview" as const, icon: <Monitor size={11} />, label: "Preview" },
                    { id: "source" as const, icon: <Code2 size={11} />, label: "Source" },
                  ]).map((tab) => (
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
                {/* Element selection toggle */}
                {view === "preview" && (
                  <motion.button
                    onClick={() => { setSelectionMode(!selectionMode); setSelectedEl(null); setKey(k => k + 1); }}
                    whileTap={{ scale: 0.93 }}
                    animate={{
                      backgroundColor: selectionMode ? "rgba(139,92,246,0.15)" : "transparent",
                      borderColor: selectionMode ? "rgba(139,92,246,0.35)" : "rgba(255,255,255,0.06)",
                      color: selectionMode ? "rgba(167,139,250,0.9)" : "rgba(255,255,255,0.35)",
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded border text-[11px] font-mono transition-all"
                    title={selectionMode ? "Exit selection mode" : "Select element"}
                  >
                    <MousePointer2 size={11} />
                    <span className="hidden sm:inline">Select</span>
                  </motion.button>
                )}
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

            {/* ── Content ── */}
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
                      key={key}
                      srcDoc={srcDoc}
                      sandbox="allow-scripts allow-same-origin allow-forms"
                      className="w-full h-full border-0"
                      title="Code Preview"
                      style={{ cursor: selectionMode ? "crosshair" : "default" }}
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

              {/* Runtime error overlay */}
              <AnimatePresence>
                {runtimeError && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute bottom-0 left-0 right-0 mx-3 mb-3 bg-red-950/90 border border-red-500/40 rounded-lg p-3 backdrop-blur-sm"
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-red-300 mb-0.5">Runtime Error</p>
                        <p className="text-[11px] text-red-400/80 font-mono break-words">{runtimeError.message}</p>
                        {runtimeError.source && (
                          <p className="text-[10px] text-red-500/60 font-mono mt-0.5">
                            {runtimeError.source}{runtimeError.line != null ? ` : line ${runtimeError.line}` : ""}
                          </p>
                        )}
                      </div>
                      <button onClick={() => setRuntimeError(null)} className="text-red-500/60 hover:text-red-400 transition-colors flex-shrink-0">
                        <X size={12} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Element selection panel ── */}
            <AnimatePresence>
              {selectedEl && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-violet-500/25 bg-violet-500/[0.04] overflow-hidden"
                >
                  <div className="px-4 py-3">
                    {/* Element info */}
                    <div className="flex items-center gap-2 mb-2.5">
                      <MousePointer2 size={11} className="text-violet-400/70" />
                      <span className="text-[10px] font-mono text-violet-300/80">
                        &lt;{selectedEl.tag}
                        {selectedEl.id ? ` id="${selectedEl.id}"` : ""}
                        {selectedEl.className ? ` class="${selectedEl.className.slice(0, 40)}${selectedEl.className.length > 40 ? "…" : ""}"` : ""}
                        &gt;
                      </span>
                      {selectedEl.text && (
                        <span className="text-[10px] text-white/30 truncate max-w-[200px]">
                          "{selectedEl.text.slice(0, 50)}{selectedEl.text.length > 50 ? "…" : ""}"
                        </span>
                      )}
                      <button onClick={() => setSelectedEl(null)} className="ml-auto text-white/20 hover:text-white/50 transition-colors">
                        <X size={11} />
                      </button>
                    </div>

                    {/* Instruction input */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex items-center gap-2 bg-black/40 border border-white/[0.07] rounded-md px-3 py-2 focus-within:border-violet-500/35 transition-colors">
                        <input
                          ref={instructionRef}
                          value={instruction}
                          onChange={(e) => setInstruction(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && applyInstruction()}
                          placeholder='Give an instruction, e.g. "Make this button blue and larger"'
                          className="flex-1 bg-transparent text-[12px] text-white/75 placeholder-white/20 focus:outline-none font-sans"
                        />
                      </div>
                      <motion.button
                        onClick={applyInstruction}
                        disabled={!instruction.trim()}
                        whileHover={instruction.trim() ? { scale: 1.04 } : {}}
                        whileTap={instruction.trim() ? { scale: 0.95 } : {}}
                        animate={{ backgroundColor: instruction.trim() ? "rgba(139,92,246,0.8)" : "rgba(255,255,255,0.04)" }}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-md text-[12px] font-mono font-medium transition-all disabled:cursor-not-allowed"
                        style={{ color: instruction.trim() ? "white" : "rgba(255,255,255,0.25)" }}
                      >
                        <Send size={11} /> Apply
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Status bar ── */}
            <div className="flex items-center gap-4 px-4 py-1.5 border-t border-white/[0.04] bg-white/[0.01] flex-shrink-0">
              <span className="text-[10px] text-white/15 font-mono">{language.toUpperCase()} · Live Preview</span>
              {selectionMode && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1 text-[10px] text-violet-400/60 font-mono"
                >
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-violet-400"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                  Click any element to select it
                </motion.span>
              )}
              <span className="text-[10px] text-white/10 font-mono ml-auto">
                Tailwind CDN · allow-scripts
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
