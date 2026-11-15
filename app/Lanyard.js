"use client";

import { useEffect, useRef } from "react";

// Interactive ID card on a rope. Drag it, fling it, it swings back.
export default function Lanyard({
  photo = null,
  name = "Von Eiron",
  role = "UI/UX Designer",
}) {
  const boxRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const box = boxRef.current;
    const card = cardRef.current;
    if (!box || !card) return;
    const paths = box.querySelectorAll("[data-strap]");

    const N = 8; // rope segments
    const G = 0.62; // gravity
    const DAMP = 0.985; // air drag on the rope
    const CARD_DAMP = 0.975; // the card settles a little faster
    const VMAX = 40; // speed cap so a wild fling can't blow up
    const ITER = 12; // constraint passes
    const STEP = 1000 / 60;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let seg = 0;
    let rod = 0;
    let cw = 0;
    let pts = [];
    let drag = null;
    let raf = 0;
    let last = 0;
    let acc = 0;
    let running = false;
    let bad = 0; // seconds the card has looked stuck

    function setup() {
      W = box.clientWidth;
      H = box.clientHeight;
      cw = card.offsetWidth;
      rod = card.offsetHeight;
      const ax = W > 720 ? W * 0.74 : W / 2;
      const rope = Math.max(150, Math.min(H * 0.5, 420));
      seg = rope / N;
      pts = [];
      for (let i = 0; i <= N; i++) {
        const y = -12 + i * seg;
        pts.push({ x: ax, y, px: ax, py: y, im: i === 0 ? 0 : 1 });
      }
      const top = pts[N];
      const sway = calm ? 0 : 60; // small swing when the page loads
      pts.push({
        x: top.x + sway,
        y: top.y + rod * 0.97,
        px: top.x + sway,
        py: top.y + rod * 0.97,
        im: 0.55,
      });
      draw();
    }

    function simulate() {
      for (let i = 1; i < pts.length; i++) {
        const p = pts[i];
        const dm = i >= N ? CARD_DAMP : DAMP;
        let vx = (p.x - p.px) * dm;
        let vy = (p.y - p.py) * dm;
        const v = Math.hypot(vx, vy);
        if (v > VMAX) {
          vx *= VMAX / v;
          vy *= VMAX / v;
        }
        p.px = p.x;
        p.py = p.y;
        p.x += vx;
        p.y += vy + G;
      }

      if (drag) {
        const T = pts[N];
        const B = pts[N + 1];
        const t = drag.t;
        const gx = T.x + (B.x - T.x) * t;
        const gy = T.y + (B.y - T.y) * t;
        const k = 0.45;
        const dx = (drag.x - gx) * k;
        const dy = (drag.y - gy) * k;
        const c = 1 / ((1 - t) * (1 - t) + t * t);
        T.x += dx * c * (1 - t);
        T.y += dy * c * (1 - t);
        B.x += dx * c * t;
        B.y += dy * c * t;
      }

      for (let it = 0; it < ITER; it++) {
        for (let i = 0; i < pts.length - 1; i++) {
          const a = pts[i];
          const b = pts[i + 1];
          const L = i === N ? rod : seg;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 0.0001;
          if (i < N && d <= L) continue; // slack rope, nothing to fix
          const diff = (d - L) / d;
          const w = a.im + b.im;
          a.x += dx * diff * (a.im / w);
          a.y += dy * diff * (a.im / w);
          b.x -= dx * diff * (b.im / w);
          b.y -= dy * diff * (b.im / w);
        }
      }

      // keep the card inside the layer
      for (let i = N; i <= N + 1; i++) {
        const p = pts[i];
        p.x = Math.min(W - 12, Math.max(12, p.x));
        p.y = Math.min(H - 12, Math.max(-40, p.y));
      }

      // safety net: if the card sits still in a strange pose, give it a nudge
      if (!drag) {
        const T = pts[N];
        const B = pts[N + 1];
        const ang = Math.abs((Math.atan2(B.x - T.x, B.y - T.y) * 180) / Math.PI);
        const hang = (T.y - pts[0].y) / (seg * N);
        const speed = Math.hypot(B.x - B.px, B.y - B.py);
        if (speed < 0.15 && (ang > 25 || hang < 0.75)) bad += 1 / 60;
        else bad = 0;
        if (bad > 0.8) {
          B.px -= (Math.random() - 0.5) * 8;
          B.py -= 3;
          bad = 0;
        }
      }
    }

    function draw() {
      if (!pts.length) return;
      const top = pts[N];
      const bot = pts[N + 1];
      const ang = -Math.atan2(bot.x - top.x, bot.y - top.y);
      card.style.transform =
        "translate3d(" + (top.x - cw / 2) + "px," + top.y + "px,0) rotate(" + ang + "rad)";

      let d = "M" + pts[0].x.toFixed(1) + "," + pts[0].y.toFixed(1);
      for (let i = 1; i < N; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        const my = (pts[i].y + pts[i + 1].y) / 2;
        d +=
          " Q" + pts[i].x.toFixed(1) + "," + pts[i].y.toFixed(1) +
          " " + mx.toFixed(1) + "," + my.toFixed(1);
      }
      d += " L" + top.x.toFixed(1) + "," + top.y.toFixed(1);
      paths.forEach((p) => p.setAttribute("d", d));
    }

    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (!last) last = now;
      acc += Math.min(now - last, 100);
      last = now;
      let n = 0;
      while (acc >= STEP && n < 4) {
        simulate();
        acc -= STEP;
        n++;
      }
      if (n === 4) acc = 0;
      draw();
    }

    function start() {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    function local(e) {
      const r = box.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    function down(e) {
      if (e.button !== undefined && e.button !== 0) return;
      const p = local(e);
      const T = pts[N];
      const B = pts[N + 1];
      const vx = B.x - T.x;
      const vy = B.y - T.y;
      let t = ((p.x - T.x) * vx + (p.y - T.y) * vy) / (rod * rod);
      t = Math.min(1, Math.max(0, t));
      drag = { x: p.x, y: p.y, t, id: e.pointerId };
      card.setPointerCapture(e.pointerId);
      card.classList.add("grabbing");
      e.preventDefault();
    }

    function release() {
      if (!drag) return;
      try {
        card.releasePointerCapture(drag.id);
      } catch (err) {}
      drag = null;
      card.classList.remove("grabbing");
    }

    function move(e) {
      if (!drag || e.pointerId !== drag.id) return;
      // the mouse button was let go somewhere we could not see (outside the preview, another window)
      if (e.pointerType === "mouse" && e.buttons === 0) {
        release();
        return;
      }
      const p = local(e);
      drag.x = p.x;
      drag.y = p.y;
    }

    function up(e) {
      if (!drag || e.pointerId !== drag.id) return;
      release();
    }

    const root = document.documentElement;
    card.addEventListener("pointerdown", down);
    card.addEventListener("pointermove", move);
    card.addEventListener("pointerup", up);
    card.addEventListener("pointercancel", up);
    card.addEventListener("lostpointercapture", release);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("blur", release);
    document.addEventListener("visibilitychange", release);
    root.addEventListener("mouseleave", release);

    setup();

    // only run the simulation while it is on screen
    const io = new IntersectionObserver(
      (entries) => (entries[0].isIntersecting ? start() : stop()),
      { threshold: 0 }
    );
    io.observe(box);

    // re-fit on resize or when the card changes size (fonts, images)
    const ro = new ResizeObserver(() => {
      const newW = box.clientWidth;
      cw = card.offsetWidth;
      rod = card.offsetHeight;
      if (Math.abs(newW - W) > 1) setup();
    });
    ro.observe(box);
    ro.observe(card);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      card.removeEventListener("pointerdown", down);
      card.removeEventListener("pointermove", move);
      card.removeEventListener("pointerup", up);
      card.removeEventListener("pointercancel", up);
      card.removeEventListener("lostpointercapture", release);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("blur", release);
      document.removeEventListener("visibilitychange", release);
      root.removeEventListener("mouseleave", release);
    };
  }, []);

  const label = (name + " · " + role + " · Portfolio · ").toUpperCase().repeat(6);

  return (
    <div className="lanyard" ref={boxRef}>
      <svg className="strap" aria-hidden="true">
        <defs>
          <path id="lanyard-path" data-strap fill="none" />
        </defs>
        <path data-strap className="strap-edge" />
        <path data-strap className="strap-fill" />
        <text className="strap-text" dy=".35em">
          <textPath href="#lanyard-path">{label}</textPath>
        </text>
      </svg>

      <div
        className="id-card"
        ref={cardRef}
        onDragStart={(e) => e.preventDefault()}
        aria-label="Interactive ID card. Drag to move it."
      >
        <span className="id-clip" aria-hidden="true"></span>
        <div className="id-body">
          <div className="id-photo">
            {photo ? (
              <img src={photo} alt={name} draggable={false} />
            ) : (
              <span>Your photo</span>
            )}
          </div>
          <div className="id-meta">
            <strong>{name}</strong>
            <span>{role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
