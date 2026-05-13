import { describe, expect, it, vi } from 'vitest'
import { analyzeSpending, generateShareableId } from '@/lib/audit-engine'
import type { UserTool } from '@/lib/ai-tools-data'

vi.mock('nanoid', () => ({
  nanoid: () => 'mock-audit-id',
}))

const makeTool = (tool: UserTool): UserTool => tool

describe('audit engine', () => {
  it('keeps a well-matched free tool as-is', () => {
    const result = analyzeSpending([
      makeTool({
        toolId: 'chatgpt',
        plan: 'Free',
        monthlyCost: 0,
        teamSize: 1,
        useCase: 'Personal Productivity',
      }),
    ])

    expect(result.id).toBe('mock-audit-id')
    expect(result.totalMonthlySpend).toBe(0)
    expect(result.potentialMonthlySavings).toBe(0)
    expect(result.potentialAnnualSavings).toBe(0)
    expect(result.recommendations).toHaveLength(1)
    expect(result.recommendations[0]).toMatchObject({
      recommendationType: 'keep',
      recommendation: 'Keep current plan',
      monthlySavings: 0,
    })
  })

  it('downgrades when the use case does not need the current plan', () => {
    const result = analyzeSpending([
      makeTool({
        toolId: 'jasper',
        plan: 'Business',
        monthlyCost: 125,
        teamSize: 1,
        useCase: 'Coding / Development',
      }),
    ])

    expect(result.totalMonthlySpend).toBe(125)
    expect(result.potentialMonthlySavings).toBe(76)
    expect(result.savingsPercentage).toBe(61)
    expect(result.recommendations[0]).toMatchObject({
      recommendationType: 'downgrade',
      recommendation: 'Downgrade to Creator plan',
      newCost: 49,
      monthlySavings: 76,
      priority: 'medium',
    })
  })

  it('flags overlapping llm tools for consolidation', () => {
    const result = analyzeSpending([
      makeTool({
        toolId: 'chatgpt',
        plan: 'Plus',
        monthlyCost: 20,
        teamSize: 3,
        useCase: 'Writing / Content Creation',
      }),
      makeTool({
        toolId: 'claude',
        plan: 'Pro',
        monthlyCost: 20,
        teamSize: 2,
        useCase: 'Writing / Content Creation',
      }),
    ])

    expect(result.totalMonthlySpend).toBe(100)
    expect(result.recommendations).toHaveLength(2)
    expect(result.recommendations[0]).toMatchObject({
      recommendationType: 'optimize',
      recommendation: 'Consolidate redundant tools',
      monthlySavings: 60,
    })
    expect(result.recommendations[0].reason).toContain('overlapping llm tools')
  })

  it('switches to a better alternative when the savings are big enough', () => {
    const result = analyzeSpending([
      makeTool({
        toolId: 'perplexity',
        plan: 'Enterprise',
        monthlyCost: 40,
        teamSize: 1,
        useCase: 'Mixed',
      }),
    ])

    expect(result.totalMonthlySpend).toBe(40)
    expect(result.recommendations[0]).toMatchObject({
      recommendationType: 'switch',
      recommendation: 'Switch to Gemini',
      newCost: 0,
      monthlySavings: 40,
      priority: 'high',
    })
  })

  it('sorts recommendations by savings and computes totals correctly', () => {
    const result = analyzeSpending([
      makeTool({
        toolId: 'perplexity',
        plan: 'Enterprise',
        monthlyCost: 40,
        teamSize: 1,
        useCase: 'Mixed',
      }),
      makeTool({
        toolId: 'copilot',
        plan: 'Enterprise',
        monthlyCost: 39,
        teamSize: 3,
        useCase: 'Coding / Development',
      }),
    ])

    expect(result.totalMonthlySpend).toBe(157)
      expect(result.potentialMonthlySavings).toBe(127)
      expect(result.potentialAnnualSavings).toBe(1524)
      expect(result.savingsPercentage).toBe(81)
      expect(result.recommendations.map(rec => rec.monthlySavings)).toEqual([87, 40])
    expect(result.recommendations[0].toolId).toBe('copilot')
    expect(result.recommendations[1].toolId).toBe('perplexity')
      expect(result.recommendations[0]).toMatchObject({
        recommendationType: 'downgrade',
        recommendation: 'Downgrade to Individual plan',
        monthlySavings: 87,
      })
  })
})

describe('generateShareableId', () => {
  it('returns the audit id unchanged', () => {
    expect(generateShareableId({ id: 'aud_test123', createdAt: '', tools: [], totalMonthlySpend: 0, recommendations: [], potentialMonthlySavings: 0, potentialAnnualSavings: 0, savingsPercentage: 0 })).toBe('aud_test123')
  })
})