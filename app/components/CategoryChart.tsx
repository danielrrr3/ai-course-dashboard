'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import type { CategoryData } from '../../lib/data'

const COLORS = ['#C4532A', '#7A6080', '#B8902A', '#5A7A5E', '#A07060']

export default function CategoryChart({ data }: { data: CategoryData[] }) {
  const max = Math.max(...data.map(d => d.total))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {data.map((item, i) => (
        <div key={item.category}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 5,
            fontFamily: 'system-ui, sans-serif',
          }}>
            <span style={{ fontSize: 12, color: '#7A6252', fontWeight: 500 }}>{item.category}</span>
            <span style={{ fontSize: 12, color: '#1C120C', fontWeight: 600 }}>
              SAR {item.total.toLocaleString()}
            </span>
          </div>
          <div style={{
            height: 8,
            background: '#F5EBE0',
            borderRadius: 4,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${(item.total / max) * 100}%`,
              background: COLORS[i % COLORS.length],
              borderRadius: 4,
              opacity: 0.85,
              transition: 'width 0.6s ease',
            }} />
          </div>
        </div>
      ))}
    </div>
  )
}
