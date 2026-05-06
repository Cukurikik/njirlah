import { useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, Check, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useApiKeyStore } from "@/store/api-key-store";
import { fetchCloudflareModels, type CloudflareModel } from "@/lib/cloudflare";
import { fetchOpenRouterModels, isModelFree, type OpenRouterModel } from "@/lib/openrouter";
import { getProviderLogo, OpenAILogo, CloudflareLogo } from "@/components/ui/AIProviderLogos";
import type { ModelProvider } from "@/store/chat-store";

const REPLIT_MODELS = [
  { id: "gpt-5.4",    name: "GPT-5.4",    provider: "replit" as ModelProvider },
  { id: "gpt-5.2",    name: "GPT-5.2",    provider: "replit" as ModelProvider },
  { id: "gpt-5-mini", name: "GPT-5 Mini", provider: "replit" as ModelProvider },
  { id: "gpt-5-nano", name: "GPT-5 Nano", provider: "replit" as ModelProvider },
  { id: "o4-mini",    name: "o4-mini",    provider: "replit" as ModelProvider },
  { id: "o3",         name: "o3",         provider: "replit" as ModelProvider },
];

interface Props {
  value: string;
  provider: ModelProvider;
  onChange: (id: string, provider: ModelProvider) => void;
  accentColor?: string;
}

