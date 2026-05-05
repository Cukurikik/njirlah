import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2, Terminal, FolderTree, Play, RefreshCw, X, ChevronRight,
  ChevronDown, File, Folder, FolderOpen, Copy, Check, Maximize2,
  Minimize2, Circle, Plus, Trash2, FileCode, FileJson, FileText,
} from "lucide-react";

type TabId = "editor" | "terminal" | "files" | "preview";

interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  content?: string;
  language?: string;
  expanded?: boolean;
}

const INITIAL_FILES: FileNode[] = [
  {
    name: "src", type: "folder", expanded: true, children: [
      { name: "App.tsx", type: "file", language: "tsx", content: `import { useState } from "react";\n\nexport default function App() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white">\n      <h1 className="text-4xl font-bold mb-8">Hello World</h1>\n      <button\n        onClick={() => setCount(c => c + 1)}\n        className="px-6 py-3 bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"\n      >\n        Count: {count}\n      </button>\n    </div>\n  );\n}` },
      { name: "index.css", type: "file", language: "css", content: `@import "tailwindcss";\n\nbody {\n  margin: 0;\n  font-family: 'Inter', sans-serif;\n  background: #000;\n  color: #fff;\n}` },
    ],
  },
  {
    name: "public", type: "folder", children: [
      { name: "index.html", type: "file", language: "html", content: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8"/>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>\n  <title>App</title>\n</head>\n<body>\n  <div id="root"></div>\n</body>\n</html>` },
    ],
  },
  { name: "package.json", type: "file", language: "json", content: `{\n  "name": "my-app",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.0.0",\n    "react-dom": "^18.0.0",\n    "tailwindcss": "^4.0.0"\n  }\n}` },
  { name: "tsconfig.json", type: "file", language: "json", content: `{\n  "compilerOptions": {\n    "target": "ES2020",\n    "lib": ["ES2020", "DOM"],\n    "jsx": "react-jsx",\n    "strict": true,\n    "moduleResolution": "bundler"\n  }\n}` },
];

const TERMINAL_LINES = [
  { type: "system", text: "NJIRLAH AI Dev Terminal v1.0.0" },
  { type: "system", text: "Type commands to interact with your project" },
  { type: "info", text: "─────────────────────────────────" },
  { type: "prompt", text: "$ pnpm install" },
  { type: "output", text: "Packages: +342" },
  { type: "output", text: "Progress: resolved 342, reused 340, downloaded 2" },
  { type: "success", text: "Done in 1.8s" },
  { type: "prompt", text: "$ pnpm run dev" },
  { type: "success", text: "VITE v7.0.0  ready in 312ms" },
  { type: "output", text: "  ➜  Local:   http://localhost:5173/" },
  { type: "output", text: "  ➜  Network: http://172.31.x.x:5173/" },
];

const FILE_ICONS: Record<string, { icon: React.ReactNode; color: string }> = {
  tsx: { icon: <FileCode size={11} />, color: "text-cyan-400/70" },
  ts: { icon: <FileCode size={11} />, color: "text-blue-400/70" },
  jsx: { icon: <FileCode size={11} />, color: "text-yellow-400/70" },
  js: { icon: <FileCode size={11} />, color: "text-yellow-400/70" },
  css: { icon: <FileText size={11} />, color: "text-indigo-400/70" },
  html: { icon: <FileText size={11} />, color: "text-rose-400/70" },
  json: { icon: <FileJson size={11} />, color: "text-amber-400/70" },
  md: { icon: <FileText size={11} />, color: "text-white/40" },
};

function getFileIcon(name: string) {
  const ext = name.split(".").pop() ?? "";
  return FILE_ICONS[ext] ?? { icon: <File size={11} />, color: "text-white/30" };
}

function FileTreeNode({
  node, depth = 0, onSelect, selectedFile,
}: {
  node: FileNode;
  depth?: number;
  onSelect: (node: FileNode) => void;
  selectedFile?: string;
}) {
  const [expanded, setExpanded] = useState(node.expanded ?? false);
  const { icon, color } = getFileIcon(node.name);

  if (node.type === "folder") {
    return (
      <div>
        <motion.button
          onClick={() => setExpanded(!expanded)}
          whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
          className="w-full flex items-center gap-1.5 px-2 py-1 text-left rounded text-[11px] text-white/45 hover:text-white/70 transition-colors"
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
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              {node.children.map((child) => (
                <FileTreeNode key={child.name} node={child} depth={depth + 1} onSelect={onSelect} selectedFile={selectedFile} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <motion.button
      onClick={() => onSelect(node)}
      whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
      animate={selectedFile === node.name ? { backgroundColor: "rgba(139,92,246,0.08)" } : {}}
      className={`w-full flex items-center gap-1.5 px-2 py-1 text-left rounded text-[11px] transition-colors ${
        selectedFile === node.name ? "text-violet-300 border-l border-violet-500/40" : "text-white/40 hover:text-white/65"
      }`}
      style={{ paddingLeft: `${8 + depth * 14}px` }}
    >
      <span className={`flex-shrink-0 ${color}`}>{icon}</span>
      <span className="truncate">{node.name}</span>
    </motion.button>
  );
}

function CodeEditor({ content, language, onChange }: { content: string; language?: string; onChange: (v: string) => void }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const newVal = content.substring(0, start) + "  " + content.substring(end);
      onChange(newVal);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 2;
      });
    }
  };

  const lines = content.split("\n");

  return (
    <div className="flex flex-col h-full">
      {/* Editor toolbar */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-white/[0.05] bg-white/[0.01] flex-shrink-0">
        <span className="text-[9px] font-mono text-white/20 tracking-widest uppercase">{language ?? "text"}</span>
        <span className="text-[9px] font-mono text-white/15 ml-auto">{lines.length} lines</span>
        <motion.button
          onClick={handleCopy}
          whileTap={{ scale: 0.93 }}
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

      {/* Editor body */}
      <div className="flex-1 overflow-hidden relative flex">
        {/* Line numbers */}
        <div className="flex-shrink-0 w-10 overflow-hidden bg-white/[0.01] border-r border-white/[0.04] pt-3 pb-3 select-none">
          {lines.map((_, i) => (
            <div key={i} className="h-[1.45rem] flex items-center justify-end pr-2.5 text-[10px] font-mono text-white/15 leading-none">
              {i + 1}
            </div>
          ))}
        </div>
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleTab}
          spellCheck={false}
          className="flex-1 resize-none bg-transparent text-[11px] font-mono text-white/75 leading-[1.45rem] p-3 focus:outline-none scrollbar-thin scrollbar-thumb-violet scrollbar-track-transparent overflow-auto"
          style={{ tabSize: 2 }}
        />
      </div>
    </div>
  );
}

function TerminalPanel() {
  const [input, setInput] = useState("");
  const [lines, setLines] = useState(TERMINAL_LINES);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const cmd = input.trim();
    setLines((prev) => [
      ...prev,
      { type: "prompt", text: `$ ${cmd}` },
      { type: "output", text: `Command executed: ${cmd}` },
    ]);
    setInput("");
  };

  const lineColor: Record<string, string> = {
    system: "text-violet-400/60",
    info: "text-white/20",
    prompt: "text-white/70",
    output: "text-white/40",
    success: "text-green-400/70",
    error: "text-red-400/70",
  };

  return (
    <div className="flex flex-col h-full">
      {/* Terminal output */}
      <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-violet scrollbar-track-transparent">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={i >= TERMINAL_LINES.length ? { opacity: 0, x: -4 } : {}}
            animate={{ opacity: 1, x: 0 }}
            className={`text-[11px] font-mono leading-relaxed ${lineColor[line.type] ?? "text-white/40"}`}
          >
            {line.text}
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>
      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-2 border-t border-white/[0.05] flex-shrink-0">
        <span className="text-violet-400/60 font-mono text-[11px] flex-shrink-0">$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter command..."
          className="flex-1 bg-transparent text-[11px] font-mono text-white/70 placeholder-white/20 focus:outline-none"
        />
        <button type="submit" className="text-[10px] font-mono text-white/20 hover:text-white/50 transition-colors">
          ↵
        </button>
      </form>
    </div>
  );
}

