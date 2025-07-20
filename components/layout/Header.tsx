'use client'

import React from 'react'
import { Search, Bell, Settings, Coins } from 'lucide-react'

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 sticky top-0 z-10">
      {/* Search Bar */}
      <div className="flex-1 flex items-center max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar produtos, clientes, vendas..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:bg-white transition-all duration-200 text-sm"
          />
        </div>
      </div>

      {/* Spacer to push icons to the right */}
      <div className="flex-1"></div>

      {/* Right Side Icons */}
      <div className="flex items-center space-x-2">
        {/* Notification Bell */}
        <button className="relative p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <Bell className="w-4 h-4 text-gray-600" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            1
          </span>
        </button>

        {/* Credits */}
        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <Coins className="w-4 h-4 text-gray-600" />
        </button>

        {/* Settings */}
        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <Settings className="w-4 h-4 text-gray-600" />
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-2 ml-3 pl-3 border-l border-gray-200">
          <div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">JP</span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">João Pedro</p>
            <p className="text-xs text-gray-500">Administrador</p>
          </div>
        </div>
      </div>
    </header>
  )
}