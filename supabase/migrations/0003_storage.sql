-- ============================================================
-- WEB STUDIO KABUKI — Migration 0003: Storage buckets & policies
-- Apply AFTER 0002_rls.sql (policies depend on public.is_admin())
--
-- Bucket separation:
--   works  : CMS images, public read, admin-only writes
--   posts  : blog thumbnails, public read, admin-only writes
--   avatars: user avatars, public read, each user writes ONLY inside own folder
--
-- Idempotent: safe to re-run. Does NOT delete existing files/objects.
-- ============================================================

-- ============================================================
-- 1. Bucket creation (idempotent via ON CONFLICT)
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES
  ('works',   'works',   true),
  ('posts',   'posts',   true),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 2. Pre-cleanup: drop existing storage policies for idempotency
--    (drops policy definitions only — files/objects are untouched)
-- ============================================================
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname IN (
        'public_read_images',
        'avatars_insert_own',
        'avatars_update_own',
        'avatars_delete_own',
        'works_admin_insert',
        'works_admin_update',
        'works_admin_delete',
        'posts_admin_insert',
        'posts_admin_update',
        'posts_admin_delete'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', r.policyname);
  END LOOP;
END $$;

-- ============================================================
-- 3. Read: public for all three buckets
--    (buckets are marked public=true, but API access still flows
--     through RLS — this policy grants SELECT to anon + authenticated)
-- ============================================================
CREATE POLICY "public_read_images" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id IN ('works', 'posts', 'avatars'));

-- ============================================================
-- 4. avatars: each user writes ONLY inside their own folder ({auth.uid()}/...)
--    Folder convention: avatars/{user_id}/filename.ext
--    storage.foldername(name)[1] extracts the top-level folder = user_id
-- ============================================================
CREATE POLICY "avatars_insert_own" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "avatars_update_own" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "avatars_delete_own" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================
-- 5. works: admin-only writes
-- ============================================================
CREATE POLICY "works_admin_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'works' AND public.is_admin());

CREATE POLICY "works_admin_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'works' AND public.is_admin());

CREATE POLICY "works_admin_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'works' AND public.is_admin());

-- ============================================================
-- 6. posts: admin-only writes
-- ============================================================
CREATE POLICY "posts_admin_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'posts' AND public.is_admin());

CREATE POLICY "posts_admin_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'posts' AND public.is_admin());

CREATE POLICY "posts_admin_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'posts' AND public.is_admin());