'use client'

import { Provider } from '@supabase/supabase-js'

import { supabase } from '@/libs/supabase/client'

export function useAuth() {
  async function signInWithProvider(provider: Provider) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${process.env.NEXT_PUBLIC_PROJECT_URL}/confirm-signup?oauth=${provider}` }
    })
    if (error) throw error
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return { signInWithProvider, signOut }
}
