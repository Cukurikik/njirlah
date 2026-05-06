import { useEffect } from "react";
import { useAppearanceStore, ACCENT_MAP } from "@/store/appearance-store";

const DENSITY_CSS: Record<string, string> = {
  compact: `
    .chat-bubble { margin-bottom: 0.5rem !important; }
    .chat-bubble-body { padding: 0.375rem 0.75rem !important; font-size: 0.8rem !important; }
  `,
  default: "",
  relaxed: `
    .chat-bubble { margin-bottom: 2rem !important; }
    .chat-bubble-body { padding: 0.875rem 1.25rem !important; line-height: 1.9 !important; }
  `,
};

export function AppearanceApplier() {
  const { accent, density } = useAppearanceStore();

  useEffect(() => {
    const c = ACCENT_MAP[accent];
    const root = document.documentElement;

    /* 1. Legacy CSS vars used by some components */
    root.style.setProperty("--nj-accent",       c.hex);
    root.style.setProperty("--nj-accent-rgb",   c.rgb);
    root.style.setProperty("--nj-accent-light",  c.light);

    /* 2. Override Tailwind CSS 4 oklch color variables for violet-*
          This makes EVERY "violet-" Tailwind utility class use the new accent.
          Tailwind 4 reads these at runtime from CSS custom props. */
    let styleEl = document.getElementById("njirlah-accent-vars") as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "njirlah-accent-vars";
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `
      :root {
        --color-violet-300: ${c.oklch300};
        --color-violet-400: ${c.oklch400};
        --color-violet-500: ${c.oklch500};
        --color-violet-600: ${c.oklch600};
        --primary:          ${c.hsl};
        --ring:             ${c.hsl};
        --accent:           ${c.hsl};
        --accent-border:    hsl(${c.hslDark});
        --primary-border:   hsl(${c.hslDark});
        --sidebar-primary:  ${c.hsl};
        --sidebar-ring:     ${c.hsl};
      }
    `;
  }, [accent]);

  useEffect(() => {
    document.documentElement.setAttribute("data-density", density);

    let el = document.getElementById("njirlah-density-vars") as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = "njirlah-density-vars";
      document.head.appendChild(el);
    }
    el.textContent = DENSITY_CSS[density] ?? "";
  }, [density]);

  return null;
}
