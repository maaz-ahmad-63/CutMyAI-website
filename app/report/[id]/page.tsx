'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { AuditResults } from '@/components/audit-results'
import { CaptureForm } from '@/components/capture-form'
import { type AuditResult } from '@/lib/ai-tools-data'
import { Skeleton } from '@/components/ui/skeleton'

export default function ReportPage() {
  const params = useParams()
  const reportId = params.id as string
  const [result, setResult] = useState<AuditResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && reportId) {
      const stored = localStorage.getItem(`audit-${reportId}`)
      if (stored) {
        setResult(JSON.parse(stored))
      } else {
        setNotFound(true)
      }
      setLoading(false)
    }
  }, [reportId])

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/report/${reportId}`
    : ''

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
          <div className="flex flex-col gap-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </main>
      </div>
    )
  }

  if (notFound || !result) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <h1 className="mb-4 text-2xl font-bold">Report Not Found</h1>
            <p className="mb-6 text-muted-foreground">
              This report may have expired or the link is invalid.
            </p>
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 size-4" />
                Start New Audit
              </Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const formattedDate = new Date(result.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="mr-2 size-4" />
              Run New Audit
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold sm:text-3xl">AI Spend Savings Report</h1>
            <p className="mt-2 text-muted-foreground">
              Generated on {formattedDate} - {result.tools.length} tool{result.tools.length > 1 ? 's' : ''} analyzed
            </p>
          </div>
          
          <AuditResults result={result} />
          
          <CaptureForm result={result} shareUrl={shareUrl} />
        </div>
      </main>

      <footer className="border-t border-border/50 bg-card py-8">
        <div className="mx-auto max-w-4xl px-4 text-center text-sm text-muted-foreground">
          <p>CutMyAI helps teams optimize their AI tool spending.</p>
          <p className="mt-1">Built by Credex - AI Stack Optimization Experts</p>
        </div>
      </footer>
    </div>
  )
}
