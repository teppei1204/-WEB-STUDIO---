-- ============================================================
-- WEB STUDIO KABUKI — Migration 0004: Seed (categories + FAQ)
-- Apply AFTER 0002_rls.sql (RLS must be enabled; seeds inserted as table owner).
--
-- Scope:
--   1. Blog categories (TECH / LIFE — matches existing site)
--   2. FAQ entries (7 items — matches src/pages/FAQ.jsx verbatim)
--
-- Blog posts and works (portfolio) are NOT seeded here.
-- Those contain markdown content + images hosted on Base44 media,
-- and require a runtime migration script (read from Base44 entities,
-- re-upload images to Supabase Storage, then INSERT with updated URLs).
--
-- Idempotent: safe to run multiple times. Does NOT delete or modify
-- existing rows — only inserts when the target rows are absent.
-- ============================================================

-- ============================================================
-- 1. Blog categories
--    Idempotent via slug UNIQUE constraint (defined in 0001_schema.sql)
-- ============================================================
INSERT INTO public.categories (name, slug, display_order, status) VALUES
  ('TECH', 'tech', 1, 'published'),
  ('LIFE', 'life', 2, 'published')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 2. FAQ entries (7 items, matching src/pages/FAQ.jsx)
--
--    The faq table has NO natural unique key on `question` (PK is a
--    random uuid), so ON CONFLICT DO NOTHING cannot prevent duplicates
--    on re-run. Instead we guard with "only seed if table is empty".
--    This is idempotent: first run inserts all 7; subsequent runs
--    detect existing rows and skip the entire block.
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.faq WHERE deleted_at IS NULL LIMIT 1) THEN
    INSERT INTO public.faq (question, answer, display_order, status) VALUES
      (
        'どんな仕事を依頼できますか？',
        'ホームページの新規制作、既存サイトの修正・改善、WordPressの制作・修正、SEO対策、レスポンシブ対応、保守・改善などに対応しています。詳細はサービスページをご覧ください。',
        1, 'published'
      ),
      (
        '小規模な修正だけでも依頼できますか？',
        'はい、もちろん可能です。テキストの差し替えやレイアウトの微調整など、小さな修正も歓迎しています。まずはお気軽にご相談ください。',
        2, 'published'
      ),
      (
        'WordPressに対応できますか？',
        '対応可能です。WordPressを用いたサイト制作、テーマ・プラグインのカスタマイズ、不具合修正など幅広く対応しています。運用しやすい構成のご提案も可能です。',
        3, 'published'
      ),
      (
        '個人でも依頼できますか？',
        '個人の方でも企業の方でも歓迎しています。規模の大小に関わらず、誠実に対応いたします。',
        4, 'published'
      ),
      (
        '料金はどのくらいですか？',
        '料金は内容や規模に応じて柔軟に対応しています。まずはお気軽にご相談いただければ、お見積もりをご案内いたします。初回のご相談は無料です。',
        5, 'published'
      ),
      (
        '納期はどのくらいですか？',
        '内容によりますが、小規模な修正であれば数日〜1〜2週間程度、新規制作であれば2〜4週間程度が目安です。詳しい納期はご相談のうえご提案いたします。',
        6, 'published'
      ),
      (
        'オンラインでの打ち合わせは可能ですか？',
        'はい、オンラインでの打ち合わせに対応しています。ご希望の日時やツールをご相談ください。対面をご希望の場合も、状況に応じて対応可能です。',
        7, 'published'
      );
  END IF;
END $$;