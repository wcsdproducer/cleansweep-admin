
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
  Loader2,
  Star,
  ShieldCheck,
  Filter
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useFirestore, useCollection } from "@/firebase"
import { collection, query, orderBy, doc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore"
import { useMemoFirebase } from "@/firebase/firestore/use-memo-firebase"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"

export default function ServiceProvidersPage() {
  const { toast } = useToast()
  const [search, setSearch] = React.useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [newProvider, setNewProvider] = React.useState({ 
    name: "", 
    email: "", 
    phone: "", 
    category: "Residential" 
  })
  const firestore = useFirestore()

  const providersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "serviceProviders"), orderBy("name", "asc"));
  }, [firestore]);

  const { data: providers, loading } = useCollection(providersQuery);

  const filtered = React.useMemo(() => {
    if (!providers) return [];
    return providers.filter(p => 
      p.name?.toLowerCase().includes(search.toLowerCase()) || 
      p.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
    )
  }, [providers, search]);

  const handleDelete = (providerId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, "serviceProviders", providerId);
    
    deleteDoc(docRef).catch(async () => {
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
    });

    toast({
      title: "Action Initiated",
      description: "Delete request sent to the database.",
    })
  }

  const handleAddProvider = () => {
    if (!firestore) return;
    if (!newProvider.name || !newProvider.email || !newProvider.category) {
      toast({ title: "Error", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    const colRef = collection(firestore, "serviceProviders");
    const data = {
      ...newProvider,
      status: "Pending",
      rating: 5.0,
      joinedDate: new Date().toISOString(),
      createdAt: serverTimestamp(),
    };

    addDoc(colRef, data).catch(async () => {
      const permissionError = new FirestorePermissionError({
        path: colRef.path,
        operation: 'create',
        requestResourceData: data,
      });
      errorEmitter.emit('permission-error', permissionError);
    });

    setIsAddDialogOpen(false);
    setNewProvider({ name: "", email: "", phone: "", category: "Residential" });
    toast({
      title: "Action Initiated",
      description: "Provider registration request sent.",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Service Providers</h1>
          <p className="text-muted-foreground">Manage your cleaning professionals and contractors</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Provider
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register New Provider</DialogTitle>
              <DialogDescription>
                Onboard a new service professional to the CleanSweep network.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input 
                  id="name" 
                  value={newProvider.name} 
                  onChange={(e) => setNewProvider(prev => ({ ...prev, name: e.target.value }))}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={newProvider.email} 
                  onChange={(e) => setNewProvider(prev => ({ ...prev, email: e.target.value }))}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Phone</Label>
                <Input 
                  id="phone" 
                  value={newProvider.phone} 
                  onChange={(e) => setNewProvider(prev => ({ ...prev, phone: e.target.value }))}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category</Label>
                <Select 
                  value={newProvider.category} 
                  onValueChange={(val) => setNewProvider(prev => ({ ...prev, category: val }))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Residential">Residential</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Deep Clean">Deep Clean</SelectItem>
                    <SelectItem value="Industrial">Industrial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddProvider} className="bg-primary text-white">Register</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search providers..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-muted-foreground animate-pulse">Syncing provider network...</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length > 0 ? filtered.map((provider: any) => (
                <TableRow key={provider.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{provider.name}</span>
                      <span className="text-xs text-muted-foreground">{provider.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-medium">
                      {provider.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        provider.status === 'Active' ? 'bg-green-500' : 
                        provider.status === 'Pending' ? 'bg-amber-500' : 'bg-gray-400'
                      }`} />
                      <span className="text-sm">{provider.status || 'Active'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-bold text-foreground">{provider.rating?.toFixed(1) || '5.0'}</span>
                    </div>
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
                          <ShieldCheck className="w-4 h-4" /> Verify Credentials
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="gap-2 text-destructive"
                          onClick={() => handleDelete(provider.id)}
                        >
                          <Trash2 className="w-4 h-4" /> Terminate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    No service providers matching your criteria.
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
