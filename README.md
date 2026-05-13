# Credex - AI Spend Optimization Audit

**Credex is an AI-powered audit tool that analyzes your AI tool stack and recommends cost-saving opportunities.** Users submit their current AI tools, plans, and team size, and receive personalized recommendations to reduce spending by 20-60%. Results are shareable via unique public URLs with viral loop design (social proof badges, Twitter/LinkedIn previews).

**Built for:** CTOs, CFOs, and finance teams managing enterprise AI tool spending.

---

## 📸 Screenshots & Demo

### Key Screens

1. **Audit Form** - Add tools, plans, team size
   ![Audit Form Screenshot](./public/screenshots/1-audit-form.png)

2. **Results Page** - Savings breakdown with annual projections
   ![Results Screenshot](./public/screenshots/2-results-savings.png)

3. **Optimization Opportunities** - Detailed recommendations with before/after costs
   ![Opportunities Screenshot](./public/screenshots/3-optimization-opportunities.png)

4. **Share & Report** - Shareable URL, lead capture, social proof metrics
   ![Share Screenshot](./public/screenshots/4-share-report.png)

---

## 🚀 Quick Start

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Set up environment (see .env.local.example)
cp .env.local.example .env.local
# Fill in your Supabase credentials and API keys

# 3. Start dev server
npm run dev

# 4. Open http://localhost:3000
```

### Database Setup

Go to [Supabase Dashboard](https://app.supabase.com) → SQL Editor and run:

```sql
-- Create audits table
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id TEXT UNIQUE NOT NULL,
  email TEXT,
  company_name TEXT,
  tools JSONB,
  total_spend NUMERIC,
  potential_savings NUMERIC,
  savings_percentage NUMERIC,
  recommendations JSONB,
  top_recommendation TEXT,
  tools_count INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  accessed_count INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP
);

-- Create leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  company_name TEXT,
  role TEXT,
  team_size TEXT,
  audit_data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  contacted_at TIMESTAMP
);

CREATE INDEX idx_audits_audit_id ON audits(audit_id);
```

### Production Deployment

```bash
# Deploy to Vercel (recommended)
vercel deploy

# Set environment variables in Vercel Dashboard
# Then deploy will auto-publish
```

---

## 🎯 Key Features

- ✅ **8+ AI Tools Database** - ChatGPT, Claude, Gemini, Perplexity, etc.
- ✅ **Smart Audit Engine** - Analyzes spending, detects overlaps, recommends consolidation
- ✅ **LLM-Powered Summaries** - Claude 3.5 generates personalized ~100-word insights
- ✅ **Shareable Results** - Unique URL per audit with OG tags for social preview
- ✅ **Lead Capture** - Email collection with Resend transactional emails
- ✅ **Bot Protection** - hCaptcha + IP-based rate limiting (5 leads/24h)
- ✅ **Viral Loop** - Social proof badges (shows when >5 views), Twitter/LinkedIn share buttons
- ✅ **Cost Comparison** - Recommends cheaper plans/tools automatically

---

## 🏗️ Architecture

**Frontend**: Next.js 16 (React 19) + TypeScript strict mode + Tailwind CSS  
**Backend**: Next.js API Routes (serverless edge runtime)  
**Database**: Supabase PostgreSQL with RLS  
**LLM**: Anthropic Claude 3.5 Sonnet (~$0.01 per summary)  
**Email**: Resend ($0/100 per day free)  
**Storage**: Supabase (audit results, leads)

See [ARCHITECTURE.md](./ARCHITECTURE.md) for complete technical details.

---

## 🔄 Decision Trade-offs

### 1. **Next.js over Vue/Svelte**
- **Trade-off**: Larger framework vs. smaller learning curve
- **Why**: Full-stack advantage (API routes + middleware), edge runtime for OG image generation, built-in ISR for faster static generation
- **Alternative rejected**: Vue (smaller ecosystem for headless components)

### 2. **Supabase PostgreSQL over Firebase**
- **Trade-off**: Manage row-level security vs. Firebase's simpler auth
- **Why**: Transparent pricing (no surprise bills), full SQL power, better for complex queries, supports JSONB for flexible tool schemas
- **Alternative rejected**: Firebase (too expensive at scale, limited SQL)

### 3. **Claude API over GPT-4**
- **Trade-off**: ~2x cost but available to all vs. GPT-4 ($0.03/1K input, $0.06/1K output)
- **Why**: Consistent rate limits, faster response time (5-sec timeout works well), claude-3.5-sonnet has best speed/cost ratio
- **Alternative rejected**: GPT-4 (more unpredictable costs, rate limits tighter)

### 4. **Graceful LLM Fallback over Required LLM**
- **Trade-off**: Less personalized if Claude fails, but app always works
- **Why**: Reduces dependency on external APIs, improves UX reliability, cost control (optional feature)
- **Alternative rejected**: Require Claude (would block audit completion)

### 5. **hCaptcha + IP Rate-Limit over just Rate-Limit**
- **Trade-off**: Extra friction for human users vs. no false-positives from bots
- **Why**: Dual protection (hidden hCaptcha on first submit), privacy-first (GDPR), prevents thousands of spam leads
- **Alternative rejected**: Rate-limit only (insufficient against automated attacks)

---

## 📊 How It Works

1. **User submits audit form** (tools, plans, team size)
2. **Backend calculates savings** using recommendation engine
3. **Claude generates personalized summary** (with fallback)
4. **Audit stored with unique ID** in Supabase
5. **Public URL generated** (e.g., `/results/aud_abc123xyz`)
6. **Share buttons appear** (Twitter, LinkedIn, copy link)
7. **Access counter increments** when others view
8. **Social proof badge** shows at 5+ views ("X people viewed this")
9. **Lead capture modal** collects email for follow-up

---

## 📝 Environment Variables

Required for local development (see `.env.local.example`):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...

# App URL (for share links)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Email, LLM, Bot Protection
RESEND_API_KEY=re_xxx
ANTHROPIC_API_KEY=sk-ant-xxx
HCAPTCHA_SECRET_KEY=xxx
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=xxx
```

