import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor } from "lucide-react";
import { useApiKeyStore } from "@/store/api-key-store";
import { useChatStore } from "@/store/chat-store";
import { useCompareStore } from "@/store/compare-store";
import { useByokStore } from "@/store/byok-store";
import { Background } from "@/components/layout/Background";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatArea } from "@/components/chat/ChatArea";
import { ChatInput } from "@/components/chat/ChatInput";
import { ApiKeyModal } from "@/components/chat/ApiKeyModal";
import { ExportModal } from "@/components/chat/ExportModal";
import { CustomInstructionsModal } from "@/components/chat/CustomInstructionsModal";
import { SettingsModal } from "@/components/chat/SettingsModal";
import { DevPanel } from "@/components/dev/DevPanel";
import { AppsPanel, useHasApp } from "@/components/dev/AppsPanel";
import { AppearanceApplier } from "@/components/layout/AppearanceApplier";
import { CompareView } from "@/components/compare/CompareView";
import { CursorTrail } from "@/components/layout/CursorTrail";
import { CommandPalette } from "@/components/layout/CommandPalette";
import AnimationsPage from "@/pages/AnimationsPage";
import AppPreviewPage from "@/pages/AppPreviewPage";
import AgentPage from "@/pages/AgentPage";
import LandingPage from "@/pages/LandingPage";
import TemplatesPage from "@/pages/TemplatesPage";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 1000 * 60 * 5 } },
});

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35, ease: "easeOut" as const } },
};

function AppsBadge({ open, onClick }: { open: boolean; onClick: () => void }) {
  const hasApp = useHasApp();
  if (!hasApp) return null;
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-mono transition-all ${
        open
          ? "border-violet-500/35 bg-violet-500/[0.1] text-violet-300"
          : "border-white/[0.08] bg-white/[0.03] text-white/45 hover:text-white/70 hover:border-white/[0.12]"
      }`}
    >
      <Monitor size={11} />
      Apps
      {!open && (
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-1.5 h-1.5 rounded-full bg-green-400"
        />
      )}
    </motion.button>
  );
}

function AppInner() {
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [devPanelOpen, setDevPanelOpen] = useState(false);
  const [appsPanelOpen, setAppsPanelOpen] = useState(false);
  const [customInstructionsOpen, setCustomInstructionsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { loadKey } = useApiKeyStore();
  const { loadAll } = useByokStore();
  const { chats, createChat } = useChatStore();
  const { isActive: compareActive, setActive: setCompareActive } = useCompareStore();
  const hasApp = useHasApp();

  useEffect(() => { loadKey(); loadAll(); }, [loadKey, loadAll]);
  useEffect(() => { if (chats.length === 0) createChat(); }, []);

  // Auto-open Apps panel when first code is detected
  useEffect(() => {
    if (hasApp && !appsPanelOpen) setAppsPanelOpen(true);
  }, [hasApp]);

  const handlePaletteAction = (action: string) => {
    switch (action) {
      case "new-chat": createChat(); break;
      case "compare": setCompareActive(true); break;
      case "export": setExportModalOpen(true); break;
      case "animations": window.history.pushState({}, "", "/animations"); window.location.reload(); break;
      case "api-key": setApiKeyModalOpen(true); break;
      case "settings": setSettingsOpen(true); break;
      case "instructions": setCustomInstructionsOpen(true); break;
      case "dev-panel": setDevPanelOpen((v) => !v); break;
      case "templates": window.history.pushState({}, "", "/templates"); window.location.reload(); break;
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="relative flex h-screen w-screen overflow-hidden"
      style={{ background: "#05050A" }}
    >
      <AppearanceApplier />
      <CursorTrail />
      <CommandPalette onAction={handlePaletteAction} />
      <Background />

      <div className="relative z-10 flex w-full h-full">
        <Sidebar
          onOpenApiKey={() => setApiKeyModalOpen(true)}
          onExport={() => setExportModalOpen(true)}
          onOpenCustomInstructions={() => setCustomInstructionsOpen(true)}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
          {/* Header row with Apps badge injected */}
          <div className="flex items-center flex-shrink-0">
            <div className="flex-1 min-w-0">
              <Header
                onToggleDevPanel={() => setDevPanelOpen(!devPanelOpen)}
                devPanelOpen={devPanelOpen}
                onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
                onOpenSettings={() => setSettingsOpen(true)}
              />
            </div>
            {/* Apps badge floats beside header */}
            <div className="pr-3 flex-shrink-0 border-b border-white/[0.05] flex items-center" style={{ height: "52px", background: "#07070f" }}>
              <AppsBadge open={appsPanelOpen} onClick={() => setAppsPanelOpen((v) => !v)} />
            </div>
          </div>

          <div className="flex flex-1 min-h-0 overflow-hidden">
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
              <AnimatePresence mode="wait">
                {compareActive ? (
                  <motion.div key="compare" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                    <CompareView onClose={() => setCompareActive(false)} />
                  </motion.div>
                ) : (
                  <motion.div key="chat" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                    <ChatArea />
                    <ChatInput onOpenCompare={() => setCompareActive(true)} />
                    <Footer />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!compareActive && (
              <DevPanel open={devPanelOpen} onClose={() => setDevPanelOpen(false)} />
            )}
            {!compareActive && (
              <AppsPanel open={appsPanelOpen} onClose={() => setAppsPanelOpen(false)} />
            )}
          </div>
        </div>
      </div>

      <ApiKeyModal open={apiKeyModalOpen} onClose={() => setApiKeyModalOpen(false)} />
      <ExportModal open={exportModalOpen} onClose={() => setExportModalOpen(false)} />
      <CustomInstructionsModal open={customInstructionsOpen} onClose={() => setCustomInstructionsOpen(false)} />
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </motion.div>
  );
}

function AppRouter() {
  const path = window.location.pathname;
  // Chat page at root
  if (path === "/" || path === "" || path.endsWith("/chat")) return <LandingPage />;
  if (path.endsWith("/animations")) return <AnimationsPage />;
  if (path.endsWith("/preview")) return <AppPreviewPage />;
  if (path.endsWith("/agent")) return <AgentPage />;
  if (path.endsWith("/templates")) return <TemplatesPage />;
  // /app → Agent Development workspace
  return <AppInner />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  );
}
