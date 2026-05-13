'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'

interface LeadCaptureModalProps {
  isOpen: boolean
  onClose: () => void
  savings?: number
  toolsCount?: number
}

export default function LeadCaptureModal({ isOpen, onClose, savings = 0, toolsCount = 0 }: LeadCaptureModalProps) {
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [role, setRole] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [hcaptchaToken, setHcaptchaToken] = useState<string | null>(null)
  const widgetRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<number | null>(null)

  const siteKey = (process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY as string) || ''

  useEffect(() => {
    if (!siteKey) return
    // load script
    if (!(window as any).hcaptcha) {
      const s = document.createElement('script')
      s.src = 'https://js.hcaptcha.com/1/api.js'
      s.async = true
      s.defer = true
      document.head.appendChild(s)
      s.onload = () => {
        renderWidget()
      }
    } else {
      renderWidget()
    }

    function renderWidget() {
      try {
        if (!(window as any).hcaptcha || !widgetRef.current) return
        // render invisible widget
        widgetIdRef.current = (window as any).hcaptcha.render(widgetRef.current, {
          sitekey: siteKey,
          size: 'invisible',
          callback: (token: string) => {
            setHcaptchaToken(token)
          },
        })
      } catch (e) {
        console.warn('hCaptcha render failed', e)
      }
    }
  }, [siteKey])

  useEffect(() => {
    if (!isOpen) {
      // reset state when closing
      setEmail('')
      setCompanyName('')
      setRole('')
      setTeamSize('')
      setLoading(false)
      setError(null)
      setSuccess(false)
      setHcaptchaToken(null)
    }
  }, [isOpen])

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    setError(null)

    if (!email) {
      setError('Email is required')
      return
    }

    setLoading(true)

    try {
      // If siteKey exists but no token yet, execute widget
      if (siteKey && !(hcaptchaToken && hcaptchaToken.length > 0)) {
        if ((window as any).hcaptcha && widgetIdRef.current != null) {
          (window as any).hcaptcha.execute(widgetIdRef.current)
          // token will be set via callback; wait for it (simple loop)
          const token = await waitForToken(8000)
          if (!token) {
            setError('Captcha verification failed')
            setLoading(false)
            return
          }
        }
      }

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          companyName,
          role,
          teamSize,
          hcaptchaToken,
          auditData: { toolsCount, savings, createdAt: new Date().toISOString() },
          savings,
          toolsCount,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || 'Submission failed')
        setLoading(false)
        return
      }

      setSuccess(true)
      setLoading(false)
      // auto-close after short delay
      setTimeout(() => {
        onClose()
      }, 2500)
    } catch (err) {
      setError((err as Error).message || 'Unknown error')
      setLoading(false)
    }
  }

  function waitForToken(ms: number) {
    return new Promise<string | null>((resolve) => {
      const start = Date.now()
      const interval = setInterval(() => {
        if (hcaptchaToken) {
          clearInterval(interval)
          resolve(hcaptchaToken)
        } else if (Date.now() - start > ms) {
          clearInterval(interval)
          resolve(null)
        }
      }, 200)
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-w-md w-full rounded-lg bg-white p-6 shadow-lg">
        <h3 className="text-lg font-semibold">Get recommendations and a follow-up</h3>
        <p className="text-sm text-muted-foreground mt-1">We'll email a copy of your audit and reach out for high-savings cases.</p>

        <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
          <label className="text-xs font-medium">Email</label>
          <input className="w-full rounded-md border px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@company.com" required />

          <label className="text-xs font-medium">Company (optional)</label>
          <input className="w-full rounded-md border px-3 py-2" value={companyName} onChange={e => setCompanyName(e.target.value)} />

          <label className="text-xs font-medium">Role (optional)</label>
          <input className="w-full rounded-md border px-3 py-2" value={role} onChange={e => setRole(e.target.value)} />

          <label className="text-xs font-medium">Team size (optional)</label>
          <select className="w-full rounded-md border px-3 py-2" value={teamSize} onChange={e => setTeamSize(e.target.value)}>
            <option value="">Select</option>
            <option value="1-5">1-5</option>
            <option value="6-25">6-25</option>
            <option value="26-100">26-100</option>
            <option value="100+">100+</option>
          </select>

          {/* hidden hcaptcha container */}
          <div ref={widgetRef} style={{ display: 'none' }} />

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">Thanks! Check your email.</p>}

          <div className="mt-3 flex items-center gap-2">
            <Button onClick={() => handleSubmit()} disabled={loading}>{loading ? 'Sending...' : 'Submit'}</Button>
            <Button variant="ghost" onClick={onClose}>Close</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
