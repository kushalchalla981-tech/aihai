"use client";

import { useEffect, useRef } from "react";

export default function AmbientBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = 0, h = 0;
    const particles: {
      x: number; y: number; vx: number; vy: number; r: number; a: number;
    }[] = [];
    function resize() {
      w = canvas!.width = window.innerWidth;
      h = canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    const count = Math.min(60, Math.floor((w * h) / 20000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5, a: Math.random() * 0.3 + 0.05,
      });
    }
    function draw() {
      ctx!.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(79,140,255,${p.a})`;
        ctx!.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - p.x;
          const dy = particles[j].y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx!.beginPath();
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = `rgba(79,140,255,${0.06 * (1 - dist / 120)})`;
            ctx!.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    const raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <div className="gradient-mesh" />
      <div className="ambient-bg">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
      </div>
      <canvas ref={canvasRef} id="particles-canvas" />
      <style jsx>{`
        .gradient-mesh {
          position: fixed; inset: 0; z-index: 0;
          pointer-events: none; opacity: 0.35;
          animation: meshMorph 20s ease-in-out infinite alternate;
          background:
            radial-gradient(ellipse 80% 60% at 20% 30%, rgba(79,140,255,0.25) 0%, transparent 70%),
            radial-gradient(ellipse 60% 80% at 80% 70%, rgba(34,197,94,0.15) 0%, transparent 70%),
            radial-gradient(ellipse 70% 50% at 40% 80%, rgba(245,158,11,0.10) 0%, transparent 60%);
        }
        @keyframes meshMorph {
          0% { opacity: 0.6; }
          100% { opacity: 1; }
        }
        .ambient-bg {
          position: fixed; inset: 0; z-index: 0;
          overflow: hidden; pointer-events: none;
        }
        .ambient-orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); opacity: 0.25;
          will-change: transform;
        }
        .ambient-orb-1 {
          width: 600px; height: 600px;
          background: #4f8cff; top: -15%; right: -10%;
          animation: orbFloat1 25s ease-in-out infinite;
        }
        .ambient-orb-2 {
          width: 400px; height: 400px;
          background: #22c55e; bottom: -10%; left: -8%;
          animation: orbFloat2 30s ease-in-out infinite reverse;
        }
        .ambient-orb-3 {
          width: 300px; height: 300px;
          background: #102033; top: 40%; left: 50%;
          animation: orbFloat3 20s ease-in-out infinite 5s;
          opacity: 0.12;
        }
        @keyframes orbFloat1 {
          0%,100% { transform: translate(0,0) scale(1); }
          25% { transform: translate(60px,-40px) scale(1.08); }
          50% { transform: translate(-30px,60px) scale(0.92); }
          75% { transform: translate(40px,20px) scale(1.04); }
        }
        @keyframes orbFloat2 {
          0%,100% { transform: translate(0,0) scale(1); }
          25% { transform: translate(-60px,40px) scale(1.08); }
          50% { transform: translate(50px,-60px) scale(0.92); }
          75% { transform: translate(-30px,-20px) scale(1.03); }
        }
        @keyframes orbFloat3 {
          0%,100% { transform: translate(0,0) scale(1) rotate(0deg); }
          33% { transform: translate(40px,30px) scale(0.95) rotate(3deg); }
          66% { transform: translate(-30px,-40px) scale(1.05) rotate(-2deg); }
        }
        #particles-canvas {
          position: fixed; inset: 0; z-index: 1; pointer-events: none;
        }
      `}</style>
    </>
  );
}
