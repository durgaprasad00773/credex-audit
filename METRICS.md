# Metrics

## North Star Metric

**Audits completed per week**

Why: An audit completion means a user got real value from the tool. It is the moment Credex's lead-gen flywheel starts — no audit, no email capture, no consultation, no sale. Every other metric is downstream of this one. DAU is wrong for a tool people use once a quarter. Revenue is a lagging indicator. Audits completed is the leading indicator that predicts everything else.

## 3 Input Metrics That Drive the North Star

**1. Homepage → Audit completion rate**
Target: 40%+
Why: If people land and don't complete, the form is too long or confusing. This is a product problem. Fixing it multiplies every traffic source instantly.

**2. Audit completion → Email capture rate**
Target: 20%+
Why: Email is how Credex follows up for high-savings cases. Low capture rate means the results page isn't showing enough value, or the ask comes too early.

**3. Shareable URL click-through rate**
Target: 15% of audits generate at least 1 share click
Why: The viral loop. If audit URLs get shared, traffic grows without ad spend. This is the organic growth engine.

## What to Instrument First

1. **Audit completions** — fire an event when `/api/audit` POST succeeds
2. **Form drop-off** — track which step users abandon the form on
3. **Results page time-on-page** — are people reading the breakdown or bouncing?
4. **Email capture events** — track submission and confirmation
5. **Shareable URL copies** — track every time the copy button is clicked
6. **Credex CTA clicks** — track "Book a Free Credex Consultation" clicks

Use Posthog (free tier) or Plausible for privacy-friendly analytics. Add to the app in week 2.

## Pivot Trigger

**If audit completion rate drops below 20% after 500 visits** — the form is too long or the value proposition is unclear. Pivot to a simpler 3-question version: "What tools do you use? How many seats? What's your monthly spend?" and generate a rougher but faster audit.

**If email capture rate stays below 5%** — the results page is not showing enough value. Either the savings numbers are too low (audit engine needs more rules) or the email ask is too aggressive. Test showing the email form only for audits with $50+ in savings.

**If zero Credex CTA clicks after 100 high-savings audits** — the Credex pitch on the results page is unclear. Rewrite the CTA copy and test a different placement.