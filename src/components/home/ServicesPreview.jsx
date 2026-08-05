import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";

const SERVICES = [
  {
    num: "01",
    title: "Webサイト新規制作",
    desc: "目的に合わせた設計から、レスポンシブ対応・SEOを意識した構築まで一貫して対応します。",
  },
  {
    num: "02",
    title: "Webサイト修正・改善",
    desc: "既存サイトのデザイン調整、表示速度の改善、UI/UXの向上など、部分的な修正にも柔軟に対応します。",
  },
  {
    num: "03",
    title: "WordPress制作・修正",
    desc: "WordPressを用いたサイト制作、カスタマイズ、不具合修正、運用しやすい構成をご提案します。",
  },
  {
    num: "04",
    title: "SEO・サイト改善",
    desc: "検索エンジンが評価しやすい構造と、ユーザーに届くコンテンツ設計を両立します。",
  },
  {
    num: "05",
    title: "動画編集",
    desc: "Webサイトに合わせた動画の編集。カット編集、テロップ・字幕入れ、BGMやナレーションの合成まで。",
  },
  {
    num: "06",
    title: "バナー制作",
    desc: "Web広告やSNS、告知用のバナーを制作。目的とターゲットに合わせた、伝わるデザインを。",
  },
];

export default function ServicesPreview() {
  return (
    <section className="py-24 md:py-32 border-t border-sumi/10 bg-stone/30">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <SectionHeader
          index="02"
          label="SERVICES"
          title="提供できること"
          subtitle="技術と誠実さを組み合わせた、実務的なWeb制作サービス。お困りのことに合わせてご相談ください。"
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-px bg-sumi/10">
          {SERVICES.map((s, i) => (
            <Reveal key={s.num} delay={i * 0.08}>
              <div className="group bg-kinari p-8 md:p-10 h-full transition-all duration-500 hover:bg-card hover:-translate-y-1 relative overflow-hidden">
                <span className="absolute top-0 left-0 h-0.5 w-0 group-hover:w-full bg-shu transition-all duration-500" />
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="font-heading text-2xl text-ai font-light group-hover:text-shu transition-colors duration-500">
                    {s.num}
                  </span>
                  <span className="h-px flex-1 bg-sumi/10 group-hover:bg-shu/40 transition-colors duration-500" />
                </div>
                <h3 className="font-heading text-xl md:text-2xl text-sumi mb-4 font-medium">
                  {s.title}
                </h3>
                <p className="text-sm text-sumi/60 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-12 text-center">
            <Link to="/services" className="btn-ghost-ai">
              サービス一覧を見る
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}