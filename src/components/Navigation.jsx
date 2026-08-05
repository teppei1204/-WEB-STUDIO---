import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";

const NAV_LINKS = [
  { label: "HOME", to: "/", num: "01" },
  { label: "ABOUT", to: "/about", num: "02" },
  { label: "SERVICES", to: "/services", num: "03" },
  { label: "WORKS", to: "/works", num: "04" },
  { label: "BLOG", to: "/blog", num: "05" },
  { label: "CONTACT", to: "/contact", num: "06" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-kinari/90 backdrop-blur-sm border-b border-sumi/10"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Brand */}
            <Link
              to="/"
              className="group flex flex-col leading-none"
              aria-label="WEB STUDIO KABUKI ホーム"
            >
              <span className="font-heading text-[0.7rem] md:text-xs tracking-widest-2 text-sumi">
                WEB STUDIO
              </span>
              <span className="font-heading text-base md:text-lg tracking-widest-2 text-sumi font-medium">
                KABUKI
              </span>
            </Link>

            {/* Desktop quick nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`relative text-xs tracking-widest-2 font-body transition-colors duration-300 ${
                    isActive(l.to)
                      ? "text-ai"
                      : "text-sumi/70 hover:text-sumi"
                  }`}
                >
                  {l.label}
                  {isActive(l.to) && (
                    <span className="absolute -bottom-2 left-0 right-0 h-px bg-ai" />
                  )}
                </Link>
              ))}
            </nav>

            <ThemeSwitcher />

            {/* Menu button */}
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden flex items-center gap-2 text-sumi"
              aria-label="メニューを開く"
            >
              <Menu className="w-5 h-5" strokeWidth={1.25} />
              <span className="text-[0.65rem] tracking-widest-2">MENU</span>
            </button>
          </div>
        </div>
        <div
          className={`h-px k-line transition-opacity duration-500 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        />
      </header>

      {/* Slide-out Shutter panel */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-500 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        {/* backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        {/* panel */}
        <div
          className={`absolute top-0 right-0 h-full w-full sm:w-[480px] bg-kinari transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-full">
            {/* vertical ai divider */}
            <div className="w-px bg-ai/40 mx-0" />
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between h-16 md:h-20 px-8 border-b border-sumi/10">
                <span className="font-heading text-xs tracking-widest-2 text-sumi/60">
                  MENU
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 text-sumi"
                  aria-label="メニューを閉じる"
                >
                  <span className="text-[0.65rem] tracking-widest-2">CLOSE</span>
                  <X className="w-5 h-5" strokeWidth={1.25} />
                </button>
              </div>

              <nav className="flex-1 flex flex-col justify-center px-8 gap-1">
                {NAV_LINKS.map((l, i) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className={`group flex items-baseline gap-4 py-3 border-b border-sumi/10 transition-all duration-300 ${
                      isActive(l.to) ? "text-ai" : "text-sumi hover:text-ai"
                    }`}
                    style={{
                      transitionDelay: open ? `${i * 40 + 100}ms` : "0ms",
                    }}
                  >
                    <span className="font-heading text-xs text-sumi/40 tabular-nums">
                      {l.num}
                    </span>
                    <span className="font-heading text-2xl md:text-3xl font-light">
                      {l.label}
                    </span>
                  </Link>
                ))}
              </nav>

              <div className="px-8 py-8 border-t border-sumi/10">
                <p className="font-heading text-xs tracking-widest-2 text-sumi/50 mb-2">
                  蕪木鉄平
                </p>
                <p className="text-xs text-sumi/50 leading-relaxed">
                  Engineer / Web Creator
                  <br />
                  技術を磨き、仕事を磨く。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}