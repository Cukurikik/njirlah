import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, LayoutGroup } from "framer-motion";

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

function FollowPointerSpringDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(80);
  const rawY = useMotionValue(60);
  const x = useSpring(rawX, { stiffness: 80, damping: 14 });
  const y = useSpring(rawY, { stiffness: 80, damping: 14 });

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set(e.clientX - rect.left - 12);
    rawY.set(e.clientY - rect.top - 12);
  };

  return (
    <AnimCard title="Follow Pointer with Spring">
      <div
        ref={ref}
        onMouseMove={handleMove}
        className="relative w-48 h-28 rounded-xl overflow-hidden"
        style={{ background: "rgba(0,0,0,0.3)", cursor: "none" }}
      >
        <motion.div
          style={{ x, y }}
          className="absolute w-6 h-6 rounded-full pointer-events-none"
          style={{ background: "#9E9EFF", x, y, boxShadow: "0 0 12px #9E9EFF" }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Move cursor inside</span>
        </div>
      </div>
    </AnimCard>
  );
}

function PathMorphingDemo() {
  const [morphed, setMorphed] = useState(false);
  const paths = {
    circle: "M 60 30 A 30 30 0 1 1 59.99 30 Z",
    star: "M 60 10 L 70 40 L 100 40 L 75 58 L 83 88 L 60 70 L 37 88 L 45 58 L 20 40 L 50 40 Z",
    heart: "M 60 80 C 20 60, 10 30, 30 20 C 45 12, 60 28, 60 28 C 60 28, 75 12, 90 20 C 110 30, 100 60, 60 80 Z",
  };
  const pathKeys = Object.keys(paths) as (keyof typeof paths)[];
  const [pathIdx, setPathIdx] = useState(0);

  return (
    <AnimCard title="Path Morphing">
      <div className="flex flex-col items-center gap-3">
        <svg width="120" height="100" viewBox="0 0 120 100">
          <motion.path
            d={paths[pathKeys[pathIdx]]}
            fill="rgba(158,158,255,0.25)"
            stroke="#9E9EFF"
            strokeWidth="2"
            animate={{ d: paths[pathKeys[pathIdx]] }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </svg>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setPathIdx((i) => (i + 1) % pathKeys.length)}
          className="text-xs px-3 py-1 rounded-full border cursor-pointer"
          style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)" }}
        >
          Morph → {pathKeys[(pathIdx + 1) % pathKeys.length]}
        </motion.button>
      </div>
    </AnimCard>
  );
}

function LayoutAnimationDemo() {
  const [layout, setLayout] = useState<"row" | "grid">("row");
  const items = ["A", "B", "C", "D", "E", "F"];
  return (
    <AnimCard title="Layout Animation">
      <div className="flex flex-col items-center gap-3 w-full">
        <LayoutGroup>
          <div className={`flex ${layout === "grid" ? "flex-wrap justify-center" : "flex-row"} gap-2 transition-none`} style={{ maxWidth: 180 }}>
            {items.map((item) => (
              <motion.div
                key={item}
                layout
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                className="flex items-center justify-center rounded-lg font-bold text-sm"
                style={{
                  width: layout === "grid" ? 40 : 28,
                  height: layout === "grid" ? 40 : 28,
                  background: `hsl(${item.charCodeAt(0) * 30}, 60%, 40%)`,
                  color: "white",
                }}
              >
                {item}
              </motion.div>
            ))}
          </div>
        </LayoutGroup>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setLayout((l) => (l === "row" ? "grid" : "row"))}
          className="text-xs px-3 py-1 rounded-full border cursor-pointer"
          style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)" }}
        >
          Toggle Layout
        </motion.button>
      </div>
    </AnimCard>
  );
}

function ScrollVelocityTextDemo() {
  const [key, setKey] = useState(0);
  const text = "NJIRLAH AI • ANIMATION • MOTION • GSAP • SPRING • ";
  return (
    <AnimCard title="Scroll Velocity Text">
      <div className="w-full overflow-hidden rounded-lg" style={{ height: 32, position: "relative" }}>
        <motion.div
          key={key}
          className="flex whitespace-nowrap absolute"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          style={{ color: "#9E9EFF", fontSize: 13, fontWeight: 700, letterSpacing: 1 }}
        >
          <span>{text}</span>
          <span>{text}</span>
        </motion.div>
      </div>
    </AnimCard>
  );
}

