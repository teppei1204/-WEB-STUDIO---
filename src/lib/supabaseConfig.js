/**
 * Supabase connection settings — WEB STUDIO KABUKI
 *
 * The anon key is PUBLIC by design: access control is enforced by Row Level
 * Security on the Supabase side, never by hiding this key.
 *
 * Two ways to provide the values:
 * 1. Base44 preview: paste the Project URL and the "anon public" key below
 *    (Supabase Dashboard → Project Settings → API).
 * 2. Cloudflare Pages build: set VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
 *    as build environment variables — the placeholders below are then ignored.
 */
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://oopxzzraiecqphmggrrx.supabase.co";

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_1HRqlvJD81WOwoyrE56j-A_4US4mnsP";

/** True when real credentials are present (used to skip Supabase calls gracefully). */
export const isSupabaseConfigured =
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("YOUR_PROJECT_ID") &&
  !SUPABASE_ANON_KEY.startsWith("YOUR_");