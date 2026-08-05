import React from "react";
import { Link } from "react-router-dom";
import SealMark from "./SealMark";

const FOOTER_LINKS = [
  { label: "HOME", to: "/" },
  { label: "ABOUT", to: "/about" },
  { label: "SERVICES", to: "/services" },
  { label: "WORKS", to: "/works" },
  { label: "BLOG", to: "/blog" },
  { label: "CONTACT", to: "/contact" },
];

export default function Footer() {
  return (
    <footer className="relative bg-kinari border-t border-sumi/15">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand + seal */}
          <div className="md:col-span-5">
            <Link to="/" className="inline-flex flex-col leading-none">
              <span className="font-heading text-xs tracking-widest-2 text-sumi">
                WEB STUDIO
              </span>
              <span className="font-heading text-xl tracking-widest-2 text-sumi font-medium">
                KABUKI
              </span>
            </Link>
            <p className="mt-6 text-sm text-sumi/60 leading-relaxed max-w-xs">
              現役エンジニアによるWeb制作スタジオ。
              <br />
              技術を磨き、仕事を磨く。
            </p>
            <div className="mt-8 flex items-center gap-4">
              <SealMark className="w-9 h-9 text-ai" />
              <span className="text-[0.65rem] tracking-widest-2 text-sumi/40">
                TEPPEI KABUKI
              </span>
            </div>
          </div>

          {/* Nav */}
          <div className="md:col-span-3">
            <p className="section-index mb-5">NAVIGATION</p>
            <ul className="space-y-3">
              {FOOTER_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-sumi/70 hover:text-ai transition-colors duration-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <p className="section-index mb-5">CONTACT</p>
            <p className="text-sm text-sumi/70 leading-relaxed mb-5">
              Web制作・修正・WordPress・SEOなど、
              お気軽にご相談ください。
            </p>
            <Link to="/contact" className="btn-ghost-ai">
              お問い合わせ
            </Link>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-sumi/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-sumi/40 tracking-wider">
            © {new Date().getFullYear()} WEB STUDIO KABUKI. All rights reserved.
          </p>
          <p className="text-xs text-sumi/40 tracking-wider">
            Engineer / Web Creator — 蕪木鉄平
          </p>
        </div>
      </div>
    </footer>
  );
}