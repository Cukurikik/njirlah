import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";

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

function IOSSliderDemo() {
  const [value, setValue] = useState(60);
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!("buttons" in e && e.buttons)) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    setValue(Math.min(100, Math.max(0, ((x - rect.left) / rect.width) * 100)));
  };
  return (
    <AnimCard title="iOS Slider">
      <div className="flex flex-col items-center gap-3 w-full px-4">
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>🔈</span>
          <div
            ref={ref}
            onMouseDown={handleMove}
            onMouseMove={handleMove}
            className="flex-1 relative h-1.5 rounded-full cursor-pointer"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            <div className="h-full rounded-full" style={{ width: `${value}%`, background: "#e4e4e7" }} />
            <motion.div
              whileTap={{ scale: 1.3 }}
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full shadow-lg cursor-grab"
              style={{ left: `calc(${value}% - 10px)`, background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
            />
          </div>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>🔊</span>
        </div>
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{Math.round(value)}%</span>
      </div>
    </AnimCard>
  );
}

function IOSNotificationsStackDemo() {
  const notifications = [
    { app: "Messages", msg: "Hey! Are you free?", color: "#34C759" },
    { app: "Mail", msg: "Your order shipped", color: "#007AFF" },
    { app: "Calendar", msg: "Meeting in 10 min", color: "#FF3B30" },
  ];
  const [expanded, setExpanded] = useState(false);
  return (
    <AnimCard title="iOS Notifications Stack">
      <div className="relative flex flex-col items-center" style={{ height: 100 }}>
        <AnimatePresence>
          {!expanded ? (
            <div className="relative w-56" style={{ height: 80 }}>
              {notifications.map((n, i) => (
                <motion.div
                  key={n.app}
                  initial={false}
                  animate={{
                    y: i * 6,
                    scale: 1 - i * 0.06,
                    zIndex: notifications.length - i,
                    opacity: 1 - i * 0.2,
                  }}
                  onClick={() => setExpanded(true)}
                  className="absolute w-full px-3 py-2 rounded-2xl flex items-center gap-2 cursor-pointer"
                  style={{
                    background: "rgba(30,30,46,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    backdropFilter: "blur(12px)",
                    top: 0,
                    transformOrigin: "top center",
                  }}
                >
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs" style={{ background: n.color }}>
                    {n.app[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold" style={{ color: "#e4e4e7" }}>{n.app}</div>
                    <div className="text-xs truncate" style={{ color: "rgba(255,255,255,0.5)" }}>{n.msg}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-1.5 w-56 cursor-pointer"
              onClick={() => setExpanded(false)}
            >
              {notifications.map((n, i) => (
                <motion.div
                  key={n.app}
                  initial={{ y: -20 * (notifications.length - i), opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.06, type: "spring", stiffness: 300, damping: 22 }}
                  className="px-3 py-2 rounded-2xl flex items-center gap-2"
                  style={{ background: "rgba(30,30,46,0.95)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs" style={{ background: n.color }}>
                    {n.app[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold" style={{ color: "#e4e4e7" }}>{n.app}</div>
                    <div className="text-xs truncate" style={{ color: "rgba(255,255,255,0.5)" }}>{n.msg}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimCard>
  );
}

function IOSAppStoreCardDemo() {
  const [expanded, setExpanded] = useState(false);
  return (
    <AnimCard title="iOS App Store Card">
      <AnimatePresence>
        {expanded ? (
          <motion.div
            layoutId="card"
            className="fixed inset-4 z-50 rounded-3xl overflow-hidden cursor-pointer"
            style={{ background: "linear-gradient(135deg,#1c1c3a,#0f3460)", boxShadow: "0 24px 64px rgba(0,0,0,0.8)" }}
            onClick={() => setExpanded(false)}
          >
            <div className="p-6 h-full flex flex-col">
              <motion.div layoutId="card-icon" className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center text-3xl" style={{ background: "#9E9EFF" }}>
                ✦
              </motion.div>
              <motion.h3 layoutId="card-title" className="text-xl font-bold mb-2" style={{ color: "#e4e4e7" }}>
                NJIRLAH AI
              </motion.h3>
              <motion.p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Tap to collapse this expanded App Store card. The layout animation smoothly transitions between states using shared layout IDs.
              </motion.p>
              <div className="mt-auto">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 rounded-full text-sm font-bold"
                  style={{ background: "#9E9EFF", color: "#05050A" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  GET
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            layoutId="card"
            onClick={() => setExpanded(true)}
            className="w-48 h-28 rounded-2xl overflow-hidden cursor-pointer"
            style={{ background: "linear-gradient(135deg,#1c1c3a,#0f3460)" }}
            whileHover={{ scale: 1.03 }}
          >
            <div className="p-3 h-full flex flex-col justify-between">
              <motion.div layoutId="card-icon" className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: "#9E9EFF" }}>
                ✦
              </motion.div>
              <div>
                <motion.div layoutId="card-title" className="text-xs font-bold" style={{ color: "#e4e4e7" }}>NJIRLAH AI</motion.div>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Tap to expand</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimCard>
  );
}

function AppleIntelligenceRippleDemo() {
  const [active, setActive] = useState(false);
  return (
    <AnimCard title="Apple Intelligence Ripple">
      <div className="relative flex items-center justify-center">
        <AnimatePresence>
          {active && [0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              initial={{ width: 40, height: 40, opacity: 0.8 }}
              animate={{ width: 120, height: 120, opacity: 0 }}
              exit={{}}
              transition={{ duration: 1.5, delay: i * 0.25, ease: "easeOut", repeat: Infinity, repeatDelay: 0.5 }}
              style={{
                background: "transparent",
                border: `2px solid hsl(${i * 40 + 200}, 70%, 70%)`,
              }}
            />
          ))}
        </AnimatePresence>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setActive(!active)}
          className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-xl cursor-pointer"
          animate={active ? {
            background: ["rgba(158,158,255,0.2)", "rgba(141,240,204,0.2)", "rgba(178,7,255,0.2)", "rgba(158,158,255,0.2)"],
          } : { background: "rgba(158,158,255,0.15)" }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ border: "2px solid rgba(158,158,255,0.4)" }}
        >
          ✦
        </motion.button>
      </div>
    </AnimCard>
  );
}

function CarouselDemo() {
  const [idx, setIdx] = useState(0);
  const cards = [
    { label: "Photo 1", color: "rgba(158,158,255,0.2)" },
    { label: "Photo 2", color: "rgba(141,240,204,0.2)" },
    { label: "Photo 3", color: "rgba(255,168,40,0.2)" },
    { label: "Photo 4", color: "rgba(255,100,100,0.2)" },
  ];
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <AnimCard title="Carousel: iOS Exposure">
      <div className="flex flex-col items-center gap-3 w-full">
        <div className="w-full overflow-hidden rounded-xl relative h-20">
          <motion.div
            drag="x"
            dragConstraints={{ left: -(cards.length - 1) * 176, right: 0 }}
            dragElastic={0.1}
            style={{ x }}
            onDragEnd={(_, info) => {
              const newIdx = Math.max(0, Math.min(cards.length - 1, idx - Math.round(info.offset.x / 176)));
              setIdx(newIdx);
              x.set(-newIdx * 176);
            }}
            className="flex gap-4 h-20 cursor-grab active:cursor-grabbing"
            animate={{ x: -idx * 176 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            {cards.map((c, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-40 h-20 rounded-xl flex items-center justify-center text-sm font-medium"
                style={{ background: c.color, border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
              >
                {c.label}
              </div>
            ))}
          </motion.div>
        </div>
        <div className="flex gap-1.5">
          {cards.map((_, i) => (
            <motion.div
              key={i}
              animate={{ width: idx === i ? 16 : 6, opacity: idx === i ? 1 : 0.4 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              onClick={() => setIdx(i)}
              className="h-1.5 rounded-full cursor-pointer"
              style={{ background: "#9E9EFF" }}
            />
          ))}
        </div>
      </div>
    </AnimCard>
  );
}

function IOSFolderDemo() {
  const [open, setOpen] = useState(false);
  const icons = ["📸", "🎵", "📧", "🗺️", "⚙️", "📱", "🎮", "📖", "🌐", "🔐", "📊", "🎨"];
  return (
    <AnimCard title="iOS App Folder">
      <div className="flex flex-col items-center gap-2">
        <motion.div
          onClick={() => setOpen(!open)}
          layout
          className="cursor-pointer overflow-hidden"
          animate={open ? {
            width: 160, height: 160, borderRadius: 24,
            background: "rgba(30,30,50,0.95)",
          } : {
            width: 52, height: 52, borderRadius: 14,
            background: "rgba(158,158,255,0.2)",
          }}
          style={{ border: "1px solid rgba(255,255,255,0.12)" }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          {open ? (
            <motion.div
              className="grid grid-cols-4 gap-1.5 p-3 h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {icons.map((icon, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.03, type: "spring", stiffness: 400, damping: 20 }}
                  className="aspect-square rounded-lg flex items-center justify-center text-xs"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  {icon}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="w-full h-full grid grid-cols-3 gap-0.5 p-1.5">
              {icons.slice(0, 9).map((icon, i) => (
                <div key={i} className="aspect-square rounded flex items-center justify-center" style={{ fontSize: 10 }}>
                  {icon}
                </div>
              ))}
            </div>
          )}
        </motion.div>
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
          {open ? "Tap to close" : "Tap folder"}
        </span>
      </div>
    </AnimCard>
  );
}

export function IOSSection() {
  return (
    <section>
      <SectionHeader
        id="ios"
        title="iOS-Style Animations"
        sub="Slider, notifications stack, App Store card, folder, carousel, and Apple Intelligence ripple"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <IOSSliderDemo />
        <IOSNotificationsStackDemo />
        <IOSAppStoreCardDemo />
        <AppleIntelligenceRippleDemo />
        <CarouselDemo />
        <IOSFolderDemo />
      </div>
    </section>
  );
}
