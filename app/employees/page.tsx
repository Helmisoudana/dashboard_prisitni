'use client'

import { motion } from 'framer-motion'
import AppLayout from '@/components/layout/app-layout'
import EmployeeTable from '@/components/employees/employee-table'
import { CreateEmployeeDialog } from '@/components/employees/create-employee-dialog'

export default function EmployeesPage() {
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
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Employees</h1>
            <p className="text-muted-foreground mt-2">Manage and monitor workforce performance</p>
          </div>
          <CreateEmployeeDialog />
        </motion.div>

        {/* Employee Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <EmployeeTable />
        </motion.div>
      </motion.div>
    </AppLayout>
  )
}
