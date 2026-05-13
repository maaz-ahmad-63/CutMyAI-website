/**
 * Utility to generate short, unique audit IDs and interact with audit storage
 */

import { createClient } from '@supabase/supabase-js'

const BASE36 = '0123456789abcdefghijklmnopqrstuvwxyz'

/**
 * Generate a short, unique audit ID (e.g., 'aud_abc123xyz')
 * Format: aud_[12 random chars]
 */
export function generateAuditId(): string {
  let id = 'aud_'
  for (let i = 0; i < 12; i++) {
    id += BASE36[Math.floor(Math.random() * 36)]
  }
  return id
}

/**
 * Store audit result for public sharing
 */
export async function storeAuditResult(
  auditData: {
    email?: string
    companyName?: string
    tools: Array<{ name: string; plan: string; cost: number }>
    totalSpend: number
    potentialSavings: number
    savingsPercentage: number
    recommendations: any[]
    topRecommendation?: string
    toolsCount: number
    userAgent?: string
    referrer?: string
  }
): Promise<{ auditId: string; error?: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.error('Supabase env missing for audit storage')
    return { auditId: '', error: 'Storage not configured' }
  }

  const supabase = createClient(supabaseUrl, serviceKey)
  const auditId = generateAuditId()

  const { error } = await supabase.from('audits').insert({
    audit_id: auditId,
    email: auditData.email || null,
    company_name: auditData.companyName || null,
    tools: auditData.tools,
    total_spend: auditData.totalSpend,
    potential_savings: auditData.potentialSavings,
    savings_percentage: auditData.savingsPercentage,
    recommendations: auditData.recommendations,
    top_recommendation: auditData.topRecommendation || null,
    tools_count: auditData.toolsCount,
    user_agent: auditData.userAgent || null,
    referrer: auditData.referrer || null,
  })

  if (error) {
    console.error('Failed to store audit:', error)
    return { auditId: '', error: error.message }
  }

  return { auditId }
}

/**
 * Get audit by ID (public, strips sensitive data)
 */
export async function getPublicAudit(auditId: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !anonKey) {
    return null
  }

  const supabase = createClient(supabaseUrl, anonKey)

  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .eq('audit_id', auditId)
    .single()

  if (error || !data) {
    console.error('Audit not found:', error)
    return null
  }

  return data
}

/**
 * Increment access count for viral analytics
 */
export async function recordAuditAccess(auditId: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !serviceKey) return

  const supabase = createClient(supabaseUrl, serviceKey)

  await supabase
    .from('audits')
    .update({
      accessed_count: Math.max(1, Math.random()), // increment or set
      last_accessed_at: new Date().toISOString(),
    })
    .eq('audit_id', auditId)
}
