'use client'

import { useState } from 'react'
import { useEmployees } from '@/hooks/use-queries'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingState from '@/components/shared/loading-state'
import ErrorState from '@/components/shared/error-state'
import EmptyState from '@/components/shared/empty-state'
import { Calendar, Clock, Award, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'

export default function EmployeeTable() {
  const [page, setPage] = useState(0)
  const limit = 10
  const skip = page * limit

  const { data, isLoading, isError, refetch } = useEmployees(skip, limit)

  if (isLoading) return <LoadingState message="Loading employees..." />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  // Note: the backend might return just an array or { data: [], total: number }
  const employeeList = Array.isArray(data) ? data : (data?.data || [])
  const total = Array.isArray(data) ? employeeList.length : (data?.total || employeeList.length)

  if (employeeList.length === 0) {
    return <EmptyState title="No Employees" message="No employees found in the system." icon={<Users className="w-16 h-16" />} />
  }

  const totalPages = Math.ceil(total / limit) || 1
  const hasNextPage = page < totalPages - 1
  const hasPrevPage = page > 0

  const departmentColors: Record<string, string> = {
    Production: 'bg-primary/20 text-primary border-primary/30',
    Qualité: 'bg-success/20 text-success border-success/30',
    Maintenance: 'bg-warning/20 text-warning border-warning/30',
    Management: 'bg-info/20 text-info border-info/30',
    RH: 'bg-accent/20 text-accent border-accent/30',
  }

  const statusColors: Record<string, string> = {
    Présent: 'text-success',
    Absent: 'text-destructive',
    'En congé': 'text-warning',
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Department</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Details</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Rating</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {employeeList.map((employee, index) => (
                  <motion.tr
                    key={employee.employee_id}
                    className="border-b border-border hover:bg-secondary/50 transition-colors"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{employee.prenom} {employee.nom}</p>
                        <p className="text-xs text-muted-foreground">{employee.employee_id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${departmentColors[employee.departement] || 'bg-muted/20 text-muted-foreground border-muted/30'}`}>
                        {employee.departement}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-foreground">{employee.poste}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                          <Calendar className="w-4 h-4" />
                          {employee.date_embauche ? format(new Date(employee.date_embauche), 'dd/MM/yyyy') : 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                          <Clock className="w-4 h-4" />
                          {employee.anciennete_annees} years
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-warning" />
                        <span className="text-sm font-medium text-foreground">{employee.performance_moyenne}/5.0</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <motion.span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[employee.statut_presence] || 'text-muted-foreground'} bg-foreground/5`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {employee.statut_presence?.replace('_', ' ') || 'Unknown'}
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
          Showing {skip + 1} to {Math.min(skip + limit, total)} of {total} employees
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
