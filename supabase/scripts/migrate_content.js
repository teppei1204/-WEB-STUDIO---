/**
 * ============================================================
 * WEB STUDIO KABUKI — Content Migration Script (Base44 → Supabase)
 * ============================================================
 *
 * Migrates:
 *   Base44 BlogPost (4) → Supabase public.posts
 *   Base44 Work     (3) → Supabase public.works
 *   ~8 images         → Supabase Storage buckets (posts / works)
 *
 * SAFETY:
 *   - Does NOT delete or modify any Base44 data (read-only).
 *   - Does NOT run DELETE / TRUNCATE / DROP on Supabase.
 *   - Idempotent: checks legacy_id before insert; skips already-migrated rows.
 *   - Image uploads use upsert (x-upsert: true) — overwrites binary only,
 *     never deletes other files.
 *
 * RUN VIA: exec_tool (Node sandbox). `base44` is pre-initialized.
 * REQUIRED SECRET: process.env.SUPABASE_SERVICE_ROLE_KEY
 *   (set via Base44 secrets — Dashboard → Settings → API → service_role)
 *
 * TIMEOUT: set exec_tool timeout to 120s (8 image downloads + uploads + 7 inserts).
 * ============================================================
 */

const SUPABASE_URL = "https://oopxzzraiecqphmggrrx.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_KEY) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY is not set. Add it via the app's secrets before running."
  );
}

// ──────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────

/** Supabase REST headers (service role bypasses RLS). */
function sbHeaders(extra = {}) {
  return {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

/** Check whether a row with this legacy_id already exists (idempotency guard). */
async function legacyIdExists(table, legacyId) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?legacy_id=eq.${encodeURIComponent(
    legacyId
  )}&select=id&limit=1`;
  const res = await fetch(url, { headers: sbHeaders() });
  if (!res.ok) throw new Error(`Existence check failed (${table}): ${res.status}`);
  const rows = await res.json();
  return Array.isArray(rows) && rows.length > 0;
}

/** Insert a row and return the created record. */
async function sbInsert(table, row) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: sbHeaders({ Prefer: "return=representation" }),
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Insert ${table} failed (${res.status}): ${detail}`);
  }
  const data = await res.json();
  return data[0];
}

/** Fetch all categories as a { slug: id } map (for BlogPost → posts.category_id). */
async function fetchCategoryMap() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/categories?select=id,slug`,
    { headers: sbHeaders() }
  );
  if (!res.ok) throw new Error(`Category fetch failed: ${res.status}`);
  const rows = await res.json();
  const map = {};
  rows.forEach((r) => {
    map[r.slug] = r.id;
  });
  return map;
}

/** Extract file extension from a URL (strips Wix /v1/ transforms + query), fallback to MIME. */
function getExt(url, contentType) {
  try {
    const u = new URL(url);
    const v1 = u.pathname.indexOf("/v1/");
    const path = v1 === -1 ? u.pathname : u.pathname.slice(0, v1);
    const filename = path.split("/").pop();
    const ext = filename.split(".").pop();
    if (ext && ext !== filename && ext.length <= 5 && /^[a-z0-9]+$/i.test(ext)) {
      return ext.toLowerCase();
    }
  } catch {
    /* ignore */
  }
  const mimeMap = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
  };
  return mimeMap[(contentType || "").toLowerCase()] || "jpg";
}

/** Download an image from any URL → { buffer: ArrayBuffer, contentType: string }. */
async function downloadImage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed (${res.status}): ${url}`);
  const buffer = await res.arrayBuffer();
  const contentType = res.headers.get("content-type") || "image/jpeg";
  return { buffer, contentType };
}

