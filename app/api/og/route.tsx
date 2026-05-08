import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const savings = searchParams.get('savings') || '0'
  const annual = searchParams.get('annual') || '0'
  const tools = searchParams.get('tools') || '0'
  const percent = searchParams.get('percent') || '0'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fafc',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: '60px 80px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            border: '1px solid #e2e8f0',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#059669',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px',
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <span
              style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#0f172a',
              }}
            >
              CutMyAI
            </span>
          </div>

          <div
            style={{
              fontSize: '24px',
              color: '#64748b',
              marginBottom: '16px',
            }}
          >
            AI Spend Savings Report
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              marginBottom: '8px',
            }}
          >
            <span
              style={{
                fontSize: '72px',
                fontWeight: '800',
                color: '#059669',
              }}
            >
              ${savings}
            </span>
            <span
              style={{
                fontSize: '28px',
                color: '#64748b',
                marginLeft: '8px',
              }}
            >
              /month savings
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '32px',
              marginTop: '24px',
              fontSize: '20px',
              color: '#475569',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontWeight: '600' }}>${annual}</span>
              <span style={{ marginLeft: '6px' }}>/year potential</span>
            </div>
            <div
              style={{
                width: '1px',
                height: '24px',
                backgroundColor: '#e2e8f0',
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontWeight: '600' }}>{tools}</span>
              <span style={{ marginLeft: '6px' }}>tools analyzed</span>
            </div>
            <div
              style={{
                width: '1px',
                height: '24px',
                backgroundColor: '#e2e8f0',
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontWeight: '600' }}>{percent}%</span>
              <span style={{ marginLeft: '6px' }}>reduction</span>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: '32px',
            fontSize: '18px',
            color: '#64748b',
          }}
        >
          cutmyai.vercel.app - Free AI Spend Audit
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
