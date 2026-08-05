import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Image } from "@/components/ui/image";
import { base44 } from "@/api/base44Client";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { useSEO } from "@/components/SEO";

export default function Blog() {
  useSEO({
    title: "BLOG | WEB STUDIO KABUKI — エンジニアの手帖",
    description:
      "WEB STUDIO KABUKIのブログ。TECHカテゴリーで技術的な知見を、LIFEカテゴリーで日々の考えや趣味をつづります。",
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("ALL");
  const [query, setQuery] = useState("");

  useEffect(() => {
    base44.entities.BlogPost
      .list("-published_date", 50)
      .then((data) => setPosts(data || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const catOk = category === "ALL" || p.category === category;
      const q = query.trim().toLowerCase();
      const qOk =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.excerpt || "").toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q));
      return catOk && qOk;
    });
  }, [posts, category, query]);

  return (
    <>
      <section className="pt-28 md:pt-36 pb-12">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <SectionHeader
            index="05"
            label="BLOG"
            title="エンジニアの手帖"
            subtitle="TECHでは技術的な知見を、LIFEでは日々の考えや趣味をつづります。専門性と人柄、両方を知っていただくための記録です。"
          />
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          {/* Controls */}
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 border-b border-sumi/10 pb-6">
              <div className="flex flex-wrap gap-2">
                {["ALL", "TECH", "LIFE"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`px-4 py-2 text-xs tracking-widest-2 transition-all duration-300 ${
                      category === c
                        ? "bg-sumi text-white"
                        : "text-sumi/60 hover:text-sumi"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="relative w-full md:w-72">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sumi/40"
                  strokeWidth={1.5}
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="記事を検索"
                  className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-sumi/20 text-sm text-sumi placeholder:text-sumi/40 focus:border-ai focus:outline-none transition-colors"
                />
              </div>
            </div>
          </Reveal>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-[16/10] bg-stone animate-pulse" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-sumi/50 py-20">
              該当する記事は見つかりませんでした。
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {filtered.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 0.08}>
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
                      <p className="mt-2 text-sm text-sumi/60 leading-relaxed line-clamp-3">
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
    </>
  );
}