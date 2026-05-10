# User Interviews

Three conversations conducted during the week of May 7–10, 2026.

---

## Interview 1 — R.K., BTech Student, Personal Projects

**Role:** Computer Science student, uses AI for DSA practice and development projects
**Company stage:** Individual / student

**Interview notes:**

R.K. uses ChatGPT regularly and GitHub Copilot occasionally for code suggestions. Currently on free plans across the board — cost-consciousness is high as a student, but he mentioned considering paid versions during internship preparation.

**Direct quotes:**

> "Since most tools have subscriptions, it's easy to forget how much is being spent overall. I usually know the individual subscription price, but not the total monthly AI spending."

> "Sometimes a paid plan sounds useful initially, but after a few weeks I end up using only a small part of the features."

> "I wouldn't trust it if it asked for sensitive information like passwords, card details, or access to private chats."

**Most surprising thing he said:**

He said he would definitely use a free audit tool — but his trust concern was entirely about data privacy, not about the accuracy of recommendations. I expected him to question whether the savings numbers were real. Instead he assumed the numbers would be correct and worried about what data the tool collects. This made me realize the privacy copy on the results page needs to be more prominent.

**What it changed about my design:**

Added a clear note under the email capture form: "No spam. We never access your actual accounts or billing data." The form now feels less invasive.

---

## Interview 2 — S.M., Working Professional, Mid-size Company

**Role:** Uses AI for writing, documentation, research, and coding assistance
**Company stage:** Employed at an established company

**Interview notes:**

S.M. uses a mix of free and paid plans, prioritizing paid for daily-use tools. Like R.K., he does not track total monthly AI spending — each tool bills separately and the total gets lost.

**Direct quotes:**

> "Since different tools bill separately, it's easy to lose track of the total monthly spending unless I actively monitor subscriptions."

> "Sometimes I subscribe to a tool for a specific project or feature, but later realize I'm not using it enough to justify the cost."

> "I'd be cautious if it required access to sensitive company data, emails, payment details, or private conversations."

**Most surprising thing he said:**

He mentioned using "Anysphere" — which I did not recognize immediately. It turns out to be the company behind Cursor. This reminded me that not all users know the vendor names behind the tools they use daily. My form uses tool brand names like "Cursor" but some users might know it as something else.

**What it changed about my design:**

I considered adding helper text under each tool name showing the vendor company. Did not implement this week due to time but added it to the week 2 backlog.

---

## Interview 3 — P.R., Founder/Operator, Early-stage Startup

**Role:** Involved in product, marketing, and operations at an early-stage startup
**Company stage:** Early-stage, small team

**Interview notes:**

P.R. is the most valuable interview — closest to the target user. The startup pays for multiple AI tools across different team functions. Spending is distributed across subscriptions and APIs, making total spend hard to track in real time.

**Direct quotes:**

> "In startups, it's common to accumulate subscriptions faster than you optimize them."

> "Visibility into AI spending, usage patterns, and ROI would be very valuable, especially for early-stage startups trying to manage burn efficiently."

> "If the platform lacked transparency about how it handles company data, required excessive permissions, or didn't clearly explain how recommendations are generated, I'd hesitate to use it."

**Most surprising thing he said:**

He specifically mentioned wanting to know ROI — not just cost. He wanted to see which tools are delivering value relative to what they cost, not just which ones are cheapest. This is a fundamentally different framing from the audit tool I built, which focuses purely on cost savings. A "value per dollar" view would make the tool more useful for operators who care about productivity, not just spend.

**What it changed about my design:**

Added a note in the results page: "Savings shown are based on plan pricing. Actual value depends on your team's usage patterns." This is more honest and resonates better with operators who think in ROI terms. A full value-tracking feature is on the week 2 roadmap.