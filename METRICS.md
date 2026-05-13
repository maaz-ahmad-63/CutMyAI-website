# Metrics — Credex

## North Star metric
**Completed audits that result in a qualified sales conversation** (per month).  
Why: Credex is an engineering-led, viral acquisition product; the business value derives from audits that both (a) demonstrate measurable savings and (b) produce qualified leads for sales/consulting. A completed audit that turns into a qualified conversation captures both product engagement and revenue opportunity, making it an actionable single metric that aligns product, growth, and sales.

## Three input metrics that drive the North Star
1. **Audit completion rate (%)** — percent of signups that finish the audit. This is the top-of-funnel multiplier: more completes → more potential qualified conversations. Improving UX, pre-fill, or GitHub Action pre-population will raise this.

2. **Share rate per audit** — average number of public shares / audit (social, Slack, copy). Higher share rates increase organic reach, leading to more audits and network effects.

3. **Audit→Qualified conversation conversion (%)** — percent of completed audits that lead to a vetted meeting (sales-qualified). This captures lead quality and the effectiveness of the CTA and follow-up.

## What to instrument first
1. **Audit funnel events** — `audit_started`, `audit_step_completed` (per step), `audit_completed` with metadata (tools_count, totalMonthlySpend, potentialMonthlySavings). Track timestamp, user-hash (anonymous), referrer, and traffic source. These let you compute completion rate and dropoff points.

2. **Share events** — `audit_shared` (channel), `og_clicks`, `public_view` (for shared audits). These feed viral coefficient and downstream traffic.

3. **Lead funnel** — `lead_modal_open`, `lead_submitted`, `lead_validated`, `lead_email_sent`, `lead_qualified`. Tag leads with `savings_bucket` (e.g., <$100, $100–$500, >$500) so sales can prioritize.

Implement these using lightweight event tracking (Vercel Analytics + a small event collector or Segment) and ship a daily job that aggregates to a small metrics dashboard (audit completes/day, completion rate, shares/day, leads/qualified/day).

## Pivot trigger number
If after 90 days of active acquisition (GitHub Action + community seeding + Product Hunt) we observe both:
- Audit completion rate < 10% (i.e., most signups don't finish), AND
- Audit→Qualified conversation conversion < 1% (audits are not producing sales leads),

then pivot. Rationale: Low completion indicates poor product fit or severe UX problems; low conversion despite completes indicates the product can’t create sales-ready opportunities. Both together mean the funnel is broken; we would pause acquisition and rebuild the product experience (simpler entry form, stronger validation, or deeper automation such as the GitHub Action pre-fill) before further spend.

## Summary (KPIs to watch weekly)
- Completed audits / week (goal: ramp to 200+ completed audits/week after initial growth)  
- Audit completion rate (goal: ≥40%)  
- Audit→Qualified conversation (goal: ≥5%)  
- Viral share rate (goal: ≥0.25 shares/audit)  

Tracking these gives a clear path from product improvements to revenue outcomes and informs whether the GTM channels are working.