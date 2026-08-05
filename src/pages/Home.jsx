import React from "react";
import { useSEO, StructuredData } from "@/components/SEO";
import Hero from "@/components/home/Hero";
import IntroSection from "@/components/home/IntroSection";
import ServicesPreview from "@/components/home/ServicesPreview";
import WorksPreview from "@/components/home/WorksPreview";
import BlogPreview from "@/components/home/BlogPreview";
import ContactCta from "@/components/home/ContactCta";

export default function Home() {
  useSEO({
    title: "WEB STUDIO KABUKI | 蕪木鉄平 — Engineer / Web Creator",
    description:
      "現役エンジニアによるWeb制作スタジオ。ホームページ制作・修正・WordPress・SEOを日本的美意識とエンジニアリングで。「技術を磨き、仕事を磨く。」",
  });

  const ld = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "WEB STUDIO KABUKI",
    description:
      "現役エンジニア蕪木鉄平によるWeb制作スタジオ。Webサイト制作・修正・WordPress・SEOを提供します。",
    founder: {
      "@type": "Person",
      name: "蕪木鉄平",
      alternateName: "TEPPEI KABUKI",
      jobTitle: "Engineer / Web Creator",
    },
    slogan: "技術を磨き、仕事を磨く。",
  };

  return (
    <>
      <StructuredData data={ld} />
      <Hero />
      <IntroSection />
      <ServicesPreview />
      <WorksPreview />
      <BlogPreview />
      <ContactCta />
    </>
  );
}