import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

function CircleSpinnerDemo() {
  return (
    <AnimCard title="Loading: Circle Spinner">
      <svg width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="18" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
        <motion.circle
          cx="24" cy="24" r="18"
          fill="none" stroke="#9E9EFF" strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="28 85"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ originX: "24px", originY: "24px" }}
        />
      </svg>
    </AnimCard>
  );
}

function JumpingDotsDemo() {
  return (
    <AnimCard title="Loading: Jumping Dots">
      <div className="flex gap-2 items-end h-10">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
            className="w-3 h-3 rounded-full"
            style={{ background: `hsl(${i * 60 + 200}, 70%, 70%)` }}
          />
        ))}
      </div>
    </AnimCard>
  );
}

function LoadingRippleDemo() {
  return (
    <AnimCard title="Loading Ripple">
      <div className="relative w-16 h-16 flex items-center justify-center">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border"
            style={{ borderColor: "rgba(158,158,255,0.6)" }}
            animate={{ width: [12, 64], height: [12, 64], opacity: [0.8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }}
          />
        ))}
        <div className="w-3 h-3 rounded-full" style={{ background: "#9E9EFF" }} />
      </div>
    </AnimCard>
  );
}

function PulseDotsDemo() {
  return (
    <AnimCard title="Loading: Pulse Dots">
      <div className="flex gap-2 items-center">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: "#8DF0CC" }}
          />
        ))}
      </div>
    </AnimCard>
  );
}

function ProgressBarDemo() {
  const [key, setKey] = useState(0);
  return (
    <AnimCard title="Loading Progress Bar">
      <div className="flex flex-col items-center gap-3 w-full px-4">
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
          <motion.div
            key={key}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #9E9EFF, #8DF0CC)" }}
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

function LoadingOverlayDemo() {
  const [show, setShow] = useState(false);
  return (
    <AnimCard title="Loading Overlay">
      <div className="relative">
        <motion.button
          whileHover={{ opacity: 0.85 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setShow(true); setTimeout(() => setShow(false), 2000); }}
          className="px-4 py-2 rounded-xl text-sm font-medium cursor-pointer"
          style={{ background: "rgba(158,158,255,0.15)", color: "#9E9EFF" }}
        >
          Show Overlay
        </motion.button>
        <AnimatePresence>
          {show && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center rounded-xl"
              style={{ background: "rgba(5,5,10,0.85)", backdropFilter: "blur(4px)" }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28">
                <motion.circle
                  cx="14" cy="14" r="10"
                  fill="none" stroke="#9E9EFF" strokeWidth="2.5"
                  strokeLinecap="round" strokeDasharray="16 47"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                  style={{ originX: "14px", originY: "14px" }}
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimCard>
  );
}

function InfiniteLoadingDemo() {
  return (
    <AnimCard title="Infinite Loading">
      <div className="flex flex-col gap-2 w-full px-4">
        {[0, 1].map((i) => (
          <div key={i} className="w-full h-1.5 rounded-full overflow-hidden relative" style={{ background: "rgba(255,255,255,0.06)" }}>
            <motion.div
              className="absolute h-full rounded-full"
              style={{ background: i === 0 ? "#9E9EFF" : "#8DF0CC", width: "40%" }}
              animate={{ x: ["-50%", "250%"] }}
              transition={{ duration: 1.4 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
            />
          </div>
        ))}
        <div className="flex items-center gap-2 mt-1">
          <motion.div
            className="w-6 h-6 rounded border flex items-center justify-center"
            style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <div className="flex flex-col gap-1 flex-1">
            {[100, 70].map((w, j) => (
              <motion.div
                key={j}
                className="h-1.5 rounded-full"
                style={{ width: `${w}%`, background: "rgba(255,255,255,0.08)" }}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: j * 0.15 }}
              />
            ))}
          </div>
        </div>
      </div>
    </AnimCard>
  );
}

function FollowPointerSpringDemo() {
  const mouseX = useState(0)[0];
  const mouseY = useState(0)[0];
  const x = useState(0)[0];
  const y = useState(0)[0];
  return (
    <AnimCard title="Loading: Pulse Ring">
      <div className="relative w-16 h-16">
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          style={{ background: "rgba(141,240,204,0.3)", border: "2px solid #8DF0CC" }}
        />
        <motion.div
          className="absolute inset-2 rounded-full"
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
          style={{ background: "rgba(141,240,204,0.2)", border: "2px solid #8DF0CC" }}
        />
        <div className="absolute inset-5 rounded-full" style={{ background: "#8DF0CC" }} />
      </div>
    </AnimCard>
  );
}

export function LoadersSection() {
  return (
    <section>
      <SectionHeader
        id="loaders"
        title="Loading States"
        sub="Circle spinner, jumping dots, ripple, pulse, progress bar, overlay and infinite loaders"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <CircleSpinnerDemo />
        <JumpingDotsDemo />
        <LoadingRippleDemo />
        <PulseDotsDemo />
        <ProgressBarDemo />
        <LoadingOverlayDemo />
        <InfiniteLoadingDemo />
        <FollowPointerSpringDemo />
      </div>
    </section>
  );
}
