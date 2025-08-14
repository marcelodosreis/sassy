'use client'

import { supabase } from '@/libs/supabase/client'

export function useAuth() {
  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return { signOut }
}
