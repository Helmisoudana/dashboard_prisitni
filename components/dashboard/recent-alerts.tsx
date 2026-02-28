'use client'

import { useShiftSummaries } from '@/hooks/use-queries'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import LoadingState from '@/components/shared/loading-state'
import ErrorState from '@/components/shared/error-state'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function ShiftYieldChart() {
  const { data, isLoading, isError } = useShiftSummaries()

  if (isLoading) return <LoadingState message="Chargement des rendements..." />
  if (isError) return <ErrorState message="Erreur de chargement des shifts" />
  if (!data || data.length === 0) return <ErrorState message="Aucune donnée de shift" />

  // Trie les shifts par ordre chronologique pour le graphique
  const chartData = [...data]
    .sort((a, b) => new Date(a.date_generation).getTime() - new Date(b.date_generation).getTime())
    .map(item => ({
      ...item,
      // Affichage stylé "28 Fév - Matin"
      label: `${format(parseISO(item.date), 'dd MMM', { locale: fr })} - ${item.shift}`,
    }))

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-semibold text-foreground mb-6">Rendement par Shift (3 derniers)</h3>
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="var(--muted-foreground)"
              style={{ fontSize: '0.75rem' }}
              tickMargin={10}
              angle={-45}
              textAnchor="end"
            />
            <YAxis
              stroke="var(--muted-foreground)"
              style={{ fontSize: '0.875rem' }}
              domain={[0, 100]}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                borderRadius: '0.5rem',
                color: 'var(--foreground)',
              }}
              itemStyle={{ color: 'var(--primary)' }}
              labelStyle={{ color: 'var(--foreground)', marginBottom: '4px', fontWeight: 'bold' }}
              formatter={(value: number, name: string) => [`${value}%`, name]}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line
              type="monotone"
              dataKey="rendement_pct"
              name="Rendement"
              stroke="var(--primary)"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: 'var(--card)' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="taux_anomalie_pct"
              name="Taux d'Anomalie"
              stroke="var(--destructive)"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: 'var(--card)' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
