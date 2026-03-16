"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Activity, 
  ShieldCheck, 
  Database, 
  Zap, 
  Globe, 
  Cpu, 
  HardDrive,
  RefreshCcw,
  CheckCircle2
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function MonitoringPage() {
  const [uptime, setUptime] = React.useState(99.98)
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">System Monitoring</h1>
          <p className="text-muted-foreground">StudioVault Database Connection Status</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-3 py-1 text-sm">
            <CheckCircle2 className="w-3 h-3 mr-2" />
            All Connections Stable
          </Badge>
          <Button variant="outline" size="icon">
            <RefreshCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Database className="w-24 h-24" />
          </div>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Primary Database</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold">Connected</span>
              <span className="text-green-500 font-semibold text-sm flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Live
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span>Load Level</span>
                <span>24%</span>
              </div>
              <Progress value={24} className="h-1.5" />
            </div>
            <p className="text-xs text-muted-foreground">Instance: studio-3673070449-f277c</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Zap className="w-24 h-24" />
          </div>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Response Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold">18ms</span>
              <span className="text-accent font-semibold text-sm flex items-center gap-1">
                Excellent
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span>Peak Latency (24h)</span>
                <span>142ms</span>
              </div>
              <Progress value={15} className="h-1.5" />
            </div>
            <p className="text-xs text-muted-foreground">Region: us-east-1 (Cloud)</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldCheck className="w-24 h-24" />
          </div>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">System Uptime</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold">{uptime}%</span>
              <span className="text-green-500 font-semibold text-sm flex items-center gap-1">
                Normal
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span>Target SLA</span>
                <span>99.9%</span>
              </div>
              <Progress value={99} className="h-1.5" />
            </div>
            <p className="text-xs text-muted-foreground">Last downtime: 18 days ago</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-accent" />
              Regional Health
            </CardTitle>
            <CardDescription>Database latency across global regions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "North America (East)", status: "Optimal", ping: "12ms" },
                { name: "North America (West)", status: "Optimal", ping: "45ms" },
                { name: "Europe (Central)", status: "Good", ping: "88ms" },
                { name: "Asia Pacific (Tokyo)", status: "Fair", ping: "192ms" },
              ].map((region, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${region.status === 'Optimal' ? 'bg-green-500' : 'bg-amber-500'}`} />
                    <span className="text-sm font-medium">{region.name}</span>
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">{region.ping}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              System Resource Usage
            </CardTitle>
            <CardDescription>Current hardware utilization metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-muted-foreground" />
                  <span>CPU Utilization</span>
                </div>
                <span className="font-semibold">32%</span>
              </div>
              <Progress value={32} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-muted-foreground" />
                  <span>Memory Usage</span>
                </div>
                <span className="font-semibold">6.2GB / 16GB</span>
              </div>
              <Progress value={40} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-muted-foreground" />
                  <span>Storage Used</span>
                </div>
                <span className="font-semibold">842GB / 2TB</span>
              </div>
              <Progress value={42} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Button({ children, ...props }: any) {
  return (
    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2" {...props}>
      {children}
    </button>
  )
}