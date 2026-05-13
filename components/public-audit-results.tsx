'use client'

import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Copy, Share2, Zap, TrendingDown } from 'lucide-react'

interface PublicAuditResultsProps {
  audit: {
    auditId: string
    tools: Array<{ name: string; plan: string; cost: number }>
    totalSpend: number
    potentialSavings: number
    savingsPercentage: number
    toolsCount: number
    topRecommendation?: string
    createdAt: string
    accessCount?: number
  }
}

export default function PublicAuditResults({ audit }: PublicAuditResultsProps) {
  const [copied, setCopied] = useState(false)
  const publicUrl = typeof window !== 'undefined' ? window.location.href : ''

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [publicUrl])

  const shareTwitter = () => {
    const text = `I just audited my AI spending and found $${Math.round(audit.potentialSavings)}/month in potential savings across ${audit.toolsCount} tools. 🤖💰 Check your own stack:`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(publicUrl)}`
    window.open(url, '_blank')
  }

  const shareLinkedIn = () => {
    const text = `I analyzed my AI tool stack using Credex and discovered $${Math.round(audit.potentialSavings)}/month in optimization opportunities.`
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-6 py-12">
          <div className="absolute right-0 top-0 -mr-24 -mt-24 size-48 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute left-0 bottom-0 -ml-24 -mb-24 size-48 rounded-full bg-primary/5 blur-3xl" />

          <div className="relative text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Zap className="size-3.5" />
              Savings Found
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold">
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                ${Math.round(audit.potentialSavings)}
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">per month in potential savings</p>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <div className="rounded-lg bg-white/50 dark:bg-slate-900/50 px-4 py-3">
                <p className="text-sm text-muted-foreground">Tools Analyzed</p>
                <p className="text-2xl font-bold">{audit.toolsCount}</p>
              </div>
              <div className="rounded-lg bg-white/50 dark:bg-slate-900/50 px-4 py-3">
                <p className="text-sm text-muted-foreground">Cost Reduction</p>
                <p className="text-2xl font-bold text-primary">{Math.round(audit.savingsPercentage)}%</p>
              </div>
              <div className="rounded-lg bg-white/50 dark:bg-slate-900/50 px-4 py-3">
                <p className="text-sm text-muted-foreground">Annual Savings</p>
                <p className="text-2xl font-bold text-primary">
                  ${Math.round(audit.potentialSavings * 12 / 1000)}k
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tools Breakdown */}
        <Card>
          <CardContent className="py-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Zap className="size-4" /> AI Tools Found
            </h2>
            <div className="grid gap-3">
              {audit.tools.map((tool, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{tool.name}</p>
                    <p className="text-xs text-muted-foreground">{tool.plan}</p>
                  </div>
                  <p className="font-semibold">${tool.cost}/mo</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground">Total monthly spend</p>
              <p className="text-2xl font-bold">${Math.round(audit.totalSpend)}/mo</p>
            </div>
          </CardContent>
        </Card>

        {/* CTA - Get Analysis */}
        <Card className="border-2 border-primary bg-gradient-to-r from-primary/5 to-transparent">
          <CardContent className="py-6">
            <h3 className="font-semibold mb-2">Want a detailed analysis like this?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Run your own audit to see specific optimization recommendations for your tools.
            </p>
            <Button className="w-full sm:w-auto">Start Your Audit</Button>
          </CardContent>
        </Card>

        {/* Social Proof - Access Count (Viral Loop) */}
        {audit.accessCount && audit.accessCount > 5 && (
          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200/50">
            <CardContent className="py-4">
              <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                ✨ {audit.accessCount} people have viewed this audit
              </p>
            </CardContent>
          </Card>
        )}

        {/* Share Section - Prominent and Viral */}
        <Card className="border-2 border-amber-200/50 bg-amber-50/30 dark:border-amber-900/30 dark:bg-amber-950/10">
          <CardContent className="py-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Share2 className="size-4" />
              Share This Audit
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Help your peers find AI spending optimizations. Share this audit to your network.
            </p>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={publicUrl}
                  className="flex-1 px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-sm"
                />
                <Button size="sm" variant="outline" onClick={copyToClipboard}>
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={shareTwitter} className="flex-1">
                  Twitter
                </Button>
                <Button size="sm" variant="outline" onClick={shareLinkedIn} className="flex-1">
                  LinkedIn
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer - Credibility */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Powered by Credex AI Spend Optimization</p>
          <p className="text-xs">Audit conducted on {new Date(audit.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}
