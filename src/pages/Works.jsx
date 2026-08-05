import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { base44 } from "@/api/base44Client";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { useSEO } from "@/components/SEO";

export default function Works() {
  useSEO({
    title: "WORKS | WEB STUDIO KABUKI — 制作実績",
    description:
      "WEB STUDIO KABUKIの制作実績一覧。Webサイト制作、WordPress、改善など、これまでの作品をご紹介します。",
  });

  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const categories = ["ALL", "Web制作", "WordPress", "改善", "動画編集", "バナー制作", "自主制作"];

  useEffect(() => {
    base44.entities.Work
      .list("-published_date", 50)
      .then((data) => setWorks(data || []))
      .catch(() => setWorks([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "ALL"
      ? works
      : works.filter(
          (w) =>
            w.category === filter ||
            (filter === "自主制作" && w.is_self_made)
        );

  return (
    <>
      <section className="pt-28 md:pt-36 pb-12">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <SectionHeader
            index="04"
            label="WORKS"
            title="制作実績"
            subtitle="これまでに関わったWeb制作の実績です。自主制作の作品も含めてご紹介しています。実績は随時追加していきます。"
          />
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          {/* Filter */}
          <Reveal>
            <div className="flex flex-wrap gap-2 mb-12 border-b border-sumi/10 pb-6">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`px-4 py-2 text-xs tracking-widest-2 transition-all duration-300 ${
                    filter === c
                      ? "bg-sumi text-white"
                      : "text-sumi/60 hover:text-sumi"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Reveal>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-[4/3] bg-stone animate-pulse" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-sumi/50 py-20">
              該当する実績はまだありません。
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-12 gap-y-16">
              {filtered.map((w, i) => (
                <Reveal key={w.id} delay={(i % 2) * 0.08}>
                  <Link to={`/works/${w.slug}`} className="group block">
                    <div className="relative overflow-hidden aspect-[4/3] bg-stone">
                      <Image
                        src={w.thumbnail_image}
                        alt={`${w.title}の制作実績`}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        fittingType="fill"
                      />
                      <div className="absolute inset-0 bg-sumi/0 group-hover:bg-sumi/10 transition-colors duration-500" />
                      <span className="absolute bottom-4 right-4 bg-kinari px-4 py-2 text-xs tracking-widest-2 text-ai opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                        詳細を見る
                      </span>
                    </div>
                    <div className="mt-5">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[0.65rem] tracking-widest-2 text-ai">
                          {w.category}
                        </span>
                        <span className="h-px w-6 bg-sumi/20" />
                        <span className="text-[0.65rem] text-sumi/40">
                          {w.period}
                        </span>
                      </div>
                      <h3 className="font-heading text-lg md:text-xl text-sumi group-hover:text-ai transition-colors duration-300">
                        {w.title}
                      </h3>
                      <p className="mt-2 text-sm text-sumi/60 leading-relaxed line-clamp-2">
                        {w.summary}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(w.technologies || []).slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-[0.65rem] text-sumi/50 border border-sumi/15 px-2 py-1"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}