import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, Shield, Globe, Smartphone, Server, Code2, Check } from "lucide-react";

const PROVIDERS = [
  "OpenAI", "Anthropic", "Google Gemini", "Meta Llama", "Mistral", "DeepSeek",
  "Cloudflare AI", "Qwen", "Cohere", "Grok xAI", "Groq", "Together AI",
  "Fireworks AI", "NovitaAI", "SambaNova", "Cerebras", "Perplexity", "OpenRouter",
];

const FEATURES = [
  { icon: Globe,      label: "Website Dev",   desc: "React, Next.js, Astro, Vue, Svelte",     color: "#22d3ee" },
  { icon: Smartphone, label: "Mobile Dev",    desc: "React Native, Expo, Flutter, Swift",      color: "#f472b6" },
  { icon: Server,     label: "Full Stack",    desc: "Next.js + Prisma, FastAPI, NestJS, T3",   color: "#a78bfa" },
  { icon: Shield,     label: "BYOK",          desc: "Your keys. Never stored on our servers",  color: "#34d399" },
  { icon: Zap,        label: "50+ Models",   desc: "OpenRouter + Cloudflare + Built-in",       color: "#fbbf24" },
  { icon: Code2,      label: "Streaming",    desc: "Real-time token-by-token output",          color: "#60a5fa" },
];

const PERKS = [
  "No account required",
  "Keys encrypted locally",
  "Stream every response",
  "Three dev modes built-in",
];

const CODE_SNIPPET = `const { stream } = useChat({
  model: "claude-opus-4-5",
  provider: "openrouter",
  systemPrompt: "Website Dev mode",
});

// Build anything. Ship instantly.`;

