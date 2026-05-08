'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, TrendingDown, Shield, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/header'
import { AuditForm } from '@/components/audit-form'
import { AuditResults } from '@/components/audit-results'
import { CaptureForm } from '@/components/capture-form'
import { analyzeSpending } from '@/lib/audit-engine'
import { type UserTool, type AuditResult } from '@/lib/ai-tools-data'

export default function HomePage() {
  const router = useRouter()
  const [result, setResult] = useState<AuditResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  const handleSubmit = async (tools: UserTool[]) => {
    setIsLoading(true)
    
    // Simulate brief analysis time for UX
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const auditResult = analyzeSpending(tools)
    setResult(auditResult)
    setIsLoading(false)

    // Store result and create shareable URL
    if (typeof window !== 'undefined') {
      localStorage.setItem(`audit-${auditResult.id}`, JSON.stringify(auditResult))
      setShareUrl(`${window.location.origin}/report/${auditResult.id}`)
    }

    // Scroll to results
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="mb-8 flex flex-col items-center text-center sm:mb-12">
          <Badge variant="secondary" className="mb-4 gap-1">
            <Zap className="size-3" />
            Free AI Spend Analysis
          </Badge>
          <h1 className="mb-4 max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Stop Overpaying for AI Tools
          </h1>
          <p className="max-w-xl text-pretty text-lg text-muted-foreground">
            Most teams waste 30-50% on redundant AI subscriptions. Get an instant audit of your stack and discover exactly where to cut costs.
          </p>
          
          {/* Trust Signals */}
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <TrendingDown className="size-4 text-primary" />
              <span>Avg. $340/mo saved</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="size-4 text-primary" />
              <span>2-minute audit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="size-4 text-primary" />
              <span>No login required</span>
            </div>
          </div>
        </div>

        {/* Audit Form */}
        <AuditForm onSubmit={handleSubmit} isLoading={isLoading} />

        {/* Results Section */}
        {result && (
          <div id="results" className="mt-12 flex flex-col gap-8 scroll-mt-8">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">Your AI Savings Report</h2>
              <p className="mt-2 text-muted-foreground">
                Based on your {result.tools.length} tool{result.tools.length > 1 ? 's' : ''}, here&apos;s how to optimize your spend
              </p>
            </div>
            
            <AuditResults result={result} />
            
            <CaptureForm result={result} shareUrl={shareUrl} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card py-8">
        <div className="mx-auto max-w-4xl px-4 text-center text-sm text-muted-foreground">
          <p>CutMyAI helps teams optimize their AI tool spending.</p>
          <p className="mt-1">Built by Credex - AI Stack Optimization Experts</p>
        </div>
      </footer>
    </div>
  )
}
