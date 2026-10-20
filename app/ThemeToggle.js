"use client";

export default function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const dark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
  }
  return (
    <button id="theme" onClick={toggle} aria-label="Toggle light and dark theme">
      ◐
    </button>
  );
}