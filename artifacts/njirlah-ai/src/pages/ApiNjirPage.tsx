import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Key, Zap, Cloud, Globe, Plus, ArrowLeft, ChevronDown, ChevronUp,
  Shield, Layers, Search, CheckCircle2, XCircle, Loader2,
} from "lucide-react";
import { useAllApiKeysStore, BYOK_PROVIDERS, type ByokProviderName } from "@/store/all-api-keys-store";
import { ProviderCard } from "@/components/api-njir/ProviderCard";
import { CustomProviderForm, CustomProviderList } from "@/components/api-njir/CustomProviderForm";

const BASE = import.meta.env.BASE_URL ?? "/";
function navigate(path: string) {
  window.history.pushState({}, "", `${BASE}${path}`.replace("//", "/"));
  window.location.reload();
}

type Tab = "openrouter" | "cloudflare" | "bailian" | "custom";

const OPENROUTER_MODELS = [
  "GPT-4o", "Claude 3.5 Sonnet", "Gemini 2.5 Pro", "DeepSeek R1",
  "Llama 4 Scout", "Grok 3 Beta", "Mistral Large", "Command R+",
  "Qwen 2.5", "Phi-4", "Gemma 3", "WizardLM",
];

const CLOUDFLARE_MODELS = [
  "@cf/meta/llama-3.1-8b", "@cf/mistral/mistral-7b",
  "@cf/deepseek/deepseek-r1", "@cf/qwen/qwen1.5-14b",
  "@cf/google/gemma-7b-it", "@cf/microsoft/phi-2",
];

const BAILIAN_MODELS = [
  "qwen-turbo", "qwen-plus", "qwen-max", "qwen-long",
  "llama3-8b", "deepseek-v3", "deepseek-r1",
];

const BYOK_COLORS: Partial<Record<ByokProviderName, string>> = {
  "Anthropic": "rose",
  "OpenAI": "emerald",
  "Google AI Studio": "blue",
  "Google Vertex": "blue",
  "Azure": "cyan",
  "Amazon Bedrock": "amber",
  "Cloudflare": "orange",
  "Groq": "violet",
  "DeepSeek": "indigo",
  "Mistral": "fuchsia",
  "Cohere": "teal",
  "xAI": "slate",
};

function StatusPill({ status }: { status?: string }) {
  if (!status || status === "untested") return null;
  if (status === "valid") return (
    <span className="flex items-center gap-1 text-[10px] font-mono text-green-400 border border-green-500/20 bg-green-500/[0.07] px-2 py-0.5 rounded-full">
      <CheckCircle2 size={9} /> Valid
    </span>
  );
  if (status === "invalid") return (
    <span className="flex items-center gap-1 text-[10px] font-mono text-red-400 border border-red-500/20 bg-red-500/[0.07] px-2 py-0.5 rounded-full">
      <XCircle size={9} /> Invalid
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400 border border-amber-500/20 bg-amber-500/[0.07] px-2 py-0.5 rounded-full">
      <Loader2 size={9} className="animate-spin" /> Testing…
    </span>
  );
}

