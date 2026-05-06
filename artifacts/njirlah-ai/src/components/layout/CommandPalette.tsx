import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MessageSquare, Zap, Settings, Key, Download, GitCompare, Sparkles, LayoutGrid } from "lucide-react";

const COMMANDS = [
  { icon: <MessageSquare size={13} />, label: "New Chat", shortcut: "N", action: "new-chat", group: "Chat" },
  { icon: <GitCompare size={13} />, label: "Compare Models", shortcut: "C", action: "compare", group: "Chat" },
  { icon: <Download size={13} />, label: "Export Chat", shortcut: "E", action: "export", group: "Chat" },
  { icon: <LayoutGrid size={13} />, label: "Animation Showcase", shortcut: "", action: "animations", group: "Navigate" },
  { icon: <Key size={13} />, label: "Add API Key", shortcut: "", action: "api-key", group: "Settings" },
  { icon: <Settings size={13} />, label: "Settings", shortcut: ",", action: "settings", group: "Settings" },
  { icon: <Sparkles size={13} />, label: "Custom Instructions", shortcut: "I", action: "instructions", group: "Settings" },
  { icon: <Zap size={13} />, label: "Dev Panel", shortcut: "D", action: "dev-panel", group: "Navigate" },
];

interface CommandPaletteProps {
  onAction: (action: string) => void;
}

export function CommandPalette({ onAction }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        setQuery("");
        setSelected(0);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  const filtered = COMMANDS.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.group.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelected((s) => Math.min(s + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
    if (e.key === "Enter" && filtered[selected]) {
      onAction(filtered[selected].action);
      setOpen(false);
      setQuery("");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-md"
          />
          <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[16vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: -20 }}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              className="w-full max-w-[520px] rounded-2xl border border-white/[0.1] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.8)] pointer-events-auto"
              style={{ background: "#08080F" }}
            >
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
                <Search size={14} className="text-white/25 flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search commands…"
                  className="flex-1 bg-transparent text-sm text-white/80 placeholder-white/20 focus:outline-none font-mono"
                />
                <kbd className="text-[10px] font-mono text-white/15 border border-white/[0.07] px-1.5 py-0.5 rounded">ESC</kbd>
              </div>

              <div className="py-1.5 max-h-80 overflow-y-auto scrollbar-thin">
                {["Chat", "Navigate", "Settings"].map((group) => {
                  const items = filtered.filter((c) => c.group === group);
                  if (!items.length) return null;
                  return (
                    <div key={group}>
                      <p className="px-4 py-1.5 text-[9px] font-mono text-white/18 tracking-[0.2em] uppercase">{group}</p>
                      {items.map((cmd) => {
                        const idx = filtered.indexOf(cmd);
                        const isSelected = idx === selected;
                        return (
                          <motion.button
                            key={cmd.action}
                            onClick={() => { onAction(cmd.action); setOpen(false); setQuery(""); }}
                            onMouseEnter={() => setSelected(idx)}
                            animate={{ backgroundColor: isSelected ? "rgba(139,92,246,0.1)" : "rgba(0,0,0,0)" }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left"
                          >
                            <span className={isSelected ? "text-violet-400" : "text-white/25"}>{cmd.icon}</span>
                            <span className={`flex-1 text-sm font-medium ${isSelected ? "text-white/85" : "text-white/40"}`}>{cmd.label}</span>
                            {cmd.shortcut && (
                              <kbd className="text-[10px] font-mono text-white/18 border border-white/[0.07] px-1.5 py-0.5 rounded">⌘{cmd.shortcut}</kbd>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  );
                })}
                {filtered.length === 0 && (
                  <p className="text-center py-8 text-sm text-white/20 font-mono">No commands found</p>
                )}
              </div>

              <div className="px-4 py-2.5 border-t border-white/[0.04] flex items-center gap-4">
                <span className="text-[10px] text-white/15 font-mono">↑↓ navigate</span>
                <span className="text-[10px] text-white/15 font-mono">↵ run</span>
                <span className="text-[10px] text-white/15 font-mono">esc close</span>
                <span className="ml-auto text-[10px] text-white/10 font-mono">⌘K to open</span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
