'use client'

import { useEffect, useState } from 'react'
import LeadCaptureModal from '@/components/lead-capture-modal'
import { ArrowDownRight, ArrowRight, TrendingDown, Check, AlertTriangle, RefreshCw, Zap, Sparkles, Loader, Share2, Copy } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { type AuditResult, type Recommendation } from '@/lib/ai-tools-data'
import { generateAuditSummary, type SummaryResult } from '@/lib/generate-summary'

interface AuditResultsProps {
  result: AuditResult
}

export function AuditResults({ result }: AuditResultsProps) {
  const [summary, setSummary] = useState<SummaryResult | null>(null)
  const [loadingSummary, setLoadingSummary] = useState(true)
  const [auditId, setAuditId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [leadModalOpen, setLeadModalOpen] = useState(false)

  useEffect(() => {
    // Generate personalized summary
    generateAuditSummary(result).then(summary => {
      setSummary(summary)
      setLoadingSummary(false)
    }).catch(error => {
      console.error('Failed to generate summary:', error)
      setLoadingSummary(false)
    })

    // Store audit for public sharing (via API)
    fetch('/api/store-audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tools: result.tools.map(t => ({
          name: t.toolName,
          plan: t.currentPlan,
          cost: t.currentCost,
        })),
        totalSpend: result.totalMonthlySpend,
        potentialSavings: result.potentialMonthlySavings,
        savingsPercentage: result.savingsPercentage,
        recommendations: result.recommendations,
        topRecommendation: result.recommendations[0]?.recommendation,
        toolsCount: result.tools.length,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
      }),
    }).then(res => res.json())
      .then(({ auditId, error }) => {
        if (auditId) {
          setAuditId(auditId)
        } else {
          console.error('Failed to store audit:', error)
        }
      })
      .catch(error => {
        console.error('Store audit request failed:', error)
      })
  }, [result])
  const highPriorityRecs = result.recommendations.filter(r => r.priority === 'high')
  const mediumPriorityRecs = result.recommendations.filter(r => r.priority === 'medium')
  const optimizedTools = result.recommendations.filter(r => r.recommendationType === 'keep')
  const actionableRecs = result.recommendations.filter(r => r.recommendationType !== 'keep')
  
  // Determine if significant savings
  const hasMajorSavings = result.potentialMonthlySavings >= 500
  const hasModestSavings = result.potentialMonthlySavings >= 100 && result.potentialMonthlySavings < 500
  const isOptimal = result.potentialMonthlySavings < 100

  return (
    <div className="flex flex-col gap-8">
      {/* HERO SECTION - Big and Clear */}
      <div className="relative overflow-hidden rounded-lg border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background px-6 py-12 sm:px-8 sm:py-16">
        {/* Background accent */}
        <div className="absolute right-0 top-0 -mr-24 -mt-24 size-48 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute left-0 bottom-0 -ml-24 -mb-24 size-48 rounded-full bg-primary/5 blur-3xl" />
        
        {/* Content */}
        <div className="relative flex flex-col items-center text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Zap className="size-3.5" />
            Savings Potential
          </div>
          
          <div className="mb-6 flex flex-col items-center">
            <div className="relative">
              <div className="text-6xl font-bold sm:text-7xl">
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  ${result.potentialMonthlySavings.toFixed(0)}
                </span>
              </div>
              <p className="mt-2 text-xl font-semibold text-muted-foreground sm:text-2xl">
                per month
              </p>
            </div>
          </div>
          
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:gap-4">
            <div className="rounded-lg bg-primary/5 px-4 py-2 text-center">
              <p className="text-sm text-muted-foreground">Annual Savings</p>
              <p className="text-2xl font-bold text-primary">
                ${result.potentialAnnualSavings.toFixed(0)}
              </p>
            </div>
            <div className="rounded-lg bg-primary/5 px-4 py-2 text-center">
              <p className="text-sm text-muted-foreground">Total Reduction</p>
              <p className="text-2xl font-bold text-primary">
                {result.savingsPercentage}%
              </p>
            </div>
          </div>
          
          <div className="w-full max-w-xs">
            <Progress value={result.savingsPercentage} className="h-2.5" />
            <div className="mt-3 flex justify-between text-xs text-muted-foreground">
              <span>Current: ${result.totalMonthlySpend}/mo</span>
              <span>Optimized: ${(result.totalMonthlySpend - result.potentialMonthlySavings).toFixed(0)}/mo</span>
            </div>
            <div className="mt-4 flex flex-col gap-2 items-center">
              <Button onClick={() => setLeadModalOpen(true)} size="sm">Get personalized recommendations</Button>
              {auditId && (
                <button
                  onClick={() => {
                    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/results/${auditId}`
                    navigator.clipboard.writeText(url)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="size-3" />
                      Shared link copied
                    </>
                  ) : (
                    <>
                      <Share2 className="size-3" />
                      Share this audit
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PERSONALIZED SUMMARY SECTION */}
      {summary && (
        <Card className={`border-2 ${summary.source === 'llm' ? 'border-purple-200 dark:border-purple-900' : 'border-amber-200 dark:border-amber-900'}`}>
          <CardContent className="py-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                {loadingSummary ? (
                  <Loader className="size-5 text-muted-foreground animate-spin" />
                ) : summary.source === 'llm' ? (
                  <Sparkles className="size-5 text-purple-600 dark:text-purple-400" />
                ) : (
                  <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {summary.source === 'llm' ? 'AI-Powered Insights' : 'Summary'}
                  </p>
                  {summary.source === 'llm' && (
                    <Badge variant="outline" className="text-xs">Generated</Badge>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-foreground">
                  {summary.text}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CONDITIONAL MESSAGING SECTION */}
      {hasMajorSavings && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold flex items-center gap-2">
                  <Sparkles className="size-5 text-primary" />
                  Unlock even more savings with Credex
                </h3>
                <p className="text-sm text-muted-foreground">
                  We found ${result.potentialMonthlySavings.toFixed(0)}/month in savings. Let us implement these changes and negotiate better rates with your vendors.
                </p>
              </div>
              <Button className="whitespace-nowrap" size="sm">
                Schedule Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isOptimal && (
        <Card className="border-green-200/50 bg-green-50 dark:border-green-900/30 dark:bg-green-950/20">
          <CardContent className="py-6">
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
                <Check className="size-5" />
                You're spending well
              </h3>
              <p className="text-sm text-green-600 dark:text-green-500">
                Your AI tool stack is already well-optimized. We'll notify you when new optimization opportunities match your tools.
              </p>
              <Button variant="outline" size="sm" className="w-fit">
                Notify me of new opportunities
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {/* PER-TOOL BREAKDOWN */}
      {actionableRecs.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">Optimization Opportunities</h2>
            <Badge className="bg-primary/20 text-primary">
              {actionableRecs.length} {actionableRecs.length === 1 ? 'action' : 'actions'}
            </Badge>
          </div>

          {/* High Priority Section */}
          {highPriorityRecs.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-warning">
                <AlertTriangle className="size-4" />
                HIGH PRIORITY
              </div>
              <div className="flex flex-col gap-3">
                {highPriorityRecs.map((rec, i) => (
                  <PerToolBreakdown key={i} recommendation={rec} />
                ))}
              </div>
            </div>
          )}

          {/* Medium Priority Section */}
          {mediumPriorityRecs.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <RefreshCw className="size-4" />
                WORTH CONSIDERING
              </div>
              <div className="flex flex-col gap-3">
                {mediumPriorityRecs.map((rec, i) => (
                  <PerToolBreakdown key={i} recommendation={rec} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Optimized Tools Section */}
      {optimizedTools.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Check className="size-5 text-green-600 dark:text-green-400" />
            <h2 className="text-lg font-semibold">Already Optimized</h2>
            <Badge variant="outline" className="ml-auto">
              {optimizedTools.length} tools
            </Badge>
          </div>
          <Card className="border-border/50 bg-green-50/30 dark:bg-green-950/10">
            <CardContent className="py-4">
              <div className="space-y-2">
                {optimizedTools.map((rec, i) => (
                  <div key={i} className="flex items-center justify-between rounded-md px-3 py-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Check className="size-4 text-green-600 dark:text-green-400" />
                      <span className="font-medium">{rec.toolName}</span>
                      <Badge variant="outline" className="text-xs">
                        {rec.currentPlan}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">${rec.currentCost}/month</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Summary Stats */}
      <Separator className="my-2" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50 bg-muted/30">
          <CardContent className="flex flex-col items-center py-4 text-center">
            <Zap className="mb-2 size-5 text-primary" />
            <span className="text-3xl font-bold">{result.tools.length}</span>
            <span className="text-sm text-muted-foreground">Tools Analyzed</span>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-muted/30">
          <CardContent className="flex flex-col items-center py-4 text-center">
            <AlertTriangle className="mb-2 size-5 text-warning" />
            <span className="text-3xl font-bold">{actionableRecs.length}</span>
            <span className="text-sm text-muted-foreground">Quick Wins Found</span>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="flex flex-col items-center py-4 text-center">
            <TrendingDown className="mb-2 size-5 text-primary" />
            <span className="text-3xl font-bold text-primary">${(result.potentialAnnualSavings / 1000).toFixed(1)}k</span>
            <span className="text-sm text-muted-foreground">Annual Savings</span>
          </CardContent>
        </Card>
      </div>
      <LeadCaptureModal isOpen={leadModalOpen} onClose={() => setLeadModalOpen(false)} savings={result.potentialMonthlySavings} toolsCount={result.tools.length} />
    </div>
  )
}

function PerToolBreakdown({ recommendation }: { recommendation: Recommendation }) {
  const getRecommendationIcon = () => {
    switch (recommendation.recommendationType) {
      case 'switch':
        return <ArrowRight className="size-5 text-blue-500" />
      case 'downgrade':
        return <ArrowDownRight className="size-5 text-orange-500" />
      case 'optimize':
        return <RefreshCw className="size-5 text-purple-500" />
      default:
        return <Check className="size-5 text-green-500" />
    }
  }

  const getRecommendationType = () => {
    switch (recommendation.recommendationType) {
      case 'switch':
        return 'Switch Tool'
      case 'downgrade':
        return 'Downgrade Plan'
      case 'optimize':
        return 'Consolidate'
      default:
        return 'Keep'
    }
  }

  const getPriorityColor = () => {
    if (recommendation.priority === 'high') {
      return 'border-warning/30 bg-warning/5'
    }
    return 'border-border/50 bg-muted/30'
  }

  return (
    <Card className={`${getPriorityColor()} border-2 transition-colors hover:border-primary/30`}>
      <CardContent className="py-4">
        <div className="flex flex-col gap-3">
          {/* Tool Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="mt-1">
                {getRecommendationIcon()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-base">{recommendation.toolName}</h3>
                  <Badge variant="outline" className="text-xs">
                    {recommendation.currentPlan}
                  </Badge>
                </div>
                <p className="mt-1 text-sm font-medium text-primary">
                  {recommendation.recommendation}
                </p>
              </div>
            </div>
            <Badge className={recommendation.priority === 'high' ? 'bg-warning text-warning-foreground' : 'bg-secondary text-secondary-foreground'}>
              Save ${recommendation.monthlySavings}/mo
            </Badge>
          </div>

          {/* Cost breakdown */}
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">Current monthly cost</div>
              <div className="font-semibold">${recommendation.currentCost}/month</div>
            </div>
            <ArrowRight className="size-4 text-muted-foreground flex-shrink-0" />
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">After optimization</div>
              <div className="font-semibold">${recommendation.newCost}/month</div>
            </div>
          </div>

          {/* Reason */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {recommendation.reason}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
