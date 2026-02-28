'use client'

import { motion } from 'framer-motion'

export default function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <motion.div
          className="inline-flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full" />
        </motion.div>
        <p className="mt-4 text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}
