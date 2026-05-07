import { runAudit } from "@/lib/auditEngine"
import { FormData } from "@/types"

// Test 1: GitHub Copilot Enterprise with small team should save money
test("Copilot Enterprise with 3 seats recommends downgrade to Business", () => {
  const form: FormData = {
    tools: [{ toolId: "github_copilot", planName: "enterprise", seats: 3, monthlySpend: 117 }],
    teamSize: 3,
    useCase: "coding",
  }
  const result = runAudit(form)
  expect(result.recommendations[0].savings).toBeGreaterThan(0)
  expect(result.recommendations[0].recommendedAction).toContain("Business")
})

// Test 2: Optimal plan should show zero savings
test("GitHub Copilot Individual with 1 seat is already optimal", () => {
  const form: FormData = {
    tools: [{ toolId: "github_copilot", planName: "individual", seats: 1, monthlySpend: 10 }],
    teamSize: 1,
    useCase: "coding",
  }
  const result = runAudit(form)
  expect(result.recommendations[0].savings).toBe(0)
})

// Test 3: ChatGPT Team with 2 users should recommend Plus
test("ChatGPT Team with 2 seats recommends Plus", () => {
  const form: FormData = {
    tools: [{ toolId: "chatgpt", planName: "team", seats: 2, monthlySpend: 60 }],
    teamSize: 2,
    useCase: "writing",
  }
  const result = runAudit(form)
  expect(result.recommendations[0].savings).toBeGreaterThan(0)
  expect(result.recommendations[0].recommendedPlan).toBe("Plus")
})

// Test 4: Total monthly savings adds up correctly
test("Total monthly savings is sum of all tool savings", () => {
  const form: FormData = {
    tools: [
      { toolId: "github_copilot", planName: "enterprise", seats: 3, monthlySpend: 117 },
      { toolId: "chatgpt", planName: "team", seats: 2, monthlySpend: 60 },
    ],
    teamSize: 3,
    useCase: "coding",
  }
  const result = runAudit(form)
  const expectedTotal = result.recommendations.reduce((sum, r) => sum + r.savings, 0)
  expect(result.totalMonthlySavings).toBe(expectedTotal)
})

// Test 5: Annual savings is 12x monthly savings
test("Annual savings equals 12x monthly savings", () => {
  const form: FormData = {
    tools: [{ toolId: "github_copilot", planName: "enterprise", seats: 5, monthlySpend: 195 }],
    teamSize: 5,
    useCase: "coding",
  }
  const result = runAudit(form)
  expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12)
})