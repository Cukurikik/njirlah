import { useEffect, useRef } from "react";

export function Background() {
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

    // Slow-moving orbs — Emergent-style subtle ambient glow
    const orbs = [
      { x: w * 0.15, y: h * 0.2, r: 280, vx: 0.12, vy: 0.08, hue: 262 },
      { x: w * 0.85, y: h * 0.7, r: 320, vx: -0.10, vy: 0.06, hue: 280 },
      { x: w * 0.5, y: h * 0.9, r: 200, vx: 0.07, vy: -0.09, hue: 240 },
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
        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        grad.addColorStop(0, `hsla(${orb.hue}, 80%, 65%, ${alpha})`);
        grad.addColorStop(1, `hsla(${orb.hue}, 80%, 65%, 0)`);
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

  return (
    <>
      <div className="fixed inset-0 z-0 bg-black" />
      <div className="fixed inset-0 z-0 dot-grid opacity-40" />
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
    </>
  );
}
