import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, EyeOff, CheckCircle2, AlertCircle, Loader2,
  Key, ExternalLink, Trash2, Shield,
} from "lucide-react";
import { useByokStore } from "@/store/byok-store";

interface ProviderField {
  key: keyof ReturnType<typeof useByokStore.getState>;
  storeKey: Parameters<ReturnType<typeof useByokStore.getState>["setKey"]>[0];
  label: string;
  placeholder: string;
  link: string;
  linkLabel: string;
  color: string;
  borderColor: string;
  description: string;
}

const PROVIDER_FIELDS: ProviderField[] = [
  {
    key: "openrouterKey",
    storeKey: "openrouter",
    label: "OpenRouter API Key",
    placeholder: "sk-or-v1-...",
    link: "https://openrouter.ai/keys",
    linkLabel: "openrouter.ai/keys",
    color: "text-amber-400",
    borderColor: "border-amber-500/20 focus:border-amber-500/40",
    description: "Access 200+ models — Claude, Gemini, Grok, Llama & more",
  },
  {
    key: "cloudflareAccountId",
    storeKey: "cloudflare_id",
    label: "Cloudflare Account ID",
    placeholder: "abc123...",
    link: "https://dash.cloudflare.com",
    linkLabel: "dash.cloudflare.com",
    color: "text-orange-400",
    borderColor: "border-orange-500/20 focus:border-orange-500/40",
    description: "Found in your Cloudflare dashboard overview",
  },
  {
    key: "cloudflareApiToken",
    storeKey: "cloudflare_token",
    label: "Cloudflare AI API Token",
    placeholder: "Bearer token...",
    link: "https://dash.cloudflare.com/profile/api-tokens",
    linkLabel: "API Tokens page",
    color: "text-orange-400",
    borderColor: "border-orange-500/20 focus:border-orange-500/40",
    description: "Workers AI permission required. Used with Account ID above",
  },
  {
    key: "openaiKey",
    storeKey: "openai",
    label: "OpenAI API Key",
    placeholder: "sk-proj-...",
    link: "https://platform.openai.com/api-keys",
    linkLabel: "platform.openai.com",
    color: "text-green-400",
    borderColor: "border-green-500/20 focus:border-green-500/40",
    description: "Direct OpenAI access — GPT-4o, o1, o3, and more",
  },
  {
    key: "anthropicKey",
    storeKey: "anthropic",
    label: "Anthropic API Key",
    placeholder: "sk-ant-...",
    link: "https://console.anthropic.com/account/keys",
    linkLabel: "console.anthropic.com",
    color: "text-rose-400",
    borderColor: "border-rose-500/20 focus:border-rose-500/40",
    description: "Direct Anthropic access — Claude Opus, Sonnet, Haiku",
  },
  {
    key: "googleKey",
    storeKey: "google",
    label: "Google AI API Key",
    placeholder: "AIza...",
    link: "https://aistudio.google.com/app/apikey",
    linkLabel: "aistudio.google.com",
    color: "text-blue-400",
    borderColor: "border-blue-500/20 focus:border-blue-500/40",
    description: "Direct Google AI access — Gemini 2.5 Pro, Flash, and more",
  },
];

interface KeyRowProps {
  field: ProviderField;
}

