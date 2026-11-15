"use client";

import { useEffect, useRef } from "react";

// Very soft white smoke that slowly swirls behind the page (a small WebGL shader).
// If WebGL is not available it quietly does nothing and the plain glow stays.
const STRENGTH = 0.16; // how visible the smoke is (0.1 = barely there, 0.3 = obvious)
const SPEED = 0.03; // how fast it drifts

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uTime;
uniform float uStrength;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);
  float t = uTime;

  // two layers of warping make the noise curl like smoke
  vec2 q = vec2(fbm(p * 1.4 + vec2(0.0, t)), fbm(p * 1.4 + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p * 1.4 + 2.0 * q + vec2(1.7, 9.2) + t * 1.5),
                fbm(p * 1.4 + 2.0 * q + vec2(8.3, 2.8) - t * 1.2));
  float f = fbm(p * 1.2 + 2.5 * r);
  float wisp = smoothstep(0.35, 0.95, f);

  // smoke gathers in soft pockets (top left and bottom right), a little everywhere else
  float zone = 0.55 * exp(-pow(length(uv - vec2(0.15, 0.85)) * 1.6, 2.0))
             + 0.45 * exp(-pow(length(uv - vec2(0.9, 0.15)) * 1.5, 2.0))
             + 0.25;

  float a = wisp * zone * uStrength;
  gl_FragColor = vec4(vec3(a), a); // premultiplied white
}
`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn("Smoke shader:", gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}

export default function Smoke() {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const gl = cv.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uStrength = gl.getUniformLocation(prog, "uStrength");
    gl.uniform1f(uStrength, STRENGTH);
    gl.clearColor(0, 0, 0, 0);

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let t = 40; // start part way in so it does not begin empty
    let last = 0;

    function size() {
      // smoke is soft, so a small canvas is enough and keeps it light on the GPU
      const scale = 0.35;
      const w = Math.max(160, Math.min(640, Math.round(window.innerWidth * scale)));
      const h = Math.max(100, Math.round(window.innerHeight * scale));
      cv.width = w;
      cv.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
      draw();
    }

    function draw() {
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, t * SPEED);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (now - last < 33) return; // about 30 frames a second is plenty
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      t += dt;
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

  return <canvas ref={ref} className="smoke" aria-hidden="true" />;
}
