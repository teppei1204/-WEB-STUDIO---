import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useTheme } from "@/lib/ThemeContext";

const PROFILE_IMG =
  "https://media.base44.com/images/public/6a707359147785c39fbc81e6/a7156c8ff_generated_76ff3d13.png";
const HERO_IMG =
  "https://media.base44.com/images/public/6a707359147785c39fbc81e6/608416608_generated_99e71e22.png";

export default function Hero() {
  const { theme } = useTheme();
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16 md:pt-20">
      {/* Background watermark — theme aware */}
      {theme === "craft" ? (
        <span className="bg-kanji absolute right-[-2rem] top-[6rem] text-[40rem] leading-none font-heading select-none hidden lg:block">
          匠
        </span>
      ) : (
        <span
          aria-hidden="true"
          className="absolute right-[-1rem] top-[7rem] font-mono text-[16rem] md:text-[22rem] leading-none select-none hidden lg:block tracking-tighter"
          style={{ color: "hsl(var(--ai) / 0.08)" }}
        >
          {'</>'}
        </span>
      )}

      <div className="relative mx-auto max-w-[1400px] w-full px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left — text */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4 mb-8 animate-fade-in">
              <span className="h-px w-12 bg-ai" />
              <span className="font-heading text-xs tracking-widest-2 text-ai">
                ENGINEER × WEB CREATOR
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-shu animate-pop-in" />
            </div>

            <h1 className="font-heading font-light text-sumi leading-[1.1] animate-fade-up">
              <span className="block text-[0.7rem] md:text-xs tracking-widest-2 text-sumi/50 mb-4">
                WEB STUDIO KABUKI
              </span>
              <span className="block text-5xl md:text-7xl lg:text-8xl">
                技術を<span className="accent-grad">磨き</span>、
              </span>
              <span className="block text-5xl md:text-7xl lg:text-8xl">
                仕事を<span className="accent-grad">磨く</span>。
              </span>
            </h1>

            <p className="mt-8 text-sm md:text-base text-sumi/60 leading-relaxed max-w-md animate-fade-up">
              現役エンジニア蕪木鉄平によるWeb制作スタジオ。
              日本的な美意識とエンジニアリングを融合した、
              誠実で長く使えるWebサイトを制作します。
            </p>

            <div className="mt-10 flex flex-wrap gap-4 animate-fade-up">
              <Link to="/contact" className="btn-solid">
                お問い合わせ
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>
              <Link to="/works" className="btn-ghost">
                制作実績を見る
              </Link>
            </div>

            <div className="mt-16 flex items-center gap-6">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border border-sumi/20">
                <Image
                  src={PROFILE_IMG}
                  alt="蕪木鉄平のプロフィール画像"
                  className="w-full h-full object-cover"
                  fittingType="fill"
                />
              </div>
              <div>
                <p className="font-heading text-sm text-sumi">蕪木鉄平</p>
                <p className="text-xs text-sumi/50 tracking-wider">
                  TEPPEI KABUKI
                </p>
              </div>
            </div>
          </div>

          {/* Right — image */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border border-sumi/15" />
              <div className="relative aspect-[4/5] overflow-hidden bg-stone">
                <Image
                  src={HERO_IMG}
                  alt="ミニマルなワークスペース — WEB STUDIO KABUKI"
                  className="w-full h-full object-cover"
                  fittingType="fill"
                />
                <span className="absolute top-4 right-4 w-3 h-3 bg-shu rotate-45" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-kinari px-6 py-4 border border-sumi/15 animate-float">
                <p className="font-heading text-xs tracking-widest-2 text-sumi/50">
                  CRAFTSMANSHIP
                </p>
                <p className="font-heading text-lg text-sumi mt-1">
                  職人の仕事
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll guide */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-3">
        <span className="text-[0.6rem] tracking-widest-2 text-sumi/40">SCROLL</span>
        <span className="w-px h-12 bg-sumi/30 origin-top animate-[line-grow_1.5s_ease-in-out_infinite]" />
      </div>
    </section>
  );
}