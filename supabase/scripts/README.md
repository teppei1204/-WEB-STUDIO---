# Supabase — WEB STUDIO KABUKI

## 適用手順（Supabase Dashboard → SQL Editor で上から順に実行）

1. `migrations/0001_schema.sql` — テーブル・インデックス・トリガー
2. `migrations/0002_rls.sql` — Row Level Security（admin / user / anon の権限分離）
3. `migrations/0003_storage.sql` — Storage バケットとポリシー
4. `migrations/0004_seed.sql` — カテゴリー（TECH / LIFE）とFAQの初期データ

## フロントエンド接続情報

`src/lib/supabaseConfig.js` に Supabase の Project URL と anon キーを設定
（Supabase Dashboard → Project Settings → API）。
Cloudflare Pages でのビルド時は環境変数 `VITE_SUPABASE_URL` /
`VITE_SUPABASE_ANON_KEY` が優先される。

anon キーは公開鍵（RLS がアクセス制御を保証する）。service role キーは
Edge Function のみで使用し、絶対にフロントに置かない。

## 管理者（admin）昇格

Supabase Auth でサインアップ後、Supabase Dashboard → Table Editor →
`profiles` で自分の行の `role` を手動で `'admin'` に変更する
（RLS によりロールの自己昇格は構造的に不可能なため、昇格はDBコンソールからのみ行う）。