interface DevPanelProps {
  open: boolean;
  onClose: () => void;
}

export function DevPanel({ open, onClose }: DevPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>("editor");
  const [files, setFiles] = useState<FileNode[]>(INITIAL_FILES);
  const [selectedFile, setSelectedFile] = useState<FileNode>(INITIAL_FILES[0].children![0]);
  const [editorContent, setEditorContent] = useState(INITIAL_FILES[0].children![0].content ?? "");
  const [previewKey, setPreviewKey] = useState(0);
  const [previewHtml, setPreviewHtml] = useState("");
  const [maximized, setMaximized] = useState(false);

  const handleSelectFile = (node: FileNode) => {
    setSelectedFile(node);
    setEditorContent(node.content ?? "");
    setActiveTab("editor");
  };

  const runPreview = useCallback(() => {
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<style>
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; background: #050505; color: #f0f0f0; font-family: system-ui, sans-serif; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.4); border-radius: 2px; }
</style>
</head>
<body>${editorContent}</body>
</html>`;
    setPreviewHtml(html);
    setPreviewKey((k) => k + 1);
    setActiveTab("preview");
  }, [editorContent]);

  const TABS: { id: TabId; icon: React.ReactNode; label: string }[] = [
    { id: "files", icon: <FolderTree size={12} />, label: "Files" },
    { id: "editor", icon: <Code2 size={12} />, label: selectedFile?.name ?? "Editor" },
    { id: "terminal", icon: <Terminal size={12} />, label: "Terminal" },
    { id: "preview", icon: <Play size={12} />, label: "Preview" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: maximized ? "100%" : 480, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative flex flex-col h-full bg-[#060608] border-l border-white/[0.06] overflow-hidden flex-shrink-0"
          style={{ minWidth: open ? (maximized ? "100%" : 480) : 0 }}
        >
          {/* Panel header */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-white/[0.06] flex-shrink-0 bg-black/40">
            {/* Traffic lights */}
            <div className="flex items-center gap-1.5 mr-2">
              <motion.button onClick={onClose} whileHover={{ scale: 1.2 }} className="w-3 h-3 rounded-full bg-red-500/70 border border-red-600/40 hover:bg-red-500 transition-colors" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/40 border border-yellow-600/30" />
              <motion.button onClick={() => setMaximized(!maximized)} whileHover={{ scale: 1.2 }} className="w-3 h-3 rounded-full bg-green-500/40 border border-green-600/30 hover:bg-green-500/70 transition-colors" />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-0.5 flex-1 overflow-x-auto scrollbar-none">
              {TABS.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? "bg-violet-500/15 text-violet-300 border border-violet-500/25"
                      : "text-white/25 hover:text-white/55 hover:bg-white/[0.03]"
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 ml-2 flex-shrink-0">
              {activeTab === "editor" && selectedFile?.language === "html" && (
                <motion.button
                  onClick={runPreview}
                  whileHover={{ backgroundColor: "rgba(139,92,246,0.12)" }}
                  whileTap={{ scale: 0.93 }}
                  className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-violet-400/70 hover:text-violet-300 border border-transparent hover:border-violet-500/20 transition-all font-mono"
                >
                  <Play size={9} /> Run
                </motion.button>
              )}
              <motion.button
                onClick={() => setMaximized(!maximized)}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                className="p-1.5 rounded text-white/25 hover:text-white/55 transition-colors"
              >
                {maximized ? <Minimize2 size={11} /> : <Maximize2 size={11} />}
              </motion.button>
              <motion.button
                onClick={onClose}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                className="p-1.5 rounded text-white/25 hover:text-white/55 transition-colors"
              >
                <X size={12} />
              </motion.button>
            </div>
          </div>

          {/* Status bar */}
          <div className="flex items-center gap-3 px-3 py-1 border-b border-white/[0.04] bg-white/[0.01] flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <motion.div className="w-1.5 h-1.5 rounded-full bg-green-400" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
              <span className="text-[9px] font-mono text-white/20 tracking-widest uppercase">Dev Server · localhost:5173</span>
            </div>
            <span className="ml-auto text-[9px] font-mono text-white/15">{selectedFile?.language?.toUpperCase() ?? "TEXT"}</span>
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === "files" && (
                <motion.div
                  key="files"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.15 }}
                  className="h-full overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-violet scrollbar-track-transparent"
                >
                  <div className="px-3 pb-1.5">
                    <p className="text-[9px] font-mono text-white/20 tracking-[0.18em] uppercase">Explorer</p>
                  </div>
                  {files.map((node) => (
                    <FileTreeNode key={node.name} node={node} onSelect={handleSelectFile} selectedFile={selectedFile?.name} />
                  ))}
                </motion.div>
              )}

              {activeTab === "editor" && (
                <motion.div
                  key={`editor-${selectedFile?.name}`}
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
                  key="terminal"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  <TerminalPanel />
                </motion.div>
              )}

              {activeTab === "preview" && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="h-full flex flex-col"
                >
                  {/* Preview toolbar */}
                  <div className="flex items-center gap-2 px-3 py-1.5 border-b border-white/[0.05] flex-shrink-0">
                    <motion.button
                      onClick={runPreview}
                      whileHover={{ backgroundColor: "rgba(139,92,246,0.1)" }}
                      className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono text-violet-400/60 hover:text-violet-300 transition-all"
                    >
                      <RefreshCw size={9} /> Refresh
                    </motion.button>
                    <span className="text-[9px] font-mono text-white/15 ml-auto">iframe sandbox</span>
                  </div>
                  {previewHtml ? (
                    <iframe
                      key={previewKey}
                      srcDoc={previewHtml}
                      sandbox="allow-scripts allow-same-origin allow-forms"
                      className="flex-1 border-0 w-full"
                      title="Live Preview"
                    />
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
                      <div className="w-10 h-10 rounded-xl border border-white/[0.06] flex items-center justify-center">
                        <Play size={16} className="text-white/20" />
                      </div>
                      <p className="text-[11px] text-white/25 font-mono">Open an HTML file and click Run to preview</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
