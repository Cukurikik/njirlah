import { motion } from "framer-motion";

interface AILogoProps {
  size?: number;
  animated?: boolean;
  className?: string;
}

export function AILogo({ size = 28, animated = false, className = "" }: AILogoProps) {
  const id = `al-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={`${id}-g1`} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id={`${id}-g2`} x1="40" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <filter id={`${id}-glow`}>
          <feGaussianBlur stdDeviation="1" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer hexagon */}
      <path
        d="M20 3 L34 11 L34 29 L20 37 L6 29 L6 11 Z"
        stroke={`url(#${id}-g1)`}
        strokeWidth="1.2"
        fill="none"
        opacity="0.5"
      />

      {/* Inner hexagon */}
      <path
        d="M20 9 L29 14 L29 26 L20 31 L11 26 L11 14 Z"
        stroke={`url(#${id}-g2)`}
        strokeWidth="1"
        fill={`url(#${id}-g1)`}
        fillOpacity="0.08"
      />

      {/* Center circuit node */}
      <motion.circle
        cx="20"
        cy="20"
        r="3.5"
        fill={`url(#${id}-g2)`}
        filter={`url(#${id}-glow)`}
        animate={animated ? { opacity: [0.7, 1, 0.7] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Circuit lines - 6 directions */}
      <line x1="20" y1="16.5" x2="20" y2="9" stroke="#a78bfa" strokeWidth="0.8" opacity="0.6" />
      <line x1="20" y1="23.5" x2="20" y2="31" stroke="#a78bfa" strokeWidth="0.8" opacity="0.6" />
      <line x1="16.8" y1="18.2" x2="11" y2="15" stroke="#a78bfa" strokeWidth="0.8" opacity="0.6" />
      <line x1="23.2" y1="21.8" x2="29" y2="25" stroke="#a78bfa" strokeWidth="0.8" opacity="0.6" />
      <line x1="16.8" y1="21.8" x2="11" y2="25" stroke="#a78bfa" strokeWidth="0.8" opacity="0.6" />
      <line x1="23.2" y1="18.2" x2="29" y2="15" stroke="#a78bfa" strokeWidth="0.8" opacity="0.6" />

      {/* Corner dots */}
      <circle cx="20" cy="9" r="1.2" fill="#c4b5fd" opacity="0.8" />
      <circle cx="20" cy="31" r="1.2" fill="#c4b5fd" opacity="0.8" />
      <circle cx="11" cy="15" r="1.2" fill="#c4b5fd" opacity="0.8" />
      <circle cx="29" cy="25" r="1.2" fill="#c4b5fd" opacity="0.8" />
      <circle cx="11" cy="25" r="1.2" fill="#c4b5fd" opacity="0.8" />
      <circle cx="29" cy="15" r="1.2" fill="#c4b5fd" opacity="0.8" />

      {/* Outer pulse ring */}
      {animated && (
        <motion.circle
          cx="20"
          cy="20"
          r="3.5"
          stroke="#a78bfa"
          strokeWidth="0.5"
          fill="none"
          animate={{ r: [3.5, 8, 3.5], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
        />
      )}
    </svg>
  );
}

export function AIIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  const id = `ai-icon-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <path d="M20 3 L34 11 L34 29 L20 37 L6 29 L6 11 Z" stroke={`url(#${id}-g)`} strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M20 9 L29 14 L29 26 L20 31 L11 26 L11 14 Z" stroke={`url(#${id}-g)`} strokeWidth="1" fill={`url(#${id}-g)`} fillOpacity="0.1" />
      <circle cx="20" cy="20" r="3.5" fill={`url(#${id}-g)`} />
      <line x1="20" y1="16.5" x2="20" y2="9" stroke="#a78bfa" strokeWidth="1" opacity="0.7" />
      <line x1="16.8" y1="18.2" x2="11" y2="15" stroke="#a78bfa" strokeWidth="1" opacity="0.7" />
      <line x1="23.2" y1="18.2" x2="29" y2="15" stroke="#a78bfa" strokeWidth="1" opacity="0.7" />
    </svg>
  );
}
