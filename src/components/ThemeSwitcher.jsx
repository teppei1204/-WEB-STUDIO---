import React, { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "@/lib/ThemeContext";

const THEMES = {
  craft: {
    id: "craft",
    label: "JAPANESE CRAFT",
    short: "CRAFT",
    desc: "Engineering × Japanese",
  },
  lab: {
    id: "lab",
    label: "DIGITAL LAB",
    short: "LAB",
    desc: "Technology × Experiment",
  },
};

function Swatch({ id }) {
  if (id === "craft") {
    return (
      <span
        className="w-7 h-7 shrink-0 relative"
        style={{ background: "#F5F1E8", border: "1px solid rgba(26,26,26,0.25)" }}
      >
        <span
          className="absolute bottom-1 left-1 right-1 h-px"
          style={{ background: "#1F3A5F" }}
        />
        <span
          className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
          style={{ background: "#E8523C" }}
        />
      </span>
    );
  }
  return (
    <span
      className="w-7 h-7 shrink-0 relative overflow-hidden"
      style={{ background: "#0B0F14", border: "1px solid rgba(34,211,238,0.4)" }}
    >
      <span
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.25) 1px, transparent 1px)",
          backgroundSize: "7px 7px",
        }}
      />
    </span>
  );
}

function TransitionOverlay() {
  return (
    <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-black animate-theme-curtain" />
      <div className="absolute top-1/2 left-0 w-full h-px bg-ai animate-theme-sweep" />
    </div>
  );
}

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const reduce = useReducedMotion();
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const switchTo = (next) => {
    setOpen(false);
    if (next === theme) return;
    if (reduce) {
      setTheme(next);
      return;
    }
    setPlaying(true);
    window.setTimeout(() => setTheme(next), 230);
    window.setTimeout(() => setPlaying(false), 720);
  };

  const current = THEMES[theme] || THEMES.craft;

  return (
    <>
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={`テーマ切り替え — 現在: ${current.label}`}
          aria-expanded={open}
          aria-haspopup="true"
          className="group flex items-center gap-2 px-3 py-1.5 border border-sumi/20 hover:border-ai transition-colors duration-300"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-ai transition-transform duration-300 group-hover:scale-125" />
          <span className="hidden sm:flex flex-col items-start leading-none gap-0.5">
            <span className="font-mono text-[0.5rem] tracking-widest-2 text-sumi/50">
              MODE
            </span>
            <span className="font-heading text-[0.6rem] tracking-widest-2 text-sumi">
              {current.short} MODE
            </span>
          </span>
          <span className="sm:hidden font-heading text-[0.6rem] tracking-widest-2 text-sumi">
            {current.short}
          </span>
        </button>

        {open && (
          <div
            role="menu"
            className="absolute right-0 top-full mt-3 w-72 bg-card border border-border shadow-2xl z-50 animate-pop-in"
          >
            <div className="px-4 py-3 border-b border-border">
              <span className="font-mono text-[0.6rem] tracking-widest-2 text-ai">
                SELECT THEME
              </span>
            </div>
            <div className="p-2">
              {Object.values(THEMES).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={theme === t.id}
                  onClick={() => switchTo(t.id)}
                  className={`w-full flex items-center gap-3 p-3 text-left transition-colors duration-300 ${
                    theme === t.id ? "bg-secondary" : "hover:bg-secondary"
                  }`}
                >
                  <Swatch id={t.id} />
                  <div className="flex-1">
                    <p className="font-heading text-sm text-foreground">
                      {t.label}
                    </p>
                    <p className="text-[0.65rem] text-muted-foreground">
                      {t.desc}
                    </p>
                  </div>
                  {theme === t.id && (
                    <span
                      className="w-2 h-2 rounded-full bg-ai"
                      aria-hidden="true"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {playing && <TransitionOverlay />}
    </>
  );
}