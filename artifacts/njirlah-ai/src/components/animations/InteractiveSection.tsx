import { useState, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup, Reorder, useDragControls } from "framer-motion";

function SectionHeader({ id, title, sub }: { id: string; title: string; sub: string }) {
  return (
    <div id={id} className="mb-8">
      <h2 className="text-2xl font-bold mb-1" style={{ color: "#e4e4e7" }}>{title}</h2>
      <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{sub}</p>
    </div>
  );
}

function AnimCard({ title, children, wide }: { title: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`rounded-2xl border overflow-hidden${wide ? " sm:col-span-2" : ""}`} style={{ background: "rgba(255,255,255,0.025)", borderColor: "rgba(255,255,255,0.07)" }}>
      <div className="px-4 pt-4 pb-1">
        <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>{title}</span>
      </div>
      <div className="flex items-center justify-center p-4 min-h-36">{children}</div>
    </div>
  );
}

function AccordionDemo() {
  const [open, setOpen] = useState<number | null>(0);
  const items = ["What is Framer Motion?", "How does spring work?", "What are variants?"];
  return (
    <AnimCard title="Accordion">
      <div className="w-full flex flex-col gap-1">
        {items.map((item, i) => (
          <div key={i} className="overflow-hidden rounded-xl border" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium cursor-pointer"
              style={{ color: open === i ? "#9E9EFF" : "rgba(255,255,255,0.7)", background: open === i ? "rgba(158,158,255,0.07)" : "transparent" }}
            >
              <span>{item}</span>
              <motion.span animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.2 }}>▾</motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <p className="px-3 py-2 text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                    Animations make interfaces feel alive. This is a layout-animated accordion powered by AnimatePresence.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </AnimCard>
  );
}

function SmoothTabsDemo() {
  const tabs = ["Design", "Code", "Preview"];
  const [active, setActive] = useState(0);
  return (
    <AnimCard title="Smooth Tabs">
      <LayoutGroup>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActive(i)}
              className="relative px-4 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-colors"
              style={{ color: active === i ? "#05050A" : "rgba(255,255,255,0.5)", zIndex: 1 }}
            >
              {active === i && (
                <motion.div
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: "#9E9EFF", zIndex: -1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                />
              )}
              {tab}
            </button>
          ))}
        </div>
      </LayoutGroup>
    </AnimCard>
  );
}

function TabSelectDemo() {
  const tabs = ["All", "Motion", "GSAP", "Spring"];
  const [active, setActive] = useState(0);
  return (
    <AnimCard title="Tab Select">
      <div className="flex flex-col gap-3 w-full items-center">
        <LayoutGroup>
          <div className="flex gap-3">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActive(i)}
                className="relative pb-1 text-xs font-medium cursor-pointer"
                style={{ color: active === i ? "#9E9EFF" : "rgba(255,255,255,0.4)" }}
              >
                {tab}
                {active === i && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: "#9E9EFF" }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  />
                )}
              </button>
            ))}
          </div>
        </LayoutGroup>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="text-xs px-3 py-1.5 rounded-lg"
            style={{ background: "rgba(158,158,255,0.08)", color: "#9E9EFF" }}
          >
            {tabs[active]} content
          </motion.div>
        </AnimatePresence>
      </div>
    </AnimCard>
  );
}

