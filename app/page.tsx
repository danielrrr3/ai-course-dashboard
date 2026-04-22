import MetricCard from './components/MetricCard'
import { metrics } from '../frontend-sample-data'

const cardConfig = [
  {
    title: 'Total Revenue',
    value: metrics[0].value,
    change: metrics[0].change,
    trend: metrics[0].trend as 'up' | 'down',
    period: metrics[0].period,
    accent: '#C4532A',   /* terracotta */
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <circle cx="8.5" cy="8.5" r="7" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M8.5 5v7M6 7C6 6.2 7.1 5.5 8.5 5.5S11 6.2 11 7c0 2-5 1.6-5 3.7 0 .9.9 1.8 2.5 1.8s2.5-.8 2.5-1.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Active Users',
    value: metrics[3].value,
    change: metrics[3].change,
    trend: metrics[3].trend as 'up' | 'down',
    period: metrics[3].period,
    accent: '#7A6080',   /* mountain purple */
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <circle cx="6.5" cy="5.5" r="2.8" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M1.5 14.5c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="13" cy="5" r="1.8" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M14.5 12.5c0-1.8-.9-3-2.5-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Growth Rate',
    value: '+36.4%',
    change: '+4.1%',
    trend: 'up' as const,
    period: '6-month trend',
    accent: '#B8902A',   /* golden fields */
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <polyline points="2,13 5.5,8 9,10 15,4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="11.5,4 15,4 15,7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'AI Insights',
    value: '24',
    change: '+6',
    trend: 'up' as const,
    period: 'generated this month',
    accent: '#5A7A5E',   /* soft sage green from the grass */
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <path d="M8.5 2L10.3 6.7H15.3L11.3 9.7L12.8 14.7L8.5 11.8L4.2 14.7L5.7 9.7L1.7 6.7H6.7L8.5 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

export default function Dashboard() {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>

      {/* Painted-sky hero banner */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '44px 52px 48px',
        background: 'linear-gradient(160deg, #E8906A 0%, #D4785A 20%, #C4A07A 45%, #A89090 65%, #C8B090 80%, #E0C898 100%)',
      }}>
        {/* mountain silhouette layer */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '55%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(247,238,228,0.6) 60%, var(--bg) 100%)',
          pointerEvents: 'none',
        }} />
        {/* soft cloud blobs */}
        <div style={{
          position: 'absolute',
          top: '-40px', right: '-40px',
          width: '280px', height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,220,190,0.5) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          top: '10px', left: '30%',
          width: '180px', height: '120px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,160,200,0.3) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.75)',
            marginBottom: '10px',
          }}>
            Overview
          </p>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '38px',
            fontWeight: 400,
            color: '#FFF8F0',
            margin: '0 0 10px',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            textShadow: '0 1px 12px rgba(120,50,20,0.25)',
          }}>
            Dashboard
          </h1>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
            color: 'rgba(255,248,240,0.8)',
            margin: 0,
            fontWeight: 400,
          }}>
            Riyadh Roast — February 2026 performance summary
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '32px 52px 44px' }}>

        {/* Metric cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}>
          {cardConfig.map(card => (
            <MetricCard key={card.title} {...card} />
          ))}
        </div>

        {/* Activity */}
        <div style={{
          background: 'rgba(255,252,247,0.8)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 2px 8px rgba(140,70,30,0.06), 0 8px 24px rgba(140,70,30,0.04)',
        }}>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-lo)',
            margin: '0 0 22px',
          }}>
            Activity
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '72px' }}>
            {[42,68,55,80,61,73,90,65,78,55,70,85,60,74,88,50,66,79,58,72].map((h, i) => (
              <div key={i} style={{
                flex: 1,
                height: `${h}%`,
                background: i === 19
                  ? 'var(--accent)'
                  : `rgba(196,83,42,${0.07 + (h / 100) * 0.22})`,
                borderRadius: '3px 3px 0 0',
              }} />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
