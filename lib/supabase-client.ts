import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL as string
const serviceKey = process.env.SUPABASE_SERVICE_KEY as string

if (!url || !serviceKey) {
  console.warn('Supabase URL or SERVICE KEY missing. Server inserts will fail.')
}

export const supabaseServer = () => {
  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      detectSessionInUrl: false,
    },
  })
}
