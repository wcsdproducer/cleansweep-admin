
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
import { Database, Filter, Download, RefreshCw, Pencil, Trash, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useFirestore, useCollection } from "@/firebase"
import { collection, query, limit } from "firebase/firestore"
import { useMemoFirebase } from "@/firebase/firestore/use-memo-firebase"

// Ensure collection names match backend.json
const TABLES = ["customers", "users", "serviceProviders"]

export default function DatabasePage() {
  const [selectedTable, setSelectedTable] = React.useState("serviceProviders")
  const firestore = useFirestore()

  const dataQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    try {
      return query(collection(firestore, selectedTable), limit(50));
    } catch (e) {
      console.error("Database query failed:", e);
      return null;
    }
  }, [firestore, selectedTable]);

  const { data: currentData, loading } = useCollection(dataQuery);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Data Explorer</h1>
          <p className="text-muted-foreground">Direct access to live database collections</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" /> Export JSON
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
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
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Loading records from {selectedTable}...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {currentData && currentData.length > 0 ? (
                      Object.keys(currentData[0]).map(key => (
                        <TableHead key={key} className="capitalize font-mono text-xs">{key}</TableHead>
                      ))
                    ) : (
                      <TableHead>No Fields Found</TableHead>
                    )}
                    <TableHead className="text-right">Manage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData && currentData.map((row: any, i) => (
                    <TableRow key={row.id || i}>
                      {Object.values(row).map((val, j) => (
                        <TableCell key={j} className="text-sm truncate max-w-[200px]">
                          {typeof val === 'object' ? JSON.stringify(val) : String(val)}
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
          )}
          {!loading && (!currentData || currentData.length === 0) && (
            <div className="p-20 text-center">
              <div className="flex flex-col items-center gap-2 opacity-60">
                <Database className="w-10 h-10 mb-2" />
                <p className="text-muted-foreground">No records found in collection '{selectedTable}'</p>
                <p className="text-xs">Ensure data has been added through the management pages.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <p>Showing {currentData?.length || 0} records</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>
    </div>
  )
}
