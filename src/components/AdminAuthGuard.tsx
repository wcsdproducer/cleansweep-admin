"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useUser } from "@/firebase"

/**
 * Wraps all admin pages that require authentication.
 * Redirects to /login if the user is not signed in.
 * Skips the guard on the /login route itself.
 */
export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser()
  const router = useRouter()
  const pathname = usePathname()

  const isLoginPage = pathname === "/login"

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.replace("/login")
    }
  }, [user, loading, isLoginPage, router])

  // On the login page, always render (unauthenticated)
  if (isLoginPage) return <>{children}</>

  // While Firebase resolves auth state, show nothing (prevents flash of protected content)
  if (loading || !user) return null

  return <>{children}</>
}
