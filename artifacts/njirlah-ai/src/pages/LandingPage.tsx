import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { Zap, Shield, Globe, Code2, Smartphone, Server, ChevronRight, Star } from "lucide-react";
import { NJIRLAHLogo } from "@/components/layout/NJIRLAHLogo";

const STATS = [
  { value: "50+", label: "AI Models" },
  { value: "3", label: "Platforms" },
  { value: "0", label: "Setup Needed" },
  { value: "∞", label: "Vibes" },
];

const FEATURES = [
  { icon: <Zap size={18} />, title: "All LLMs", desc: "OpenRouter + Cloudflare unified under one interface", color: "text-yellow-400", border: "hover:border-yellow-500/20", badge: "50+ Models" },
  { icon: <Shield size={18} />, title: "BYOK", desc: "Your keys, your privacy. AES-256 encrypted locally", color: "text-green-400", border: "hover:border-green-500/20", badge: "Privacy First" },
  { icon: <Globe size={18} />, title: "Web Dev", desc: "React, Next.js, Astro, SvelteKit, Vue and more", color: "text-cyan-400", border: "hover:border-cyan-500/20", badge: "Website" },
  { icon: <Smartphone size={18} />, title: "Mobile Dev", desc: "React Native, Expo, Flutter, Swift, Kotlin", color: "text-pink-400", border: "hover:border-pink-500/20", badge: "Mobile" },
  { icon: <Server size={18} />, title: "Full Stack", desc: "Next.js + Prisma, FastAPI, NestJS, T3 Stack", color: "text-violet-400", border: "hover:border-violet-500/20", badge: "Backend" },
  { icon: <Code2 size={18} />, title: "Vibe Mode", desc: "Natural language to production code, instantly", color: "text-orange-400", border: "hover:border-orange-500/20", badge: "AI Native" },
];

const PROVIDERS = [
  "OpenAI", "Anthropic", "Google", "Meta", "Mistral", "DeepSeek",
  "Cloudflare", "Qwen", "Cohere", "Perplexity", "xAI", "Llama",
  "Groq", "Together", "Fireworks", "NovitaAI", "SambaNova", "Cerebras",
];

const CODE_LINES = [
  { lang: "tsx", code: `// NJIRLAH AI — Vibe Coding Platform` },
  { lang: "tsx", code: `import { useChat } from '@njirlah/ai'` },
  { lang: "tsx", code: `` },
  { lang: "tsx", code: `const { messages, send } = useChat({` },
  { lang: "tsx", code: `  model: 'claude-opus-4',` },
  { lang: "tsx", code: `  provider: 'openrouter',` },
  { lang: "tsx", code: `  stream: true,` },
  { lang: "tsx", code: `})` },
  { lang: "tsx", code: `` },
  { lang: "tsx", code: `// Ship production code instantly ✓` },
];

function OrbBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #7c4dff 0%, transparent 70%)", filter: "blur(80px)" }}
      />
      <motion.div
        animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #ff4d9e 0%, transparent 70%)", filter: "blur(80px)" }}
      />
      <motion.div
        animate={{ y: [-15, 15, -15], x: [-5, 5, -5] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #00e5ff 0%, transparent 70%)", filter: "blur(80px)" }}
      />
      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/3 left-1/2 w-[300px] h-[300px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #00ff88 0%, transparent 70%)", filter: "blur(80px)" }}
      />
      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(rgba(124,77,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(124,77,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}

function AnimatedCodePreview() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines >= CODE_LINES.length) return;
    const timer = setTimeout(() => setVisibleLines((v) => v + 1), 180);
    return () => clearTimeout(timer);
  }, [visibleLines]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto max-w-lg rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl"
      style={{ background: "#0d0d1a" }}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]" style={{ background: "#09091a" }}>
        <div className="w-3 h-3 rounded-full bg-red-500/70" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <div className="w-3 h-3 rounded-full bg-green-500/70" />
        <span className="ml-2 text-[11px] font-mono text-white/25">njirlah-ai.tsx</span>
        <span className="ml-auto text-[10px] font-mono text-violet-400/50">TypeScript</span>
      </div>
      {/* Code */}
      <div className="p-5 font-mono text-[12px] leading-relaxed min-h-[220px]">
        {CODE_LINES.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="flex"
          >
            <span className="w-6 text-white/15 select-none flex-shrink-0 text-right mr-4">{i + 1}</span>
            <span className={`${
              line.code.startsWith("//") ? "text-white/25" :
              line.code.includes("'") ? "text-white/70" :
              line.code.includes("import") || line.code.includes("const") ? "text-violet-400" :
              line.code.includes(":") ? "text-cyan-400/80" :
              "text-white/60"
            }`}>
              {line.code || "\u00A0"}
            </span>
          </motion.div>
        ))}
        {visibleLines < CODE_LINES.length && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block w-[2px] h-4 bg-violet-400/70 ml-1 align-middle"
          />
        )}
      </div>
    </motion.div>
  );
}

