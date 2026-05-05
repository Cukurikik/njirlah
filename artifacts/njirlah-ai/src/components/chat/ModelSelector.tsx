import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, Zap, Cloud, Key, X, Check } from "lucide-react";
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
  "Together","Ultravox","Uniinference","Venice","xAI","01.ai",
];

const dropdownVariants = {
  hidden: { opacity: 0, y: -6, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 320, damping: 28 } },
  exit: { opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.15 } },
};

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

  const tabs = [
    { key: "all" as const, label: "All" },
    { key: "cloudflare" as const, label: "Cloudflare" },
    { key: "openrouter" as const, label: "OpenRouter" },
  ];

  return (
    <div className="relative">
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/[0.07] transition-colors text-sm max-w-[220px]"
      >
        <span className={selectedProvider === "cloudflare" ? "text-violet-400" : "text-orange-400"}>
          {selectedProvider === "cloudflare" ? <Cloud size={12} /> : <Zap size={12} />}
        </span>
        <span className="text-white/70 truncate text-xs font-medium">{displayName}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={11} className="text-white/25 flex-shrink-0" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute top-full left-0 mt-1.5 w-[460px] max-h-[500px] flex flex-col bg-black border border-white/[0.08] rounded-lg shadow-2xl z-50 overflow-hidden"
            >
              {/* Search + tabs */}
              <div className="p-3 border-b border-white/[0.06] space-y-2">
                <div className="relative">
                  <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                  <input
                    autoFocus
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search models..."
                    className="w-full pl-8 pr-3 py-2 text-xs bg-white/[0.03] border border-white/[0.06] rounded-md text-white/80 placeholder-white/20 focus:outline-none focus:border-violet-500/30 transition-colors font-mono"
                  />
                </div>

                <div className="flex items-center gap-1">
                  {tabs.map((tab) => (
                    <motion.button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      whileTap={{ scale: 0.95 }}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                        activeTab === tab.key
                          ? "bg-violet-500/15 text-violet-300 border border-violet-500/25"
                          : "text-white/30 hover:text-white/55 border border-transparent"
                      }`}
                    >
                      {tab.label}
                    </motion.button>
                  ))}
                  {selectedProviderFilter && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => setSelectedProviderFilter(null)}
                      className="ml-auto flex items-center gap-1 px-2 py-1 rounded border border-white/[0.06] text-[11px] text-white/35 hover:text-white/60"
                    >
                      <X size={9} /> {selectedProviderFilter}
                    </motion.button>
                  )}
                </div>

                {/* Provider chips */}
                {!selectedProviderFilter && (activeTab === "all" || activeTab === "openrouter") && (
                  <div className="flex flex-wrap gap-1 max-h-12 overflow-y-auto scrollbar-thin scrollbar-thumb-violet">
                    {PROVIDERS.map((p) => (
                      <button
                        key={p}
                        onClick={() => setSelectedProviderFilter(p)}
                        className="px-1.5 py-0.5 rounded text-[10px] text-white/25 hover:text-white/55 hover:bg-white/[0.04] transition-all border border-transparent hover:border-white/[0.06] font-mono"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Model list */}
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-violet scrollbar-track-transparent">
                {(activeTab === "all" || activeTab === "cloudflare") && filteredCf.length > 0 && (
                  <div>
                    <div className="sticky top-0 flex items-center gap-1.5 px-3 py-2 bg-black border-b border-white/[0.04] z-10">
                      <Cloud size={10} className="text-violet-400/60" />
                      <span className="text-[10px] font-semibold text-violet-400/60 tracking-widest uppercase font-mono">Cloudflare Workers AI</span>
                      <span className="ml-auto text-[10px] text-white/20 font-mono">built-in · free</span>
                    </div>
                    {filteredCf.map((m, i) => {
                      const active = selectedModel === m.id && selectedProvider === "cloudflare";
                      return (
                        <motion.button
                          key={m.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.02 }}
                          onClick={() => selectModel(m.id, "cloudflare")}
                          whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                          className={`w-full text-left px-3 py-2.5 transition-all flex items-center gap-2.5 ${active ? "bg-violet-500/[0.07] border-l border-violet-400" : ""}`}
                        >
                          <span className="badge-cf font-mono flex-shrink-0">CF</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white/75 truncate font-medium">{m.name || m.id.split("/").pop()}</p>
                            <p className="text-[10px] text-white/20 truncate font-mono">{m.id}</p>
                          </div>
                          {active
                            ? <Check size={11} className="text-violet-400 flex-shrink-0" />
                            : <span className="badge-free flex-shrink-0">FREE</span>
                          }
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {(activeTab === "all" || activeTab === "openrouter") && (
                  <div>
                    <div className="sticky top-0 flex items-center gap-1.5 px-3 py-2 bg-black border-b border-white/[0.04] z-10">
                      <Zap size={10} className="text-orange-400/60" />
                      <span className="text-[10px] font-semibold text-orange-400/60 tracking-widest uppercase font-mono">OpenRouter</span>
                      {!hasKey && (
                        <span className="ml-auto flex items-center gap-1 text-[10px] text-amber-400/60 font-mono">
                          <Key size={9} /> API key required
                        </span>
                      )}
                    </div>
                    {!hasKey ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="px-4 py-8 text-center"
                      >
                        <Key size={20} className="mx-auto mb-3 text-white/10" />
                        <p className="text-xs text-white/25 font-mono">Enter your OpenRouter API key to access 200+ models</p>
                      </motion.div>
                    ) : filteredOr.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-white/20 font-mono">No models found</div>
                    ) : (
                      filteredOr.slice(0, 200).map((m, i) => {
                        const free = isModelFree(m);
                        const price = !free && m.pricing ? `$${parseFloat(m.pricing.prompt).toFixed(6)}/tok` : null;
                        const active = selectedModel === m.id && selectedProvider === "openrouter";
                        return (
                          <motion.button
                            key={m.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.008 }}
                            onClick={() => selectModel(m.id, "openrouter")}
                            whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                            className={`w-full text-left px-3 py-2.5 transition-all flex items-center gap-2.5 ${active ? "bg-orange-500/[0.06] border-l border-orange-400" : ""}`}
                          >
                            <span className="badge-or font-mono flex-shrink-0">OR</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-white/75 truncate font-medium">{m.name || m.id}</p>
                              <p className="text-[10px] text-white/20 truncate font-mono">{m.id}</p>
                            </div>
                            {active
                              ? <Check size={11} className="text-orange-400 flex-shrink-0" />
                              : free
                              ? <span className="badge-free flex-shrink-0">FREE</span>
                              : price
                              ? <span className="text-[10px] text-white/20 font-mono flex-shrink-0">{price}</span>
                              : null
                            }
                          </motion.button>
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
