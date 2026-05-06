import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Copy, Check, Zap, Globe, Smartphone, Server, Database, Layout, Shield, BookOpen, X } from "lucide-react";
import { useChatStore } from "@/store/chat-store";

interface Template {
  id: string;
  title: string;
  desc: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  prompt: string;
  tags: string[];
}

const TEMPLATES: Template[] = [
  {
    id: "landing",
    title: "Landing Page",
    desc: "Hero, features, pricing sections with Tailwind CSS",
    category: "Website",
    icon: <Layout size={16} />,
    color: "text-cyan-400",
    prompt: "Build a complete landing page with: animated hero section with gradient headline, features grid (3 columns), pricing table with 3 tiers, FAQ accordion, and CTA section. Use Tailwind CSS, dark mode, and make it fully responsive.",
    tags: ["React", "Tailwind", "Responsive"],
  },
  {
    id: "dashboard",
    title: "Admin Dashboard",
    desc: "Sidebar, charts, data tables, and KPI cards",
    category: "Website",
    icon: <Globe size={16} />,
    color: "text-blue-400",
    prompt: "Build a full admin dashboard with: collapsible sidebar navigation, KPI stat cards with trends, recharts line and bar charts, a sortable/filterable data table with pagination, and a dark theme. Use React + TypeScript + Tailwind CSS.",
    tags: ["React", "Charts", "Tables"],
  },
  {
    id: "auth",
    title: "Auth System",
    desc: "Login, signup, JWT tokens, protected routes",
    category: "Full Stack",
    icon: <Shield size={16} />,
    color: "text-green-400",
    prompt: "Build a complete auth system with: Express.js backend with JWT tokens, bcrypt password hashing, refresh tokens, protected API middleware, React frontend with login/signup forms, react-router protected routes, and persistent sessions via localStorage. TypeScript throughout.",
    tags: ["JWT", "Express", "React"],
  },
  {
    id: "crud-app",
    title: "Full CRUD App",
    desc: "Database, API, frontend with create/read/update/delete",
    category: "Full Stack",
    icon: <Database size={16} />,
    color: "text-violet-400",
    prompt: "Build a complete CRUD application with: PostgreSQL database with Drizzle ORM, Express.js REST API with validation, React frontend with TanStack Query for data fetching, modal forms for create/edit, confirmation dialogs for delete, and real-time optimistic updates.",
    tags: ["PostgreSQL", "REST API", "TanStack Query"],
  },
  {
    id: "onboarding",
    title: "Mobile Onboarding",
    desc: "React Native onboarding flow with animations",
    category: "Mobile",
    icon: <Smartphone size={16} />,
    color: "text-pink-400",
    prompt: "Build a React Native onboarding flow with: 4 illustrated screens with parallax animations, progress dots, swipe gestures, skip button, and a finish CTA that navigates to the main app. Use Expo, React Native Reanimated, and AsyncStorage to track completion.",
    tags: ["Expo", "Animations", "Gestures"],
  },
  {
    id: "bottom-nav",
    title: "Mobile Bottom Navigation",
    desc: "Expo Router tab navigation with custom icons",
    category: "Mobile",
    icon: <Smartphone size={16} />,
    color: "text-rose-400",
    prompt: "Build a React Native app with Expo Router and custom bottom tab navigation: 5 tabs (Home, Explore, Create, Messages, Profile), animated tab indicators, badge notifications, and custom icon components. Include placeholder screens for each tab with relevant UI.",
    tags: ["Expo Router", "Navigation", "Tabs"],
  },
  {
    id: "rest-api",
    title: "REST API Backend",
    desc: "Express.js API with authentication and database",
    category: "Full Stack",
    icon: <Server size={16} />,
    color: "text-orange-400",
    prompt: "Build a production-ready REST API with Express.js: user authentication (JWT + refresh tokens), role-based access control, rate limiting, request validation with Zod, error handling middleware, PostgreSQL with Drizzle ORM, and OpenAPI/Swagger documentation.",
    tags: ["Express", "JWT", "Zod", "PostgreSQL"],
  },
  {
    id: "fastapi",
    title: "FastAPI Backend",
    desc: "Python FastAPI with SQLAlchemy and authentication",
    category: "Full Stack",
    icon: <Server size={16} />,
    color: "text-emerald-400",
    prompt: "Build a FastAPI backend with: async SQLAlchemy + PostgreSQL, Alembic migrations, JWT authentication with OAuth2, Pydantic models for validation, background tasks with Celery, Redis caching, and auto-generated OpenAPI docs. Include a React frontend that consumes the API.",
    tags: ["Python", "FastAPI", "SQLAlchemy"],
  },
  {
    id: "nextjs-full",
    title: "Next.js Full Stack",
    desc: "Next.js App Router with Prisma and authentication",
    category: "Full Stack",
    icon: <Zap size={16} />,
    color: "text-amber-400",
    prompt: "Build a Next.js 14 full-stack app using App Router: Prisma ORM with PostgreSQL, NextAuth.js authentication (Google + GitHub + Credentials), server components for data fetching, server actions for mutations, Shadcn/ui components, and Tailwind CSS. Include user profile, settings, and a main feature page.",
    tags: ["Next.js 14", "Prisma", "NextAuth"],
  },
  {
    id: "chat-app",
    title: "Real-time Chat App",
    desc: "WebSocket chat with rooms, users, and messages",
    category: "Full Stack",
    icon: <Zap size={16} />,
    color: "text-indigo-400",
    prompt: "Build a real-time chat application: Node.js + Socket.io backend with rooms, typing indicators, and online users. React frontend with message bubbles, file attachments, emoji reactions, and read receipts. Store messages in PostgreSQL with message history loading.",
    tags: ["Socket.io", "Real-time", "PostgreSQL"],
  },
  {
    id: "ecommerce",
    title: "E-Commerce Store",
    desc: "Product listing, cart, checkout, and order management",
    category: "Website",
    icon: <Layout size={16} />,
    color: "text-lime-400",
    prompt: "Build a full e-commerce store: product catalog with filters/search, product detail page with image gallery, shopping cart with localStorage persistence, checkout form with address and payment fields, order confirmation page, and admin product management. React + TypeScript + Tailwind.",
    tags: ["E-Commerce", "Cart", "React"],
  },
  {
    id: "portfolio",
    title: "Developer Portfolio",
    desc: "Hero, projects grid, skills, contact form",
    category: "Website",
    icon: <BookOpen size={16} />,
    color: "text-fuchsia-400",
    prompt: "Build a stunning developer portfolio: animated hero with typing effect and 3D tilt cards, projects grid with live preview/GitHub links, animated skills section with progress bars, timeline-style experience section, and a contact form with email validation. Dark theme, Framer Motion animations, Tailwind CSS.",
    tags: ["Portfolio", "Animations", "Contact"],
  },
];

