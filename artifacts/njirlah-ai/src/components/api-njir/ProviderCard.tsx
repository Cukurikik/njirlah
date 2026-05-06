import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, CheckCircle2, XCircle, Loader2, Zap, ExternalLink } from "lucide-react";
import type { KeyStatus } from "@/store/all-api-keys-store";

interface ProviderCardProps {
  name: string;
  description?: string;
  icon?: React.ReactNode;
  accentColor?: string;
  docUrl?: string;
  fields: ProviderField[];
  status?: KeyStatus;
  onTest?: () => Promise<boolean>;
  modelBadges?: string[];
  compact?: boolean;
}

export interface ProviderField {
  key: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onSave: (v: string) => Promise<void>;
  type?: "password" | "text";
}

function StatusDot({ status }: { status?: KeyStatus }) {
  if (!status || status === "untested") {
    return <span className="w-2 h-2 rounded-full bg-white/15 flex-shrink-0" />;
  }
  if (status === "testing") {
    return (
      <motion.span
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0"
      />
    );
  }
  if (status === "valid") {
    return <CheckCircle2 size={14} className="text-green-400 flex-shrink-0" />;
  }
  return <XCircle size={14} className="text-red-400 flex-shrink-0" />;
}

function FieldInput({ field, accent }: { field: ProviderField; accent: string }) {
  const [show, setShow] = useState(false);
  const [localVal, setLocalVal] = useState(field.value);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const isPassword = field.type !== "text";

  const handleChange = (v: string) => {
    setLocalVal(v);
    field.onChange(v);
    setSaved(false);
  };

  const handleSave = async () => {
    if (!localVal.trim()) return;
    setSaving(true);
    await field.onSave(localVal.trim());
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-mono text-white/40 tracking-wider uppercase">{field.label}</label>
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Lock size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
          <input
            type={isPassword && !show ? "password" : "text"}
            value={localVal}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            placeholder={field.placeholder}
            className="w-full pl-8 pr-10 py-2.5 rounded-lg border border-white/[0.07] bg-white/[0.03] text-white/80 text-xs font-mono placeholder-white/20 focus:outline-none focus:border-violet-500/35 focus:bg-white/[0.04] transition-all"
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
            >
              {show ? <EyeOff size={11} /> : <Eye size={11} />}
            </button>
          )}
        </div>
        <motion.button
          onClick={handleSave}
          disabled={saving || !localVal.trim()}
          whileTap={{ scale: 0.94 }}
          className={`flex-shrink-0 px-3 py-2.5 rounded-lg text-[11px] font-mono font-semibold transition-all ${
            saved
              ? "bg-green-500/15 text-green-400 border border-green-500/25"
              : `bg-${accent}-500/10 text-${accent}-300 border border-${accent}-500/20 hover:bg-${accent}-500/15 disabled:opacity-30`
          }`}
          style={
            saved
              ? {}
              : { backgroundColor: "rgba(139,92,246,0.1)", borderColor: "rgba(139,92,246,0.2)", color: "rgb(196,181,253)" }
          }
        >
          {saving ? <Loader2 size={11} className="animate-spin" /> : saved ? "Saved!" : "Save"}
        </motion.button>
      </div>
    </div>
  );
}

export function ProviderCard({
  name,
  description,
  icon,
  accentColor = "violet",
  docUrl,
  fields,
  status,
  onTest,
  modelBadges = [],
  compact = false,
}: ProviderCardProps) {
  const [testing, setTesting] = useState(false);
  const [localStatus, setLocalStatus] = useState<KeyStatus | undefined>(status);

  const handleTest = async () => {
    if (!onTest || testing) return;
    setTesting(true);
    setLocalStatus("testing");
    const ok = await onTest();
    setLocalStatus(ok ? "valid" : "invalid");
    setTesting(false);
  };

  const effectiveStatus = status === "testing" ? "testing" : localStatus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.05]">
        {icon && (
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/[0.04] border border-white/[0.07] flex-shrink-0">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white/85">{name}</span>
            <StatusDot status={effectiveStatus} />
          </div>
          {description && !compact && (
            <p className="text-[11px] text-white/30 font-mono mt-0.5 truncate">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {docUrl && (
            <a
              href={docUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/20 hover:text-white/50 transition-colors"
              title="Documentation"
            >
              <ExternalLink size={11} />
            </a>
          )}
          {onTest && (
            <motion.button
              onClick={handleTest}
              disabled={testing}
              whileTap={{ scale: 0.93 }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono border border-white/[0.07] text-white/35 hover:text-white/65 hover:border-white/[0.12] transition-all disabled:opacity-40"
            >
              {testing ? (
                <Loader2 size={10} className="animate-spin" />
              ) : (
                <Zap size={10} />
              )}
              {testing ? "Testing…" : "Test"}
            </motion.button>
          )}
        </div>
      </div>

      {/* Fields */}
      <div className={`px-4 ${compact ? "py-3" : "py-4"} space-y-4`}>
        {fields.map((f) => (
          <FieldInput key={f.key} field={f} accent={accentColor} />
        ))}

        {/* Status message */}
        <AnimatePresence>
          {effectiveStatus && effectiveStatus !== "untested" && effectiveStatus !== "testing" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-mono ${
                effectiveStatus === "valid"
                  ? "bg-green-500/[0.07] text-green-400 border border-green-500/[0.15]"
                  : "bg-red-500/[0.07] text-red-400 border border-red-500/[0.15]"
              }`}
            >
              {effectiveStatus === "valid" ? (
                <><CheckCircle2 size={11} /> Connection verified successfully</>
              ) : (
                <><XCircle size={11} /> Connection failed — check your key</>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Model badges */}
        {modelBadges.length > 0 && !compact && (
          <div className="pt-1">
            <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest mb-2">Available Models</p>
            <div className="flex flex-wrap gap-1.5">
              {modelBadges.slice(0, 12).map((m) => (
                <span
                  key={m}
                  className="px-2 py-0.5 rounded text-[10px] font-mono text-white/35 border border-white/[0.07] bg-white/[0.02]"
                >
                  {m}
                </span>
              ))}
              {modelBadges.length > 12 && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono text-white/20 border border-white/[0.04]">
                  +{modelBadges.length - 12} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
