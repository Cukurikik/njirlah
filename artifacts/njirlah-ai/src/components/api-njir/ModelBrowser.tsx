import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Copy, Check, ChevronDown, ChevronUp, Layers, Filter } from "lucide-react";
import {
  OR_MODELS, OR_PROVIDERS, OR_TAGS, TIER_LABEL, TIER_COLOR, formatContext,
  type ORModel,
} from "@/data/openrouter-models";

const TIERS = ["free", "cheap", "mid", "premium"] as const;
const PAGE_SIZE = 24;

function ModelCard({ model, onCopy }: { model: ORModel; onCopy: (id: string) => void }) {
  const [copied, setCopied] = useState(false);
  const tier = TIER_COLOR[model.tier];

  const copy = useCallback(() => {
    navigator.clipboard.writeText(model.id);
    setCopied(true);
    onCopy(model.id);
    setTimeout(() => setCopied(false), 2000);
  }, [model.id, onCopy]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className="group relative rounded-xl p-4 cursor-pointer transition-all"
      style={{
        background: "rgba(255,255,255,0.018)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
      whileHover={{ borderColor: "rgba(139,92,246,0.2)", backgroundColor: "rgba(139,92,246,0.04)" }}
    >
      {/* Provider + Tier row */}
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[9px] font-mono font-bold text-white/30 uppercase tracking-wider">{model.provider}</span>
        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full"
          style={{ color: tier.text, background: tier.bg, border: `1px solid ${tier.border}` }}>
          {TIER_LABEL[model.tier]}
        </span>
      </div>

      {/* Model name */}
      <p className="text-[12.5px] font-semibold text-white/80 mb-1 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {model.name}
      </p>

      {/* Description */}
      <p className="text-[10.5px] text-white/35 leading-relaxed mb-3 line-clamp-2">{model.description}</p>

      {/* Context + Tags */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-mono text-white/25 flex items-center gap-1">
            <Layers size={8} /> {formatContext(model.context)}
          </span>
          {model.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[9px] font-mono text-white/20 px-1.5 py-0.5 rounded"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Copy button */}
        <motion.button
          onClick={copy}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="opacity-0 group-hover:opacity-100 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono transition-all"
          style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", color: "rgba(167,139,250,0.9)" }}
          title="Copy model ID"
        >
          {copied ? <Check size={9} className="text-emerald-400" /> : <Copy size={9} />}
          {copied ? "Copied!" : "Copy ID"}
        </motion.button>
      </div>

      {/* Model ID tooltip on hover */}
      <div className="mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-[9px] font-mono text-white/25 truncate">{model.id}</p>
      </div>
    </motion.div>
  );
}

export function ModelBrowser() {
  const [query, setQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedTiers, setSelectedTiers] = useState<Set<string>>(new Set());
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [lastCopied, setLastCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return OR_MODELS.filter((m) => {
      if (q && !m.name.toLowerCase().includes(q) && !m.id.toLowerCase().includes(q) && !m.provider.toLowerCase().includes(q) && !m.description.toLowerCase().includes(q)) return false;
      if (selectedProvider && m.provider !== selectedProvider) return false;
      if (selectedTiers.size > 0 && !selectedTiers.has(m.tier)) return false;
      if (selectedTags.size > 0 && ![...selectedTags].every((t) => m.tags.includes(t))) return false;
      return true;
    });
  }, [query, selectedProvider, selectedTiers, selectedTags]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = filtered.length > visible.length;

  const toggleTier = (t: string) => {
    setSelectedTiers((prev) => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });
    setPage(1);
  };

  const toggleTag = (t: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });
    setPage(1);
  };

  const clearAll = () => {
    setQuery("");
    setSelectedProvider(null);
    setSelectedTiers(new Set());
    setSelectedTags(new Set());
    setPage(1);
  };

  const hasFilters = query || selectedProvider || selectedTiers.size > 0 || selectedTags.size > 0;
  const activeFilterCount = (selectedProvider ? 1 : 0) + selectedTiers.size + selectedTags.size;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(139,92,246,0.1)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4" style={{ background: "rgba(139,92,246,0.04)", borderBottom: "1px solid rgba(139,92,246,0.08)" }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}>
          <Search size={14} className="text-violet-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white/80">Model Browser</p>
          <p className="text-[11px] text-white/30 font-mono mt-0.5">{OR_MODELS.length} model tersedia via OpenRouter</p>
        </div>
        <span className="text-[10px] font-mono font-bold text-violet-400/70 px-2.5 py-1 rounded-full flex-shrink-0"
          style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
          {filtered.length} hasil
        </span>
      </div>

      <div className="p-5 space-y-4" style={{ background: "rgba(5,5,12,0.6)" }}>
        {/* Search + Filter toggle row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Cari model, provider, atau kemampuan…"
              className="w-full pl-9 pr-10 py-2.5 rounded-xl text-[12.5px] text-white/75 placeholder-white/25 focus:outline-none transition-all"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
            {query && (
              <button onClick={() => { setQuery(""); setPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                <X size={12} />
              </button>
            )}
          </div>

          <motion.button
            onClick={() => setShowFilters((v) => !v)}
            whileTap={{ scale: 0.96 }}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-mono transition-all flex-shrink-0"
            style={showFilters || activeFilterCount > 0
              ? { background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)", color: "rgba(196,181,253,0.9)" }
              : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}>
            <Filter size={12} />
            Filter
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                style={{ background: "rgba(139,92,246,0.5)", color: "rgba(196,181,253,1)" }}>
                {activeFilterCount}
              </span>
            )}
            {showFilters ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </motion.button>

          {hasFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={clearAll}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-2.5 rounded-xl text-[11px] font-mono text-white/35 hover:text-white/60 transition-all flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              Reset
            </motion.button>
          )}
        </div>

        {/* Filters panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)" }}>
                {/* Provider filter */}
                <div>
                  <p className="text-[10px] font-mono font-bold text-white/25 uppercase tracking-wider mb-2">Provider</p>
                  <div className="flex flex-wrap gap-1.5">
                    {OR_PROVIDERS.map((p) => (
                      <button key={p} onClick={() => { setSelectedProvider(selectedProvider === p ? null : p); setPage(1); }}
                        className="text-[10.5px] font-mono px-2.5 py-1 rounded-lg transition-all"
                        style={selectedProvider === p
                          ? { background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.35)", color: "rgba(196,181,253,0.9)" }
                          : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tier filter */}
                <div>
                  <p className="text-[10px] font-mono font-bold text-white/25 uppercase tracking-wider mb-2">Harga</p>
                  <div className="flex flex-wrap gap-1.5">
                    {TIERS.map((tier) => {
                      const c = TIER_COLOR[tier];
                      const active = selectedTiers.has(tier);
                      return (
                        <button key={tier} onClick={() => toggleTier(tier)}
                          className="text-[10.5px] font-mono px-2.5 py-1 rounded-lg transition-all"
                          style={active
                            ? { background: c.bg, border: `1px solid ${c.border}`, color: c.text }
                            : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}>
                          {TIER_LABEL[tier]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tag filter */}
                <div>
                  <p className="text-[10px] font-mono font-bold text-white/25 uppercase tracking-wider mb-2">Kemampuan</p>
                  <div className="flex flex-wrap gap-1.5">
                    {OR_TAGS.map((tag) => {
                      const active = selectedTags.has(tag);
                      return (
                        <button key={tag} onClick={() => toggleTag(tag)}
                          className="text-[10.5px] font-mono px-2.5 py-1 rounded-lg transition-all"
                          style={active
                            ? { background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.3)", color: "rgba(103,232,249,0.9)" }
                            : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)" }}>
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Last copied toast */}
        <AnimatePresence>
          {lastCopied && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-mono"
              style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.18)", color: "rgba(74,222,128,0.85)" }}>
              <Check size={12} />
              <span>Tersalin: <span className="opacity-70">{lastCopied}</span></span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <Search size={28} className="mx-auto mb-3 text-white/10" />
            <p className="text-sm text-white/25 font-mono">Tidak ada model ditemukan</p>
            <p className="text-[11px] text-white/15 font-mono mt-1">Coba ubah filter atau kata kunci pencarian</p>
            <button onClick={clearAll} className="mt-4 text-[11px] font-mono text-violet-400/60 hover:text-violet-400 transition-colors">
              Reset semua filter →
            </button>
          </motion.div>
        ) : (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            >
              <AnimatePresence mode="popLayout">
                {visible.map((model) => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    onCopy={(id) => {
                      setLastCopied(id);
                      setTimeout(() => setLastCopied(null), 3000);
                    }}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {hasMore && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center pt-2">
                <motion.button
                  onClick={() => setPage((p) => p + 1)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-2.5 rounded-xl text-[12px] font-mono font-medium transition-all"
                  style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)", color: "rgba(196,181,253,0.8)" }}>
                  Tampilkan lebih banyak ({filtered.length - visible.length} tersisa)
                </motion.button>
              </motion.div>
            )}

            <p className="text-center text-[10px] font-mono text-white/15 pt-1">
              Menampilkan {visible.length} dari {filtered.length} model · Klik "Copy ID" untuk menggunakan di chat
            </p>
          </>
        )}
      </div>
    </div>
  );
}
