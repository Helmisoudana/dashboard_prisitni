'use client'

import { AlertTriangle, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export default function ErrorState({ 
  message = 'An error occurred while loading the data',
  onRetry,
}: ErrorStateProps) {
  return (
    <motion.div
      className="flex items-center justify-center py-12"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="text-center">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
        </motion.div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Data</h3>
        <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
        {onRetry && (
          <motion.button
            onClick={onRetry}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 mx-auto hover:bg-primary/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
