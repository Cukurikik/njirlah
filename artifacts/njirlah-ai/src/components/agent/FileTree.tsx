import { motion, AnimatePresence } from "framer-motion";
import type { AgentFile } from "@/types/agent-types";

function FileIcon({ filename }: { filename: string }) {
  const ext = filename.split(".").pop() ?? "";
  const colors: Record<string, string> = {
    html: "#e34c26",
    css: "#264de4",
    js: "#f7df1e",
    jsx: "#61dafb",
    ts: "#3178c6",
    tsx: "#61dafb",
    json: "#8bc34a",
    md: "#78909c",
  };
  const color = colors[ext] ?? "#9e9e9e";
  return (
    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 flex-shrink-0">
      <path
        d="M4 1h6l3 3v10a1 1 0 01-1 1H4a1 1 0 01-1-1V2a1 1 0 011-1z"
        stroke={color}
        strokeWidth={1.2}
        fill={color + "22"}
      />
      <path d="M10 1v4h3" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <text x="4" y="12" fontSize="4" fill={color} fontFamily="monospace" fontWeight="bold">
        {ext.slice(0, 3).toUpperCase()}
      </text>
    </svg>
  );
}

interface FileTreeProps {
  files: Record<string, AgentFile>;
  fileOrder: string[];
  activeFile: string | null;
  onSelectFile: (filename: string) => void;
}

export function FileTree({ files, fileOrder, activeFile, onSelectFile }: FileTreeProps) {
  if (fileOrder.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-600">
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
          <path d="M3 7a2 2 0 012-2h5l2 2h7a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth={1.5} />
        </svg>
        <span className="text-xs text-center px-3">Files will appear here as the agent generates code</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5 p-2">
      <AnimatePresence>
        {fileOrder.map((filename, i) => {
          const file = files[filename];
          if (!file) return null;
          const isActive = activeFile === filename;
          return (
            <motion.button
              key={filename}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
              onClick={() => onSelectFile(filename)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors group ${
                isActive
                  ? "bg-blue-500/10 border-l-2 border-blue-500 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-200 border-l-2 border-transparent"
              }`}
            >
              <FileIcon filename={filename} />
              <span className="text-xs font-mono flex-1 truncate">{filename}</span>
              {file.isStreaming && (
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                />
              )}
              {file.isDone && !file.isStreaming && (
                <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 flex-shrink-0 text-green-400">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
