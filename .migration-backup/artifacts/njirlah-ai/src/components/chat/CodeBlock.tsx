import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Play, Code2, Terminal, FileCode, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { LivePreviewModal } from "./LivePreview";

interface CodeBlockProps {
  code: string;
  language?: string;
  inline?: boolean;
}

const LANG_ICONS: Record<string, React.ReactNode> = {
  javascript: <FileCode size={11} />,
  typescript: <FileCode size={11} />,
  jsx: <FileCode size={11} />,
  tsx: <FileCode size={11} />,
  python: <Terminal size={11} />,
  bash: <Terminal size={11} />,
  sh: <Terminal size={11} />,
  html: <Code2 size={11} />,
  css: <Code2 size={11} />,
  json: <Code2 size={11} />,
  sql: <Code2 size={11} />,
};

const LANG_COLORS: Record<string, string> = {
  javascript: "text-yellow-400/70 border-yellow-500/20 bg-yellow-500/[0.04]",
  typescript: "text-blue-400/70 border-blue-500/20 bg-blue-500/[0.04]",
  jsx: "text-cyan-400/70 border-cyan-500/20 bg-cyan-500/[0.04]",
  tsx: "text-cyan-400/70 border-cyan-500/20 bg-cyan-500/[0.04]",
  python: "text-green-400/70 border-green-500/20 bg-green-500/[0.04]",
  rust: "text-orange-400/70 border-orange-500/20 bg-orange-500/[0.04]",
  bash: "text-violet-400/70 border-violet-500/20 bg-violet-500/[0.04]",
  sh: "text-violet-400/70 border-violet-500/20 bg-violet-500/[0.04]",
  html: "text-rose-400/70 border-rose-500/20 bg-rose-500/[0.04]",
  css: "text-indigo-400/70 border-indigo-500/20 bg-indigo-500/[0.04]",
  json: "text-amber-400/70 border-amber-500/20 bg-amber-500/[0.04]",
  sql: "text-sky-400/70 border-sky-500/20 bg-sky-500/[0.04]",
  go: "text-teal-400/70 border-teal-500/20 bg-teal-500/[0.04]",
  java: "text-red-400/70 border-red-500/20 bg-red-500/[0.04]",
};

const customStyle = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: "transparent",
    margin: 0,
    padding: "1rem",
    fontSize: "0.75rem",
    lineHeight: "1.6",
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  },
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    background: "transparent",
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: "0.75rem",
  },
};

export function CodeBlock({ code, language = "text", inline = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  if (inline) {
    return (
      <code className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] font-mono-code text-[0.8em] text-violet-300/90">
        {code}
      </code>
    );
  }

  const lang = language.toLowerCase().replace(/^language-/, "");
  const displayLang = lang || "text";
  const isPreviewable = ["html", "svg"].includes(lang);
  const lineCount = code.split("\n").length;
  const isLong = lineCount > 20;
  const langColor = LANG_COLORS[lang] || "text-white/30 border-white/[0.06] bg-white/[0.02]";

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="my-3 rounded-lg border border-white/[0.07] overflow-hidden bg-[#0a0a0a]"
      >
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.06] bg-white/[0.02]">
          {/* Traffic light dots */}
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/40 border border-red-500/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40 border border-yellow-500/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/40 border border-green-500/20" />
          </div>

          <div className="w-px h-3.5 bg-white/[0.06] mx-1" />

          {/* Language badge */}
          <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-mono font-semibold tracking-wide ${langColor}`}>
            {LANG_ICONS[lang] || <Code2 size={10} />}
            {displayLang.toUpperCase()}
          </div>

          <span className="text-[10px] text-white/15 font-mono ml-0.5">{lineCount} lines</span>

          <div className="flex items-center gap-1 ml-auto">
            {isPreviewable && (
              <motion.button
                onClick={() => setPreviewOpen(true)}
                whileHover={{ backgroundColor: "rgba(139,92,246,0.12)" }}
                whileTap={{ scale: 0.93 }}
                className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-violet-400/70 hover:text-violet-300 border border-transparent hover:border-violet-500/20 transition-all font-mono"
              >
                <Play size={9} /> Preview
              </motion.button>
            )}
            {isLong && (
              <motion.button
                onClick={() => setCollapsed(!collapsed)}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                whileTap={{ scale: 0.93 }}
                className="p-1.5 rounded text-white/25 hover:text-white/55 transition-colors"
              >
                {collapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
              </motion.button>
            )}
            <motion.button
              onClick={handleCopy}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
              whileTap={{ scale: 0.93 }}
              className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-white/30 hover:text-white/60 transition-all font-mono border border-transparent hover:border-white/[0.06]"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span key="ok" initial={{ scale: 0.7 }} animate={{ scale: 1 }} className="flex items-center gap-1 text-green-400">
                    <Check size={10} /> Copied
                  </motion.span>
                ) : (
                  <motion.span key="cp" initial={{ scale: 0.7 }} animate={{ scale: 1 }} className="flex items-center gap-1">
                    <Copy size={10} /> Copy
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Code */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className={`overflow-x-auto ${isLong ? "max-h-96" : ""} scrollbar-thin scrollbar-thumb-violet scrollbar-track-transparent`}>
                <SyntaxHighlighter
                  language={lang || "text"}
                  style={customStyle}
                  showLineNumbers={lineCount > 4}
                  lineNumberStyle={{
                    color: "rgba(255,255,255,0.12)",
                    fontSize: "0.65rem",
                    minWidth: "2.5rem",
                    userSelect: "none",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                  wrapLines={false}
                  customStyle={{
                    background: "transparent",
                    margin: 0,
                  }}
                >
                  {code}
                </SyntaxHighlighter>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {collapsed && (
          <motion.button
            onClick={() => setCollapsed(false)}
            className="w-full py-2 text-[11px] text-white/20 hover:text-white/45 font-mono transition-colors text-center"
          >
            Show {lineCount} lines
          </motion.button>
        )}
      </motion.div>

      {isPreviewable && (
        <LivePreviewModal
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          code={code}
          language={lang}
        />
      )}
    </>
  );
}
