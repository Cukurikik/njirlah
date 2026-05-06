import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

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

function SplitTextDemo() {
  const [key, setKey] = useState(0);
  const text = "Split Text";
  return (
    <AnimCard title="Split Text">
      <div className="flex flex-col items-center gap-4">
        <div className="flex overflow-hidden">
          {text.split("").map((char, i) => (
            <motion.span
              key={`${key}-${i}`}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.06, type: "spring", stiffness: 300, damping: 18 }}
              className="text-2xl font-bold"
              style={{ color: char === " " ? "transparent" : `hsl(${i * 30 + 200}, 70%, 70%)`, display: "inline-block" }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setKey((k) => k + 1)}
          className="text-xs px-3 py-1 rounded-full border cursor-pointer"
          style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)" }}
        >
          Replay
        </motion.button>
      </div>
    </AnimCard>
  );
}

function FillTextDemo() {
  const [key, setKey] = useState(0);
  return (
    <AnimCard title="Fill Text">
      <div className="flex flex-col items-center gap-4">
        <svg viewBox="0 0 180 40" width="180" height="40">
          <defs>
            <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9E9EFF" />
              <stop offset="100%" stopColor="#8DF0CC" />
            </linearGradient>
          </defs>
          <text
            x="90" y="30"
            textAnchor="middle"
            fontSize="28"
            fontWeight="bold"
            fill="none"
            stroke="url(#textGrad)"
            strokeWidth="0.5"
            style={{ fontFamily: "system-ui" }}
          >
            NJIRLAH
          </text>
          <motion.text
            key={key}
            x="90" y="30"
            textAnchor="middle"
            fontSize="28"
            fontWeight="bold"
            fill="url(#textGrad)"
            style={{ fontFamily: "system-ui" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.01 }}
          >
            <animate
              attributeName="clip-path"
              from="inset(0 100% 0 0)"
              to="inset(0 0% 0 0)"
              dur="1.5s"
              begin={`${key * 0.001}s`}
              fill="freeze"
            />
            NJIRLAH
          </motion.text>
        </svg>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setKey((k) => k + 1)}
          className="text-xs px-3 py-1 rounded-full border cursor-pointer"
          style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)" }}
        >
          Replay
        </motion.button>
      </div>
    </AnimCard>
  );
}

function PathDrawingDemo() {
  const [key, setKey] = useState(0);
  return (
    <AnimCard title="Path Drawing">
      <div className="flex flex-col items-center gap-4">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <motion.path
            key={key}
            d="M10 40 C10 20, 30 10, 40 10 C50 10, 70 20, 70 40 C70 60, 50 70, 40 70 C30 70, 10 60, 10 40 Z"
            fill="none"
            stroke="#9E9EFF"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          <motion.path
            key={`inner-${key}`}
            d="M25 40 L35 52 L55 28"
            fill="none"
            stroke="#8DF0CC"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, delay: 1.2, ease: "easeOut" }}
          />
        </svg>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setKey((k) => k + 1)}
          className="text-xs px-3 py-1 rounded-full border cursor-pointer"
          style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)" }}
        >
          Replay
        </motion.button>
      </div>
    </AnimCard>
  );
}

function MotionAlongPathDemo() {
  const pathId = "motionPath1";
  return (
    <AnimCard title="Motion Along a Path">
      <svg width="140" height="80" viewBox="0 0 140 80">
        <path
          id={pathId}
          d="M10 60 Q35 10, 70 40 Q105 70, 130 20"
          fill="none"
          stroke="rgba(158,158,255,0.25)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <motion.circle
          r="5"
          fill="#9E9EFF"
          filter="url(#glow1)"
        >
          <animateMotion dur="2s" repeatCount="indefinite" rotate="auto">
            <mpath href={`#${pathId}`} />
          </animateMotion>
        </motion.circle>
        <defs>
          <filter id="glow1">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
      </svg>
    </AnimCard>
  );
}

function ParallaxDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const y3 = useTransform(scrollYProgress, [0, 1], [20, -20]);
  return (
    <AnimCard title="Parallax">
      <div ref={ref} className="relative w-full h-24 overflow-hidden rounded-xl" style={{ background: "rgba(0,0,0,0.3)" }}>
        <motion.div style={{ y: y3 }} className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-8 rounded-full opacity-10" style={{ background: "#9E9EFF" }} />
        </motion.div>
        <motion.div style={{ y: y2 }} className="absolute inset-0 flex items-end justify-start pl-4 pb-2">
          <span className="text-xs" style={{ color: "rgba(141,240,204,0.6)" }}>BG Layer</span>
        </motion.div>
        <motion.div style={{ y: y1 }} className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold" style={{ color: "#e4e4e7" }}>Scroll me</span>
        </motion.div>
        <motion.div style={{ y: y3 }} className="absolute top-2 right-4">
          <span className="text-lg">✦</span>
        </motion.div>
      </div>
    </AnimCard>
  );
}

function TiltCardDemo() {
  const cardX = useState(0)[0];
  const cardY = useState(0)[0];
  const rotateX = useState(() => 0)[0];
  const rotateY = useState(() => 0)[0];
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -y * 20, ry: x * 20 });
  };

  return (
    <AnimCard title="Tilt Card">
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
        style={{ perspective: "600px" }}
      >
        <motion.div
          animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-32 h-20 rounded-xl flex items-center justify-center cursor-pointer"
          style={{
            background: "linear-gradient(135deg, rgba(158,158,255,0.2), rgba(141,240,204,0.2))",
            border: "1px solid rgba(158,158,255,0.3)",
            transformStyle: "preserve-3d",
          }}
        >
          <span className="text-sm font-semibold" style={{ color: "#9E9EFF" }}>Tilt me</span>
        </motion.div>
      </div>
    </AnimCard>
  );
}

export function TextSection() {
  return (
    <section>
      <SectionHeader
        id="text"
        title="Text & Path Animations"
        sub="Split text, fill text, path drawing, motion along path, parallax, and tilt card"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SplitTextDemo />
        <FillTextDemo />
        <PathDrawingDemo />
        <MotionAlongPathDemo />
        <ParallaxDemo />
        <TiltCardDemo />
      </div>
    </section>
  );
}
