'use client'

import { useState } from 'react'
import { Mail, Calendar, ArrowRight, Copy, Check, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { type AuditResult } from '@/lib/ai-tools-data'

interface CaptureFormProps {
  result: AuditResult
  shareUrl: string
}

export function CaptureForm({ result, shareUrl }: CaptureFormProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [copied, setCopied] = useState(false)

  const isHighSavings = result.potentialAnnualSavings >= 1000

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, this would send to your email service
    setSubmitted(true)
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Share Section */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Share2 className="size-5" />
            Share Your Report
          </CardTitle>
          <CardDescription>
            Share this audit with your team or save it for later
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={shareUrl}
              readOnly
              className="font-mono text-sm"
            />
            <Button variant="outline" onClick={copyToClipboard}>
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Email Capture */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mail className="size-5" />
            Get Your Full Report
          </CardTitle>
          <CardDescription>
            {submitted 
              ? "Check your inbox for your detailed savings report!"
              : "We'll send you a detailed PDF with step-by-step instructions"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-4 text-primary">
              <Check className="size-5" />
              <span className="font-medium">Report sent to {email}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <Label htmlFor="email" className="sr-only">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="gap-2">
                Send Report
                <ArrowRight className="size-4" />
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Consultation CTA for High Savings */}
      {isHighSavings && (
        <>
          <Separator />
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="size-5 text-primary" />
                You Could Save ${result.potentialAnnualSavings.toFixed(0)}/year
              </CardTitle>
              <CardDescription>
                With potential savings this high, it&apos;s worth a 15-minute call with our AI stack experts
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-primary" />
                  Personalized optimization roadmap
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-primary" />
                  Team license negotiation tips
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-primary" />
                  Tool migration support
                </li>
              </ul>
              <Button 
                size="lg" 
                className="w-full gap-2 sm:w-auto"
                onClick={() => window.open('https://cal.com', '_blank')}
              >
                Book Free Consultation
                <Calendar className="size-4" />
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
