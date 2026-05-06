import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

function TrailDot({ stiffness, damping, size, opacity }: {
  stiffness: number; damping: number; size: number; opacity: number;
}) {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness, damping });
  const sy = useSpring(y, { stiffness, damping });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      x.set(e.clientX - size / 2);
      y.set(e.clientY - size / 2);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [x, y, size]);

  return (
    <motion.div
      style={{
        position: "fixed",
        left: sx,
        top: sy,
        width: size,
        height: size,
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 9997,
        opacity,
        background: "rgba(139,92,246,0.18)",
        border: "1px solid rgba(139,92,246,0.35)",
        mixBlendMode: "screen",
      }}
    />
  );
}

export function CursorTrail() {
  const dots = [
    { stiffness: 800, damping: 40, size: 10, opacity: 0.9 },
    { stiffness: 300, damping: 30, size: 18, opacity: 0.45 },
    { stiffness: 150, damping: 25, size: 30, opacity: 0.2 },
    { stiffness: 80,  damping: 22, size: 50, opacity: 0.08 },
  ];

  return (
    <>
      {dots.map((d, i) => (
        <TrailDot key={i} {...d} />
      ))}
    </>
  );
}
