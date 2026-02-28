'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  Cpu,
  FileText,
  AlertTriangle,
  BarChart3,
  MessageSquare,
  Lightbulb,
  Settings,
} from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/employees', label: 'Employees', icon: Users },
    { href: '/machines', label: 'Machines', icon: Cpu },
    { href: '/logs', label: 'Production Logs', icon: FileText },
    { href: '/alerts', label: 'Alerts', icon: AlertTriangle },
    { href: '/summaries', label: 'Summaries', icon: BarChart3 },
    { href: '/chatbot', label: 'AI Assistant', icon: MessageSquare },
    { href: '/recommendations', label: 'Recommendations', icon: Lightbulb },
  ]

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col pt-20">
      {/* Logo Section */}
      <div className="px-6 py-4 border-b border-sidebar-border">
        <h2 className="text-xl font-bold text-sidebar-primary">SmartUsine Pro</h2>
        <p className="text-xs text-sidebar-foreground/60 mt-1">Smart Factory Management</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                className={`relative px-4 py-3 rounded-lg transition-colors flex items-center gap-3 cursor-pointer ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sidebar-primary-foreground rounded-r-full"
                    layoutId="sidebar-indicator"
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  />
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-6 border-t border-sidebar-border space-y-3">
        <button className="w-full px-4 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors flex items-center justify-center gap-2 text-sm">
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </aside>
  )
}
