# Reflection

## 1. The Hardest Bug I Hit This Week

The hardest bug was Supabase RLS (Row Level Security) blocking all inserts to the audits table. When I first set up the database and ran an audit, the app would redirect to `/audit/undefined` instead of the real audit ID. The terminal showed a 500 error from the API route.

My first hypothesis was that the audit ID wasn't being generated correctly. I checked the `runAudit()` function and the UUID generation looked fine. Then I looked at the API route and added `console.error` to log the Supabase response — that's when I saw the error code `42501` with the message "new row violates row-level security policy."

I didn't know what RLS was at first. I searched the error code and learned that Supabase enables RLS by default when you click "Run and enable RLS" during table creation — which I had done. The fix was adding explicit policies in the SQL editor to allow inserts and reads from the anon key. Once I ran those two SQL statements the app worked immediately.

What I learned: always check the actual error message from the database, not just the HTTP status code. The fix was two lines of SQL but finding the cause took an hour.

## 2. A Decision I Reversed Mid-Week

I initially planned to store audits in memory using a JavaScript `Map` in the API route. It was faster to implement and I thought it would be fine for a prototype. I shipped it and moved on.

I reversed this decision on Day 2 when I realized two things: first, the in-memory store resets every time the server restarts, which means shareable URLs would break after any deployment. Second, Vercel serverless functions don't share memory between invocations — so the Map would always be empty on the second request.

Switching to Supabase took about an hour including debugging the RLS issue. It was the right call — the shareable URL feature only works because audits are stored persistently.

## 3. What I Would Build in Week 2

Three things in priority order:

First, a proper email system using Resend. Right now the lead capture form stores the email in Supabase but doesn't actually send a confirmation email. The assignment requires a transactional email and I ran out of time to set up Resend properly.

Second, better audit engine rules. The current engine covers the most common overspend patterns but misses many edge cases. I would add rules for API usage vs subscription comparison, and a "benchmark mode" showing average AI spend per developer at similar company sizes.

Third, analytics with Posthog. Right now I have no visibility into where users drop off, which tools are most commonly entered, or what the actual audit completion rate is. Without this data I am guessing at what to improve.

## 4. How I Used AI Tools

I used Claude (claude.ai) as my primary tool throughout the week. Specifically:

- **Architecture decisions:** Asked Claude to help me think through the stack choice and data flow before writing any code
- **Component code:** Claude wrote the initial versions of SpendForm, the results page, and all API routes
- **Debugging:** Pasted error messages and asked Claude to explain what was wrong
- **Documentation:** Claude helped structure the markdown files

What I did not trust Claude with: the pricing data. Every number in PRICING_DATA.md I verified myself on vendor websites. Claude's training data could be outdated and wrong pricing numbers would fail the spot-check.

One specific time Claude was wrong: it suggested importing Link from `"next/dist/client/link"` instead of `"next/link"`. This caused a lint error. I caught it because the lint check failed and I traced it back to that import.

## 5. Self-Rating

**Discipline: 7/10**
I worked consistently across 5 days but could have started earlier in each day. Some evenings I lost momentum.

**Code quality: 6/10**
The code works but has lint issues I had to suppress rather than fix properly. A more experienced developer would have structured the useEffect hooks correctly from the start.

**Design sense: 6/10**
The UI is clean and functional using shadcn/ui components. It is not visually distinctive — a designer would make the results page much more shareable and impressive.

**Problem solving: 7/10**
I debugged the RLS issue, the git conflicts, and the CI failures without giving up. Each time I hit an error I read the message carefully and worked through it systematically.

**Entrepreneurial thinking: 7/10**
I understood the product opportunity and wrote reasonable GTM and economics documents. The user interviews were the weakest part — I only had time for brief conversations rather than deep discovery sessions.