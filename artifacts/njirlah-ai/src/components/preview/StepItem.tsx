import { motion } from "framer-motion";

export type StepStatus = "done" | "running" | "waiting" | "failed";

export interface Step {
  id: string;
  name: string;
  description: string;
  files: string[];
  duration?: string;
  status: StepStatus;
}

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <motion.path
      d="M5 13l4 4L19 7"
      stroke="#22c55e"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    />
  </svg>
);

const SpinnerIcon = () => (
  <motion.svg
    viewBox="0 0 24 24"
    fill="none"
    className="w-5 h-5"
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
  >
    <circle cx="12" cy="12" r="9" stroke="#3B82F6" strokeWidth={2.5} strokeDasharray="20 40" strokeLinecap="round" />
  </motion.svg>
);

const WaitingIcon = () => (
  <motion.div
    className="w-5 h-5 flex items-center justify-center text-gray-400"
    animate={{ opacity: [1, 0.4, 1] }}
    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
  >
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={2} />
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  </motion.div>
);

const FailedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <circle cx="12" cy="12" r="9" stroke="#ef4444" strokeWidth={2} />
    <path d="M15 9l-6 6M9 9l6 6" stroke="#ef4444" strokeWidth={2} strokeLinecap="round" />
  </svg>
);

const statusIcon: Record<StepStatus, React.ReactNode> = {
  done: <CheckIcon />,
  running: <SpinnerIcon />,
  waiting: <WaitingIcon />,
  failed: <FailedIcon />,
};

const statusBg: Record<StepStatus, string> = {
  done: "border-green-500/20 bg-green-500/5",
  running: "border-blue-500/30 bg-blue-500/5",
  waiting: "border-white/10 bg-white/5",
  failed: "border-red-500/20 bg-red-500/5",
};

interface StepItemProps {
  step: Step;
  index: number;
}

export function StepItem({ step, index }: StepItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.35, ease: "easeOut" }}
      className={`rounded-xl border p-4 mb-2 ${statusBg[step.status]}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0">{statusIcon[step.status]}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-white font-semibold text-sm truncate">{step.name}</span>
            {step.duration && (
              <span className="text-gray-500 text-xs flex-shrink-0 font-mono">{step.duration}</span>
            )}
          </div>
          <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{step.description}</p>
          {step.files.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {step.files.map((f) => (
                <motion.span
                  key={f}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.15 }}
                  className="inline-flex items-center gap-1 text-blue-400 text-xs cursor-pointer hover:underline"
                >
                  <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 flex-shrink-0">
                    <path d="M4 2h6l3 3v9a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth={1.2} />
                    <path d="M10 2v4h3" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
                  </svg>
                  {f}
                </motion.span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
