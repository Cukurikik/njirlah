import { motion } from "framer-motion";

interface UnicornLogoProps {
  size?: number;
  animated?: boolean;
  className?: string;
}

export function UnicornLogo({ size = 28, animated = false, className = "" }: UnicornLogoProps) {
  const id = `ug-${size}`;

  const horn = (
    <motion.path
      d="M20 3 L24 15 L16 15 Z"
      fill={`url(#${id}-horn)`}
      animate={animated ? { opacity: [0.85, 1, 0.85] } : {}}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    />
  );

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
        <linearGradient id={`${id}-shadow`} x1="14" y1="27" x2="26" y2="37" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}-glow`}>
          <feGaussianBlur stdDeviation="1.2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Mane — behind head */}
      <path
        d="M27 14 Q33 17 32 22 Q35 19 34 25 Q36 21 33 27 Q35 23 31 29"
        stroke={`url(#${id}-mane)`}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.85"
      />

      {/* Horn */}
      {horn}
      {/* Horn ridge detail */}
      <line x1="20" y1="5" x2="22" y2="13" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" strokeLinecap="round" />

      {/* Head body */}
      <path
        d="M13 15 Q10 20 11 26 Q13 34 20 36 Q27 34 29 26 Q30 20 27 15 Z"
        fill={`url(#${id}-head)`}
      />

      {/* Shadow under snout */}
      <path
        d="M14 28 Q17 36 20 36 Q23 36 26 28"
        fill={`url(#${id}-shadow)`}
      />

      {/* Ear */}
      <path d="M14 16 L12 10 L17 14 Z" fill="#ddd6fe" />
      <path d="M14 16 L13 12 L16.5 14.5 Z" fill="#c4b5fd" />

      {/* Eye */}
      <ellipse cx="17.5" cy="22" rx="2.2" ry="2.4" fill="#1e1b4b" />
      <ellipse cx="18.3" cy="21.2" rx="0.8" ry="0.9" fill="white" opacity="0.9" />
      <circle cx="17.2" cy="22.8" rx="0.4" fill="white" opacity="0.5" />

      {/* Cheek blush */}
      <ellipse cx="22.5" cy="27" rx="3" ry="1.5" fill="#f9a8d4" opacity="0.3" />

      {/* Nostril */}
      <ellipse cx="21.5" cy="31.5" rx="1.4" ry="0.9" fill="#c4b5fd" opacity="0.5" />

      {/* Horn glow */}
      <path
        d="M20 3 L24 15 L16 15 Z"
        fill="none"
        stroke="rgba(167,139,250,0.4)"
        strokeWidth="0.5"
        filter={`url(#${id}-glow)`}
      />
    </svg>
  );
}

export function UnicornIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  const id = `ui-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id={`${id}-h`} x1="12" y1="12" x2="28" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ede9fe" />
          <stop offset="100%" stopColor="#ddd6fe" />
        </linearGradient>
        <linearGradient id={`${id}-n`} x1="20" y1="2" x2="20" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id={`${id}-m`} x1="26" y1="12" x2="36" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
      </defs>
      <path d="M27 14 Q32 18 31 24 Q34 20 33 26 Q35 22 31 29" stroke={`url(#${id}-m)`} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9"/>
      <path d="M20 3 L24 15 L16 15 Z" fill={`url(#${id}-n)`} />
      <path d="M13 15 Q10 20 11 26 Q13 34 20 36 Q27 34 29 26 Q30 20 27 15 Z" fill={`url(#${id}-h)`} />
      <path d="M14 16 L12 10 L17 14 Z" fill="#ddd6fe" />
      <ellipse cx="17.5" cy="22" rx="2.2" ry="2.4" fill="#1e1b4b" />
      <ellipse cx="18.3" cy="21.2" rx="0.8" ry="0.9" fill="white" opacity="0.9" />
    </svg>
  );
}
