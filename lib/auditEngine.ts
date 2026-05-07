import { FormData, AuditRecommendation, AuditResult } from "@/types"
import { v4 as uuidv4 } from "uuid"

const TOOL_PRICES: Record<string, Record<string, number>> = {
  cursor: {
    hobby: 0,
    pro: 20,
    business: 40,
    enterprise: 100,
  },
  github_copilot: {
    individual: 10,
    business: 19,
    enterprise: 39,
  },
  claude: {
    free: 0,
    pro: 20,
    max: 100,
    team: 30,
    enterprise: 60,
    api: 0,
  },
  chatgpt: {
    free: 0,
    plus: 20,
    team: 30,
    enterprise: 60,
    api: 0,
  },
  anthropic_api: {
    payasyougo: 0,
  },
  openai_api: {
    payasyougo: 0,
  },
  gemini: {
    free: 0,
    pro: 20,
    ultra: 30,
    api: 0,
  },
  windsurf: {
    free: 0,
    pro: 15,
    team: 35,
  },
}

const TOOL_NAMES: Record<string, string> = {
  cursor: "Cursor",
  github_copilot: "GitHub Copilot",
  claude: "Claude",
  chatgpt: "ChatGPT",
  anthropic_api: "Anthropic API",
  openai_api: "OpenAI API",
  gemini: "Gemini",
  windsurf: "Windsurf",
}

function analyzeTool(
  toolId: string,
  planName: string,
  seats: number,
  monthlySpend: number,
  teamSize: number,
  useCase: string
): AuditRecommendation {
  const toolName = TOOL_NAMES[toolId] || toolId
  let savings = 0
  let recommendedAction = "No change needed"
  let recommendedPlan = planName
  let recommendedTool = toolName
  let reason = "Your current plan is optimal for your usage."

  // Cursor rules
  if (toolId === "cursor") {
    if (planName === "business" && seats <= 2) {
      const currentCost = TOOL_PRICES.cursor.business * seats
      const recommendedCost = TOOL_PRICES.cursor.pro * seats
      savings = currentCost - recommendedCost
      recommendedAction = "Downgrade to Cursor Pro"
      recommendedPlan = "Pro"
      reason = `Cursor Business adds admin controls and SSO — unnecessary for ${seats} users. Pro has identical AI features.`
    }
    if (useCase === "writing" || useCase === "research") {
      const currentCost = monthlySpend
      const alternativeCost = TOOL_PRICES.claude.pro * seats
      if (alternativeCost < currentCost) {
        savings = currentCost - alternativeCost
        recommendedAction = "Switch to Claude Pro"
        recommendedTool = "Claude"
        recommendedPlan = "Pro"
        reason = `For ${useCase} tasks, Claude Pro outperforms Cursor at $${alternativeCost}/mo vs your current $${currentCost}/mo.`
      }
    }
  }

  // GitHub Copilot rules
  if (toolId === "github_copilot") {
    if (planName === "enterprise" && seats <= 5) {
      const currentCost = TOOL_PRICES.github_copilot.enterprise * seats
      const recommendedCost = TOOL_PRICES.github_copilot.business * seats
      savings = currentCost - recommendedCost
      recommendedAction = "Downgrade to Copilot Business"
      recommendedPlan = "Business"
      reason = `Copilot Enterprise adds fine-tuning on private repos — only worth it for 10+ devs. Business plan covers all core features.`
    }
    if (planName === "business" && seats === 1) {
      savings = TOOL_PRICES.github_copilot.business - TOOL_PRICES.github_copilot.individual
      recommendedAction = "Downgrade to Copilot Individual"
      recommendedPlan = "Individual"
      reason = `Copilot Business is designed for teams. Individual plan has identical coding features for solo users.`
    }
  }

  // ChatGPT rules
  if (toolId === "chatgpt") {
    if (planName === "team" && seats <= 2) {
      const currentCost = TOOL_PRICES.chatgpt.team * seats
      const recommendedCost = TOOL_PRICES.chatgpt.plus * seats
      savings = currentCost - recommendedCost
      recommendedAction = "Switch to ChatGPT Plus (individual)"
      recommendedPlan = "Plus"
      reason = `ChatGPT Team adds workspace collaboration — no benefit for ${seats} users. Plus gives identical GPT-4 access cheaper.`
    }
  }

  // Claude rules
  if (toolId === "claude") {
    if (planName === "max" && useCase === "coding") {
      savings = (TOOL_PRICES.claude.max - TOOL_PRICES.cursor.pro) * seats
      if (savings > 0) {
        recommendedAction = "Switch to Cursor Pro for coding"
        recommendedTool = "Cursor"
        recommendedPlan = "Pro"
        reason = `For coding, Cursor Pro has IDE integration that Claude Max lacks. Same underlying model, better developer experience at lower cost.`
      }
    }
    if (planName === "team" && seats <= 2) {
      const currentCost = TOOL_PRICES.claude.team * seats
      const recommendedCost = TOOL_PRICES.claude.pro * seats
      savings = currentCost - recommendedCost
      recommendedAction = "Downgrade to Claude Pro"
      recommendedPlan = "Pro"
      reason = `Claude Team adds admin controls and centralized billing — unnecessary overhead for ${seats} users.`
    }
  }

  // Gemini rules
  if (toolId === "gemini") {
    if (planName === "ultra" && useCase !== "data") {
      savings = (TOOL_PRICES.gemini.ultra - TOOL_PRICES.gemini.pro) * seats
      recommendedAction = "Downgrade to Gemini Pro"
      recommendedPlan = "Pro"
      reason = `Gemini Ultra's advantage is in complex data/multimodal tasks. For ${useCase}, Pro tier delivers equivalent results.`
    }
  }

  const currentSpend = monthlySpend || TOOL_PRICES[toolId]?.[planName] * seats || 0

  return {
    toolId,
    toolName,
    currentSpend,
    recommendedAction,
    recommendedTool,
    recommendedPlan,
    savings: Math.max(0, savings),
    reason,
  }
}

export function runAudit(formData: FormData): AuditResult {
  const recommendations: AuditRecommendation[] = formData.tools
    .filter((t) => t.toolId && t.planName)
    .map((tool) =>
      analyzeTool(
        tool.toolId,
        tool.planName,
        tool.seats,
        tool.monthlySpend,
        formData.teamSize,
        formData.useCase
      )
    )

  const totalMonthlySavings = recommendations.reduce((sum, r) => sum + r.savings, 0)

  return {
    id: uuidv4(),
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    createdAt: new Date().toISOString(),
  }
}
