import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { StepItem, Step } from "./StepItem";

const STEPS: Step[] = [
  {
    id: "1",
    name: "Step 1: Inisialisasi Proyek",
    description: "Membuat struktur folder, package.json, dan konfigurasi Vite",
    files: ["package.json", "vite.config.ts", "tsconfig.json"],
    duration: "1.2s",
    status: "done",
  },
  {
    id: "2",
    name: "Step 2: Setup Tailwind & Tema",
    description: "Mengonfigurasi Tailwind CSS, tema gelap, dan variabel warna global",
    files: ["tailwind.config.ts", "index.css"],
    duration: "0.8s",
    status: "done",
  },
  {
    id: "3",
    name: "Step 3: Komponen UI Dasar",
    description: "Membangun Button, Input, Card, dan komponen primitif lainnya",
    files: ["Button.tsx", "Input.tsx", "Card.tsx"],
    duration: "3.4s",
    status: "done",
  },
  {
    id: "4",
    name: "Step 4: Chat Interface",
    description: "Implementasi chat area, bubble pesan, dan input dengan streaming",
    files: ["ChatArea.tsx", "ChatBubble.tsx", "ChatInput.tsx"],
    duration: "5.1s",
    status: "running",
  },
  {
    id: "5",
    name: "Step 5: Integrasi AI Model",
    description: "Menghubungkan OpenAI, Anthropic, dan Gemini API ke antarmuka",
    files: ["api-client.ts", "ModelSelector.tsx"],
    status: "waiting",
  },
  {
    id: "6",
    name: "Step 6: Deploy & Optimasi",
    description: "Build production, optimasi bundle, dan konfigurasi deployment",
    files: ["Dockerfile", ".github/workflows/deploy.yml"],
    status: "waiting",
  },
];

export function AgentWorkflowPanel() {
  const [input, setInput] = useState("");

  return (
    <div className="flex flex-col h-full" style={{ background: "#0d0d18" }}>
      <div className="px-5 pt-5 pb-3 border-b border-white/5">
        <h2
          className="text-white text-[18px] font-semibold tracking-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Agent Workflow
        </h2>
        <div className="flex items-center gap-2 mt-1.5">
          <motion.span
            className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
          />
          <span className="text-gray-400 text-xs">Building NJIRLAH AI...</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0 scrollbar-thin scrollbar-thumb-white/10">
        {STEPS.map((step, i) => (
          <StepItem key={step.id} step={step} index={i} />
        ))}
      </div>

      <div className="px-4 pb-5 pt-3 border-t border-white/5 space-y-3">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the Agent about the next step..."
            className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-3 pr-11 text-white text-sm placeholder-gray-500 outline-none focus:border-blue-500/50 transition-colors"
            style={{ fontFamily: "Inter, sans-serif" }}
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.93 }}
            className="absolute right-3 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Send size={16} />
          </motion.button>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 border border-white/20 text-white text-xs font-medium rounded-lg py-2 px-3 transition-colors"
          >
            View Proposed Plan
          </motion.button>
          <motion.button
            whileHover={{ backgroundColor: "#2563eb" }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 bg-blue-600 text-white text-xs font-medium rounded-lg py-2 px-3 transition-colors"
          >
            Save
          </motion.button>
          <motion.button
            whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 border border-gray-600 text-gray-300 text-xs font-medium rounded-lg py-2 px-3 transition-colors"
          >
            Fork
          </motion.button>
        </div>
      </div>
    </div>
  );
}
