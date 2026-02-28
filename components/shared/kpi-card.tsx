'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { ReactNode } from 'react'

interface KPICardProps {
  title: string
  value: string | number
  unit?: string
  icon?: ReactNode
  trend?: 'up' | 'down'
  trendValue?: string | number
  color?: 'primary' | 'success' | 'warning' | 'destructive'
}

export default function KPICard({
  title,
  value,
  unit,
  icon,
  trend,
  trendValue,
  color = 'primary',
}: KPICardProps) {
  const colorClasses: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    destructive: 'bg-destructive/10 text-destructive',
  }

  const trendColor = trend === 'up' ? 'text-success' : 'text-destructive'

  return (
    <motion.div
      className="bg-card rounded-lg border border-border p-6 hover:border-primary/50 transition-colors"
      whileHover={{ y: -4, boxShadow: '0 10px 20px rgba(0,180,216,0.1)' }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
        </div>
        {icon && (
          <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
            {icon}
          </div>
        )}
      </div>

      {trend && trendValue && (
        <motion.div
          className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {trend === 'up' ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{trendValue}</span>
        </motion.div>
      )}
    </motion.div>
  )
}