function ProviderMarquee() {
  const doubled = [...PROVIDERS, ...PROVIDERS];
  return (
    <div className="relative overflow-hidden py-4">
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10" style={{ background: "linear-gradient(90deg, #050508, transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10" style={{ background: "linear-gradient(-90deg, #050508, transparent)" }} />
      <motion.div
        animate={{ x: "-50%" }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex gap-6 whitespace-nowrap"
      >
        {doubled.map((p, i) => (
          <span key={i} className="text-[11px] font-mono text-white/20 border border-white/[0.06] px-3 py-1.5 rounded-full flex-shrink-0 hover:text-white/45 hover:border-white/[0.12] transition-colors cursor-default">
            {p}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotX = useSpring(y, { stiffness: 200, damping: 20 });
  const rotY = useSpring(x, { stiffness: 200, damping: 20 });

  return (
    <motion.div
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(((e.clientX - r.left) / r.width - 0.5) * 12);
        y.set(-((e.clientY - r.top) / r.height - 0.5) * 12);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function LandingPage() {
  const [badgeVisible, setBadgeVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setBadgeVisible((v) => !v), 3000);
    return () => clearInterval(timer);
  }, []);

  const goToApp = () => {
    window.history.pushState({}, "", "/app");
    window.location.reload();
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden"
      style={{ background: "#050508", color: "#fff" }}
    >
      <OrbBackground />

      {/* Noise texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.025] z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <NJIRLAHLogo size={24} showText />
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-[11px] font-mono text-white/30">v1.0.0</span>
          <motion.button
            onClick={goToApp}
            whileHover={{ scale: 1.04, backgroundColor: "rgba(124,77,255,0.9)" }}
            whileTap={{ scale: 0.96 }}
            className="px-4 py-2 rounded-lg bg-violet-600/80 text-white text-[12px] font-semibold transition-colors"
          >
            Launch App →
          </motion.button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-6 pt-12 pb-16 max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/25 bg-violet-500/[0.07] mb-8"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={String(badgeVisible)}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.3 }}
              className="text-[11px] font-mono text-violet-300 tracking-widest uppercase"
            >
              {badgeVisible ? "⚡ Powered by 50+ AI Models" : "🚀 Ship Production Code Instantly"}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        {/* Headline */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          {["Code Anything.", "Ship Everything."].map((word, i) => (
            <motion.div key={i} variants={fadeUp}>
              <h1
                className="text-5xl sm:text-7xl font-black leading-none tracking-tight"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  background: i === 0
                    ? "linear-gradient(135deg, #fff 0%, #c4b5fd 50%, #fff 100%)"
                    : "linear-gradient(135deg, #7c4dff, #ff4d9e, #00e5ff, #00ff88)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {word}
              </h1>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-base sm:text-lg text-white/40 max-w-xl mx-auto mb-10 leading-relaxed"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          The AI coding platform that actually ships. One interface for 50+ models,
          Website + Mobile + Full Stack development, with your own keys.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <motion.button
            onClick={goToApp}
            whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(124,77,255,0.4)" }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white font-semibold text-sm shadow-lg transition-all"
          >
            <Zap size={16} />
            Start Vibing Free
            <ChevronRight size={15} />
          </motion.button>
          <motion.button
            onClick={() => { window.history.pushState({}, "", "/app"); window.location.reload(); }}
            whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.15)" }}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/[0.08] text-white/55 text-sm font-medium transition-all"
          >
            <Star size={14} />
            View Templates
          </motion.button>
        </motion.div>
      </section>

      {/* Stats row */}
      <section className="relative z-10 max-w-2xl mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="grid grid-cols-4 gap-4"
        >
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div
                className="text-3xl font-black mb-1"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  background: "linear-gradient(135deg, #7c4dff, #ff4d9e)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {s.value}
              </div>
              <div className="text-[11px] font-mono text-white/30 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Code preview */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 mb-20">
        <AnimatedCodePreview />
      </section>

      {/* Provider marquee */}
      <section className="relative z-10 mb-20">
        <p className="text-center text-[10px] font-mono text-white/15 tracking-[0.3em] uppercase mb-4">
          Supported Providers
        </p>
        <ProviderMarquee />
      </section>

      {/* Feature cards */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2
            className="text-3xl sm:text-4xl font-black mb-3"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              background: "linear-gradient(135deg, #fff 0%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Everything you need to ship
          </h2>
          <p className="text-white/35 font-mono text-sm">No BS, no setup, just code</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ perspective: 1000 }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <TiltCard
                className={`h-full p-5 rounded-2xl border border-white/[0.07] bg-white/[0.015] cursor-default transition-all duration-300 ${f.border}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] ${f.color}`}>
                    {f.icon}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-white/25 border border-white/[0.07] px-2 py-1 rounded-full">
                    {f.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white/80 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {f.title}
                </h3>
                <p className="text-[13px] text-white/35 leading-relaxed">{f.desc}</p>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA bottom */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative p-10 rounded-3xl border border-violet-500/20 overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(124,77,255,0.08), rgba(255,77,158,0.04))" }}
        >
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: "radial-gradient(circle at 50% 50%, #7c4dff 0%, transparent 70%)",
            }}
          />
          <h2 className="text-3xl font-black mb-3 relative z-10"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              background: "linear-gradient(135deg, #7c4dff, #ff4d9e, #00e5ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Ready to vibe code?
          </h2>
          <p className="text-white/40 mb-8 relative z-10">
            No signup. No credit card. Just paste your API key and ship.
          </p>
          <motion.button
            onClick={goToApp}
            whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(124,77,255,0.5)" }}
            whileTap={{ scale: 0.96 }}
            className="relative z-10 inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-r from-violet-600 via-violet-500 to-purple-600 text-white font-bold text-base shadow-2xl transition-all"
          >
            <Zap size={18} />
            Start Vibing Free
            <ChevronRight size={16} />
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.05] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <NJIRLAHLogo size={18} showText />
          <p className="text-[11px] font-mono text-white/15">
            Built with React · Vite · Tailwind CSS · Framer Motion
          </p>
          <p className="text-[11px] font-mono text-white/15">
            © 2025 NJIRLAH AI · All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
