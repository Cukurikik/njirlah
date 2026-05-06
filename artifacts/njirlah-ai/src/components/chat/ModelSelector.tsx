import { useState, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, Zap, Key, X, Check, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useChatStore, type ModelProvider } from "@/store/chat-store";
import { useApiKeyStore } from "@/store/api-key-store";
import { fetchOpenRouterModels, isModelFree, getProviderFromModelId, type OpenRouterModel } from "@/lib/openrouter";
import { fetchCloudflareModels, type CloudflareModel } from "@/lib/cloudflare";
import {
  getProviderLogo, NjirlaLogo, OpenAILogo, CloudflareLogo,
} from "@/components/ui/AIProviderLogos";

const REPLIT_MODELS = [
  { id: "gpt-5.4",    name: "GPT-5.4",    note: "Most capable · default",  tag: "Best Overall" },
  { id: "gpt-5.2",    name: "GPT-5.2",    note: "Balanced speed & quality", tag: "Balanced" },
  { id: "gpt-5-mini", name: "GPT-5 Mini", note: "Fast & efficient",         tag: "Fast" },
  { id: "gpt-5-nano", name: "GPT-5 Nano", note: "Fastest & cheapest",       tag: "" },
  { id: "o4-mini",    name: "o4-mini",    note: "Advanced reasoning",       tag: "Best for Coding" },
  { id: "o3",         name: "o3",         note: "Deep chain-of-thought",    tag: "Best Reasoning" },
];

const FEATURED_OR_MODELS = [
  { id: "anthropic/claude-opus-4-5",        name: "Claude Opus 4.5",   tag: "Best Writing" },
  { id: "anthropic/claude-sonnet-4-5",      name: "Claude Sonnet 4.5", tag: "Balanced" },
  { id: "google/gemini-2.5-pro",            name: "Gemini 2.5 Pro",    tag: "Best Multimodal" },
  { id: "deepseek/deepseek-r1",             name: "DeepSeek R1",       tag: "Best Reasoning" },
  { id: "meta-llama/llama-4-maverick",      name: "Llama 4 Maverick",  tag: "Open Source" },
  { id: "x-ai/grok-3-beta",                name: "Grok 3 Beta",       tag: "Real-time Web" },
];

const PROVIDERS = [
  "AI21","AionLabs","AkashML","Alibaba Cloud","Amazon Bedrock","Anthropic","Arcee AI",
  "Cerebras","Chutes","Cohere","DeepInfra","DeepSeek","Featherless","Fireworks","Friendli",
  "Google AI Studio","Google Vertex","Groq","Inception","Liquid","MiniMax","Mistral",
  "Moonshot AI","Nebius","NovitaAI","OpenAI","Perplexity","SambaNova","Together","xAI","01.ai",
];

const dropdownVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 340, damping: 28 } },
  exit:   { opacity: 0, y: 8, scale: 0.97, transition: { duration: 0.13 } },
};

type ActiveTab = "all" | "featured" | "replit" | "cloudflare" | "openrouter";

