import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { base44 } from "@/api/base44Client";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";

export default function BlogPreview() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.BlogPost
      .list("-published_date", 3)
      .then((data) => setPosts(data || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 md:py-32 border-t border-sumi/10 bg-stone/30">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <SectionHeader index="04" label="BLOG" title="エンジニアの手帖" />
          <Reveal>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm text-ai hover:gap-3 transition-all duration-300"
            >
              すべての記事を見る
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </Reveal>
        </div>

        <p className="text-sm text-sumi/60 leading-relaxed mb-12 max-w-2xl">
          TECHでは技術的な知見を、LIFEでは日々の考えや趣味をつづります。
          専門性と人柄、両方を知っていただくための記録です。
        </p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[16/10] bg-stone animate-pulse" />
                <div className="h-4 bg-stone animate-pulse w-1/3" />
                <div className="h-5 bg-stone animate-pulse w-3/4" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-sumi/50 py-16">
            記事は随時更新していきます。
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {posts.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <Link to={`/blog/${p.slug}`} className="group block">
                  <div className="aspect-[16/10] overflow-hidden bg-stone">
                    <Image
                      src={p.eyecatch_image}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      fittingType="fill"
                    />
                  </div>
                  <div className="mt-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`text-[0.65rem] tracking-widest-2 ${
                          p.category === "TECH" ? "text-ai" : "text-sumi/50"
                        }`}
                      >
                        {p.category}
                      </span>
                      <span className="h-px w-6 bg-sumi/20" />
                      <span className="text-[0.65rem] text-sumi/40">
                        {p.published_date}
                      </span>
                    </div>
                    <h3 className="font-heading text-base md:text-lg text-sumi group-hover:text-ai transition-colors duration-300 leading-snug">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm text-sumi/60 leading-relaxed line-clamp-2">
                      {p.excerpt}
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