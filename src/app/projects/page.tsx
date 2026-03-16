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
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ExternalLink 
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

const MOCK_PROJECTS = [
  { id: "PRJ-001", name: "Skyline Alpha", owner: "Sarah Connor", status: "Active", updated: "2024-03-15" },
  { id: "PRJ-002", name: "Deep Dive Analytics", owner: "John Doe", status: "Active", updated: "2024-03-14" },
  { id: "PRJ-003", name: "Project Phoenix", owner: "Ellen Ripley", status: "Archived", updated: "2024-02-28" },
  { id: "PRJ-004", name: "Green Field MVP", owner: "Arthur Dent", status: "Pending", updated: "2024-03-10" },
  { id: "PRJ-005", name: "Studio Core API", owner: "Admin", status: "Active", updated: "2024-03-15" },
]

export default function ProjectsPage() {
  const { toast } = useToast()
  const [search, setSearch] = React.useState("")

  const filtered = MOCK_PROJECTS.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.owner.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = (id: string) => {
    toast({
      title: "Project Deleted",
      description: `Project ${id} has been successfully removed from the database.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Project Management</h1>
          <p className="text-muted-foreground">Manage and monitor all workspace projects</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2" />
          Create New Project
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search projects..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-xl bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Project ID</TableHead>
              <TableHead>Project Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-mono text-xs">{project.id}</TableCell>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>{project.owner}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      project.status === 'Active' ? 'default' : 
                      project.status === 'Archived' ? 'secondary' : 'outline'
                    }
                    className={project.status === 'Active' ? 'bg-green-100 text-green-700' : ''}
                  >
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{project.updated}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2">
                        <Edit2 className="w-4 h-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <ExternalLink className="w-4 h-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="gap-2 text-destructive"
                        onClick={() => handleDelete(project.id)}
                      >
                        <Trash2 className="w-4 h-4" /> Delete
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