function ModelLogo({ modelId, size = 14 }: { modelId: string; size?: number }) {
  return <span className="flex-shrink-0 opacity-75">{getProviderLogo(modelId, size)}</span>;
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
  return (
    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border flex-shrink-0 ${colors[tag] ?? "text-white/30 border-white/[0.08]"}`}>
      {tag}
    </span>
  );
}

interface DropdownRect { top: number; bottom: number; left: number; width: number; openUp: boolean }

export function ModelSelector() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("featured");
  const [selectedProviderFilter, setSelectedProviderFilter] = useState<string | null>(null);
  const [rect, setRect] = useState<DropdownRect>({ top: 0, bottom: 0, left: 0, width: 480, openUp: true });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const { selectedModel, selectedProvider, setSelectedModel } = useChatStore();
  const { openRouterKey, hasKey } = useApiKeyStore();

  const { data: cfModels = [] } = useQuery<CloudflareModel[]>({
    queryKey: ["cloudflare-models"],
    queryFn: fetchCloudflareModels,
    staleTime: 1000 * 60 * 10,
  });

  const { data: orModels = [] } = useQuery<OpenRouterModel[]>({
    queryKey: ["openrouter-models", openRouterKey],
    queryFn: () => fetchOpenRouterModels(openRouterKey!),
    enabled: !!openRouterKey,
    staleTime: 1000 * 60 * 10,
  });

  const handleOpen = useCallback(() => {
    if (!open && triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      const dropH = 520;
      const spaceBelow = window.innerHeight - r.bottom;
      const openUp = spaceBelow < dropH && r.top > dropH / 2;
      const w = Math.min(480, window.innerWidth - r.left - 16);
      setRect({ top: r.bottom + 6, bottom: window.innerHeight - r.top + 6, left: r.left, width: w, openUp });
    }
    setOpen((v) => !v);
  }, [open]);

  const selectModel = useCallback((id: string, provider: ModelProvider) => {
    setSelectedModel(id, provider);
    setOpen(false);
    setSearch("");
  }, [setSelectedModel]);

  const displayName = useMemo(() => {
    if (selectedProvider === "replit") return REPLIT_MODELS.find((m) => m.id === selectedModel)?.name ?? selectedModel;
    if (selectedProvider === "cloudflare") {
      const m = cfModels.find((m) => m.id === selectedModel);
      return m?.name || selectedModel.split("/").pop() || selectedModel;
    }
    const feat = FEATURED_OR_MODELS.find((m) => m.id === selectedModel);
    const m = orModels.find((m) => m.id === selectedModel);
    return feat?.name || m?.name || selectedModel;
  }, [selectedModel, selectedProvider, cfModels, orModels]);

  const filteredReplit = useMemo(() => {
    const s = search.toLowerCase();
    if (activeTab !== "all" && activeTab !== "replit") return [];
    return REPLIT_MODELS.filter((m) => m.id.includes(s) || m.name.toLowerCase().includes(s));
  }, [search, activeTab]);

  const filteredCf = useMemo(() => {
    const s = search.toLowerCase();
    if (activeTab !== "all" && activeTab !== "cloudflare") return [];
    return cfModels.filter((m) =>
      (!selectedProviderFilter || selectedProviderFilter === "Cloudflare") &&
      (m.id.toLowerCase().includes(s) || m.name.toLowerCase().includes(s))
    );
  }, [cfModels, search, activeTab, selectedProviderFilter]);

  const filteredOr = useMemo(() => {
    const s = search.toLowerCase();
    if (activeTab !== "all" && activeTab !== "openrouter") return [];
    return orModels.filter((m) => {
      const provider = getProviderFromModelId(m.id);
      return (
        (!selectedProviderFilter || provider.toLowerCase().includes(selectedProviderFilter.toLowerCase())) &&
        (m.id.toLowerCase().includes(s) || (m.name || "").toLowerCase().includes(s))
      );
    });
  }, [orModels, search, activeTab, selectedProviderFilter]);

  const currentLogo = useMemo(() => {
    if (selectedProvider === "replit") return <OpenAILogo size={13} />;
    if (selectedProvider === "cloudflare") return <CloudflareLogo size={13} />;
    return getProviderLogo(selectedModel, 13);
  }, [selectedModel, selectedProvider]);

  const tabs: { key: ActiveTab; label: string }[] = [
    { key: "featured",   label: "⭐ Featured" },
    { key: "all",        label: "All" },
    { key: "replit",     label: "Built-in" },
    { key: "cloudflare", label: "Cloudflare" },
    { key: "openrouter", label: "OpenRouter" },
  ];

  /* Dropdown fixed-position style — opens upward if near bottom of screen */
  const dropStyle: React.CSSProperties = rect.openUp
    ? { position: "fixed", bottom: rect.bottom, left: rect.left, width: rect.width, maxHeight: "min(520px, 70vh)", zIndex: 9999 }
    : { position: "fixed", top: rect.top,        left: rect.left, width: rect.width, maxHeight: "min(520px, 70vh)", zIndex: 9999 };

  return (
    <div className="relative">
      {/* Trigger button */}
      <motion.button
        ref={triggerRef}
        onClick={handleOpen}
        whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/[0.07] transition-colors"
      >
        <span className="flex-shrink-0 opacity-75">{currentLogo}</span>
        <span className="text-white/70 text-xs font-medium max-w-[180px] truncate">{displayName}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }}>
          <ChevronDown size={11} className="text-white/25 flex-shrink-0" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Click-away overlay */}
            <div
              className="fixed inset-0"
              style={{ zIndex: 9998 }}
              onClick={() => setOpen(false)}
            />

            {/* Dropdown — uses fixed positioning so it escapes overflow:hidden containers */}
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ ...dropStyle, background: "#07070F" }}
              className="flex flex-col border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden"
            >
              {/* ── Header ── */}
              <div className="px-4 pt-3 pb-2 border-b border-white/[0.05] flex-shrink-0">
                <p className="text-[9px] font-mono text-white/20 tracking-widest uppercase mb-2">Select Model</p>

                {/* Search */}
                <div className="relative mb-2">
                  <Search size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                  <input
                    autoFocus
                    type="text"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); if (e.target.value) setActiveTab("all"); }}
                    placeholder="Search 200+ models…"
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white/[0.03] border border-white/[0.06] rounded-lg text-white/80 placeholder-white/20 focus:outline-none focus:border-violet-500/30 transition-colors font-mono"
                  />
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                        activeTab === tab.key
                          ? "bg-violet-500/15 text-violet-300 border border-violet-500/25"
                          : "text-white/30 hover:text-white/55 border border-transparent hover:border-white/[0.06]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                  {selectedProviderFilter && (
                    <button
                      onClick={() => setSelectedProviderFilter(null)}
                      className="ml-auto flex items-center gap-1 px-2 py-1 rounded border border-white/[0.06] text-[11px] text-white/35 hover:text-white/60 flex-shrink-0"
                    >
                      <X size={9} /> {selectedProviderFilter}
                    </button>
                  )}
                </div>

                {/* Provider quick-filter chips */}
                {!selectedProviderFilter && (activeTab === "all" || activeTab === "openrouter") && !search && (
                  <div className="flex flex-wrap gap-1 mt-2 max-h-10 overflow-y-auto scrollbar-thin">
                    {PROVIDERS.map((p) => (
                      <button
                        key={p}
                        onClick={() => setSelectedProviderFilter(p)}
                        className="px-1.5 py-0.5 rounded text-[10px] text-white/20 hover:text-white/55 hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] font-mono transition-all"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Model list ── */}
              <div className="flex-1 overflow-y-auto">

                {/* FEATURED */}
                {activeTab === "featured" && (
                  <div>
                    <SectionHeader icon={<NjirlaLogo size={10} />} label="NJIRLAH AI Built-in" badge="FREE · No key needed" badgeCls="text-green-400/60 border-green-500/20" />
                    {REPLIT_MODELS.filter((m) => m.tag).map((m) => {
                      const active = selectedModel === m.id && selectedProvider === "replit";
                      return (
                        <ModelRow
                          key={m.id}
                          active={active}
                          onClick={() => selectModel(m.id, "replit")}
                          logo={<OpenAILogo size={14} className={active ? "text-violet-300" : "text-white/30"} />}
                          name={m.name}
                          sub={m.note}
                          right={active ? <Check size={11} className="text-violet-400" /> : <TagBadge tag={m.tag} />}
                          activeCls="bg-violet-500/[0.07] border-l-2 border-violet-400"
                        />
                      );
                    })}

                    {hasKey && (
                      <>
                        <SectionHeader icon={<Star size={10} className="text-amber-400/60" />} label="Top Picks · OpenRouter" />
                        {FEATURED_OR_MODELS.map((m) => {
                          const active = selectedModel === m.id && selectedProvider === "openrouter";
                          return (
                            <ModelRow
                              key={m.id}
                              active={active}
                              onClick={() => selectModel(m.id, "openrouter")}
                              logo={<ModelLogo modelId={m.id} size={14} />}
                              name={m.name}
                              sub={m.id}
                              right={active ? <Check size={11} className="text-amber-400" /> : <TagBadge tag={m.tag} />}
                              activeCls="bg-amber-500/[0.06] border-l-2 border-amber-400"
                            />
                          );
                        })}
                      </>
                    )}

                    {!hasKey && (
                      <div className="px-4 py-4 mt-1 border-t border-white/[0.04]">
                        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-white/[0.08]">
                          <Key size={11} className="text-amber-400/50" />
                          <p className="text-[11px] text-white/30 font-mono">Add an OpenRouter key to unlock 200+ models incl. Claude, Gemini & Grok</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ALL / BUILT-IN */}
                {(activeTab === "all" || activeTab === "replit") && filteredReplit.length > 0 && (
                  <div>
                    <SectionHeader icon={<NjirlaLogo size={10} />} label="NJIRLAH AI Built-in" badge="free" badgeCls="text-green-400/50" />
                    {filteredReplit.map((m) => {
                      const active = selectedModel === m.id && selectedProvider === "replit";
                      return (
                        <ModelRow
                          key={m.id}
                          active={active}
                          onClick={() => selectModel(m.id, "replit")}
                          logo={<OpenAILogo size={14} className={active ? "text-violet-300" : "text-white/30"} />}
                          name={m.name}
                          sub={m.note}
                          right={active ? <Check size={11} className="text-violet-400" /> : m.tag ? <TagBadge tag={m.tag} /> : <FreeBadge />}
                          activeCls="bg-violet-500/[0.07] border-l-2 border-violet-400"
                        />
                      );
                    })}
                  </div>
                )}

                {/* CLOUDFLARE */}
                {(activeTab === "all" || activeTab === "cloudflare") && filteredCf.length > 0 && (
                  <div>
                    <SectionHeader icon={<CloudflareLogo size={10} />} label="Cloudflare Workers AI" badge="free" badgeCls="text-white/20" />
                    {filteredCf.map((m) => {
                      const active = selectedModel === m.id && selectedProvider === "cloudflare";
                      return (
                        <ModelRow
                          key={m.id}
                          active={active}
                          onClick={() => selectModel(m.id, "cloudflare")}
                          logo={<ModelLogo modelId={m.id} size={14} />}
                          name={m.name || m.id.split("/").pop() || m.id}
                          sub={m.id}
                          right={active ? <Check size={11} className="text-orange-400" /> : <FreeBadge />}
                          activeCls="bg-orange-500/[0.07] border-l-2 border-orange-400"
                        />
                      );
                    })}
                  </div>
                )}

                {/* OPENROUTER */}
                {(activeTab === "all" || activeTab === "openrouter") && (
                  <div>
                    <SectionHeader
                      icon={<Zap size={10} className="text-amber-400/60" />}
                      label="OpenRouter · 200+ Models"
                      badge={!hasKey ? "key required" : undefined}
                      badgeCls="text-amber-400/60"
                    />
                    {!hasKey ? (
                      <div className="px-4 py-10 text-center">
                        <Key size={22} className="mx-auto mb-3 text-white/10" />
                        <p className="text-xs text-white/30 font-mono mb-1">Enter your OpenRouter API key</p>
                        <p className="text-[11px] text-white/15 font-mono">Access Claude, Gemini, Grok, Llama & 200+ more</p>
                      </div>
                    ) : filteredOr.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-white/20 font-mono">No models found</div>
                    ) : (
                      filteredOr.slice(0, 200).map((m) => {
                        const free = isModelFree(m);
                        const price = !free && m.pricing ? `$${parseFloat(m.pricing.prompt).toFixed(6)}/tok` : null;
                        const active = selectedModel === m.id && selectedProvider === "openrouter";
                        return (
                          <ModelRow
                            key={m.id}
                            active={active}
                            onClick={() => selectModel(m.id, "openrouter")}
                            logo={<ModelLogo modelId={m.id} size={14} />}
                            name={m.name || m.id}
                            sub={m.id}
                            right={
                              active ? <Check size={11} className="text-amber-400" />
                              : free ? <FreeBadge />
                              : price ? <span className="text-[10px] text-white/20 font-mono flex-shrink-0">{price}</span>
                              : null
                            }
                            activeCls="bg-amber-500/[0.06] border-l-2 border-amber-400"
                          />
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

/* ── Helper sub-components ── */

function SectionHeader({ icon, label, badge, badgeCls }: {
  icon: React.ReactNode; label: string; badge?: string; badgeCls?: string;
}) {
  return (
    <div
      className="sticky top-0 flex items-center gap-1.5 px-4 py-2 border-b border-white/[0.04] z-10"
      style={{ background: "#07070F" }}
    >
      {icon}
      <span className="text-[10px] font-semibold text-white/40 tracking-widest uppercase font-mono">{label}</span>
      {badge && <span className={`ml-auto text-[9px] font-mono border px-1.5 py-0.5 rounded ${badgeCls ?? "text-white/20 border-white/[0.06]"}`}>{badge}</span>}
    </div>
  );
}

function ModelRow({ active, onClick, logo, name, sub, right, activeCls }: {
  active: boolean;
  onClick: () => void;
  logo: React.ReactNode;
  name: string;
  sub?: string;
  right?: React.ReactNode;
  activeCls: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-2.5 transition-colors flex items-center gap-3 hover:bg-white/[0.03] ${active ? activeCls : ""}`}
    >
      {logo}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white/80 truncate font-semibold">{name}</p>
        {sub && <p className="text-[10px] text-white/20 truncate font-mono">{sub}</p>}
      </div>
      {right}
    </button>
  );
}

function FreeBadge() {
  return (
    <span className="text-[9px] font-bold text-green-400/60 border border-green-500/20 px-1.5 py-0.5 rounded font-mono flex-shrink-0">
      FREE
    </span>
  );
}
