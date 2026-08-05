import React from "react";

/**
 * 印 — a minimal geometric signature mark for KABUKI.
 * Represents the "seal" of quality, placed in the footer.
 */
export default function SealMark({ className = "" }) {
  return (
    <span
      className={`inline-flex items-center justify-center transition-transform duration-700 hover:rotate-[12deg] ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <rect
          x="2.5"
          y="2.5"
          width="43"
          height="43"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M14 16h20M24 16v18M18 34l6-8 6 8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </svg>
    </span>
  );
}