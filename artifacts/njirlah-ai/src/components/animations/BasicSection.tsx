import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

function SectionHeader({ id, title, sub }: { id: string; title: string; sub: string }) {
  return (
    <div id={id} className="mb-8">
      <h2 className="text-2xl font-bold mb-1" style={{ color: "#e4e4e7" }}>
        {title}
      </h2>
      <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{sub}</p>
    </div>
  );
}

function AnimCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ background: "rgba(255,255,255,0.025)", borderColor: "rgba(255,255,255,0.07)" }}
    >
      <div className="px-4 pt-4 pb-1">
        <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>{title}</span>
      </div>
      <div className="flex items-center justify-center p-4 min-h-36">{children}</div>
    </div>
  );
}

function CSSSpringDemo() {
  const y = useMotionValue(0);
  const springY = useSpring(y, { stiffness: 400, damping: 12 });
  return (
    <AnimCard title="CSS Spring">
      <div className="flex flex-col items-center gap-3">
        <motion.div
          style={{ y: springY }}
          drag="y"
          dragConstraints={{ top: -50, bottom: 50 }}
          onDragEnd={() => y.set(0)}
          className="w-12 h-12 rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center text-lg"
          whileTap={{ scale: 0.9 }}
          animate={{ background: "linear-gradient(135deg,#9E9EFF,#8DF0CC)" }}
        >
          🏀
        </motion.div>
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Drag to spring</span>
      </div>
    </AnimCard>
  );
}

function DragDemo() {
  const constraintsRef = useRef<HTMLDivElement>(null);
  return (
    <AnimCard title="Drag">
      <div
        ref={constraintsRef}
        className="w-48 h-28 rounded-xl border relative flex items-center justify-center"
        style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}
      >
        <motion.div
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.2}
          whileDrag={{ scale: 1.1, boxShadow: "0 10px 30px rgba(158,158,255,0.3)" }}
          className="w-10 h-10 rounded-lg cursor-grab active:cursor-grabbing"
          style={{ background: "linear-gradient(135deg,#9E9EFF,#8DF0CC)" }}
        />
      </div>
    </AnimCard>
  );
}

