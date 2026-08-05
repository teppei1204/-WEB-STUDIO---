import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Image } from "@/components/ui/image";
import { base44 } from "@/api/base44Client";
import Reveal from "@/components/Reveal";
import { useSEO } from "@/components/SEO";

const FIELD_LABELS = {
  role: "担当範囲",
  period: "制作期間",
  purpose: "制作目的",
  highlights: "工夫したポイント",
  category: "カテゴリー",
};

export default function WorkDetail() {
  const { slug } = useParams();
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    base44.entities.Work
      .filter({ slug }, undefined, 1)
      .then((data) => setWork((data && data[0]) || null))
      .catch(() => setWork(null))
      .finally(() => setLoading(false));
  }, [slug]);

  useSEO({
    title: work
      ? `${work.title} | WORKS — WEB STUDIO KABUKI`
      : "WORKS — WEB STUDIO KABUKI",
    description: work ? work.summary : "WEB STUDIO KABUKIの制作実績詳細。",
  });

  if (loading) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sumi/20 border-t-ai rounded-full animate-spin" />
      </div>
    );
  }

  if (!work) {
    return (
      <div className="pt-32 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="font-heading text-2xl text-sumi mb-4">
          実績が見つかりませんでした
        </p>
        <Link to="/works" className="btn-ghost">
          実績一覧に戻る
        </Link>
      </div>
    );
  }

  return (
    <article className="pt-28 md:pt-36 pb-24">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 mb-10">
        <nav className="flex items-center gap-2 text-xs text-sumi/50">
          <Link to="/" className="hover:text-ai">HOME</Link>
          <span>/</span>
          <Link to="/works" className="hover:text-ai">WORKS</Link>
          <span>/</span>
          <span className="text-sumi">{work.title}</span>
        </nav>
      </div>

      {/* Header */}
      <header className="mx-auto max-w-[1400px] px-6 md:px-12 mb-12">
        <Reveal>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs tracking-widest-2 text-ai">
              {work.category}
            </span>
            <span className="h-px w-8 bg-sumi/20" />
            <span className="text-xs text-sumi/40">{work.period}</span>
          </div>
          <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-light text-sumi leading-tight">
            {work.title}
          </h1>
          <p className="mt-6 text-base md:text-lg text-sumi/60 leading-relaxed max-w-2xl">
            {work.summary}
          </p>
        </Reveal>
      </header>

      {/* Hero image */}
      <Reveal>
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 mb-16">
          <div className="aspect-[16/9] overflow-hidden bg-stone">
            <Image
              src={work.thumbnail_image}
              alt={`${work.title}のメインビジュアル`}
              className="w-full h-full object-cover"
              fittingType="fill"
            />
          </div>
        </div>
      </Reveal>

      {/* Body */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Overview */}
          <div className="lg:col-span-7 lg:col-start-1">
            <Reveal>
              <h2 className="font-heading text-2xl text-sumi mb-6">概要</h2>
              <p className="text-sm md:text-base text-sumi/70 leading-loose whitespace-pre-line">
                {work.overview || work.summary}
              </p>
            </Reveal>

            {work.highlights && (
              <Reveal delay={0.1}>
                <div className="mt-12">
                  <h2 className="font-heading text-2xl text-sumi mb-6">
                    工夫したポイント
                  </h2>
                  <p className="text-sm md:text-base text-sumi/70 leading-loose whitespace-pre-line">
                    {work.highlights}
                  </p>
                </div>
              </Reveal>
            )}
          </div>

          {/* Meta */}
          <aside className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={0.15}>
              <div className="border-l border-sumi/15 pl-6 space-y-6">
                {work.role && (
                  <MetaItem label={FIELD_LABELS.role} value={work.role} />
                )}
                {work.purpose && (
                  <MetaItem label={FIELD_LABELS.purpose} value={work.purpose} />
                )}
                {work.technologies && work.technologies.length > 0 && (
                  <div>
                    <p className="text-xs tracking-widest-2 text-sumi/40 mb-2">
                      使用技術
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {work.technologies.map((t) => (
                        <span
                          key={t}
                          className="text-xs text-sumi/70 border border-sumi/20 px-2 py-1"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          </aside>
        </div>

        {/* Nav */}
        <div className="mt-20 pt-8 border-t border-sumi/10 flex items-center justify-between">
          <Link
            to="/works"
            className="inline-flex items-center gap-2 text-sm text-sumi/60 hover:text-ai transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            実績一覧に戻る
          </Link>
          <Link to="/contact" className="btn-ghost-ai">
            このような制作を依頼する
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function MetaItem({ label, value }) {
  return (
    <div>
      <p className="text-xs tracking-widest-2 text-sumi/40 mb-1">{label}</p>
      <p className="text-sm text-sumi/80 leading-relaxed whitespace-pre-line">
        {value}
      </p>
    </div>
  );
}