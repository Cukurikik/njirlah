import { useEffect, useRef } from "react";

const UNICORN_PROJECT_ID = import.meta.env.VITE_UNICORN_STUDIO_PROJECT_ID as string | undefined;

function UnicornStudioBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.unicorn.studio/v1.4.0/unicornStudio.umd.js";
    script.async = true;
    script.onload = () => {
      if (containerRef.current && (window as any).UnicornStudio) {
        (window as any).UnicornStudio.init();
      }
    };
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none"
      data-us-project={UNICORN_PROJECT_ID}
      style={{ width: "100%", height: "100%" }}
    />
  );
}

function CanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const orbs = [
      { x: w * 0.15, y: h * 0.2, r: 280, vx: 0.12, vy: 0.08, color: "#A855F7" },
      { x: w * 0.85, y: h * 0.7, r: 320, vx: -0.10, vy: 0.06, color: "#06B6D4" },
      { x: w * 0.5,  y: h * 0.9, r: 200, vx: 0.07,  vy: -0.09, color: "#EC4899" },
    ];

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      t++;

      for (const orb of orbs) {
        orb.x += orb.vx;
        orb.y += orb.vy;
        if (orb.x < -orb.r || orb.x > w + orb.r) orb.vx *= -1;
        if (orb.y < -orb.r || orb.y > h + orb.r) orb.vy *= -1;

        const alpha = 0.06 + Math.sin(t * 0.01) * 0.02;
        const hex = Math.round(alpha * 255).toString(16).padStart(2, "0");
        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        grad.addColorStop(0, orb.color + Math.round(alpha * 255 * 1.6).toString(16).padStart(2, "0"));
        grad.addColorStop(1, orb.color + "00");
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
}

export function Background() {
  return (
    <>
      <div className="fixed inset-0 z-0" style={{ background: "#05050A" }} />
      <div className="fixed inset-0 z-0 dot-grid opacity-40" />
      {UNICORN_PROJECT_ID ? <UnicornStudioBackground /> : <CanvasBackground />}
    </>
  );
}