function EnterAnimationDemo() {
  const [show, setShow] = useState(true);
  return (
    <AnimCard title="Enter Animation">
      <div className="flex flex-col items-center gap-3">
        <AnimatePresence>
          {show && (
            <motion.div
              initial={{ opacity: 0, x: -40, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{ background: "rgba(158,158,255,0.15)", color: "#9E9EFF" }}
            >
              ✦ Entering from left
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          whileHover={{ opacity: 0.8 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShow(!show)}
          className="text-xs px-3 py-1 rounded-full border cursor-pointer"
          style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)" }}
        >
          {show ? "Exit" : "Enter"}
        </motion.button>
      </div>
    </AnimCard>
  );
}

function ExitAnimationDemo() {
  const [items, setItems] = useState([1, 2, 3]);
  const remove = () => setItems((prev) => prev.slice(0, -1));
  const add = () => setItems((prev) => [...prev, prev.length + 1]);
  return (
    <AnimCard title="Exit Animation">
      <div className="flex flex-col items-center gap-3 w-full">
        <div className="flex gap-2 h-10 items-center">
          <AnimatePresence mode="popLayout">
            {items.map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="w-8 h-8 rounded-lg text-xs flex items-center justify-center font-bold"
                style={{ background: `hsl(${i * 50 + 200}, 70%, 60%)`, color: "#05050A" }}
              >
                {i}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="flex gap-2">
          <motion.button whileTap={{ scale: 0.9 }} onClick={add} className="text-xs px-3 py-1 rounded-full border cursor-pointer" style={{ borderColor: "rgba(141,240,204,0.3)", color: "#8DF0CC" }}>+ Add</motion.button>
          <motion.button whileTap={{ scale: 0.9 }} onClick={remove} className="text-xs px-3 py-1 rounded-full border cursor-pointer" style={{ borderColor: "rgba(255,100,100,0.3)", color: "#ff6464" }}>− Remove</motion.button>
        </div>
      </div>
    </AnimCard>
  );
}

function GesturesDemo() {
  return (
    <AnimCard title="Gestures">
      <div className="flex gap-3">
        {["Hover", "Tap", "Both"].map((label, i) => (
          <motion.div
            key={label}
            whileHover={i !== 1 ? { scale: 1.15, rotate: 3, boxShadow: "0 8px 24px rgba(158,158,255,0.3)" } : {}}
            whileTap={i !== 0 ? { scale: 0.88, rotate: -3 } : {}}
            className="w-14 h-14 rounded-xl flex flex-col items-center justify-center cursor-pointer gap-0.5"
            style={{ background: "rgba(158,158,255,0.12)", border: "1px solid rgba(158,158,255,0.2)" }}
          >
            <span className="text-base">{["👆", "👇", "✨"][i]}</span>
            <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</span>
          </motion.div>
        ))}
      </div>
    </AnimCard>
  );
}

function HTMLContentDemo() {
  return (
    <AnimCard title="HTML Content">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-48 text-center"
      >
        <motion.h3
          animate={{ color: ["#9E9EFF", "#8DF0CC", "#9E9EFF"] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-sm font-bold mb-1"
        >
          Rich HTML Content
        </motion.h3>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
          Animate <strong style={{ color: "#9E9EFF" }}>any</strong> HTML element with{" "}
          <em style={{ color: "#8DF0CC" }}>full control</em>.
        </p>
      </motion.div>
    </AnimCard>
  );
}

function KeyframesDemo() {
  return (
    <AnimCard title="Keyframes">
      <div className="flex gap-3">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              background: ["#9E9EFF", "#8DF0CC", "#ff6464", "#ffa828", "#9E9EFF"],
              scale: [1, 1.2, 1, 1.2, 1],
              rotate: [0, 90, 180, 270, 360],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
            className="w-10 h-10 rounded-lg"
          />
        ))}
      </div>
    </AnimCard>
  );
}

function KeyframeWildcardsDemo() {
  return (
    <AnimCard title="Keyframe Wildcards">
      <motion.div
        animate={{
          x: [null, 40, -40, null],
          opacity: [null, 1, 1, null],
          borderRadius: ["12px", "50%", "50%", "12px"],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-12 h-12"
        style={{ background: "linear-gradient(135deg,#9E9EFF,#8DF0CC)" }}
      />
    </AnimCard>
  );
}

function RotateDemo() {
  const [spinning, setSpinning] = useState(false);
  return (
    <AnimCard title="Rotate">
      <div className="flex flex-col items-center gap-3">
        <motion.div
          animate={{ rotate: spinning ? 360 : 0 }}
          transition={spinning ? { duration: 1, repeat: Infinity, ease: "linear" } : { type: "spring" }}
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl cursor-pointer"
          style={{ background: "rgba(158,158,255,0.12)", border: "1px solid rgba(158,158,255,0.2)" }}
          onClick={() => setSpinning(!spinning)}
        >
          ⚙️
        </motion.div>
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Click to {spinning ? "stop" : "spin"}</span>
      </div>
    </AnimCard>
  );
}

function TransitionOptionsDemo() {
  const [trigger, setTrigger] = useState(0);
  const transitions = [
    { label: "Spring", t: { type: "spring" as const, stiffness: 300, damping: 10 } },
    { label: "Linear", t: { duration: 0.5, ease: "linear" as const } },
    { label: "Bounce", t: { type: "spring" as const, stiffness: 600, damping: 6 } },
  ];
  return (
    <AnimCard title="Transition Options">
      <div className="flex flex-col gap-2 w-full px-2">
        {transitions.map(({ label, t }, i) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-xs w-12 text-right" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</span>
            <div className="flex-1 relative h-6">
              <motion.div
                key={trigger}
                initial={{ x: 0 }}
                animate={{ x: trigger ? "calc(100% - 24px)" : 0 }}
                transition={t}
                className="w-6 h-6 rounded-full absolute top-0"
                style={{ background: `hsl(${i * 60 + 200}, 70%, 70%)` }}
              />
            </div>
          </div>
        ))}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setTrigger((v) => v + 1)}
          className="text-xs px-3 py-1 rounded-full border cursor-pointer mx-auto mt-1"
          style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)" }}
        >
          Trigger
        </motion.button>
      </div>
    </AnimCard>
  );
}

function Cube3DDemo() {
  return (
    <AnimCard title="Spinning 3D Cube">
      <div style={{ perspective: "400px" }}>
        <motion.div
          animate={{ rotateY: 360, rotateX: 20 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{
            width: 56,
            height: 56,
            transformStyle: "preserve-3d",
            position: "relative",
          }}
        >
          {[
            { transform: "translateZ(28px)", bg: "rgba(158,158,255,0.8)" },
            { transform: "rotateY(180deg) translateZ(28px)", bg: "rgba(141,240,204,0.8)" },
            { transform: "rotateY(90deg) translateZ(28px)", bg: "rgba(255,168,40,0.8)" },
            { transform: "rotateY(-90deg) translateZ(28px)", bg: "rgba(255,100,100,0.8)" },
            { transform: "rotateX(90deg) translateZ(28px)", bg: "rgba(178,7,255,0.8)" },
            { transform: "rotateX(-90deg) translateZ(28px)", bg: "rgba(255,255,255,0.3)" },
          ].map((face, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 56,
                height: 56,
                background: face.bg,
                transform: face.transform,
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 6,
              }}
            />
          ))}
        </motion.div>
      </div>
    </AnimCard>
  );
}

function AnimatePresenceModesDemo() {
  const [page, setPage] = useState(0);
  const pages = ["🌟 Page A", "🎯 Page B", "🚀 Page C"];
  return (
    <AnimCard title="AnimatePresence Modes">
      <div className="flex flex-col items-center gap-3 w-full">
        <div className="relative h-10 w-full flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="text-sm font-medium px-4 py-2 rounded-lg absolute"
              style={{ background: "rgba(158,158,255,0.1)", color: "#9E9EFF" }}
            >
              {pages[page]}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex gap-2">
          {pages.map((_, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.85 }}
              onClick={() => setPage(i)}
              className="w-2 h-2 rounded-full cursor-pointer"
              animate={{ opacity: page === i ? 1 : 0.3, scale: page === i ? 1.3 : 1 }}
              style={{ background: "#9E9EFF" }}
            />
          ))}
        </div>
      </div>
    </AnimCard>
  );
}

