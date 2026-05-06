import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, FolderOpen, Globe2, Shield, Settings, BookOpen, FileText,
  Plus, ArrowRight, ChevronLeft, ChevronRight, Sparkles, Zap,
  MessageSquare, BarChart2, Layout, Smartphone, FileSpreadsheet,
  Presentation, Upload, ArrowUp
} from "lucide-react";

const NAV_TOP = [
  { icon: Home,        label: "Home",              active: true  },
  { icon: FolderOpen,  label: "Projects"                         },
  { icon: Globe2,      label: "Published Projects"               },
  { icon: Shield,      label: "Security"                         },
  { icon: Settings,    label: "Settings"                         },
];

const NAV_BOTTOM = [
  { icon: BookOpen,    label: "Learn"              },
  { icon: FileText,    label: "Documentation"      },
];

const MODES = [
  { icon: Globe2,           label: "Website",          path: "/app", mode: "website"   },
  { icon: Smartphone,       label: "Mobile",            path: "/app", mode: "mobile"    },
  { icon: BarChart2,        label: "Data Visualization",path: "/app", mode: "fullstack" },
  { icon: FileSpreadsheet,  label: "Spreadsheet",       path: "/app", mode: "fullstack" },
  { icon: Presentation,     label: "Slides",            path: "/app", mode: "fullstack" },
  { icon: MessageSquare,    label: "Chat AI",           path: "/chat",mode: ""          },
  { icon: Layout,           label: "Dashboard",         path: "/app", mode: "website"   },
];

const EXAMPLE_PROMPTS = [
  "Weekly meal planner",
  "Cohort analysis dashboard",
  "3D puzzle platformer",
  "E-commerce landing page",
  "Todo app with auth",
];

const RECENT_PROJECTS = [
  { name: "njirlah", desc: "AI coding workspace", color: "#6d28d9" },
  { name: "my-portfolio", desc: "Personal portfolio site", color: "#0891b2" },
  { name: "dashboard-app", desc: "Analytics dashboard", color: "#059669" },
];

function navigate(path: string) {
  window.history.pushState({}, "", path);
  window.location.reload();
}

