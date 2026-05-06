import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  showCursor?: boolean;
  onDone?: () => void;
}

export function TypewriterText({ text, speed = 45, className = "", showCursor = true, onDone }: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(timer);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayed}
      {showCursor && !done && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.7, repeat: Infinity }}
          className="inline-block w-[2px] h-[1em] bg-current ml-[1px] align-middle"
        />
      )}
    </span>
  );
}

const TAGLINES = [
  "Chat AI Tersesat, Bebas Pake Kunci Sendiri",
  "Multi-Model · Streaming · Encrypted",
  "Cloudflare + OpenRouter · Zero Config",
  "Syntax Highlighting · Live Preview · Export",
];

export function HeroBrandText() {
  const [tagIndex, setTagIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pause" | "erasing">("typing");
  const [tagDisplayed, setTagDisplayed] = useState("");
  const fullTag = TAGLINES[tagIndex];

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      if (tagDisplayed.length < fullTag.length) {
        timeout = setTimeout(() => setTagDisplayed(fullTag.slice(0, tagDisplayed.length + 1)), 38);
      } else {
        timeout = setTimeout(() => setPhase("pause"), 2400);
      }
    } else if (phase === "pause") {
      timeout = setTimeout(() => setPhase("erasing"), 500);
    } else {
      if (tagDisplayed.length > 0) {
        timeout = setTimeout(() => setTagDisplayed(tagDisplayed.slice(0, -1)), 18);
      } else {
        setTagIndex((i) => (i + 1) % TAGLINES.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(timeout);
  }, [phase, tagDisplayed, fullTag, tagIndex]);

  return (
    <div className="text-center select-none">
      {/* Brand mark */}
      <motion.div
        initial={{ letterSpacing: "0.5em", opacity: 0 }}
        animate={{ letterSpacing: "0.12em", opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="text-4xl font-black tracking-[0.12em] text-white font-orbitron mb-1"
      >
        NJIRLAH AI
      </motion.div>

      {/* Tagline typewriter */}
      <div className="h-5 flex items-center justify-center">
        <span className="text-[11px] font-mono tracking-widest text-white/30 uppercase">
          {tagDisplayed}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block w-[1px] h-3 bg-violet-400/60 ml-0.5 align-middle"
          />
        </span>
      </div>
    </div>
  );
}

export function GlitchText({ text, className = "" }: { text: string; className?: string }) {
  const [glitching, setGlitching] = useState(false);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%";

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 300);
    }, 5000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  if (!glitching) return <span className={className}>{text}</span>;

  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          animate={char !== " " ? { opacity: [1, 0.2, 1], y: [0, -1, 0] } : {}}
          transition={{ duration: 0.15, delay: i * 0.02 }}
        >
          {char !== " " && Math.random() > 0.6
            ? chars[Math.floor(Math.random() * chars.length)]
            : char}
        </motion.span>
      ))}
    </span>
  );
}
