'use client'

import { useMonthlySummaries } from '@/hooks/use-queries'
import LoadingState from '@/components/shared/loading-state'
import ErrorState from '@/components/shared/error-state'
import KPICard from '@/components/shared/kpi-card'
import { Activity, AlertTriangle, Users, TrendingUp } from 'lucide-react'

export default function StatsOverview() {
  const { data, isLoading, isError, refetch } = useMonthlySummaries()

  if (isLoading) return <LoadingState message="Loading dashboard data..." />
  if (isError) return <ErrorState onRetry={() => refetch()} />
  if (!data || data.length === 0) return <ErrorState message="No data available" />

  // The latest month is assumed to be the first in the array (most recent first)
  const currentMonth = data[0]
  const previousMonth = data.length > 1 ? data[1] : null

  // Helper to calculate trend
  const calculateTrendValue = (current: number, previous: number) => {
    if (!previous) return null;
    const diff = current - previous;
    return diff > 0 ? `+${diff.toFixed(1)}` : `${diff.toFixed(1)}`;
  }

  const rendementTrend = previousMonth ? calculateTrendValue(currentMonth.rendement_global_pct, previousMonth.rendement_global_pct) : null;
  const rendementIsUp = previousMonth ? currentMonth.rendement_global_pct >= previousMonth.rendement_global_pct : true;

  const anomalyTrend = previousMonth ? calculateTrendValue(currentMonth.taux_anomalie_pct, previousMonth.taux_anomalie_pct) : null;
  const anomalyIsUp = previousMonth ? currentMonth.taux_anomalie_pct <= previousMonth.taux_anomalie_pct : true;

  const fatigueTrend = previousMonth ? calculateTrendValue(currentMonth.score_fatigue_global, previousMonth.score_fatigue_global) : null;
  const fatigueIsUp = previousMonth ? currentMonth.score_fatigue_global <= previousMonth.score_fatigue_global : true;

  const tasksTrend = previousMonth ? calculateTrendValue(currentMonth.taches_completees, previousMonth.taches_completees) : null;
  const tasksIsUp = previousMonth ? currentMonth.taches_completees >= previousMonth.taches_completees : true;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard
        title="Rendement Global"
        value={currentMonth.rendement_global_pct.toString()}
        unit="%"
        icon={<TrendingUp className="w-6 h-6" />}
        color={currentMonth.rendement_global_pct > 80 ? 'success' : 'primary'}
        trend={rendementIsUp ? 'up' : 'down'}
        trendValue={rendementTrend ? `${rendementTrend}%` : undefined}
      />
      <KPICard
        title="Tâches Complétées"
        value={currentMonth.taches_completees.toString()}
        icon={<Activity className="w-6 h-6" />}
        color="primary"
        trend={tasksIsUp ? 'up' : 'down'}
        trendValue={tasksTrend ? `${tasksTrend}` : undefined}
      />
      <KPICard
        title="Employés en Travail"
        value={currentMonth.employes_en_travail.toString()}
        icon={<Users className="w-6 h-6" />}
        color="primary"
      />
      <KPICard
        title="Taux d'Anomalie"
        value={currentMonth.taux_anomalie_pct.toString()}
        unit="%"
        icon={<AlertTriangle className="w-6 h-6" />}
        color={currentMonth.taux_anomalie_pct > 5 ? 'destructive' : 'warning'}
        trend={anomalyIsUp ? 'down' : 'up'}
        trendValue={anomalyTrend ? `${anomalyTrend}%` : undefined}
      />
    </div>
  )
}

