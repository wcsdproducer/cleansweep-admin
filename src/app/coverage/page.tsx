
"use client"

import * as React from "react"
import { Loader2, Map as MapIcon, Filter, Search, Target, Users, AlertTriangle, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection } from "firebase/firestore"
import { Loader } from "@googlemaps/js-api-loader"

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
  
  const mapRef = React.useRef<HTMLDivElement>(null)
  const firestore = useFirestore()
  
  const providersRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, "serviceProviders");
  }, [firestore]);

  const { data: providers, loading: providersLoading } = useCollection<any>(providersRef);

  // Initialize Google Maps
  React.useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey || apiKey === "YOUR_API_KEY_HERE" || apiKey.trim() === "") {
      setGoogleError("API_KEY_MISSING");
      return;
    }

    const loader = new Loader({
      apiKey: apiKey,
      version: "weekly",
      libraries: ["visualization", "geometry", "places"]
    })

    loader.load().then(() => {
      setGoogleLoaded(true)
      setGoogleError(null)
    }).catch((e) => {
      console.error("Google Maps load error:", e)
      setGoogleError("LOAD_FAILED")
    })
  }, [])

  // Setup Map Instance
  React.useEffect(() => {
    if (googleLoaded && mapRef.current && !map) {
      const newMap = new google.maps.Map(mapRef.current, {
        center: { lat: 39.8283, lng: -98.5795 }, // Center of USA
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
    }
  }, [googleLoaded, map])

  // Render Overlays (Circles and Heatmap)
  const circlesRef = React.useRef<google.maps.Circle[]>([])
  const heatmapRef = React.useRef<google.maps.visualization.HeatmapLayer | null>(null)

  React.useEffect(() => {
    if (!map || !googleLoaded || providersLoading) return

    // Clear previous
    circlesRef.current.forEach(c => c.setMap(null))
    circlesRef.current = []
    if (heatmapRef.current) heatmapRef.current.setMap(null)

    const filtered = (providers || []).filter(p => filterType === "All" || p.category === filterType)
    const heatmapData: google.maps.LatLng[] = []

    filtered.forEach(p => {
      if (p.service_center?.lat && p.service_center?.lng) {
        const center = new google.maps.LatLng(p.service_center.lat, p.service_center.lng)
        
        // Add Circle
        const circle = new google.maps.Circle({
          strokeColor: "#42A4C2",
          strokeOpacity: 0.3,
          strokeWeight: 1,
          fillColor: "#42A4C2",
          fillOpacity: 0.1,
          map: map,
          center: center,
          radius: (p.radius_miles || 20) * 1609.34 // Miles to meters
        })
        circlesRef.current.push(circle)

        // Add to Heatmap
        heatmapData.push(center)
      }
    })

    // Create Heatmap
    heatmapRef.current = new google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      map: map,
      radius: 50,
      opacity: 0.6,
    })
  }, [map, googleLoaded, providers, providersLoading, filterType])

  // Handle Dead Zone Detection Logic
  React.useEffect(() => {
    if (!clickedCoord || providersLoading || !googleLoaded) return

    const clickPoint = new google.maps.LatLng(clickedCoord.lat, clickedCoord.lng)
    const covering = (providers || []).filter(p => {
      if (!p.service_center?.lat || !p.service_center?.lng) return false
      const pCenter = new google.maps.LatLng(p.service_center.lat, p.service_center.lng)
      const distance = google.maps.geometry.spherical.computeDistanceBetween(clickPoint, pCenter)
      return distance <= (p.radius_miles || 20) * 1609.34
    })

    setSelectedPointProviders(covering)
  }, [clickedCoord, providers, providersLoading, googleLoaded])

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

      {googleError === "API_KEY_MISSING" && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-bold">Google Maps API Key Required</AlertTitle>
          <AlertDescription className="space-y-4 pt-2">
            <p>To view the coverage map, you need a valid Google Maps JavaScript API key.</p>
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white border-destructive/20 hover:bg-destructive/5"
                onClick={() => window.open("https://console.cloud.google.com/google/maps-apis/credentials", "_blank")}
              >
                <ExternalLink className="w-3 h-3 mr-2" />
                Get API Key
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Sidebar Controls */}
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
                    <SelectItem value="Deep Clean">Deep Clean</SelectItem>
                    <SelectItem value="Industrial">Industrial</SelectItem>
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
                      <p className="text-xs font-medium px-4">Click any area on the map to analyze local provider density.</p>
                    </div>
                  ) : (
                    <>
                      <div className="p-3 bg-secondary/20 rounded-lg border border-secondary text-center mb-4">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Selected Coordinate</p>
                        <p className="text-xs font-mono">{clickedCoord.lat.toFixed(4)}, {clickedCoord.lng.toFixed(4)}</p>
                      </div>
                      
                      {selectedPointProviders.length > 0 ? (
                        selectedPointProviders.map(p => (
                          <div key={p.id} className="p-3 border rounded-lg hover:border-primary transition-all">
                            <div className="flex items-start justify-between mb-1">
                              <span className="text-sm font-bold">{p.name}</span>
                              <Badge variant="secondary" className="text-[9px] uppercase">{p.category}</Badge>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                              <span>{p.radius_miles}mi Radius</span>
                              <span className="opacity-30">|</span>
                              <span>Rating: {p.rating?.toFixed(1) || "5.0"}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-center">
                          <p className="text-sm font-bold">Dead Zone Detected</p>
                          <p className="text-[10px] opacity-80 mt-1">No providers cover this location. High recruitment priority.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Map Container */}
        <Card className="flex-1 relative overflow-hidden bg-muted/5 border-2">
          {!googleLoaded && !googleError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/20 gap-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-sm font-bold text-muted-foreground">Loading Coverage Engine...</p>
            </div>
          )}
          
          {googleError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-muted/5">
              <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                <MapIcon className="w-12 h-12 text-muted-foreground/40" />
              </div>
              <h3 className="text-lg font-bold text-muted-foreground">Map Unavailable</h3>
              <p className="text-sm text-muted-foreground max-w-xs mt-2">
                {googleError === "API_KEY_MISSING" 
                  ? "Configure your Google Maps API key to activate the spatial dashboard."
                  : "An error occurred while loading the map. Please check your API key and connection."}
              </p>
            </div>
          )}

          <div ref={mapRef} className={`w-full h-full ${!googleLoaded ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`} />

          {googleLoaded && (
            <div className="absolute bottom-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary/40 border border-primary" />
                <span className="text-xs font-bold text-muted-foreground">Service Radius</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-red-500" />
                <span className="text-xs font-bold text-muted-foreground">Provider Density</span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
