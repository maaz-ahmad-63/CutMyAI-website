import type { Metadata } from 'next'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  
  // For OG image, we include params that can be overridden client-side
  // This provides sensible defaults for the share preview
  const ogImageUrl = `/api/og?savings=340&annual=4080&tools=5&percent=35`

  return {
    title: 'AI Spend Savings Report - CutMyAI',
    description: 'See how much you could save on AI tools. Get personalized recommendations to optimize your AI stack and reduce spending.',
    openGraph: {
      title: 'AI Spend Savings Report - CutMyAI',
      description: 'See how much you could save on AI tools. Get personalized recommendations to optimize your AI stack.',
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: 'CutMyAI Savings Report',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Spend Savings Report - CutMyAI',
      description: 'See how much you could save on AI tools. Get personalized recommendations to optimize your AI stack.',
      images: [ogImageUrl],
    },
  }
}

export default function ReportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
