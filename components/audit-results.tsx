'use client'

import { ArrowDownRight, ArrowRight, TrendingDown, Check, AlertTriangle, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { type AuditResult, type Recommendation } from '@/lib/ai-tools-data'

interface AuditResultsProps {
  result: AuditResult
}

export function AuditResults({ result }: AuditResultsProps) {
  const highPriorityRecs = result.recommendations.filter(r => r.priority === 'high')
  const mediumPriorityRecs = result.recommendations.filter(r => r.priority === 'medium')
  const optimizedTools = result.recommendations.filter(r => r.recommendationType === 'keep')

  return (
    <div className="flex flex-col gap-6">
      {/* Savings Summary */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardDescription className="text-primary/80">Your Potential Savings</CardDescription>
          <CardTitle className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-primary sm:text-5xl">
              ${result.potentialMonthlySavings.toFixed(0)}
            </span>
            <span className="text-lg text-muted-foreground">/month</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="size-5 text-primary" />
              <span className="font-medium">
                ${result.potentialAnnualSavings.toFixed(0)} saved annually
              </span>
              <Badge variant="secondary" className="ml-auto">
                {result.savingsPercentage}% reduction
              </Badge>
            </div>
            <Progress value={result.savingsPercentage} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Current: ${result.totalMonthlySpend}/mo</span>
              <span>After optimization: ${(result.totalMonthlySpend - result.potentialMonthlySavings).toFixed(0)}/mo</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* High Priority Recommendations */}
      {highPriorityRecs.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-warning" />
            <h3 className="font-semibold">High Impact Changes</h3>
            <Badge className="bg-warning text-warning-foreground">
              Save ${highPriorityRecs.reduce((s, r) => s + r.monthlySavings, 0).toFixed(0)}/mo
            </Badge>
          </div>
          <div className="flex flex-col gap-3">
            {highPriorityRecs.map((rec, i) => (
              <RecommendationCard key={i} recommendation={rec} />
            ))}
          </div>
        </div>
      )}

      {/* Medium Priority Recommendations */}
      {mediumPriorityRecs.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <RefreshCw className="size-5 text-muted-foreground" />
            <h3 className="font-semibold">Worth Considering</h3>
          </div>
          <div className="flex flex-col gap-3">
            {mediumPriorityRecs.map((rec, i) => (
              <RecommendationCard key={i} recommendation={rec} />
            ))}
          </div>
        </div>
      )}

      {/* Optimized Tools */}
      {optimizedTools.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Check className="size-5 text-primary" />
            <h3 className="font-semibold">Already Optimized</h3>
          </div>
          <Card className="border-border/50">
            <CardContent className="py-4">
              <div className="flex flex-wrap gap-2">
                {optimizedTools.map((rec, i) => (
                  <Badge key={i} variant="outline" className="gap-1">
                    <Check className="size-3" />
                    {rec.toolName} - {rec.currentPlan}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Separator className="my-2" />

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center py-4 text-center">
            <span className="text-3xl font-bold">{result.tools.length}</span>
            <span className="text-sm text-muted-foreground">Tools Analyzed</span>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center py-4 text-center">
            <span className="text-3xl font-bold">{result.recommendations.filter(r => r.recommendationType !== 'keep').length}</span>
            <span className="text-sm text-muted-foreground">Optimization Opportunities</span>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center py-4 text-center">
            <span className="text-3xl font-bold text-primary">${result.potentialAnnualSavings.toFixed(0)}</span>
            <span className="text-sm text-muted-foreground">Annual Savings Potential</span>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const getTypeIcon = () => {
    switch (recommendation.recommendationType) {
      case 'switch':
        return <ArrowRight className="size-4" />
      case 'downgrade':
        return <ArrowDownRight className="size-4" />
      case 'optimize':
        return <RefreshCw className="size-4" />
      default:
        return <Check className="size-4" />
    }
  }

  const getTypeBadge = () => {
    switch (recommendation.recommendationType) {
      case 'switch':
        return <Badge variant="secondary">Switch Tool</Badge>
      case 'downgrade':
        return <Badge variant="secondary">Downgrade</Badge>
      case 'optimize':
        return <Badge variant="secondary">Optimize</Badge>
      default:
        return <Badge variant="outline">Keep</Badge>
    }
  }

  return (
    <Card className="border-border/50">
      <CardContent className="flex flex-col gap-3 py-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {getTypeIcon()}
            <span className="font-medium">{recommendation.toolName}</span>
            <span className="text-sm text-muted-foreground">({recommendation.currentPlan})</span>
          </div>
          {getTypeBadge()}
        </div>
        
        <p className="text-sm text-muted-foreground">{recommendation.reason}</p>
        
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Current:</span>
            <span className="font-medium">${recommendation.currentCost}/mo</span>
          </div>
          <ArrowRight className="size-4 text-muted-foreground" />
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">After:</span>
            <span className="font-medium">${recommendation.newCost}/mo</span>
          </div>
          {recommendation.monthlySavings > 0 && (
            <Badge className="ml-auto bg-primary/10 text-primary">
              Save ${recommendation.monthlySavings}/mo
            </Badge>
          )}
        </div>
        
        <div className="rounded-md bg-muted/50 px-3 py-2">
          <p className="text-sm font-medium">{recommendation.recommendation}</p>
        </div>
      </CardContent>
    </Card>
  )
}
