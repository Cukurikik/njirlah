import { useEffect, useRef } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";

function UnicornPath() {
  const progress = useMotionValue(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useAnimationFrame((t) => {
    const p = (t / 6000) % 1;
    progress.set(p);
    const angle = p * Math.PI * 2;
    x.set(Math.cos(angle) * 28);
    y.set(Math.sin(angle * 2) * 6);
  });

  return (
    <motion.span
      style={{ x, y, display: "inline-block" }}
      className="text-xs select-none"
      title="unicorn along path"
    >
      🦄
    </motion.span>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto flex-shrink-0 border-t border-white/[0.06] bg-black/40 backdrop-blur-md py-3 px-6 flex items-center justify-between gap-4 flex-wrap">
      <p className="text-[11px] text-white/20 font-mono whitespace-nowrap">
        NJIRLAH AI © {new Date().getFullYear()}
      </p>

      <p className="text-sm font-bold text-pink-400 flex items-center justify-center gap-1.5 flex-1 whitespace-nowrap">
        Dibuat dengan{" "}
        <motion.span
          animate={{ scale: [1, 1.35, 1] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block text-red-500"
        >
          ❤️
        </motion.span>{" "}
        oleh{" "}
        <span className="underline decoration-violet-400/60 text-pink-300">
          Andikaa Saputraa
        </span>
      </p>

      <div className="hidden md:flex items-center gap-3 flex-shrink-0">
        <p className="text-[10px] text-gray-500 font-mono">
          membangun masa depan AI yang bebas, tanpa batas, ala kadarnya tapi njir lah keren.
        </p>
        <UnicornPath />
      </div>
    </footer>
  );
}
