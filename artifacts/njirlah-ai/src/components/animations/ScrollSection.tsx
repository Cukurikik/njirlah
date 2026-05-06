import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useVelocity,
  useMotionValue,
  useInView,
} from "framer-motion";

function SectionHeader({ id, title, sub }: { id: string; title: string; sub: string }) {
  return (
    <div id={id} className="mb-8">
      <h2 className="text-2xl font-bold mb-1" style={{ color: "#e4e4e7" }}>{title}</h2>
      <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{sub}</p>
    </div>
  );
}

function AnimCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(255,255,255,0.025)", borderColor: "rgba(255,255,255,0.07)" }}>
      <div className="px-4 pt-4 pb-1">
        <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>{title}</span>
      </div>
      <div className="flex items-center justify-center p-4 min-h-36">{children}</div>
    </div>
  );
}

function ScrollRevealDemo() {
  const cards = ["Card A", "Card B", "Card C", "Card D"];
  return (
    <AnimCard title="Scroll Direction: Reveal on Scroll">
      <div className="w-full max-h-40 overflow-y-auto flex flex-col gap-2 pr-1" style={{ scrollbarWidth: "none" }}>
        <p className="text-xs text-center mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>↓ Scroll inside</p>
        {cards.map((label, i) => {
          const ref = useRef<HTMLDivElement>(null);
          const inView = useInView(ref, { amount: 0.5 });
          return (
            <motion.div
              key={label}
              ref={ref}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="px-3 py-2 rounded-xl text-xs font-medium"
              style={{ background: `hsl(${i * 60 + 200}, 50%, 25%)`, color: `hsl(${i * 60 + 200}, 70%, 70%)` }}
            >
              {label}
            </motion.div>
          );
        })}
        <div className="h-8" />
      </div>
    </AnimCard>
  );
}

function ScrollZoomHeroDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.4, 1, 1, 0.4]);
  return (
    <AnimCard title="Scroll Zoom Hero">
      <div ref={ref} className="w-full h-28 overflow-hidden rounded-xl relative">
        <motion.div
          style={{ scale, opacity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            className="w-full h-full flex items-center justify-center rounded-xl"
            style={{ background: "linear-gradient(135deg, rgba(158,158,255,0.15), rgba(141,240,204,0.1))" }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: "#9E9EFF" }}>HERO</div>
              <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Scales on scroll</div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimCard>
  );
}

function ScrollImageRevealDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.4"] });
  const clipRight = useTransform(scrollYProgress, [0, 1], ["100%", "0%"]);

  return (
    <AnimCard title="Scroll Image Reveal">
      <div ref={ref} className="relative w-full h-24 rounded-xl overflow-hidden">
        <div
          className="absolute inset-0 rounded-xl"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>Base layer</div>
        </div>
        <motion.div
          className="absolute inset-0 rounded-xl flex items-center justify-center"
          style={{
            clipPath: clipRight.get() === "0%" ? "inset(0 0 0 0)" : `inset(0 ${clipRight.get()} 0 0)`,
            background: "linear-gradient(135deg, rgba(158,158,255,0.25), rgba(141,240,204,0.2))",
          }}
        >
          <motion.div
            style={{ clipPath: useTransform(clipRight, (v) => `inset(0 ${v} 0 0)`) }}
            className="absolute inset-0 rounded-xl flex items-center justify-center"
          >
            <span className="text-sm font-bold" style={{ color: "#9E9EFF" }}>Revealed ✨</span>
          </motion.div>
        </motion.div>
      </div>
    </AnimCard>
  );
}

function ScrollVelocity3DDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { stiffness: 50, damping: 10 });
  const rotateX = useTransform(smoothVelocity, [-1000, 0, 1000], [25, 0, -25]);

  const planes = [
    { z: 0, color: "#9E9EFF", label: "Front" },
    { z: -30, color: "#8DF0CC", label: "Mid" },
    { z: -60, color: "#ffa828", label: "Back" },
  ];

  return (
    <AnimCard title="Scroll Velocity: 3D Planes">
      <div style={{ perspective: "500px" }}>
        <motion.div
          style={{ rotateX, transformStyle: "preserve-3d" }}
          className="relative flex flex-col gap-2"
        >
          {planes.map((p) => (
            <motion.div
              key={p.label}
              style={{ translateZ: p.z }}
              className="px-8 py-2 rounded-lg text-xs font-bold text-center"
              style={{ background: `${p.color}20`, border: `1px solid ${p.color}50`, color: p.color, translateZ: p.z }}
            >
              {p.label} Plane
            </motion.div>
          ))}
        </motion.div>
        <p className="text-xs mt-2 text-center" style={{ color: "rgba(255,255,255,0.3)" }}>Tilts with scroll velocity</p>
      </div>
    </AnimCard>
  );
}

function HideHeaderDemo() {
  const [lastY, setLastY] = useState(0);
  const [visible, setVisible] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const y = el.scrollTop;
    setVisible(y < lastY || y < 10);
    setLastY(y);
  };

  return (
    <AnimCard title="Scroll Direction: Hide Header">
      <div className="relative w-full h-36 overflow-hidden rounded-xl" style={{ background: "rgba(0,0,0,0.2)" }}>
        <motion.div
          animate={{ y: visible ? 0 : -40 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute top-0 left-0 right-0 z-10 px-3 py-2 text-xs font-medium flex items-center gap-2"
          style={{ background: "rgba(5,5,10,0.9)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <span style={{ color: "#9E9EFF" }}>↕</span>
          <span style={{ color: "rgba(255,255,255,0.6)" }}>Header — scroll inside</span>
        </motion.div>
        <div
          ref={ref}
          onScroll={handleScroll}
          className="absolute inset-0 overflow-y-auto pt-10"
          style={{ scrollbarWidth: "none" }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-3 py-2 text-xs border-b" style={{ color: "rgba(255,255,255,0.3)", borderColor: "rgba(255,255,255,0.04)" }}>
              Content row {i + 1}
            </div>
          ))}
        </div>
      </div>
    </AnimCard>
  );
}

export function ScrollSection() {
  return (
    <section>
      <SectionHeader
        id="scroll"
        title="Scroll Animations"
        sub="Reveal on scroll, zoom hero, image reveal, velocity 3D planes, and hide header"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ScrollRevealDemo />
        <ScrollZoomHeroDemo />
        <ScrollImageRevealDemo />
        <ScrollVelocity3DDemo />
        <HideHeaderDemo />
      </div>
    </section>
  );
}
