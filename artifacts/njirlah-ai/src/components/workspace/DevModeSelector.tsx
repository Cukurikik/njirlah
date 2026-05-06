import { motion } from "framer-motion";
import { Globe, Smartphone, Zap } from "lucide-react";
import { useDevModeStore, type DevMode } from "@/store/dev-mode-store";

const MODE_ICONS: Record<DevMode, React.ReactNode> = {
  website: <Globe size={12} />,
  mobile: <Smartphone size={12} />,
  fullstack: <Zap size={12} />,
};

const MODE_COLORS: Record<DevMode, { active: string; glow: string }> = {
  website: { active: "border-cyan-500/40 bg-cyan-500/[0.08] text-cyan-300", glow: "rgba(0,229,255,0.15)" },
  mobile: { active: "border-pink-500/40 bg-pink-500/[0.08] text-pink-300", glow: "rgba(255,77,158,0.15)" },
  fullstack: { active: "border-violet-500/40 bg-violet-500/[0.08] text-violet-300", glow: "rgba(124,77,255,0.15)" },
};

const MODES: { id: DevMode; label: string; short: string }[] = [
  { id: "website", label: "Website Dev", short: "Web" },
  { id: "mobile", label: "Mobile Dev", short: "Mobile" },
  { id: "fullstack", label: "Full Stack", short: "Full Stack" },
];

export function DevModeSelector() {
  const { activeMode, setMode } = useDevModeStore();

  return (
    <div className="flex items-center gap-1 bg-white/[0.02] border border-white/[0.06] rounded-xl p-1">
      {MODES.map((mode) => {
        const isActive = activeMode === mode.id;
        const colors = MODE_COLORS[mode.id];
        return (
          <motion.button
            key={mode.id}
            onClick={() => setMode(mode.id)}
            whileHover={!isActive ? { backgroundColor: "rgba(255,255,255,0.03)" } : {}}
            whileTap={{ scale: 0.96 }}
            animate={{
              boxShadow: isActive ? `0 0 12px ${colors.glow}` : "0 0 0px transparent",
            }}
            transition={{ duration: 0.2 }}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono transition-all ${
              isActive
                ? `border ${colors.active}`
                : "text-white/30 hover:text-white/55 border border-transparent"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="dev-mode-active"
                className="absolute inset-0 rounded-lg"
                style={{ background: colors.glow }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <span className={isActive ? "" : "opacity-50"}>{MODE_ICONS[mode.id]}</span>
              <span className="hidden sm:inline">{mode.label}</span>
              <span className="sm:hidden">{mode.short}</span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
