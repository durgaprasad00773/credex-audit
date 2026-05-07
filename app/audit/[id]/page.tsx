"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { AuditResult, FormData } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function AuditPage() {
  const { id } = useParams()
  const [result, setResult] = useState<AuditResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchAudit() {
      try {
        const res = await fetch(`/api/audit?id=${id}`)
        if (!res.ok) throw new Error("Audit not found")
        const data = await res.json()
        setResult(data.result)
      } catch (err) {
        setError("Audit not found or expired.")
      } finally {
        setLoading(false)
      }
    }
    fetchAudit()
  }, [id])

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

      {/* Credex CTA for high savings */}
      {isHighSavings && (
        <Card className="mb-6 border-primary">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  💡 You could save even more with Credex
                </h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Credex sells discounted AI credits — Cursor, Claude, ChatGPT Enterprise and more — at up to 40% off retail. Your audit shows significant overspend. Let's talk.
                </p>
                <Button>Book a Free Credex Consultation →</Button>
              </div>
            </div>
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

      {/* Share */}
      <Card>
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
            <Button
              variant="outline"
              onClick={() => navigator.clipboard.writeText(window.location.href)}
            >
              Copy
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