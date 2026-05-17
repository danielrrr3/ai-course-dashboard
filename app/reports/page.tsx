import {
  getTopCustomers,
  getRecentSales,
  getLowStockItems,
  getFeedbackSummary,
} from '../../lib/data'

const statusColors: Record<string, { bg: string; color: string }> = {
  Completed: { bg: 'rgba(46,125,82,0.1)',  color: '#2E7D52' },
  Processing: { bg: 'rgba(184,144,42,0.1)', color: '#B8902A' },
  Shipped:    { bg: 'rgba(122,96,128,0.1)', color: '#7A6080' },
  Returned:   { bg: 'rgba(184,50,50,0.1)',  color: '#B83232' },
}

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{
          fontSize: 12,
          color: i <= rating ? '#B8902A' : '#E8DACE',
        }}>★</span>
      ))}
    </span>
  )
}

const cardStyle = {
  background: 'rgba(255,252,247,0.85)',
  backdropFilter: 'blur(8px)',
  border: '1px solid var(--border)',
  borderRadius: '16px',
  padding: '28px',
  boxShadow: '0 2px 8px rgba(140,70,30,0.06), 0 8px 24px rgba(140,70,30,0.04)',
  marginBottom: '16px',
} as const

const labelStyle = {
  fontFamily: 'var(--font-sans)',
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  color: 'var(--text-lo)',
  margin: '0 0 20px',
}

const thStyle = {
  fontFamily: 'var(--font-sans)',
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase' as const,
  color: 'var(--text-lo)',
  padding: '0 0 10px',
  borderBottom: '1px solid var(--border)',
  textAlign: 'left' as const,
}

const tdStyle = {
  fontFamily: 'var(--font-sans)',
  fontSize: '13px',
  color: 'var(--text-mid)',
  padding: '11px 0',
  borderBottom: '1px solid rgba(232,218,206,0.5)',
  verticalAlign: 'middle' as const,
}

