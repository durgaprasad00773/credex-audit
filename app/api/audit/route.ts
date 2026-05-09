import { NextRequest, NextResponse } from "next/server"
import { AuditResult, FormData } from "@/types"
import { supabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { form, result }: { form: FormData; result: AuditResult } = body

    if (!result?.id) {
      return NextResponse.json({ error: "Invalid audit data" }, { status: 400 })
    }

    const { error } = await supabase.from("audits").insert({
      id: result.id,
      form_data: form,
      result: result,
      created_at: result.createdAt,
    })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to save audit" }, { status: 500 })
    }

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

    const { data, error } = await supabase
      .from("audits")
      .select("*")
      .eq("id", id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 })
    }

    return NextResponse.json({ form: data.form_data, result: data.result })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}