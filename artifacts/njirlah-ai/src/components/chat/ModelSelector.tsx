import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, Zap, Cloud, Key, X, Check, Sparkles, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useChatStore, type ModelProvider } from "@/store/chat-store";
import { useApiKeyStore } from "@/store/api-key-store";
import { fetchOpenRouterModels, isModelFree, getProviderFromModelId, type OpenRouterModel } from "@/lib/openrouter";
import { fetchCloudflareModels, type CloudflareModel } from "@/lib/cloudflare";
import {
  getProviderLogo, NjirlaLogo, OpenAILogo, CloudflareLogo,
  AnthropicLogo, LlamaLogo, GoogleGemmaLogo, MistralLogo,
  DeepSeekLogo, XAILogo, QwenLogo, CerebrasLogo,
} from "@/components/ui/AIProviderLogos";

const REPLIT_MODELS = [
  { id: "gpt-5.4",    name: "GPT-5.4",     note: "Most capable · default",  tag: "Best Overall" },
  { id: "gpt-5.2",    name: "GPT-5.2",     note: "Balanced speed & quality", tag: "Balanced" },
  { id: "gpt-5-mini", name: "GPT-5 Mini",  note: "Fast & efficient",         tag: "Fast" },
  { id: "gpt-5-nano", name: "GPT-5 Nano",  note: "Fastest & cheapest",       tag: "" },
  { id: "o4-mini",    name: "o4-mini",     note: "Advanced reasoning",       tag: "Best for Coding" },
  { id: "o3",         name: "o3",          note: "Deep chain-of-thought",    tag: "Best Reasoning" },
];

const FEATURED_OR_MODELS = [
  { id: "anthropic/claude-opus-4-5",           name: "Claude Opus 4.5",        tag: "Best Writing" },
  { id: "anthropic/claude-sonnet-4-5",         name: "Claude Sonnet 4.5",      tag: "Balanced" },
  { id: "google/gemini-2.5-pro",               name: "Gemini 2.5 Pro",         tag: "Best Multimodal" },
  { id: "deepseek/deepseek-r1",                name: "DeepSeek R1",            tag: "Best Reasoning" },
  { id: "meta-llama/llama-4-maverick",         name: "Llama 4 Maverick",       tag: "Open Source" },
  { id: "x-ai/grok-3-beta",                   name: "Grok 3 Beta",            tag: "Real-time Web" },
];

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

type ActiveTab = "all" | "featured" | "replit" | "cloudflare" | "openrouter";

function ModelLogo({ modelId, size = 14 }: { modelId: string; size?: number }) {
  return (
    <span className="flex-shrink-0 opacity-80">
      {getProviderLogo(modelId, size)}
    </span>
  );
}

