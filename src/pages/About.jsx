import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { useSEO, StructuredData } from "@/components/SEO";

const PROFILE_IMG =
  "https://media.base44.com/images/public/6a707359147785c39fbc81e6/a7156c8ff_generated_76ff3d13.png";

const SKILLS = [
  { name: "HTML / CSS", desc: "レスポンシブ対応を含む、構造的で保守しやすいWebサイトの構築。" },
  { name: "JavaScript", desc: "Webサイトのインタラクション実装、UI/UXの改善、動的表示の制御。" },
  { name: "WordPress", desc: "WordPressサイトの制作・修正・改善。運用しやすい構成のご提案。" },
  { name: "SEO", desc: "検索エンジンを意識したサイト構造とコンテンツ設計の改善。" },
  { name: "Java", desc: "バックエンド開発・システム設計。堅牢なアプリケーション構築。" },
  { name: "C++", desc: "パフォーマンスを要するプログラムの開発と最適化。" },
  { name: "SQL", desc: "データベース設計・データ操作。効率的なクエリの構築。" },
];

const PHILOSOPHY = [
  { title: "誠実に", text: "見栄えだけではなく、本来の目的に沿って誠実に向き合います。" },
  { title: "丁寧に", text: "細部まで妥協しない設計と実装を心がけます。" },
  { title: "長く", text: "一時的でなく、長く使える・育てられるものをつくります。" },
];

export default function About() {
  useSEO({
    title: "ABOUT | WEB STUDIO KABUKI — 蕪木鉄平",
    description:
      "蕪木鉄平について。現役エンジニアとしての活動、フリーランスとしての想い、仕事への姿勢。技術を磨き、仕事を磨く。",
  });

  const ld = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "蕪木鉄平",
    alternateName: "TEPPEI KABUKI",
    jobTitle: "Engineer / Web Creator",
    knowsAbout: ["Web development", "WordPress", "SEO", "JavaScript", "Java"],
  };

  return (
    <>
      <StructuredData data={ld} />
      <section className="pt-28 md:pt-36 pb-20 md:pb-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <SectionHeader
            index="02"
            label="ABOUT"
            title="蕪木鉄平について"
          />
        </div>
      </section>

      {/* Profile + intro */}
      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <Reveal>
                <div className="relative">
                  <div className="absolute -top-3 -left-3 w-full h-full border border-ai/30" />
                  <div className="relative aspect-[4/5] overflow-hidden bg-stone">
                    <Image
                      src={PROFILE_IMG}
                      alt="蕪木鉄平のプロフィール写真"
                      className="w-full h-full object-cover"
                      fittingType="fill"
                    />
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <span className="font-heading text-2xl text-sumi">蕪木鉄平</span>
                  <span className="h-px flex-1 bg-sumi/15" />
                </div>
                <p className="text-xs tracking-widest-2 text-sumi/50 mt-2">
                  TEPPEI KABUKI / Engineer / Web Creator
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal delay={0.1}>
                <p className="font-heading text-2xl md:text-3xl font-light text-sumi leading-relaxed mb-8">
                  技術を磨き、
                  <br />
                  仕事を磨く。
                </p>
                <div className="space-y-6 text-sm md:text-base text-sumi/70 leading-loose">
                  <p>
                    会社員として現役のエンジニアとして働きながら、
                    フリーランスとしてWeb制作・Webサイトの改善活動をしています。
                    日々コードと向き合う現場で培った技術力を、
                    クライアントの課題を解決する力として提供しています。
                  </p>
                  <p>
                    Web制作を始めたきっかけは、
                    「技術で誰かの役に立ちたい」という思いでした。
                    使いやすく、美しく、目的が達成できるWebサイトは、
                    その先にいる人を幸せにすると信じています。
                  </p>
                  <p>
                    派手な仕掛けよりも、丁寧な設計と誠実な対応を大切にしています。
                    「技術力は高そうだけど、相談しやすい」—
                    そんな関係性を築ける存在でありたいと思っています。
                  </p>
                </div>

                <div className="mt-10 flex flex-wrap gap-3">
                  {["ENGINEER", "WEB CREATOR", "FREELANCE"].map((k) => (
                    <span
                      key={k}
                      className="px-4 py-2 border border-sumi/20 text-xs tracking-widest-2 text-sumi/70"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 md:py-32 border-t border-sumi/10 bg-stone/30">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <SectionHeader
            index="—"
            label="PHILOSOPHY"
            title="大切にしていること"
          />
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-sumi/10">
            {PHILOSOPHY.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1}>
                <div className="bg-kinari p-10 h-full">
                  <span className="font-heading text-4xl text-ai/30 font-light">
                    0{i + 1}
                  </span>
                  <h3 className="font-heading text-xl text-sumi mt-6 mb-4">
                    {p.title}
                  </h3>
                  <p className="text-sm text-sumi/60 leading-relaxed">
                    {p.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-24 md:py-32 border-t border-sumi/10">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <SectionHeader index="—"
            label="SKILLS"
            title="技術・スキル"
            subtitle="単なる技術名の羅列ではなく、それぞれ「何ができるか」が伝わるように整理しています。"
          />
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
            {SKILLS.map((s, i) => (
              <Reveal key={s.name} delay={(i % 2) * 0.08}>
                <div className="group flex items-start gap-6 py-6 border-b border-sumi/10">
                  <span className="font-heading text-sm text-ai tabular-nums pt-1 w-8">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-heading text-lg text-sumi mb-2">
                      {s.name}
                    </h3>
                    <p className="text-sm text-sumi/60 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-sumi/10 text-center">
        <Reveal>
          <p className="font-heading text-xl md:text-2xl text-sumi mb-8">
            少しでも興味を持っていただけましたか？
          </p>
          <Link to="/contact" className="btn-solid">
            お問い合わせする
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </Reveal>
      </section>
    </>
  );
}