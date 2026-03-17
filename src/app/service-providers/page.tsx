
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
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Loader2,
  Star,
  RefreshCcw,
  Plus,
  AlertCircle,
  MapPin,
  Ruler
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
import { collection, doc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore"
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
    category: "Residential",
    lat: "",
    lng: "",
    radius_miles: "20"
  })
  const firestore = useFirestore()

  const providersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, "serviceProviders");
  }, [firestore]);

  const { data: providers, loading, error } = useCollection(providersQuery);

  const filtered = React.useMemo(() => {
    if (!providers) return [];
    if (!search.trim()) return providers;
    
    const searchLower = search.toLowerCase();
    return providers.filter(p => {
      const name = String(p.name || "").toLowerCase();
      const email = String(p.email || "").toLowerCase();
      const category = String(p.category || "").toLowerCase();
      return name.includes(searchLower) || email.includes(searchLower) || category.includes(searchLower);
    });
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
      description: "Delete request sent.",
    })
  }

  const handleAddProvider = () => {
    if (!firestore) return;
    if (!newProvider.name || !newProvider.email) {
      toast({ title: "Validation Error", description: "Name and Email are required.", variant: "destructive" });
      return;
    }

    const colRef = collection(firestore, "serviceProviders");
    const data = {
      name: newProvider.name,
      email: newProvider.email,
      phone: newProvider.phone,
      category: newProvider.category,
      service_center: {
        lat: parseFloat(newProvider.lat) || 0,
        lng: parseFloat(newProvider.lng) || 0
      },
      radius_miles: parseFloat(newProvider.radius_miles) || 20,
      status: "Active",
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
    setNewProvider({ name: "", email: "", phone: "", category: "Residential", lat: "", lng: "", radius_miles: "20" });
    toast({
      title: "Success",
      description: "Provider creation initiated.",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Service Providers</h1>
          <p className="text-muted-foreground">Network management for cleaning professionals</p>
        </div>
        
        <div className="flex gap-2">
           <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Sync
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Provider
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Provider</DialogTitle>
                <DialogDescription>
                  Register a new professional and define their service area.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={newProvider.name} onChange={(e) => setNewProvider(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={newProvider.email} onChange={(e) => setNewProvider(p => ({ ...p, email: e.target.value }))} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={newProvider.category} onValueChange={(val) => setNewProvider(p => ({ ...p, category: val }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Residential">Residential</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="radius">Service Radius (Miles)</Label>
                    <div className="relative">
                      <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="radius" type="number" className="pl-10" value={newProvider.radius_miles} onChange={(e) => setNewProvider(p => ({ ...p, radius_miles: e.target.value }))} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lat">Center Latitude</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="lat" placeholder="e.g. 41.8781" className="pl-10" value={newProvider.lat} onChange={(e) => setNewProvider(p => ({ ...p, lat: e.target.value }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lng">Center Longitude</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="lng" placeholder="e.g. -87.6298" className="pl-10" value={newProvider.lng} onChange={(e) => setNewProvider(p => ({ ...p, lng: e.target.value }))} />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddProvider} className="bg-primary text-white">Save Provider</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">Error loading data: {error.message}</p>
        </div>
      )}

      <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-muted-foreground animate-pulse">Syncing service providers...</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Provider Details</TableHead>
                <TableHead>Location & Range</TableHead>
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
                      <span className="font-semibold text-sm">{provider.name || 'Unnamed'}</span>
                      <span className="text-xs text-muted-foreground">{provider.email || 'No email'}</span>
                      <Badge variant="secondary" className="w-fit mt-1 text-[10px] uppercase font-bold">{provider.category || 'Standard'}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs space-y-1">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {provider.service_center?.lat?.toFixed(4)}, {provider.service_center?.lng?.toFixed(4)}
                      </div>
                      <div className="flex items-center gap-1 font-medium">
                        <Ruler className="w-3 h-3 text-primary" />
                        {provider.radius_miles || 20} Mile Radius
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        provider.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      <span className="text-sm">{provider.status || 'Active'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-bold text-foreground">{Number(provider.rating || 5).toFixed(1)}</span>
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
                          <Edit2 className="w-4 h-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="gap-2 text-destructive"
                          onClick={() => handleDelete(provider.id)}
                        >
                          <Trash2 className="w-4 h-4" /> Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20">
                    <div className="flex flex-col items-center gap-2 opacity-60">
                      <p className="text-muted-foreground font-medium">No service providers listed yet.</p>
                      <p className="text-xs">Add your first professional using the button above.</p>
                    </div>
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
