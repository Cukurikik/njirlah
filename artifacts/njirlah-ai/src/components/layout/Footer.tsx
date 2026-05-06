import { motion } from "framer-motion";

function AnimatedHeart() {
  return (
    <motion.span
      animate={{ scale: [1, 1.25, 1] }}
      transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
      className="inline-block text-rose-400"
    >
      ♥
    </motion.span>
  );
}

export function Footer() {
  return (
    <footer className="flex-shrink-0 border-t border-white/[0.06] py-3 px-6 flex items-center justify-between gap-4 flex-wrap">
      <p className="text-[11px] text-white/20 font-mono whitespace-nowrap">
        NJIRLAH AI &copy; {new Date().getFullYear()}
      </p>
      <p className="text-[11px] flex items-center gap-1.5 font-bold text-pink-400/80 flex-1 justify-center whitespace-nowrap">
        Dibuat dengan <AnimatedHeart /> oleh{" "}
        <span className="underline decoration-violet-400/50 text-pink-300">Andikaa Saputraa</span>
      </p>
      <p className="text-[11px] text-white/15 font-mono hidden md:block whitespace-nowrap">
        membangun masa depan AI yang bebas ✨
      </p>
    </footer>
  );
}
