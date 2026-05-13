# LLM Prompts and Rationale

This document records the exact prompts used with Anthropic Claude (primary) and guidelines for fallbacks.

## System Prompt (used as the 'system' / assistant persona)

You are a concise, professional AI Spend Analyst named Credex Assistant. Your job is to read a short audit summary that includes the customer's tool list, current monthly spend, and generated recommendations, and produce a single-paragraph summary (about 60–110 words) with the following requirements:

- Tone: friendly, professional, and succinct.
- Structure: One lead sentence with the headline finding (savings amount and percent), one sentence summarizing the top recommendation, and one sentence with an actionable next step (e.g., "Consider downgrading to X plan or consolidating to Y").
- Output constraints: Maximum 120 words, no code blocks, no lists, no URLs, do not invent contact emails or phone numbers, do not make unverifiable claims.
- Safety: If the audit data is incomplete, say so briefly and recommend the next action to collect required info.

Examples of desired tone:
- "We found potential savings of $87/month (74%) — the biggest win is downgrading GitHub Copilot from Enterprise to Individual. To act, review user admin needs and migrate non-admins to the Individual plan."

## User Prompt (sent with the audit payload)

Audit data:
- `totalMonthlySpend`: {{totalMonthlySpend}}
- `potentialMonthlySavings`: {{potentialMonthlySavings}}
- `savingsPercentage`: {{savingsPercentage}}
- `topRecommendation`: {{topRecommendation}} (string)
- `recommendations`: list of recommendations (toolName, recommendationType, monthlySavings)

Instruction to model:
"Write a concise, one-paragraph summary of the audit results for a busy engineering leader. Mention the total monthly spend, the projected monthly savings and percentage, name the single top recommendation and why it matters, and finish with a clear next step. Keep it friendly and avoid marketing language. Maximum 120 words. If any required fields are missing, briefly say which ones and suggest a step to obtain them."

## Generation Parameters
- Model: Claude 3.5 Sonnet (or equivalent)
- Max tokens / length: 300 (server-side safety cap)
- Response timeout: 5 seconds (client enforces)
- Temperature: 0.2 (deterministic, factual)

## Why these prompts were written this way
- Single-paragraph, constrained length: executives want a single, skimmable takeaway that fits in an email or Slack message.
- Tone constraints: avoids sounding like a salesperson or overconfident AI; keeps recommendations defensible.
- Low temperature: reduces hallucinations for factual summaries tied to numeric data.
- Explicit safety rules: prevents the model from inventing contact info or claims about vendor agreements.

## What I tried that didn't work
1. Long-form multi-paragraph prompts: When I asked for a 3-paragraph output (headline, analysis, steps) the model often produced too-verbose output that didn't fit UI slots and sometimes repeated numbers.
2. Asking the model to compute numeric aggregates: Initially I had Claude compute monthly/annual totals; it sometimes rounded differently than our engine, leading to mismatches. I switched to sending precomputed numeric values and asking the model to rephrase them.
3. Very high temperature (0.7): produced creative but sometimes inaccurate reasons for recommendations. Staying low (0.2) fixed consistency.
4. Letting the model pick the "top recommendation" algorithmically: when I asked it to rank recommendations, it used fuzzy criteria and occasionally picked low-impact items. I now determine top recommendation server-side (based on monthlySavings) and pass it in.

## Fallback template (used when LLM fails or times out)

"We analyzed your AI tool stack and found estimated savings of ${{potentialMonthlySavings}} per month ({{savingsPercentage}}% reduction) from a current spend of ${{totalMonthlySpend}}/mo. The top opportunity is: {{topRecommendation}}. Next step: review the recommended change and implement in your billing/admin console."

## Security & Cost Notes
- Keep API calls aggregated and rate-limited; Claude calls cost money per request.
- Do not send PII to the LLM (strip emails/company names before calling if privacy required).

---

If you want, I can add the raw HTTP request examples, headers, and client-side code used to call Claude (Anthropic) and the exact fallback handling logic.

