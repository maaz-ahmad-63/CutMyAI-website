import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const BASE36 = '0123456789abcdefghijklmnopqrstuvwxyz'

function generateAuditId(): string {
  let id = 'aud_'
  for (let i = 0; i < 12; i++) {
    id += BASE36[Math.floor(Math.random() * 36)]
  }
  return id
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      companyName,
      tools,
      totalSpend,
      potentialSavings,
      savingsPercentage,
      recommendations,
      topRecommendation,
      toolsCount,
      userAgent,
      referrer,
    } = body

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_KEY

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: 'Storage not configured' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, serviceKey)
    const auditId = generateAuditId()

    const { error } = await supabase.from('audits').insert({
      audit_id: auditId,
      email: email || null,
      company_name: companyName || null,
      tools: tools,
      total_spend: totalSpend,
      potential_savings: potentialSavings,
      savings_percentage: savingsPercentage,
      recommendations: recommendations,
      top_recommendation: topRecommendation || null,
      tools_count: toolsCount,
    })

    if (error) {
      console.error('Failed to store audit:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ auditId })
  } catch (error) {
    console.error('Store audit error:', error)
    return NextResponse.json(
      { error: 'Failed to store audit' },
      { status: 500 }
    )
  }
}
