import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPublicAudit, recordAuditAccess } from '@/lib/audit-storage'
import PublicAuditResults from '@/components/public-audit-results'

interface PageProps {
  params: {
    id: string
  }
}

/**
 * Generate dynamic OG tags and metadata for social sharing
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const audit = await getPublicAudit(params.id)

  if (!audit) {
    return {
      title: 'Audit Not Found',
      description: 'The audit results you are looking for could not be found.',
    }
  }

  const title = `Save $${Math.round(audit.potential_savings)}/mo on AI tools`
  const description = `We found ${audit.tools_count} AI tools in your stack with potential savings of $${Math.round(audit.potential_savings)} per month. See the optimization opportunities.`
  const url = `${process.env.NEXT_PUBLIC_APP_URL || 'https://credex.ai'}/results/${params.id}`
  const imageUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://credex.ai'}/api/og?auditId=${params.id}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: 'AI Spend Audit Results',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default async function PublicResultsPage({ params }: PageProps) {
  const audit = await getPublicAudit(params.id)

  if (!audit) {
    notFound()
  }

  // Record this access for viral tracking
  await recordAuditAccess(params.id)

  // Pass public data only (strip email, company)
  const publicAudit = {
    auditId: audit.audit_id,
    tools: audit.tools,
    totalSpend: audit.total_spend,
    potentialSavings: audit.potential_savings,
    savingsPercentage: audit.savings_percentage,
    recommendations: audit.recommendations,
    toolsCount: audit.tools_count,
    topRecommendation: audit.top_recommendation,
    createdAt: audit.created_at,
    accessCount: audit.accessed_count,
  }

  return <PublicAuditResults audit={publicAudit} />
}