function TodoListDemo() {
  const [items, setItems] = useState(["Drag me", "Reorder me", "Sort me"]);
  return (
    <AnimCard title="To-do List (Reorder)">
      <Reorder.Group axis="y" values={items} onReorder={setItems} className="w-full flex flex-col gap-1.5">
        {items.map((item) => (
          <Reorder.Item
            key={item}
            value={item}
            className="px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 cursor-grab active:cursor-grabbing"
            style={{ background: "rgba(158,158,255,0.1)", color: "#9E9EFF", border: "1px solid rgba(158,158,255,0.15)" }}
            whileDrag={{ scale: 1.04, boxShadow: "0 8px 20px rgba(158,158,255,0.25)" }}
          >
            <span style={{ color: "rgba(255,255,255,0.3)" }}>⣿</span>
            {item}
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </AnimCard>
  );
}

function HoldToConfirmDemo() {
  const [progress, setProgress] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    setConfirmed(false);
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(intervalRef.current!);
          setConfirmed(true);
          setTimeout(() => setProgress(0), 1500);
          return 100;
        }
        return p + 4;
      });
    }, 30);
  };
  const stop = () => {
    clearInterval(intervalRef.current!);
    if (!confirmed) setProgress(0);
  };

  return (
    <AnimCard title="Hold to Confirm">
      <div className="flex flex-col items-center gap-3">
        <div className="relative overflow-hidden rounded-xl">
          <motion.button
            onPointerDown={start}
            onPointerUp={stop}
            onPointerLeave={stop}
            className="relative px-6 py-2.5 text-sm font-medium rounded-xl select-none cursor-pointer overflow-hidden"
            style={{ background: "rgba(255,255,255,0.07)", color: confirmed ? "#8DF0CC" : "#e4e4e7", border: "1px solid rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.div
              className="absolute inset-0 rounded-xl"
              style={{ background: confirmed ? "#8DF0CC" : "#9E9EFF", originX: 0 }}
              animate={{ scaleX: progress / 100 }}
              transition={{ duration: 0 }}
            />
            <span className="relative z-10" style={{ color: progress > 50 ? "#05050A" : "inherit" }}>
              {confirmed ? "✓ Confirmed!" : progress > 0 ? "Hold..." : "Hold to confirm"}
            </span>
          </motion.button>
        </div>
      </div>
    </AnimCard>
  );
}

function SwipeActionsDemo() {
  const [offset, setOffset] = useState(0);
  return (
    <AnimCard title="Swipe Actions">
      <div className="relative w-full max-w-48 h-12 rounded-xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-end pr-3 rounded-xl" style={{ background: "rgba(255,80,80,0.2)" }}>
          <span className="text-xs" style={{ color: "#ff6464" }}>🗑 Delete</span>
        </div>
        <motion.div
          drag="x"
          dragConstraints={{ left: -72, right: 0 }}
          dragElastic={0.1}
          onDrag={(_, info) => setOffset(info.offset.x)}
          onDragEnd={() => setOffset(0)}
          className="absolute inset-0 flex items-center px-3 rounded-xl cursor-grab active:cursor-grabbing"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>← Swipe left</span>
        </motion.div>
      </div>
    </AnimCard>
  );
}

function ImageRevealDemo() {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    setPos(Math.min(100, Math.max(0, ((x - rect.left) / rect.width) * 100)));
  };
  return (
    <AnimCard title="Image Reveal Slider">
      <div
        ref={ref}
        className="relative w-48 h-24 rounded-xl overflow-hidden cursor-ew-resize select-none"
        onMouseMove={handleMove}
        onTouchMove={handleMove}
      >
        <div className="absolute inset-0 rounded-xl" style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)" }}>
          <div className="absolute inset-0 flex items-center justify-center text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Before</div>
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 40%, rgba(158,158,255,0.15), transparent 70%)" }} />
        </div>
        <div
          className="absolute top-0 bottom-0 right-0 rounded-r-xl overflow-hidden"
          style={{ left: `${pos}%`, background: "linear-gradient(135deg, #0f3460, #533483)" }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>After</div>
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 40%, rgba(141,240,204,0.2), transparent 70%)" }} />
        </div>
        <div className="absolute top-0 bottom-0 w-0.5 z-10" style={{ left: `${pos}%`, background: "white", boxShadow: "0 0 8px rgba(255,255,255,0.8)" }}>
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white flex items-center justify-center" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
            <span style={{ fontSize: 8, color: "#333" }}>◀▶</span>
          </div>
        </div>
      </div>
    </AnimCard>
  );
}

