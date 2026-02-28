'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import AppLayout from '@/components/layout/app-layout'
import { Calendar, Activity, AlertTriangle, Users, TrendingUp, Clock } from 'lucide-react'
import { useShiftLast10Days, useMonthlySummaries } from '@/hooks/use-queries'
import LoadingState from '@/components/shared/loading-state'
import ErrorState from '@/components/shared/error-state'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

type TabType = 'daily' | 'weekly' | 'monthly'

export default function SummariesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('daily')

  return (
    <AppLayout>
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-foreground">Résumé des Performances</h1>
          <p className="text-muted-foreground mt-2">Vue détaillée des performances : Quotidien, Hebdomadaire, Mensuel</p>
        </motion.div>

        {/* Time Period Selection */}
        <motion.div
          className="flex gap-3 border-b border-border pb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'daily' ? 'bg-primary text-primary-foreground' : 'bg-transparent text-foreground hover:bg-secondary'
              }`}
          >
            <Calendar className="w-5 h-5" />
            Daily (Shifts)
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'weekly' ? 'bg-primary text-primary-foreground' : 'bg-transparent text-foreground hover:bg-secondary'
              }`}
          >
            <Calendar className="w-5 h-5" />
            Weekly
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'monthly' ? 'bg-primary text-primary-foreground' : 'bg-transparent text-foreground hover:bg-secondary'
              }`}
          >
            <Calendar className="w-5 h-5" />
            Monthly
          </button>
        </motion.div>

        {/* Content based on Tab */}
        {activeTab === 'daily' && <DailySummariesContent />}
        {activeTab === 'weekly' && <div className="p-8 text-center text-muted-foreground">Données Hebdomadaires en construction...</div>}
        {activeTab === 'monthly' && <MonthlySummariesContent />}

      </motion.div>
    </AppLayout>
  )
}

function DailySummariesContent() {
  const { data, isLoading, isError } = useShiftLast10Days()

  // On regroupe par date
  const groupedData = useMemo(() => {
    if (!data) return []
    const map = new Map<string, typeof data>()

    // Sort chronologically descending (newest first)
    const sorted = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    sorted.forEach(item => {
      if (!map.has(item.date)) {
        map.set(item.date, [])
      }
      map.get(item.date)!.push(item)
    })

    // Convert to array of { date, shifts: [...] }
    return Array.from(map.entries()).map(([date, shifts]) => ({
      date,
      shifts
    }))
  }, [data])

  if (isLoading) return <LoadingState message="Chargement des données journalières..." />
  if (isError) return <ErrorState message="Impossible de charger les données journalières" />
  if (!data || data.length === 0) return <ErrorState message="Aucune donnée au cours des 10 derniers jours." />

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {groupedData.map((dayData, idx) => (
        <div key={dayData.date} className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2 capitalize">
            {format(parseISO(dayData.date), 'EEEE dd MMMM yyyy', { locale: fr })}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {dayData.shifts.map((shift) => (
              <div key={shift.id} className="bg-secondary/30 rounded-lg p-5 border border-border/50 hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-primary">{shift.shift}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${shift.rendement_pct > 80 ? 'bg-success/20 text-success' : shift.rendement_pct > 75 ? 'bg-warning/20 text-warning' : 'bg-destructive/20 text-destructive'}`}>
                    Rendement: {shift.rendement_pct}%
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground gap-2">
                      <Activity className="w-4 h-4" /> Tâches Complétées
                    </div>
                    <span className="font-medium text-foreground">{shift.taches_completees} / {shift.total_taches}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground gap-2">
                      <Users className="w-4 h-4" /> Employés Actifs
                    </div>
                    <span className="font-medium text-foreground">{shift.total_employes_shift}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground gap-2">
                      <AlertTriangle className="w-4 h-4" /> Taux d'Anomalie
                    </div>
                    <span className={`font-medium ${shift.taux_anomalie_pct > 5 ? 'text-destructive' : 'text-foreground'}`}>
                      {shift.taux_anomalie_pct}% ({shift.total_anomalies})
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground gap-2">
                      <Clock className="w-4 h-4" /> Durée Moy. Tâche
                    </div>
                    <span className="font-medium text-foreground">{shift.duree_moyenne_min} min</span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/50">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Niveau de Fatigue</span>
                      <span className={`font-semibold ${shift.niveau_fatigue_shift === 'Eleve' ? 'text-destructive' : shift.niveau_fatigue_shift === 'Moyen' ? 'text-warning' : 'text-success'}`}>
                        {shift.niveau_fatigue_shift} ({shift.score_fatigue_shift})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  )
}