function ByokGrid() {
  const {
    byokKeys, setByokKey, testByokProvider, keyStatuses,
  } = useAllApiKeysStore();
  const [search, setSearch] = useState("");
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

  const filtered = BYOK_PROVIDERS.filter((p) =>
    p.toLowerCase().includes(search.toLowerCase())
  );

  const toggleExpand = (p: string) => {
    setExpandedMap((m) => ({ ...m, [p]: !m[p] }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search BYOK providers…"
            className="w-full pl-8 pr-4 py-2 rounded-lg border border-white/[0.07] bg-white/[0.03] text-xs font-mono text-white/70 placeholder-white/20 focus:outline-none focus:border-violet-500/30 transition-all"
          />
        </div>
        <span className="text-[11px] font-mono text-white/25 flex-shrink-0">{filtered.length} providers</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {filtered.map((provider) => {
          const key = byokKeys[provider] ?? "";
          const status = keyStatuses[`byok_${provider}`];
          const isExpanded = expandedMap[provider];
          const hasKey = key.length > 0;

          return (
            <motion.div
              key={provider}
              layout
              className="rounded-xl border border-white/[0.06] bg-white/[0.015] overflow-hidden"
            >
              <button
                onClick={() => toggleExpand(provider)}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-white/[0.02] transition-colors"
              >
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${hasKey ? "bg-green-400" : "bg-white/15"}`} />
                <span className="flex-1 text-left text-xs font-medium text-white/65 truncate">{provider}</span>
                <StatusPill status={status} />
                {isExpanded ? <ChevronUp size={11} className="text-white/25 flex-shrink-0" /> : <ChevronDown size={11} className="text-white/25 flex-shrink-0" />}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3.5 pb-3 pt-0 border-t border-white/[0.05] space-y-2">
                      <div className="flex gap-2 mt-3">
                        <input
                          type="password"
                          value={key}
                          onChange={(e) => setByokKey(provider as ByokProviderName, e.target.value)}
                          placeholder="Enter API key…"
                          className="flex-1 px-3 py-2 rounded-lg border border-white/[0.07] bg-white/[0.03] text-xs font-mono text-white/70 placeholder-white/20 focus:outline-none focus:border-violet-500/30 transition-all"
                        />
                        <button
                          onClick={() => testByokProvider(provider as ByokProviderName)}
                          className="px-2.5 py-2 rounded-lg text-[11px] font-mono border border-white/[0.07] text-white/35 hover:text-white/60 hover:border-white/[0.12] transition-all flex-shrink-0 flex items-center gap-1"
                        >
                          <Zap size={10} /> Test
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function ApiNjirPage() {
  const [activeTab, setActiveTab] = useState<Tab>("openrouter");
  const [addCustomOpen, setAddCustomOpen] = useState(false);

  const {
    loadAll,
    openrouterKey, setOpenrouterKey,
    cloudflareAccountId, setCloudflareAccountId,
    cloudflareApiToken, setCloudflareApiToken,
    bailianKey, setBailianKey,
    customProviders, removeCustomProvider,
    testOpenrouter, testCloudflare, testBailian, testCustomProvider,
    keyStatuses,
  } = useAllApiKeysStore();

  useEffect(() => { loadAll(); }, [loadAll]);

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: "openrouter", label: "OpenRouter", icon: <Zap size={13} />, count: 300 },
    { key: "cloudflare", label: "Cloudflare", icon: <Cloud size={13} /> },
    { key: "bailian", label: "Alibaba Bailian", icon: <Layers size={13} /> },
    { key: "custom", label: "Custom (Cline)", icon: <Globe size={13} />, count: customProviders.length || undefined },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#05050A" }}>
      {/* Neon background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #8b5cf6, transparent 70%)" }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #06b6d4, transparent 70%)" }} />
        <div className="absolute top-1/2 right-0 w-[300px] h-[300px] rounded-full opacity-[0.025]"
          style={{ background: "radial-gradient(circle, #ec4899, transparent 70%)" }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* Top nav */}
        <div className="flex items-center gap-3 mb-8">
          <motion.button
            onClick={() => navigate("")}
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 text-white/30 hover:text-white/60 transition-colors text-xs font-mono"
          >
            <ArrowLeft size={13} /> Back to Chat
          </motion.button>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-violet-500/25"
              style={{ background: "rgba(139,92,246,0.1)" }}>
              <Key size={18} className="text-violet-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight"
                style={{ fontFamily: "Orbitron, monospace", background: "linear-gradient(135deg, #a78bfa, #38bdf8, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                API NJIR
              </h1>
              <p className="text-sm text-white/35 font-mono">Kendalikan Semua Kunci API di Satu Tempat</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-3 mt-4">
            {[
              { label: "300+ Models", color: "violet", icon: <Layers size={11} /> },
              { label: "5 Providers", color: "cyan", icon: <Cloud size={11} /> },
              { label: "AES-GCM Encrypted", color: "green", icon: <Shield size={11} /> },
            ].map((s) => (
              <span key={s.label} className={`flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full border border-white/[0.07] text-white/40`}>
                {s.icon} {s.label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-white/[0.06] pb-0">
          {tabs.map((tab) => (
            <motion.button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              whileTap={{ scale: 0.96 }}
              className={`relative flex items-center gap-2 px-4 py-3 text-xs font-medium font-mono transition-all rounded-t-lg -mb-px ${
                activeTab === tab.key
                  ? "text-violet-300 border border-b-transparent border-white/[0.08]"
                  : "text-white/35 hover:text-white/60 border border-transparent hover:bg-white/[0.02]"
              }`}
              style={activeTab === tab.key ? { background: "#08080f" } : {}}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  activeTab === tab.key
                    ? "bg-violet-500/15 text-violet-400 border border-violet-500/25"
                    : "bg-white/[0.04] text-white/25 border border-white/[0.06]"
                }`}>
                  {tab.count}+
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {/* ── OPENROUTER ── */}
            {activeTab === "openrouter" && (
              <div className="space-y-6">
                <ProviderCard
                  name="OpenRouter"
                  description="Gateway to 300+ LLMs from 60+ providers with a single API key"
                  accentColor="violet"
                  docUrl="https://openrouter.ai/settings/keys"
                  status={keyStatuses.openrouter}
                  onTest={testOpenrouter}
                  modelBadges={OPENROUTER_MODELS}
                  fields={[
                    {
                      key: "or_key",
                      label: "OpenRouter API Key",
                      placeholder: "sk-or-v1-…",
                      value: openrouterKey,
                      onChange: () => {},
                      onSave: setOpenrouterKey,
                    },
                  ]}
                />

                {/* BYOK section */}
                <div className="rounded-xl border border-white/[0.07] overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.05]"
                    style={{ background: "#07070d" }}>
                    <Key size={13} className="text-violet-400/60" />
                    <div>
                      <p className="text-xs font-semibold text-white/75">BYOK — Bring Your Own Key</p>
                      <p className="text-[11px] text-white/25 font-mono mt-0.5">Use your own keys from 56 providers via OpenRouter</p>
                    </div>
                    <span className="ml-auto text-[10px] font-mono text-violet-400/50 border border-violet-500/15 px-2 py-0.5 rounded">
                      56 providers
                    </span>
                  </div>
                  <div className="p-4">
                    <ByokGrid />
                  </div>
                </div>
              </div>
            )}

            {/* ── CLOUDFLARE ── */}
            {activeTab === "cloudflare" && (
              <div className="space-y-4">
                <div className="px-4 py-3 rounded-xl border border-amber-500/[0.12] bg-amber-500/[0.04] text-[11px] font-mono text-amber-400/70">
                  💡 Get your credentials: Cloudflare Dashboard → Workers AI → Use REST API → Create API Token
                </div>
                <ProviderCard
                  name="Cloudflare Workers AI"
                  description="Run LLMs at the edge using Cloudflare's global infrastructure"
                  accentColor="orange"
                  docUrl="https://developers.cloudflare.com/workers-ai/get-started/rest-api/"
                  status={keyStatuses.cloudflare}
                  onTest={testCloudflare}
                  modelBadges={CLOUDFLARE_MODELS}
                  fields={[
                    {
                      key: "cf_account",
                      label: "Cloudflare Account ID",
                      placeholder: "1234abcd5678efgh…",
                      value: cloudflareAccountId,
                      onChange: () => {},
                      onSave: setCloudflareAccountId,
                      type: "text",
                    },
                    {
                      key: "cf_token",
                      label: "Cloudflare API Token",
                      placeholder: "ey…",
                      value: cloudflareApiToken,
                      onChange: () => {},
                      onSave: setCloudflareApiToken,
                    },
                  ]}
                />
                <div className="rounded-xl border border-white/[0.06] p-4">
                  <p className="text-[11px] font-mono text-white/35 mb-3 uppercase tracking-widest">How to get credentials</p>
                  <ol className="space-y-2 text-[12px] text-white/50 font-mono">
                    {[
                      "Go to dash.cloudflare.com and log in",
                      "Navigate to Workers AI in the sidebar",
                      "Click 'Use REST API' tab",
                      "Copy your Account ID from the page",
                      "Click 'Create API Token' and follow the prompts",
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[10px] text-white/30">{i + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {/* ── ALIBABA BAILIAN ── */}
            {activeTab === "bailian" && (
              <div className="space-y-4">
                <div className="px-4 py-3 rounded-xl border border-amber-500/[0.12] bg-amber-500/[0.04] text-[11px] font-mono text-amber-400/70">
                  💡 Get your key: bailian.console.aliyun.com → API Key Center → Create new key
                </div>
                <ProviderCard
                  name="Alibaba Cloud Bailian"
                  description="Access Qwen models and more via Alibaba Cloud's AI platform"
                  accentColor="amber"
                  docUrl="https://bailian.console.aliyun.com/"
                  status={keyStatuses.bailian}
                  onTest={testBailian}
                  modelBadges={BAILIAN_MODELS}
                  fields={[
                    {
                      key: "bailian_key",
                      label: "Bailian API Key",
                      placeholder: "sk-…",
                      value: bailianKey,
                      onChange: () => {},
                      onSave: setBailianKey,
                    },
                  ]}
                />
                <div className="rounded-xl border border-white/[0.06] p-4">
                  <p className="text-[11px] font-mono text-white/35 mb-3 uppercase tracking-widest">Available Models</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { name: "Qwen-Turbo", note: "Fast & affordable" },
                      { name: "Qwen-Plus", note: "Balanced" },
                      { name: "Qwen-Max", note: "Most powerful" },
                      { name: "Qwen-Long", note: "128k context" },
                      { name: "DeepSeek-V3", note: "Reasoning" },
                      { name: "DeepSeek-R1", note: "Chain-of-thought" },
                      { name: "Llama-3.1-8B", note: "Open source" },
                      { name: "Llama-3.1-70B", note: "Open source" },
                    ].map((m) => (
                      <div key={m.name} className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                        <p className="text-[11px] font-mono font-semibold text-white/65">{m.name}</p>
                        <p className="text-[10px] text-white/25 font-mono">{m.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── CUSTOM (CLINE) ── */}
            {activeTab === "custom" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white/75">Custom OpenAI-Compatible Providers</p>
                    <p className="text-[11px] text-white/30 font-mono mt-0.5">Add any endpoint compatible with OpenAI's API format</p>
                  </div>
                  <motion.button
                    onClick={() => setAddCustomOpen(true)}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all border"
                    style={{ background: "rgba(139,92,246,0.1)", borderColor: "rgba(139,92,246,0.2)", color: "rgb(196,181,253)" }}
                  >
                    <Plus size={12} /> Add Provider
                  </motion.button>
                </div>

                {customProviders.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-16 text-center rounded-xl border border-dashed border-white/[0.08]"
                  >
                    <Globe size={28} className="mx-auto mb-3 text-white/10" />
                    <p className="text-sm text-white/25 font-mono">No custom providers yet</p>
                    <p className="text-[11px] text-white/15 font-mono mt-1">Add SiliconFlow, Ollama, or any OpenAI-compatible API</p>
                    <motion.button
                      onClick={() => setAddCustomOpen(true)}
                      whileTap={{ scale: 0.95 }}
                      className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono mx-auto border border-dashed border-white/[0.1] text-white/35 hover:text-white/60 hover:border-white/[0.18] transition-all"
                    >
                      <Plus size={11} /> Add your first provider
                    </motion.button>
                  </motion.div>
                ) : (
                  <CustomProviderList
                    providers={customProviders}
                    onRemove={removeCustomProvider}
                    onTest={testCustomProvider}
                    statuses={keyStatuses}
                  />
                )}

                {/* Example providers info */}
                <div className="rounded-xl border border-white/[0.06] p-4">
                  <p className="text-[11px] font-mono text-white/35 mb-3 uppercase tracking-widest">Compatible Providers</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { name: "SiliconFlow", url: "https://api.siliconflow.cn/v1", note: "100+ models" },
                      { name: "Ollama", url: "http://localhost:11434/v1", note: "Local models" },
                      { name: "RouterPark", url: "https://api.routerpark.com/v1", note: "Multi-provider" },
                      { name: "LM Studio", url: "http://localhost:1234/v1", note: "Local server" },
                      { name: "Together AI", url: "https://api.together.xyz/v1", note: "Open source" },
                      { name: "Anyscale", url: "https://api.endpoints.anyscale.com/v1", note: "Endpoints" },
                    ].map((p) => (
                      <div key={p.name} className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-white/[0.05] bg-white/[0.015]">
                        <Globe size={11} className="text-violet-400/40 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-mono font-semibold text-white/60 truncate">{p.name}</p>
                          <p className="text-[10px] font-mono text-white/25 truncate">{p.url}</p>
                        </div>
                        <span className="ml-auto text-[10px] font-mono text-white/20 flex-shrink-0">{p.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-white/[0.04] py-6 text-center mt-12">
        <p className="text-[11px] font-mono text-white/20">
          Dibuat dengan sepenuh hati oleh{" "}
          <span className="text-violet-400/60 font-semibold">Andikaa Saputraa</span>
        </p>
      </div>

      <CustomProviderForm open={addCustomOpen} onClose={() => setAddCustomOpen(false)} />
    </div>
  );
}
