import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageSquare, Trash2, PanelLeftClose, PanelLeft, Key, LogOut, Download } from "lucide-react";
import { useChatStore } from "@/store/chat-store";
import { useApiKeyStore } from "@/store/api-key-store";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface SidebarProps {
  onOpenApiKey: () => void;
  onExport: () => void;
}

const sidebarVariants = {
  open: { width: 260 },
  closed: { width: 52 },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({ opacity: 1, x: 0, transition: { delay: i * 0.04, duration: 0.25, ease: "easeOut" as const } }),
  exit: { opacity: 0, x: -12, transition: { duration: 0.15 } },
};

export function Sidebar({ onOpenApiKey, onExport }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { chats, activeChatId, createChat, setActiveChat, deleteChat } = useChatStore();
  const { hasKey, removeKey } = useApiKeyStore();

  return (
    <motion.aside
      variants={sidebarVariants}
      animate={collapsed ? "closed" : "open"}
      transition={{ type: "spring", stiffness: 280, damping: 28, mass: 0.8 }}
      className="relative flex flex-col h-full bg-black border-r border-white/[0.06] overflow-hidden flex-shrink-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3.5 border-b border-white/[0.06]">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              key="logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2.5"
            >
              <span className="text-lg leading-none">🦄</span>
              <span className="text-sm font-semibold tracking-tight text-white font-space-grotesk">
                NJIRLAH AI
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          onClick={() => setCollapsed(!collapsed)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          className={`p-1.5 rounded-md text-white/30 hover:text-white/70 hover:bg-white/[0.04] transition-colors ${collapsed ? "mx-auto" : "ml-auto"}`}
        >
          {collapsed ? <PanelLeft size={15} /> : <PanelLeftClose size={15} />}
        </motion.button>
      </div>

      {/* New Chat */}
      <div className="px-2.5 py-2.5 border-b border-white/[0.06]">
        <motion.button
          onClick={() => createChat()}
          whileHover={{ backgroundColor: "rgba(139,92,246,0.08)" }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md border border-white/[0.06] hover:border-violet-500/30 transition-all duration-200 group"
        >
          <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
            <Plus size={14} className="text-violet-400 flex-shrink-0" />
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-xs font-medium text-white/60 group-hover:text-white/90 transition-colors whitespace-nowrap overflow-hidden"
              >
                New Chat
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto py-1.5 scrollbar-thin scrollbar-thumb-violet scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {chats.map((chat, i) => (
            <motion.div
              key={chat.id}
              custom={i}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              className={`group relative mx-2 mb-0.5 flex items-center gap-2.5 px-2.5 py-2 rounded-md cursor-pointer transition-all duration-150 ${
                activeChatId === chat.id
                  ? "bg-white/[0.06] border border-white/[0.08] text-white"
                  : "hover:bg-white/[0.03] text-white/40 hover:text-white/70 border border-transparent"
              }`}
              onClick={() => setActiveChat(chat.id)}
            >
              <MessageSquare size={13} className={`flex-shrink-0 ${activeChatId === chat.id ? "text-violet-400" : "text-white/25"}`} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 min-w-0"
                  >
                    <p className="text-xs truncate font-medium">{chat.title}</p>
                    <p className="text-[10px] text-white/25 truncate mt-0.5">
                      {formatDistanceToNow(chat.createdAt, { addSuffix: true, locale: id })}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              {!collapsed && (
                <motion.button
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1, color: "#f87171" }}
                  onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-white/25 transition-all flex-shrink-0"
                >
                  <Trash2 size={11} />
                </motion.button>
              )}
              {activeChatId === chat.id && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-violet-400 rounded-full"
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {chats.length === 0 && !collapsed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[11px] text-white/20 text-center py-8 px-4"
          >
            Belum ada chat
          </motion.p>
        )}
      </div>

      {/* Footer actions */}
      <div className="px-2.5 py-2.5 border-t border-white/[0.06] space-y-1">
        {!collapsed && (
          <motion.button
            onClick={onExport}
            whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            <Download size={13} />
            <span>Export Chat</span>
          </motion.button>
        )}
        <motion.button
          onClick={onOpenApiKey}
          whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
          whileTap={{ scale: 0.97 }}
          className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
            hasKey ? "text-violet-400/70 hover:text-violet-400" : "text-amber-400/70 hover:text-amber-400"
          } ${collapsed ? "justify-center" : ""}`}
        >
          <Key size={13} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                {hasKey ? "OpenRouter Connected" : "Add API Key"}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
        {hasKey && (
          <motion.button
            onClick={removeKey}
            whileHover={{ backgroundColor: "rgba(239,68,68,0.05)" }}
            whileTap={{ scale: 0.97 }}
            className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs text-white/25 hover:text-red-400 transition-colors ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut size={13} />
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Remove Key
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </div>
    </motion.aside>
  );
}
