import Groq from "groq-sdk"
import { AuditResult, FormData } from "@/types"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function generateSummary(
  form: FormData,
  result: AuditResult
): Promise<string> {
  try {
    const toolsList = result.recommendations
      .map((r) => `${r.toolName} (${r.recommendedAction}, saving $${r.savings}/mo)`)
      .join(", ")

    const prompt = `You are an AI spend analyst. Write a 100-word personalized audit summary for a team of ${form.teamSize} people whose primary use case is ${form.useCase}.

Their current AI tools: ${toolsList}
Total monthly savings identified: $${result.totalMonthlySavings}
Total annual savings identified: $${result.totalAnnualSavings}

Write a concise, professional, and encouraging summary. Mention specific tools and savings. End with a recommendation. No bullet points, just a paragraph.`

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      max_tokens: 200,
    })

    return completion.choices[0]?.message?.content || getFallbackSummary(form, result)
  } catch (err) {
    console.error("Groq API error:", err)
    return getFallbackSummary(form, result)
  }
}

function getFallbackSummary(form: FormData, result: AuditResult): string {
  if (result.totalMonthlySavings === 0) {
    return `Your team of ${form.teamSize} is spending efficiently on AI tools. Your current stack is well-optimized for ${form.useCase} work. Keep monitoring as new plans and tools emerge — the AI pricing landscape changes fast.`
  }
  return `Your team of ${form.teamSize} could save $${result.totalMonthlySavings}/month ($${result.totalAnnualSavings}/year) by optimizing your AI tool subscriptions. The biggest opportunities are in right-sizing plans to your actual team size and switching to tools better suited for ${form.useCase} work. These are straightforward changes you can make today.`
}