export default async function Reports() {
  const [topCustomers, recentSales, lowStock, feedback] = await Promise.all([
    getTopCustomers(),
    getRecentSales(12),
    getLowStockItems(),
    getFeedbackSummary(),
  ])

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>

      {/* Hero */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '44px 52px 48px',
        background: 'linear-gradient(160deg, #7A6080 0%, #9A7090 25%, #B89070 55%, #C8A880 80%, #E0C898 100%)',
      }}>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(247,238,228,0.7) 70%, var(--bg) 100%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.7)', marginBottom: '10px',
          }}>Data</p>
          <h1 style={{
            fontFamily: 'var(--font-serif)', fontSize: '38px', fontWeight: 400,
            color: '#FFF8F0', margin: '0 0 10px', letterSpacing: '-0.02em',
            lineHeight: 1.1, textShadow: '0 1px 12px rgba(60,30,60,0.25)',
          }}>Reports</h1>
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '14px',
            color: 'rgba(255,248,240,0.8)', margin: 0,
          }}>
            Top customers · recent sales · inventory alerts · feedback
          </p>
        </div>
      </div>

      <div style={{ padding: '32px 52px 52px' }}>

        {/* Summary row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 24,
        }}>
          {[
            { label: 'Top Customer Revenue', value: `SAR ${topCustomers[0]?.total_revenue.toLocaleString() ?? '—'}`, sub: topCustomers[0]?.customer_name ?? '', accent: '#C4532A' },
            { label: 'Recent Sales', value: String(recentSales.length), sub: 'latest transactions', accent: '#7A6080' },
            { label: 'Low Stock Alerts', value: String(lowStock.length), sub: 'items at/below reorder', accent: lowStock.length > 5 ? '#B83232' : '#B8902A' },
            { label: 'Avg Rating', value: `${feedback.avgRating} / 5`, sub: `${feedback.pending} pending responses`, accent: '#5A7A5E' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(255,252,247,0.85)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '20px 22px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(140,70,30,0.06)',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: s.accent, borderRadius: '14px 14px 0 0', opacity: 0.7,
              }} />
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-lo)', margin: '0 0 8px' }}>{s.label}</p>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: 'var(--text-hi)', margin: '0 0 4px', letterSpacing: '-0.02em', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-lo)', margin: 0 }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Top Customers */}
        <div style={cardStyle}>
          <p style={labelStyle}>Top Customers by Revenue</p>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: 28 }}>#</th>
                <th style={thStyle}>Customer</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Orders</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Avg Order</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((c, i) => (
                <tr key={c.customer_name}>
                  <td style={{ ...tdStyle, color: 'var(--text-lo)', fontWeight: 600, fontSize: 12 }}>{i + 1}</td>
                  <td style={{ ...tdStyle, color: 'var(--text-hi)', fontWeight: 500 }}>{c.customer_name}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>{c.total_orders}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>SAR {c.avg_order.toLocaleString()}</td>
                  <td style={{ ...tdStyle, textAlign: 'right', color: 'var(--text-hi)', fontWeight: 600 }}>
                    SAR {c.total_revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Sales */}
        <div style={cardStyle}>
          <p style={labelStyle}>Recent Sales</p>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Customer</th>
                <th style={thStyle}>Product</th>
                <th style={thStyle}>Category</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Amount</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.map(s => {
                const sc = statusColors[s.status] ?? { bg: '#f5f5f5', color: '#666' }
                return (
                  <tr key={s.id}>
                    <td style={{ ...tdStyle, fontSize: 12, color: 'var(--text-lo)' }}>{s.date}</td>
                    <td style={{ ...tdStyle, color: 'var(--text-hi)', fontWeight: 500 }}>
                      {s.customer_name ?? <span style={{ color: 'var(--text-lo)', fontStyle: 'italic' }}>Unknown</span>}
                    </td>
                    <td style={tdStyle}>{s.product}</td>
                    <td style={{ ...tdStyle, fontSize: 12 }}>{s.category}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600, color: 'var(--text-hi)' }}>
                      SAR {s.amount_sar.toLocaleString()}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        fontSize: 11, fontWeight: 600,
                        padding: '3px 10px', borderRadius: 20,
                        background: sc.bg, color: sc.color,
                      }}>{s.status}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Two-column row: Low Stock + Feedback */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

          {/* Low Stock */}
          <div style={{ ...cardStyle, marginBottom: 0 }}>
            <p style={labelStyle}>
              Inventory Alerts
              {lowStock.length > 0 && (
                <span style={{
                  marginLeft: 10, fontSize: 10, fontWeight: 700,
                  background: 'rgba(184,50,50,0.1)', color: '#B83232',
                  padding: '2px 8px', borderRadius: 20,
                }}>
                  {lowStock.length} items
                </span>
              )}
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Product</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>In Stock</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Reorder At</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map(item => (
                  <tr key={item.product_id}>
                    <td style={{ ...tdStyle, color: 'var(--text-hi)', fontWeight: 500, fontSize: 12 }}>
                      {item.product_name}
                      <span style={{ display: 'block', fontSize: 11, color: 'var(--text-lo)', fontWeight: 400 }}>
                        {item.category} · {item.warehouse_location}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <span style={{
                        fontWeight: 700, fontSize: 13,
                        color: item.in_stock === 0 ? '#B83232' : '#B8902A',
                      }}>
                        {item.in_stock === 0 ? 'Out' : item.in_stock}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-lo)', fontSize: 12 }}>
                      {item.reorder_level}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Feedback Summary */}
          <div style={{ ...cardStyle, marginBottom: 0 }}>
            <p style={labelStyle}>Customer Feedback</p>

            {/* Summary stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
              {[
                { label: 'Avg Rating', value: feedback.avgRating.toFixed(1), suffix: '/ 5' },
                { label: 'Positive (4–5★)', value: feedback.positive, suffix: `of ${feedback.total}` },
                { label: 'Pending Reply', value: feedback.pending, suffix: 'reviews' },
              ].map(stat => (
                <div key={stat.label} style={{
                  background: 'var(--surface-hi)',
                  borderRadius: 10,
                  padding: '14px',
                  textAlign: 'center',
                }}>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--text-hi)', margin: '0 0 2px', lineHeight: 1 }}>
                    {stat.value}
                  </p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--text-lo)', margin: '0 0 2px' }}>
                    {stat.suffix}
                  </p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-lo)', margin: 0 }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Rating breakdown */}
            {[5,4,3,2,1].map(star => {
              const count = (() => {
                // We only have the summary, show proportional bars
                if (star >= 4) return Math.round((feedback.positive / feedback.total) * 10)
                if (star <= 2) return Math.round((feedback.negative / feedback.total) * 10)
                return Math.round(((feedback.total - feedback.positive - feedback.negative) / feedback.total) * 10)
              })()
              return (
                <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <Stars rating={star} />
                  <div style={{ flex: 1, height: 6, background: '#F5EBE0', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: star >= 4
                        ? `${(feedback.positive / feedback.total) * 100}%`
                        : star <= 2
                          ? `${(feedback.negative / feedback.total) * 100}%`
                          : `${((feedback.total - feedback.positive - feedback.negative) / feedback.total) * 100}%`,
                      background: star >= 4 ? '#2E7D52' : star <= 2 ? '#B83232' : '#B8902A',
                      borderRadius: 3,
                    }} />
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </div>
  )
}
