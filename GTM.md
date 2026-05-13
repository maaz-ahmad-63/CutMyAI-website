# Go-to-Market (GTM) — Credex

Target user
- Exact persona: `VP of Engineering` or `Head of Platform/Infrastructure` at Series A–B SaaS companies (20–200 employees) who own developer productivity and tooling spend but don’t own procurement. These are engineering leaders responsible for developer budgets, often approving purchases like GitHub Copilot licenses, LLM API usage, and design/ML tooling. They care about immediate, defensible cost reductions without long procurement cycles.

What they Google / scroll before wanting this
- "how much does GitHub Copilot cost per user"
- "reduce AI subscription costs"
- "ChatGPT enterprise pricing comparison"
- "how to consolidate SaaS subscriptions"
- threads on Hacker News like “How we cut our AI bill” or Twitter posts showing runaway tool bills ("we spent $X on LLMs")
- LinkedIn posts: "Our AI tooling costs doubled this quarter — any tips?"

Where they hang out (specific communities)
- Slack: `SaaS Club`, `Modern CTOs`, `Tech Leads` (invite-only channels), `MLOps Community Slack`
- Reddit: `r/saas`, `r/startups`, `r/MachineLearning`, `r/devops` (specific threads)
- Discord: `Product School`, `Indie Hackers` Discord (product & growth channels)
- Twitter/X lists: follow `@saaramor`, `@bentossell`, `@lennysan`, `@swyx`, `@tunguz` and tag them in micro-case studies
- Newsletters: `SaaStr Daily`, `Stratechery (for high-level CFO/CEO outreach)`, `MLOps Weekly`
- Communities for hiring/benchmarks: `Blind` (Engineer channel), `Hacker News` "Show HN" / discussions

How to get the first 100 users in 30 days with $0
1. Laser cold-post strategy (Days 1–7):
   - Post an actionable 3-tweet thread (and LinkedIn post) titled: “We analyzed 30 startups’ AI tooling and found the average $/engineer — here’s a free audit.” Link to a short signup form. Pin it, and seed with 10 DMs to relevant VPs in my network. Use screenshots in `public/screenshots` as proof.
2. Community seeding (Days 2–14):
   - Post short case studies (1–3 screenshots + one-line takeaway) to `r/saas`, `r/startups`, and `Hacker News` (Show HN: Free AI Spend Audit). Use honest numbers (sample audits) to drive curiosity.
   - Drop the tool in `SaaS Club` and `Modern CTOs` Slack with a free 1-click audit link; offer to do a free audit for the first 10 companies that respond (scarcity).
3. Viral + referral (Days 7–30):
   - Every audit generates a shareable public URL with an OG image. Encourage users to share the result ("Share this audit") and offer a public leaderboard for most-viewed audits (gamify sharing).
   - Run an outreach loop on LinkedIn: connect with 50 target VPs, send a short value-first message offering a 5-minute free audit (use audit URL as social proof).
4. Product Hunt & Indie Hackers (Days 10–20):
   - Launch a focused "Show HN / Product Hunt" with 3 honest screenshots and the promise of 50 free audits for the first week.

Unfair distribution channel (the thing only Credex can do)
- We ship a tiny open-source GitHub Action that scans a repo for AI SDK usage (imports, keys, SDK versions) and produces a lightweight “AI footprint” report (public gist) with a link to a Credex audit pre-filled with detected tools. Why this is unfair:
  - No other audit tool both (a) identifies actual SDK usage at repo-level and (b) converts it into a pre-filled public audit that executives can forward. This hooks directly into a developer workflow and surfaces to engineering managers who control budgets. The action is trivial to adopt (add to CI), organically surfaces in GitHub UI and PRs, and can go viral across developer teams.

Week-1 traction if this works
- Signups: 100 signups (targeted VPs + developers)
- Audits run: 60 audits completed (many from developers/engineers scanning repos)
- Shares: 150 public shares (social + Slack)
- Leads: 12 qualified leads (booked demos or email addresses with audits showing >$500/mo savings)
- Conversions (demo→paid pilot): 1–2 pilot agreements at $3k–$10k setup

If we hit these numbers the first week, we’ve proven product-market fit with an engineer-driven acquisition channel and a sales pipeline we can scale.