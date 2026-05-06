import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Key, Zap, Cloud, Globe, Plus, ArrowLeft, ChevronDown, ChevronUp,
  Shield, Layers, Search, CheckCircle2, XCircle, Loader2, Copy, ExternalLink,
} from "lucide-react";
import { useAllApiKeysStore, BYOK_PROVIDERS, type ByokProviderName } from "@/store/all-api-keys-store";
import { ProviderCard } from "@/components/api-njir/ProviderCard";
import { CustomProviderForm, CustomProviderList } from "@/components/api-njir/CustomProviderForm";

function navigate(path: string) {
  window.history.pushState({}, "", path === "" ? "/" : path);
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

/* ── Status Pill ── */
function StatusPill({ status }: { status?: string }) {
  if (!status || status === "untested") return (
    <span className="text-[9px] font-mono text-white/20">Belum diuji</span>
  );
  if (status === "valid") return (
    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded-full"
      style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
      <CheckCircle2 size={9} /> Valid
    </span>
  );
  if (status === "invalid") return (
    <span className="flex items-center gap-1 text-[10px] font-mono text-red-400 px-2 py-0.5 rounded-full"
      style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
      <XCircle size={9} /> Invalid
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400 px-2 py-0.5 rounded-full"
      style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}>
      <Loader2 size={9} className="animate-spin" /> Menguji…
    </span>
  );
}

/* ── BYOK Provider Grid ── */
function ByokGrid() {
  const { byokKeys, setByokKey, testByokProvider, keyStatuses } = useAllApiKeysStore();
  const [search, setSearch] = useState("");
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

  const filtered = BYOK_PROVIDERS.filter((p) => p.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari provider BYOK…"
            className="w-full pl-8 pr-4 py-2.5 rounded-xl text-xs font-mono text-white/70 placeholder-white/25 focus:outline-none transition-all"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }} />
        </div>
        <span className="text-[11px] font-mono text-white/25 px-3 py-1.5 rounded-xl flex-shrink-0"
          style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.1)" }}>
          {filtered.length} providers
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {filtered.map((provider) => {
          const key = byokKeys[provider] ?? "";
          const status = keyStatuses[`byok_${provider}`];
          const isExpanded = expandedMap[provider];
          const hasKey = key.length > 0;

          return (
            <motion.div key={provider} layout
              className="rounded-xl overflow-hidden transition-all"
              style={{ background: "rgba(255,255,255,0.015)", border: `1px solid ${hasKey ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.06)"}` }}>
              <button onClick={() => setExpandedMap((m) => ({ ...m, [provider]: !m[provider] }))}
                className="w-full flex items-center gap-2.5 px-3.5 py-3 hover:bg-white/[0.025] transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${hasKey ? "bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.5)]" : "bg-white/12"}`} />
                <span className="flex-1 text-left text-[11.5px] font-medium text-white/60 truncate">{provider}</span>
                <StatusPill status={status} />
                {isExpanded ? <ChevronUp size={11} className="text-white/25 flex-shrink-0" /> : <ChevronDown size={11} className="text-white/25 flex-shrink-0" />}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="px-3.5 pb-3 pt-0 space-y-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <div className="flex gap-2 mt-3">
                        <input type="password" value={key} onChange={(e) => setByokKey(provider as ByokProviderName, e.target.value)}
                          placeholder="Masukkan API key…"
                          className="flex-1 px-3 py-2 rounded-lg text-xs font-mono text-white/70 placeholder-white/20 focus:outline-none transition-all"
                          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }} />
                        <button onClick={() => testByokProvider(provider as ByokProviderName)}
                          className="px-3 py-2 rounded-lg text-[11px] font-mono flex items-center gap-1.5 flex-shrink-0 transition-all"
                          style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)", color: "rgba(167,139,250,0.8)" }}>
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

