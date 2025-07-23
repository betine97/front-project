'use client'

import React, { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface DashboardLayoutProps {
  children: ReactNode
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-neutral-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-visible">
        <Header />
        <main className="flex-1 overflow-y-auto overflow-x-visible" style={{ backgroundColor: 'white' }}>
          {children}
        </main>
      </div>
    </div>
  )
}