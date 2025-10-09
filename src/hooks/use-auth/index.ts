'use client'

import { supabase } from '@/libs/supabase/client'

function useAuth() {
  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return { signOut }
}

export { useAuth }
