export interface AITool {
  id: string
  name: string
  category: 'llm' | 'image' | 'code' | 'video' | 'audio' | 'productivity'
  plans: {
    name: string
    monthlyPrice: number
    features: string[]
  }[]
  alternatives?: {
    toolId: string
    savingsPercent: number
    reason: string
  }[]
}

export interface UserTool {
  toolId: string
  plan: string
  monthlyCost: number
  teamSize: number
  useCase: string
}

export interface AuditResult {
  id: string
  createdAt: string
  tools: UserTool[]
  totalMonthlySpend: number
  recommendations: Recommendation[]
  potentialMonthlySavings: number
  potentialAnnualSavings: number
  savingsPercentage: number
}

export interface Recommendation {
  toolId: string
  toolName: string
  currentPlan: string
  currentCost: number
  recommendationType: 'downgrade' | 'switch' | 'optimize' | 'keep'
  recommendation: string
  newCost: number
  monthlySavings: number
  reason: string
  priority: 'high' | 'medium' | 'low'
}

export const AI_TOOLS: AITool[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: 'llm',
    plans: [
      { name: 'Free', monthlyPrice: 0, features: ['GPT-3.5', 'Limited messages'] },
      { name: 'Plus', monthlyPrice: 20, features: ['GPT-4', 'DALL-E', 'Plugins'] },
      { name: 'Team', monthlyPrice: 30, features: ['Admin controls', 'Higher limits'] },
      { name: 'Enterprise', monthlyPrice: 60, features: ['Custom deployment', 'SSO'] },
      { name: 'API Direct', monthlyPrice: 0, features: ['Pay-as-you-go', 'GPT-4'] },
    ],
    alternatives: [
      { toolId: 'claude', savingsPercent: 0, reason: 'Better for long-form writing and analysis' },
      { toolId: 'gemini', savingsPercent: 100, reason: 'Free tier is very capable for most tasks' },
    ],
  },
  {
    id: 'claude',
    name: 'Claude',
    category: 'llm',
    plans: [
      { name: 'Free', monthlyPrice: 0, features: ['Claude 3 Sonnet', 'Limited messages'] },
      { name: 'Pro', monthlyPrice: 20, features: ['Claude 3 Opus', 'Higher limits'] },
      { name: 'Max', monthlyPrice: 30, features: ['Claude 3 Opus Max', 'Extended context'] },
      { name: 'Team', monthlyPrice: 30, features: ['Admin controls', 'Artifacts'] },
      { name: 'Enterprise', monthlyPrice: 60, features: ['Custom deployment'] },
      { name: 'API Direct', monthlyPrice: 0, features: ['Pay-as-you-go', 'Claude 3'] },
    ],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    category: 'llm',
    plans: [
      { name: 'Free', monthlyPrice: 0, features: ['Gemini Pro', 'Google integration'] },
      { name: 'Pro', monthlyPrice: 20, features: ['Gemini Pro', 'Higher limits'] },
      { name: 'Ultra', monthlyPrice: 30, features: ['Gemini Ultra', 'Advanced features'] },
      { name: 'API', monthlyPrice: 0, features: ['Pay-as-you-go', 'Gemini Pro'] },
    ],
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    category: 'code',
    plans: [
      { name: 'Individual', monthlyPrice: 10, features: ['Code completions', 'Chat'] },
      { name: 'Business', monthlyPrice: 19, features: ['Organization policies', 'IP indemnity'] },
      { name: 'Enterprise', monthlyPrice: 39, features: ['Fine-tuned models', 'Security'] },
    ],
  },
  {
    id: 'cursor',
    name: 'Cursor',
    category: 'code',
    plans: [
      { name: 'Hobby', monthlyPrice: 0, features: ['Limited completions', 'Basic chat'] },
      { name: 'Pro', monthlyPrice: 20, features: ['Unlimited completions', 'GPT-4'] },
      { name: 'Business', monthlyPrice: 40, features: ['Team features', 'Admin'] },
      { name: 'Enterprise', monthlyPrice: 100, features: ['Custom deployment', 'SSO'] },
    ],
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    category: 'code',
    plans: [
      { name: 'Free', monthlyPrice: 0, features: ['Limited completions', 'Basic features'] },
      { name: 'Pro', monthlyPrice: 25, features: ['Unlimited completions', 'Agentic features'] },
    ],
  },
  {
    id: 'anthropic-api',
    name: 'Anthropic API',
    category: 'llm',
    plans: [
      { name: 'API Direct', monthlyPrice: 0, features: ['Pay-as-you-go', 'Claude 3 models'] },
    ],
  },
  {
    id: 'openai-api',
    name: 'OpenAI API',
    category: 'llm',
    plans: [
      { name: 'API Direct', monthlyPrice: 0, features: ['Pay-as-you-go', 'GPT-4 & GPT-3.5'] },
    ],
  },
  {
    id: 'codeium',
    name: 'Codeium',
    category: 'code',
    plans: [
      { name: 'Individual', monthlyPrice: 0, features: ['Unlimited completions', 'Chat'] },
      { name: 'Teams', monthlyPrice: 15, features: ['Admin controls', 'Analytics'] },
      { name: 'Enterprise', monthlyPrice: 30, features: ['Self-hosted', 'SSO'] },
    ],
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    category: 'image',
    plans: [
      { name: 'Basic', monthlyPrice: 10, features: ['200 generations/mo', 'Slow mode'] },
      { name: 'Standard', monthlyPrice: 30, features: ['Unlimited relaxed', '15hr fast'] },
      { name: 'Pro', monthlyPrice: 60, features: ['30hr fast', 'Stealth mode'] },
      { name: 'Mega', monthlyPrice: 120, features: ['60hr fast', 'Priority support'] },
    ],
  },
  {
    id: 'dalle',
    name: 'DALL-E',
    category: 'image',
    plans: [
      { name: 'Pay-as-you-go', monthlyPrice: 15, features: ['API access', 'High quality'] },
      { name: 'With ChatGPT Plus', monthlyPrice: 20, features: ['Bundled with GPT-4'] },
    ],
  },
  {
    id: 'ideogram',
    name: 'Ideogram',
    category: 'image',
    plans: [
      { name: 'Free', monthlyPrice: 0, features: ['25 generations/day'] },
      { name: 'Basic', monthlyPrice: 7, features: ['400 generations/mo'] },
      { name: 'Plus', monthlyPrice: 16, features: ['1000 generations/mo'] },
      { name: 'Pro', monthlyPrice: 48, features: ['Unlimited', 'API access'] },
    ],
  },
  {
    id: 'jasper',
    name: 'Jasper',
    category: 'productivity',
    plans: [
      { name: 'Creator', monthlyPrice: 49, features: ['1 seat', 'Brand voice'] },
      { name: 'Pro', monthlyPrice: 69, features: ['1 seat', 'Art generation'] },
      { name: 'Business', monthlyPrice: 125, features: ['Custom', 'API access'] },
    ],
  },
  {
    id: 'notion-ai',
    name: 'Notion AI',
    category: 'productivity',
    plans: [
      { name: 'Add-on', monthlyPrice: 10, features: ['AI writing', 'Summaries'] },
    ],
  },
  {
    id: 'grammarly',
    name: 'Grammarly',
    category: 'productivity',
    plans: [
      { name: 'Free', monthlyPrice: 0, features: ['Basic grammar'] },
      { name: 'Premium', monthlyPrice: 12, features: ['Advanced suggestions', 'Tone'] },
      { name: 'Business', monthlyPrice: 15, features: ['Team features', 'Analytics'] },
    ],
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    category: 'audio',
    plans: [
      { name: 'Free', monthlyPrice: 0, features: ['10k characters/mo'] },
      { name: 'Starter', monthlyPrice: 11, features: ['100k characters/mo'] },
      { name: 'Creator', monthlyPrice: 22, features: ['100k characters/mo'] },
      { name: 'Pro', monthlyPrice: 99, features: ['500k characters/mo', 'API'] },
    ],
  },
  {
    id: 'otter',
    name: 'Otter.ai',
    category: 'audio',
    plans: [
      { name: 'Basic', monthlyPrice: 0, features: ['300 mins/mo'] },
      { name: 'Pro', monthlyPrice: 17, features: ['1200 mins/mo', 'Custom vocab'] },
      { name: 'Business', monthlyPrice: 30, features: ['6000 mins/mo', 'Admin'] },
    ],
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    category: 'llm',
    plans: [
      { name: 'Free', monthlyPrice: 0, features: ['Basic search', 'Limited Pro'] },
      { name: 'Pro', monthlyPrice: 20, features: ['Unlimited Pro', 'File upload'] },
      { name: 'Enterprise', monthlyPrice: 40, features: ['SSO', 'Admin controls'] },
    ],
    alternatives: [
      { toolId: 'gemini', savingsPercent: 100, reason: 'Gemini has excellent web search built-in' },
    ],
  },
  {
    id: 'runway',
    name: 'Runway',
    category: 'video',
    plans: [
      { name: 'Free', monthlyPrice: 0, features: ['Limited generations'] },
      { name: 'Standard', monthlyPrice: 15, features: ['20 min/mo generation', 'HD export'] },
      { name: 'Pro', monthlyPrice: 30, features: ['40 min/mo generation', '4K export'] },
      { name: 'Enterprise', monthlyPrice: 100, features: ['Unlimited', 'API access'] },
    ],
  },
]

export const USE_CASES = [
  'Coding / Development',
  'Writing / Content Creation',
  'Data Analysis / Research',
  'Customer Support',
  'Marketing & Copy',
  'Design & Creative',
  'Sales & Outreach',
  'Education & Training',
  'Personal Productivity',
  'Mixed',
  'Other',
]

export function getToolById(id: string): AITool | undefined {
  return AI_TOOLS.find(tool => tool.id === id)
}

export function getToolsByCategory(category: AITool['category']): AITool[] {
  return AI_TOOLS.filter(tool => tool.category === category)
}
