'use client'

import { motion, AnimatePresence } from 'framer-motion'
import AppLayout from '@/components/layout/app-layout'
import { useRecommendations } from '@/hooks/use-queries'
import LoadingState from '@/components/shared/loading-state'
import ErrorState from '@/components/shared/error-state'
import EmptyState from '@/components/shared/empty-state'
import { Lightbulb, ArrowRight, DollarSign, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react'

export default function RecommendationsPage() {
  const { data: recommendations, isLoading, isError, refetch } = useRecommendations()

  if (isLoading) return <LoadingState message="Loading AI recommendations..." />
  if (isError) return <ErrorState onRetry={() => refetch()} />
  if (!recommendations || recommendations.length === 0) {
    return (
      <AppLayout>
        <EmptyState title="No Recommendations" message="All systems are running optimally!" icon={<CheckCircle2 className="w-16 h-16 text-success" />} />
      </AppLayout>
    )
  }

  const priorityColors: Record<string, string> = {
    critical: 'bg-destructive/20 text-destructive border-destructive/30',
    high: 'bg-warning/20 text-warning border-warning/30',
    medium: 'bg-info/20 text-info border-info/30',
    low: 'bg-primary/20 text-primary border-primary/30',
  }

  const categoryIcons: Record<string, React.ReactNode> = {
    maintenance: <TrendingUp className="w-6 h-6" />,
    efficiency: <Lightbulb className="w-6 h-6" />,
    safety: <AlertTriangle className="w-6 h-6" />,
    cost: <DollarSign className="w-6 h-6" />,
  }

  const groupedRecommendations = recommendations.reduce((acc, rec) => {
    if (!acc[rec.category]) {
      acc[rec.category] = []
    }
    acc[rec.category].push(rec)
    return acc
  }, {} as Record<string, typeof recommendations>)

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
          <h1 className="text-3xl font-bold text-foreground">AI Recommendations</h1>
          <p className="text-muted-foreground mt-2">Data-driven insights to optimize factory operations</p>
        </motion.div>

        {/* Recommendations by Category */}
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {Object.entries(groupedRecommendations).map(([category, recs], categoryIdx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: categoryIdx * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  {categoryIcons[category] && (
                    <div className="w-10 h-10 bg-primary/20 text-primary rounded-lg flex items-center justify-center">
                      {categoryIcons[category]}
                    </div>
                  )}
                  <h2 className="text-xl font-semibold text-foreground capitalize">{category}</h2>
                  <span className="text-sm text-muted-foreground ml-auto">{recs.length} recommendations</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimatePresence mode="wait">
                    {recs.map((rec, idx) => (
                      <motion.div
                        key={rec.id}
                        className="bg-card rounded-lg border border-border p-6 hover:border-primary/50 transition-colors"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ y: -4 }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border capitalize ${
                              priorityColors[rec.priority] || 'bg-muted/20 text-muted-foreground border-muted/30'
                            }`}
                          >
                            {rec.priority} Priority
                          </span>
                        </div>

                        <h3 className="text-base font-semibold text-foreground mb-2">
                          {rec.description.split('\n')[0]}
                        </h3>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {rec.description}
                        </p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <TrendingUp className="w-4 h-4" />
                            <span>{rec.impact}</span>
                          </div>
                          {rec.estimated_savings && (
                            <div className="flex items-center gap-2 text-sm text-success">
                              <DollarSign className="w-4 h-4" />
                              <span>Potential savings: {rec.estimated_savings}</span>
                            </div>
                          )}
                        </div>

                        <motion.button
                          className="w-full px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Learn More
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </AppLayout>
  )
}
