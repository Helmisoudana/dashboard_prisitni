'use client'

import { useKpisRendementGlobal } from '@/hooks/use-queries'
import { motion } from 'framer-motion'
import LoadingState from '@/components/shared/loading-state'
import ErrorState from '@/components/shared/error-state'
import { Activity, AlertTriangle, Clock, Target } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

export default function MachineHealth() {
  const { data, isLoading, isError } = useKpisRendementGlobal()

  if (isLoading) return <LoadingState message="Chargement des KPIs..." />
  if (isError) return <ErrorState message="Erreur lors du chargement des KPIs globaux" />
  if (!data) return null;

  const chartData = [
    { name: 'Tâches Complétées', value: data.taches_completees },
    { name: 'Tâches Interrompues', value: data.taches_interrompues },
    { name: 'Anomalies', value: data.total_anomalies },
  ]

  const activeChartData = chartData.filter(d => d.value > 0)

  const COLORS = {
    'Tâches Complétées': '#22c55e',
    'Tâches Interrompues': '#f59e0b',
    'Anomalies': '#ef4444'
  }

  const cards = [
    {
      title: 'Rendement Global',
      value: `${data.rendement_global_pct}%`,
      icon: Target,
      color: 'text-primary',
      bg: 'bg-primary/20',
      border: 'border-primary/30'
    },
    {
      title: "Taux d'Anomalie",
      value: `${data.taux_anomalie_pct}%`,
      icon: AlertTriangle,
      color: data.taux_anomalie_pct > 10 ? 'text-destructive' : 'text-warning',
      bg: data.taux_anomalie_pct > 10 ? 'bg-destructive/20' : 'bg-warning/20',
      border: data.taux_anomalie_pct > 10 ? 'border-destructive/30' : 'border-warning/30'
    },
    {
      title: 'Durée Moyenne',
      value: `${data.duree_moyenne_min} min`,
      icon: Clock,
      color: 'text-info',
      bg: 'bg-info/20',
      border: 'border-info/30'
    },
    {
      title: 'Total des Logs',
      value: data.total_logs,
      icon: Activity,
      color: 'text-success',
      bg: 'bg-success/20',
      border: 'border-success/30'
    }
  ]

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-6">KPIs : Rendement Global & Production</h3>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {cards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border flex items-center gap-4 ${card.bg} ${card.border}`}
            >
              <div className={`p-3 rounded-lg bg-background/50 ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                <h4 className={`text-2xl font-bold ${card.color}`}>{card.value}</h4>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="h-[300px] w-full mt-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-4 text-center">Répartition des Tâches</h4>
        {activeChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={activeChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {activeChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))', borderRadius: '0.5rem' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: '20px' }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Aucune donnée à afficher
          </div>
        )}
      </div>
    </div>
  )
}
