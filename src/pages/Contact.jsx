import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowRight, Check, Mail, User, Tag, MessageSquare } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useSEO } from "@/components/SEO";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";

const INQUIRY_TYPES = [
  "ホームページ制作",
  "ホームページ修正",
  "WordPress",
  "SEO",
  "その他",
];

export default function Contact() {
  useSEO({
    title: "CONTACT | WEB STUDIO KABUKI — お問い合わせ",
    description:
      "WEB STUDIO KABUKIへのお問い合わせ。ホームページ制作・修正・WordPress・SEOなど、お気軽にご相談ください。",
  });

  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    // honeypot: if filled, silently reject
    if (data.website) {
      setSubmitted(true);
      return;
    }
    await base44.entities.Contact.create({
      name: data.name,
      email: data.email,
      inquiry_type: data.inquiry_type,
      message: data.message,
    });
    reset();
    setSubmitted(true);
  };

  return (
    <>
      <section className="pt-28 md:pt-36 pb-12">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <SectionHeader
            index="06"
            label="CONTACT"
            title="お問い合わせ"
            subtitle="Web制作・修正・WordPress・SEOなど、お気軽にご相談ください。通常は数日以内にご返信いたします。"
          />
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Side info */}
            <aside className="lg:col-span-4">
              <Reveal>
                <div className="space-y-8">
                  <div>
                    <p className="section-index mb-3">ABOUT</p>
                    <p className="text-sm text-sumi/70 leading-relaxed">
                      現役エンジニア蕪木鉄平が、個人で対応いたします。
                      小さな修正から新規制作まで、まずはご相談ください。
                    </p>
                  </div>
                  <div className="border-t border-sumi/10 pt-8">
                    <p className="section-index mb-3">RESPONSE</p>
                    <p className="text-sm text-sumi/70 leading-relaxed">
                      お問い合わせいただいてから、
                      通常は数日以内にご返信いたします。
                    </p>
                  </div>
                  <div className="border-t border-sumi/10 pt-8">
                    <p className="section-index mb-3">PRICE</p>
                    <p className="text-sm text-sumi/70 leading-relaxed">
                      料金は内容・規模に応じて柔軟に対応。
                      まずはお気軽にご相談ください。
                    </p>
                  </div>
                  <div className="border-t border-sumi/10 pt-8">
                    <p className="section-index mb-3">FAQ</p>
                    <p className="text-sm text-sumi/70 leading-relaxed mb-3">
                      よくあるご質問もご用意しています。
                    </p>
                    <Link
                      to="/faq"
                      className="inline-flex items-center gap-2 text-sm text-ai hover:gap-3 transition-all duration-300"
                    >
                      よくある質問を見る
                      <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                    </Link>
                  </div>
                </div>
              </Reveal>
            </aside>

            {/* Form */}
            <div className="lg:col-span-7 lg:col-start-6">
              <Reveal delay={0.1}>
                {submitted ? (
                  <div className="border border-sumi/15 bg-card p-12 md:p-16 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full border border-ai flex items-center justify-center mb-6">
                      <Check className="w-7 h-7 text-ai" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-heading text-2xl text-sumi mb-4">
                      送信ありがとうございました
                    </h3>
                    <p className="text-sm text-sumi/60 leading-relaxed max-w-md mx-auto">
                      お問い合わせを受け付けました。
                      内容を確認のうえ、数日以内にご入力いただいた
                      メールアドレスへご返信いたします。
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="btn-ghost mt-8"
                    >
                      別の問い合わせをする
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-8"
                    noValidate
                  >
                    {/* Name */}
                    <Field
                      label="お名前"
                      icon={<User className="w-4 h-4" strokeWidth={1.5} />}
                      error={errors.name?.message}
                    >
                      <input
                        type="text"
                        {...register("name", {
                          required: "お名前を入力してください",
                          maxLength: {
                            value: 100,
                            message: "100文字以内で入力してください",
                          },
                        })}
                        className="w-full bg-transparent border-b border-sumi/20 focus:border-ai py-3 text-sm text-sumi placeholder:text-sumi/30 transition-colors focus:outline-none"
                        placeholder="山田 太郎"
                      />
                    </Field>

                    {/* Email */}
                    <Field
                      label="メールアドレス"
                      icon={<Mail className="w-4 h-4" strokeWidth={1.5} />}
                      error={errors.email?.message}
                    >
                      <input
                        type="email"
                        {...register("email", {
                          required: "メールアドレスを入力してください",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "正しいメールアドレスを入力してください",
                          },
                        })}
                        className="w-full bg-transparent border-b border-sumi/20 focus:border-ai py-3 text-sm text-sumi placeholder:text-sumi/30 transition-colors focus:outline-none"
                        placeholder="example@email.com"
                      />
                    </Field>

                    {/* Inquiry type */}
                    <Field
                      label="問い合わせ種別"
                      icon={<Tag className="w-4 h-4" strokeWidth={1.5} />}
                      error={errors.inquiry_type?.message}
                    >
                      <div className="flex flex-wrap gap-2">
                        {INQUIRY_TYPES.map((t) => (
                          <label
                            key={t}
                            className="cursor-pointer"
                          >
                            <input
                              type="radio"
                              value={t}
                              {...register("inquiry_type", {
                                required: "問い合わせ種別を選択してください",
                              })}
                              className="peer sr-only"
                            />
                            <span className="block px-4 py-2 text-xs tracking-wider border border-sumi/20 text-sumi/60 peer-checked:bg-sumi peer-checked:text-white peer-checked:border-sumi transition-all duration-300">
                              {t}
                            </span>
                          </label>
                        ))}
                      </div>
                    </Field>

                    {/* Message */}
                    <Field
                      label="お問い合わせ内容"
                      icon={<MessageSquare className="w-4 h-4" strokeWidth={1.5} />}
                      error={errors.message?.message}
                    >
                      <textarea
                        rows={6}
                        {...register("message", {
                          required: "お問い合わせ内容を入力してください",
                          minLength: {
                            value: 5,
                            message: "5文字以上入力してください",
                          },
                        })}
                        className="w-full bg-transparent border-b border-sumi/20 focus:border-ai py-3 text-sm text-sumi placeholder:text-sumi/30 transition-colors focus:outline-none resize-none"
                        placeholder="ご相談内容をお聞かせください"
                      />
                    </Field>

                    {/* Honeypot */}
                    <input
                      type="text"
                      {...register("website")}
                      tabIndex={-1}
                      autoComplete="off"
                      className="absolute left-[-9999px] w-px h-px opacity-0"
                      aria-hidden="true"
                    />

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-solid disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "送信中..." : "送信する"}
                        {!isSubmitting && (
                          <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, icon, error, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sumi/40">{icon}</span>
        <label className="text-xs tracking-widest-2 text-sumi/60">
          {label}
        </label>
      </div>
      {children}
      {error && (
        <p className="mt-2 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}