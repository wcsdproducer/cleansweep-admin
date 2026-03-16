"use client"

import * as React from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Search, 
  UserPlus, 
  Shield, 
  ShieldCheck, 
  MoreHorizontal,
  Mail
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

const MOCK_USERS = [
  { name: "Sarah Connor", email: "s.connor@example.com", role: "Super Admin", status: "Online", avatar: "1" },
  { name: "John Doe", email: "john@example.com", role: "Developer", status: "Offline", avatar: "2" },
  { name: "Ellen Ripley", email: "ripley@nostromo.com", role: "Manager", status: "Online", avatar: "3" },
  { name: "Arthur Dent", email: "tea@galaxy.com", role: "Viewer", status: "Away", avatar: "4" },
  { name: "T-800", email: "cyberdyne@future.com", role: "Security", status: "Online", avatar: "5" },
]

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">User Management</h1>
          <p className="text-muted-foreground">Control access and permissions for your team</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <UserPlus className="w-4 h-4 mr-2" />
          Invite User
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name or email..." className="pl-10" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          <Button variant="outline" size="sm" className="whitespace-nowrap">All Roles</Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">Admins</Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">Developers</Button>
        </div>
      </div>

      <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[300px]">User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_USERS.map((user) => (
              <TableRow key={user.email}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`https://picsum.photos/seed/${user.avatar}/40/40`} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {user.role === 'Super Admin' ? (
                      <ShieldCheck className="w-4 h-4 text-primary" />
                    ) : (
                      <Shield className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="text-sm">{user.role}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      user.status === 'Online' ? 'bg-green-500' : 
                      user.status === 'Away' ? 'bg-amber-500' : 'bg-gray-400'
                    }`} />
                    <span className="text-sm">{user.status}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">Mar 2024</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2">
                        <Mail className="w-4 h-4" /> Message
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Shield className="w-4 h-4" /> Change Role
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2 text-destructive">
                        Revoke Access
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}