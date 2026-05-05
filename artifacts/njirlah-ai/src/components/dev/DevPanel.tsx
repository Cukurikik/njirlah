import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2, Terminal, FolderTree, Play, RefreshCw, X, ChevronRight,
  ChevronDown, File, Folder, FolderOpen, Copy, Check, Maximize2,
  Minimize2, FileCode, FileJson, FileText, Columns2, Eye,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────── */

type TabId = "files" | "editor" | "terminal" | "preview";

interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  content?: string;
  language?: string;
  expanded?: boolean;
}

/* ─── Static data ────────────────────────────────────── */

const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Live Preview</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; }
    body {
      font-family: 'Inter', system-ui, sans-serif;
      background: #050505;
      color: #e2e8f0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 24px;
      padding: 32px;
    }
    h1 { font-size: 2.5rem; font-weight: 800; letter-spacing: -0.02em;
         background: linear-gradient(135deg, #a78bfa, #60a5fa);
         -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    p  { color: #94a3b8; font-size: 1rem; text-align: center; max-width: 360px; line-height: 1.6; }
    button {
      padding: 10px 28px; border-radius: 8px; border: none; cursor: pointer;
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      color: #fff; font-size: 0.9rem; font-weight: 600;
      transition: opacity 0.2s; letter-spacing: 0.02em;
    }
    button:hover { opacity: 0.85; }
    #counter { font-size: 3rem; font-weight: 900; color: #a78bfa; }
  </style>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>Edit this HTML in the editor on the left and watch it update live.</p>
  <div id="counter">0</div>
  <button onclick="document.getElementById('counter').textContent = +document.getElementById('counter').textContent + 1">
    Click Me
  </button>
</body>
</html>`;

const INITIAL_FILES: FileNode[] = [
  {
    name: "src", type: "folder", expanded: true, children: [
      {
        name: "index.html", type: "file", language: "html",
        content: DEFAULT_HTML,
      },
      {
        name: "App.tsx", type: "file", language: "tsx",
        content: `import { useState } from "react";\n\nexport default function App() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white gap-8">\n      <h1 className="text-4xl font-bold">Hello World</h1>\n      <button\n        onClick={() => setCount(c => c + 1)}\n        className="px-6 py-3 bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"\n      >\n        Count: {count}\n      </button>\n    </div>\n  );\n}`,
      },
      {
        name: "index.css", type: "file", language: "css",
        content: `@import "tailwindcss";\n\nbody {\n  margin: 0;\n  font-family: 'Inter', sans-serif;\n  background: #000;\n  color: #fff;\n}`,
      },
    ],
  },
  {
    name: "public", type: "folder", children: [
      {
        name: "favicon.svg", type: "file", language: "svg",
        content: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">\n  <circle cx="20" cy="20" r="18" fill="#7c3aed"/>\n  <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle"\n    fill="white" font-size="20" font-family="monospace" font-weight="bold">N</text>\n</svg>`,
      },
    ],
  },
  {
    name: "package.json", type: "file", language: "json",
    content: `{\n  "name": "my-app",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.0.0",\n    "react-dom": "^18.0.0",\n    "tailwindcss": "^4.0.0"\n  },\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build"\n  }\n}`,
  },
  {
    name: "tsconfig.json", type: "file", language: "json",
    content: `{\n  "compilerOptions": {\n    "target": "ES2020",\n    "lib": ["ES2020", "DOM"],\n    "jsx": "react-jsx",\n    "strict": true,\n    "moduleResolution": "bundler"\n  }\n}`,
  },
];

const TERMINAL_LINES = [
  { type: "system", text: "NJIRLAH AI Dev Terminal v1.0.0" },
  { type: "system", text: "Type commands to interact with your project" },
  { type: "info",   text: "────────────────────────────────────" },
  { type: "prompt", text: "$ pnpm install" },
  { type: "output", text: "Packages: +342" },
  { type: "output", text: "Progress: resolved 342, reused 340, downloaded 2" },
  { type: "success",text: "Done in 1.8s" },
  { type: "prompt", text: "$ pnpm run dev" },
  { type: "success",text: "VITE v7.0.0  ready in 312ms" },
  { type: "output", text: "  ➜  Local:   http://localhost:5173/" },
  { type: "output", text: "  ➜  Network: http://172.31.x.x:5173/" },
];

