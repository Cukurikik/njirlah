import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageSquare, Trash2, PanelLeftClose, PanelLeft, Key, LogOut, Download } from "lucide-react";
import { useChatStore } from "@/store/chat-store";
import { useApiKeyStore } from "@/store/api-key-store";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { UnicornLogo } from "@/components/ui/UnicornLogo";

interface SidebarProps {
  onOpenApiKey: () => void;
  onExport: () => void;
}

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.04, duration: 0.22, ease: "easeOut" as const },
  }),
  exit: { opacity: 0, x: -10, transition: { duration: 0.12 } },
};

export function Sidebar({ onOpenApiKey, onExport }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { chats, activeChatId, createChat, setActiveChat, deleteChat } = useChatStore();
  const { hasKey, removeKey } = useApiKeyStore();

  return (
    <motion.aside
      animate={{ width: collapsed ? 52 : 252 }}
      transition={{ type: "spring", stiffness: 280, damping: 28, mass: 0.8 }}
      className="relative flex flex-col h-full bg-black border-r border-white/[0.06] overflow-hidden flex-shrink-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-white/[0.06] h-12">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              key="logo"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2"
            >
              <UnicornLogo size={20} />
              <span className="text-[11px] font-black tracking-[0.18em] text-white/50 font-orbitron">
                NJIRLAH
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          onClick={() => setCollapsed(!collapsed)}
          whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
          whileTap={{ scale: 0.92 }}
          className={`p-1.5 rounded text-white/25 hover:text-white/60 transition-colors ${collapsed ? "mx-auto" : "ml-auto"}`}
        >
          {collapsed ? <PanelLeft size={14} /> : <PanelLeftClose size={14} />}
        </motion.button>
      </div>

      {/* New Chat */}
      <div className="px-2 py-2 border-b border-white/[0.05]">
        <motion.button
          onClick={() => createChat()}
          whileHover={{ backgroundColor: "rgba(139,92,246,0.07)", borderColor: "rgba(139,92,246,0.25)" }}
          whileTap={{ scale: 0.97 }}
          className={`w-full flex items-center border border-white/[0.06] rounded-md px-2.5 py-2 transition-all group ${collapsed ? "justify-center" : "gap-2.5"}`}
        >
          <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.18 }}>
            <Plus size={13} className="text-violet-400/70 group-hover:text-violet-400 flex-shrink-0 transition-colors" />
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="text-[11px] font-medium text-white/40 group-hover:text-white/70 whitespace-nowrap overflow-hidden transition-colors"
              >
                New Chat
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-violet scrollbar-track-transparent">
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
              onClick={() => setActiveChat(chat.id)}
              className={`group relative mx-2 mb-0.5 flex items-center gap-2 px-2.5 py-2 rounded-md cursor-pointer transition-all duration-150 ${
                activeChatId === chat.id
                  ? "bg-white/[0.05] border border-white/[0.08] text-white"
                  : "hover:bg-white/[0.025] text-white/35 hover:text-white/65 border border-transparent"
              }`}
            >
              {activeChatId === chat.id && (
                <motion.div
                  layoutId="chat-active-bar"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-violet-400 rounded-full"
                />
              )}
              <MessageSquare
                size={12}
                className={`flex-shrink-0 ${activeChatId === chat.id ? "text-violet-400" : "text-white/20"}`}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 min-w-0"
                  >
                    <p className="text-[11px] font-medium truncate">{chat.title}</p>
                    <p className="text-[9px] text-white/20 truncate font-mono">
                      {formatDistanceToNow(chat.createdAt, { addSuffix: true, locale: id })}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              {!collapsed && (
                <motion.button
                  initial={{ opacity: 0 }}
                  whileHover={{ color: "#f87171", opacity: 1 }}
                  onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-white/20 transition-all flex-shrink-0"
                >
                  <Trash2 size={10} />
                </motion.button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {chats.length === 0 && !collapsed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] text-white/15 text-center py-8 px-4 font-mono"
          >
            no chats yet
          </motion.p>
        )}
      </div>

      {/* Footer actions */}
      <div className="px-2 py-2 border-t border-white/[0.05] space-y-0.5">
        {[
          {
            icon: <Download size={12} />,
            label: "Export Chat",
            onClick: onExport,
            className: "text-white/30 hover:text-white/60",
          },
          {
            icon: <Key size={12} />,
            label: hasKey ? "OpenRouter Connected" : "Add API Key",
            onClick: onOpenApiKey,
            className: hasKey ? "text-violet-400/60 hover:text-violet-400" : "text-amber-400/60 hover:text-amber-400",
          },
          ...(hasKey
            ? [{
                icon: <LogOut size={12} />,
                label: "Remove Key",
                onClick: removeKey,
                className: "text-white/20 hover:text-red-400",
              }]
            : []),
        ].map((action) => (
          <motion.button
            key={action.label}
            onClick={action.onClick}
            whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
            whileTap={{ scale: 0.97 }}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] transition-colors ${action.className} ${collapsed ? "justify-center" : ""}`}
          >
            {action.icon}
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap font-mono"
                >
                  {action.label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </motion.aside>
  );
}
