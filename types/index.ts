export type Plan = {
  name: string
  price: number // per seat per month
}

export type Tool = {
  id: string
  name: string
  plans: Plan[]
}

export type ToolEntry = {
  toolId: string
  planName: string
  seats: number
  monthlySpend: number
}

export type FormData = {
  tools: ToolEntry[]
  teamSize: number
  useCase: "coding" | "writing" | "data" | "research" | "mixed"
  companyName?: string
}

export type AuditRecommendation = {
  toolId: string
  toolName: string
  currentSpend: number
  recommendedAction: string
  recommendedTool?: string
  recommendedPlan?: string
  savings: number
  reason: string
}

export type AuditResult = {
  id: string
  recommendations: AuditRecommendation[]
  totalMonthlySavings: number
  totalAnnualSavings: number
  summary?: string
  createdAt: string
}