"use client"

import * as React from "react"
import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "next/navigation"
import { useAuth } from "@/firebase"
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLoginPage() {
  const auth = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.replace("/dashboard")
    } catch {
      setError("Invalid email or password. Admin access only.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 flex items-center justify-center p-4">
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,_#0ea5e920_1px,_transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/logo.jpg"
              alt="CleanSweep Cleaning Company LLC"
              width={200}
              className="object-contain block drop-shadow-sm"
            />
          </div>
          <p className="text-slate-400 text-xs uppercase tracking-[0.3em] font-bold">Admin Vault</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/60">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="w-5 h-5 text-teal-500" />
            <span className="text-slate-500 text-sm font-medium">Restricted Access — Authorized Personnel Only</span>
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-slate-600 text-xs uppercase tracking-wider font-bold">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="admin@cleansweep.com"
                  className="pl-10 bg-white border-slate-200 text-slate-800 placeholder:text-slate-300 rounded-xl h-11 focus:border-teal-400 focus:ring-teal-400/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-600 text-xs uppercase tracking-wider font-bold">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-white border-slate-200 text-slate-800 placeholder:text-slate-300 rounded-xl h-11 focus:border-teal-400 focus:ring-teal-400/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-[#1a6a91] to-[#2eb086] hover:opacity-90 text-white font-bold shadow-md transition-all"
            >
              {loading ? "Signing in…" : "Sign In to Admin Portal"}
            </Button>
          </form>
        </div>

        <p className="text-center text-slate-400 text-xs mt-6">
          CleanSweep Admin Vault · Unauthorized access is prohibited
        </p>
      </div>
    </div>
  )
}
