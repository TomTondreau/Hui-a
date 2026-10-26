import { createClient } from "@supabase/supabase-js";

// Retrieve Supabase environment variables
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || "";

// Check if credentials are set, otherwise fallback to local-only mode
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (isSupabaseConfigured) {
  console.log("Supabase client initialized successfully.");
} else {
  console.log("Supabase credentials missing. Activating automated 'LocalStorage' fallback backup mode.");
}
