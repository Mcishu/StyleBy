import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * `null` when Supabase isn't configured. The closet store falls back to
 * localStorage in that case, so the app still works without a project set up.
 */
export const supabase = url && anonKey ? createClient(url, anonKey) : null

if (!supabase) {
  console.warn(
    '[StyleBy] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY not set — closet data will be stored in this browser only (localStorage).',
  )
}
