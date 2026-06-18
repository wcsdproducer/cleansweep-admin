"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useUser } from "@/firebase"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/AdminSidebar"

/**
 * AdminShell — wraps the entire admin app.
 *
 * On /login: renders children bare (no sidebar, no header).
 * On all other routes: enforces auth and renders the full sidebar shell.
 * If unauthenticated on a protected route, redirects to /login.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser()
  const router = useRouter()
  const pathname = usePathname()

  const isLoginPage = pathname === "/login"

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.replace("/login")
    }
  }, [user, loading, isLoginPage, router])

  // ── Login page: render bare, no sidebar ──────────────────────────────────
  if (isLoginPage) {
    return <>{children}</>
  }

  // ── Protected routes: hide everything while auth resolves ─────────────────
  if (loading || !user) return null

  // ── Authenticated: render full sidebar shell ──────────────────────────────
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6 bg-white/95 backdrop-blur-md sticky top-0 z-10 shadow-sm border-secondary">
          <SidebarTrigger className="-ml-1 text-primary hover:bg-secondary/20" />
          <div className="flex-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              CleanSweep Operations <span className="mx-2 opacity-30">|</span>{" "}
              <span className="text-primary font-bold">Admin Portal</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Secure Instance
            </div>
          </div>
        </header>
        <main className="p-6 md:p-10 bg-background/40">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
