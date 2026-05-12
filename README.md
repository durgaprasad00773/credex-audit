# AI Spend Audit — Free AI Tool Cost Optimizer

A free web app that audits your team's AI tool spending and surfaces real savings opportunities. Built as a lead-generation tool for [Credex](https://credex.rocks) — a marketplace for discounted AI infrastructure credits.

**Live URL:** https://credex-audit-pied.vercel.app

---

## Screenshots

> Add 3 screenshots here — use Loom or YouTube for a 30-second screen recording

<!-- Replace these with real screenshots -->
- Screenshot 1: Spend input form
- Screenshot 2: Audit results page with savings
- Screenshot 3: Lead capture form

- <img width="819" height="395" alt="image" src="https://github.com/user-attachments/assets/0fae1fb2-ca36-41f8-95a7-03f40571406f" />
-<img width="863" height="403" alt="image" src="https://github.com/user-attachments/assets/126519d6-3e3e-46e8-87d8-bcdac75ed0fe" />
-<img width="653" height="373" alt="image" src="https://github.com/user-attachments/assets/0757781f-6a35-452e-8a95-60d1454673aa" />
---

# AI Spend Audit 🔍

> Find out exactly where your team is overspending on AI tools — free, instant, no login required.

**Live URL:** https://credex-audit-pied.vercel.app

Built as a lead-generation tool for [Credex](https://credex.rocks) — a marketplace for discounted AI infrastructure credits for startups.

---

## What It Does

Most startups pay for multiple AI tools — Cursor, Claude, ChatGPT, GitHub Copilot — without ever auditing whether they're on the right plan or overpaying. This tool fixes that.

1. Enter your AI tools, plans, seats, and monthly spend
2. Get an instant audit showing where you're overspending and what to switch to
3. See your total monthly and annual savings potential
4. Get a personalized AI-generated summary of your audit
5. Share your audit via a unique public URL

No login required. Email is captured after value is shown, never before.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| AI Summary | Groq API (Llama 3.3 70B) |
| Deployment | Vercel |
| Testing | Vitest |
| CI | GitHub Actions |

---

## Quick Start

### Install
```bash
git clone https://github.com/durgaprasad00773/credex-audit.git
cd credex-audit
npm install
```

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_key
```

### Run Locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Run Tests
```bash
npm test
```

### Deploy
Push to GitHub and import to [Vercel](https://vercel.com). Add environment variables in the Vercel dashboard.

---

## Decisions

1. **Next.js over plain React** — App Router gives us API routes and server components in one project, reducing infrastructure complexity for a solo build under time pressure.

2. **Groq over Anthropic API** — Groq provides free API access with fast inference on Llama 3.3 70B. For a 100-word summary, the quality difference is negligible and the cost difference is significant.

3. **Hardcoded audit rules over AI** — The audit engine uses deterministic logic, not LLMs. A finance person needs to trust the reasoning. LLM outputs for math-based recommendations are unpredictable and harder to cite.

4. **Supabase over plain Postgres** — Supabase gives us a hosted Postgres database with a GUI, REST API, and RLS security out of the box. Faster to set up than a raw Postgres instance for a 5-day build.

5. **Honeypot over CAPTCHA for spam protection** — hCaptcha adds friction for real users. A honeypot hidden field catches most bots silently without degrading user experience.

---

## Project Structure

next-app/
├── app/
│   ├── page.tsx              # Homepage with spend input form
│   ├── audit/[id]/page.tsx   # Audit results page
│   └── api/
│       ├── audit/route.ts    # Save and fetch audits
│       ├── summary/route.ts  # Generate AI summary via Groq
│       └── lead/route.ts     # Capture email leads
├── components/
│   └── SpendForm.tsx         # Main spend input form
├── lib/
│   ├── auditEngine.ts        # Core audit logic
│   ├── supabase.ts           # Supabase client
│   └── groq.ts               # Groq AI client
├── types/
│   └── index.ts              # TypeScript types
└── tests/
└── auditEngine.test.ts   # Unit tests


---

Built with ❤️ for the [Credex](https://credex.rocks) Web Dev Internship Assignment.