export default function LandingPage() {
  const [codeVisible, setCodeVisible] = useState(0);

  useEffect(() => {
    const lines = CODE_SNIPPET.split("\n");
    if (codeVisible >= lines.length) return;
    const t = setTimeout(() => setCodeVisible((v) => v + 1), 120);
    return () => clearTimeout(t);
  }, [codeVisible]);

  const launch = () => {
    window.history.pushState({}, "", "/app");
    window.location.reload();
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: "#070711", color: "#fff" }}>

      {/* Ambient light */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-30"
          style={{ background: "radial-gradient(ellipse, rgba(109,40,217,0.35) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] opacity-15"
          style={{ background: "radial-gradient(ellipse, rgba(236,72,153,0.4) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] opacity-10"
          style={{ background: "radial-gradient(ellipse, rgba(34,211,238,0.4) 0%, transparent 70%)", filter: "blur(60px)" }} />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6d28d9, #a855f7)" }}>
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            NJIRLAH AI
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { window.history.pushState({}, "", "/templates"); window.location.reload(); }}
            className="text-sm text-white/40 hover:text-white/70 transition-colors font-medium"
          >
            Templates
          </button>
          <motion.button
            onClick={launch}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: "linear-gradient(135deg, #6d28d9, #7c3aed)" }}
          >
            Launch App
            <ArrowRight size={14} />
          </motion.button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 pt-16 pb-20 flex flex-col lg:flex-row items-center gap-16">
        {/* Left */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/[0.06] mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-xs font-mono text-violet-300/80 tracking-widest uppercase">50+ AI Models · Free to Start</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black leading-[1.05] mb-6 tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Code Anything.
              <br />
              <span style={{
                background: "linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #22d3ee 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                Ship Everything.
              </span>
            </h1>

            <p className="text-lg text-white/45 leading-relaxed mb-10 max-w-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              The AI coding platform built for vibe coders. One interface, 50+ models,
              Website, Mobile, and Full Stack modes. Your keys stay on your device.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-3 mb-10">
              <motion.button
                onClick={launch}
                whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(109,40,217,0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-white font-semibold text-base transition-all"
                style={{ background: "linear-gradient(135deg, #6d28d9, #7c3aed, #8b5cf6)" }}
              >
                <Zap size={16} />
                Start Vibing Free
              </motion.button>
              <motion.button
                onClick={() => { window.history.pushState({}, "", "/templates"); window.location.reload(); }}
                whileHover={{ borderColor: "rgba(255,255,255,0.18)" }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-white/[0.1] text-white/60 font-medium text-base transition-all"
              >
                Browse Templates
                <ArrowRight size={14} />
              </motion.button>
            </div>

            {/* Perks */}
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {PERKS.map((p) => (
                <div key={p} className="flex items-center gap-1.5 text-sm text-white/35">
                  <Check size={12} className="text-violet-400" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right — code preview */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 w-full max-w-lg"
        >
          <div className="rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl"
            style={{ background: "#0e0e1c" }}>
            {/* Chrome */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]" style={{ background: "#0b0b18" }}>
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-3 text-[11px] font-mono text-white/20">njirlah-app.tsx</span>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-violet-400/40 bg-violet-500/[0.08] px-2 py-0.5 rounded">TypeScript</span>
              </div>
            </div>
            {/* Code */}
            <div className="p-6 font-mono text-[13px] leading-7 min-h-[220px]">
              {CODE_SNIPPET.split("\n").slice(0, codeVisible).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex gap-4"
                >
                  <span className="text-white/15 select-none w-4 text-right flex-shrink-0 text-[11px] mt-0.5">{i + 1}</span>
                  <span className={
                    line.startsWith("//") ? "text-white/25" :
                    line.includes("const") || line.includes("model") || line.includes("provider") || line.includes("systemPrompt") ? "text-violet-300/90" :
                    line.includes('"') ? "text-emerald-300/80" :
                    "text-white/60"
                  }>{line || "\u00A0"}</span>
                </motion.div>
              ))}
              {codeVisible < CODE_SNIPPET.split("\n").length && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="inline-block w-0.5 h-4 bg-violet-400/70 ml-12 align-middle"
                />
              )}
            </div>
            {/* Status bar */}
            <div className="flex items-center justify-between px-5 py-2.5 border-t border-white/[0.04]" style={{ background: "#0b0b18" }}>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] font-mono text-white/20">streaming · 47 tok/s</span>
              </div>
              <span className="text-[10px] font-mono text-violet-400/35">NJIRLAH AI</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative z-10 border-y border-white/[0.04]" style={{ background: "rgba(255,255,255,0.01)" }}>
        <div className="max-w-6xl mx-auto px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { n: "50+",  l: "AI Models"        },
            { n: "3",    l: "Dev Platforms"     },
            { n: "0",    l: "Setup Required"    },
            { n: "100%", l: "Privacy Preserved" },
          ].map((s) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <p className="text-4xl font-black mb-1.5" style={{
                fontFamily: "'Space Grotesk', sans-serif",
                background: "linear-gradient(135deg, #a78bfa, #f472b6)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>{s.n}</p>
              <p className="text-sm text-white/35 font-medium">{s.l}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Provider marquee */}
      <section className="relative z-10 py-14">
        <p className="text-center text-[10px] font-mono text-white/20 tracking-[0.3em] uppercase mb-6">Supported Providers</p>
        <div className="relative overflow-hidden">
          <div className="absolute left-0 inset-y-0 w-24 z-10" style={{ background: "linear-gradient(90deg, #070711, transparent)" }} />
          <div className="absolute right-0 inset-y-0 w-24 z-10" style={{ background: "linear-gradient(-90deg, #070711, transparent)" }} />
          <motion.div
            animate={{ x: "-50%" }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="flex gap-3 whitespace-nowrap"
          >
            {[...PROVIDERS, ...PROVIDERS].map((p, i) => (
              <span key={i} className="flex-shrink-0 text-[11px] font-mono text-white/25 border border-white/[0.06] px-4 py-2 rounded-full hover:text-white/50 hover:border-white/[0.12] transition-colors cursor-default">{p}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl font-black mb-4" style={{
            fontFamily: "'Space Grotesk', sans-serif",
            background: "linear-gradient(135deg, #fff 0%, #a78bfa 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            Everything you need to ship
          </h2>
          <p className="text-white/40 max-w-md mx-auto">Purpose-built for developers who move fast and don't need fluff.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
              whileHover={{ y: -3 }}
              className="group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.015] cursor-default transition-all duration-300 hover:border-white/[0.1]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${f.color}15`, border: `1px solid ${f.color}25` }}>
                  <f.icon size={18} style={{ color: f.color }} />
                </div>
                <span className="text-xs font-mono font-bold tracking-widest uppercase"
                  style={{ color: `${f.color}80` }}>{f.label}</span>
              </div>
              <p className="text-[13px] text-white/45 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative p-14 rounded-3xl overflow-hidden border border-white/[0.07]"
          style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.1), rgba(236,72,153,0.05))" }}
        >
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(109,40,217,0.15), transparent 60%)" }} />
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-4" style={{
              fontFamily: "'Space Grotesk', sans-serif",
              background: "linear-gradient(135deg, #a78bfa, #ec4899, #22d3ee)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              Ready to vibe code?
            </h2>
            <p className="text-white/40 mb-10 text-lg">No signup. No credit card. Paste your API key and ship.</p>
            <motion.button
              onClick={launch}
              whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(109,40,217,0.45)" }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-white font-bold text-base transition-all"
              style={{ background: "linear-gradient(135deg, #6d28d9, #7c3aed)" }}
            >
              <Zap size={18} />
              Start Vibing Free
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.05] py-8 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6d28d9, #a855f7)" }}>
              <Zap size={10} className="text-white" />
            </div>
            <span className="text-sm font-bold text-white/40" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>NJIRLAH AI</span>
          </div>
          <p className="text-[11px] font-mono text-white/20">© 2025 · Built with React, Vite, Tailwind CSS</p>
          <p className="text-[11px] font-mono text-white/20">All data stays on your device</p>
        </div>
      </footer>
    </div>
  );
}
