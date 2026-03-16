"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Database, Filter, Download, RefreshCw, Pencil, Trash } from "lucide-react"
import { Input } from "@/components/ui/input"

const TABLES = ["projects", "users", "sessions", "logs", "billing"]

const MOCK_DATA: Record<string, any[]> = {
  projects: [
    { id: 1, title: "Vault Alpha", slug: "vault-alpha", created_at: "2024-01-01" },
    { id: 2, title: "Nexus Beta", slug: "nexus-beta", created_at: "2024-01-15" },
    { id: 3, title: "Core Omega", slug: "core-omega", created_at: "2024-02-10" },
  ],
  users: [
    { id: 101, username: "admin_vault", email: "admin@vault.com", last_login: "2024-03-15" },
    { id: 102, username: "dev_user", email: "dev@vault.com", last_login: "2024-03-14" },
  ]
}

export default function DatabasePage() {
  const [selectedTable, setSelectedTable] = React.useState("projects")
  const currentData = MOCK_DATA[selectedTable] || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Data Explorer</h1>
          <p className="text-muted-foreground">Direct access to 'studio-3673070449-f277c' database tables</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" /> Export JSON
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b bg-muted/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Database className="w-5 h-5 text-primary" />
              <Select value={selectedTable} onValueChange={setSelectedTable}>
                <SelectTrigger className="w-[200px] bg-white">
                  <SelectValue placeholder="Select table" />
                </SelectTrigger>
                <SelectContent>
                  {TABLES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Filter results..." className="pl-10 h-9 w-[250px] bg-white" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {currentData.length > 0 && Object.keys(currentData[0]).map(key => (
                    <TableHead key={key} className="capitalize font-mono text-xs">{key}</TableHead>
                  ))}
                  <TableHead className="text-right">Manage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((row, i) => (
                  <TableRow key={i}>
                    {Object.values(row).map((val, j) => (
                      <TableCell key={j} className="text-sm truncate max-w-[200px]">
                        {String(val)}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {currentData.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No records found in table '{selectedTable}'</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <p>Showing {currentData.length} records</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>
    </div>
  )
}