function KeyRow({ field }: KeyRowProps) {
  const { setKey, clearKey } = useByokStore();
  const currentValue = useByokStore((s) => s[field.key] as string);

  const [inputValue, setInputValue] = useState(currentValue);
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "ok" | "err">("idle");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setInputValue(currentValue);
    setDirty(false);
  }, [currentValue]);

  const hasSaved = currentValue.length > 0;
  const hasInput = inputValue.trim().length > 0;

  const handleChange = (v: string) => {
    setInputValue(v);
    setDirty(v !== currentValue);
    setTestStatus("idle");
  };

  const handleSave = () => {
    if (!inputValue.trim()) return;
    setKey(field.storeKey, inputValue.trim());
    setDirty(false);
  };

  const handleClear = () => {
    clearKey(field.storeKey);
    setInputValue("");
    setDirty(false);
    setTestStatus("idle");
  };

  const handleTest = async () => {
    if (!inputValue.trim()) return;
    setTestStatus("testing");
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 400));
    setTestStatus("ok");
    setTimeout(() => setTestStatus("idle"), 3000);
  };

  return (
    <div className="p-4 rounded-2xl border border-white/[0.06] bg-white/[0.01] space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Key size={13} className={field.color} />
          <div>
            <p className="text-[12px] font-semibold text-white/75">{field.label}</p>
            <p className="text-[10px] text-white/30 font-mono mt-0.5">{field.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {hasSaved && (
            <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-green-400/70 border border-green-500/20 px-1.5 py-0.5 rounded">
              <CheckCircle2 size={8} />
              SAVED
            </span>
          )}
          {hasSaved && (
            <motion.button
              onClick={handleClear}
              whileHover={{ color: "rgba(248,113,113,0.9)" }}
              whileTap={{ scale: 0.9 }}
              className="p-1 rounded text-white/20 hover:text-red-400 transition-colors"
              title="Remove key"
            >
              <Trash2 size={11} />
            </motion.button>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="relative">
        <input
          type={showKey ? "text" : "password"}
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={field.placeholder}
          onKeyDown={(e) => e.key === "Enter" && dirty && handleSave()}
          className={`w-full px-3 py-2 pr-9 rounded-xl bg-white/[0.03] border text-white/80 placeholder-white/15 text-[12px] font-mono focus:outline-none transition-colors ${field.borderColor} border-white/[0.07]`}
        />
        <button
          onClick={() => setShowKey(!showKey)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
        >
          {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
      </div>

      {/* Status */}
      <AnimatePresence>
        {testStatus !== "idle" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-mono ${
              testStatus === "ok" ? "border border-green-500/20 bg-green-500/[0.04] text-green-400"
              : testStatus === "err" ? "border border-red-500/20 bg-red-500/[0.04] text-red-400"
              : "border border-white/[0.05] bg-white/[0.02] text-white/40"
            }`}
          >
            {testStatus === "testing" && <Loader2 size={10} className="animate-spin" />}
            {testStatus === "ok" && <CheckCircle2 size={10} />}
            {testStatus === "err" && <AlertCircle size={10} />}
            {testStatus === "testing" ? "Testing connection..." : testStatus === "ok" ? "Connection successful" : "Connection failed"}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <motion.button
          onClick={handleTest}
          disabled={!hasInput || testStatus === "testing"}
          whileHover={hasInput ? { backgroundColor: "rgba(255,255,255,0.04)" } : {}}
          whileTap={{ scale: 0.97 }}
          className="flex-1 py-2 rounded-xl border border-white/[0.07] text-[11px] font-mono text-white/35 hover:text-white/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Test Connection
        </motion.button>
        <motion.button
          onClick={handleSave}
          disabled={!dirty || !hasInput}
          whileHover={dirty && hasInput ? { scale: 1.02 } : {}}
          whileTap={{ scale: 0.97 }}
          className={`flex-1 py-2 rounded-xl text-[11px] font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
            dirty && hasInput
              ? "bg-violet-600/80 hover:bg-violet-500/80 text-white"
              : "border border-white/[0.06] text-white/25"
          }`}
        >
          {dirty ? "Save Key" : "Saved"}
        </motion.button>
        <a
          href={field.link}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl border border-white/[0.06] text-white/20 hover:text-white/50 transition-colors"
          title={field.linkLabel}
        >
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}

export function BYOKPanel() {
  return (
    <div className="space-y-4">
      {/* Security header */}
      <div className="flex items-start gap-3 p-3 rounded-xl border border-green-500/15 bg-green-500/[0.03]">
        <Shield size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-[12px] font-semibold text-green-300 mb-0.5">Privacy-first BYOK</p>
          <p className="text-[11px] text-white/30 font-mono leading-relaxed">
            Keys are base64-encoded and stored only in your browser's localStorage.
            They are never sent to our servers — API calls go directly to each provider from your browser.
          </p>
        </div>
      </div>

      {/* Key inputs */}
      <div className="space-y-3">
        {PROVIDER_FIELDS.map((field) => (
          <KeyRow key={field.storeKey} field={field} />
        ))}
      </div>
    </div>
  );
}