function MonthlySummariesContent() {
  const { data, isLoading, isError } = useMonthlySummaries()

  if (isLoading) return <LoadingState message="Chargement des données mensuelles..." />
  if (isError) return <ErrorState message="Impossible de charger les données mensuelles" />
  if (!data || data.length === 0) return <ErrorState message="Aucune donnée au cours des mois." />

  const sortedData = [...data].sort((a, b) => b.periode.localeCompare(a.periode))

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {sortedData.map((month) => {
        // Ex: "2026-02" -> "Février 2026"
        let [year, monthNum] = month.periode.split('-')
        let dateObj = new Date(parseInt(year), parseInt(monthNum) - 1)
        let monthName = format(dateObj, 'MMMM yyyy', { locale: fr })

        return (
          <div key={month.id} className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-6 border-b border-border pb-3 capitalize">
              {monthName}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-secondary/30 rounded-lg p-4 border border-border/50">
                <p className="text-sm text-muted-foreground mb-1">Rendement Global</p>
                <div className="flex items-end gap-2">
                  <span className={`text-2xl font-bold ${month.rendement_global_pct > 80 ? 'text-success' : 'text-primary'}`}>{month.rendement_global_pct}%</span>
                </div>
              </div>

              <div className="bg-secondary/30 rounded-lg p-4 border border-border/50">
                <p className="text-sm text-muted-foreground mb-1">Taux d'Anomalie</p>
                <div className="flex items-end gap-2">
                  <span className={`text-2xl font-bold ${month.taux_anomalie_pct > 5 ? 'text-destructive' : 'text-foreground'}`}>{month.taux_anomalie_pct}%</span>
                  <span className="text-sm text-muted-foreground mb-1">({month.total_anomalies} cas)</span>
                </div>
              </div>

              <div className="bg-secondary/30 rounded-lg p-4 border border-border/50">
                <p className="text-sm text-muted-foreground mb-1">Tâches Réalisées</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-foreground">{month.taches_completees}</span>
                  <span className="text-sm text-muted-foreground mb-1">/ {month.total_taches}</span>
                </div>
              </div>

              <div className="bg-secondary/30 rounded-lg p-4 border border-border/50">
                <p className="text-sm text-muted-foreground mb-1">Fatigue Moyenne</p>
                <div className="flex items-end gap-2">
                  <span className={`text-2xl font-bold ${month.niveau_fatigue_global === 'Eleve' ? 'text-destructive' : month.niveau_fatigue_global === 'Moyen' ? 'text-warning' : 'text-success'}`}>
                    {month.score_fatigue_global}
                  </span>
                  <span className="text-sm text-muted-foreground mb-1">({month.niveau_fatigue_global})</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Rendement par Shift Repartition */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> Détails Rendement</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-secondary/20 rounded border border-border/50">
                    <span className="text-muted-foreground">Shift Matin</span>
                    <span className="font-medium text-foreground">{month.rendement_matin}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-secondary/20 rounded border border-border/50">
                    <span className="text-muted-foreground">Shift Jour</span>
                    <span className="font-medium text-foreground">{month.rendement_jour}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-secondary/20 rounded border border-border/50">
                    <span className="text-muted-foreground">Shift Nuit</span>
                    <span className="font-medium text-foreground">{month.rendement_nuit}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-secondary/20 rounded border border-border/50">
                    <span className="text-muted-foreground">Durée Moyenne d'une Tâche</span>
                    <span className="font-medium text-foreground">{month.duree_moyenne_taches_min} min</span>
                  </div>
                </div>
              </div>

              {/* Employees and Environment */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground flex items-center gap-2"><Users className="w-5 h-5 text-primary" /> Ressources Humaines & Matériel</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-secondary/20 rounded border border-border/50">
                    <span className="text-muted-foreground flex items-center gap-2">Présence Employés</span>
                    <span className="font-medium text-foreground">
                      {month.employes_en_travail} Actifs <span className="text-muted-foreground font-normal">/ {month.employes_absents} Absents / {month.employes_en_conge} Congés</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-secondary/20 rounded border border-border/50">
                    <span className="text-muted-foreground">État Machines</span>
                    <span className="font-medium text-foreground">
                      {month.total_machines - month.machines_en_panne} OK <span className="text-destructive font-normal">/ {month.machines_en_panne} en panne</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-secondary/20 rounded border border-border/50">
                    <span className="text-muted-foreground">Tâches Interrompues</span>
                    <span className="font-medium text-warning">{month.taches_interrompues} cas</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-secondary/20 rounded border border-border/50">
                    <span className="text-muted-foreground">Fatigue Critique</span>
                    <span className="font-medium text-destructive">{month.employes_fatigue_critique} employés</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )
      })}
    </motion.div>
  )
}

