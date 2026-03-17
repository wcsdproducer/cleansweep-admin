"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Settings, Bell, Shield, User, Database } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-3">
          <Settings className="w-8 h-8" />
          System Settings
        </h1>
        <p className="text-muted-foreground">Manage your CleanSweep admin preferences and system configurations.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <CardTitle className="text-xl">Profile Settings</CardTitle>
            </div>
            <CardDescription>Update your personal information and preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-xl">
              <div className="space-y-0.5">
                <Label className="text-base">Public Profile</Label>
                <p className="text-sm text-muted-foreground">Allow others to see your status and role.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-accent" />
              <CardTitle className="text-xl">Notifications</CardTitle>
            </div>
            <CardDescription>Configure how you receive alerts and system updates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-xl">
              <div className="space-y-0.5">
                <Label className="text-base">Email Alerts</Label>
                <p className="text-sm text-muted-foreground">Receive daily summaries and critical alerts via email.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-xl">
              <div className="space-y-0.5">
                <Label className="text-base">System Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Real-time status updates in your browser.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <CardTitle className="text-xl">Security</CardTitle>
            </div>
            <CardDescription>Manage your security credentials and access logs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-xl">
              <div className="space-y-0.5">
                <Label className="text-base">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
              </div>
              <Button variant="outline">Enable</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <Database className="w-5 h-5" />
              <CardTitle className="text-xl">Danger Zone</CardTitle>
            </div>
            <CardDescription>Irreversible system actions and data management.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive">Purge System Logs</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
