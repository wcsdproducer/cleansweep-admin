
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
  UserPlus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ExternalLink,
  Loader2,
  Award
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useFirestore, useCollection } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"
import { useMemoFirebase } from "@/firebase/firestore/use-memo-firebase"

export default function CustomersPage() {
  const { toast } = useToast()
  const [search, setSearch] = React.useState("")
  const firestore = useFirestore()

  const customersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "customers"), orderBy("lastName", "asc"));
  }, [firestore]);

  const { data: customers, loading } = useCollection(customersQuery);

  const filtered = React.useMemo(() => {
    if (!customers) return [];
    return customers.filter(c => 
      c.firstName?.toLowerCase().includes(search.toLowerCase()) || 
      c.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
    )
  }, [customers, search]);

  const handleDelete = (id: string) => {
    toast({
      title: "Customer Deleted",
      description: `Customer ${id} has been successfully removed from the database.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Customer Management</h1>
          <p className="text-muted-foreground">View and manage CleanSweep customer profiles</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search customers..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-muted-foreground animate-pulse">Fetching customer data...</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Loyalty Credits</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length > 0 ? filtered.map((customer: any) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    {customer.firstName} {customer.lastName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1 bg-primary/5 text-primary border-primary/20">
                      <Award className="w-3 h-3" />
                      {customer.loyaltyCredits || 0}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {customer.registrationDate ? new Date(customer.registrationDate).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Edit2 className="w-4 h-4" /> Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <ExternalLink className="w-4 h-4" /> View History
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="gap-2 text-destructive"
                          onClick={() => handleDelete(customer.id)}
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    No customers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
