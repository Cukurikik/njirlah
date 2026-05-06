import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Loader2, Globe, Key, Link, Cpu, CheckCircle2, Trash2 } from "lucide-react";
import { useAllApiKeysStore, type CustomProvider } from "@/store/all-api-keys-store";

const EXAMPLE_PROVIDERS = [
  { name: "SiliconFlow", baseUrl: "https://api.siliconflow.cn/v1", model: "Qwen/Qwen2.5-7B-Instruct" },
  { name: "Ollama Local", baseUrl: "http://localhost:11434/v1", model: "llama3" },
  { name: "RouterPark", baseUrl: "https://api.routerpark.com/v1", model: "gpt-4o-mini" },
];

interface CustomProviderFormProps {
  open: boolean;
  onClose: () => void;
}

export function CustomProviderForm({ open, onClose }: CustomProviderFormProps) {
  const [name, setName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [modelId, setModelId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { addCustomProvider } = useAllApiKeysStore();

  const reset = () => {
    setName(""); setBaseUrl(""); setApiKey(""); setModelId(""); setError("");
  };

  const handleClose = () => { reset(); onClose(); };

  const fillExample = (ex: typeof EXAMPLE_PROVIDERS[0]) => {
    setName(ex.name);
    setBaseUrl(ex.baseUrl);
    setModelId(ex.model);
  };

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Provider name is required"); return; }
    if (!baseUrl.trim()) { setError("Base URL is required"); return; }
    if (!modelId.trim()) { setError("Model ID is required"); return; }
    setSaving(true);
    setError("");
    try {
      await addCustomProvider({ name: name.trim(), baseUrl: baseUrl.trim(), apiKey: apiKey.trim(), modelId: modelId.trim() });
      handleClose();
    } catch {
      setError("Failed to save provider");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="fixed inset-x-4 top-[10%] md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[520px] z-50 rounded-2xl border border-white/[0.08] overflow-hidden"
            style={{ background: "#090910" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <div>
                <h3 className="text-sm font-semibold text-white/85">Add Custom Provider</h3>
                <p className="text-[11px] text-white/30 font-mono mt-0.5">OpenAI-compatible endpoint</p>
              </div>
              <button
                onClick={handleClose}
                className="text-white/25 hover:text-white/55 transition-colors p-1.5 rounded-lg hover:bg-white/[0.04]"
              >
                <X size={14} />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Quick-fill examples */}
              <div>
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Quick examples</p>
                <div className="flex flex-wrap gap-1.5">
                  {EXAMPLE_PROVIDERS.map((ex) => (
                    <button
                      key={ex.name}
                      onClick={() => fillExample(ex)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-mono text-white/40 border border-white/[0.07] hover:text-white/65 hover:border-white/[0.12] hover:bg-white/[0.03] transition-all"
                    >
                      {ex.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form fields */}
              <FormField
                label="Provider Name"
                icon={<Globe size={11} />}
                placeholder="e.g. My Local Ollama"
                value={name}
                onChange={setName}
              />
              <FormField
                label="Base URL"
                icon={<Link size={11} />}
                placeholder="https://api.example.com/v1"
                value={baseUrl}
                onChange={setBaseUrl}
                type="text"
              />
              <FormField
                label="API Key"
                icon={<Key size={11} />}
                placeholder="sk-... (leave empty if not required)"
                value={apiKey}
                onChange={setApiKey}
                type="password"
              />
              <FormField
                label="Model ID"
                icon={<Cpu size={11} />}
                placeholder="e.g. meta/llama-3.1-8b-instruct"
                value={modelId}
                onChange={setModelId}
                type="text"
              />

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[11px] text-red-400 font-mono px-3 py-2 rounded-lg bg-red-500/[0.07] border border-red-500/[0.15]"
                >
                  {error}
                </motion.p>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-white/[0.06]">
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-lg text-xs font-mono text-white/35 hover:text-white/60 transition-colors border border-white/[0.06] hover:border-white/[0.12]"
              >
                Cancel
              </button>
              <motion.button
                onClick={handleSubmit}
                disabled={saving}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all border"
                style={{ background: "rgba(139,92,246,0.15)", borderColor: "rgba(139,92,246,0.3)", color: "rgb(196,181,253)" }}
              >
                {saving ? (
                  <Loader2 size={11} className="animate-spin" />
                ) : (
                  <Plus size={11} />
                )}
                {saving ? "Adding…" : "Add Provider"}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function FormField({
  label, icon, placeholder, value, onChange, type = "text",
}: {
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "password";
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-mono text-white/40 tracking-wider uppercase">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none">{icon}</span>
        <input
          type={type === "password" && !show ? "password" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-8 pr-8 py-2.5 rounded-lg border border-white/[0.07] bg-white/[0.03] text-white/80 text-xs font-mono placeholder-white/20 focus:outline-none focus:border-violet-500/35 focus:bg-white/[0.04] transition-all"
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
          >
            {show ? "🙈" : "👁"}
          </button>
        )}
      </div>
    </div>
  );
}

interface CustomProviderListProps {
  providers: CustomProvider[];
  onRemove: (id: string) => void;
  onTest: (id: string) => Promise<boolean>;
  statuses: Record<string, string>;
}

export function CustomProviderList({ providers, onRemove, onTest, statuses }: CustomProviderListProps) {
  if (providers.length === 0) return null;

  return (
    <div className="space-y-3">
      {providers.map((cp) => {
        const status = statuses[`custom_${cp.id}`] ?? cp.status ?? "untested";
        return (
          <motion.div
            key={cp.id}
            layout
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.07] bg-white/[0.02]"
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/[0.04] border border-white/[0.07] flex-shrink-0">
              <Globe size={12} className="text-violet-400/60" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white/80 truncate">{cp.name}</p>
              <p className="text-[10px] font-mono text-white/25 truncate">{cp.baseUrl} · {cp.modelId}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {status === "valid" && <CheckCircle2 size={13} className="text-green-400" />}
              {status === "invalid" && <X size={13} className="text-red-400" />}
              <button
                onClick={() => onTest(cp.id)}
                className="text-[10px] font-mono text-white/30 hover:text-white/55 border border-white/[0.06] hover:border-white/[0.12] px-2 py-1 rounded-lg transition-all"
              >
                Test
              </button>
              <button
                onClick={() => onRemove(cp.id)}
                className="text-white/20 hover:text-red-400 transition-colors p-1 rounded"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
