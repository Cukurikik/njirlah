import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NJIRLAHLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

function GlitchText({ text, className }: { text: string; className?: string }) {
  const [glitching, setGlitching] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerGlitch = useCallback(() => {
    setGlitching(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setGlitching(false), 600);
  }, []);

  return (
    <span
      className={`relative inline-block select-none cursor-pointer ${className}`}
      onMouseEnter={triggerGlitch}
      style={{ fontFamily: "'Orbitron', 'Space Grotesk', sans-serif" }}
    >
      <span className="relative z-10">{text}</span>
      {glitching && (
        <>
          <motion.span
            className="absolute inset-0 z-20 pointer-events-none"
            style={{ color: "#06B6D4", clipPath: "inset(30% 0 40% 0)", mixBlendMode: "screen" }}
            animate={{ x: [-3, 3, -2, 2, 0] }}
            transition={{ duration: 0.3, times: [0, 0.25, 0.5, 0.75, 1] }}
          >
            {text}
          </motion.span>
          <motion.span
            className="absolute inset-0 z-20 pointer-events-none"
            style={{ color: "#EC4899", clipPath: "inset(60% 0 10% 0)", mixBlendMode: "screen" }}
            animate={{ x: [2, -3, 3, -2, 0] }}
            transition={{ duration: 0.3, times: [0, 0.25, 0.5, 0.75, 1] }}
          >
            {text}
          </motion.span>
        </>
      )}
    </span>
  );
}

function DancingUnicorn() {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        animate={{
          y: [0, -30, 0, -20, 0, -30, 0],
          rotate: [-10, 10, -8, 8, -10, 10, 0],
          scale: [1, 1.15, 1, 1.1, 1, 1.15, 1],
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="flex flex-col items-center gap-4"
      >
        <svg width="120" height="120" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="dance-horn" x1="20" y1="3" x2="20" y2="15" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#c4b5fd" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="dance-head" x1="12" y1="14" x2="28" y2="37" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ede9fe" />
              <stop offset="100%" stopColor="#ddd6fe" />
            </linearGradient>
            <linearGradient id="dance-mane" x1="26" y1="13" x2="36" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="50%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
            <filter id="dance-glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <path d="M27 14 Q33 17 32 22 Q35 19 34 25 Q36 21 33 27 Q35 23 31 29" stroke="url(#dance-mane)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M20 3 L24 15 L16 15 Z" fill="url(#dance-horn)" filter="url(#dance-glow)" />
          <path d="M13 15 Q10 20 11 26 Q13 34 20 36 Q27 34 29 26 Q30 20 27 15 Z" fill="url(#dance-head)" />
          <path d="M14 16 L12 10 L17 14 Z" fill="#ddd6fe" />
          <ellipse cx="17.5" cy="22" rx="2.2" ry="2.4" fill="#1e1b4b" />
          <ellipse cx="18.3" cy="21.2" rx="0.8" ry="0.9" fill="white" opacity="0.9" />
          <ellipse cx="22.5" cy="27" rx="3" ry="1.5" fill="#f9a8d4" opacity="0.4" />
        </svg>
        <motion.p
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.5, times: [0, 0.2, 0.8, 1] }}
          className="text-2xl font-black tracking-[0.3em] text-transparent bg-clip-text"
          style={{
            backgroundImage: "linear-gradient(90deg, #A855F7, #06B6D4, #EC4899)",
            fontFamily: "'Orbitron', sans-serif",
          }}
        >
          NJIRLAH ✨
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

export function NJIRLAHLogo({ size = 28, showText = true, className = "" }: NJIRLAHLogoProps) {
  const [clickCount, setClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const clickResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = `njirl-${size}`;

  const handleClick = useCallback(() => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (clickResetRef.current) clearTimeout(clickResetRef.current);
    clickResetRef.current = setTimeout(() => setClickCount(0), 800);

    if (newCount >= 3) {
      setClickCount(0);
      setShowEasterEgg(true);
      setTimeout(() => setShowEasterEgg(false), 2000);
    }
  }, [clickCount]);

  return (
    <>
      <AnimatePresence>{showEasterEgg && <DancingUnicorn />}</AnimatePresence>

      <motion.div
        className={`flex items-center gap-2 cursor-pointer select-none ${className}`}
        onClick={handleClick}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.94 }}
      >
        {/* SVG unicorn icon with neon glow */}
        <motion.svg
          width={size}
          height={size}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={{ filter: ["drop-shadow(0 0 4px #A855F7)", "drop-shadow(0 0 8px #06B6D4)", "drop-shadow(0 0 4px #EC4899)", "drop-shadow(0 0 8px #A855F7)"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <defs>
            <linearGradient id={`${id}-horn`} x1="20" y1="3" x2="20" y2="15" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#c4b5fd" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id={`${id}-head`} x1="12" y1="14" x2="28" y2="37" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ede9fe" />
              <stop offset="100%" stopColor="#ddd6fe" />
            </linearGradient>
            <linearGradient id={`${id}-mane`} x1="26" y1="13" x2="36" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="50%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
            <filter id={`${id}-glow`}>
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <path d="M27 14 Q33 17 32 22 Q35 19 34 25 Q36 21 33 27" stroke={`url(#${id}-mane)`} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" />
          <motion.path
            d="M20 3 L24 15 L16 15 Z"
            fill={`url(#${id}-horn)`}
            filter={`url(#${id}-glow)`}
            animate={{ opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <path d="M13 15 Q10 20 11 26 Q13 34 20 36 Q27 34 29 26 Q30 20 27 15 Z" fill={`url(#${id}-head)`} />
          <path d="M14 16 L12 10 L17 14 Z" fill="#ddd6fe" />
          <path d="M14.5 15.5 L13 11.5 L16.5 14.5 Z" fill="#c4b5fd" />
          <ellipse cx="17.5" cy="22" rx="2.2" ry="2.4" fill="#1e1b4b" />
          <ellipse cx="18.3" cy="21.2" rx="0.8" ry="0.9" fill="white" opacity="0.9" />
          <circle cx="17.2" cy="22.8" r="0.4" fill="white" opacity="0.5" />
          <ellipse cx="22.5" cy="27" rx="3" ry="1.5" fill="#f9a8d4" opacity="0.3" />
          <ellipse cx="21.5" cy="31.5" rx="1.4" ry="0.9" fill="#c4b5fd" opacity="0.5" />
        </motion.svg>

        {showText && (
          <GlitchText
            text="NJIRLAH"
            className="text-[11px] font-black tracking-[0.22em] text-white/50 hover:text-white/75 transition-colors"
          />
        )}
      </motion.div>
    </>
  );
}