const FILE_ICONS: Record<string, { icon: React.ReactNode; color: string }> = {
  tsx:  { icon: <FileCode size={11} />, color: "text-cyan-400/70" },
  ts:   { icon: <FileCode size={11} />, color: "text-blue-400/70" },
  jsx:  { icon: <FileCode size={11} />, color: "text-yellow-400/70" },
  js:   { icon: <FileCode size={11} />, color: "text-yellow-400/70" },
  css:  { icon: <FileText size={11} />, color: "text-indigo-400/70" },
  html: { icon: <FileText size={11} />, color: "text-rose-400/70" },
  svg:  { icon: <FileText size={11} />, color: "text-pink-400/70" },
  json: { icon: <FileJson size={11} />, color: "text-amber-400/70" },
  md:   { icon: <FileText size={11} />, color: "text-white/40" },
};

function getFileIcon(name: string) {
  const ext = name.split(".").pop() ?? "";
  return FILE_ICONS[ext] ?? { icon: <File size={11} />, color: "text-white/30" };
}

/* ─── Helpers ────────────────────────────────────────── */

function buildPreviewDoc(content: string, language?: string): string {
  const lang = language ?? "";
  const isHtml = ["html", "svg"].includes(lang);
  const body = isHtml ? content : `<pre style="padding:16px;font-family:'JetBrains Mono',monospace;font-size:12px;line-height:1.6;color:#e2e8f0;white-space:pre-wrap;word-break:break-all;">${content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; background: #050505; color: #e2e8f0;
         font-family: system-ui, sans-serif; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.4); border-radius: 2px; }
</style>
</head>
<body>${body}</body>
</html>`;
}

/* ─── FileTreeNode ───────────────────────────────────── */

