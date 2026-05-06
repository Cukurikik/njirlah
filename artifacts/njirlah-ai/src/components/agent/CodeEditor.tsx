import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import xml from "react-syntax-highlighter/dist/esm/languages/hljs/xml";
import css from "react-syntax-highlighter/dist/esm/languages/hljs/css";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import { getFileLanguage } from "@/lib/build-preview-html";
import type { AgentFileEntry } from "@/store/agent-store";

// Register languages
SyntaxHighlighter.registerLanguage("javascript", js);
SyntaxHighlighter.registerLanguage("html", xml);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("json", json);

interface CodeEditorProps {
  file: AgentFileEntry | null;
  filename: string | null;
}

export function CodeEditor({ file, filename }: CodeEditorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (file?.status === "streaming" && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [file?.content, file?.status]);

  if (!file || !filename) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-600">
        <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth={1.5} />
          <path d="M8 9l3 3-3 3M13 15h3" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="text-sm text-center px-6">Select a file from the tree to view its code</p>
      </div>
    );
  }

  const lang = getFileLanguage(filename);
  const displayContent = file.content || "";

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-gray-300">{filename}</span>
          {file.status === "streaming" && (
            <motion.span
              className="inline-flex items-center gap-1 text-blue-400 text-[10px]"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <span className="w-1 h-1 rounded-full bg-blue-400" />
              streaming
            </motion.span>
          )}
          {file.status === "done" && (
            <span className="inline-flex items-center gap-1 text-green-400 text-[10px]">
              <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5">
                <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              done
            </span>
          )}
        </div>
        <span className="text-gray-600 text-[10px] font-mono uppercase">{lang}</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-auto">
        {displayContent ? (
          <SyntaxHighlighter
            language={lang === "tsx" || lang === "jsx" ? "javascript" : lang}
            style={atomDark}
            showLineNumbers
            lineNumberStyle={{ color: "#374151", fontSize: "11px", minWidth: "2.5em" }}
            customStyle={{
              margin: 0,
              padding: "16px",
              background: "transparent",
              fontSize: "12px",
              lineHeight: "1.6",
              height: "100%",
              minHeight: "100%",
            }}
            wrapLines
          >
            {displayContent}
          </SyntaxHighlighter>
        ) : (
          <div className="p-4 text-gray-600 text-xs font-mono">
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              ▋
            </motion.span>
          </div>
        )}
      </div>
    </div>
  );
}
