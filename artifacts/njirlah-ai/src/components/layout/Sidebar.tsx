import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageSquare, Trash2, ChevronLeft, ChevronRight, Key, LogOut } from "lucide-react";
import { useChatStore } from "@/store/chat-store";
import { useApiKeyStore } from "@/store/api-key-store";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface SidebarProps {
  onOpenApiKey: () => void;
}

export function Sidebar({ onOpenApiKey }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { chats, activeChatId, createChat, setActiveChat, deleteChat } = useChatStore();
  const { hasKey, removeKey } = useApiKeyStore();

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 280 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative flex flex-col h-full backdrop-blur-2xl bg-white/5 border-r border-white/10 shadow-2xl overflow-hidden flex-shrink-0"
    >
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2"
            >
              <span className="text-lg font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent font-space-grotesk">
                NJIRLAH AI
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <div className="p-3 border-b border-white/10">
        <button
          onClick={() => createChat()}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 hover:border-purple-400/50 text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-200 group"
        >
          <Plus size={16} className="flex-shrink-0 group-hover:rotate-90 transition-transform duration-200" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium whitespace-nowrap"
              >
                Chat Baru
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
        {chats.map((chat) => (
          <motion.div
            key={chat.id}
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`group relative flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
              activeChatId === chat.id
                ? "bg-purple-500/20 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                : "hover:bg-white/5 border border-transparent"
            }`}
            onClick={() => setActiveChat(chat.id)}
          >
            <MessageSquare size={15} className="flex-shrink-0 text-purple-400" />
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm text-white truncate">{chat.title}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {formatDistanceToNow(chat.createdAt, { addSuffix: true, locale: id })}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            {!collapsed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 hover:text-red-400 text-gray-500 transition-all"
              >
                <Trash2 size={13} />
              </button>
            )}
          </motion.div>
        ))}
        {chats.length === 0 && !collapsed && (
          <div className="text-center text-gray-500 text-sm py-8">
            Belum ada chat. Mulai yang baru!
          </div>
        )}
      </div>

      <div className="p-3 border-t border-white/10 space-y-2">
        {!collapsed && (
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition-all ${
              hasKey
                ? "text-green-400 bg-green-500/10 border border-green-500/20"
                : "text-yellow-400 bg-yellow-500/10 border border-yellow-500/20"
            }`}
            onClick={onOpenApiKey}
          >
            <Key size={14} />
            <span className="truncate">{hasKey ? "🔑 OpenRouter Terhubung" : "🔑 Masukkan API Key"}</span>
          </div>
        )}
        {hasKey && (
          <button
            onClick={removeKey}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={14} />
            {!collapsed && <span>Hapus API Key</span>}
          </button>
        )}
      </div>
    </motion.aside>
  );
}