---

## 📈 Performance & Compliance

- ✅ **Lighthouse Targets**: Performance ≥85, Accessibility ≥90, Best Practices ≥90
- ✅ **TypeScript**: 100% strict mode (no implicit any)
- ✅ **Security**: No secrets in repo (all env vars), hCaptcha bot protection, RLS on database
- ✅ **Privacy**: GDPR compliant (hCaptcha is privacy-first, no tracking)
- ✅ **Uptime**: Vercel auto-scaling, Supabase managed PostgreSQL

---

## 🌐 Live Demo

**[Deployed URL - Add your live link here](https://credex-ai.vercel.app)**

---

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Complete tech stack & design details
- [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) - Deployment verification

---

## 💡 Future Enhancements

- [ ] Team management (multiple users per audit)
- [ ] Usage tracking (API calls, actual spending per tool)
- [ ] Comparison reports (before/after optimization)
- [ ] Zapier integration (auto-forward recommendations)
- [ ] Analytics dashboard (trending savings, popular tools)

---

## 👨‍💼 Author

Built by [Your Name] | [GitHub](https://github.com/yourusername) | [LinkedIn](https://linkedin.com/in/yourprofile)

---

**License:** MIT

1. **Select AI Tools** - Choose from 50+ popular AI tools (ChatGPT, Claude, Gemini, etc.)
2. **Enter Plan & Costs** - Select plan tier and monthly cost per user
3. **Set Team Size** - Specify how many team members use each tool
4. **Get Results** - Instantly see total monthly/yearly spend
5. **Receive Recommendations** - Get actionable insights to reduce costs
6. **Share Report** - Generate and share detailed audit reports

## 🎯 Key Pages

- `/` - Main audit form and results
- `/results/[id]` - Public shareable audit (no email/company shown)
- `/api/og` - Open Graph image generation
- `/api/leads` - Lead capture API (POST)

## 🔧 Configuration

### Lead Capture & Email Setup

For lead capture to work, add to `.env.local`:

```bash
# Supabase (required for audit storage + lead capture)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_KEY=xxx

# Resend (required for transactional emails)
RESEND_API_KEY=re_xxx

# hCaptcha (optional, improves abuse protection)
HCAPTCHA_SECRET_KEY=xxx
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=xxx

# App URL (for generating shareable links)
NEXT_PUBLIC_APP_URL=https://credex.ai
```

**Setup Guide:**
1. [Supabase](SUPABASE_SCHEMA.md) - Create database + tables
2. [Lead Capture](LEAD_CAPTURE.md) - hCaptcha + rate limiting strategy
3. [Shareable URLs](SHAREABLE_URLS.md) - Viral loop design + OG tags

### LLM Summary Feature

For AI-powered personalized summaries, add:

```bash
# Anthropic API key (required for LLM-generated summaries)
ANTHROPIC_API_KEY=sk-ant-...
```

**Without `ANTHROPIC_API_KEY`:**
- The app still works fully
- Audit results use templated summaries instead of LLM-generated ones
- No errors or warnings - graceful fallback

**Get an API key:**
1. Visit https://console.anthropic.com
2. Create an account
3. Generate an API key
4. Add to `.env.local`

See `PROMPTS.md` for full system/user prompts.

### Deployment

The app is ready for deployment on:
- Vercel (recommended)
- Netlify
- Any Node.js hosting

```bash
npm run build
```

## 📝 Development

### File Formats

- **Components**: `.tsx` (React with TypeScript)
- **Utilities**: `.ts` (TypeScript)
- **Styles**: Tailwind CSS classes (no separate CSS files)

### Adding New AI Tools

Edit `lib/ai-tools-data.ts`:

```typescript
export const aiTools = [
  {
    id: 'tool-name',
    name: 'Tool Name',
    category: 'Category',
    plans: [
      { name: 'Plan Name', costPerUser: 20 }
    ]
  }
  // Add more tools...
]
```

## 🚀 Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm start

# Deploy to Vercel
vercel
```

## 📦 Dependencies

Main dependencies:
- `react` - UI framework
- `react-dom` - DOM utilities
- `next` - Server framework
- `tailwindcss` - Styling
- `@radix-ui/*` - UI components
- `lucide-react` - Icons

## 🤝 Support

For issues or questions, refer to:
- Next.js docs: https://nextjs.org/docs
- Tailwind docs: https://tailwindcss.com/docs
- TypeScript docs: https://www.typescriptlang.org/docs

## 📄 License

Built by Credex - AI Stack Optimization Experts
