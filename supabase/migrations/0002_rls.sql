-- ============================================================
-- WEB STUDIO KABUKI — Migration 0002: Row Level Security + immutability triggers
-- Apply AFTER 0001_schema.sql
-- ============================================================

-- ---------- admin check ----------
-- SECURITY DEFINER + fixed search_path:
--   * runs as the table owner, bypassing profiles RLS → no recursion
--   * fixed search_path → no search_path hijacking
--   * STABLE → safe to use in policy expressions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- ============================================================
-- profiles
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- display names / avatars are public (comments show author names)
CREATE POLICY profiles_select ON public.profiles
  FOR SELECT TO anon, authenticated
  USING (true);

-- direct INSERT is admin-only; normal signups go through the auth trigger
CREATE POLICY profiles_insert_admin ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

-- own profile editable; role / user_id immutability is enforced by trigger
CREATE POLICY profiles_update ON public.profiles
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY profiles_delete_admin ON public.profiles
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- ---------- profiles immutability trigger ----------
-- Non-admins cannot change role or user_id (defense against privilege escalation).
-- Admins bypass all checks.
CREATE OR REPLACE FUNCTION public.guard_profiles_immutable()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Permission denied: profiles.role is immutable for non-admins';
    END IF;
    IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN
      RAISE EXCEPTION 'Permission denied: profiles.user_id is immutable for non-admins';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_immutable ON public.profiles;
CREATE TRIGGER trg_profiles_immutable
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_profiles_immutable();

-- ============================================================
-- categories
-- ============================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY categories_select ON public.categories
  FOR SELECT TO anon, authenticated
  USING (public.is_admin() OR (status = 'published' AND deleted_at IS NULL));

CREATE POLICY categories_insert_admin ON public.categories
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY categories_update_admin ON public.categories
  FOR UPDATE TO authenticated
  USING (public.is_admin());

CREATE POLICY categories_delete_admin ON public.categories
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- ============================================================
-- works
-- ============================================================
ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;

CREATE POLICY works_select ON public.works
  FOR SELECT TO anon, authenticated
  USING (public.is_admin() OR (status = 'published' AND deleted_at IS NULL));

CREATE POLICY works_insert_admin ON public.works
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY works_update_admin ON public.works
  FOR UPDATE TO authenticated
  USING (public.is_admin());

CREATE POLICY works_delete_admin ON public.works
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- ============================================================
-- posts
-- ============================================================
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY posts_select ON public.posts
  FOR SELECT TO anon, authenticated
  USING (public.is_admin() OR (status = 'published' AND deleted_at IS NULL));

CREATE POLICY posts_insert_admin ON public.posts
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY posts_update_admin ON public.posts
  FOR UPDATE TO authenticated
  USING (public.is_admin());

CREATE POLICY posts_delete_admin ON public.posts
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- ============================================================
-- comments — new comments are ALWAYS pending; approval is admin-only
-- ============================================================
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY comments_select ON public.comments
  FOR SELECT TO anon, authenticated
  USING (
    public.is_admin()
    OR (deleted_at IS NULL AND status = 'approved')
    OR (deleted_at IS NULL AND user_id = auth.uid())
  );

CREATE POLICY comments_insert_own ON public.comments
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND status = 'pending' AND deleted_at IS NULL);

-- owner can edit own body; status / user_id immutability is enforced by trigger
CREATE POLICY comments_update_own ON public.comments
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND deleted_at IS NULL)
  WITH CHECK (user_id = auth.uid());

CREATE POLICY comments_delete_own ON public.comments
  FOR DELETE TO authenticated
  USING (user_id = auth.uid() AND deleted_at IS NULL);

-- ---------- comments immutability trigger ----------
-- Non-admins (comment owners) cannot change status or user_id.
-- Admins bypass all checks (can approve/reject/reassign).
CREATE OR REPLACE FUNCTION public.guard_comments_immutable()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      RAISE EXCEPTION 'Permission denied: comments.status is immutable for non-admins';
    END IF;
    IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN
      RAISE EXCEPTION 'Permission denied: comments.user_id is immutable for non-admins';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_comments_immutable ON public.comments;
CREATE TRIGGER trg_comments_immutable
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.guard_comments_immutable();

-- ============================================================
-- contacts — NO anon/authenticated write policy at all.
-- Rows are inserted only by the Edge Function using the service role key,
-- and read/managed only by the admin.
-- ============================================================
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY contacts_select_admin ON public.contacts
  FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY contacts_update_admin ON public.contacts
  FOR UPDATE TO authenticated
  USING (public.is_admin());

CREATE POLICY contacts_delete_admin ON public.contacts
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- ============================================================
-- faq
-- ============================================================
ALTER TABLE public.faq ENABLE ROW LEVEL SECURITY;

CREATE POLICY faq_select ON public.faq
  FOR SELECT TO anon, authenticated
  USING (public.is_admin() OR (status = 'published' AND deleted_at IS NULL));

CREATE POLICY faq_insert_admin ON public.faq
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY faq_update_admin ON public.faq
  FOR UPDATE TO authenticated
  USING (public.is_admin());

CREATE POLICY faq_delete_admin ON public.faq
  FOR DELETE TO authenticated
  USING (public.is_admin());