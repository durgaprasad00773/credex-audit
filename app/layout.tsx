import { Geist_Mono, Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata = {
  title: "AI Spend Audit — Free AI Tool Cost Optimizer",
  description: "Find out where your team is overspending on AI tools like Cursor, Claude, ChatGPT and more. Free, instant, no login required.",
  openGraph: {
    title: "AI Spend Audit — Free AI Tool Cost Optimizer",
    description: "Find out where your team is overspending on AI tools. Free, instant, no login required.",
    url: "https://credex-audit-pied.vercel.app",
    siteName: "AI Spend Audit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Spend Audit — Free AI Tool Cost Optimizer",
    description: "Find out where your team is overspending on AI tools. Free, instant, no login required.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}