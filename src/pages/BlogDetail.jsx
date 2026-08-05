import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import ReactMarkdown from "react-markdown";
import { base44 } from "@/api/base44Client";
import Reveal from "@/components/Reveal";
import { useSEO } from "@/components/SEO";

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    base44.entities.BlogPost
      .filter({ slug }, undefined, 1)
      .then(async (data) => {
        const p = (data && data[0]) || null;
        setPost(p);
        if (p) {
          const all = await base44.entities.BlogPost
            .list("-published_date", 20)
            .catch(() => []);
          const rel = (all || [])
            .filter((x) => x.id !== p.id && x.category === p.category)
            .slice(0, 3);
          setRelated(rel);
        }
      })
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  useSEO({
    title: post ? `${post.title} | BLOG — WEB STUDIO KABUKI` : "BLOG — WEB STUDIO KABUKI",
    description: post ? post.excerpt : "WEB STUDIO KABUKIのブログ記事。",
  });

  const tags = useMemo(() => post?.tags || [], [post]);

  if (loading) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sumi/20 border-t-ai rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-32 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="font-heading text-2xl text-sumi mb-4">
          記事が見つかりませんでした
        </p>
        <Link to="/blog" className="btn-ghost">
          記事一覧に戻る
        </Link>
      </div>
    );
  }

  return (
    <article className="pt-28 md:pt-36 pb-24">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-3xl px-6 md:px-8 mb-10">
        <nav className="flex items-center gap-2 text-xs text-sumi/50">
          <Link to="/" className="hover:text-ai">HOME</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-ai">BLOG</Link>
          <span>/</span>
          <span className="text-sumi truncate">{post.title}</span>
        </nav>
      </div>

      {/* Header */}
      <header className="mx-auto max-w-3xl px-6 md:px-8 mb-10">
        <Reveal>
          <div className="flex items-center gap-3 mb-6">
            <span
              className={`text-xs tracking-widest-2 ${
                post.category === "TECH" ? "text-ai" : "text-sumi/50"
              }`}
            >
              {post.category}
            </span>
            <span className="h-px w-8 bg-sumi/20" />
            <time className="text-xs text-sumi/40">{post.published_date}</time>
          </div>
          <h1 className="font-heading text-2xl md:text-4xl font-light text-sumi leading-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-6 text-base text-sumi/60 leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </Reveal>
      </header>

      {/* Eyecatch */}
      <Reveal>
        <div className="mx-auto max-w-4xl px-6 md:px-8 mb-12">
          <div className="aspect-[16/9] overflow-hidden bg-stone">
            <Image
              src={post.eyecatch_image}
              alt={post.title}
              className="w-full h-full object-cover"
              fittingType="fill"
            />
          </div>
        </div>
      </Reveal>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 md:px-8">
        <Reveal>
          <div className="prose-kabuki">
            <ReactMarkdown
              components={{
                h2: ({ node, ...props }) => (
                  <h2 className="font-heading text-xl md:text-2xl text-sumi mt-12 mb-5 pb-2 border-b border-sumi/10" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="font-heading text-lg text-sumi mt-8 mb-4" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="text-sm md:text-base text-sumi/75 leading-loose mb-6" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-none space-y-2 mb-6 pl-0" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="text-sm md:text-base text-sumi/75 leading-loose pl-5 relative before:absolute before:left-0 before:top-2.5 before:w-2 before:h-px before:bg-ai" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-2 border-ai/50 pl-5 py-1 my-6 text-sm md:text-base text-sumi/70 italic" {...props} />
                ),
                code: ({ node, ...props }) => (
                  <code className="font-mono text-sm bg-stone px-1.5 py-0.5 text-ai" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a className="text-ai underline underline-offset-2 hover:text-sumi transition-colors" {...props} />
                ),
              }}
            >
              {post.content || ""}
            </ReactMarkdown>
          </div>
        </Reveal>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="text-xs text-sumi/60 border border-sumi/20 px-3 py-1"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Author */}
        <div className="mt-12 pt-8 border-t border-sumi/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-stone flex items-center justify-center font-heading text-ai">
            蕪
          </div>
          <div>
            <p className="font-heading text-sm text-sumi">{post.author || "蕪木鉄平"}</p>
            <p className="text-xs text-sumi/50">Engineer / Web Creator</p>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-24 pt-16 border-t border-sumi/10">
          <div className="mx-auto max-w-[1400px] px-6 md:px-12">
            <h2 className="font-heading text-xl md:text-2xl text-sumi mb-10">
              関連記事
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((r, i) => (
                <Reveal key={r.id} delay={i * 0.08}>
                  <Link to={`/blog/${r.slug}`} className="group block">
                    <div className="aspect-[16/10] overflow-hidden bg-stone">
                      <Image
                        src={r.eyecatch_image}
                        alt={r.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        fittingType="fill"
                      />
                    </div>
                    <div className="mt-4">
                      <span
                        className={`text-[0.65rem] tracking-widest-2 ${
                          r.category === "TECH" ? "text-ai" : "text-sumi/50"
                        }`}
                      >
                        {r.category}
                      </span>
                      <h3 className="font-heading text-base text-sumi group-hover:text-ai transition-colors duration-300 mt-2 leading-snug">
                        {r.title}
                      </h3>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Nav */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 mt-16">
        <div className="pt-8 border-t border-sumi/10 flex items-center justify-between">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-sumi/60 hover:text-ai transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            記事一覧に戻る
          </Link>
          <Link to="/contact" className="btn-ghost-ai">
            お問い合わせ
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </article>
  );
}