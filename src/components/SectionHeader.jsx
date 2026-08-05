import React from "react";
import Reveal from "./Reveal";

/**
 * Reusable section header with index number, title, and optional subtitle.
 * English label uses serif accent; Japanese title below.
 */
export default function SectionHeader({
  index,
  label,
  title,
  subtitle,
  align = "left",
}) {
  const isCenter = align === "center";
  return (
    <Reveal>
      <div className={isCenter ? "text-center" : "text-left"}>
        <div
          className={`flex items-center gap-4 mb-5 ${
            isCenter ? "justify-center" : ""
          }`}
        >
          <span className="section-index">{index}</span>
          <span className="h-px w-8 bg-ai/40" />
          <span className="font-heading text-xs tracking-widest-2 text-sumi/60">
            {label}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-shu" />
        </div>
        {title && (
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-light text-sumi leading-tight">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="mt-5 text-sm md:text-base text-sumi/60 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </Reveal>
  );
}