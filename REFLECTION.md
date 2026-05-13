# Reflection

## 1. The hardest bug you hit this week, and how you debugged it

The hardest bug was the “Storage not configured” error when trying to store audit results. I was calling `storeAuditResult()` from the client, and it kept failing because `SUPABASE_SERVICE_KEY` isn’t available in the browser. My first guess was that I’d messed up the .env file or the key wasn’t loading, so I tried logging out all the env vars and double-checked the file. Everything looked fine. Then I thought maybe Next.js wasn’t picking up the env changes, so I restarted the dev server and deleted `.next`. Still broken. Finally, I realized the real issue: you can’t use server-only secrets in client-side code. The fix was to move the storage logic into a Next.js API route, so the secret stays on the server. As soon as I did that, it worked. Lesson learned: always keep secrets server-side, and don’t trust your first hypothesis.

## 2. A decision you reversed mid-week, and what made you reverse it

Originally, I tried to make the recommendation engine detect overlapping tools (like ChatGPT and Claude) using string similarity and even tried calling Claude for overlap detection. It was slow, expensive, and unreliable. After wasting a couple hours, I scrapped that and just built a simple overlap matrix in a JSON file. It’s not as “smart,” but it’s fast, transparent, and easy to update. The reversal happened after I realized the LLM approach was costing tokens and still missing obvious overlaps. Sometimes the boring solution is the right one.

## 3. What you would build in week 2 if you had it

If I had another week, I’d build an admin dashboard to view leads and audits, add analytics (like most common tools, average savings), and set up a premium tier with more detailed recommendations. I’d also add Redis for distributed rate limiting and caching, and maybe experiment with GPT-4o for even better summaries. Finally, I’d polish the UI and add more onboarding/education for users who aren’t sure what to enter.

## 4. How you used AI tools (which tool, for what tasks, what you didn’t trust them with, and one specific time the AI was wrong and you caught it)

I used ChatGPT for a lot of boilerplate (Next.js API routes, Supabase queries, Tailwind classes) and for brainstorming how to structure the audit engine. I didn’t trust it with anything security-related (env vars, RLS policies) or with the actual recommendation logic. One time, ChatGPT suggested I could use the Supabase service key in the browser (big no-no). I caught it because I know that exposes your whole database to the world. I also used Claude for generating summary text, but always had a fallback in case it failed or hallucinated.

## 5. Self-rating (1–10 scale, with reason)

- **Discipline:** 8 — I worked pretty consistently every day, but sometimes got distracted by rabbit holes (like the LLM overlap detection).
- **Code quality:** 7 — TypeScript strict mode forced me to write clean, well-typed code. I refactored a lot and kept things modular.
- **Design sense:** 7 — The UI is clean and modern, but I reused a lot of shadcn/ui defaults. Could be more unique.
- **Problem-solving:** 8 — I hit a bunch of blockers (Supabase, hCaptcha, API routes) and always found a way through, even if it took a while.
- **Entrepreneurial thinking:** 8 — Focused on viral loop, shareable results, and lead capture. Always thinking about what would make this spread or convert better.
