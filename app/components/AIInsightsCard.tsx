'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  getDashboardMetrics,
  getMonthlyData,
  getCategoryData,
  getFeedbackSummary,
  getLowStockItems,
  getTopCustomers,
} from '../../lib/data'
import { useLang } from '../../lib/lang'

const ANGLES = [
  'what is going well',
  'what to watch',
  'biggest opportunity',
  'biggest risk',
  'what changed vs. last period',
] as const

type Angle = (typeof ANGLES)[number]

const ANGLE_COLORS: Record<Angle, string> = {
  'what is going well':        '#2E7D52',
  'what to watch':             '#B8902A',
  'biggest opportunity':       '#5A7A5E',
  'biggest risk':              '#B83232',
  'what changed vs. last period': '#7A6080',
}

const CACHE_KEY = 'insights_cache'
const CACHE_TTL = 24 * 60 * 60 * 1000

interface Cache {
  bullets: string[]
  angle: Angle
  ts: number
  lang: string
}

function parseBullets(text: string): string[] {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const bulletLines = lines.filter(l => /^[•\-\*]|\d+[.\)]/.test(l))
  const source = bulletLines.length >= 3 ? bulletLines : lines
  return source
    .slice(0, 3)
    .map(l => l.replace(/^\*\*/, '').replace(/\*\*$/, '').replace(/^[•\-\*\d]+[.\):\s]*\s*/, '').trim())
}

function timeAgo(ts: number): string {
  const m = Math.floor((Date.now() - ts) / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m} min ago`
  const h = Math.floor(m / 60)
  return h === 1 ? '1 hr ago' : `${h} hrs ago`
}

function angleLabel(angle: Angle, s: ReturnType<typeof useLang>['s']): string {
  switch (angle) {
    case 'what is going well':        return s.goingWell
    case 'what to watch':             return s.watch
    case 'biggest opportunity':       return s.opportunity
    case 'biggest risk':              return s.risk
    case 'what changed vs. last period': return s.vsLastPeriod
  }
}

export default function AIInsightsCard() {
  const { lang, s } = useLang()
  const [cache, setCache] = useState<Cache | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const fetchInsights = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [metrics, monthlyData, categoryData, feedbackSummary, lowStock, topCustomers] =
        await Promise.all([
          getDashboardMetrics(),
          getMonthlyData(),
          getCategoryData(),
          getFeedbackSummary(),
          getLowStockItems(),
          getTopCustomers(),
        ])

      const angle = ANGLES[Math.floor(Math.random() * ANGLES.length)]

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `Focus on: "${angle}". Reply with exactly 3 bullet points using • as the bullet character. Be specific with numbers from the data. Keep each bullet under 25 words. Do not add any intro text or conclusion — bullets only.`,
          data: { metrics, monthlyData, categoryData, feedbackSummary, lowStock, topCustomers },
          language: lang,
        }),
      })

      if (!res.ok) throw new Error('API error')
      const { answer, error: apiError } = await res.json()
      if (apiError) throw new Error(apiError)

      const bullets = parseBullets(answer)
      const entry: Cache = { bullets, angle, ts: Date.now(), lang }
      localStorage.setItem(CACHE_KEY, JSON.stringify(entry))
      setCache(entry)
    } catch {
      setError(s.couldNotLoadInsights)
    } finally {
      setLoading(false)
    }
  }, [lang, s])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CACHE_KEY)
      if (stored) {
        const parsed: Cache = JSON.parse(stored)
        if (Date.now() - parsed.ts < CACHE_TTL && parsed.lang === lang) {
          setCache(parsed)
          setLoading(false)
          return
        }
      }
    } catch {}
    fetchInsights()
  }, [lang, fetchInsights])

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60000)
    return () => clearInterval(id)
  }, [])

  const accentColor = cache ? ANGLE_COLORS[cache.angle] : 'var(--accent)'
  const label       = cache ? angleLabel(cache.angle, s) : ''

  return (
    <div style={{
      background: 'rgba(255,252,247,0.8)',
      backdropFilter: 'blur(8px)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      padding: '28px',
      boxShadow: '0 2px 8px rgba(140,70,30,0.06), 0 8px 24px rgba(140,70,30,0.04)',
    }}>

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: '20px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--text-lo)', margin: 0,
            }}>{s.aiInsights}</p>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: 'var(--gold)', flexShrink: 0 }}>
              <path d="M6 1L7.2 4.8H11L7.9 7.1L9.1 11L6 8.7L2.9 11L4.1 7.1L1 4.8H4.8L6 1Z" fill="currentColor"/>
            </svg>
          </div>
          {label && !loading ? (
            <span style={{
              fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.04em', textTransform: 'uppercase',
              color: accentColor,
              background: `${accentColor}14`,
              borderRadius: '5px', padding: '2px 7px',
              display: 'inline-block',
            }}>{label}</span>
          ) : (
            <span style={{ display: 'inline-block', width: '80px', height: '18px' }} />
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          {cache && !loading && (
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-lo)' }}>
              {/* tick forces re-render every min */}
              {timeAgo(cache.ts)}
            </span>
          )}
          <button
            onClick={fetchInsights}
            disabled={loading}
            style={{
              fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600,
              color: loading ? 'var(--text-lo)' : 'var(--accent)',
              background: loading ? 'transparent' : 'var(--accent-dim)',
              border: 'none', borderRadius: '8px',
              padding: '6px 14px',
              cursor: loading ? 'default' : 'pointer',
              transition: 'opacity 0.15s ease',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            {loading ? (
              <>
                <span style={{
                  display: 'inline-block', width: '10px', height: '10px',
                  border: '1.5px solid var(--border-hi)', borderTopColor: 'var(--text-mid)',
                  borderRadius: '50%', animation: 'spin 0.7s linear infinite',
                }} />
                {s.analyzing}
              </>
            ) : s.refresh}
          </button>
        </div>
      </div>

      {/* Skeleton */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[100, 88, 72].map((w, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{
                width: '22px', height: '22px', borderRadius: '50%',
                background: 'var(--surface-hi)', flexShrink: 0,
              }} />
              <div style={{
                height: '13px', borderRadius: '6px', width: `${w}%`,
                background: 'linear-gradient(90deg, var(--surface-hi) 0%, var(--border) 50%, var(--surface-hi) 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.4s ease infinite',
              }} />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--red)', margin: 0 }}>
          {error}
        </p>
      )}

      {/* Bullets */}
      {!loading && !error && cache && (
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {cache.bullets.map((bullet, i) => (
            <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{
                width: '22px', height: '22px', borderRadius: '50%',
                background: `${accentColor}14`,
                color: accentColor,
                fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: '1px',
              }}>{i + 1}</span>
              <p style={{
                fontFamily: 'var(--font-sans)', fontSize: '13.5px',
                color: 'var(--text-hi)', margin: 0, lineHeight: 1.6,
              }}>{bullet}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
