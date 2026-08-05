import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { base44 } from "@/api/base44Client";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";

export default function WorksPreview() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Work
      .list("-published_date", 4)
      .then((data) => setWorks(data || []))
      .catch(() => setWorks([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 md:py-32 border-t border-sumi/10">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <SectionHeader
            index="03"
            label="WORKS"
            title="制作実績"
          />
          <Reveal>
            <Link
              to="/works"
              className="inline-flex items-center gap-2 text-sm text-ai hover:gap-3 transition-all duration-300"
            >
              すべての実績を見る
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </Reveal>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[0, 1].map((i) => (
              <div key={i} className="aspect-[4/3] bg-stone animate-pulse" />
            ))}
          </div>
        ) : works.length === 0 ? (
          <p className="text-center text-sumi/50 py-16">
            実績は随時更新していきます。
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {works.slice(0, 4).map((w, i) => (
              <Reveal key={w.id} delay={i * 0.08}>
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
                      <span className="text-[0.65rem] text-sumi/40 tracking-wider">
                        {w.period}
                      </span>
                    </div>
                    <h3 className="font-heading text-lg md:text-xl text-sumi group-hover:text-ai transition-colors duration-300">
                      {w.title}
                    </h3>
                    <p className="mt-2 text-sm text-sumi/60 leading-relaxed line-clamp-2">
                      {w.summary}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}