import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function ContactCta() {
  return (
    <section className="relative py-28 md:py-40 bg-sumi overflow-hidden border-t border-sumi">
      <span className="bg-kanji absolute left-[-2rem] bottom-[-6rem] text-[32rem] leading-none font-heading text-white opacity-[0.03] select-none hidden lg:block">
        創
      </span>
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-12 text-center">
        <Reveal>
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="h-px w-10 bg-white/30" />
            <span className="font-heading text-xs tracking-widest-2 text-white/60">
              CONTACT
            </span>
            <span className="h-px w-10 bg-white/30" />
          </div>
          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
            まずは、
            <br className="md:hidden" />
            お話ししましょう。
          </h2>
          <p className="mt-8 text-sm md:text-base text-white/60 leading-relaxed max-w-xl mx-auto">
            小さな修正から新規制作まで、お気軽にご相談ください。
            現役エンジニアが誠実に対応いたします。
          </p>
          <div className="mt-12 flex flex-wrap gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-sumi px-8 py-4 text-sm tracking-widest-2 font-body hover:bg-ai hover:text-white transition-all duration-300"
            >
              お問い合わせする
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 border border-white/40 text-white px-8 py-4 text-sm tracking-widest-2 font-body hover:bg-white/10 transition-all duration-300"
            >
              よくある質問
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}