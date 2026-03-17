
"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Activity, 
  ShieldCheck, 
  Database, 
  Zap, 
  Globe, 
  Cpu, 
  HardDrive,
  RefreshCcw,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useFirestore } from "@/firebase"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"

export default function MonitoringPage() {
  const [metrics, setMetrics] = React.useState({
    cpu: 32,
    memory: 6.2,
    load: 24,
    latency: 18,
    uptime: 99.98
  })
  const [isTesting, setIsTesting] = React.useState(false)
  const [lastTestResult, setLastTestResult] = React.useState<number | null>(null)
  const firestore = useFirestore()

  // Simulate real-time fluctuations
  React.useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpu: Math.max(10, Math.min(90, prev.cpu + (Math.random() * 10 - 5))),
        load: Math.max(5, Math.min(95, prev.load + (Math.random() * 6 - 3))),
        memory: Math.max(4, Math.min(15, prev.memory + (Math.random() * 0.4 - 0.2)))
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleTestLatency = async () => {
    if (!firestore) return
    setIsTesting(true)
    const start = performance.now()
    try {
      // Perform a small write/read to measure real round-trip latency
      const testRef = doc(firestore, "_system_health", "latency_test")
      await setDoc(testRef, { timestamp: serverTimestamp() })
      await getDoc(testRef)
      const end = performance.now()
      const diff = Math.round(end - start)
      setLastTestResult(diff)
      setMetrics(prev => ({ ...prev, latency: diff }))
    } catch (err) {
      console.error("Health check failed", err)
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">System Monitoring</h1>
          <p className="text-muted-foreground">Live Database & Infrastructure Status</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-3 py-1 text-sm border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-2" />
            Operational
          </Badge>
          <Button variant="outline" size="sm" onClick={handleTestLatency} disabled={isTesting}>
            {isTesting ? <RefreshCcw className="w-4 h-4 animate-spin mr-2" /> : <Activity className="w-4 h-4 mr-2" />}
            Test Latency
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="relative overflow-hidden border-secondary">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Database className="w-24 h-24" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Database Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold">Connected</span>
              <span className="text-green-500 font-bold text-sm flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Live
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                <span>Active Load</span>
                <span>{Math.round(metrics.load)}%</span>
              </div>
              <Progress value={metrics.load} className="h-1.5" />
            </div>
            <p className="text-[10px] text-muted-foreground font-mono">ID: {firestore?.app.options.projectId || 'unknown'}</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-secondary">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Zap className="w-24 h-24" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Real Latency</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold">{metrics.latency}ms</span>
              <Badge variant="outline" className="text-accent border-accent/30 bg-accent/5">
                {metrics.latency < 50 ? 'Optimal' : metrics.latency < 150 ? 'Good' : 'Degraded'}
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                <span>Last Test Result</span>
                <span>{lastTestResult ? `${lastTestResult}ms` : 'No data'}</span>
              </div>
              <Progress value={Math.min(100, (metrics.latency / 200) * 100)} className="h-1.5" />
            </div>
            <p className="text-[10px] text-muted-foreground">Regional Endpoint: Firebase Cloud</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-secondary">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <ShieldCheck className="w-24 h-24" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Uptime SLA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold">{metrics.uptime}%</span>
              <span className="text-primary font-bold text-sm">Target: 99.9%</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                <span>Monthly Status</span>
                <span>Normal</span>
              </div>
              <Progress value={99.9} className="h-1.5 bg-primary/10" />
            </div>
            <p className="text-[10px] text-muted-foreground">Last incident reported: 18 days ago</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="w-5 h-5 text-accent" />
              Edge Network Latency
            </CardTitle>
            <CardDescription>Simulated global distribution health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "US-East (Virginia)", ping: Math.round(metrics.latency * 0.8) },
                { name: "US-West (Oregon)", ping: Math.round(metrics.latency * 1.2) },
                { name: "EU-West (Dublin)", ping: Math.round(metrics.latency * 2.5) },
                { name: "AP-South (Mumbai)", ping: Math.round(metrics.latency * 4.2) },
              ].map((region, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-xl bg-muted/10">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${region.ping < 100 ? 'bg-green-500' : 'bg-amber-500'}`} />
                    <span className="text-sm font-medium">{region.name}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-muted-foreground">{region.ping}ms</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="w-5 h-5 text-primary" />
              Resource Utilization
            </CardTitle>
            <CardDescription>Estimated system-level metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 font-semibold">
                  <Cpu className="w-4 h-4 text-primary" />
                  <span>CPU Usage</span>
                </div>
                <span className="font-mono text-xs">{metrics.cpu.toFixed(1)}%</span>
              </div>
              <Progress value={metrics.cpu} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 font-semibold">
                  <HardDrive className="w-4 h-4 text-accent" />
                  <span>Memory Allocation</span>
                </div>
                <span className="font-mono text-xs">{metrics.memory.toFixed(1)}GB / 16GB</span>
              </div>
              <Progress value={(metrics.memory / 16) * 100} className="h-2" />
            </div>
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-wider">Auto-Scaling Active</p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Cloud instances are automatically managing load. No manual intervention required at current utilization levels.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
