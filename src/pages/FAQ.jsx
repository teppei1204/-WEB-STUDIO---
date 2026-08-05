import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Minus, ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { useSEO } from "@/components/SEO";

const FAQS = [
  {
    q: "どんな仕事を依頼できますか？",
    a: "ホームページの新規制作、既存サイトの修正・改善、WordPressの制作・修正、SEO対策、レスポンシブ対応、保守・改善などに対応しています。詳細はサービスページをご覧ください。",
  },
  {
    q: "小規模な修正だけでも依頼できますか？",
    a: "はい、もちろん可能です。テキストの差し替えやレイアウトの微調整など、小さな修正も歓迎しています。まずはお気軽にご相談ください。",
  },
  {
    q: "WordPressに対応できますか？",
    a: "対応可能です。WordPressを用いたサイト制作、テーマ・プラグインのカスタマイズ、不具合修正など幅広く対応しています。運用しやすい構成のご提案も可能です。",
  },
  {
    q: "個人でも依頼できますか？",
    a: "個人の方でも企業の方でも歓迎しています。規模の大小に関わらず、誠実に対応いたします。",
  },
  {
    q: "料金はどのくらいですか？",
    a: "料金は内容や規模に応じて柔軟に対応しています。まずはお気軽にご相談いただければ、お見積もりをご案内いたします。初回のご相談は無料です。",
  },
  {
    q: "納期はどのくらいですか？",
    a: "内容によりますが、小規模な修正であれば数日〜1〜2週間程度、新規制作であれば2〜4週間程度が目安です。詳しい納期はご相談のうえご提案いたします。",
  },
  {
    q: "オンラインでの打ち合わせは可能ですか？",
    a: "はい、オンラインでの打ち合わせに対応しています。ご希望の日時やツールをご相談ください。対面をご希望の場合も、状況に応じて対応可能です。",
  },
];

export default function FAQ() {
  useSEO({
    title: "FAQ | WEB STUDIO KABUKI — よくある質問",
    description:
      "WEB STUDIO KABUKIのよくあるご質問。依頼内容、対応範囲、料金、納期、打ち合わせ方法などについて回答しています。",
  });

  const [open, setOpen] = useState(0);

  return (
    <>
      <section className="pt-28 md:pt-36 pb-12">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <SectionHeader
            index="07"
            label="FAQ"
            title="よくある質問"
            subtitle="ご依頼前に気になることをまとめました。ご不明な点があればお気軽にお問い合わせください。"
          />
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-3xl px-6 md:px-8">
          <div className="border-t border-sumi/15">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={i} delay={(i % 3) * 0.05}>
                  <div className="border-b border-sumi/15">
                    <button
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="w-full flex items-start justify-between gap-6 py-6 text-left group"
                      aria-expanded={isOpen}
                    >
                      <span className="flex items-start gap-4">
                        <span className="font-heading text-sm text-ai tabular-nums pt-1">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-heading text-base md:text-lg text-sumi group-hover:text-ai transition-colors duration-300">
                          {f.q}
                        </span>
                      </span>
                      <span className="shrink-0 mt-1 text-sumi/60">
                        {isOpen ? (
                          <Minus className="w-5 h-5" strokeWidth={1.25} />
                        ) : (
                          <Plus className="w-5 h-5" strokeWidth={1.25} />
                        )}
                      </span>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-out ${
                        isOpen ? "max-h-96 pb-6" : "max-h-0"
                      }`}
                    >
                      <p className="text-sm text-sumi/70 leading-relaxed pl-9">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal>
            <div className="mt-16 text-center border border-sumi/15 p-10 bg-card">
              <p className="font-heading text-lg text-sumi mb-2">
                解決しないことがありましたら
              </p>
              <p className="text-sm text-sumi/60 mb-6">
                どんなことでもお気軽にご相談ください。
              </p>
              <Link to="/contact" className="btn-solid">
                お問い合わせする
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}