function MultiStateBadgeDemo() {
  const states = [
    { label: "Pending", color: "#ffa828", bg: "rgba(255,168,40,0.12)" },
    { label: "Active", color: "#8DF0CC", bg: "rgba(141,240,204,0.12)" },
    { label: "Error", color: "#ff6464", bg: "rgba(255,100,100,0.12)" },
    { label: "Done", color: "#9E9EFF", bg: "rgba(158,158,255,0.12)" },
  ];
  const [idx, setIdx] = useState(0);
  const s = states[idx];
  return (
    <AnimCard title="Multi State Badge">
      <div className="flex flex-col items-center gap-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
            className="px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5"
            style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}40` }}
          >
            <motion.span
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: s.color }}
            />
            {s.label}
          </motion.div>
        </AnimatePresence>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIdx((i) => (i + 1) % states.length)}
          className="text-xs px-3 py-1 rounded-full border cursor-pointer"
          style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)" }}
        >
          Next State →
        </motion.button>
      </div>
    </AnimCard>
  );
}

function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const cmds = ["Open file", "New chat", "Toggle theme", "Export data", "Show animations"];
  const filtered = cmds.filter((c) => c.toLowerCase().includes(query.toLowerCase()));
  return (
    <AnimCard title="Command Palette">
      <div className="flex flex-col items-center gap-3 w-full">
        <motion.button
          whileHover={{ opacity: 0.85 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 cursor-pointer"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
        >
          <span>⌘</span> Open Palette
        </motion.button>
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50"
                style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
                onClick={() => { setOpen(false); setQuery(""); }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -20 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="fixed top-32 left-1/2 -translate-x-1/2 z-50 w-72 rounded-2xl overflow-hidden"
                style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}
              >
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search commands..."
                  className="w-full px-4 py-3 text-sm bg-transparent outline-none border-b"
                  style={{ color: "#e4e4e7", borderColor: "rgba(255,255,255,0.08)" }}
                />
                <div className="max-h-48 overflow-y-auto">
                  {filtered.map((cmd) => (
                    <motion.button
                      key={cmd}
                      whileHover={{ background: "rgba(158,158,255,0.1)" }}
                      onClick={() => { setOpen(false); setQuery(""); }}
                      className="w-full text-left px-4 py-2.5 text-xs cursor-pointer"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      {cmd}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AnimCard>
  );
}

function MaterialRippleDemo() {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const ref = useRef<HTMLButtonElement>(null);
  let counter = useRef(0);

  const handleClick = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const id = counter.current++;
    setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 600);
  };

  return (
    <AnimCard title="Material Design: Ripple">
      <motion.button
        ref={ref}
        onClick={handleClick}
        className="relative overflow-hidden px-6 py-3 rounded-xl text-sm font-medium cursor-pointer select-none"
        style={{ background: "rgba(158,158,255,0.15)", color: "#9E9EFF", border: "1px solid rgba(158,158,255,0.2)" }}
        whileTap={{ scale: 0.97 }}
      >
        Click for ripple
        {ripples.map(({ id, x, y }) => (
          <motion.span
            key={id}
            initial={{ width: 0, height: 0, opacity: 0.5, x, y }}
            animate={{ width: 200, height: 200, opacity: 0, x: x - 100, y: y - 100 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute rounded-full pointer-events-none"
            style={{ background: "rgba(158,158,255,0.4)" }}
          />
        ))}
      </motion.button>
    </AnimCard>
  );
}

export function InteractiveSection() {
  return (
    <section>
      <SectionHeader
        id="interactive"
        title="Interactive Animations"
        sub="Accordion, tabs, to-do list, hold to confirm, swipe, command palette, image reveal and ripple"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AccordionDemo />
        <SmoothTabsDemo />
        <TabSelectDemo />
        <MultiStateBadgeDemo />
        <HoldToConfirmDemo />
        <SwipeActionsDemo />
        <ImageRevealDemo />
        <MaterialRippleDemo />
        <TodoListDemo />
        <CommandPaletteDemo />
      </div>
    </section>
  );
}
