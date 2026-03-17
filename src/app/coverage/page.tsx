"use client"

import * as React from "react"
import { Loader2, Map as MapIcon, Filter, Search, Target, Users, AlertTriangle, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, serverTimestamp, addDoc } from "firebase/firestore"
import { Loader } from "@googlemaps/js-api-loader"
import { useToast } from "@/hooks/use-toast"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"

const MAP_STYLE_SILVER = [
  { "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#f5f5f5" }] },
  { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [{ "color": "#bdbdbd" }] },
  { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#eeeeee" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#c9c9c9" }] }
]

export default function CoveragePage() {
  const [map, setMap] = React.useState<google.maps.Map | null>(null)
  const [googleLoaded, setGoogleLoaded] = React.useState(false)
  const [googleError, setGoogleError] = React.useState<string | null>(null)
  const [address, setAddress] = React.useState("")
  const [filterType, setFilterType] = React.useState("All")
  const [selectedPointProviders, setSelectedPointProviders] = React.useState<any[]>([])
  const [clickedCoord, setClickedCoord] = React.useState<{lat: number, lng: number} | null>(null)
  const [isSaving, setIsSaving] = React.useState(false)
  
  const mapRef = React.useRef<HTMLDivElement>(null)
  const firestore = useFirestore()
  const { toast } = useToast()
  
  const providersRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, "serviceProviders");
  }, [firestore]);

  const { data: providers, loading: providersLoading } = useCollection<any>(providersRef);

  React.useEffect(() => {
    const apiKey = "AIzaSyCSPFEkDyRV8L3OzROcizzb6TBwv8m3zPc";
    
    const loader = new Loader({
      apiKey: apiKey,
      version: "weekly",
      libraries: ["visualization", "geometry", "places"]
    })

    loader.load().then(() => {
      setGoogleLoaded(true)
      setGoogleError(null)
    }).catch((e) => {
      setGoogleError("API_ERROR")
    })
  }, [])

  React.useEffect(() => {
    if (googleLoaded && mapRef.current && !map) {
      try {
        const newMap = new google.maps.Map(mapRef.current, {
          center: { lat: 39.8283, lng: -98.5795 },
          zoom: 4,
          styles: MAP_STYLE_SILVER,
          disableDefaultUI: true,
          zoomControl: true,
        })

        newMap.addListener("click", (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            setClickedCoord({ lat: e.latLng.lat(), lng: e.latLng.lng() })
          }
        })

        setMap(newMap)
      } catch (err) {
        setGoogleError("INITIALIZATION_ERROR")
      }
    }
  }, [googleLoaded, map])

  const circlesRef = React.useRef<google.maps.Circle[]>([])
  const heatmapRef = React.useRef<google.maps.visualization.HeatmapLayer | null>(null)

  React.useEffect(() => {
    if (!map || !googleLoaded || providersLoading) return

    circlesRef.current.forEach(c => c.setMap(null))
    circlesRef.current = []
    if (heatmapRef.current) heatmapRef.current.setMap(null)

    const filtered = (providers || []).filter(p => filterType === "All" || p.category === filterType)
    const heatmapData: google.maps.LatLng[] = []

    filtered.forEach(p => {
      if (p.service_center?.lat && p.service_center?.lng) {
        const center = new google.maps.LatLng(p.service_center.lat, p.service_center.lng)
        const circle = new google.maps.Circle({
          strokeColor: "#42A4C2",
          strokeOpacity: 0.3,
          strokeWeight: 1,
          fillColor: "#42A4C2",
          fillOpacity: 0.1,
          map: map,
          center: center,
          radius: (p.radius_miles || 20) * 1609.34
        })
        circlesRef.current.push(circle)
        heatmapData.push(center)
      }
    })

    if (heatmapData.length > 0) {
      heatmapRef.current = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        map: map,
        radius: 50,
        opacity: 0.6,
      })
    }
  }, [map, googleLoaded, providers, providersLoading, filterType])

  React.useEffect(() => {
    if (!clickedCoord || providersLoading || !googleLoaded || !map) return

    const clickPoint = new google.maps.LatLng(clickedCoord.lat, clickedCoord.lng)
    const covering = (providers || []).filter(p => {
      if (!p.service_center?.lat || !p.service_center?.lng) return false
      const pCenter = new google.maps.LatLng(p.service_center.lat, p.service_center.lng)
      const distance = google.maps.geometry.spherical.computeDistanceBetween(clickPoint, pCenter)
      return distance <= (p.radius_miles || 20) * 1609.34
    })

    setSelectedPointProviders(covering)
  }, [clickedCoord, providers, providersLoading, googleLoaded, map])

  const handleSearch = () => {
    if (!map || !address || !googleLoaded) return
    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results?.[0]?.geometry?.location) {
        map.setCenter(results[0].geometry.location)
        map.setZoom(10)
      }
    })
  }

  const handleSaveCoverage = () => {
    if (!firestore || !clickedCoord) return;
    
    setIsSaving(true);
    const colRef = collection(firestore, "provider_coverage");
    const data = {
      center: clickedCoord,
      radius: 20,
      selectedZips: [],
      createdAt: serverTimestamp(),
    };

    addDoc(colRef, data)
      .then(() => {
        toast({ title: "Coverage Saved", description: "The defined service area has been persisted." });
      })
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: colRef.path,
          operation: 'create',
          requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => setIsSaving(false));
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-3">
            <MapIcon className="w-8 h-8 text-accent" />
            Service Coverage Dashboard
          </h1>
          <p className="text-muted-foreground">National supply-demand mapping and dead zone analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 gap-1 px-3 py-1">
            <Users className="w-4 h-4" />
            {providers?.length || 0} Active Providers
          </Badge>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        <div className="w-full lg:w-80 flex flex-col gap-6 overflow-y-auto">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Coverage Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Search Focus</label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="ZIP, City or State" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    disabled={!googleLoaded}
                  />
                  <Button size="icon" variant="secondary" onClick={handleSearch} disabled={!googleLoaded}>
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Service Type</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    <SelectItem value="Residential">Residential</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1 overflow-hidden flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Target className="w-4 h-4" />
                Coverage Analysis
              </CardTitle>
              <CardDescription className="text-[10px]">Click map to detect active providers</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-3">
                  {!clickedCoord ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
                      <Target className="w-10 h-10 mb-2" />
                      <p className="text-xs font-medium px-4">Click map to analyze local provider density.</p>
                    </div>
                  ) : (
                    <>
                      <div className="p-3 bg-secondary/20 rounded-lg border border-secondary text-center mb-4">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Selected Coordinate</p>
                        <p className="text-xs font-mono">{clickedCoord.lat.toFixed(4)}, {clickedCoord.lng.toFixed(4)}</p>
                        <Button 
                          className="mt-3 w-full bg-accent hover:bg-accent/90" 
                          size="sm" 
                          onClick={handleSaveCoverage}
                          disabled={isSaving}
                        >
                          {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3 mr-2" />}
                          Save Service Area
                        </Button>
                      </div>
                      
                      {selectedPointProviders.length > 0 ? (
                        selectedPointProviders.map(p => (
                          <div key={p.id} className="p-3 border rounded-lg hover:border-primary transition-all">
                            <div className="flex items-start justify-between mb-1">
                              <span className="text-sm font-bold">{p.name}</span>
                              <Badge variant="secondary" className="text-[9px] uppercase">{p.category}</Badge>
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              {p.radius_miles}mi Radius | Rating: {p.rating?.toFixed(1) || "5.0"}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-center">
                          <p className="text-sm font-bold">Dead Zone Detected</p>
                          <p className="text-[10px] opacity-80 mt-1">No coverage detected here.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <Card className="flex-1 relative overflow-hidden bg-muted/5 border-2">
          {googleError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 z-20 p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
              <h3 className="text-lg font-bold mb-2">Google Maps Activation Required</h3>
              <p className="text-sm text-muted-foreground max-w-md mb-6">
                The Google Maps JavaScript API has not been activated for this key. Please go to the Google Cloud Console and enable it.
              </p>
              <div className="grid gap-4 text-left bg-muted p-4 rounded-lg w-full max-w-sm">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs shrink-0">1</div>
                  <p className="text-xs font-medium">Go to <a href="https://console.cloud.google.com/" target="_blank" className="text-primary underline">Google Cloud Console</a></p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs shrink-0">2</div>
                  <p className="text-xs font-medium">Search for "Maps JavaScript API"</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs shrink-0">3</div>
                  <p className="text-xs font-medium">Click "Enable"</p>
                </div>
              </div>
            </div>
          ) : !googleLoaded ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/20 gap-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-sm font-bold text-muted-foreground">Loading Coverage Engine...</p>
            </div>
          ) : null}
          <div ref={mapRef} className={`w-full h-full ${!googleLoaded || googleError ? 'opacity-0' : 'opacity-100'}`} />
        </Card>
      </div>
    </div>
  )
}
