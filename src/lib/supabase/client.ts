import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function createClient() {
  return createClientComponentClient({
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
    options: {
      global: {
        headers: {
          'X-Client-Info': 'supabase-js/2.38.4',
          'Accept': '*/*',
          'Content-Type': 'application/json'
        }
      }
    }
  })
} 