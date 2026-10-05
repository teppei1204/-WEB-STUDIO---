import { createClient } from "@supabase/supabase-js";
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  isSupabaseConfigured,
} from "./supabaseConfig";

let client = null;

/**
 * Returns the shared Supabase browser client, or null when credentials are
 * not configured yet. Callers fall back to the legacy Base44 data source
 * while the migration is in progress — nothing breaks in the preview.
 */
export function getSupabase() {
  if (!client) {
    if (!isSupabaseConfigured) return null;
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return client;
}