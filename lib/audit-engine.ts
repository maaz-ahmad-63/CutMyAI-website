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

    // Pass full tools array for overlap detection
    const recommendation = generateRecommendation(userTool, teamCost, tools)
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

function generateRecommendation(userTool: UserTool, teamCost: number, allTools: UserTool[]): Recommendation | null {
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
  
  // Check for overlapping tools (NEW: Pass full tools array)
  const overlappingTools = findOverlappingTools(userTool, allTools)
  if (overlappingTools.length > 0) {
    const totalRedundantCost = overlappingTools.reduce((sum, toolName) => {
      const redundantTool = allTools.find(t => getToolById(t.toolId)?.name === toolName)
      if (redundantTool) {
        return sum + (redundantTool.monthlyCost * redundantTool.teamSize)
      }
      return sum
    }, 0)

    return {
      toolId: userTool.toolId,
      toolName: toolData.name,
      currentPlan: userTool.plan,
      currentCost: teamCost,
      recommendationType: 'optimize',
      recommendation: 'Consolidate redundant tools',
      newCost: teamCost, // Keep primary tool
      monthlySavings: totalRedundantCost,
      reason: `You have ${overlappingTools.length} overlapping ${toolData.category} tools: ${toolData.name}, ${overlappingTools.join(', ')}. Consider consolidating to one primary tool and eliminating $${totalRedundantCost.toFixed(2)}/month in redundant costs.`,
      priority: 'high',
    }
  }

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
      reason: `${bestAlternative.reason}. Current cost: $${teamCost}/month, Alternative cost: $${newCost}/month.`,
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
      reason: `Your primary use case is ${userTool.useCase}, which doesn't require ${userTool.plan} features. ${downgradePlan.name} plan ($${downgradePlan.monthlyPrice}/month) includes the features you need.`,
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
      const downgradeSavings = teamCost - newCost
      return {
        toolId: userTool.toolId,
        toolName: toolData.name,
        currentPlan: userTool.plan,
        currentCost: teamCost,
        recommendationType: 'downgrade',
        recommendation: `Downgrade to ${teamPlan.name} plan`,
        newCost,
        monthlySavings: downgradeSavings,
        reason: `With only ${userTool.teamSize} user${userTool.teamSize > 1 ? 's' : ''}, enterprise features (SSO, advanced admin controls, SLA) are likely unnecessary. ${teamPlan.name} plan ($${teamPlan.monthlyPrice}/month/user) provides sufficient capabilities, saving $${downgradeSavings}/month.`,
        priority: 'high',
      }
    }
  }

  // Tool is well-optimized (defensible reasoning)
  return {
    toolId: userTool.toolId,
    toolName: toolData.name,
    currentPlan: userTool.plan,
    currentCost: teamCost,
    recommendationType: 'keep',
    recommendation: 'Keep current plan',
    newCost: teamCost,
    monthlySavings: 0,
    reason: `This ${toolData.name} ${userTool.plan} plan appears appropriate for your use case (${userTool.useCase}) with ${userTool.teamSize} team member${userTool.teamSize > 1 ? 's' : ''}.`,
    priority: 'low',
  }
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

function findOverlappingTools(userTool: UserTool, allTools: UserTool[]): string[] {
  const toolData = getToolById(userTool.toolId)
  if (!toolData) return []

  const overlaps: string[] = []

  // Check for overlapping tools by category
  const toolsInSameCategory = allTools.filter(t => {
    if (t.toolId === userTool.toolId) return false
    const otherTool = getToolById(t.toolId)
    return otherTool && otherTool.category === toolData.category
  })

  // For LLM tools, detect multiple similar tools
  if (toolData.category === 'llm' && toolsInSameCategory.length > 0) {
    overlaps.push(...toolsInSameCategory.map(t => getToolById(t.toolId)?.name || '').filter(Boolean))
  }

  // For code tools, detect multiple similar tools
  if (toolData.category === 'code' && toolsInSameCategory.length > 0) {
    overlaps.push(...toolsInSameCategory.map(t => getToolById(t.toolId)?.name || '').filter(Boolean))
  }

  return overlaps
}

export function generateShareableId(result: AuditResult): string {
  return result.id
}
