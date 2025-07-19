'use client'

import React from 'react'
import { Search, Bell, User, Settings } from 'lucide-react'

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-neutral-200 h-16 flex items-center px-6 sticky top-0 z-10">
      <div className="flex-1 flex items-center">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors duration-200 relative">
          <Bell className="w-5 h-5 text-neutral-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors duration-200">
          <Settings className="w-5 h-5 text-neutral-600" />
        </button>
        <div className="h-8 w-px bg-neutral-200"></div>
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-neutral-900">Usuário</p>
            <p className="text-xs text-neutral-500">Administrador</p>
          </div>
        </div>
      </div>
    </header>
  )
}