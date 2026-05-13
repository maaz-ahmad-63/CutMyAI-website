import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-client'
import { validateHCaptcha } from '@/lib/validate-hcaptcha'
import { checkRateLimit } from '@/lib/rate-limit'
import { sendLeadConfirmationEmail, sendAdminNotification } from '@/lib/send-email'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      email,
      companyName,
      role,
      teamSize,
      hcaptchaToken,
      auditData,
      savings = 0,
      toolsCount = 0,
    } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, error: 'Missing email' }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email' }, { status: 400 })
    }

    // hCaptcha verification (will short-circuit in development if not configured)
    if (hcaptchaToken) {
      const captcha = await validateHCaptcha(hcaptchaToken)
      if (!captcha.valid) {
        return NextResponse.json({ success: false, error: `Captcha failed: ${captcha.error || 'unknown'}` }, { status: 400 })
      }
    }

    // Rate limit by IP
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip') || 'unknown'
    const rl = checkRateLimit(ip)
    if (!rl.success) {
      return NextResponse.json({ success: false, error: rl.message }, { status: 429 })
    }

    // Insert into Supabase
    const supabase = supabaseServer()

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      console.error('Supabase env missing')
      return NextResponse.json({ success: false, error: 'Storage not configured' }, { status: 500 })
    }

    const insertPayload = {
      email,
      company_name: companyName || null,
      role: role || null,
      team_size: teamSize || null,
      audit_data: auditData || null,
      source: 'audit-results',
      ip_address: ip,
    }

    const { data, error } = await supabase.from('leads').insert([insertPayload]).select('id').single()

    if (error) {
      // Handle duplicate email gracefully
      const msg = (error as any).message || 'Supabase insert failed'
      if (msg.toLowerCase().includes('duplicate') || (error as any).code === '23505') {
        return NextResponse.json({ success: false, error: 'Email already captured' }, { status: 409 })
      }
      console.error('Supabase error:', error)
      return NextResponse.json({ success: false, error: 'Storage error' }, { status: 500 })
    }

    // Send confirmation email (best-effort)
    const emailResult = await sendLeadConfirmationEmail({
      email,
      companyName,
      savings,
      toolsCount,
      topRecommendation: (auditData && auditData.topRecommendation) || undefined,
    })

    // If high savings, notify internal leads team
    const parsedSavings = Number(savings || 0)
    if (parsedSavings >= 500) {
      await sendAdminNotification(email, parsedSavings, companyName)
    }

    return NextResponse.json({ success: true, leadId: data?.id || null, emailSent: emailResult.success })
  } catch (err) {
    console.error('API error', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
