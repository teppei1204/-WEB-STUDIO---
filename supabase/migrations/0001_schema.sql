-- ============================================================
-- WEB STUDIO KABUKI — Migration 0001: Tables, indexes, triggers
-- Apply in Supabase Dashboard → SQL Editor (run as whole file)
-- ============================================================

-- ---------- helper: keep updated_at current ----------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ---------- profiles (auth.users → profiles, no standalone users table) ----------
CREATE TABLE IF NOT EXISTS public.profiles (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  avatar_url   text,
  role         text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- Auto-create a profile whenever a user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------- categories ----------
CREATE TABLE IF NOT EXISTS public.categories (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  slug          text NOT NULL UNIQUE,
  display_order int  NOT NULL DEFAULT 0,
  status        text NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  deleted_at    timestamptz
);

-- ---------- works (portfolio CMS) ----------
CREATE TABLE IF NOT EXISTS public.works (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  slug          text NOT NULL UNIQUE,
  summary       text,
  description   text,
  highlights    text,
  image_url     text,
  project_url   text,
  github_url    text,
  technologies  text[] NOT NULL DEFAULT '{}',
  duration      text,
  purpose       text,
  role          text,
  result        text,
  category      text,
  is_self_made  boolean NOT NULL DEFAULT false,
  display_order numeric NOT NULL DEFAULT 0,
  status        text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at  date,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  deleted_at    timestamptz,
  legacy_id     text
);

-- ---------- posts (blog CMS) ----------
CREATE TABLE IF NOT EXISTS public.posts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL,
  slug            text NOT NULL UNIQUE,
  excerpt         text,
  content         text,
  thumbnail_url   text,
  category_id     uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  legacy_category text,
  tags            text[] NOT NULL DEFAULT '{}',
  author_id       uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name     text NOT NULL DEFAULT '蕪木鉄平',
  featured        boolean NOT NULL DEFAULT false,
  status          text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at    date,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  deleted_at      timestamptz,
  legacy_id       text
);

-- ---------- comments (moderated) ----------
CREATE TABLE IF NOT EXISTS public.comments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body       text NOT NULL CHECK (char_length(trim(body)) BETWEEN 1 AND 2000),
  status     text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

-- ---------- contacts (writes only via Edge Function / service role) ----------
CREATE TABLE IF NOT EXISTS public.contacts (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  email        text NOT NULL,
  company      text,
  inquiry_type text NOT NULL CHECK (inquiry_type IN ('Webサイト制作', 'Webサイト修正', 'WordPress', 'SEO', 'その他')),
  subject      text,
  message      text NOT NULL,
  status       text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'replied', 'completed')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- ---------- faq ----------
CREATE TABLE IF NOT EXISTS public.faq (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question      text NOT NULL,
  answer        text NOT NULL,
  category      text,
  display_order int NOT NULL DEFAULT 0,
  status        text NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  deleted_at    timestamptz
);

-- ---------- indexes (partial indexes for the hot "published & alive" paths) ----------
CREATE INDEX IF NOT EXISTS idx_posts_published
  ON public.posts (published_at DESC)
  WHERE deleted_at IS NULL AND status = 'published';
CREATE INDEX IF NOT EXISTS idx_posts_category
  ON public.posts (category_id)
  WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_works_published
  ON public.works (published_at DESC)
  WHERE deleted_at IS NULL AND status = 'published';
CREATE INDEX IF NOT EXISTS idx_works_order
  ON public.works (display_order)
  WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_comments_post
  ON public.comments (post_id, created_at)
  WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_comments_user
  ON public.comments (user_id)
  WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_contacts_created
  ON public.contacts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_faq_order
  ON public.faq (display_order)
  WHERE deleted_at IS NULL;

-- ---------- updated_at triggers ----------
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_categories_updated_at ON public.categories;
CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_works_updated_at ON public.works;
CREATE TRIGGER trg_works_updated_at BEFORE UPDATE ON public.works
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_posts_updated_at ON public.posts;
CREATE TRIGGER trg_posts_updated_at BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_comments_updated_at ON public.comments;
CREATE TRIGGER trg_comments_updated_at BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_contacts_updated_at ON public.contacts;
CREATE TRIGGER trg_contacts_updated_at BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_faq_updated_at ON public.faq;
CREATE TRIGGER trg_faq_updated_at BEFORE UPDATE ON public.faq
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();