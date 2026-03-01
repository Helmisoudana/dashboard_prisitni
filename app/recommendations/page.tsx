'use client'

import { motion, AnimatePresence } from 'framer-motion'
import AppLayout from '@/components/layout/app-layout'
import { useHungarianOptimization } from '@/hooks/use-queries'
import LoadingState from '@/components/shared/loading-state'
import ErrorState from '@/components/shared/error-state'
import EmptyState from '@/components/shared/empty-state'
import { Lightbulb, ArrowRight, DollarSign, TrendingUp, AlertTriangle, CheckCircle2, Zap, User, Monitor, Clock, RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function RecommendationsPage() {
  const { data: optimizationData, isLoading, isError, refetch, isRefetching } = useHungarianOptimization()
  const [hasStarted, setHasStarted] = useState(false)

  const handleStartOptimization = () => {
    setHasStarted(true)
    refetch()
  }

  return (
    <AppLayout>
      <motion.div
        className="min-h-[70vh] flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {!hasStarted && !optimizationData ? (
            <motion.div
              key="start-screen"
              className="flex-1 flex flex-col items-center justify-center text-center space-y-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <div className="relative bg-card border border-primary/20 p-8 rounded-full shadow-2xl">
                  <Zap className="w-16 h-16 text-primary fill-primary/10" />
                </div>
              </div>

              <div className="max-w-md mx-auto">
                <h1 className="text-4xl font-bold text-foreground mb-4">Production Optimization</h1>
                <p className="text-muted-foreground text-lg">
                  Run the Hungarian Algorithm to find the most efficient assignments for your employees and machines.
                </p>
              </div>

              <motion.button
                onClick={handleStartOptimization}
                className="group relative px-12 py-5 bg-primary text-primary-foreground rounded-full font-bold text-xl shadow-2xl shadow-primary/40 hover:shadow-primary/60 transition-all overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center gap-3">
                  <Zap className="w-6 h-6 fill-current" />
                  Optimiser la Production
                </span>
              </motion.button>
            </motion.div>
          ) : isLoading || (isRefetching && !optimizationData) ? (
            <motion.div
              key="loading-screen"
              className="flex-1 flex flex-col items-center justify-center space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative w-24 h-24">
                <motion.div
                  className="absolute inset-0 border-4 border-primary/20 rounded-full"
                />
                <motion.div
                  className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <Zap className="absolute inset-0 m-auto w-10 h-10 text-primary animate-pulse" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold animate-pulse">Calcul de l'optimum...</h2>
                <p className="text-muted-foreground">Algorithme de Kuhn-Munkres en cours</p>
              </div>
            </motion.div>
          ) : isError ? (
            <motion.div
              key="error-screen"
              className="flex-1 flex flex-col items-center justify-center pt-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <ErrorState onRetry={() => refetch()} />
            </motion.div>
          ) : optimizationData ? (
            <motion.div
              key="results-screen"
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Header with Recalculate */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold">Optimization Results</h1>
                  <p className="text-muted-foreground">Hungarian Algorithm assignments</p>
                </div>
                <motion.button
                  onClick={() => refetch()}
                  className="flex items-center gap-2 px-6 py-2 bg-secondary border border-border rounded-full text-sm font-bold hover:bg-secondary/80 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
                  Recalculate
                </motion.button>
              </div>

              {/* Stats Card */}
              <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <TrendingUp className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-mono">Algorithm: Hungarian</h2>
                    <p className="text-muted-foreground">Priority: <span className="text-primary font-semibold">{optimizationData.priority}</span></p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-background/40 p-4 rounded-xl border border-border flex items-center gap-4 transition-colors hover:border-primary/40"
                  >
                    <User className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground uppercase tracking-tighter font-semibold">Assigned Employees</p>
                      <p className="text-3xl font-bold">{optimizationData.diagnostics.assigned_employees}</p>
                    </div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-background/40 p-4 rounded-xl border border-border flex items-center gap-4 transition-colors hover:border-primary/40"
                  >
                    <Clock className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground uppercase tracking-tighter font-semibold">Total Efficiency Time</p>
                      <p className="text-3xl font-bold text-success">{optimizationData.diagnostics.total_time_min.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-sm font-normal text-muted-foreground">min</span></p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Assignment Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {optimizationData.assignments.map((assignment, idx) => (
                  <motion.div
                    key={`${assignment.employee_id}-${assignment.machine_id}-${idx}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.01 }}
                    whileHover={{ y: -5 }}
                    className="bg-card border border-border p-5 rounded-2xl hover:border-primary/40 transition-all hover:shadow-lg relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-colors group-hover:bg-primary/10" />

                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-bold text-lg">{assignment.employee_id}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Monitor className="w-3 h-3" />
                        <span className="text-xs font-mono">{assignment.machine_id}</span>
                      </div>
                    </div>

                    <div className="space-y-3 relative z-10">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Product</p>
                        <p className="text-sm font-medium text-foreground truncate">{assignment.product.replace(/_/g, ' ')}</p>
                      </div>

                      <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground italic">Est. time</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-primary" />
                          <span className="font-mono font-bold text-primary">{assignment.avg_time_min} <small>min</small></span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </AppLayout>
  )
}
