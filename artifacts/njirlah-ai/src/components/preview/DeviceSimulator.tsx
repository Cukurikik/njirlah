import { motion } from "framer-motion";
import { Monitor, Tablet, Smartphone } from "lucide-react";

export type DeviceMode = "desktop" | "tablet" | "mobile";

interface DeviceSimulatorProps {
  mode: DeviceMode;
  onChange: (mode: DeviceMode) => void;
}

const devices: { id: DeviceMode; icon: React.ReactNode; label: string }[] = [
  { id: "desktop", icon: <Monitor size={14} />, label: "Desktop" },
  { id: "tablet", icon: <Tablet size={14} />, label: "Tablet" },
  { id: "mobile", icon: <Smartphone size={14} />, label: "Mobile" },
];

export function DeviceSimulator({ mode, onChange }: DeviceSimulatorProps) {
  return (
    <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
      {devices.map((d) => (
        <motion.button
          key={d.id}
          onClick={() => onChange(d.id)}
          title={d.label}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative flex items-center justify-center w-7 h-7 rounded-md transition-colors ${
            mode === d.id ? "text-white" : "text-gray-500 hover:text-gray-300"
          }`}
        >
          {mode === d.id && (
            <motion.div
              layoutId="device-indicator"
              className="absolute inset-0 rounded-md bg-blue-600"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{d.icon}</span>
        </motion.button>
      ))}
    </div>
  );
}

export function deviceWidth(mode: DeviceMode): string {
  if (mode === "tablet") return "768px";
  if (mode === "mobile") return "375px";
  return "100%";
}
