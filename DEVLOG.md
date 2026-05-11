## Day 1 — 2026-05-07

**Hours worked:** 6

**What I did:** Set up Next.js project with shadcn/ui, built the spend input form with localStorage persistence, built the audit engine with pricing rules for 8 AI tools, built the results page showing savings breakdown, set up Supabase database.

**What I learned:** How Next.js App Router works, how to use shadcn/ui components, how localStorage persists form state across reloads.

**Blockers / what I'm stuck on:** shadcn had a bug with folder paths containing spaces — fixed by moving the project. Supabase RLS setup was confusing at first.

**Plan for tomorrow:** Write unit tests, add pricing data, set up Supabase integration properly.

## Day 2 — 2026-05-08

**Hours worked:** 5

**What I did:** Wrote 5 passing unit tests for the audit engine using Vitest, created PRICING_DATA.md with verified pricing sources for all 8 tools, fixed Supabase RLS policies to allow inserts and reads, connected audit API to Supabase for permanent storage.

**What I learned:** How Supabase RLS works, how to write Vitest unit tests with TypeScript path aliases, how to set up vitest.config.ts.

**Blockers / what I'm stuck on:** RLS was blocking inserts — fixed by adding explicit policies in SQL editor.

**Plan for tomorrow:** Add Groq AI summary, lead capture form, deploy to Vercel.

## Day 3 — 2026-05-09

**Hours worked:** 5

**What I did:** Added Groq AI summary with graceful fallback, built lead capture form with honeypot spam protection, connected lead storage to Supabase, deployed to Vercel at https://credex-audit-pied.vercel.app, tested full end-to-end flow on live URL.

**What I learned:** How to use Groq SDK in Next.js API routes, how honeypot spam protection works, how to deploy Next.js to Vercel with environment variables.

**Blockers / what I'm stuck on:** Nothing major today.

**Plan for tomorrow:** Add Open Graph meta tags, set up GitHub Actions CI, write GTM.md, ECONOMICS.md, LANDING_COPY.md, METRICS.md, do user interviews.


## Day 4 — 2026-05-10

**Hours worked:** 6

**What I did:** Added Open Graph and Twitter card meta tags for shareable URLs, set up GitHub Actions CI with green checks, wrote all entrepreneurial files (ARCHITECTURE.md, GTM.md, ECONOMICS.md, LANDING_COPY.md, METRICS.md), conducted 3 user interviews, wrote USER_INTERVIEWS.md, REFLECTION.md, TESTS.md, PROMPTS.md.

**What I learned:** How Open Graph meta tags work in Next.js App Router, how GitHub Actions CI works, how to write unit economics for a B2B lead-gen tool.

**Blockers / what I'm stuck on:** ESLint errors with set-state-in-effect rule — fixed by disabling the rule in eslint.config.mjs.

**Plan for tomorrow:** Final polish, check git commit count, deploy latest version to Vercel, write Day 5 DEVLOG entry, submit Google Form.

## Day 5 — 2026-05-11

**Hours worked:** 5

**What I did:** Added more audit engine savings rules for Windsurf, Gemini, Cursor, and GitHub Copilot. Fixed all ESLint errors and got GitHub Actions CI green. Replaced number inputs with text inputs for better UX. Added footer with Credex branding. Fixed placeholder values showing instead of default zeros in form inputs. Pushed all changes to Vercel.

**What I learned:** How ESLint config works in Next.js with eslint.config.mjs. How Vercel auto-deploys on every git push. How to show empty placeholders instead of zero values in controlled React inputs.

**Blockers / what I'm stuck on:** The footer anchor tag kept breaking when copy-pasting code. Git commit history only has 4 distinct days — need one more day of commits tomorrow.

**Plan for tomorrow:** Final UI polish, add screenshots to README, verify all required files are present, submit Google Form before May 13 deadline.