function SpringPhysicsDemo() {
  const configs = [
    { label: "Stiff", stiffness: 600, damping: 8, color: "#ff6464" },
    { label: "Soft", stiffness: 80, damping: 8, color: "#8DF0CC" },
    { label: "Jelly", stiffness: 200, damping: 4, color: "#ffa828" },
  ];
  const [trigger, setTrigger] = useState(false);
  return (
    <AnimCard title="react-spring: Physics">
      <div className="flex flex-col gap-2 w-full px-2">
        {configs.map(({ label, stiffness, damping, color }, i) => (
          <div key={label} className="flex items-center gap-2">
            <span className="text-xs w-10 text-right" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</span>
            <div className="flex-1 relative h-5">
              <motion.div
                key={String(trigger)}
                className="w-5 h-5 rounded-full absolute top-0"
                initial={{ x: 0 }}
                animate={{ x: trigger ? "calc(100% - 0px)" : 0 }}
                transition={{ type: "spring", stiffness, damping }}
                style={{ background: color, boxShadow: `0 0 8px ${color}60` }}
              />
            </div>
          </div>
        ))}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setTrigger((t) => !t)}
          className="text-xs px-3 py-1 rounded-full border cursor-pointer mx-auto mt-1"
          style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)" }}
        >
          Fire Springs
        </motion.button>
      </div>
    </AnimCard>
  );
}

function AnimeJSStaggerDemo() {
  const [key, setKey] = useState(0);
  const bars = Array.from({ length: 12 });
  return (
    <AnimCard title="anime.js: Stagger Bars">
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-end gap-1 h-16">
          {bars.map((_, i) => (
            <motion.div
              key={`${key}-${i}`}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: [0, 1, 0.6 + Math.random() * 0.4, 1], opacity: 1 }}
              transition={{ delay: i * 0.06, duration: 0.8, ease: "easeOut" }}
              className="rounded-t"
              style={{
                width: 8,
                height: 16 + Math.abs(Math.sin(i * 0.8)) * 36,
                background: `hsl(${i * 25 + 200}, 70%, 65%)`,
                transformOrigin: "bottom",
              }}
            />
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

function GSAPTimelineDemo() {
  const [key, setKey] = useState(0);
  const steps = ["Load", "Parse", "Render", "Done"];
  return (
    <AnimCard title="GSAP: Timeline Sequence">
      <div className="flex flex-col items-center gap-3 w-full px-4">
        <div className="flex items-center gap-1 w-full">
          {steps.map((step, i) => (
            <div key={step} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                key={`${key}-${i}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.4, type: "spring", stiffness: 400, damping: 18 }}
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: `hsl(${i * 60 + 200}, 60%, 45%)`, color: "white" }}
              >
                {i + 1}
              </motion.div>
              {i < steps.length - 1 && (
                <motion.div
                  key={`line-${key}-${i}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: i * 0.4 + 0.2, duration: 0.3 }}
                  className="absolute"
                />
              )}
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)", fontSize: 9 }}>{step}</span>
            </div>
          ))}
        </div>
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div
            key={key}
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
            style={{ background: "linear-gradient(90deg,#9E9EFF,#8DF0CC)" }}
          />
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

function TransitionGroupDemo() {
  const [items, setItems] = useState(["Alpha", "Beta", "Gamma"]);
  const addItem = () => {
    const names = ["Delta", "Epsilon", "Zeta", "Eta", "Theta"];
    const available = names.filter((n) => !items.includes(n));
    if (available.length) setItems([...items, available[0]]);
  };
  const removeItem = (item: string) => setItems(items.filter((i) => i !== item));

  return (
    <AnimCard title="react-transition-group: List">
      <div className="flex flex-col gap-2 w-full">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs"
              style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)" }}
            >
              <span>{item}</span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => removeItem(item)}
                className="cursor-pointer text-xs"
                style={{ color: "#ff6464" }}
              >✕</motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={addItem}
          className="text-xs px-3 py-1 rounded-full border cursor-pointer text-center"
          style={{ borderColor: "rgba(141,240,204,0.3)", color: "#8DF0CC" }}
        >
          + Add Item
        </motion.button>
      </div>
    </AnimCard>
  );
}

export function AdvancedSection() {
  return (
    <section>
      <SectionHeader
        id="advanced"
        title="Advanced Animations"
        sub="Path morphing, layout, spring physics, anime.js stagger, GSAP timeline, and transition group"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <FollowPointerSpringDemo />
        <PathMorphingDemo />
        <LayoutAnimationDemo />
        <ScrollVelocityTextDemo />
        <SpringPhysicsDemo />
        <AnimeJSStaggerDemo />
        <GSAPTimelineDemo />
        <TransitionGroupDemo />
      </div>
    </section>
  );
}
