'use client'

import { motion } from 'framer-motion'
import { Bell, User, LogOut } from 'lucide-react'
import { useAlerts } from '@/hooks/use-queries'

export default function Header() {
  const { data, isLoading } = useAlerts(0, 50, 'actif')
  const alerts = Array.isArray(data) ? data : (data?.data || [])
  const activeAlertCount = alerts.length

  return (
    <header className="fixed top-0 left-64 right-0 h-20 bg-card border-b border-border flex items-center justify-between px-8 z-40">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-foreground">Smart Factory Management</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Active Alerts */}
        <motion.div
          className="relative cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bell className="w-6 h-6 text-muted-foreground hover:text-foreground transition-colors" />
          {activeAlertCount > 0 && (
            <motion.span
              className="absolute -top-1 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10, stiffness: 100 }}
            >
              {activeAlertCount}
            </motion.span>
          )}
        </motion.div>

        {/* User Menu */}
        <div className="flex items-center gap-3 pl-6 border-l border-border">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">Admin User</p>
            <p className="text-xs text-muted-foreground">Factory Manager</p>
          </div>
          <motion.div
            className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <User className="w-6 h-6 text-primary-foreground" />
          </motion.div>
        </div>
      </div>
    </header>
  )
}
