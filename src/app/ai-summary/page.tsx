"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, FileText, Send, Loader2, Copy, RefreshCcw } from "lucide-react"
import { summarizeReport } from "@/ai/flows/ai-report-summary-tool"
import { useToast } from "@/hooks/use-toast"

const PRESET_DATA = [
  {
    title: "User Engagement (Weekly)",
    data: JSON.stringify({
      metric: "Weekly Active Users",
      trend: "upward",
      notable: ["Peak on Wednesday", "High churn in region B"],
      top_projects: ["Nexus", "Skyline"]
    }, null, 2)
  },
  {
    title: "Database Performance",
    data: JSON.stringify({
      read_latency: "45ms",
      write_latency: "120ms",
      errors: 12,
      critical_errors: 0,
      uptime: "99.99%"
    }, null, 2)
  }
]

export default function AISummaryPage() {
  const [inputData, setInputData] = React.useState("")
  const [summary, setSummary] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!inputData) {
      toast({ title: "Input Required", description: "Please provide JSON data to summarize.", variant: "destructive" })
      return
    }

    setIsLoading(true)
    try {
      const result = await summarizeReport({ reportData: inputData })
      setSummary(result.summary)
    } catch (err) {
      toast({ title: "Error", description: "Failed to generate summary. Please check your data format.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary mb-2 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-accent" />
          AI Insight Tool
        </h1>
        <p className="text-muted-foreground">
          Convert complex system data into human-readable insights using generative AI.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="text-lg">Input Data</CardTitle>
              <CardDescription>Paste JSON report data or behavior logs below</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder='{"users": 100, "events": 500...}'
                className="font-mono text-sm min-h-[250px] resize-none focus-visible:ring-accent"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
              />
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4 bg-muted/10">
              <Button variant="ghost" size="sm" onClick={() => setInputData("")}>
                Clear
              </Button>
              <Button className="bg-accent hover:bg-accent/90" onClick={handleGenerate} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Generate Summary
              </Button>
            </CardFooter>
          </Card>

          {summary && (
            <Card className="bg-primary/5 border-primary/20 animate-in fade-in slide-in-from-bottom-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  Generated Summary
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => {
                  navigator.clipboard.writeText(summary)
                  toast({ title: "Copied", description: "Summary copied to clipboard." })
                }}>
                  <Copy className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-foreground/90 whitespace-pre-line font-medium">
                  {summary}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Presets</CardTitle>
              <CardDescription>Click to load sample data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {PRESET_DATA.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => setInputData(preset.data)}
                  className="w-full p-3 text-left rounded-lg border hover:border-accent hover:bg-accent/5 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-muted-foreground group-hover:text-accent" />
                    <span className="text-sm font-semibold">{preset.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">Load recent project metrics</p>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-accent text-accent-foreground shadow-lg overflow-hidden relative">
            <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <CardHeader>
              <CardTitle className="text-base font-headline">Usage Tip</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-90 leading-relaxed">
                For best results, include timestamp information and clear metric keys in your JSON data. The AI works best with structured project activity logs.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}