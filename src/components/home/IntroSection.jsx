import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";

const KEYWORDS = ["ENGINEER", "WEB CREATOR", "FREELANCE"];

export default function IntroSection() {
  return (
    <section className="py-24 md:py-32 border-t border-sumi/10">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-4">
            <Reveal>
              <div className="flex items-center gap-4 mb-6">
                <span className="section-index">01</span>
                <span className="h-px w-8 bg-ai/40" />
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-light text-sumi leading-tight">
                現役エンジニアが
                <br />
                つくるWebサイト
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal delay={0.1}>
              <p className="text-base md:text-lg text-sumi/70 leading-loose mb-6">
                会社員として現役のエンジニアでありながら、
                フリーランスとしてWeb制作・改善の活動をしています。
                コードを書く日々の現場で培った技術力と、
                ユーザー目線のデザイン思考を組み合わせ、
                「本当に役に立つWebサイト」を制作します。
              </p>
              <p className="text-base md:text-lg text-sumi/70 leading-loose">
                派手な仕掛けよりも、丁寧な設計と誠実な対応を大切に。
                相談しやすい関係性を築きながら、
                ともに完成へ向かうことを心がけています。
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-10 flex flex-wrap gap-3">
                {KEYWORDS.map((k) => (
                  <span
                    key={k}
                    className="px-4 py-2 border border-sumi/20 text-xs tracking-widest-2 text-sumi/70"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <Link
                to="/about"
                className="mt-10 inline-flex items-center gap-2 text-sm text-ai hover:gap-3 transition-all duration-300"
              >
                蕪木鉄平について
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}