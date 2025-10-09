import { NextResponse, type NextRequest } from 'next/server'

import { createServerClient } from '@supabase/ssr'

async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

 createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )


  return supabaseResponse
}

export { updateSession }