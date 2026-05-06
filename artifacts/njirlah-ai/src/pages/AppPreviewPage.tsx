import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AgentWorkflowPanel } from "@/components/preview/AgentWorkflowPanel";
import { AppPreviewPanel } from "@/components/preview/AppPreviewPanel";

type Tab = "workflow" | "preview";

export default function AppPreviewPage() {
  const [activeTab, setActiveTab] = useState<Tab>("workflow");

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ background: "#0a0a10", fontFamily: "Inter, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      <div className="lg:hidden flex flex-col w-full h-full">
        <div
          className="flex items-center border-b border-white/5 flex-shrink-0"
          style={{ background: "#0d0d18" }}
        >
          {(["workflow", "preview"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative flex-1 py-3 text-sm font-medium capitalize transition-colors ${
                activeTab === tab ? "text-white" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-500"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {tab === "workflow" ? "Workflow" : "Preview"}
            </button>
          ))}
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === "workflow" ? (
              <motion.div
                key="workflow"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <AgentWorkflowPanel />
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
                <AppPreviewPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="hidden lg:flex w-full h-full">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex-shrink-0 h-full border-r border-white/5 overflow-hidden"
          style={{ width: "40%" }}
        >
          <AgentWorkflowPanel />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          className="flex-1 h-full overflow-hidden"
        >
          <AppPreviewPanel />
        </motion.div>
      </div>
    </div>
  );
}
