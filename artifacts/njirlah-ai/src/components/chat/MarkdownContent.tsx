import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./CodeBlock";
import type { Components } from "react-markdown";

interface MarkdownContentProps {
  content: string;
  isStreaming?: boolean;
}

const components: Components = {
  code({ node, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    const code = String(children).replace(/\n$/, "");
    const isBlock = !!(match || code.includes("\n"));

    if (isBlock) {
      return <CodeBlock code={code} language={match?.[1] || "text"} />;
    }
    return <CodeBlock code={code} inline />;
  },

  pre({ children }) {
    return <>{children}</>;
  },

  h1({ children }) {
    return (
      <h1 className="text-xl font-bold text-white mt-5 mb-2.5 font-space-grotesk tracking-tight border-b border-white/[0.06] pb-2">
        {children}
      </h1>
    );
  },
  h2({ children }) {
    return (
      <h2 className="text-base font-semibold text-white/90 mt-4 mb-2 font-space-grotesk tracking-tight">
        {children}
      </h2>
    );
  },
  h3({ children }) {
    return <h3 className="text-sm font-semibold text-white/85 mt-3 mb-1.5 font-space-grotesk">{children}</h3>;
  },
  h4({ children }) {
    return <h4 className="text-sm font-medium text-white/80 mt-2 mb-1">{children}</h4>;
  },

  p({ children }) {
    return <p className="text-sm text-white/80 leading-relaxed mb-2.5 last:mb-0">{children}</p>;
  },

  ul({ children }) {
    return <ul className="my-2 ml-3 space-y-1 list-none">{children}</ul>;
  },
  ol({ children }) {
    return <ol className="my-2 ml-3 space-y-1 list-decimal list-inside">{children}</ol>;
  },
  li({ children }) {
    return (
      <li className="text-sm text-white/75 leading-relaxed flex items-start gap-2">
        <span className="text-violet-400/60 mt-1.5 flex-shrink-0 text-[8px]">▸</span>
        <span>{children}</span>
      </li>
    );
  },

  blockquote({ children }) {
    return (
      <blockquote className="my-2 pl-3 border-l-2 border-violet-500/40 bg-violet-500/[0.04] rounded-r-md py-2 pr-2">
        <div className="text-sm text-white/55 italic">{children}</div>
      </blockquote>
    );
  },

  strong({ children }) {
    return <strong className="font-semibold text-white/95">{children}</strong>;
  },
  em({ children }) {
    return <em className="italic text-white/70">{children}</em>;
  },

  a({ href, children }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-violet-400 hover:text-violet-300 underline underline-offset-2 decoration-violet-500/40 hover:decoration-violet-400 transition-colors"
      >
        {children}
      </a>
    );
  },

  table({ children }) {
    return (
      <div className="my-3 overflow-x-auto rounded-md border border-white/[0.07]">
        <table className="w-full text-xs">{children}</table>
      </div>
    );
  },
  thead({ children }) {
    return <thead className="bg-white/[0.03] border-b border-white/[0.07]">{children}</thead>;
  },
  tbody({ children }) {
    return <tbody className="divide-y divide-white/[0.04]">{children}</tbody>;
  },
  tr({ children }) {
    return <tr className="hover:bg-white/[0.02] transition-colors">{children}</tr>;
  },
  th({ children }) {
    return (
      <th className="px-3 py-2 text-left text-[10px] font-semibold text-white/40 uppercase tracking-wider font-mono">
        {children}
      </th>
    );
  },
  td({ children }) {
    return <td className="px-3 py-2 text-white/65">{children}</td>;
  },

  hr() {
    return <hr className="my-4 border-white/[0.07]" />;
  },
};

export function MarkdownContent({ content, isStreaming }: MarkdownContentProps) {
  return (
    <div className="markdown-body min-w-0">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
      {isStreaming && (
        <span className="inline-block w-[2px] h-3.5 bg-violet-400 ml-0.5 align-middle cursor-blink rounded-full" />
      )}
    </div>
  );
}
