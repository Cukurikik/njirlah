import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "@/store/chat-store";
import { ExternalLink, RefreshCw, Code2, Monitor, Smartphone, Maximize2, X } from "lucide-react";

interface ExtractedApp {
  html: string;
  title: string;
  lang: string;
}

function extractApp(content: string): ExtractedApp | null {
  // Try full HTML document first
  const htmlDocMatch = content.match(/```(?:html|HTML)\s*(<!DOCTYPE[\s\S]*?<\/html>)\s*```/i);
  if (htmlDocMatch) return { html: htmlDocMatch[1], title: "HTML App", lang: "html" };

  // Try HTML snippet
  const htmlSnippet = content.match(/```(?:html|HTML)\s*([\s\S]+?)\s*```/i);
  if (htmlSnippet) {
    const snippet = htmlSnippet[1];
    const full = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="https://cdn.tailwindcss.com"><\/script><style>body{background:#0d0d0d;color:#fff;font-family:system-ui,sans-serif}</style></head><body>${snippet}</body></html>`;
    return { html: full, title: "HTML Preview", lang: "html" };
  }

  // Try React/TSX — wrap with CDN
  const tsxMatch = content.match(/```(?:tsx|jsx|react)\s*([\s\S]+?)\s*```/i);
  if (tsxMatch) {
    const jsx = tsxMatch[1];
    const full = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="https://cdn.tailwindcss.com"><\/script>
<script src="https://unpkg.com/react@18/umd/react.development.js"><\/script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"><\/script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
<style>body{background:#0d0d0d;color:#fff;margin:0;font-family:system-ui,sans-serif}</style>
</head><body><div id="root"></div>
<script type="text/babel">
${jsx}
const rootEl = document.getElementById('root');
if(typeof App !== 'undefined') ReactDOM.createRoot(rootEl).render(React.createElement(App));
else if(typeof Component !== 'undefined') ReactDOM.createRoot(rootEl).render(React.createElement(Component));
<\/script></body></html>`;
    return { html: full, title: "React Preview", lang: "react" };
  }

  return null;
}

export function AppsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [key, setKey] = useState(0);
  const { getActiveChat } = useChatStore();
  const chat = getActiveChat();

  const app = useMemo<ExtractedApp | null>(() => {
    if (!chat) return null;
    // Find the most recent assistant message with code
    const assistantMsgs = [...chat.messages].reverse().filter((m) => m.role === "assistant" && m.content);
    for (const msg of assistantMsgs) {
      const extracted = extractApp(msg.content);
      if (extracted) return extracted;
    }
    return null;
  }, [chat?.messages]);

  const srcDoc = app?.html ?? "";

  const openExternal = () => {
    const blob = new Blob([srcDoc], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: 20, width: 0 }}
          animate={{ opacity: 1, x: 0, width: viewport === "mobile" ? 380 : 520 }}
          exit={{ opacity: 0, x: 20, width: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="flex flex-col h-full border-l border-white/[0.06] overflow-hidden flex-shrink-0"
          style={{ background: "#09090f", minWidth: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05] h-[52px]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.2), rgba(168,85,247,0.1))", border: "1px solid rgba(139,92,246,0.22)" }}>
                <Monitor size={12} className="text-violet-400" />
              </div>
              <span className="text-xs font-semibold text-white/65">Apps Preview</span>
              {app && (
                <span className="text-[9px] font-mono text-green-400/70 border border-green-500/15 bg-green-500/[0.06] px-1.5 py-0.5 rounded-full">LIVE</span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {/* Viewport toggle */}
              <div className="flex items-center border border-white/[0.06] rounded-lg overflow-hidden">
                {(["desktop", "mobile"] as const).map((v) => (
                  <motion.button key={v} onClick={() => setViewport(v)} whileTap={{ scale: 0.92 }}
                    className={`p-1.5 transition-colors ${viewport === v ? "text-violet-300 bg-violet-500/[0.08]" : "text-white/25 hover:text-white/55"}`}>
                    {v === "desktop" ? <Monitor size={12} /> : <Smartphone size={12} />}
                  </motion.button>
                ))}
              </div>
              <motion.button onClick={() => setKey((k) => k + 1)} whileTap={{ scale: 0.9, rotate: -180 }}
                transition={{ duration: 0.3 }}
                className="p-1.5 rounded-lg text-white/25 hover:text-white/60 hover:bg-white/[0.05] transition-all" title="Refresh">
                <RefreshCw size={12} />
              </motion.button>
              {app && (
                <motion.button onClick={openExternal} whileTap={{ scale: 0.9 }}
                  className="p-1.5 rounded-lg text-white/25 hover:text-white/60 hover:bg-white/[0.05] transition-all" title="Open in new tab">
                  <ExternalLink size={12} />
                </motion.button>
              )}
              <motion.button onClick={onClose} whileTap={{ scale: 0.9 }}
                className="p-1.5 rounded-lg text-white/25 hover:text-white/60 hover:bg-white/[0.05] transition-all">
                <X size={12} />
              </motion.button>
            </div>
          </div>

          {/* Preview */}
          <div className="flex-1 overflow-hidden flex items-start justify-center p-3" style={{ background: "#060609" }}>
            {app ? (
              <motion.div
                animate={{ width: viewport === "mobile" ? 375 : "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                className="h-full rounded-xl overflow-hidden border border-white/[0.07] shadow-2xl"
                style={{ maxWidth: "100%" }}
              >
                <iframe
                  key={key}
                  srcDoc={srcDoc}
                  className="w-full h-full"
                  sandbox="allow-scripts allow-same-origin"
                  title="App Preview"
                />
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-16 px-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <Code2 size={22} className="text-white/20" />
                </div>
                <p className="text-sm font-semibold text-white/35 mb-2">Belum ada preview</p>
                <p className="text-xs text-white/20 leading-relaxed max-w-[200px]">
                  Minta AI membuat HTML, React, atau kode lainnya — preview akan muncul di sini secara otomatis.
                </p>
              </div>
            )}
          </div>

          {/* Status bar */}
          {app && (
            <div className="px-4 py-2 border-t border-white/[0.04] flex items-center gap-3 text-[10px] font-mono text-white/20">
              <span className="text-violet-400/50">{app.lang.toUpperCase()}</span>
              <span>{app.title}</span>
              <div className="ml-auto flex items-center gap-1">
                <Maximize2 size={9} />
                {viewport}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook to detect if any chat message has renderable code
export function useHasApp(): boolean {
  const { getActiveChat } = useChatStore();
  const chat = getActiveChat();
  return useMemo(() => {
    if (!chat) return false;
    return chat.messages.some((m) => {
      if (m.role !== "assistant" || !m.content) return false;
      return /```(?:html|HTML|tsx|jsx|react)\s/i.test(m.content);
    });
  }, [chat?.messages]);
}
