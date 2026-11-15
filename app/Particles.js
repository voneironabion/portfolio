"use client";

import { useEffect, useRef } from "react";

// Soft white dots drifting slowly behind the page. Subtle, and the glass bends them.
export default function Particles() {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let dots = [];
    let raf = 0;
    let last = 0;
    let t = 0;

    function make() {
      const n = Math.round(Math.min(90, Math.max(30, (W * H) / 22000)));
      dots = [];
      for (let i = 0; i < n; i++) {
        const big = Math.random() < 0.1; // a few large, very faint glows for depth
        dots.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: big ? 8 + Math.random() * 12 : 0.7 + Math.random() * 1.5,
          a: big ? 0.07 + Math.random() * 0.07 : 0.2 + Math.random() * 0.4,
          vx: (Math.random() - 0.5) * 4,
          vy: -(4 + Math.random() * 10),
          ph: Math.random() * Math.PI * 2,
          sp: 0.4 + Math.random() * 1.2,
          big,
        });
      }
    }

    function size() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const newW = window.innerWidth;
      const newH = window.innerHeight;
      cv.width = newW * dpr;
      cv.height = newH * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const widthChanged = newW !== W;
      W = newW;
      H = newH;
      if (widthChanged || !dots.length) make();
      draw();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (const d of dots) {
        const tw = 0.65 + 0.35 * Math.sin(t * d.sp + d.ph); // gentle twinkle
        ctx.globalAlpha = d.a * tw;
        if (d.big) {
          const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r);
          g.addColorStop(0, "rgba(255,255,255,1)");
          g.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = g;
        } else {
          ctx.fillStyle = "#fff";
        }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (!last) last = now;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;
      for (const d of dots) {
        d.x += (d.vx + Math.sin(t * 0.3 + d.ph) * 3) * dt;
        d.y += d.vy * dt;
        if (d.y < -d.r * 2) {
          d.y = H + d.r * 2;
          d.x = Math.random() * W;
        }
        if (d.x < -d.r * 2) d.x = W + d.r * 2;
        if (d.x > W + d.r * 2) d.x = -d.r * 2;
      }
      draw();
    }

    size();
    window.addEventListener("resize", size);
    if (!calm) raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
    };
  }, []);

  return <canvas ref={ref} className="particles" aria-hidden="true" />;
}
