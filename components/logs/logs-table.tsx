'use client'

import { useState } from 'react'
import { useProductionLogs } from '@/hooks/use-queries'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingState from '@/components/shared/loading-state'
import ErrorState from '@/components/shared/error-state'
import EmptyState from '@/components/shared/empty-state'
import { FileText, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'

export default function LogsTable() {
  const [page, setPage] = useState(0)
  const limit = 10
  const skip = page * limit

  const { data, isLoading, isError, refetch } = useProductionLogs(skip, limit)

  if (isLoading) return <LoadingState message="Loading production logs..." />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  const logList = Array.isArray(data) ? data : (data?.data || [])
  const total = Array.isArray(data) ? logList.length : (data?.total || logList.length)

  if (logList.length === 0) {
    return <EmptyState title="No Logs" message="No production logs found." icon={<FileText className="w-16 h-16" />} />
  }

  const totalPages = Math.ceil(total / limit) || 1
  const hasNextPage = page < totalPages - 1
  const hasPrevPage = page > 0

  const statusColors: Record<string, string> = {
    'Terminé': 'bg-success/20 text-success border-success/30',
    'En cours': 'bg-primary/20 text-primary border-primary/30',
    'En pause': 'bg-warning/20 text-warning border-warning/30',
    'Annulé': 'bg-destructive/20 text-destructive border-destructive/30',
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Task / Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Machine & Operator</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Shift</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Anomaly</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Duration</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {logList.map((log, index) => (
                  <motion.tr
                    key={log.log_id}
                    className="border-b border-border hover:bg-secondary/50 transition-colors"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{log.task_name}</p>
                        <p className="text-xs text-muted-foreground">Product: {log.product}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-foreground">M: {log.machine_id}</p>
                      <p className="text-xs text-muted-foreground">Op: {log.employee_id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{log.shift}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {log.anomaly_flag === 1 ? (
                          <div className="flex items-center gap-1 text-destructive">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Anomaly Detected</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-success">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-sm font-medium">Normal</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {log.task_duration_min} min
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {log.tag_event_start ? format(new Date(log.tag_event_start), 'HH:mm') : ''}
                        {log.tag_event_end ? ` - ${format(new Date(log.tag_event_end), 'HH:mm')}` : ''}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <motion.span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border capitalize ${statusColors[log.task_status] || 'bg-muted/20 text-muted-foreground border-muted/30'}`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {log.task_status}
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
          Showing {skip + 1} to {Math.min(skip + limit, total)} of {total} logs
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
