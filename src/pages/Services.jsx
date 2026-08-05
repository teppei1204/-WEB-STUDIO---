import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { useSEO } from "@/components/SEO";

const SERVICES = [
  {
    num: "01",
    title: "ホームページ新規制作",
    target: "これからWebサイトを持ちたい方、リニューアルを検討している方",
    desc: "目的のヒアリングから設計、デザイン、コーディング、公開まで一貫して対応します。レスポンシブ対応・SEOを意識した構造で、長く使える土台をつくります。",
    includes: ["目的に合わせた設計", "レスポンシブ対応", "SEOを意識した構造", "公開までのサポート"],
  },
  {
    num: "02",
    title: "ホームページ修正",
    target: "今のサイトを少し直したい方、表示が崩れている方",
    desc: "デザインの微調整、レイアウトの修正、表示崩れの解消など、部分的な修正にも柔軟に対応します。小さなご相談でも歓迎します。",
    includes: ["デザイン調整", "レイアウト修正", "表示崩れの解消", "テキスト差し替え"],
  },
  {
    num: "03",
    title: "既存サイト改善",
    target: "もっと使いやすくしたい方、集客を強化したい方",
    desc: "ユーザー体験の改善、表示速度の向上、導線の最適化など、既存サイトをより良くするための改善をご提案・実装します。",
    includes: ["UI/UX改善", "表示速度の向上", "導線の最適化", "効果測定の提案"],
  },
  {
    num: "04",
    title: "WordPress制作・修正",
    target: "WordPressで運用したい方、修正・カスタマイズしたい方",
    desc: "WordPressを用いたサイト制作、テーマ・プラグインのカスタマイズ、不具合修正に対応します。運用しやすい構成をご提案します。",
    includes: ["WordPressサイト制作", "テーマカスタマイズ", "プラグイン設定", "不具合修正"],
  },
  {
    num: "05",
    title: "レスポンシブ対応",
    target: "スマートフォン表示を整えたい方",
    desc: "スマートフォンやタブレットでの見え方を最適化します。モバイルユーザーにも快適に閲覧できるサイトにします。",
    includes: ["モバイル最適化", "タブレット対応", "タッチ操作の最適化", "表示速度改善"],
  },
  {
    num: "06",
    title: "SEO対策",
    target: "検索で見つかりやすくしたい方",
    desc: "検索エンジンが評価しやすい構造と、ユーザーに届くコンテンツ設計を両立します。技術的なSEOとコンテンツSEOの両面からご提案します。",
    includes: ["技術的SEO改善", "コンテンツ構成", "メタタグ最適化", "内部リンク整理"],
  },
  {
    num: "07",
    title: "Webサイト保守・改善",
    target: "継続的にサイトを育てたい方",
    desc: "公開後の運用サポート、定期更新、継続的な改善を承ります。長く付き合えるパートナーとして伴走します。",
    includes: ["定期更新", "継続的改善", "運用サポート", "効果測定"],
  },
  {
    num: "08",
    title: "動画編集",
    target: "YouTube用・SNS用の動画を編集したい方、プロモーション動画を作りたい方",
    desc: "Webサイトに合わせた動画コンテンツの編集を承ります。カット編集、テロップ・字幕入れ、BGMやナレーションの合成など、用途に合わせた仕上げをいたします。Web制作とあわせてのご依頼も歓迎です。",
    includes: ["カット編集", "テロップ・字幕入れ", "BGM・ナレーション合成", "SNS用サイズ出力"],
  },
  {
    num: "09",
    title: "バナー制作",
    target: "WebサイトやSNS、広告用のバナーが必要な方",
    desc: "Web広告やSNS、サイト内告知用のバナーを制作します。目的とターゲットに合わせたデザインで、クリックされたくなる、伝わるバナーをつくります。複数サイズの一括制作にも対応します。",
    includes: ["Web広告バナー", "SNS用バナー", "告知用バナー", "複数サイズ対応"],
  },
];

export default function Services() {
  useSEO({
    title: "SERVICES | WEB STUDIO KABUKI",
    description:
      "ホームページ制作・修正・WordPress・SEO対策・レスポンシブ対応・保守改善など、現役エンジニアが提供するWeb制作サービス一覧。",
  });

  return (
    <>
      <section className="pt-28 md:pt-36 pb-16 md:pb-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <SectionHeader
            index="03"
            label="SERVICES"
            title="提供できるサービス"
            subtitle="現役エンジニアとしての技術力を活かし、新規制作から小さな修正、継続的な改善まで幅広く対応します。料金はまずはお気軽にご相談ください。"
          />
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="space-y-px bg-sumi/10">
            {SERVICES.map((s, i) => (
              <Reveal key={s.num} delay={(i % 2) * 0.05}>
                <div className="group bg-kinari p-8 md:p-12 transition-colors duration-500 hover:bg-card">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-1">
                      <span className="font-heading text-2xl text-ai font-light">
                        {s.num}
                      </span>
                    </div>
                    <div className="lg:col-span-4">
                      <h3 className="font-heading text-xl md:text-2xl text-sumi mb-3">
                        {s.title}
                      </h3>
                      <p className="text-xs text-sumi/50 leading-relaxed">
                        {s.target}
                      </p>
                    </div>
                    <div className="lg:col-span-4">
                      <p className="text-sm text-sumi/70 leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                    <div className="lg:col-span-3">
                      <ul className="space-y-2">
                        {s.includes.map((it) => (
                          <li
                            key={it}
                            className="flex items-center gap-2 text-xs text-sumi/60"
                          >
                            <Check
                              className="w-3.5 h-3.5 text-ai shrink-0"
                              strokeWidth={1.5}
                            />
                            {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Price note + CTA */}
          <Reveal delay={0.1}>
            <div className="mt-16 border border-sumi/15 p-10 md:p-14 text-center bg-card">
              <p className="section-index mb-4">PRICE</p>
              <p className="font-heading text-xl md:text-2xl text-sumi mb-4">
                料金については、まずはご相談ください
              </p>
              <p className="text-sm text-sumi/60 leading-relaxed max-w-xl mx-auto mb-8">
                内容や規模に応じて柔軟に対応いたします。
                まずはお気軽にご相談いただけましたら、
                お見積もりをご案内いたします。
              </p>
              <Link to="/contact" className="btn-solid">
                ご相談する
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}