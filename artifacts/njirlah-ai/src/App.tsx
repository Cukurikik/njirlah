import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useApiKeyStore } from "@/store/api-key-store";
import { useChatStore } from "@/store/chat-store";
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
import { AppearanceApplier } from "@/components/layout/AppearanceApplier";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 1000 * 60 * 5 } },
});

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" as const } },
};

function AppInner() {
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [devPanelOpen, setDevPanelOpen] = useState(false);
  const [customInstructionsOpen, setCustomInstructionsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { loadKey } = useApiKeyStore();
  const { chats, createChat } = useChatStore();

  useEffect(() => { loadKey(); }, [loadKey]);
  useEffect(() => { if (chats.length === 0) createChat(); }, []);

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="relative flex h-screen w-screen overflow-hidden"
      style={{ background: "#05050A" }}
    >
      <AppearanceApplier />
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
          <Header
            onToggleDevPanel={() => setDevPanelOpen(!devPanelOpen)}
            devPanelOpen={devPanelOpen}
            onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
            onOpenSettings={() => setSettingsOpen(true)}
          />
          <div className="flex flex-1 min-h-0 overflow-hidden">
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
              <ChatArea />
              <ChatInput />
              <Footer />
            </div>
            <DevPanel open={devPanelOpen} onClose={() => setDevPanelOpen(false)} />
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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
