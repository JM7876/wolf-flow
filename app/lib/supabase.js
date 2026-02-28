/* ═══════════════════════════════════════════════════════════
   WOLF FLOW SOLUTIONS — Supabase Client
   ─────────────────────────────────────────────────────────
   Single client instance for all portal services.
   Created and Authored by Johnathon Moulds © 2026
   ═══════════════════════════════════════════════════════════ */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wirwgiupcbabkbrgchki.supabase.co';
const supabaseKey = 'sb_publishable_HnRJF4Sljze02yYYGrG-Yw_lGJV_dUZ';

export const supabase = createClient(supabaseUrl, supabaseKey);
