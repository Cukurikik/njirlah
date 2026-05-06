import { motion } from "framer-motion";
import { Globe, Smartphone, Zap } from "lucide-react";
import { useDevModeStore, type DevMode } from "@/store/dev-mode-store";

const MODES: {
  id: DevMode;
  label: string;
  icon: React.ReactNode;
  dot: string;
  activeClass: string;
  activeDot: string;
}[] = [
  {
    id: "website",
    label: "Website",
    icon: <Globe size={11} />,
    dot: "#22d3ee",
    activeClass: "text-cyan-300 border-cyan-500/30 bg-cyan-500/[0.07]",
    activeDot: "bg-cyan-400",
  },
  {
    id: "mobile",
    label: "Mobile",
    icon: <Smartphone size={11} />,
    dot: "#f472b6",
    activeClass: "text-pink-300 border-pink-500/30 bg-pink-500/[0.07]",
    activeDot: "bg-pink-400",
  },
  {
    id: "fullstack",
    label: "Full Stack",
    icon: <Zap size={11} />,
    dot: "#a78bfa",
    activeClass: "text-violet-300 border-violet-500/30 bg-violet-500/[0.07]",
    activeDot: "bg-violet-400",
  },
];

export function DevModeSelector() {
  const { activeMode, setMode } = useDevModeStore();

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl border border-white/[0.06] bg-white/[0.02]">
      {MODES.map((mode) => {
        const isActive = activeMode === mode.id;
        return (
          <motion.button
            key={mode.id}
            onClick={() => setMode(mode.id)}
            whileTap={{ scale: 0.95 }}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 ${
              isActive
                ? `border ${mode.activeClass}`
                : "text-white/30 hover:text-white/55 border border-transparent"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="devmode-bg"
                className="absolute inset-0 rounded-lg"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <span className={`${isActive ? "" : "opacity-40"}`}>{mode.icon}</span>
              <span className="hidden sm:inline">{mode.label}</span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
