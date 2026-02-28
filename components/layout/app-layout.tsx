'use client'

import { ReactNode } from 'react'
import Sidebar from './sidebar'
import Header from './header'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      <main className="ml-64 pt-20 p-8">
        {children}
      </main>
    </div>
  )
}
