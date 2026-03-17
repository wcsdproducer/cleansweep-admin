
"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Users,
  Database,
  Sparkles,
  Activity,
  LogOut,
  CheckCircle2,
  UserCircle,
  Palette,
  Settings,
  Briefcase,
  Map
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigationItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Service Coverage", icon: Map, href: "/coverage" },
  { name: "Customers", icon: UserCircle, href: "/customers" },
  { name: "Service Providers", icon: Briefcase, href: "/service-providers" },
  { name: "Users", icon: Users, href: "/users" },
  { name: "Data Explorer", icon: Database, href: "/database" },
  { name: "AI Summary", icon: Sparkles, href: "/ai-summary" },
  { name: "Monitoring", icon: Activity, href: "/monitoring" },
]

const settingsItems = [
  { name: "Settings", icon: Settings, href: "/settings" },
  { name: "Style Guide", icon: Palette, href: "/style-guide" },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border shadow-xl">
      <SidebarHeader className="h-20 flex items-center px-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-primary to-accent rounded-xl p-2.5 shadow-xl shadow-primary/20">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-headline font-black text-2xl leading-none tracking-tight text-white italic">
              Clean<span className="text-accent">Sweep</span>
            </span>
            <span className="text-[8px] uppercase tracking-[0.3em] opacity-60 font-bold mt-1 text-white">
              Admin Vault
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator className="opacity-10" />
      <SidebarContent className="p-3 flex flex-col justify-between">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/40 px-2 py-4">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.name} className="mb-1">
                  <SidebarMenuButton
                    asChild
                    isActive={mounted && pathname === item.href}
                    tooltip={item.name}
                    className="transition-all duration-200 hover:scale-[1.02] data-[active=true]:bg-accent data-[active=true]:text-white text-white/80"
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className={`w-5 h-5 ${mounted && pathname === item.href ? 'text-white' : 'text-accent'}`} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-white/40 px-2 py-4">Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.name} className="mb-1">
                  <SidebarMenuButton
                    asChild
                    isActive={mounted && pathname === item.href}
                    tooltip={item.name}
                    className="transition-all duration-200 hover:scale-[1.02] data-[active=true]:bg-accent data-[active=true]:text-white text-white/80"
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className={`w-5 h-5 ${mounted && pathname === item.href ? 'text-white' : 'text-accent'}`} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator className="opacity-10" />
      <SidebarFooter className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Sign Out" className="text-destructive hover:text-white hover:bg-destructive transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
