'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line,
} from 'recharts'

const COLORS = ['#00b4d8', '#ff6b35', '#4ade80', '#f59e0b', '#8b5cf6',
                '#ef4444', '#06b6d4', '#ec4899', '#14b8a6', '#a855f7']

interface ChartData {
  type: 'bar' | 'horizontal_bar' | 'pie' | 'line'
  title?: string
  labels: string[]
  values: number[]
  ylabel?: string
}

export default function InlineChart({ raw }: { raw: string }) {
  let data: ChartData
  try {
    data = JSON.parse(raw)
  } catch {
    return null
  }

  if (!data.labels?.length || !data.values?.length) return null

  const items = data.labels.map((label, i) => ({
    name: label,
    value: data.values[i] ?? 0,
  }))

  return (
    <div className="my-3 rounded-lg bg-background/40 border border-border/40 p-3">
      {data.title && (
        <p className="text-xs font-semibold text-foreground mb-2 text-center">{data.title}</p>
      )}
      <ResponsiveContainer width="100%" height={220}>
        {data.type === 'pie' ? (
          <PieChart>
            <Pie data={items} dataKey="value" nameKey="name" cx="50%" cy="50%"
                 outerRadius={75} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                 labelLine={false} fontSize={10}>
              {items.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
          </PieChart>
        ) : data.type === 'line' ? (
          <LineChart data={items} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" fontSize={10} tick={{ fill: 'var(--muted-foreground)' }} />
            <YAxis fontSize={10} tick={{ fill: 'var(--muted-foreground)' }}
                   label={data.ylabel ? { value: data.ylabel, angle: -90, position: 'insideLeft', fontSize: 10, fill: 'var(--muted-foreground)' } : undefined} />
            <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }} />
            <Line type="monotone" dataKey="value" stroke={COLORS[0]} strokeWidth={2.5}
                  dot={{ r: 4, fill: 'var(--card)', stroke: COLORS[0], strokeWidth: 2 }} />
          </LineChart>
        ) : data.type === 'horizontal_bar' ? (
          <BarChart data={items} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis type="number" fontSize={10} tick={{ fill: 'var(--muted-foreground)' }}
                   label={data.ylabel ? { value: data.ylabel, position: 'insideBottom', offset: -2, fontSize: 10, fill: 'var(--muted-foreground)' } : undefined} />
            <YAxis type="category" dataKey="name" fontSize={10} tick={{ fill: 'var(--muted-foreground)' }} width={55} />
            <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {items.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        ) : (
          <BarChart data={items} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" fontSize={10} tick={{ fill: 'var(--muted-foreground)' }} />
            <YAxis fontSize={10} tick={{ fill: 'var(--muted-foreground)' }}
                   label={data.ylabel ? { value: data.ylabel, angle: -90, position: 'insideLeft', fontSize: 10, fill: 'var(--muted-foreground)' } : undefined} />
            <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {items.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
