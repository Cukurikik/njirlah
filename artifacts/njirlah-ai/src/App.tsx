import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useApiKeyStore } from "@/store/api-key-store";
import { useChatStore } from "@/store/chat-store";
import { NeonBackground } from "@/components/layout/NeonBackground";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatArea } from "@/components/chat/ChatArea";
import { ChatInput } from "@/components/chat/ChatInput";
import { ApiKeyModal } from "@/components/chat/ApiKeyModal";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 5 },
  },
});

function AppInner() {
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const { loadKey, hasKey } = useApiKeyStore();
  const { createChat, chats } = useChatStore();

  useEffect(() => {
    loadKey();
  }, [loadKey]);

  useEffect(() => {
    if (chats.length === 0) {
      createChat();
    }
  }, []);

  return (
    <div className="relative flex h-screen w-screen overflow-hidden">
      <NeonBackground />
      <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />

      <div className="relative z-10 flex w-full h-full">
        <Sidebar onOpenApiKey={() => setApiKeyModalOpen(true)} />

        <div className="flex flex-col flex-1 min-w-0 h-full">
          <Header onOpenApiKey={() => setApiKeyModalOpen(true)} />
          <ChatArea />
          <ChatInput />
          <Footer />
        </div>
      </div>

      <ApiKeyModal open={apiKeyModalOpen} onClose={() => setApiKeyModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
