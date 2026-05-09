import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, companyName, role, auditId } = body

    // Basic honeypot check
    if (body.website) {
      return NextResponse.json({ success: true }) // silently reject bots
    }

    if (!email || !auditId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const { error } = await supabase
      .from("audits")
      .update({ email, company_name: companyName, role })
      .eq("id", auditId)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to save lead" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}