function VariantsDemo() {
  const [active, setActive] = useState(false);
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };
  return (
    <AnimCard title="Variants">
      <div className="flex flex-col items-center gap-3">
        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key="grid"
              variants={container}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="grid grid-cols-3 gap-2"
            >
              {Array.from({ length: 9 }).map((_, i) => (
                <motion.div
                  key={i}
                  variants={item}
                  className="w-7 h-7 rounded"
                  style={{ background: `hsl(${i * 30 + 200}, 70%, 65%)` }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActive(!active)}
          className="text-xs px-3 py-1 rounded-full border cursor-pointer"
          style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)" }}
        >
          {active ? "Reset" : "Stagger In"}
        </motion.button>
      </div>
    </AnimCard>
  );
}

export function BasicSection() {
  return (
    <section>
      <SectionHeader
        id="basic"
        title="Basic Animations"
        sub="Spring physics, drag, enter/exit, gestures, keyframes, variants and 3D transforms"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <CSSSpringDemo />
        <DragDemo />
        <EnterAnimationDemo />
        <ExitAnimationDemo />
        <GesturesDemo />
        <HTMLContentDemo />
        <KeyframesDemo />
        <KeyframeWildcardsDemo />
        <RotateDemo />
        <TransitionOptionsDemo />
        <Cube3DDemo />
        <AnimatePresenceModesDemo />
        <VariantsDemo />
      </div>
    </section>
  );
}
