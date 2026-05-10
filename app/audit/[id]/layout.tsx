import { Metadata } from "next"
import { supabase } from "@/lib/supabase"

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { data } = await supabase
      .from("audits")
      .select("result")
      .eq("id", params.id)
      .single()

    if (!data) throw new Error("Not found")

    const result = data.result
    const monthly = result.totalMonthlySavings?.toFixed(0) || "0"
    const annual = result.totalAnnualSavings?.toFixed(0) || "0"

    return {
      title: `AI Spend Audit — $${monthly}/mo in savings found`,
      description: `This audit identified $${monthly}/month ($${annual}/year) in potential AI tool savings. See the full breakdown.`,
      openGraph: {
        title: `AI Spend Audit — $${monthly}/mo in savings found`,
        description: `This audit identified $${monthly}/month ($${annual}/year) in potential AI tool savings.`,
        url: `https://credex-audit-pied.vercel.app/audit/${params.id}`,
        siteName: "AI Spend Audit",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `AI Spend Audit — $${monthly}/mo in savings found`,
        description: `This audit identified $${monthly}/month ($${annual}/year) in potential AI tool savings.`,
      },
    }
  } catch {
    return {
      title: "AI Spend Audit",
      description: "Find out where your team is overspending on AI tools.",
    }
  }
}

export default function AuditLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}