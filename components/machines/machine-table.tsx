'use client'

import { useState } from 'react'
import { useMachines } from '@/hooks/use-queries'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingState from '@/components/shared/loading-state'
import ErrorState from '@/components/shared/error-state'
import EmptyState from '@/components/shared/empty-state'
import { Cpu, ChevronLeft, ChevronRight, Zap, AlertTriangle } from 'lucide-react'

export default function MachineTable() {
  const [page, setPage] = useState(0)
  const limit = 10
  const skip = page * limit

  const { data, isLoading, isError, refetch } = useMachines(skip, limit)

  if (isLoading) return <LoadingState message="Loading machines..." />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  const machineList = Array.isArray(data) ? data : (data?.data || [])
  const total = Array.isArray(data) ? machineList.length : (data?.total || machineList.length)

  if (machineList.length === 0) {
    return <EmptyState title="No Machines" message="No machines found in the system." icon={<Cpu className="w-16 h-16" />} />
  }

  const totalPages = Math.ceil(total / limit) || 1
  const hasNextPage = page < totalPages - 1
  const hasPrevPage = page > 0

  const statusColors: Record<string, string> = {
    'En marche': 'bg-success/20 text-success border-success/30',
    'En panne': 'bg-destructive/20 text-destructive border-destructive/30',
    'En maintenance': 'bg-warning/20 text-warning border-warning/30',
    'À l\'arrêt': 'bg-muted/20 text-muted-foreground border-muted/30',
  }

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-success'
    if (health >= 60) return 'text-warning'
    return 'text-destructive'
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Machine</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Location</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Rendement</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Metrics</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {machineList.map((machine, index) => (
                  <motion.tr
                    key={machine.machine_id}
                    className="border-b border-border hover:bg-secondary/50 transition-colors"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{machine.nom_machine}</p>
                        <p className="text-xs text-muted-foreground">{machine.marque}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-foreground">{machine.type_machine}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-foreground">{machine.atelier} - {machine.unite_production}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${machine.rendement_machine >= 80 ? 'bg-success' : machine.rendement_machine >= 60 ? 'bg-warning' : 'bg-destructive'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${machine.rendement_machine}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                        <span className={`text-sm font-medium ${getHealthColor(machine.rendement_machine)}`}>
                          {machine.rendement_machine}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Zap className="w-4 h-4 text-info" />
                          {machine.consommation_energie} kWh
                        </div>
                        <div className="flex items-center gap-1">
                          {machine.pannes_mois > 0 && <AlertTriangle className="w-4 h-4 text-warning" />}
                          {machine.pannes_mois} pannes/mo
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <motion.span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border capitalize ${statusColors[machine.etat_machine] || 'bg-muted/20 text-muted-foreground border-muted/30'}`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {machine.etat_machine}
                      </motion.span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
        <div className="text-sm text-muted-foreground">
          Showing {skip + 1} to {Math.min(skip + limit, total)} of {total} machines
        </div>
        <div className="flex gap-2">
          <motion.button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={!hasPrevPage}
            className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            whileHover={hasPrevPage ? { scale: 1.05 } : {}}
            whileTap={hasPrevPage ? { scale: 0.95 } : {}}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </motion.button>
          <span className="px-4 py-2 text-sm text-foreground flex items-center">
            Page {page + 1} of {totalPages}
          </span>
          <motion.button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={!hasNextPage}
            className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            whileHover={hasNextPage ? { scale: 1.05 } : {}}
            whileTap={hasNextPage ? { scale: 0.95 } : {}}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
