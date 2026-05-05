import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, Zap, Cloud, Key, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useChatStore, type ModelProvider } from "@/store/chat-store";
import { useApiKeyStore } from "@/store/api-key-store";
import { fetchOpenRouterModels, isModelFree, getProviderFromModelId, type OpenRouterModel } from "@/lib/openrouter";
import { fetchCloudflareModels, type CloudflareModel } from "@/lib/cloudflare";

const PROVIDERS = [
  "AI21","AionLabs","AkashML","Alibaba Cloud","Amazon Bedrock","Anthropic","Arcee AI",
  "AtlasCloud","Azure","Baidu Qianfan","Baseten","Cerebras","Chutes","Clarifai","Cohere",
  "DeepInfra","DeepSeek","Featherless","Fireworks","Friendli","GMICloud","Google AI Studio",
  "Google Vertex","Groq","Inception","Inceptron","Infermatic","Inflection","io.net","Liquid",
  "Mancer","MiniMax","Mistral","Moonshot AI","Morph","Nebius","NextBit","NovitaAI","OpenAI",
  "OpenInference","Parasail","Perplexity","Phala","Reka AI","Relace","SambaNova","Stealth",
  "Together","Ultravox","Uniinference","Venice","xAI","01.ai","Cloudflare",
];

export function ModelSelector() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "cloudflare" | "openrouter">("all");
  const [selectedProviderFilter, setSelectedProviderFilter] = useState<string | null>(null);

  const { selectedModel, selectedProvider, setSelectedModel } = useChatStore();
  const { openRouterKey, hasKey } = useApiKeyStore();

  const { data: cfModels = [] } = useQuery<CloudflareModel[]>({
    queryKey: ["cloudflare-models"],
    queryFn: () => fetchCloudflareModels(),
    staleTime: 1000 * 60 * 10,
  });

  const { data: orModels = [] } = useQuery<OpenRouterModel[]>({
    queryKey: ["openrouter-models", openRouterKey],
    queryFn: () => fetchOpenRouterModels(openRouterKey!),
    enabled: !!openRouterKey,
    staleTime: 1000 * 60 * 10,
  });

  const displayName = useMemo(() => {
    if (selectedProvider === "cloudflare") {
      const m = cfModels.find((m) => m.id === selectedModel);
      return m?.name || selectedModel.split("/").pop() || selectedModel;
    }
    const m = orModels.find((m) => m.id === selectedModel);
    return m?.name || selectedModel;
  }, [selectedModel, selectedProvider, cfModels, orModels]);

  const filteredCf = cfModels.filter((m) => {
    const s = search.toLowerCase();
    return (
      (activeTab === "all" || activeTab === "cloudflare") &&
      (!selectedProviderFilter || selectedProviderFilter === "Cloudflare") &&
      (m.id.toLowerCase().includes(s) || m.name.toLowerCase().includes(s))
    );
  });

  const filteredOr = orModels.filter((m) => {
    const s = search.toLowerCase();
    const provider = getProviderFromModelId(m.id);
    return (
      (activeTab === "all" || activeTab === "openrouter") &&
      (!selectedProviderFilter || provider.toLowerCase().includes(selectedProviderFilter.toLowerCase())) &&
      (m.id.toLowerCase().includes(s) || (m.name || "").toLowerCase().includes(s))
    );
  });

  const selectModel = (id: string, provider: ModelProvider) => {
    setSelectedModel(id, provider);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-purple-500/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all text-sm"
      >
        <span className={selectedProvider === "cloudflare" ? "text-cyan-400" : "text-orange-400"}>
          {selectedProvider === "cloudflare" ? <Cloud size={14} /> : <Zap size={14} />}
        </span>
        <span className="text-white max-w-[180px] truncate font-medium">{displayName}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} className="text-gray-400" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute top-full left-0 mt-2 w-[480px] max-h-[520px] flex flex-col backdrop-blur-2xl bg-[#05050A]/95 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-3 border-b border-white/10 space-y-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari model..."
                    autoFocus
                    className="w-full pl-9 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40"
                  />
                </div>
                <div className="flex gap-1">
                  {(["all", "cloudflare", "openrouter"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        activeTab === tab
                          ? "bg-purple-500/30 text-purple-300 border border-purple-500/30"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {tab === "all" ? "Semua" : tab === "cloudflare" ? "☁️ Cloudflare" : "⚡ OpenRouter"}
                    </button>
                  ))}
                  {selectedProviderFilter && (
                    <button
                      onClick={() => setSelectedProviderFilter(null)}
                      className="ml-auto flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-gray-400 hover:text-white bg-white/5"
                    >
                      <X size={10} /> {selectedProviderFilter}
                    </button>
                  )}
                </div>
                {!selectedProviderFilter && (activeTab === "all" || activeTab === "openrouter") && (
                  <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                    {PROVIDERS.filter(p => p !== "Cloudflare").map((p) => (
                      <button
                        key={p}
                        onClick={() => setSelectedProviderFilter(p)}
                        className="px-2 py-0.5 rounded text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent">
                {(activeTab === "all" || activeTab === "cloudflare") && filteredCf.length > 0 && (
                  <div>
                    <div className="sticky top-0 px-3 py-2 text-xs font-semibold text-cyan-400 bg-[#05050A]/95 border-b border-white/5 flex items-center gap-1.5">
                      <Cloud size={11} /> Cloudflare Workers AI
                      <span className="ml-auto text-gray-500 font-normal">Built-in • Gratis</span>
                    </div>
                    {filteredCf.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => selectModel(m.id, "cloudflare")}
                        className={`w-full text-left px-3 py-2.5 hover:bg-white/5 transition-all group ${
                          selectedModel === m.id && selectedProvider === "cloudflare"
                            ? "bg-cyan-500/10 border-l-2 border-cyan-400"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-cyan-400 font-mono bg-cyan-500/10 px-1.5 py-0.5 rounded">CF</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{m.name || m.id.split("/").pop()}</p>
                            <p className="text-xs text-gray-500 truncate font-mono">{m.id}</p>
                          </div>
                          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 flex-shrink-0">
                            GRATIS
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {(activeTab === "all" || activeTab === "openrouter") && (
                  <div>
                    <div className="sticky top-0 px-3 py-2 text-xs font-semibold text-orange-400 bg-[#05050A]/95 border-b border-white/5 flex items-center gap-1.5">
                      <Zap size={11} /> OpenRouter
                      {!hasKey && (
                        <span className="ml-auto flex items-center gap-1 text-yellow-400 font-normal">
                          <Key size={10} /> API Key diperlukan
                        </span>
                      )}
                    </div>
                    {!hasKey ? (
                      <div className="px-4 py-6 text-center text-sm text-gray-500">
                        <Key size={24} className="mx-auto mb-2 text-yellow-400/50" />
                        <p>Masukkan OpenRouter API key untuk mengakses ratusan model AI</p>
                      </div>
                    ) : filteredOr.length === 0 ? (
                      <div className="px-4 py-6 text-center text-sm text-gray-500">Tidak ada model ditemukan</div>
                    ) : (
                      filteredOr.slice(0, 200).map((m) => {
                        const free = isModelFree(m);
                        const price = free
                          ? null
                          : m.pricing
                          ? `$${parseFloat(m.pricing.prompt).toFixed(6)}/tk`
                          : null;
                        return (
                          <button
                            key={m.id}
                            onClick={() => selectModel(m.id, "openrouter")}
                            className={`w-full text-left px-3 py-2.5 hover:bg-white/5 transition-all ${
                              selectedModel === m.id && selectedProvider === "openrouter"
                                ? "bg-orange-500/10 border-l-2 border-orange-400"
                                : ""
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-orange-400 font-mono bg-orange-500/10 px-1.5 py-0.5 rounded">OR</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white truncate">{m.name || m.id}</p>
                                <p className="text-xs text-gray-500 truncate font-mono">{m.id}</p>
                              </div>
                              {free ? (
                                <span className="text-xs text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 flex-shrink-0">
                                  GRATIS
                                </span>
                              ) : price ? (
                                <span className="text-xs text-gray-400 flex-shrink-0">{price}</span>
                              ) : null}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
