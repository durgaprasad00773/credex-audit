"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { AuditResult, FormData } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AuditPage() {
  const { id } = useParams()
  const [result, setResult] = useState<AuditResult | null>(null)
  const [form, setForm] = useState<FormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [summary, setSummary] = useState("")
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [role, setRole] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function fetchAudit() {
      try {
        const res = await fetch(`/api/audit?id=${id}`)
        if (!res.ok) throw new Error("Audit not found")
        const data = await res.json()
        setResult(data.result)
        setForm(data.form)
      } catch (err) {
        setError("Audit not found or expired.")
      } finally {
        setLoading(false)
      }
    }
    fetchAudit()
  }, [id])

  useEffect(() => {
    if (!result || !form) return
    setSummaryLoading(true)
    fetch("/api/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ form, result }),
    })
      .then((r) => r.json())
      .then((data) => setSummary(data.summary || ""))
      .catch(() => setSummary(""))
      .finally(() => setSummaryLoading(false))
  }, [result, form])

  async function handleLeadSubmit() {
    if (!email) return
    setSubmitting(true)
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, companyName, role, auditId: id }),
      })
      setSubmitted(true)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading your audit...</p>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  const isHighSavings = result.totalMonthlySavings > 500
  const isLowSavings = result.totalMonthlySavings < 100

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Your AI Spend Audit</h1>
        <p className="text-muted-foreground mb-6">
          Here's where your money is going — and where you can save.
        </p>
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="pt-6 text-center">
              <p className="text-sm opacity-80">Monthly Savings</p>
              <p className="text-3xl font-bold">
                ${result.totalMonthlySavings.toFixed(0)}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="pt-6 text-center">
              <p className="text-sm opacity-80">Annual Savings</p>
              <p className="text-3xl font-bold">
                ${result.totalAnnualSavings.toFixed(0)}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">AI Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {summaryLoading ? (
            <p className="text-muted-foreground text-sm">Generating your personalized summary...</p>
          ) : (
            <p className="text-sm leading-relaxed">{summary}</p>
          )}
        </CardContent>
      </Card>

      {/* Credex CTA for high savings */}
      {isHighSavings && (
        <Card className="mb-6 border-primary">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-1">
              💡 You could save even more with Credex
            </h3>
            <p className="text-muted-foreground text-sm mb-3">
              Credex sells discounted AI credits — Cursor, Claude, ChatGPT Enterprise and more — at up to 40% off retail. Your audit shows significant overspend. Let's talk.
            </p>
            <Button>Book a Free Credex Consultation →</Button>
          </CardContent>
        </Card>
      )}

      {/* Low savings message */}
      {isLowSavings && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-1">✅ You're spending well</h3>
            <p className="text-muted-foreground text-sm">
              Your current AI stack looks optimized. We'll notify you when new savings apply to your tools.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Per-tool breakdown */}
      <h2 className="text-xl font-semibold mb-4">Tool Breakdown</h2>
      <div className="space-y-4 mb-8">
        {result.recommendations.map((rec) => (
          <Card key={rec.toolId}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{rec.toolName}</CardTitle>
                <Badge variant={rec.savings > 0 ? "destructive" : "secondary"}>
                  {rec.savings > 0 ? `-$${rec.savings.toFixed(0)}/mo` : "Optimal"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                <div>
                  <span className="text-muted-foreground">Current spend: </span>
                  <span className="font-medium">${rec.currentSpend}/mo</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Action: </span>
                  <span className="font-medium">{rec.recommendedAction}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{rec.reason}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lead Capture */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">
            {isHighSavings ? "📬 Get your full report + Credex consultation" : "📬 Save your report"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <p className="text-sm text-green-600 font-medium">
              ✅ Report sent! Check your inbox.
            </p>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>Email address *</Label>
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Company name</Label>
                  <Input
                    placeholder="Acme Inc"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Your role</Label>
                  <Input
                    placeholder="CTO"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
              </div>
              {/* Honeypot - hidden from real users */}
              <input
                type="text"
                name="website"
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
              />
              <Button
                onClick={handleLeadSubmit}
                disabled={!email || submitting}
                className="w-full"
              >
                {submitting ? "Sending..." : "Email me the report →"}
              </Button>
              <p className="text-xs text-muted-foreground">
                No spam. Credex may reach out for high-savings cases.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Share */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">Share this audit</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Your identifying details are stripped from the public link.
          </p>
          <div className="flex gap-2">
            <input
              readOnly
              value={typeof window !== "undefined" ? window.location.href : ""}
              className="flex-1 text-sm border rounded px-3 py-2 bg-muted"
            />
            <Button variant="outline" onClick={handleCopy}>
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Start over */}
      <div className="text-center mt-6">
        <a href="/" className="text-sm text-muted-foreground underline">
          ← Start a new audit
        </a>
      </div>
    </div>
  )
}