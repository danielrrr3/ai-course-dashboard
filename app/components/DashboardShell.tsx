'use client'

import MetricCard from './MetricCard'
import RevenueChart from './RevenueChart'
import CategoryChart from './CategoryChart'
import AIInsightsCard from './AIInsightsCard'
import ChatInterface from './ChatInterface'
import LanguageToggle from './LanguageToggle'
import { useLang } from '../../lib/lang'
import type { MonthlyData, CategoryData } from '../../lib/data'

type Metrics = {
  totalRevenue: number
  revenueChangePct: number
  totalOrders: number
  ordersChangePct: number
  totalCustomers: number
  avgOrderValue: number
}

type Props = {
  metrics: Metrics
  monthlyData: MonthlyData[]
  categoryData: CategoryData[]
}

export default function DashboardShell({ metrics, monthlyData, categoryData }: Props) {
  const { s } = useLang()
  const fmt = (n: number) => n.toLocaleString()
  const fmtChange = (n: number) => `${n >= 0 ? '+' : ''}${n}%`

  const cardConfig = [
    {
      title: s.totalRevenue,
      value: `SAR ${fmt(metrics.totalRevenue)}`,
      change: fmtChange(metrics.revenueChangePct),
      trend: (metrics.revenueChangePct >= 0 ? 'up' : 'down') as 'up' | 'down',
      period: s.vsLastMonth,
      accent: '#C4532A',
      icon: (
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
          <circle cx="8.5" cy="8.5" r="7" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M8.5 5v7M6 7C6 6.2 7.1 5.5 8.5 5.5S11 6.2 11 7c0 2-5 1.6-5 3.7 0 .9.9 1.8 2.5 1.8s2.5-.8 2.5-1.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      title: s.totalOrders,
      value: fmt(metrics.totalOrders),
      change: fmtChange(metrics.ordersChangePct),
      trend: (metrics.ordersChangePct >= 0 ? 'up' : 'down') as 'up' | 'down',
      period: s.vsLastMonth,
      accent: '#7A6080',
      icon: (
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
          <rect x="2" y="4" width="13" height="10" rx="2" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M5.5 4V3a3 3 0 0 1 6 0v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M5.5 9h6M5.5 11.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      title: s.customers,
      value: String(metrics.totalCustomers),
      change: '+33',
      trend: 'up' as const,
      period: s.totalRegistered,
      accent: '#B8902A',
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
      title: s.avgOrderValue,
      value: `SAR ${fmt(metrics.avgOrderValue)}`,
      change: '+12%',
      trend: 'up' as const,
      period: s.perCompletedSale,
      accent: '#5A7A5E',
      icon: (
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
          <polyline points="2,13 5.5,8 9,10 15,4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="11.5,4 15,4 15,7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ]

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>

      {/* Hero banner */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '44px 52px 48px',
        background: 'linear-gradient(160deg, #E8906A 0%, #D4785A 20%, #C4A07A 45%, #A89090 65%, #C8B090 80%, #E0C898 100%)',
      }}>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(247,238,228,0.6) 60%, var(--bg) 100%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '280px', height: '280px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,220,190,0.5) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '10px', left: '30%',
          width: '180px', height: '120px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,160,200,0.3) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.75)', margin: 0,
            }}>{s.overview}</p>
            <LanguageToggle />
          </div>
          <h1 style={{
            fontFamily: 'var(--font-serif)', fontSize: '38px', fontWeight: 400,
            color: '#FFF8F0', margin: '0 0 10px', letterSpacing: '-0.02em',
            lineHeight: 1.1, textShadow: '0 1px 12px rgba(120,50,20,0.25)',
          }}>{s.dashboard}</h1>
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '14px',
            color: 'rgba(255,248,240,0.8)', margin: 0, fontWeight: 400,
          }}>
            {s.liveData(metrics.totalOrders, metrics.totalCustomers)}
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

        {/* Charts row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: '16px',
          marginBottom: '16px',
        }}>

          {/* Monthly Revenue vs Expenses */}
          <div style={{
            background: 'rgba(255,252,247,0.8)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 2px 8px rgba(140,70,30,0.06), 0 8px 24px rgba(140,70,30,0.04)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <p style={{
                  fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'var(--text-lo)', margin: '0 0 4px',
                }}>{s.monthlyRevenueVsExpenses}</p>
                <p style={{
                  fontFamily: 'var(--font-sans)', fontSize: '12px',
                  color: 'var(--text-mid)', margin: 0,
                }}>{s.chartPeriod}</p>
              </div>
            </div>
            <RevenueChart data={monthlyData} />
          </div>

          {/* Sales by Category */}
          <div style={{
            background: 'rgba(255,252,247,0.8)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 2px 8px rgba(140,70,30,0.06), 0 8px 24px rgba(140,70,30,0.04)',
          }}>
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--text-lo)', margin: '0 0 20px',
            }}>{s.salesByCategory}</p>
            <CategoryChart data={categoryData} />
          </div>

        </div>

        {/* AI Insights + Chat */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginTop: '0',
        }}>
          <AIInsightsCard />
          <ChatInterface />
        </div>

      </div>
    </div>
  )
}