/* ── Step Guide ── */
function StepGuide({ steps }: { steps: string[] }) {
  return (
    <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <p className="text-[10px] font-mono font-bold text-white/30 mb-4 uppercase tracking-widest">Cara Mendapatkan Kredensial</p>
      <ol className="space-y-3">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono text-violet-400/80"
              style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>{i + 1}</span>
            <span className="text-[12px] text-white/50 font-mono leading-relaxed pt-0.5">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ── Model Grid ── */
function ModelGrid({ models }: { models: Array<{ name: string; note: string }> }) {
  return (
    <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <p className="text-[10px] font-mono font-bold text-white/30 mb-4 uppercase tracking-widest">Model Tersedia</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {models.map((m) => (
          <div key={m.name} className="rounded-lg px-3 py-2.5 transition-colors hover:bg-white/[0.03]"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-[11px] font-mono font-semibold text-white/65">{m.name}</p>
            <p className="text-[10px] text-white/25 font-mono mt-0.5">{m.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Compatible Provider Info ── */
function CompatibleProviders() {
  const providers = [
    { name: "SiliconFlow", url: "https://api.siliconflow.cn/v1", note: "100+ models" },
    { name: "Ollama", url: "http://localhost:11434/v1", note: "Local models" },
    { name: "RouterPark", url: "https://api.routerpark.com/v1", note: "Multi-provider" },
    { name: "LM Studio", url: "http://localhost:1234/v1", note: "Local server" },
    { name: "Together AI", url: "https://api.together.xyz/v1", note: "Open source" },
    { name: "Anyscale", url: "https://api.endpoints.anyscale.com/v1", note: "Endpoints" },
  ];

  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const copy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <p className="text-[10px] font-mono font-bold text-white/30 mb-4 uppercase tracking-widest">Provider Compatible</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {providers.map((p) => (
          <div key={p.name} className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/[0.02] group"
            style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <Globe size={11} className="text-violet-400/40 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[11.5px] font-mono font-semibold text-white/65">{p.name}</p>
              <p className="text-[10px] font-mono text-white/25 truncate">{p.url}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-mono text-white/20">{p.note}</span>
              <button onClick={() => copy(p.url)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded text-white/30 hover:text-white/60 transition-all">
                {copiedUrl === p.url ? <CheckCircle2 size={10} className="text-emerald-400" /> : <Copy size={10} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Page ── */
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

  const tabs: { key: Tab; label: string; icon: React.ReactNode; badge?: string; accent: string }[] = [
    { key: "openrouter", label: "OpenRouter", icon: <Zap size={12} />, badge: "300+", accent: "violet" },
    { key: "cloudflare", label: "Cloudflare", icon: <Cloud size={12} />, accent: "orange" },
    { key: "bailian", label: "Bailian", icon: <Layers size={12} />, accent: "amber" },
    { key: "custom", label: "Custom", icon: <Globe size={12} />, badge: customProviders.length > 0 ? String(customProviders.length) : undefined, accent: "cyan" },
  ];

  const accentMap: Record<string, { text: string; bg: string; border: string; glow: string }> = {
    violet: { text: "rgb(196,181,253)", bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.3)", glow: "0 0 20px rgba(109,40,217,0.2)" },
    orange: { text: "rgb(253,186,116)", bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.3)", glow: "0 0 20px rgba(249,115,22,0.15)" },
    amber:  { text: "rgb(252,211,77)",  bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)", glow: "0 0 20px rgba(245,158,11,0.15)" },
    cyan:   { text: "rgb(103,232,249)", bg: "rgba(6,182,212,0.1)",  border: "rgba(6,182,212,0.3)",  glow: "0 0 20px rgba(6,182,212,0.15)" },
  };
  const active = accentMap[tabs.find((t) => t.key === activeTab)?.accent ?? "violet"];

  return (
    <div className="min-h-screen" style={{ background: "#05050A" }}>
      {/* Background glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute top-0 left-1/3 w-[700px] h-[500px] rounded-full opacity-[0.035]"
          style={{ background: "radial-gradient(circle, #8b5cf6, transparent 65%)" }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] rounded-full opacity-[0.025]"
          style={{ background: "radial-gradient(circle, #06b6d4, transparent 65%)" }} />
        <div className="absolute top-1/2 right-0 w-[350px] h-[350px] rounded-full opacity-[0.02]"
          style={{ background: "radial-gradient(circle, #ec4899, transparent 65%)" }} />
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.4), rgba(6,182,212,0.3), transparent)" }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-5 py-10">
        {/* Back nav */}
        <motion.button
          onClick={() => navigate("")}
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -3 }} whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 text-white/30 hover:text-white/65 transition-colors text-xs font-mono mb-8 group">
          <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" /> Kembali ke Chat
        </motion.button>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center relative"
              style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.2), rgba(139,92,246,0.08))", border: "1px solid rgba(139,92,246,0.3)", boxShadow: "0 0 30px rgba(109,40,217,0.2)" }}>
              <Key size={20} className="text-violet-400" />
              <div className="absolute inset-0 rounded-2xl opacity-20"
                style={{ background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent)" }} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight"
                style={{ fontFamily: "Orbitron, monospace", background: "linear-gradient(135deg, #c4b5fd 0%, #38bdf8 50%, #f472b6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                API NJIR
              </h1>
              <p className="text-sm text-white/35 mt-0.5">Kendalikan semua kunci API di satu tempat</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-2 mt-5">
            {[
              { label: "300+ Models", icon: <Layers size={10} />, color: "violet" },
              { label: "4 Providers", icon: <Cloud size={10} />, color: "cyan" },
              { label: "AES-GCM Encrypted", icon: <Shield size={10} />, color: "emerald" },
              { label: "BYOK 56 Providers", icon: <Key size={10} />, color: "amber" },
            ].map((s) => (
              <span key={s.label} className="flex items-center gap-1.5 text-[10.5px] font-mono text-white/35 px-3 py-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                {s.icon} {s.label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Tab Pills */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const accent = accentMap[tab.accent];
            return (
              <motion.button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                whileTap={{ scale: 0.96 }}
                className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-medium font-mono transition-all"
                style={isActive ? {
                  background: accent.bg,
                  border: `1px solid ${accent.border}`,
                  color: accent.text,
                  boxShadow: accent.glow,
                } : {
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "rgba(255,255,255,0.4)",
                }}>
                {tab.icon}
                {tab.label}
                {tab.badge !== undefined && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    style={isActive ? { background: accent.border, color: accent.text } : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }}>
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <motion.div layoutId="tab-active-bg" className="absolute inset-0 rounded-xl -z-10" style={{ background: accent.bg }} />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="h-px mb-8" style={{ background: `linear-gradient(90deg, ${active.border}, transparent)` }} />

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

            {/* ── OPENROUTER ── */}
            {activeTab === "openrouter" && (
              <div className="space-y-6">
                <ProviderCard
                  name="OpenRouter"
                  description="Gateway ke 300+ LLM dari 60+ provider dengan satu API key"
                  accentColor="violet"
                  docUrl="https://openrouter.ai/settings/keys"
                  status={keyStatuses.openrouter}
                  onTest={testOpenrouter}
                  modelBadges={OPENROUTER_MODELS}
                  fields={[{
                    key: "or_key", label: "OpenRouter API Key", placeholder: "sk-or-v1-…",
                    value: openrouterKey, onChange: () => {}, onSave: setOpenrouterKey,
                  }]}
                />

                {/* BYOK Section */}
                <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(139,92,246,0.12)" }}>
                  <div className="flex items-center gap-3 px-5 py-4" style={{ background: "rgba(139,92,246,0.04)", borderBottom: "1px solid rgba(139,92,246,0.08)" }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}>
                      <Key size={14} className="text-violet-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white/80">BYOK — Bring Your Own Key</p>
                      <p className="text-[11px] text-white/30 font-mono mt-0.5">Pakai key kamu sendiri dari 56 provider via OpenRouter</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-violet-400/70 px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
                      56 providers
                    </span>
                  </div>
                  <div className="p-5" style={{ background: "rgba(5,5,12,0.6)" }}>
                    <ByokGrid />
                  </div>
                </div>
              </div>
            )}

            {/* ── CLOUDFLARE ── */}
            {activeTab === "cloudflare" && (
              <div className="space-y-5">
                <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl text-[11.5px] font-mono text-amber-400/80"
                  style={{ background: "rgba(251,191,36,0.04)", border: "1px solid rgba(251,191,36,0.12)" }}>
                  <span className="text-base">💡</span>
                  <span>Dapatkan kredensial: Cloudflare Dashboard → Workers AI → Use REST API → Create API Token</span>
                </div>
                <ProviderCard
                  name="Cloudflare Workers AI"
                  description="Jalankan LLM di edge menggunakan infrastruktur global Cloudflare"
                  accentColor="orange"
                  docUrl="https://developers.cloudflare.com/workers-ai/get-started/rest-api/"
                  status={keyStatuses.cloudflare}
                  onTest={testCloudflare}
                  modelBadges={CLOUDFLARE_MODELS}
                  fields={[
                    { key: "cf_account", label: "Cloudflare Account ID", placeholder: "1234abcd5678efgh…", value: cloudflareAccountId, onChange: () => {}, onSave: setCloudflareAccountId, type: "text" },
                    { key: "cf_token", label: "Cloudflare API Token", placeholder: "ey…", value: cloudflareApiToken, onChange: () => {}, onSave: setCloudflareApiToken },
                  ]}
                />
                <StepGuide steps={[
                  "Buka dash.cloudflare.com dan login",
                  "Navigasi ke Workers AI di sidebar",
                  "Klik tab 'Use REST API'",
                  "Copy Account ID dari halaman tersebut",
                  "Klik 'Create API Token' dan ikuti instruksinya",
                ]} />
              </div>
            )}

            {/* ── ALIBABA BAILIAN ── */}
            {activeTab === "bailian" && (
              <div className="space-y-5">
                <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl text-[11.5px] font-mono text-amber-400/80"
                  style={{ background: "rgba(251,191,36,0.04)", border: "1px solid rgba(251,191,36,0.12)" }}>
                  <span className="text-base">💡</span>
                  <span>Dapatkan key: bailian.console.aliyun.com → API Key Center → Buat key baru</span>
                </div>
                <ProviderCard
                  name="Alibaba Cloud Bailian"
                  description="Akses model Qwen dan lainnya via platform AI Alibaba Cloud"
                  accentColor="amber"
                  docUrl="https://bailian.console.aliyun.com/"
                  status={keyStatuses.bailian}
                  onTest={testBailian}
                  modelBadges={BAILIAN_MODELS}
                  fields={[{
                    key: "bailian_key", label: "Bailian API Key", placeholder: "sk-…",
                    value: bailianKey, onChange: () => {}, onSave: setBailianKey,
                  }]}
                />
                <ModelGrid models={[
                  { name: "Qwen-Turbo", note: "Cepat & terjangkau" },
                  { name: "Qwen-Plus", note: "Seimbang" },
                  { name: "Qwen-Max", note: "Paling kuat" },
                  { name: "Qwen-Long", note: "128k context" },
                  { name: "DeepSeek-V3", note: "Reasoning" },
                  { name: "DeepSeek-R1", note: "Chain-of-thought" },
                  { name: "Llama-3.1-8B", note: "Open source" },
                  { name: "Llama-3.1-70B", note: "Open source" },
                ]} />
              </div>
            )}

            {/* ── CUSTOM (CLINE) ── */}
            {activeTab === "custom" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white/80" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Provider OpenAI-Compatible</h3>
                    <p className="text-[11px] text-white/30 font-mono mt-0.5">Tambahkan endpoint apapun yang kompatibel dengan format API OpenAI</p>
                  </div>
                  <motion.button onClick={() => setAddCustomOpen(true)} whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-mono font-semibold transition-all"
                    style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.2)", color: "rgb(103,232,249)" }}>
                    <Plus size={12} /> Tambah Provider
                  </motion.button>
                </div>

                {customProviders.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="py-16 text-center rounded-2xl border border-dashed"
                    style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.01)" }}>
                    <Globe size={32} className="mx-auto mb-4 text-white/10" />
                    <p className="text-sm font-semibold text-white/25 mb-1">Belum ada provider custom</p>
                    <p className="text-[11px] text-white/15 font-mono">Tambahkan SiliconFlow, Ollama, atau API OpenAI-compatible lainnya</p>
                    <motion.button onClick={() => setAddCustomOpen(true)} whileTap={{ scale: 0.95 }}
                      className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-mono border border-dashed text-white/35 hover:text-white/60 transition-all"
                      style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                      <Plus size={11} /> Tambah provider pertama
                    </motion.button>
                  </motion.div>
                ) : (
                  <CustomProviderList providers={customProviders} onRemove={removeCustomProvider} onTest={testCustomProvider} statuses={keyStatuses} />
                )}

                <CompatibleProviders />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="relative z-10 py-8 text-center mt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="h-px w-16" style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.3))" }} />
          <span className="text-[10px] font-mono text-white/20">✦</span>
          <div className="h-px w-16" style={{ background: "linear-gradient(90deg, rgba(139,92,246,0.3), transparent)" }} />
        </div>
        <p className="text-[11px] font-mono text-white/20">
          Dibuat dengan sepenuh hati oleh{" "}
          <span className="font-bold" style={{ color: "rgba(167,139,250,0.7)" }}>Andikaa Saputraa</span>
        </p>
        <motion.button onClick={() => navigate("")}
          whileHover={{ color: "rgba(167,139,250,0.9)" }}
          className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-white/20 mx-auto transition-colors">
          <ArrowLeft size={10} /> Kembali ke chat
        </motion.button>
      </div>

      <CustomProviderForm open={addCustomOpen} onClose={() => setAddCustomOpen(false)} />
    </div>
  );
}
