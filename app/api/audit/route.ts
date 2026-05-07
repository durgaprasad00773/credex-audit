import { NextRequest, NextResponse } from "next/server"
import { AuditResult, FormData } from "@/types"

// In-memory store for now (we'll add Supabase later)
const audits = new Map<string, { form: FormData; result: AuditResult }>()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { form, result }: { form: FormData; result: AuditResult } = body

    if (!result?.id) {
      return NextResponse.json({ error: "Invalid audit data" }, { status: 400 })
    }

    // Store audit
    audits.set(result.id, { form, result })

    return NextResponse.json({ id: result.id })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 })
    }

    const audit = audits.get(id)

    if (!audit) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 })
    }

    return NextResponse.json(audit)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}