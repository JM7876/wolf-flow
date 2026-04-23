/* ================================================================
   WOLF FLOW SOLUTIONS — Supabase Client
   ----------------------------------------------------------------
   Single client instance for all portal services.
   Created and Authored by Johnathon Moulds © 2026
   ================================================================ */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
