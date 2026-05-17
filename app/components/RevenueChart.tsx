'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import type { MonthlyData } from '../../lib/data'

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#FFFAF5',
      border: '1px solid #E8DACE',
      borderRadius: '10px',
      padding: '10px 14px',
      fontSize: '12px',
      fontFamily: 'system-ui, sans-serif',
      boxShadow: '0 4px 12px rgba(140,70,30,0.1)',
    }}>
      <p style={{ color: '#B0988A', marginBottom: 6, fontWeight: 600, fontSize: 11 }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color, margin: '2px 0' }}>
          {p.name}: <strong>SAR {p.value.toLocaleString()}</strong>
        </p>
      ))}
    </div>
  )
}

function CustomLegend({ payload }: { payload?: Array<{ value: string; color: string }> }) {
  if (!payload?.length) return null
  return (
    <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end', paddingBottom: 4 }}>
      {payload.map(p => (
        <span key={p.value} style={{
          display: 'flex', alignItems: 'center', gap: 5,
          fontSize: 11, fontFamily: 'system-ui, sans-serif', color: '#7A6252',
        }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: p.color, display: 'inline-block' }} />
          {p.value}
        </span>
      ))}
    </div>
  )
}

export default function RevenueChart({ data }: { data: MonthlyData[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barSize={12} barCategoryGap="30%">
        <XAxis
          dataKey="month"
          tick={{ fontSize: 10, fill: '#B0988A', fontFamily: 'system-ui' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#B0988A', fontFamily: 'system-ui' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
          width={36}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(196,83,42,0.04)' }} />
        <Legend content={<CustomLegend />} />
        <Bar dataKey="revenue" name="Revenue" fill="#C4532A" radius={[3, 3, 0, 0]} opacity={0.85} />
        <Bar dataKey="expenses" name="Expenses" fill="#B8902A" radius={[3, 3, 0, 0]} opacity={0.65} />
      </BarChart>
    </ResponsiveContainer>
  )
}
