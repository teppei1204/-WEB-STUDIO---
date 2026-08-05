import React, { useEffect } from "react";

/**
 * Lightweight SEO helper — sets document title and meta description per page.
 * Also injects JSON-LD structured data once.
 */
export function useSEO({ title, description }) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", description);
    }
  }, [title, description]);
}

/**
 * Injects a JSON-LD script for structured data. Cleans up on unmount.
 */
export function StructuredData({ data }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(data);
    script.setAttribute("data-seo", "true");
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [JSON.stringify(data)]);
  return null;
}