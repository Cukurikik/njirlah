import { motion } from "framer-motion";
import { BasicSection } from "@/components/animations/BasicSection";
import { LoadersSection } from "@/components/animations/LoadersSection";
import { TextSection } from "@/components/animations/TextSection";
import { InteractiveSection } from "@/components/animations/InteractiveSection";
import { ScrollSection } from "@/components/animations/ScrollSection";
import { CursorSection } from "@/components/animations/CursorSection";
import { IOSSection } from "@/components/animations/IOSSection";
import { AdvancedSection } from "@/components/animations/AdvancedSection";

const categories = [
  { id: "basic", label: "Basic" },
  { id: "loaders", label: "Loaders" },
  { id: "text", label: "Text & Path" },
  { id: "interactive", label: "Interactive" },
  { id: "scroll", label: "Scroll" },
  { id: "cursor", label: "Cursor" },
  { id: "ios", label: "iOS" },
  { id: "advanced", label: "Advanced" },
];

export default function AnimationsPage() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" style={{ background: "#05050A", color: "#e4e4e7" }}>
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: "rgba(5,5,10,0.92)",
          borderColor: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ opacity: 0.7 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { window.history.pushState({}, "", "/"); window.location.reload(); }}
              className="text-sm flex items-center gap-2 cursor-pointer"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              ← Back to Chat
            </motion.button>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
            <h1 className="font-bold text-sm tracking-wide" style={{ color: "#9E9EFF" }}>
              Animation Showcase
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ color: "#9E9EFF" }}
                onClick={() => scrollTo(cat.id)}
                className="px-3 py-1 text-xs rounded-full cursor-pointer transition-colors"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                {cat.label}
              </motion.button>
            ))}
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl font-bold mb-4"
          style={{
            background: "linear-gradient(135deg, #9E9EFF 0%, #8DF0CC 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Animation Showcase
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="text-base max-w-xl mx-auto"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          50+ live interactive animation demos — Spring physics, gestures, scroll effects, iOS patterns, cursor trails, 3D transforms and more.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24 }}
          className="flex flex-wrap justify-center gap-2 mt-6"
        >
          {["Framer Motion", "GSAP Patterns", "react-spring Physics", "anime.js Style", "CSS Spring"].map((lib) => (
            <span
              key={lib}
              className="px-3 py-1 rounded-full text-xs border"
              style={{ borderColor: "rgba(158,158,255,0.3)", color: "#9E9EFF", background: "rgba(158,158,255,0.06)" }}
            >
              {lib}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-32 space-y-20">
        <BasicSection />
        <LoadersSection />
        <TextSection />
        <InteractiveSection />
        <ScrollSection />
        <CursorSection />
        <IOSSection />
        <AdvancedSection />
      </div>
    </div>
  );
}