export function CompareModelPicker({ value, provider, onChange, accentColor = "violet" }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [rect, setRect] = useState({ top: 0, left: 0, width: 360 });
  const triggerRef = useRef<HTMLButtonElement>(null);
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
      setRect({ top: r.bottom + 6, left: Math.max(8, r.left), width: Math.min(360, window.innerWidth - r.left - 16) });
    }
    setOpen((v) => !v);
  }, [open]);

  const displayName = useMemo(() => {
    if (provider === "replit") return REPLIT_MODELS.find((m) => m.id === value)?.name ?? value;
    if (provider === "cloudflare") {
      const m = cfModels.find((m) => m.id === value);
      return m?.name || value.split("/").pop() || value;
    }
    const m = orModels.find((m) => m.id === value);
    return m?.name || value.split("/").pop() || value;
  }, [value, provider, cfModels, orModels]);

  const s = search.toLowerCase();
  const filteredRep = REPLIT_MODELS.filter((m) => m.name.toLowerCase().includes(s) || m.id.includes(s));
  const filteredCf  = cfModels.filter((m) => m.id.toLowerCase().includes(s) || m.name.toLowerCase().includes(s));
  const filteredOr  = orModels.filter((m) => (m.name || m.id).toLowerCase().includes(s)).slice(0, 80);

  const select = (id: string, prov: ModelProvider) => {
    onChange(id, prov);
    setOpen(false);
    setSearch("");
  };

  const currentLogo = useMemo(() => {
    if (provider === "replit")    return <OpenAILogo size={12} />;
    if (provider === "cloudflare") return <CloudflareLogo size={12} />;
    return getProviderLogo(value, 12);
  }, [value, provider]);

  const accentCls = accentColor === "blue" ? "border-blue-500/40 text-blue-300" : "border-violet-500/40 text-violet-300";

  return (
    <div className="relative">
      <motion.button
        ref={triggerRef}
        onClick={handleOpen}
        whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
        whileTap={{ scale: 0.97 }}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors text-xs ${open ? accentCls + " bg-white/[0.03]" : "border-white/[0.08] text-white/60"}`}
      >
        <span className="opacity-75">{currentLogo}</span>
        <span className="font-medium truncate max-w-[160px]">{displayName}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }}>
          <ChevronDown size={10} className="text-white/25 flex-shrink-0" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0" style={{ zIndex: 9998 }} onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              style={{ position: "fixed", top: rect.top, left: rect.left, width: rect.width, maxHeight: "min(480px, 65vh)", background: "#07070F", zIndex: 9999 }}
              className="flex flex-col border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden"
            >
              {/* Search */}
              <div className="px-3 pt-3 pb-2 border-b border-white/[0.05] flex-shrink-0">
                <div className="relative">
                  <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                  <input
                    autoFocus
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search models…"
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white/[0.03] border border-white/[0.06] rounded-lg text-white/80 placeholder-white/20 focus:outline-none focus:border-violet-500/30 font-mono transition-colors"
                  />
                  {search && (
                    <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50">
                      <X size={10} />
                    </button>
                  )}
                </div>
              </div>

              {/* Lists */}
              <div className="flex-1 overflow-y-auto">
                {/* Built-in */}
                {filteredRep.length > 0 && (
                  <div>
                    <p className="sticky top-0 px-3 py-1.5 text-[9px] font-mono font-bold tracking-widest uppercase text-violet-400/50 border-b border-white/[0.04]" style={{ background: "#07070F" }}>
                      NJIRLAH Built-in · Free
                    </p>
                    {filteredRep.map((m) => {
                      const active = value === m.id && provider === "replit";
                      return (
                        <button key={m.id} onClick={() => select(m.id, "replit")}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-white/[0.03] transition-colors ${active ? "bg-violet-500/[0.07]" : ""}`}
                        >
                          <OpenAILogo size={12} className={active ? "text-violet-300" : "text-white/25"} />
                          <span className="flex-1 text-xs text-white/75 truncate">{m.name}</span>
                          {active && <Check size={10} className="text-violet-400 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Cloudflare */}
                {filteredCf.length > 0 && (
                  <div>
                    <p className="sticky top-0 px-3 py-1.5 text-[9px] font-mono font-bold tracking-widest uppercase text-orange-400/50 border-b border-white/[0.04]" style={{ background: "#07070F" }}>
                      Cloudflare · Free
                    </p>
                    {filteredCf.map((m) => {
                      const active = value === m.id && provider === "cloudflare";
                      return (
                        <button key={m.id} onClick={() => select(m.id, "cloudflare")}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-white/[0.03] transition-colors ${active ? "bg-orange-500/[0.06]" : ""}`}
                        >
                          <CloudflareLogo size={12} className={active ? "text-orange-300" : "text-white/25"} />
                          <span className="flex-1 text-xs text-white/75 truncate">{m.name || m.id.split("/").pop()}</span>
                          {active && <Check size={10} className="text-orange-400 flex-shrink-0" />}
                          {!active && <span className="text-[8px] text-green-400/50 border border-green-500/20 px-1 py-0.5 rounded font-mono">FREE</span>}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* OpenRouter */}
                {hasKey && filteredOr.length > 0 && (
                  <div>
                    <p className="sticky top-0 px-3 py-1.5 text-[9px] font-mono font-bold tracking-widest uppercase text-amber-400/50 border-b border-white/[0.04]" style={{ background: "#07070F" }}>
                      OpenRouter · 200+ Models
                    </p>
                    {filteredOr.map((m) => {
                      const active = value === m.id && provider === "openrouter";
                      const free = isModelFree(m);
                      return (
                        <button key={m.id} onClick={() => select(m.id, "openrouter")}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-white/[0.03] transition-colors ${active ? "bg-amber-500/[0.06]" : ""}`}
                        >
                          <span className="flex-shrink-0 opacity-70">{getProviderLogo(m.id, 12)}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white/75 truncate">{m.name || m.id}</p>
                            <p className="text-[9px] text-white/20 font-mono truncate">{m.id}</p>
                          </div>
                          {active
                            ? <Check size={10} className="text-amber-400 flex-shrink-0" />
                            : free
                            ? <span className="text-[8px] text-green-400/50 border border-green-500/20 px-1 py-0.5 rounded font-mono flex-shrink-0">FREE</span>
                            : null
                          }
                        </button>
                      );
                    })}
                  </div>
                )}

                {filteredRep.length === 0 && filteredCf.length === 0 && filteredOr.length === 0 && (
                  <p className="px-4 py-8 text-center text-xs text-white/20 font-mono">No models found</p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