function FileTreeNode({
  node, depth = 0, onSelect, selectedFile,
}: {
  node: FileNode; depth?: number;
  onSelect: (n: FileNode) => void; selectedFile?: string;
}) {
  const [expanded, setExpanded] = useState(node.expanded ?? false);
  const { icon, color } = getFileIcon(node.name);

  if (node.type === "folder") {
    return (
      <div>
        <motion.button
          onClick={() => setExpanded(!expanded)}
          whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
          className="w-full flex items-center gap-1.5 py-1 text-left rounded text-[11px] text-white/45 hover:text-white/70 transition-colors"
          style={{ paddingLeft: `${8 + depth * 14}px` }}
        >
          <span className="text-white/25 flex-shrink-0">
            {expanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
          </span>
          <span className="text-yellow-400/50 flex-shrink-0">
            {expanded ? <FolderOpen size={11} /> : <Folder size={11} />}
          </span>
          <span className="font-medium truncate">{node.name}</span>
        </motion.button>
        <AnimatePresence>
          {expanded && node.children && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.14 }}
              className="overflow-hidden"
            >
              {node.children.map((c) => (
                <FileTreeNode key={c.name} node={c} depth={depth + 1}
                  onSelect={onSelect} selectedFile={selectedFile} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  const isSelected = selectedFile === node.name;
  return (
    <motion.button
      onClick={() => onSelect(node)}
      whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
      animate={isSelected ? { backgroundColor: "rgba(139,92,246,0.08)" } : {}}
      className={`w-full flex items-center gap-1.5 py-1 text-left rounded text-[11px] transition-colors ${
        isSelected ? "text-violet-300 border-l border-violet-500/40" : "text-white/40 hover:text-white/65"
      }`}
      style={{ paddingLeft: `${8 + depth * 14}px` }}
    >
      <span className={`flex-shrink-0 ${color}`}>{icon}</span>
      <span className="truncate">{node.name}</span>
    </motion.button>
  );
}

/* ─── CodeEditor ─────────────────────────────────────── */

function CodeEditor({
  content, language, onChange, compact = false,
}: {
  content: string; language?: string;
  onChange: (v: string) => void; compact?: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumRef  = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const lines = content.split("\n");

  const syncScroll = () => {
    if (textareaRef.current && lineNumRef.current) {
      lineNumRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const el = e.currentTarget;
    const start = el.selectionStart;
    const end   = el.selectionEnd;
    const next  = content.substring(0, start) + "  " + content.substring(end);
    onChange(next);
    requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = start + 2; });
  };

  return (
    <div className="flex flex-col h-full">
      {/* toolbar */}
      {!compact && (
        <div className="flex items-center gap-2 px-3 py-1.5 border-b border-white/[0.05] bg-white/[0.01] flex-shrink-0">
          <span className="text-[9px] font-mono text-white/20 tracking-widest uppercase">{language ?? "text"}</span>
          <span className="text-[9px] font-mono text-white/15 ml-auto">{lines.length} lines</span>
          <motion.button
            onClick={handleCopy} whileTap={{ scale: 0.93 }}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-white/25 hover:text-white/55 hover:bg-white/[0.04] transition-all border border-transparent hover:border-white/[0.06]"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span key="ok" initial={{ scale: 0.7 }} animate={{ scale: 1 }} className="flex items-center gap-1 text-green-400">
                  <Check size={9} /> Copied
                </motion.span>
              ) : (
                <motion.span key="cp" initial={{ scale: 0.7 }} animate={{ scale: 1 }} className="flex items-center gap-1">
                  <Copy size={9} /> Copy
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      )}

      {/* body */}
      <div className="flex-1 overflow-hidden flex">
        {/* line numbers */}
        <div
          ref={lineNumRef}
          className="flex-shrink-0 w-9 overflow-hidden bg-white/[0.01] border-r border-white/[0.04] py-3 select-none"
          style={{ overflowY: "hidden" }}
        >
          {lines.map((_, i) => (
            <div key={i} className="h-[1.45rem] flex items-center justify-end pr-2 text-[10px] font-mono text-white/12 leading-none">
              {i + 1}
            </div>
          ))}
        </div>
        {/* textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleTab}
          onScroll={syncScroll}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className="flex-1 resize-none bg-transparent text-[11px] font-mono text-white/75 leading-[1.45rem] px-3 py-3 focus:outline-none scrollbar-thin scrollbar-thumb-violet scrollbar-track-transparent overflow-auto"
          style={{ tabSize: 2 }}
        />
      </div>
    </div>
  );
}

/* ─── LivePreviewPane ────────────────────────────────── */

function LivePreviewPane({
  srcDoc, loading,
}: { srcDoc: string; loading: boolean }) {
  return (
    <div className="relative flex-1 overflow-hidden">
      {loading && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 z-10 flex items-center justify-center bg-[#050505]/60 backdrop-blur-sm pointer-events-none"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-violet-500/30 border-t-violet-400 rounded-full"
          />
        </motion.div>
      )}
      <iframe
        srcDoc={srcDoc}
        sandbox="allow-scripts allow-same-origin allow-forms"
        className="w-full h-full border-0"
        title="Live Preview"
      />
    </div>
  );
}

/* ─── DragDivider ────────────────────────────────────── */

function DragDivider({ onDrag }: { onDrag: (dx: number) => void }) {
  const dragging = useRef(false);
  const lastX    = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    lastX.current = e.clientX;
    e.preventDefault();
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      onDrag(e.clientX - lastX.current);
      lastX.current = e.clientX;
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [onDrag]);

  return (
    <div
      onMouseDown={onMouseDown}
      className="relative flex-shrink-0 w-[5px] cursor-col-resize group select-none"
    >
      <div className="absolute inset-y-0 left-[2px] w-[1px] bg-white/[0.06] group-hover:bg-violet-500/40 transition-colors" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-[3px] opacity-0 group-hover:opacity-100 transition-opacity">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-[3px] h-[3px] rounded-full bg-violet-400/60" />
        ))}
      </div>
    </div>
  );
}

/* ─── TerminalPanel ──────────────────────────────────── */

function TerminalPanel() {
  const [input, setInput] = useState("");
  const [lines, setLines] = useState(TERMINAL_LINES);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;
    setLines((prev) => [
      ...prev,
      { type: "prompt", text: `$ ${cmd}` },
      { type: "output", text: simulateCommand(cmd) },
    ]);
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const lineColor: Record<string, string> = {
    system:  "text-violet-400/60",
    info:    "text-white/20",
    prompt:  "text-white/70",
    output:  "text-white/40",
    success: "text-green-400/70",
    error:   "text-red-400/70",
  };

  return (
    <div className="flex flex-col h-full" onClick={() => inputRef.current?.focus()}>
      <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-violet scrollbar-track-transparent">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`text-[11px] font-mono leading-relaxed whitespace-pre-wrap ${lineColor[line.type] ?? "text-white/40"}`}
          >
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-2 border-t border-white/[0.05] flex-shrink-0 bg-white/[0.01]">
        <span className="text-violet-400/60 font-mono text-[11px] flex-shrink-0 select-none">$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a command…"
          className="flex-1 bg-transparent text-[11px] font-mono text-white/70 placeholder-white/20 focus:outline-none caret-violet-400"
        />
        <span className="text-[10px] font-mono text-white/15 select-none">↵</span>
      </form>
    </div>
  );
}

function simulateCommand(cmd: string): string {
  const c = cmd.toLowerCase().trim();
  if (c === "ls" || c === "ls -la") return "index.html  App.tsx  index.css  package.json  tsconfig.json";
  if (c.startsWith("echo "))       return cmd.slice(5);
  if (c === "pwd")                 return "/workspace/my-app";
  if (c === "node --version")      return "v20.11.0";
  if (c === "pnpm --version")      return "10.0.0";
  if (c === "clear")               return "";
  if (c.startsWith("cat "))        return `[contents of ${cmd.slice(4)}]`;
  return `zsh: command not found: ${cmd}`;
}

/* ─── DevPanel ───────────────────────────────────────── */

interface DevPanelProps {
  open: boolean;
  onClose: () => void;
}

const PANEL_MIN  = 320;
const PANEL_MAX  = 960;
const PANEL_DEFAULT = 520;

const SPLIT_LEFT_MIN  = 180;
const SPLIT_RIGHT_MIN = 160;

export function DevPanel({ open, onClose }: DevPanelProps) {
  const [activeTab,     setActiveTab]    = useState<TabId>("editor");
  const [selectedFile,  setSelectedFile] = useState<FileNode>(INITIAL_FILES[0].children![0]);
  const [editorContent, setEditorContent]= useState<string>(INITIAL_FILES[0].children![0].content ?? "");
  const [splitView,     setSplitView]    = useState(true);
  const [maximized,     setMaximized]    = useState(false);
  const [panelWidth,    setPanelWidth]   = useState(PANEL_DEFAULT);
  const [splitLeft,     setSplitLeft]    = useState(0.5);
  const [previewDoc,    setPreviewDoc]   = useState(() => buildPreviewDoc(INITIAL_FILES[0].children![0].content ?? "", "html"));
  const [previewLoading,setPreviewLoading]=useState(false);

  /* debounced live preview update */
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setPreviewLoading(true);
    debounceRef.current = setTimeout(() => {
      setPreviewDoc(buildPreviewDoc(editorContent, selectedFile?.language));
      setPreviewLoading(false);
    }, 280);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [editorContent, selectedFile?.language]);

  /* panel drag resize */
  const handlePanelDrag = useCallback((dx: number) => {
    setPanelWidth((w) => Math.min(PANEL_MAX, Math.max(PANEL_MIN, w - dx)));
  }, []);

  /* split divider drag */
  const handleSplitDrag = useCallback((dx: number) => {
    setSplitLeft((prev) => {
      const totalPx = panelWidth;
      const newLeftPx = Math.max(SPLIT_LEFT_MIN, Math.min(totalPx - SPLIT_RIGHT_MIN, prev * totalPx + dx));
      return newLeftPx / totalPx;
    });
  }, [panelWidth]);

  const handleSelectFile = (node: FileNode) => {
    setSelectedFile(node);
    setEditorContent(node.content ?? "");
    if (activeTab !== "editor") setActiveTab("editor");
  };

  const TABS: { id: TabId; icon: React.ReactNode; label: string }[] = [
    { id: "files",    icon: <FolderTree size={11} />, label: "Files"    },
    { id: "editor",   icon: <Code2      size={11} />, label: selectedFile?.name ?? "Editor" },
    { id: "terminal", icon: <Terminal   size={11} />, label: "Terminal" },
    { id: "preview",  icon: <Eye        size={11} />, label: "Preview"  },
  ];

  const effectiveWidth = maximized ? "100%" : panelWidth;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: effectiveWidth, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          className="relative flex h-full bg-[#07070a] border-l border-white/[0.06] overflow-hidden flex-shrink-0"
          style={{ minWidth: 0 }}
        >
          {/* Left edge drag-resize handle (only when not maximized) */}
          {!maximized && (
            <DragDivider onDrag={handlePanelDrag} />
          )}

          {/* Main panel */}
          <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">

            {/* ── Header bar ── */}
            <div className="flex items-center gap-1.5 px-2.5 py-2 border-b border-white/[0.06] flex-shrink-0 bg-black/50">
              {/* Traffic lights */}
              <div className="flex items-center gap-1.5 mr-1.5">
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.2 }}
                  className="w-3 h-3 rounded-full bg-red-500/70 border border-red-600/40 hover:bg-red-500 transition-colors"
                />
                <div className="w-3 h-3 rounded-full bg-yellow-500/35 border border-yellow-600/25" />
                <motion.button
                  onClick={() => setMaximized(!maximized)}
                  whileHover={{ scale: 1.2 }}
                  className="w-3 h-3 rounded-full bg-green-500/40 border border-green-600/30 hover:bg-green-500/70 transition-colors"
                />
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-0.5 flex-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                {TABS.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); if (splitView) setSplitView(false); }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-1.5 px-2.5 py-[5px] rounded text-[10px] font-mono whitespace-nowrap transition-all flex-shrink-0 ${
                      activeTab === tab.id && !splitView
                        ? "bg-violet-500/15 text-violet-300 border border-violet-500/25"
                        : "text-white/25 hover:text-white/55 hover:bg-white/[0.03] border border-transparent"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Right actions */}
              <div className="flex items-center gap-1 ml-1 flex-shrink-0">
                {/* Split toggle */}
                <motion.button
                  onClick={() => setSplitView(!splitView)}
                  whileHover={{ backgroundColor: splitView ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.05)" }}
                  whileTap={{ scale: 0.93 }}
                  animate={{
                    borderColor: splitView ? "rgba(139,92,246,0.35)" : "rgba(255,255,255,0.07)",
                    color: splitView ? "rgba(167,139,250,0.9)" : "rgba(255,255,255,0.28)",
                    backgroundColor: splitView ? "rgba(139,92,246,0.08)" : "transparent",
                  }}
                  className="flex items-center gap-1 px-2 py-[5px] rounded text-[10px] font-mono border transition-all"
                  title="Toggle split editor/preview"
                >
                  <Columns2 size={11} />
                  <span>Split</span>
                </motion.button>

                <motion.button
                  onClick={() => setMaximized(!maximized)}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                  whileTap={{ scale: 0.93 }}
                  className="p-1.5 rounded text-white/25 hover:text-white/55 transition-colors"
                  title={maximized ? "Restore" : "Maximize"}
                >
                  {maximized ? <Minimize2 size={11} /> : <Maximize2 size={11} />}
                </motion.button>

                <motion.button
                  onClick={onClose}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                  whileTap={{ scale: 0.93 }}
                  className="p-1.5 rounded text-white/25 hover:text-white/55 transition-colors"
                >
                  <X size={12} />
                </motion.button>
              </div>
            </div>

            {/* ── Status bar ── */}
            <div className="flex items-center gap-3 px-3 py-[3px] border-b border-white/[0.04] bg-white/[0.005] flex-shrink-0">
              <div className="flex items-center gap-1.5">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-green-400"
                  animate={{ opacity: [0.45, 1, 0.45] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                />
                <span className="text-[9px] font-mono text-white/18 tracking-widest uppercase">
                  Dev Server · localhost:5173
                </span>
              </div>
              {splitView && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-center gap-1 ml-2"
                >
                  <motion.div
                    className="w-1 h-1 rounded-full bg-violet-400"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  />
                  <span className="text-[9px] font-mono text-violet-400/50">live</span>
                </motion.div>
              )}
              <span className="ml-auto text-[9px] font-mono text-white/15">
                {selectedFile?.language?.toUpperCase() ?? "TEXT"} · {editorContent.split("\n").length} lines
              </span>
            </div>

            {/* ── Content area ── */}
            <div className="flex-1 overflow-hidden">
              {splitView ? (
                /* ── SPLIT VIEW ── */
                <div className="flex h-full overflow-hidden">
                  {/* Left: editor */}
                  <div
                    className="flex flex-col overflow-hidden flex-shrink-0"
                    style={{ width: `${splitLeft * 100}%` }}
                  >
                    {/* Split editor header */}
                    <div className="flex items-center gap-2 px-3 py-1.5 border-b border-white/[0.05] border-r border-r-white/[0.04] bg-white/[0.01] flex-shrink-0">
                      <Code2 size={10} className="text-violet-400/50" />
                      <span className="text-[9px] font-mono text-white/30 truncate">{selectedFile?.name}</span>
                      <span className="ml-auto text-[9px] font-mono text-white/15">{editorContent.split("\n").length}L</span>
                    </div>
                    <div className="flex-1 overflow-hidden border-r border-white/[0.04]">
                      <CodeEditor
                        content={editorContent}
                        language={selectedFile?.language}
                        onChange={setEditorContent}
                        compact
                      />
                    </div>
                  </div>

                  {/* Drag divider */}
                  <DragDivider onDrag={handleSplitDrag} />

                  {/* Right: live preview */}
                  <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                    {/* Preview header */}
                    <div className="flex items-center gap-2 px-3 py-1.5 border-b border-white/[0.05] bg-white/[0.01] flex-shrink-0">
                      <Eye size={10} className="text-violet-400/50" />
                      <span className="text-[9px] font-mono text-white/30">Live Preview</span>
                      <AnimatePresence>
                        {previewLoading && (
                          <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="ml-1"
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                            >
                              <RefreshCw size={9} className="text-violet-400/60" />
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <span className="ml-auto text-[9px] font-mono text-white/12">sandbox</span>
                    </div>
                    <LivePreviewPane srcDoc={previewDoc} loading={previewLoading} />
                  </div>
                </div>
              ) : (
                /* ── SINGLE TAB VIEW ── */
                <AnimatePresence mode="wait">
                  {activeTab === "files" && (
                    <motion.div
                      key="files"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.14 }}
                      className="h-full overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-violet scrollbar-track-transparent"
                    >
                      <div className="px-3 pb-2">
                        <p className="text-[9px] font-mono text-white/18 tracking-[0.18em] uppercase">
                          Explorer
                        </p>
                      </div>
                      {INITIAL_FILES.map((node) => (
                        <FileTreeNode key={node.name} node={node}
                          onSelect={handleSelectFile} selectedFile={selectedFile?.name} />
                      ))}
                    </motion.div>
                  )}

                  {activeTab === "editor" && (
                    <motion.div
                      key={`ed-${selectedFile?.name}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12 }}
                      className="h-full"
                    >
                      <CodeEditor
                        content={editorContent}
                        language={selectedFile?.language}
                        onChange={setEditorContent}
                      />
                    </motion.div>
                  )}

                  {activeTab === "terminal" && (
                    <motion.div
                      key="term"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.14 }}
                      className="h-full"
                    >
                      <TerminalPanel />
                    </motion.div>
                  )}

                  {activeTab === "preview" && (
                    <motion.div
                      key="prev"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.14 }}
                      className="h-full flex flex-col"
                    >
                      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-white/[0.05] flex-shrink-0">
                        <span className="text-[9px] font-mono text-white/25">
                          {selectedFile?.name} · Live Preview
                        </span>
                        <AnimatePresence>
                          {previewLoading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                              <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}>
                                <RefreshCw size={9} className="text-violet-400/50" />
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <span className="ml-auto text-[9px] font-mono text-white/12">iframe sandbox</span>
                      </div>
                      <LivePreviewPane srcDoc={previewDoc} loading={previewLoading} />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
