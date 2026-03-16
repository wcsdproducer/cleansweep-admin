"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, 
  FolderKanban, 
  Database, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  Activity,
  CheckCircle2
} from "lucide-react"
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { name: "Mon", requests: 400, users: 240 },
  { name: "Tue", requests: 300, users: 139 },
  { name: "Wed", requests: 200, users: 980 },
  { name: "Thu", requests: 278, users: 390 },
  { name: "Fri", requests: 189, users: 480 },
  { name: "Sat", requests: 239, users: 380 },
  { name: "Sun", requests: 349, users: 430 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold font-headline text-foreground tracking-tight">System Status</h1>
        <p className="text-muted-foreground text-lg">Real-time metrics and operational overview for CleanSweep.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Jobs", value: "128", trend: "+12%", icon: FolderKanban, color: "text-primary" },
          { title: "Active Cleaners", value: "2,451", trend: "+4%", icon: Users, color: "text-accent" },
          { title: "Service Health", value: "99.9%", trend: "Stable", icon: CheckCircle2, color: "text-primary" },
          { title: "Avg. Response", value: "42ms", trend: "-5ms", icon: Activity, color: "text-accent" },
        ].map((stat, i) => (
          <Card key={i} className="hover:shadow-lg transition-all border-secondary bg-white overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
              <p className="text-xs font-semibold text-primary/80 mt-1">{stat.trend} from last period</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="md:col-span-2 border-secondary shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <TrendingUp className="w-5 h-5 text-primary" />
              Service Demand
            </CardTitle>
            <CardDescription>Job requests across the current week</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--secondary))" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'hsl(var(--secondary))', opacity: 0.3}}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border border-secondary rounded-xl shadow-xl">
                          <p className="font-bold text-primary">{payload[0].value} jobs</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="requests" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-secondary shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Clock className="w-5 h-5 text-accent" />
              Activity Feed
            </CardTitle>
            <CardDescription>Recent operational updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {[
                { type: "info", time: "2 min ago", msg: "New residential booking: 'Downtown Penthouse'." },
                { type: "warning", time: "15 min ago", msg: "Late check-in alert for Zone B team." },
                { type: "info", time: "1 hour ago", msg: "Inventory replenishment order confirmed." },
                { type: "error", time: "3 hours ago", msg: "Payment gateway timeout on order #442." },
              ].map((log, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/10 border border-transparent hover:border-secondary transition-all">
                  <div className={`mt-1 p-2 rounded-lg ${log.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                    {log.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground/90">{log.msg}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 font-medium tracking-wide uppercase">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}