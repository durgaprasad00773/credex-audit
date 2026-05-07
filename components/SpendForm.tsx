"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormData, ToolEntry } from "@/types"
import { runAudit } from "@/lib/auditEngine"
import { useRouter } from "next/navigation"

const TOOLS = [
  {
    id: "cursor",
    name: "Cursor",
    plans: ["hobby", "pro", "business", "enterprise"],
  },
  {
    id: "github_copilot",
    name: "GitHub Copilot",
    plans: ["individual", "business", "enterprise"],
  },
  {
    id: "claude",
    name: "Claude",
    plans: ["free", "pro", "max", "team", "enterprise", "api"],
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    plans: ["free", "plus", "team", "enterprise", "api"],
  },
  {
    id: "anthropic_api",
    name: "Anthropic API",
    plans: ["payasyougo"],
  },
  {
    id: "openai_api",
    name: "OpenAI API",
    plans: ["payasyougo"],
  },
  {
    id: "gemini",
    name: "Gemini",
    plans: ["free", "pro", "ultra", "api"],
  },
  {
    id: "windsurf",
    name: "Windsurf",
    plans: ["free", "pro", "team"],
  },
]

const EMPTY_TOOL: ToolEntry = {
  toolId: "",
  planName: "",
  seats: 1,
  monthlySpend: 0,
}

const DEFAULT_FORM: FormData = {
  tools: [{ ...EMPTY_TOOL }],
  teamSize: 1,
  useCase: "mixed",
}

export default function SpendForm() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>(DEFAULT_FORM)
  const [loading, setLoading] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("credex_form")
    if (saved) {
      try {
        setForm(JSON.parse(saved))
      } catch {}
    }
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("credex_form", JSON.stringify(form))
  }, [form])

  function addTool() {
    setForm((f) => ({ ...f, tools: [...f.tools, { ...EMPTY_TOOL }] }))
  }

  function removeTool(index: number) {
    setForm((f) => ({ ...f, tools: f.tools.filter((_, i) => i !== index) }))
  }

  function updateTool(index: number, field: keyof ToolEntry, value: string | number) {
    setForm((f) => {
      const tools = [...f.tools]
      tools[index] = { ...tools[index], [field]: value }
      return { ...f, tools }
    })
  }

  function getPlans(toolId: string) {
    return TOOLS.find((t) => t.id === toolId)?.plans || []
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      const result = runAudit(form)

      // Save to API
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form, result }),
      })

      const data = await res.json()
      router.push(`/audit/${data.id}`)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          AI Spend Audit
        </h1>
        <p className="text-muted-foreground text-lg">
          Find out where your team is overspending on AI tools — free, instant, no login required.
        </p>
      </div>

      {/* Team Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Your Team</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Team Size</Label>
            <Input
              type="number"
              min={1}
              value={form.teamSize}
              onChange={(e) =>
                setForm((f) => ({ ...f, teamSize: parseInt(e.target.value) || 1 }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Primary Use Case</Label>
            <Select
              value={form.useCase}
              onValueChange={(v) =>
                setForm((f) => ({ ...f, useCase: v as FormData["useCase"] }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="coding">Coding</SelectItem>
                <SelectItem value="writing">Writing</SelectItem>
                <SelectItem value="data">Data Analysis</SelectItem>
                <SelectItem value="research">Research</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tool Entries */}
      <div className="space-y-4 mb-6">
        {form.tools.map((tool, index) => (
          <Card key={index}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Tool {index + 1}</CardTitle>
              {form.tools.length > 1 && (
                <button
                  onClick={() => removeTool(index)}
                  className="text-sm text-muted-foreground hover:text-destructive"
                >
                  Remove
                </button>
              )}
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>AI Tool</Label>
                <Select
                  value={tool.toolId}
                  onValueChange={(v) => {
                    updateTool(index, "toolId", v)
                    updateTool(index, "planName", "")
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tool..." />
                  </SelectTrigger>
                  <SelectContent>
                    {TOOLS.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Plan</Label>
                <Select
                  value={tool.planName}
                  onValueChange={(v) => updateTool(index, "planName", v)}
                  disabled={!tool.toolId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan..." />
                  </SelectTrigger>
                  <SelectContent>
                    {getPlans(tool.toolId).map((p) => (
                      <SelectItem key={p} value={p}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Number of Seats</Label>
                <Input
                  type="number"
                  min={1}
                  value={tool.seats}
                  onChange={(e) =>
                    updateTool(index, "seats", parseInt(e.target.value) || 1)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Monthly Spend ($)</Label>
                <Input
                  type="number"
                  min={0}
                  value={tool.monthlySpend}
                  onChange={(e) =>
                    updateTool(index, "monthlySpend", parseFloat(e.target.value) || 0)
                  }
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Tool */}
      <Button variant="outline" onClick={addTool} className="w-full mb-6">
        + Add Another Tool
      </Button>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={loading || form.tools.every((t) => !t.toolId)}
        className="w-full h-12 text-base"
      >
        {loading ? "Analyzing your spend..." : "Run My Free Audit →"}
      </Button>

      <p className="text-center text-xs text-muted-foreground mt-4">
        No account required. Results are instant.
      </p>
    </div>
  )
}