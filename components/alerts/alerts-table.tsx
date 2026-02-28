'use client'

import { useState } from 'react'
import { useAlerts } from '@/hooks/use-queries'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingState from '@/components/shared/loading-state'
import ErrorState from '@/components/shared/error-state'
import EmptyState from '@/components/shared/empty-state'
import { AlertTriangle, ChevronLeft, ChevronRight, AlertOctagon, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function AlertsTable() {
  const [page, setPage] = useState(0)
  const limit = 10
  const skip = page * limit

  const { data, isLoading, isError, refetch } = useAlerts(skip, limit)

  if (isLoading) return <LoadingState message="Loading alerts..." />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  const alertList = Array.isArray(data) ? data : (data?.data || [])
  const total = Array.isArray(data) ? alertList.length : (data?.total || alertList.length)

  if (alertList.length === 0) {
    return <EmptyState title="No Alerts" message="No system alerts at the moment." icon={<AlertTriangle className="w-16 h-16" />} />
  }

  const totalPages = Math.ceil(total / limit) || 1
  const hasNextPage = page < totalPages - 1
  const hasPrevPage = page > 0

  const severityIcons = {
    critical: AlertOctagon,
    warning: AlertTriangle,
    info: AlertCircle,
  }

  const severityColors: Record<string, string> = {
    critical: 'bg-destructive/20 text-destructive border-destructive/30',
    warning: 'bg-warning/20 text-warning border-warning/30',
    info: 'bg-info/20 text-info border-info/30',
  }

  const statusColors: Record<string, string> = {
    actif: 'bg-destructive/20 text-destructive border-destructive/30',
    réglé: 'bg-success/20 text-success border-success/30',
    ignoré: 'bg-muted/20 text-muted-foreground border-muted/30',
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Identifiers</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Message</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Severity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {alertList.map((alert, index) => {
                  const SeverityIcon = severityIcons[(alert.severity || 'warning') as keyof typeof severityIcons] || AlertCircle

                  return (
                    <motion.tr
                      key={alert.alert_id || alert.id || index}
                      className="border-b border-border hover:bg-secondary/50 transition-colors"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-foreground">M: {alert.machine_id}</p>
                          <p className="text-xs text-muted-foreground">E: {alert.employee_id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-foreground max-w-xs">{alert.message || 'No description'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <motion.div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${severityColors[alert.severity || 'warning'] || 'bg-warning/20 text-warning border-warning/30'}`}
                          whileHover={{ scale: 1.05 }}
                        >
                          <SeverityIcon className="w-4 h-4" />
                          {alert.severity || 'warning'}
                        </motion.div>
                      </td>
                      <td className="px-6 py-4">
                        <motion.span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border capitalize ${statusColors[alert.statut?.toLowerCase()] || 'bg-muted/20 text-muted-foreground border-muted/30'}`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {(alert.statut?.toLowerCase() === 'réglé' || alert.statut?.toLowerCase() === 'resolved') && <CheckCircle2 className="w-4 h-4" />}
                          {alert.statut || 'N/A'}
                        </motion.span>
                      </td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
        <div className="text-sm text-muted-foreground">
          Showing {skip + 1} to {Math.min(skip + limit, total)} of {total} alerts
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