function TagBadge({ tag }: { tag: string }) {
  if (!tag) return null;
  const colors: Record<string, string> = {
    "Best Overall":    "text-violet-300 border-violet-500/25 bg-violet-500/10",
    "Best Reasoning":  "text-blue-300   border-blue-500/25   bg-blue-500/10",
    "Best for Coding": "text-cyan-300   border-cyan-500/25   bg-cyan-500/10",
    "Best Writing":    "text-pink-300   border-pink-500/25   bg-pink-500/10",
    "Best Multimodal": "text-green-300  border-green-500/25  bg-green-500/10",
    "Balanced":        "text-amber-300  border-amber-500/25  bg-amber-500/10",
    "Fast":            "text-teal-300   border-teal-500/25   bg-teal-500/10",
    "Open Source":     "text-orange-300 border-orange-500/25 bg-orange-500/10",
    "Real-time Web":   "text-rose-300   border-rose-500/25   bg-rose-500/10",
  };
  const cls = colors[tag] ?? "text-white/30 border-white/[0.08]";
  return (
    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border flex-shrink-0 ${cls}`}>
      {tag}
    </span>
  );
}

export function ModelSelector() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("featured");
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
    if (selectedProvider === "replit") {
      return REPLIT_MODELS.find((m) => m.id === selectedModel)?.name ?? selectedModel;
    }
    if (selectedProvider === "cloudflare") {
      const m = cfModels.find((m) => m.id === selectedModel);
      return m?.name || selectedModel.split("/").pop() || selectedModel;
    }
    const m = orModels.find((m) => m.id === selectedModel);
    const feat = FEATURED_OR_MODELS.find((m) => m.id === selectedModel);
    return feat?.name || m?.name || selectedModel;
  }, [selectedModel, selectedProvider, cfModels, orModels]);

  const filteredReplit = REPLIT_MODELS.filter((m) => {
    const s = search.toLowerCase();
    return (activeTab === "all" || activeTab === "replit") && (m.id.includes(s) || m.name.toLowerCase().includes(s));
  });

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

  const tabs: { key: ActiveTab; label: string }[] = [
    { key: "featured",    label: "⭐ Featured" },
    { key: "all",         label: "All" },
    { key: "replit",      label: "Built-in" },
    { key: "cloudflare",  label: "Cloudflare" },
    { key: "openrouter",  label: "OpenRouter" },
  ];

  const currentLogo = useMemo(() => {
    if (selectedProvider === "replit") return <OpenAILogo size={13} />;
    if (selectedProvider === "cloudflare") return <CloudflareLogo size={13} />;
    return getProviderLogo(selectedModel, 13);
  }, [selectedModel, selectedProvider]);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/[0.07] transition-colors text-sm max-w-[240px]"
      >
        <span className="flex-shrink-0 opacity-75">{currentLogo}</span>
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
              className="absolute top-full left-0 mt-1.5 w-[480px] max-h-[560px] flex flex-col border border-white/[0.08] rounded-xl shadow-2xl z-50 overflow-hidden"
              style={{ background: "#07070F" }}
            >
              {/* Header */}
              <div className="px-4 pt-3 pb-2 border-b border-white/[0.05]">
                <p className="text-[9px] font-mono text-white/20 tracking-widest uppercase mb-2">Select Model</p>

                {/* Search */}
                <div className="relative mb-2">
                  <Search size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                  <input
                    autoFocus
                    type="text"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); if (e.target.value) setActiveTab("all"); }}
                    placeholder="Search 200+ models..."
                    className="w-full pl-8 pr-3 py-2 text-xs bg-white/[0.03] border border-white/[0.06] rounded-lg text-white/80 placeholder-white/20 focus:outline-none focus:border-violet-500/30 transition-colors font-mono"
                  />
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                  {tabs.map((tab) => (
                    <motion.button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      whileTap={{ scale: 0.95 }}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                        activeTab === tab.key
                          ? "bg-violet-500/15 text-violet-300 border border-violet-500/25"
                          : "text-white/30 hover:text-white/55 border border-transparent hover:border-white/[0.06]"
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
                      className="ml-auto flex items-center gap-1 px-2 py-1 rounded border border-white/[0.06] text-[11px] text-white/35 hover:text-white/60 flex-shrink-0"
                    >
                      <X size={9} /> {selectedProviderFilter}
                    </motion.button>
                  )}
                </div>

                {/* Provider chips — only on openrouter/all tabs */}
                {!selectedProviderFilter && (activeTab === "all" || activeTab === "openrouter") && !search && (
                  <div className="flex flex-wrap gap-1 mt-2 max-h-[40px] overflow-y-auto scrollbar-thin scrollbar-thumb-violet">
                    {PROVIDERS.map((p) => (
                      <button
                        key={p}
                        onClick={() => setSelectedProviderFilter(p)}
                        className="px-1.5 py-0.5 rounded text-[10px] text-white/20 hover:text-white/55 hover:bg-white/[0.04] transition-all border border-transparent hover:border-white/[0.06] font-mono"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Model list */}
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-violet scrollbar-track-transparent">

                {/* ── Featured section ── */}
                {activeTab === "featured" && (
                  <div>
                    {/* NJIRLAH Built-in featured */}
                    <div className="sticky top-0 flex items-center gap-1.5 px-4 py-2 border-b border-white/[0.04] z-10" style={{ background: "#07070F" }}>
                      <NjirlaLogo size={10} />
                      <span className="text-[10px] font-semibold text-violet-400/60 tracking-widest uppercase font-mono">NJIRLAH AI Built-in</span>
                      <span className="ml-auto text-[9px] text-green-400/50 font-mono border border-green-500/20 px-1.5 py-0.5 rounded">FREE · No key needed</span>
                    </div>
                    {REPLIT_MODELS.filter((m) => m.tag).map((m, i) => {
                      const active = selectedModel === m.id && selectedProvider === "replit";
                      return (
                        <motion.button
                          key={m.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          onClick={() => selectModel(m.id, "replit")}
                          whileHover={{ backgroundColor: "rgba(124,58,237,0.04)" }}
                          className={`w-full text-left px-4 py-2.5 transition-all flex items-center gap-3 ${active ? "bg-violet-500/[0.07] border-l-2 border-violet-400" : ""}`}
                        >
                          <OpenAILogo size={14} className={active ? "text-violet-300" : "text-white/30"} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white/80 truncate font-semibold">{m.name}</p>
                            <p className="text-[10px] text-white/25 truncate font-mono">{m.note}</p>
                          </div>
                          {active
                            ? <Check size={11} className="text-violet-400 flex-shrink-0" />
                            : <TagBadge tag={m.tag} />
                          }
                        </motion.button>
                      );
                    })}

                    {/* Featured OpenRouter picks */}
                    {hasKey && (
                      <>
                        <div className="sticky top-0 flex items-center gap-1.5 px-4 py-2 border-b border-white/[0.04] border-t border-t-white/[0.04] z-10 mt-1" style={{ background: "#07070F" }}>
                          <Star size={10} className="text-amber-400/60" />
                          <span className="text-[10px] font-semibold text-amber-400/60 tracking-widest uppercase font-mono">Top Picks · OpenRouter</span>
                        </div>
                        {FEATURED_OR_MODELS.map((m, i) => {
                          const active = selectedModel === m.id && selectedProvider === "openrouter";
                          return (
                            <motion.button
                              key={m.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.15 + i * 0.03 }}
                              onClick={() => selectModel(m.id, "openrouter")}
                              whileHover={{ backgroundColor: "rgba(245,158,11,0.04)" }}
                              className={`w-full text-left px-4 py-2.5 transition-all flex items-center gap-3 ${active ? "bg-amber-500/[0.06] border-l-2 border-amber-400" : ""}`}
                            >
                              <ModelLogo modelId={m.id} size={14} />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-white/80 truncate font-semibold">{m.name}</p>
                                <p className="text-[10px] text-white/25 truncate font-mono">{m.id}</p>
                              </div>
                              {active
                                ? <Check size={11} className="text-amber-400 flex-shrink-0" />
                                : <TagBadge tag={m.tag} />
                              }
                            </motion.button>
                          );
                        })}
                      </>
                    )}

                    {!hasKey && (
                      <div className="px-4 py-4 border-t border-white/[0.04] mt-1">
                        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-white/[0.08] bg-white/[0.01]">
                          <Key size={11} className="text-amber-400/50" />
                          <p className="text-[11px] text-white/30 font-mono">Add an OpenRouter key to unlock 200+ models including Claude, Gemini & Grok</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── All / Built-in section ── */}
                {(activeTab === "all" || activeTab === "replit") && filteredReplit.length > 0 && (
                  <div>
                    <div className="sticky top-0 flex items-center gap-1.5 px-4 py-2 border-b border-white/[0.04] z-10" style={{ background: "#07070F" }}>
                      <NjirlaLogo size={10} />
                      <span className="text-[10px] font-semibold text-violet-400/60 tracking-widest uppercase font-mono">NJIRLAH AI Built-in</span>
                      <span className="ml-auto text-[9px] text-green-400/50 font-mono">no key · free</span>
                    </div>
                    {filteredReplit.map((m, i) => {
                      const active = selectedModel === m.id && selectedProvider === "replit";
                      return (
                        <motion.button
                          key={m.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.02 }}
                          onClick={() => selectModel(m.id, "replit")}
                          whileHover={{ backgroundColor: "rgba(124,58,237,0.04)" }}
                          className={`w-full text-left px-4 py-2.5 transition-all flex items-center gap-3 ${active ? "bg-violet-500/[0.07] border-l-2 border-violet-400" : ""}`}
                        >
                          <OpenAILogo size={14} className={active ? "text-violet-300" : "text-white/30"} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white/80 truncate font-semibold">{m.name}</p>
                            <p className="text-[10px] text-white/25 truncate font-mono">{m.note}</p>
                          </div>
                          {active
                            ? <Check size={11} className="text-violet-400 flex-shrink-0" />
                            : m.tag
                            ? <TagBadge tag={m.tag} />
                            : <span className="text-[9px] font-bold text-green-400/60 border border-green-500/20 px-1.5 py-0.5 rounded font-mono flex-shrink-0">FREE</span>
                          }
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {/* ── Cloudflare section ── */}
                {(activeTab === "all" || activeTab === "cloudflare") && filteredCf.length > 0 && (
                  <div>
                    <div className="sticky top-0 flex items-center gap-1.5 px-4 py-2 border-b border-white/[0.04] z-10" style={{ background: "#07070F" }}>
                      <CloudflareLogo size={10} />
                      <span className="text-[10px] font-semibold text-orange-400/60 tracking-widest uppercase font-mono">Cloudflare Workers AI</span>
                      <span className="ml-auto text-[9px] text-white/20 font-mono">built-in · free</span>
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
                          whileHover={{ backgroundColor: "rgba(251,146,60,0.04)" }}
                          className={`w-full text-left px-4 py-2.5 transition-all flex items-center gap-3 ${active ? "bg-orange-500/[0.07] border-l-2 border-orange-400" : ""}`}
                        >
                          <ModelLogo modelId={m.id} size={14} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white/80 truncate font-semibold">{m.name || m.id.split("/").pop()}</p>
                            <p className="text-[10px] text-white/20 truncate font-mono">{m.id}</p>
                          </div>
                          {active
                            ? <Check size={11} className="text-orange-400 flex-shrink-0" />
                            : <span className="text-[9px] font-bold text-green-400/60 border border-green-500/20 px-1.5 py-0.5 rounded font-mono flex-shrink-0">FREE</span>
                          }
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {/* ── OpenRouter section ── */}
                {(activeTab === "all" || activeTab === "openrouter") && (
                  <div>
                    <div className="sticky top-0 flex items-center gap-1.5 px-4 py-2 border-b border-white/[0.04] z-10" style={{ background: "#07070F" }}>
                      <Zap size={10} className="text-amber-400/60" />
                      <span className="text-[10px] font-semibold text-amber-400/60 tracking-widest uppercase font-mono">OpenRouter · 200+ Models</span>
                      {!hasKey && (
                        <span className="ml-auto flex items-center gap-1 text-[10px] text-amber-400/60 font-mono">
                          <Key size={9} /> key required
                        </span>
                      )}
                    </div>
                    {!hasKey ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 py-10 text-center">
                        <Key size={22} className="mx-auto mb-3 text-white/10" />
                        <p className="text-xs text-white/30 font-mono mb-1">Enter your OpenRouter API key</p>
                        <p className="text-[11px] text-white/15 font-mono">Access Claude, Gemini, Grok, Llama & 200+ more</p>
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
                            whileHover={{ backgroundColor: "rgba(255,255,255,0.025)" }}
                            className={`w-full text-left px-4 py-2.5 transition-all flex items-center gap-3 ${active ? "bg-amber-500/[0.06] border-l-2 border-amber-400" : ""}`}
                          >
                            <ModelLogo modelId={m.id} size={14} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-white/80 truncate font-semibold">{m.name || m.id}</p>
                              <p className="text-[10px] text-white/20 truncate font-mono">{m.id}</p>
                            </div>
                            {active
                              ? <Check size={11} className="text-amber-400 flex-shrink-0" />
                              : free
                              ? <span className="text-[9px] font-bold text-green-400/60 border border-green-500/20 px-1.5 py-0.5 rounded font-mono flex-shrink-0">FREE</span>
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
