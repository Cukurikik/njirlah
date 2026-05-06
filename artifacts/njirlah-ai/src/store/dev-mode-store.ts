import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DevMode = "website" | "mobile" | "fullstack";

export interface DevModeConfig {
  id: DevMode;
  label: string;
  emoji: string;
  color: string;
  activeColor: string;
  stacks: string[];
  systemPrompt: string;
}

export const DEV_MODES: DevModeConfig[] = [
  {
    id: "website",
    label: "Website Dev",
    emoji: "🌐",
    color: "text-cyan-400",
    activeColor: "border-cyan-500/40 bg-cyan-500/[0.07] text-cyan-300",
    stacks: ["React", "Next.js", "Vue", "Astro", "SvelteKit", "HTML/CSS/JS"],
    systemPrompt: `You are NJIRLAH AI in Website Development mode.
Focus: HTML, CSS, JavaScript, React, Next.js, Astro, SvelteKit, Vue.
- Always use Tailwind CSS for styling
- Include <script src="https://cdn.tailwindcss.com"></script> for standalone HTML previews
- Use shadcn/ui component patterns for React projects
- Make everything responsive (mobile-first)
- Dark mode by default
- Output complete, production-ready code`,
  },
  {
    id: "mobile",
    label: "Mobile Dev",
    emoji: "📱",
    color: "text-pink-400",
    activeColor: "border-pink-500/40 bg-pink-500/[0.07] text-pink-300",
    stacks: ["React Native", "Expo", "Flutter", "Swift", "Kotlin"],
    systemPrompt: `You are NJIRLAH AI in Mobile Development mode.
Focus: React Native, Expo, Flutter (Dart), iOS (Swift), Android (Kotlin).
- Prefer React Native + Expo for cross-platform
- Use StyleSheet.create() for React Native styling
- Follow platform-specific UI guidelines (iOS/Android)
- Handle device permissions, navigation, and async storage
- Output complete, runnable mobile app code`,
  },
  {
    id: "fullstack",
    label: "Full Stack Dev",
    emoji: "⚡",
    color: "text-violet-400",
    activeColor: "border-violet-500/40 bg-violet-500/[0.07] text-violet-300",
    stacks: ["Next.js + Prisma", "Node.js + Express", "FastAPI + React", "NestJS", "T3 Stack"],
    systemPrompt: `You are NJIRLAH AI in Full Stack Development mode.
Focus: Next.js + Prisma, Node.js + Express, FastAPI + React, NestJS, T3 Stack.
- Always include both frontend and backend code
- Set up proper authentication (JWT/session)
- Include database schema and migrations
- Add proper error handling and validation
- Use TypeScript everywhere possible
- Output complete, production-ready full-stack code`,
  },
];

interface DevModeStore {
  activeMode: DevMode;
  setMode: (mode: DevMode) => void;
  getActiveConfig: () => DevModeConfig;
}

export const useDevModeStore = create<DevModeStore>()(
  persist(
    (set, get) => ({
      activeMode: "website",
      setMode: (mode) => set({ activeMode: mode }),
      getActiveConfig: () => DEV_MODES.find((m) => m.id === get().activeMode)!,
    }),
    { name: "njirlah-dev-mode" }
  )
);
