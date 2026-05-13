import { AuditResult, Recommendation } from './ai-tools-data'

export interface SummaryResult {
  text: string
  source: 'llm' | 'fallback'
  error?: string
}

/**
 * Generate a personalized audit summary using Claude API
 * Falls back to template if API fails
 */
export async function generateAuditSummary(result: AuditResult): Promise<SummaryResult> {
  // Fallback immediately if no API key
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return generateFallbackSummary(result)
  }

  try {
    const summary = await callClaudeAPI(result, apiKey)
    return {
      text: summary,
      source: 'llm',
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('LLM summary generation failed:', errorMessage)
    
    return {
      ...generateFallbackSummary(result),
      error: errorMessage,
    }
  }
}

/**
 * Call Claude API with audit data
 */
async function callClaudeAPI(result: AuditResult, apiKey: string): Promise<string> {
  const toolsList = result.tools.map(t => t.toolId).join(', ')
  
  // Get top 2-3 recommendations
  const topRecs = result.recommendations
    .filter(r => r.recommendationType !== 'keep')
    .slice(0, 3)
  
  const topRecommendationsText = topRecs
    .map(r => `- ${r.toolName}: ${r.recommendation} (save $${r.monthlySavings}/mo)`)
    .join('\n')
  
  const topRecommendation = topRecs[0]?.recommendation || 'Optimize your AI tool stack'

  const userPrompt = `The user just completed an AI tool spending audit. Here are their results:

AUDIT SNAPSHOT:
- Tools audited: ${toolsList}
- Current monthly spend: $${result.totalMonthlySpend}/month
- Potential monthly savings: $${result.potentialMonthlySavings}/month (${result.savingsPercentage}% reduction)
- Biggest opportunity: ${topRecommendation}
- Number of recommendations: ${result.recommendations.filter(r => r.recommendationType !== 'keep').length}

TOP RECOMMENDATIONS:
${topRecommendationsText}

Based on this audit data, write a personalized 100-word summary paragraph that:
1. Acknowledges their specific tool stack
2. Highlights the top 1-2 savings opportunities
3. Explains the business impact
4. Includes a gentle call to action if savings are significant (≥$500/mo)

Respond with ONLY the summary paragraph. No preamble or explanation. Target: ~100 words.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 300,
      system: `You are a concise, friendly advisor for AI tool cost optimization. Your role is to 
summarize audit findings in a personalized, actionable way. Be specific about their 
tools and recommendations. Avoid generic advice. Focus on the biggest opportunity.
Keep tone conversational but professional.`,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Claude API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
  }

  const data = await response.json()
  const text = data.content[0]?.text || ''
  
  if (!text) {
    throw new Error('Empty response from Claude API')
  }

  return text.trim()
}

/**
 * Generate a fallback summary template
 */
function generateFallbackSummary(result: AuditResult): SummaryResult {
  const toolCount = result.tools.length
  const topRec = result.recommendations
    .filter(r => r.recommendationType !== 'keep')
    .sort((a, b) => b.monthlySavings - a.monthlySavings)[0]

  const topSavings = topRec?.monthlySavings || 0
  const topRecommendationSimple = topRec?.recommendation || 'Optimize your tool stack'

  const credexMessage = result.potentialMonthlySavings >= 500
    ? ' Credex can help implement these changes—schedule a demo to get started.'
    : ''

  const fallbackText = `You're using ${toolCount} AI tools with current monthly spend of $${result.totalMonthlySpend}. We've identified potential savings of $${result.potentialMonthlySavings}/month (${result.savingsPercentage}% reduction). Your top opportunity: ${topRecommendationSimple}, which would save approximately $${topSavings}/month.${credexMessage}`

  return {
    text: fallbackText,
    source: 'fallback',
  }
}

/**
 * Generate summary for testing (doesn't call API)
 */
export function generateTestSummary(result: AuditResult): SummaryResult {
  return generateFallbackSummary(result)
}
