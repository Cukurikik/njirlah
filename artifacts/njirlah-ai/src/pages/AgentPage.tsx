import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AgentCodePanel } from "@/components/agent/AgentCodePanel";
import { LivePreviewPanel } from "@/components/preview/LivePreviewPanel";
import { useAgentStore } from "@/store/agent-store";

type Tab = "code" | "preview";

export default function AgentPage() {
  const [activeTab, setActiveTab] = useState<Tab>("code");
  const { files, fileOrder, isGenerating } = useAgentStore();

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ background: "#0a0a10", fontFamily: "Inter, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
        textarea::-webkit-scrollbar { width: 4px; }
        textarea::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      {/* Mobile: tab switcher */}
      <div className="lg:hidden flex flex-col w-full h-full">
        <div
          className="flex items-center border-b border-white/5 flex-shrink-0"
          style={{ background: "#0d0d18" }}
        >
          {(["code", "preview"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab ? "text-white" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="agent-tab-indicator"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-500"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {tab === "code" ? "Agent Code" : "Live Preview"}
            </button>
          ))}
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === "code" ? (
              <motion.div
                key="code"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <AgentCodePanel />
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <LivePreviewPanel
                  files={files}
                  fileOrder={fileOrder}
                  isGenerating={isGenerating}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Desktop: side-by-side */}
      <div className="hidden lg:flex w-full h-full">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex-shrink-0 h-full border-r border-white/5 overflow-hidden"
          style={{ width: "40%" }}
        >
          <AgentCodePanel />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          className="flex-1 h-full overflow-hidden"
        >
          <LivePreviewPanel
            files={files}
            fileOrder={fileOrder}
            isGenerating={isGenerating}
          />
        </motion.div>
      </div>
    </div>
  );
}
