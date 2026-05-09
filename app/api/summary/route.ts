import { NextRequest, NextResponse } from "next/server"
import { generateSummary } from "@/lib/groq"
import { AuditResult, FormData } from "@/types"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { form, result }: { form: FormData; result: AuditResult } = body

    const summary = await generateSummary(form, result)
    return NextResponse.json({ summary })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 })
  }
}