/** Upload (upsert) an image to Supabase Storage. Returns the public URL. */
async function uploadImage(bucket, path, buffer, contentType) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": contentType,
      "x-upsert": "true",
    },
    body: buffer,
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Upload ${bucket}/${path} failed (${res.status}): ${detail}`);
  }
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

/** Download + upload one image. Returns the new Supabase public URL (or null). */
async function migrateImage(sourceUrl, bucket, slug) {
  if (!sourceUrl) return null;
  const { buffer, contentType } = await downloadImage(sourceUrl);
  const ext = getExt(sourceUrl, contentType);
  const path = `legacy/${slug}.${ext}`;
  return uploadImage(bucket, path, buffer, contentType);
}

// ──────────────────────────────────────────────────────────
// Migrate BlogPost → posts
// ──────────────────────────────────────────────────────────
async function migratePosts(categoryMap) {
  const report = { migrated: [], skipped: [], failed: [] };

  // Read-only from Base44 — no writes, no deletes.
  const blogPosts = await base44.entities.BlogPost.list();

  for (const bp of blogPosts) {
    const label = `${bp.slug || bp.id}`;
    try {
      // Idempotency: skip if already migrated
      if (await legacyIdExists("posts", bp.id)) {
        report.skipped.push({ legacy_id: bp.id, slug: bp.slug, reason: "already migrated" });
        continue;
      }

      // Image migration: eyecatch_image → posts bucket
      const thumbnailUrl = await migrateImage(
        bp.eyecatch_image,
        "posts",
        bp.slug
      );

      // Data mapping
      const row = {
        title: bp.title,
        slug: bp.slug,
        excerpt: bp.excerpt || null,
        content: bp.content,
        thumbnail_url: thumbnailUrl,
        category_id: categoryMap[(bp.category || "").toLowerCase()] || null,
        legacy_category: bp.category || null,
        tags: bp.tags || [],
        author_name: bp.author || "蕪木鉄平",
        author_id: null, // no profile yet; set later when admin signs up
        featured: bp.featured || false,
        status: "published",
        published_at: bp.published_date || null,
        legacy_id: bp.id,
      };

      const created = await sbInsert("posts", row);
      report.migrated.push({
        legacy_id: bp.id,
        slug: bp.slug,
        new_id: created.id,
        image: thumbnailUrl ? "migrated" : "none",
      });
    } catch (e) {
      report.failed.push({ legacy_id: bp.id, slug: bp.slug, error: e.message });
    }
  }

  return report;
}

// ──────────────────────────────────────────────────────────
// Migrate Work → works
// ──────────────────────────────────────────────────────────
async function migrateWorks() {
  const report = { migrated: [], skipped: [], failed: [] };

  const works = await base44.entities.Work.list();

  for (const w of works) {
    try {
      if (await legacyIdExists("works", w.id)) {
        report.skipped.push({ legacy_id: w.id, slug: w.slug, reason: "already migrated" });
        continue;
      }

      const imageUrl = await migrateImage(
        w.thumbnail_image,
        "works",
        w.slug
      );

      const row = {
        title: w.title,
        slug: w.slug,
        summary: w.summary,
        description: w.overview || null,
        highlights: w.highlights || null,
        image_url: imageUrl,
        project_url: null,
        github_url: null,
        technologies: w.technologies || [],
        duration: w.period || null,
        purpose: w.purpose || null,
        role: w.role || null,
        result: null,
        category: w.category || null,
        is_self_made: w.is_self_made || false,
        display_order: w.display_order || 0,
        status: "published",
        published_at: w.published_date || null,
        legacy_id: w.id,
      };

      const created = await sbInsert("works", row);
      report.migrated.push({
        legacy_id: w.id,
        slug: w.slug,
        new_id: created.id,
        image: imageUrl ? "migrated" : "none",
      });
    } catch (e) {
      report.failed.push({ legacy_id: w.id, slug: w.slug, error: e.message });
    }
  }

  return report;
}

// ──────────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────────
async function main() {
  // Pre-flight: verify Supabase is reachable
  const ping = await fetch(`${SUPABASE_URL}/rest/v1/categories?select=id&limit=1`, {
    headers: sbHeaders(),
  });
  if (!ping.ok) throw new Error(`Supabase unreachable (${ping.status}). Check SERVICE_KEY.`);

  // Pre-flight: verify Base44 entities are accessible
  const [bpCount, wCount] = await Promise.all([
    base44.entities.BlogPost.list().then((r) => r.length),
    base44.entities.Work.list().then((r) => r.length),
  ]);

  const categoryMap = await fetchCategoryMap();

  const postsReport = await migratePosts(categoryMap);
  const worksReport = await migrateWorks();

  return {
    preflight: {
      supabase_reachable: true,
      base44_blogposts: bpCount,
      base44_works: wCount,
      categories_found: Object.keys(categoryMap),
    },
    posts: postsReport,
    works: worksReport,
    summary: {
      posts_migrated: postsReport.migrated.length,
      posts_skipped: postsReport.skipped.length,
      posts_failed: postsReport.failed.length,
      works_migrated: worksReport.migrated.length,
      works_skipped: worksReport.skipped.length,
      works_failed: worksReport.failed.length,
    },
  };
}

return main();