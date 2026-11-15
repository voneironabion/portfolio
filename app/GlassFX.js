"use client";

import { useEffect } from "react";

// which nav link lights up for each section
const SPY = {
  top: "top",
  about: "about",
  portfolio: "portfolio",
  contact: "contact",
};

export default function GlassFX() {
  useEffect(() => {
    if (/Chrome\/|Edg\//.test(navigator.userAgent)) {
      document.documentElement.classList.add("refract");
    }

    const nav = document.querySelector("header nav");
    const ind = nav ? nav.querySelector(".nav-ind") : null;
    const links = nav ? Array.from(nav.querySelectorAll("a")) : [];
    let ready = false;

    function spy() {
      let cur = "top";
      const line = window.innerHeight * 0.4;
      for (const id of Object.keys(SPY)) {
        const s = document.getElementById(id);
        if (s && s.getBoundingClientRect().top <= line) cur = SPY[id];
      }
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        cur = "contact";
      }

      let active = null;
      links.forEach((a) => {
        const on = a.getAttribute("href") === "#" + cur;
        a.dataset.active = String(on);
        if (on) active = a;
      });

      // slide the glass pill under the current tab
      if (ind && active) {
        ind.style.setProperty("--x", active.offsetLeft + "px");
        ind.style.setProperty("--w", active.offsetWidth + "px");
        ind.dataset.on = "true";
        if (!ready) {
          ready = true;
          requestAnimationFrame(() => {
            ind.dataset.ready = "true";
          });
        }
        // on small screens the nav can scroll sideways, keep the tab in view
        if (nav.scrollWidth > nav.clientWidth + 1) {
          nav.scrollTo({
            left: active.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2,
            behavior: "smooth",
          });
        }
      }
    }

    window.addEventListener("scroll", spy, { passive: true });
    window.addEventListener("resize", spy);
    window.addEventListener("load", spy);
    spy();

    // layout can shift when fonts and images finish loading
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(spy);
    const ro = new ResizeObserver(spy);
    ro.observe(document.body);

    return () => {
      window.removeEventListener("scroll", spy);
      window.removeEventListener("resize", spy);
      window.removeEventListener("load", spy);
      ro.disconnect();
    };
  }, []);

  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute" }}
      aria-hidden="true"
      focusable="false"
    >
      <filter
        id="lg-refract"
        x="0%"
        y="0%"
        width="100%"
        height="100%"
        colorInterpolationFilters="sRGB"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.012 0.02"
          numOctaves="2"
          seed="3"
          result="noise"
        />
        <feGaussianBlur in="noise" stdDeviation="2" result="map" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="map"
          scale="22"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}
