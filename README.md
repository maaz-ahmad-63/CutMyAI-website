# CutMyAI - AI Spend Audit Tool

Stop overpaying for AI tools. Get an instant audit of your AI stack and discover where to cut costs.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The app will be available at `http://localhost:3000`

## 📋 Features

- **AI Tool Audit Form** - Add all your AI tools, plans, and team size
- **Cost Calculation** - Automatic monthly/yearly spend calculation
- **Smart Recommendations** - AI-powered suggestions to reduce spending
- **Savings Report** - Generate shareable PDF reports
- **Cost Comparison** - Compare plans and find cheaper alternatives

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── report/            # Report generation page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (audit form)
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── audit-form.tsx     # Main audit form
│   ├── audit-results.tsx  # Results display
│   ├── capture-form.tsx   # Form state management
│   ├── header.tsx         # Header component
│   └── theme-provider.tsx # Theme configuration
├── hooks/                 # Custom React hooks
│   ├── use-mobile.ts      # Mobile detection
│   └── use-toast.ts       # Toast notifications
├── lib/                   # Utilities and helpers
│   ├── ai-tools-data.ts   # AI tools database
│   ├── audit-engine.ts    # Audit calculation engine
│   └── utils.ts           # General utilities
├── styles/                # CSS stylesheets
├── public/                # Static assets
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── next.config.mjs        # Next.js config
└── postcss.config.mjs     # PostCSS config
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16.2.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Components**: Shadcn/ui
- **Icons**: Lucide React
- **Runtime**: Edge/Node.js

## 📊 How It Works

1. **Select AI Tools** - Choose from 50+ popular AI tools (ChatGPT, Claude, Gemini, etc.)
2. **Enter Plan & Costs** - Select plan tier and monthly cost per user
3. **Set Team Size** - Specify how many team members use each tool
4. **Get Results** - Instantly see total monthly/yearly spend
5. **Receive Recommendations** - Get actionable insights to reduce costs
6. **Share Report** - Generate and share detailed audit reports

## 🎯 Key Pages

- `/` - Main audit form and results
- `/report/[id]` - Shareable audit report with recommendations
- `/api/og` - Open Graph image generation

## 🔧 Configuration

### Environment Variables

Create `.env.local` if needed:

```bash
# Add any required environment variables here
```

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
