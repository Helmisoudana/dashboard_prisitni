'use client'

import { motion } from 'framer-motion'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  message?: string
  icon?: React.ReactNode
}

export default function EmptyState({
  title = 'No Data Available',
  message = 'There are no items to display at the moment.',
  icon,
}: EmptyStateProps) {
  return (
    <motion.div
      className="flex items-center justify-center py-12"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="text-center">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-4"
        >
          {icon ? (
            <div className="w-16 h-16 mx-auto text-muted-foreground">
              {icon}
            </div>
          ) : (
            <Inbox className="w-16 h-16 mx-auto text-muted-foreground" />
          )}
        </motion.div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground max-w-md">{message}</p>
      </div>
    </motion.div>
  )
}
