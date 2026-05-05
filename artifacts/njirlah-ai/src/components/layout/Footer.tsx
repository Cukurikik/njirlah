import { motion } from "framer-motion";

function AnimatedHeart() {
  return (
    <motion.span
      animate={{ scale: [1, 1.3, 1] }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
      className="inline-block text-pink-400"
    >
      ❤️
    </motion.span>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-black/40 backdrop-blur-md py-4 text-center flex-shrink-0">
      <p className="text-base font-bold text-pink-400 flex items-center justify-center gap-2 font-space-grotesk">
        Dibuat dengan <AnimatedHeart /> oleh{" "}
        <span className="underline decoration-purple-400 text-white">Andikaa Saputraa</span>
      </p>
      <p className="text-xs text-gray-500 mt-1">
        Membangun masa depan AI yang bebas, tanpa batas, ala kadarnya tapi njir lah keren. &copy; {new Date().getFullYear()}
      </p>
    </footer>
  );
}