export default function LandingPage() {
  const [input, setInput] = useState("");
  const [modesOffset, setModesOffset] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const VISIBLE = 5;
  const canLeft = modesOffset > 0;
  const canRight = modesOffset + VISIBLE < MODES.length;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = (prompt?: string) => {
    const text = (prompt ?? input).trim();
    if (!text) return;
    // Store prompt in sessionStorage and go to agent
    sessionStorage.setItem("initial_prompt", text);
    navigate("/app");
  };

  const handleModeClick = (mode: typeof MODES[0]) => {
    if (mode.path === "/chat") {
      navigate("/chat");
    } else {
      navigate("/app");
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: "#0d0d0d", color: "#fff", fontFamily: "'Space Grotesk', Inter, sans-serif" }}>

      {/* ── Left Sidebar ── */}
      <div className="flex flex-col w-[220px] flex-shrink-0 border-r border-white/[0.06]" style={{ background: "#111111" }}>
        {/* Workspace selector */}
        <div className="px-3 pt-4 pb-3">
          <motion.button
            whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors"
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
              style={{ background: "linear-gradient(135deg, #6d28d9, #a855f7)" }}>
              N
            </div>
            <span className="flex-1 text-sm font-semibold text-white/80 truncate text-left">NJIRLAH AI</span>
            <ChevronRight size={13} className="text-white/30" />
          </motion.button>
        </div>

        {/* Create buttons */}
        <div className="px-3 pb-4 space-y-1">
          <motion.button
            onClick={() => navigate("/app")}
            whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/65 hover:text-white/90 transition-colors"
          >
            <Plus size={14} className="text-violet-400" />
            Create something new
          </motion.button>
          <motion.button
            whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            <Upload size={14} />
            Import code or design
          </motion.button>
        </div>

        <div className="h-px bg-white/[0.05] mx-3 mb-2" />

        {/* Nav top */}
        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {NAV_TOP.map((item) => (
            <motion.button
              key={item.label}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                item.active ? "text-white/90 bg-white/[0.06]" : "text-white/40 hover:text-white/75"
              }`}
            >
              <item.icon size={14} className={item.active ? "text-violet-400" : ""} />
              {item.label}
            </motion.button>
          ))}
        </nav>

        {/* Spacer + bottom nav */}
        <div className="px-3 py-3 space-y-0.5 border-t border-white/[0.04]">
          {NAV_BOTTOM.map((item) => (
            <motion.button
              key={item.label}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-white/35 hover:text-white/65 transition-colors"
            >
              <item.icon size={14} />
              {item.label}
            </motion.button>
          ))}

          {/* Plan */}
          <div className="mt-3 px-3 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <p className="text-[11px] font-semibold text-white/50 mb-2">Your Starter Plan</p>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[10px] text-white/35 mb-1">
                  <span>Agent credits</span><span>50% used</span>
                </div>
                <div className="h-1 rounded-full bg-white/[0.07]">
                  <div className="h-full w-1/2 rounded-full" style={{ background: "linear-gradient(90deg, #6d28d9, #a855f7)" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-white/35 mb-1">
                  <span>Cloud credits</span><span>0% used</span>
                </div>
                <div className="h-1 rounded-full bg-white/[0.07]" />
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(109,40,217,0.35)" }}
              whileTap={{ scale: 0.97 }}
              className="mt-3 w-full py-2 rounded-lg text-[11px] font-semibold text-white transition-all"
              style={{ background: "linear-gradient(135deg, #6d28d9, #7c3aed)" }}
            >
              + Upgrade to NJIRLAH Core
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex-1 flex flex-col items-center justify-start px-8 pt-20 pb-16 min-h-full">

          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-white/90 mb-1">
              Hi there, what do you want to make?
            </h1>
          </motion.div>

          {/* Workspace badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="mb-5"
          >
            <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white/65 hover:bg-white/[0.06] transition-colors">
              <div className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: "linear-gradient(135deg, #6d28d9, #a855f7)" }}>N</div>
              NJIRLAH's Workspace
              <ChevronRight size={12} className="text-white/30" />
            </button>
          </motion.div>

          {/* Input box */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="w-full max-w-2xl mb-5"
          >
            <div className="relative rounded-2xl border border-white/[0.1] overflow-hidden"
              style={{ background: "#1a1a1a", boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 24px 48px rgba(0,0,0,0.4)" }}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
                placeholder="Describe your idea, NJIRLAH will bring it to life..."
                rows={1}
                className="w-full px-5 pt-4 pb-2 text-sm text-white/85 placeholder-white/25 bg-transparent resize-none focus:outline-none leading-relaxed"
                style={{ maxHeight: "160px", fontFamily: "inherit" }}
              />
              <div className="flex items-center justify-between px-4 py-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 rounded-lg text-white/25 hover:text-white/55 transition-colors"
                >
                  <Plus size={14} />
                </motion.button>

                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 text-xs text-white/35 hover:text-white/60 transition-colors px-2 py-1 rounded-lg hover:bg-white/[0.05]">
                    <Zap size={11} className="text-violet-400" />
                    Agent
                    <ChevronRight size={10} />
                  </button>
                  <motion.button
                    onClick={() => handleSubmit()}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 16px rgba(109,40,217,0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!input.trim()}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
                    style={{ background: input.trim() ? "linear-gradient(135deg, #6d28d9, #7c3aed)" : "rgba(255,255,255,0.07)" }}
                  >
                    <ArrowUp size={14} className="text-white" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mode carousel */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18 }}
            className="flex items-center gap-2 mb-6"
          >
            <motion.button
              onClick={() => setModesOffset((v) => Math.max(0, v - 1))}
              disabled={!canLeft}
              whileTap={{ scale: 0.9 }}
              className="p-1.5 rounded-full border border-white/[0.08] text-white/35 hover:text-white/65 disabled:opacity-20 transition-all hover:border-white/[0.15] hover:bg-white/[0.05]"
            >
              <ChevronLeft size={13} />
            </motion.button>

            <div className="flex items-center gap-2 overflow-hidden">
              <AnimatePresence mode="popLayout">
                {MODES.slice(modesOffset, modesOffset + VISIBLE).map((m) => (
                  <motion.button
                    key={m.label}
                    onClick={() => handleModeClick(m)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.12)" }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-2 px-4 py-3.5 rounded-2xl border border-white/[0.07] bg-white/[0.03] text-white/55 hover:text-white/85 transition-all min-w-[80px]"
                  >
                    <m.icon size={20} className={m.label === "Chat AI" ? "text-violet-400" : "text-white/50"} />
                    <span className="text-[11px] font-medium whitespace-nowrap">{m.label}</span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>

            <motion.button
              onClick={() => setModesOffset((v) => Math.min(MODES.length - VISIBLE, v + 1))}
              disabled={!canRight}
              whileTap={{ scale: 0.9 }}
              className="p-1.5 rounded-full border border-white/[0.08] text-white/35 hover:text-white/65 disabled:opacity-20 transition-all hover:border-white/[0.15] hover:bg-white/[0.05]"
            >
              <ChevronRight size={13} />
            </motion.button>
          </motion.div>

          {/* Example prompts */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="flex items-center gap-2 flex-wrap justify-center mb-16"
          >
            <span className="text-xs text-white/25 flex items-center gap-1.5">
              <Sparkles size={11} /> Try an example prompt:
            </span>
            {EXAMPLE_PROMPTS.map((p) => (
              <motion.button
                key={p}
                onClick={() => handleSubmit(p)}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.12)" }}
                whileTap={{ scale: 0.97 }}
                className="px-3 py-1.5 rounded-full border border-white/[0.07] text-xs text-white/45 hover:text-white/75 transition-all"
              >
                {p}
              </motion.button>
            ))}
          </motion.div>

          {/* Recent Projects */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.45 }}
            className="w-full max-w-4xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-white/65">Your recent Projects</h2>
              <button className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors">
                View All <ArrowRight size={12} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {RECENT_PROJECTS.map((proj) => (
                <motion.button
                  key={proj.name}
                  onClick={() => navigate("/app")}
                  whileHover={{ y: -2, borderColor: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  className="text-left p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all group"
                >
                  {/* Preview area */}
                  <div className="h-28 rounded-xl mb-4 overflow-hidden flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${proj.color}22, ${proj.color}08)`, border: `1px solid ${proj.color}20` }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                      style={{ background: `${proj.color}30`, color: proj.color }}>
                      {proj.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-white/75 mb-1 group-hover:text-white/95 transition-colors">{proj.name}</p>
                  <p className="text-xs text-white/30">{proj.desc}</p>
                </motion.button>
              ))}

              {/* New project card */}
              <motion.button
                onClick={() => navigate("/app")}
                whileHover={{ y: -2, borderColor: "rgba(109,40,217,0.3)", backgroundColor: "rgba(109,40,217,0.04)" }}
                whileTap={{ scale: 0.98 }}
                className="text-left p-5 rounded-2xl border border-dashed border-white/[0.08] transition-all group flex flex-col items-center justify-center h-[168px] gap-3"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-dashed border-white/[0.12] group-hover:border-violet-500/40 transition-colors">
                  <Plus size={18} className="text-white/25 group-hover:text-violet-400 transition-colors" />
                </div>
                <p className="text-sm text-white/30 group-hover:text-white/55 transition-colors">Create new project</p>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
