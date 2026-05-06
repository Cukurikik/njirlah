import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Wifi, WifiOff, ChevronDown } from "lucide-react";

interface ProviderStatus {
  ok: boolean;
  latencyMs: number | null;
  label: string;
}

type StatusMap = Record<string, ProviderStatus>;

async function fetchStatus(): Promise<StatusMap> {
  const res = await fetch("/api/status");
  if (!res.ok) throw new Error("status fetch failed");
  return res.json();
}

function latencyColor(ms: number | null, ok: boolean) {
  if (!ok || ms === null) return "bg-red-400";
  if (ms < 400) return "bg-green-400";
  if (ms < 1200) return "bg-yellow-400";
  return "bg-red-400";
}

function latencyLabel(ms: number | null, ok: boolean) {
  if (!ok || ms === null) return "down";
  if (ms < 400) return `${ms}ms`;
  if (ms < 1200) return `${ms}ms`;
  return `${ms}ms`;
}

export function ApiStatusBadge() {
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError } = useQuery<StatusMap>({
    queryKey: ["api-status"],
    queryFn: fetchStatus,
    refetchInterval: 60_000,
    staleTime: 50_000,
    retry: 1,
  });

  const allOk = data && Object.values(data).every((s) => s.ok);
  const anyDown = data && Object.values(data).some((s) => !s.ok);

  const globalColor = isError || anyDown ? "bg-red-400" : allOk ? "bg-green-400" : "bg-yellow-400";

  return (
    <div className="relative font-bold">
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-1.5 px-2 py-1 rounded border border-white/[0.06] text-[10px] font-mono text-white/30 hover:text-white/55 transition-colors"
      >
        {isLoading ? (
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-white/20"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        ) : (
          <motion.div
            className={`w-1.5 h-1.5 rounded-full ${globalColor}`}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        <span className="hidden sm:inline">Status</span>
        <ChevronDown size={9} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </motion.button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="absolute top-full right-0 mt-1.5 w-56 rounded-lg border border-white/[0.08] shadow-2xl z-50 overflow-hidden p-3 space-y-2"
              style={{ background: "#05050A" }}
            >
              <p className="text-[9px] font-mono text-white/20 tracking-widest uppercase mb-2">Provider Status</p>

              {isLoading && (
                <div className="flex items-center gap-2 py-2">
                  <motion.div className="w-1.5 h-1.5 rounded-full bg-white/20" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }} />
                  <span className="text-[11px] text-white/30 font-mono">Checking…</span>
                </div>
              )}

              {isError && (
                <div className="flex items-center gap-2">
                  <WifiOff size={11} className="text-red-400/60" />
                  <span className="text-[11px] text-red-400/60 font-mono">Status unavailable</span>
                </div>
              )}

              {data && Object.entries(data).map(([key, s]) => (
                <div key={key} className="flex items-center gap-2.5">
                  <motion.div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${latencyColor(s.latencyMs, s.ok)}`}
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-[11px] text-white/55 font-mono flex-1">{s.label}</span>
                  <span className={`text-[10px] font-mono ${s.ok ? "text-white/25" : "text-red-400/70"}`}>
                    {latencyLabel(s.latencyMs, s.ok)}
                  </span>
                </div>
              ))}

              <div className="pt-1.5 border-t border-white/[0.05]">
                <p className="text-[9px] text-white/15 font-mono">
                  Data processed in-transit only. No training.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
