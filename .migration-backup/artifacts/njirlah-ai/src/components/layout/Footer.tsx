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
    <footer className="flex-shrink-0 border-t border-white/[0.06] py-3 px-6 flex items-center justify-between">
      <p className="text-[11px] text-white/20 font-mono">
        NJIRLAH AI &copy; {new Date().getFullYear()}
      </p>
      <p className="text-[11px] text-white/25 flex items-center gap-1.5 font-mono">
        built with <AnimatedHeart /> by{" "}
        <span className="text-white/45 font-medium">Andikaa Saputraa</span>
      </p>
      <p className="text-[11px] text-white/15 font-mono hidden md:block">
        njir lah keren
      </p>
    </footer>
  );
}
