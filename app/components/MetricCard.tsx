'use client'

type MetricCardProps = {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  period: string
  icon: React.ReactNode
  accent: string
}

export default function MetricCard({ title, value, change, trend, period, icon, accent }: MetricCardProps) {
  const isUp = trend === 'up'

  return (
    <div style={{
      background: 'rgba(255,252,247,0.85)',
      backdropFilter: 'blur(8px)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(140,70,30,0.07), 0 8px 24px rgba(140,70,30,0.05)',
      transition: 'transform 0.16s ease, box-shadow 0.16s ease',
    }}
    onMouseEnter={e => {
      const el = e.currentTarget as HTMLDivElement
      el.style.transform = 'translateY(-2px)'
      el.style.boxShadow = '0 4px 16px rgba(140,70,30,0.1), 0 16px 40px rgba(140,70,30,0.08)'
    }}
    onMouseLeave={e => {
      const el = e.currentTarget as HTMLDivElement
      el.style.transform = 'translateY(0)'
      el.style.boxShadow = '0 2px 8px rgba(140,70,30,0.07), 0 8px 24px rgba(140,70,30,0.05)'
    }}
    >
      {/* top accent bar */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '3px',
        background: accent,
        borderRadius: '16px 16px 0 0',
        opacity: 0.75,
      }} />

      {/* icon */}
      <div style={{
        position: 'absolute',
        top: '22px',
        right: '22px',
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        background: `${accent}16`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: accent,
      }}>
        {icon}
      </div>

      {/* title */}
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
        color: 'var(--text-lo)',
        margin: '0 0 12px',
      }}>
        {title}
      </p>

      {/* value */}
      <p style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '32px',
        fontWeight: 400,
        color: 'var(--text-hi)',
        margin: '0 0 14px',
        lineHeight: 1,
        letterSpacing: '-0.02em',
      }}>
        {value}
      </p>

      {/* bottom row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '3px',
          fontFamily: 'var(--font-sans)',
          fontSize: '12px',
          fontWeight: 600,
          color: isUp ? 'var(--green)' : 'var(--red)',
          background: isUp ? 'rgba(46,125,82,0.09)' : 'rgba(184,50,50,0.09)',
          padding: '3px 9px',
          borderRadius: '20px',
        }}>
          {isUp ? (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 8V2M2 5l3-3 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 2v6M2 5l3 3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {change}
        </span>
        <span style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '12px',
          color: 'var(--text-lo)',
        }}>
          {period}
        </span>
      </div>
    </div>
  )
}
