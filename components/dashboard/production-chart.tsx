'use client'

import { useMonthlySummaries } from '@/hooks/use-queries'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import LoadingState from '@/components/shared/loading-state'
import ErrorState from '@/components/shared/error-state'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function ProductionChart() {
  const { data, isLoading, isError } = useMonthlySummaries()

  if (isLoading) return <LoadingState message="Chargement de l'évolution de la production..." />
  if (isError) return <ErrorState message="Erreur lors du chargement des données de production" />
  if (!data || data.length === 0) return <ErrorState message="Aucune donnée de production n'est disponible" />

  // Trie les données par ordre chronologique pour le graphique
  const chartData = [...data].sort((a, b) => a.periode.localeCompare(b.periode))

  // Formatter la période (ex: "2026-02" -> "Fév 2026")
  const formattedData = chartData.map(item => ({
    ...item,
    formattedPeriode: format(parseISO(item.date_generation), 'MMM yyyy', { locale: fr }).replace(/^\w/, (c) => c.toUpperCase())
  }))

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-6">Évolution du Rendement Global (4 derniers mois)</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="formattedPeriode"
              stroke="var(--muted-foreground)"
              style={{ fontSize: '0.875rem' }}
              tickMargin={10}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              style={{ fontSize: '0.875rem' }}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '0.5rem',
                color: 'hsl(var(--foreground))',
              }}
              itemStyle={{ color: 'hsl(var(--primary))' }}
              labelStyle={{ color: 'hsl(var(--foreground))', marginBottom: '4px', fontWeight: 'bold' }}
              formatter={(value: number) => [`${value}%`, 'Rendement Global']}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line
              type="monotone"
              dataKey="rendement_global_pct"
              name="Rendement Global"
              stroke="var(--primary)"
              strokeWidth={3}
              dot={{ r: 5, strokeWidth: 2, fill: 'hsl(var(--card))' }}
              activeDot={{ r: 7, strokeWidth: 0 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
