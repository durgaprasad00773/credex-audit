"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { FormData, ToolEntry } from "@/types"
import { runAudit } from "@/lib/auditEngine"

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
  seats: 0,
  monthlySpend: 0,
}

const DEFAULT_FORM: FormData = {
  tools: [{ ...EMPTY_TOOL }],
  teamSize: 0,
  useCase: "mixed",
}

export default function SpendForm() {
  const router = useRouter()

  const [form, setForm] = useState<FormData>(DEFAULT_FORM)
  const [loading, setLoading] = useState(false)

  // Load saved form
  useEffect(() => {
    const saved = localStorage.getItem("credex_form")

    if (saved) {
      try {
        setForm(JSON.parse(saved))
      } catch (err) {
        console.error("Failed to parse saved form:", err)
      }
    }
  }, [])

  // Persist form
  useEffect(() => {
    localStorage.setItem("credex_form", JSON.stringify(form))
  }, [form])

  function addTool() {
    setForm((f) => ({
      ...f,
      tools: [...f.tools, { ...EMPTY_TOOL }],
    }))
  }

  function removeTool(index: number) {
    setForm((f) => ({
      ...f,
      tools: f.tools.filter((_, i) => i !== index),
    }))
  }

  function updateTool(
    index: number,
    field: keyof ToolEntry,
    value: string | number
  ) {
    setForm((f) => {
      const tools = [...f.tools]

      tools[index] = {
        ...tools[index],
        [field]: value,
      }

      return {
        ...f,
        tools,
      }
    })
  }

  function getPlans(toolId: string) {
    return TOOLS.find((t) => t.id === toolId)?.plans || []
  }

  const isInvalid =
    form.teamSize <= 0 ||
    form.tools.some(
      (t) =>
        !t.toolId ||
        !t.planName ||
        t.seats <= 0 ||
        t.monthlySpend <= 0
    )

  async function handleSubmit() {
    if (isInvalid) return

    setLoading(true)

    try {
      const result = runAudit(form)

      const res = await fetch("/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          form,
          result,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to run audit")
      }

      const data = await res.json()

      router.push(`/audit/${data.id}`)
    } catch (err) {
      console.error(err)
    } finally {
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
          Find out where your team is overspending on AI tools — free,
          instant, no login required.
        </p>
      </div>

      {/* Team Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Your Team</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Team Size</Label>

            <Input
              type="text"
              inputMode="numeric"
              placeholder="e.g. 5"
              value={form.teamSize === 0 ? "" : form.teamSize}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "")

                setForm((f) => ({
                  ...f,
                  teamSize: parseInt(val) || 0,
                }))
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Primary Use Case</Label>

            <Select
              value={form.useCase}
              onValueChange={(v) =>
                setForm((f) => ({
                  ...f,
                  useCase: v as FormData["useCase"],
                }))
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
              <CardTitle className="text-base">
                Tool {index + 1}
              </CardTitle>

              {form.tools.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTool(index)}
                  className="text-sm text-muted-foreground hover:text-destructive"
                >
                  Remove
                </button>
              )}
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tool */}
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

              {/* Plan */}
              <div className="space-y-2">
                <Label>Plan</Label>

                <Select
                  value={tool.planName}
                  onValueChange={(v) =>
                    updateTool(index, "planName", v)
                  }
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

              {/* Seats */}
              <div className="space-y-2">
                <Label>Number of Seats</Label>

                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 3"
                  value={tool.seats === 0 ? "" : tool.seats}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "")

                    updateTool(
                      index,
                      "seats",
                      parseInt(val) || 0
                    )
                  }}
                />
              </div>

              {/* Spend */}
              <div className="space-y-2">
                <Label>Monthly Spend ($)</Label>

                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="e.g. 40"
                  value={
                    tool.monthlySpend === 0
                      ? ""
                      : tool.monthlySpend
                  }
                  onChange={(e) => {
                    const val = e.target.value
                      .replace(/[^0-9.]/g, "")
                      .replace(/(\..*)\./g, "$1")

                    updateTool(
                      index,
                      "monthlySpend",
                      parseFloat(val) || 0
                    )
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Tool */}
      <Button
        variant="outline"
        onClick={addTool}
        className="w-full mb-6"
      >
        + Add Another Tool
      </Button>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={loading || isInvalid}
        className="w-full h-12 text-base"
      >
        {loading
          ? "Analyzing your spend..."
          : "Run My Free Audit →"}
      </Button>

      <p className="text-center text-xs text-muted-foreground mt-4">
        No account required. Results are instant.
      </p>

      {/* Footer */}
      <div className="text-center mt-16 pt-8 border-t">
        <p className="text-xs text-muted-foreground">
          Built by{" "}
          <a
            href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            Credex
          </a>
          . All audits are free and run in your browser. We do not
          collect any data.
        </p>
      </div>
    </div>
  )
}