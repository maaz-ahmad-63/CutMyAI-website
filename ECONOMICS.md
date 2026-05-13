# Economics — Credex

Below are unit-economics with clear assumptions and spreadsheet-style math. All numbers are estimates to make decisions, not promises.

## Key assumptions
- Founder hourly cost = $100/hr (opportunity cost for marketing/dev time).  
- Average one-time paid pilot (professional services) = $3,000.  
- Average first-year subscription/recurring revenue per converted customer = $1,200 (team plan or multi-seat licenses).  
- Average first-year revenue per paying customer = pilot + subscription = $4,200.  
- Expected lifetime (paid) revenue (LTV) ≈ $6,000 (1.5 years average retention).  
- Conversion funnel (baseline): Audit completed → Consultation booked = 20%  
  Consultation → Paid pilot = 25%  
  Therefore Audit → Paid = 0.20 * 0.25 = 5%.

## What a converted lead is worth
- First-year revenue per converted paying customer = $4,200 (pilot $3,000 + $1,200 subscription).  
- Lifetime revenue (LTV) ≈ $6,000.

So each converted lead (a paying customer) is worth ~$4.2k in year one and ~$6k over the lifetime.

## CAC per channel (zero paid budget but time costs)
We estimate time needed to get first 100 signups (from GTM plan) and assign founder-hour cost ($100/hr).

1) GitHub Action (open-source integration) — build + docs + first integrations
- Time: 12 hours dev + 4 hours docs/outreach = 16 hrs → cost = 16 * $100 = $1,600
- Estimated signups attributable: 30
- CAC = $1,600 / 30 ≈ $53 per signup

2) Community seeding (r/saas, Hacker News, Slack posting)
- Time: 10 hours (craft posts, engage threads, replies) → cost = $1,000
- Estimated signups attributable: 25
- CAC = $1,000 / 25 = $40 per signup

3) Twitter/LinkedIn threads + DMs
- Time: 8 hours (writing threads, DMs to 50 VPs) → cost = $800
- Estimated signups attributable: 20
- CAC = $800 / 20 = $40 per signup

4) Product Hunt / Indie Hackers launch effort
- Time: 6 hours prep + launch-day engagement 6 hours = 12 hrs → $1,200
- Estimated signups attributable: 15
- CAC = $1,200 / 15 = $80 per signup

5) Organic sharing (audit-generated OG images)
- Time: minimal ongoing; treat as viral: 2 hours setup → $200
- Estimated signups attributable: 10
- CAC = $200 / 10 = $20 per signup

Weighted total (100 signups): total cost = $4,800 → average CAC ≈ $48 per signup.

Note: a “signup” = audit started / audit completed conversion varies; if only 60/100 complete the audit, adjust CAC per completed audit upward accordingly.

## Profitability per audit (spreadsheet math)
- Revenue per paid customer (year 1) = $4,200.  
- With Audit → Paid = 5%, expected revenue per audit = 0.05 * $4,200 = $210.  
- If average CAC per audit (from above) = $48, profit per audit (expected) = $210 - $48 = $162 (positive).

Break-even audit→paid conversion needed if CAC = $48 and ARPU = $4,200:
- Required conversion rate = CAC / ARPU = 48 / 4200 ≈ 1.14% (i.e., if ≥1.14% of audits convert to paid in year 1, CAC is covered).

## Path to $1M ARR in 18 months
Goal: $1,000,000 ARR in 18 months. Assume ARR ≈ annual recurring revenue from subscriptions only (conservative) or recurring+rollover pilots.

Case A — Conservative (ARR from ongoing subscriptions only):
- Average annual subscription per customer = $1,200.  
- Required paying customers = 1,000,000 / 1,200 ≈ 834 customers.
- With Audit → Paid = 5%, required audits = 834 / 0.05 = 16,680 audits over 18 months ≈ 926 audits/month ≈ 31/day.

Case B — Mix pilots + subscriptions aggregated into ARR (use first-year revenue per customer $4,200 as ARR proxy for ramp):
- Required paying customers to reach $1M revenue = 1,000,000 / 4,200 ≈ 238 paying customers.
- Required audits = 238 / 0.05 = 4,760 audits → 4,760 / 18 ≈ 265 audits/month ≈ 9 audits/day.

Which is plausible?
- With the GitHub Action channel and caching + community seeding, hitting ~30 completed audits/day is achievable once scale mechanics (Redis caching, queueing LLM jobs) are in place.

## Sensitivity & Risks
- If conversion Audit→Paid drops to 2.5%, audits needed double.  
- If founder-hour valuation is lower ($50/hr), CAC halves improving economics.  
- Major risk: LTV is dominated by pilots; if pilots don’t convert to recurring subscriptions, ARR growth slows.

## Bottom line
- Baseline economics look promising: expected revenue per audit ($210) > estimated CAC ($48), implying positive unit economics at baseline assumptions.  
- To hit $1M ARR in 18 months conservatively requires either (A) ~31 completed audits/day (ARR-only view) or (B) ~9 audits/day if pilots count toward first-year revenue.  