const CATEGORIES = ["All", "Website", "Full Stack", "Mobile"];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function TemplatesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { createChat, addMessage, setActiveChat } = useChatStore();

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return TEMPLATES.filter((t) => {
      const matchCat = category === "All" || t.category === category;
      const matchQ = !q || t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q) || t.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchCat && matchQ;
    });
  }, [search, category]);

  const handleUse = (template: Template) => {
    const chatId = createChat();
    addMessage(chatId, { role: "user", content: template.prompt });
    setActiveChat(chatId);
    window.history.pushState({}, "", "/app");
    window.location.reload();
  };

  const handleCopy = (template: Template) => {
    navigator.clipboard.writeText(template.prompt).catch(() => {});
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen w-full" style={{ background: "#050508", color: "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #7c4dff, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #ff4d9e, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(124,77,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(124,77,255,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-white/[0.06]" style={{ background: "rgba(5,5,8,0.9)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <motion.button
            onClick={() => { window.history.pushState({}, "", "/app"); window.location.reload(); }}
            whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/[0.07] text-white/40 hover:text-white/70 transition-colors text-[12px] font-mono"
          >
            <ArrowLeft size={12} />
            Back to Chat
          </motion.button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white">Prompt Templates</h1>
            <p className="text-[11px] text-white/30 font-mono">Pre-built prompts to kickstart your project</p>
          </div>
          <span className="text-[11px] font-mono text-white/20 border border-white/[0.06] px-2 py-1 rounded-full">
            {TEMPLATES.length} templates
          </span>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.02] text-white/80 placeholder-white/20 text-sm font-mono focus:outline-none focus:border-violet-500/30 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/55">
                <X size={12} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setCategory(cat)}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-mono transition-all ${
                  category === cat
                    ? "bg-violet-500/15 text-violet-300 border border-violet-500/30"
                    : "text-white/35 hover:text-white/60 border border-transparent hover:border-white/[0.07]"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={category + search}
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((template) => (
              <motion.div
                key={template.id}
                variants={fadeUp}
                layout
                className="group relative rounded-2xl border border-white/[0.07] bg-white/[0.015] overflow-hidden hover:border-white/[0.12] transition-all duration-300"
              >
                <div className="p-5">
                  {/* Icon + category */}
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] ${template.color}`}>
                      {template.icon}
                    </div>
                    <span className="text-[10px] font-mono text-white/25 border border-white/[0.06] px-2 py-1 rounded-full">
                      {template.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white/85 mb-1.5">{template.title}</h3>
                  <p className="text-[12px] text-white/40 leading-relaxed mb-3">{template.desc}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {template.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-mono text-white/25 border border-white/[0.06] px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Expanded prompt preview */}
                  <AnimatePresence>
                    {expandedId === template.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mb-3"
                      >
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[11px] font-mono text-white/35 leading-relaxed">
                          {template.prompt}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={() => handleUse(template)}
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(139,92,246,0.9)" }}
                      whileTap={{ scale: 0.96 }}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-violet-600/80 text-white text-[12px] font-semibold transition-all"
                    >
                      <Zap size={11} />
                      Use Template
                    </motion.button>
                    <motion.button
                      onClick={() => handleCopy(template)}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg border border-white/[0.07] text-white/35 hover:text-white/65 transition-all"
                      title="Copy prompt"
                    >
                      <AnimatePresence mode="wait">
                        {copiedId === template.id ? (
                          <motion.div key="check" initial={{ scale: 0.7 }} animate={{ scale: 1 }} exit={{ scale: 0.7 }}>
                            <Check size={13} className="text-green-400" />
                          </motion.div>
                        ) : (
                          <motion.div key="copy" initial={{ scale: 0.7 }} animate={{ scale: 1 }} exit={{ scale: 0.7 }}>
                            <Copy size={13} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                    <motion.button
                      onClick={() => setExpandedId(expandedId === template.id ? null : template.id)}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg border border-white/[0.07] text-white/35 hover:text-white/65 transition-all text-[10px] font-mono"
                      title="Preview prompt"
                    >
                      {expandedId === template.id ? "▲" : "▼"}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <p className="text-white/20 font-mono text-sm">No templates found for "{search}"</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
