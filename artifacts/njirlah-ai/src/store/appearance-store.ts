import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AccentColor = "violet" | "blue" | "cyan" | "emerald" | "rose" | "amber";
export type Density = "compact" | "default" | "relaxed";

export const ACCENT_MAP: Record<AccentColor, {
  hex: string; rgb: string; light: string;
  oklch300: string; oklch400: string; oklch500: string; oklch600: string;
  hsl: string; hslDark: string;
}> = {
  violet: {
    hex: "#7c3aed", rgb: "124,58,237", light: "rgba(124,58,237,0.12)",
    oklch300: "oklch(0.811 0.111 299.42)", oklch400: "oklch(0.702 0.183 301.50)",
    oklch500: "oklch(0.606 0.228 302.32)", oklch600: "oklch(0.541 0.210 300.02)",
    hsl: "262 83% 68%", hslDark: "262 83% 58%",
  },
  blue: {
    hex: "#2563eb", rgb: "37,99,235", light: "rgba(37,99,235,0.12)",
    oklch300: "oklch(0.809 0.105 253.02)", oklch400: "oklch(0.680 0.162 255.70)",
    oklch500: "oklch(0.623 0.214 259.82)", oklch600: "oklch(0.546 0.235 263.83)",
    hsl: "217 91% 60%", hslDark: "217 91% 50%",
  },
  cyan: {
    hex: "#0891b2", rgb: "8,145,178", light: "rgba(8,145,178,0.12)",
    oklch300: "oklch(0.865 0.127 207.08)", oklch400: "oklch(0.789 0.154 211.59)",
    oklch500: "oklch(0.715 0.143 215.00)", oklch600: "oklch(0.609 0.126 221.72)",
    hsl: "192 90% 50%", hslDark: "192 90% 40%",
  },
  emerald: {
    hex: "#059669", rgb: "5,150,105", light: "rgba(5,150,105,0.12)",
    oklch300: "oklch(0.845 0.133 167.55)", oklch400: "oklch(0.765 0.177 159.02)",
    oklch500: "oklch(0.696 0.170 162.37)", oklch600: "oklch(0.596 0.145 163.23)",
    hsl: "158 64% 52%", hslDark: "158 64% 40%",
  },
  rose: {
    hex: "#e11d48", rgb: "225,29,72", light: "rgba(225,29,72,0.12)",
    oklch300: "oklch(0.808 0.134 2.02)", oklch400: "oklch(0.712 0.194 13.43)",
    oklch500: "oklch(0.645 0.222 16.44)", oklch600: "oklch(0.587 0.208 17.08)",
    hsl: "347 77% 60%", hslDark: "347 77% 50%",
  },
  amber: {
    hex: "#d97706", rgb: "217,119,6", light: "rgba(217,119,6,0.12)",
    oklch300: "oklch(0.878 0.153 91.60)", oklch400: "oklch(0.833 0.155 76.74)",
    oklch500: "oklch(0.769 0.154 68.07)", oklch600: "oklch(0.666 0.177 58.32)",
    hsl: "38 92% 55%", hslDark: "38 92% 45%",
  },
};

interface AppearanceStore {
  accent: AccentColor;
  density: Density;
  setAccent: (accent: AccentColor) => void;
  setDensity: (density: Density) => void;
}

export const useAppearanceStore = create<AppearanceStore>()(
  persist(
    (set) => ({
      accent: "violet",
      density: "default",
      setAccent: (accent) => set({ accent }),
      setDensity: (density) => set({ density }),
    }),
    { name: "njirlah-appearance" },
  ),
);
