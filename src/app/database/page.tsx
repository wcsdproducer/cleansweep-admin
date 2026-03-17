
"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Database, RefreshCw, Trash, Loader2, AlertCircle } from "lucide-react"
import { useFirestore, useCollection } from "@/firebase"
import { collection, query, limit, doc, deleteDoc } from "firebase/firestore"
import { useMemoFirebase } from "@/firebase/firestore/use-memo-firebase"
import { useToast } from "@/hooks/use-toast"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"

const TABLES = ["customers", "users", "serviceProviders", "zip_codes", "provider_coverage"]

export default function DatabasePage() {
  const [selectedTable, setSelectedTable] = React.useState("serviceProviders")
  const firestore = useFirestore()
  const { toast } = useToast()

  const dataQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, selectedTable), limit(100));
  }, [firestore, selectedTable]);

  const { data: currentData, loading, error } = useCollection(dataQuery);

  const tableHeaders = React.useMemo(() => {
    if (!currentData || currentData.length === 0) return ["id"];
    const keys = new Set<string>();
    currentData.forEach(row => {
      Object.keys(row).forEach(key => keys.add(key));
    });
    return Array.from(keys);
  }, [currentData]);

  const handleDelete = (id: string) => {
    if (!firestore || !selectedTable) return;
    const docRef = doc(firestore, selectedTable, id);
    
    deleteDoc(docRef).catch(async () => {
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
    });

    toast({
      title: "Action Initiated",
      description: `Delete request for document ${id} sent to the database.`,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Data Explorer</h1>
          <p className="text-muted-foreground">Real-time inspection of your {selectedTable} collection</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" /> Force Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">Access Error: {error.message}</p>
        </div>
      )}

      <Card>
        <CardHeader className="border-b bg-muted/20 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Database className="w-5 h-5 text-primary" />
              <Select value={selectedTable} onValueChange={setSelectedTable}>
                <SelectTrigger className="w-[220px] bg-white">
                  <SelectValue placeholder="Select collection" />
                </SelectTrigger>
                <SelectContent>
                  {TABLES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground animate-pulse">Querying collection...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    {tableHeaders.map(header => (
                      <TableHead key={header} className="font-mono text-[10px] uppercase tracking-wider font-bold">
                        {header}
                      </TableHead>
                    ))}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData && currentData.length > 0 ? currentData.map((row: any, i) => (
                    <TableRow key={row.id || i} className="hover:bg-muted/10 transition-colors">
                      {tableHeaders.map(header => (
                        <TableCell key={`${i}-${header}`} className="text-xs font-mono truncate max-w-[150px]">
                          {row[header] !== undefined ? (
                            typeof row[header] === 'object' ? 
                              JSON.stringify(row[header]).substring(0, 50) + '...' : 
                              String(row[header])
                          ) : (
                            <span className="text-muted-foreground/30">null</span>
                          )}
                        </TableCell>
                      ))}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-destructive"
                            onClick={() => handleDelete(row.id)}
                          >
                            <Trash className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={tableHeaders.length + 1} className="py-24 text-center">
                        <div className="flex flex-col items-center gap-2 opacity-40">
                          <Database className="w-12 h-12 mb-2" />
                          <p className="text-sm font-medium">No records found in "{selectedTable}"</p>
                          <p className="text-xs">Data will appear here once added to the database.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
