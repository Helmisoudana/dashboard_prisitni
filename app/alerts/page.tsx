'use client'

import { motion } from 'framer-motion'
import AppLayout from '@/components/layout/app-layout'
import AlertsTable from '@/components/alerts/alerts-table'

export default function AlertsPage() {
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
          <h1 className="text-3xl font-bold text-foreground">Alerts</h1>
          <p className="text-muted-foreground mt-2">Monitor and manage system and machine alerts</p>
        </motion.div>

        {/* Alerts Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <AlertsTable />
        </motion.div>
      </motion.div>
    </AppLayout>
  )
}
