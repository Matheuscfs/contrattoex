import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { type Session } from '@supabase/auth-helpers-nextjs'

export async function auth(): Promise<Session | null> {
  const supabase = createClientComponentClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function signOut() {
  const supabase = createClientComponentClient()
  await supabase.auth.signOut()
} 