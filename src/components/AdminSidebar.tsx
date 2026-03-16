"use client"

import * as React from "react"
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Database,
  Sparkles,
  Activity,
  Settings,
  LogOut,
  ShieldCheck,
  CheckCircle2
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
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigationItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Projects", icon: FolderKanban, href: "/projects" },
  { name: "Users", icon: Users, href: "/users" },
  { name: "Data Explorer", icon: Database, href: "/database" },
  { name: "AI Summary", icon: Sparkles, href: "/ai-summary" },
  { name: "Monitoring", icon: Activity, href: "/monitoring" },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border shadow-xl">
      <SidebarHeader className="h-20 flex items-center px-6">
        <div className="flex items-center gap-3">
          <div className="bg-accent rounded-full p-2.5 shadow-lg shadow-accent/20">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-headline font-bold text-xl leading-none">
              CleanSweep
            </span>
            <span className="text-[10px] uppercase tracking-widest opacity-70 font-semibold mt-1">
              Admin Vault
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator className="opacity-20" />
      <SidebarContent className="p-3">
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.name} className="mb-1">
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.name}
                className="transition-all duration-200 hover:scale-[1.02]"
              >
                <Link href={item.href} className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator className="opacity-20" />
      <SidebarFooter className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings" className="opacity-80 hover:opacity-100">
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Sign Out" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}