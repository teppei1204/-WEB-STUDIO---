/**
 * ============================================================
 * WEB STUDIO KABUKI — Content API (Supabase → Base44-compatible)
 * ============================================================
 *
 * Reads published content from Supabase `posts` / `works` and returns
 * objects shaped like the legacy Base44 BlogPost / Work entities, so the
 * existing UI (Blog.jsx, BlogDetail.jsx, BlogPreview.jsx, Works.jsx,
 * WorkDetail.jsx, WorksPreview.jsx) can consume them without changes.
 *
 * SAFETY:
 *   - Read-only: SELECT only. No INSERT / UPDATE / DELETE.
 *   - No Supabase Storage writes.
 *   - No Base44 SDK calls.
 *
 * FILTERS:
 *   - deleted_at IS NULL  (logical deletion)
 *   - status = 'published'
 *   - ordered by published_at DESC
 *
 * FALLBACK:
 *   getSupabase() === null (credentials not configured) → returns null.
 *   Callers should treat null as "no data yet" and fall back to [].
 *
 * ERRORS:
 *   Supabase / network errors are re-thrown (NOT swallowed) so callers
 *   can decide whether to show an empty state or surface the error.
 * ============================================================
 */

import { getSupabase } from "./supabaseClient";

// ──────────────────────────────────────────────────────────
// Supabase columns to select (only what the UI needs)
// ──────────────────────────────────────────────────────────
const POST_COLUMNS = [
  "id",
  "slug",
  "title",
  "excerpt",
  "content",
  "thumbnail_url",
  "published_at",
  "legacy_category",
  "tags",
  "author_name",
  "featured",
  "status",
  "deleted_at",
];

const WORK_COLUMNS = [
  "id",
  "slug",
  "title",
  "summary",
  "description",
  "highlights",
  "image_url",
  "published_at",
  "duration",
  "technologies",
  "category",
  "is_self_made",
  "display_order",
  "role",
  "purpose",
  "status",
  "deleted_at",
];

// ──────────────────────────────────────────────────────────
// Shape mappers: Supabase row → Base44-compatible object
// ──────────────────────────────────────────────────────────

/** Map a Supabase `posts` row to a Base44 BlogPost-shaped object. */
function mapPost(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    eyecatch_image: row.thumbnail_url, // thumbnail_url → eyecatch_image
    published_date: row.published_at, // published_at → published_date
    category: row.legacy_category, // legacy_category → category
    tags: row.tags || [],
    author: row.author_name, // author_name → author
    featured: row.featured || false,
  };
}

/** Map a Supabase `works` row to a Base44 Work-shaped object. */
function mapWork(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    overview: row.description, // description → overview
    highlights: row.highlights,
    thumbnail_image: row.image_url, // image_url → thumbnail_image
    published_date: row.published_at, // published_at → published_date
    period: row.duration, // duration → period
    technologies: row.technologies || [],
    category: row.category,
    is_self_made: row.is_self_made || false,
    display_order: row.display_order || 0,
    role: row.role,
    purpose: row.purpose,
  };
}

// ──────────────────────────────────────────────────────────
// Blog — posts
// ──────────────────────────────────────────────────────────

/**
 * List published posts, newest first.
 * @param {number} [limit=50]
 * @returns {Promise<Array|null>} Base44 BlogPost-shaped array, or null
 *          when Supabase is not configured.
 * @throws  Supabase / network errors propagate to the caller.
 */
export async function listPosts(limit = 50) {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("posts")
    .select(POST_COLUMNS.join(","))
    .is("deleted_at", null)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []).map(mapPost);
}

/**
 * Fetch a single published post by slug.
 * @param {string} slug
 * @returns {Promise<Object|null>} Base44 BlogPost-shaped object, or null
 *          when Supabase is not configured or no row matches.
 * @throws  Supabase / network errors propagate to the caller.
 */
export async function getPostBySlug(slug) {
  const supabase = getSupabase();
  if (!supabase || !slug) return null;

  const { data, error } = await supabase
    .from("posts")
    .select(POST_COLUMNS.join(","))
    .is("deleted_at", null)
    .eq("status", "published")
    .eq("slug", slug)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return mapPost(data);
}

// ──────────────────────────────────────────────────────────
// Works — works
// ──────────────────────────────────────────────────────────

/**
 * List published works, newest first.
 * @param {number} [limit=50]
 * @returns {Promise<Array|null>} Base44 Work-shaped array, or null
 *          when Supabase is not configured.
 * @throws  Supabase / network errors propagate to the caller.
 */
export async function listWorks(limit = 50) {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("works")
    .select(WORK_COLUMNS.join(","))
    .is("deleted_at", null)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []).map(mapWork);
}

/**
 * Fetch a single published work by slug.
 * @param {string} slug
 * @returns {Promise<Object|null>} Base44 Work-shaped object, or null
 *          when Supabase is not configured or no row matches.
 * @throws  Supabase / network errors propagate to the caller.
 */
export async function getWorkBySlug(slug) {
  const supabase = getSupabase();
  if (!supabase || !slug) return null;

  const { data, error } = await supabase
    .from("works")
    .select(WORK_COLUMNS.join(","))
    .is("deleted_at", null)
    .eq("status", "published")
    .eq("slug", slug)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return mapWork(data);
}