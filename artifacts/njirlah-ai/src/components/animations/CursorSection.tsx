import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

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

function FloatingTargetDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 18 });
  const sy = useSpring(my, { stiffness: 200, damping: 18 });
  const [active, setActive] = useState(false);

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left - rect.width / 2);
    my.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <AnimCard title="Cursor: Floating Target">
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => { setActive(false); mx.set(0); my.set(0); }}
        className="relative w-48 h-32 rounded-xl flex items-center justify-center"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)" }}
      >
        <p className="text-xs text-center pointer-events-none" style={{ color: "rgba(255,255,255,0.3)" }}>Move cursor here</p>
        <motion.div
          style={{ x: sx, y: sy }}
          animate={{ scale: active ? 1 : 0.6, opacity: active ? 1 : 0.4 }}
          transition={{ duration: 0.2 }}
          className="absolute w-10 h-10 rounded-full pointer-events-none"
          style={{ background: "rgba(158,158,255,0.2)", border: "2px solid #9E9EFF", x: sx, y: sy }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{ background: "#9E9EFF" }} />
        </motion.div>
      </div>
    </AnimCard>
  );
}

function CursorTrailDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [dots, setDots] = useState<{ id: number; x: number; y: number }[]>([]);
  const counter = useRef(0);

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const id = counter.current++;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDots((prev) => [...prev.slice(-14), { id, x, y }]);
  };

  return (
    <AnimCard title="Cursor Trail">
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={() => setDots([])}
        className="relative w-48 h-32 rounded-xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)" }}
      >
        <p className="absolute inset-0 flex items-center justify-center text-xs pointer-events-none" style={{ color: "rgba(255,255,255,0.3)" }}>
          Move cursor here
        </p>
        {dots.map((dot, i) => (
          <motion.div
            key={dot.id}
            initial={{ scale: 1, opacity: 0.9 }}
            animate={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 6 + i * 0.5,
              height: 6 + i * 0.5,
              left: dot.x - 3,
              top: dot.y - 3,
              background: `hsl(${220 + i * 5}, 70%, 70%)`,
            }}
          />
        ))}
      </div>
    </AnimCard>
  );
}

function CursorTrailVelocityDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [trail, setTrail] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const lastPos = useRef({ x: 0, y: 0, t: 0 });
  const counter = useRef(0);

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = Date.now();
    const dt = now - lastPos.current.t || 1;
    const dx = x - lastPos.current.x;
    const dy = y - lastPos.current.y;
    const speed = Math.sqrt(dx * dx + dy * dy) / dt;
    const size = Math.min(20, Math.max(4, speed * 80));
    lastPos.current = { x, y, t: now };
    const id = counter.current++;
    setTrail((prev) => [...prev.slice(-20), { id, x, y, size }]);
  };

  return (
    <AnimCard title="Cursor Trail Velocity">
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={() => setTrail([])}
        className="relative w-48 h-32 rounded-xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)" }}
      >
        <p className="absolute inset-0 flex items-center justify-center text-xs pointer-events-none" style={{ color: "rgba(255,255,255,0.3)" }}>
          Move fast for bigger trail
        </p>
        {trail.map((dot, i) => (
          <motion.div
            key={dot.id}
            initial={{ scale: 1, opacity: 0.85 }}
            animate={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: dot.size,
              height: dot.size,
              left: dot.x - dot.size / 2,
              top: dot.y - dot.size / 2,
              background: `hsl(${200 + i * 8}, 80%, 65%)`,
            }}
          />
        ))}
      </div>
    </AnimCard>
  );
}

function MagneticFilingsDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [particles] = useState(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      angle: (i / 24) * Math.PI * 2,
      r: 30 + (i % 3) * 15,
    }))
  );
  const [mouse, setMouse] = useState({ x: 60, y: 55 });

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <AnimCard title="Magnetic Filings">
      <div
        ref={ref}
        onMouseMove={handleMove}
        className="relative w-48 h-28 overflow-hidden rounded-xl"
        style={{ background: "rgba(0,0,0,0.3)" }}
      >
        {particles.map(({ id, angle, r }) => {
          const baseX = 96 + Math.cos(angle) * r;
          const baseY = 56 + Math.sin(angle) * r;
          const dx = mouse.x - baseX;
          const dy = mouse.y - baseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const force = Math.max(0, 1 - dist / 80);
          return (
            <motion.div
              key={id}
              animate={{
                x: baseX + dx * force * 0.4 - 2,
                y: baseY + dy * force * 0.4 - 1,
                rotate: (Math.atan2(dy, dx) * 180) / Math.PI,
              }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
              className="absolute"
              style={{
                width: 12,
                height: 2,
                background: `hsl(${id * 15 + 200}, 70%, 65%)`,
                borderRadius: 1,
                opacity: 0.6 + force * 0.4,
              }}
            />
          );
        })}
        <p className="absolute bottom-1 right-2 text-xs pointer-events-none" style={{ color: "rgba(255,255,255,0.2)" }}>Move cursor</p>
      </div>
    </AnimCard>
  );
}

export function CursorSection() {
  return (
    <section>
      <SectionHeader
        id="cursor"
        title="Cursor & Pointer Effects"
        sub="Floating target, cursor trail, velocity-based trail, and magnetic filings"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FloatingTargetDemo />
        <CursorTrailDemo />
        <CursorTrailVelocityDemo />
        <MagneticFilingsDemo />
      </div>
    </section>
  );
}
