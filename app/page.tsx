'use client'

import { motion } from 'framer-motion'
import AppLayout from '@/components/layout/app-layout'
import StatsOverview from '@/components/dashboard/stats-overview'
import ProductionChart from '@/components/dashboard/production-chart'
import MachineHealth from '@/components/dashboard/machine-health'
import ShiftYieldChart from '@/components/dashboard/recent-alerts'

export default function DashboardPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <AppLayout>
      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Real-time factory operations overview</p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div variants={itemVariants}>
          <StatsOverview />
        </motion.div>

        {/* Charts Section */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProductionChart />
            </div>
            <div>
              <ShiftYieldChart />
            </div>
          </div>
        </motion.div>

        {/* Machine Health */}
        <motion.div variants={itemVariants}>
          <MachineHealth />
        </motion.div>
      </motion.div>
    </AppLayout>
  )
}
