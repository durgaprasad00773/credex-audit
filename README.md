# Next.js template

This is a Next.js template with shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```

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

## Quick Start

### Install
```bash
git clone https://github.com/YOURUSERNAME/next-app.git
cd next-app
npm install
```

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_key
```

### Run locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Deploy
Push to GitHub and import to [Vercel](https://vercel.com). Add environment variables in Vercel dashboard.

---

## Decisions

1. **Next.js over plain React** — App Router gives us API routes and server components in one project, reducing infrastructure complexity for a solo build under time pressure.

2. **Groq over Anthropic API** — Groq provides free API access with fast inference on Llama 3.3 70B. For a 100-word summary, the quality difference from Claude is negligible and the cost difference is significant.

3. **Hardcoded audit rules over AI** — The audit engine uses deterministic logic, not LLMs. A finance person needs to trust the reasoning. LLM outputs for math-based recommendations are unpredictable and harder to cite.

4. **Supabase over plain Postgres** — Supabase gives us a hosted Postgres database with a GUI, REST API, and RLS security out of the box. Faster to set up than a raw Postgres instance on Render for a 5-day build.

5. **Honeypot over CAPTCHA for spam protection** — hCaptcha adds friction for real users. A honeypot hidden field catches most bots silently without degrading the user experience.
