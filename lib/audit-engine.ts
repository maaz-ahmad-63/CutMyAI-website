import { UserTool, AuditResult, Recommendation, getToolById, AI_TOOLS } from './ai-tools-data'
import { nanoid } from 'nanoid'

export function analyzeSpending(tools: UserTool[]): AuditResult {
  const recommendations: Recommendation[] = []
  let totalMonthlySpend = 0

  for (const userTool of tools) {
    const toolData = getToolById(userTool.toolId)
    if (!toolData) continue

    const teamCost = userTool.monthlyCost * userTool.teamSize
    totalMonthlySpend += teamCost

    const recommendation = generateRecommendation(userTool, teamCost)
    if (recommendation) {
      recommendations.push(recommendation)
    }
  }

  // Sort by savings potential
  recommendations.sort((a, b) => b.monthlySavings - a.monthlySavings)

  const potentialMonthlySavings = recommendations.reduce(
    (sum, rec) => sum + rec.monthlySavings,
    0
  )

  return {
    id: nanoid(10),
    createdAt: new Date().toISOString(),
    tools,
    totalMonthlySpend,
    recommendations,
    potentialMonthlySavings,
    potentialAnnualSavings: potentialMonthlySavings * 12,
    savingsPercentage: totalMonthlySpend > 0 
      ? Math.round((potentialMonthlySavings / totalMonthlySpend) * 100) 
      : 0,
  }
}

function generateRecommendation(userTool: UserTool, teamCost: number): Recommendation | null {
  const toolData = getToolById(userTool.toolId)
  if (!toolData) return null

  const currentPlan = toolData.plans.find(p => p.name === userTool.plan)
  if (!currentPlan) return null

  // Check for downgrade opportunities
  const downgradePlan = toolData.plans.find(
    p => p.monthlyPrice < currentPlan.monthlyPrice && p.monthlyPrice > 0
  )

  // Check for switch opportunities
  const alternatives = toolData.alternatives || []
  const bestAlternative = alternatives.find(alt => alt.savingsPercent > 0)
  const altTool = bestAlternative ? getToolById(bestAlternative.toolId) : null

  // Usage-based recommendations
  const useCaseMismatch = detectUseCaseMismatch(userTool, toolData.category)
  
  // Determine recommendation type
  if (bestAlternative && altTool && bestAlternative.savingsPercent >= 50) {
    const newCost = Math.round(teamCost * (1 - bestAlternative.savingsPercent / 100))
    return {
      toolId: userTool.toolId,
      toolName: toolData.name,
      currentPlan: userTool.plan,
      currentCost: teamCost,
      recommendationType: 'switch',
      recommendation: `Switch to ${altTool.name}`,
      newCost,
      monthlySavings: teamCost - newCost,
      reason: bestAlternative.reason,
      priority: bestAlternative.savingsPercent >= 70 ? 'high' : 'medium',
    }
  }

  if (useCaseMismatch && downgradePlan) {
    const newCost = downgradePlan.monthlyPrice * userTool.teamSize
    return {
      toolId: userTool.toolId,
      toolName: toolData.name,
      currentPlan: userTool.plan,
      currentCost: teamCost,
      recommendationType: 'downgrade',
      recommendation: `Downgrade to ${downgradePlan.name} plan`,
      newCost,
      monthlySavings: teamCost - newCost,
      reason: `Your use case (${userTool.useCase}) may not require ${userTool.plan} features`,
      priority: 'medium',
    }
  }

  // Check if enterprise features are unused for small teams
  if (userTool.teamSize <= 3 && (userTool.plan === 'Enterprise' || userTool.plan === 'Business')) {
    const teamPlan = toolData.plans.find(p => 
      p.name === 'Team' || p.name === 'Pro' || p.name === 'Standard'
    )
    if (teamPlan && teamPlan.monthlyPrice < currentPlan.monthlyPrice) {
      const newCost = teamPlan.monthlyPrice * userTool.teamSize
      return {
        toolId: userTool.toolId,
        toolName: toolData.name,
        currentPlan: userTool.plan,
        currentCost: teamCost,
        recommendationType: 'downgrade',
        recommendation: `Downgrade to ${teamPlan.name} plan`,
        newCost,
        monthlySavings: teamCost - newCost,
        reason: `With ${userTool.teamSize} user${userTool.teamSize > 1 ? 's' : ''}, you likely don't need enterprise features`,
        priority: 'high',
      }
    }
  }

  // Check for overlapping tools
  const overlappingTools = findOverlappingTools(userTool)
  if (overlappingTools.length > 0) {
    return {
      toolId: userTool.toolId,
      toolName: toolData.name,
      currentPlan: userTool.plan,
      currentCost: teamCost,
      recommendationType: 'optimize',
      recommendation: 'Consolidate tools',
      newCost: 0,
      monthlySavings: teamCost,
      reason: `This tool overlaps with ${overlappingTools.join(', ')} - consider consolidating`,
      priority: 'medium',
    }
  }

  // Tool is well-optimized
  if (currentPlan.monthlyPrice <= 20 || userTool.teamSize >= 5) {
    return {
      toolId: userTool.toolId,
      toolName: toolData.name,
      currentPlan: userTool.plan,
      currentCost: teamCost,
      recommendationType: 'keep',
      recommendation: 'Keep current plan',
      newCost: teamCost,
      monthlySavings: 0,
      reason: 'This tool appears well-optimized for your needs',
      priority: 'low',
    }
  }

  return null
}

function detectUseCaseMismatch(userTool: UserTool, category: string): boolean {
  const useCaseMap: Record<string, string[]> = {
    'Content Creation': ['llm', 'image', 'video', 'audio', 'productivity'],
    'Software Development': ['code', 'llm'],
    'Marketing & Copy': ['llm', 'productivity', 'image'],
    'Research & Analysis': ['llm'],
    'Customer Support': ['llm', 'audio'],
    'Data Analysis': ['llm'],
    'Design & Creative': ['image', 'video'],
    'Sales & Outreach': ['llm', 'productivity'],
    'Education & Training': ['llm', 'video', 'audio'],
    'Personal Productivity': ['llm', 'productivity'],
  }

  const validCategories = useCaseMap[userTool.useCase] || []
  return !validCategories.includes(category)
}

function findOverlappingTools(userTool: UserTool): string[] {
  // This would be more sophisticated in production
  // For now, detect common overlaps
  const toolData = getToolById(userTool.toolId)
  if (!toolData) return []

  const overlaps: string[] = []
  
  // LLM tools often overlap
  if (toolData.category === 'llm') {
    const llmTools = AI_TOOLS.filter(t => t.category === 'llm' && t.id !== userTool.toolId)
    // In a real app, we'd check the user's full tool list
  }

  return overlaps
}

export function generateShareableId(result: AuditResult): string {
  return result.id
}
