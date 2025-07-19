'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Package,
  Users,
  ShoppingCart,
  BarChart2,
  Calendar,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Truck,
  Settings,
  Menu,
  X
} from 'lucide-react'

export const Sidebar: React.FC = () => {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    { name: 'Início', icon: Home, path: '/' },
    { name: 'Produtos', icon: Package, path: '/produtos' },
    { name: 'Clientes', icon: Users, path: '/clientes' },
    { name: 'Vendas', icon: ShoppingCart, path: '/vendas' },
    { name: 'Marketing', icon: BarChart2, path: '/marketing' },
    { name: 'Agenda', icon: Calendar, path: '/agenda' },
    { name: 'WhatsApp', icon: MessageSquare, path: '/whatsapp' },
    { name: 'Crescimento', icon: TrendingUp, path: '/crescimento' },
    { name: 'Financeiro', icon: DollarSign, path: '/financeiro' },
    { name: 'Estoque', icon: Package, path: '/estoque' },
    { name: 'Fornecedores', icon: Truck, path: '/fornecedores' },
    { name: 'Funcionários', icon: Users, path: '/funcionarios' },
    { name: 'Agentes IA', icon: Users, path: '/agentes-ia' },
    { name: 'Configurações', icon: Settings, path: '/configuracoes' },
  ]

  return (
    <aside className={`bg-white border-r border-neutral-200 h-screen transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="h-16 border-b border-neutral-200 flex items-center justify-between px-6">
        {!collapsed && (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="ml-3 font-semibold text-neutral-900">PetShop Pro</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors duration-200"
        >
          {collapsed ? <Menu className="w-5 h-5 text-neutral-600" /> : <X className="w-5 h-5 text-neutral-600" />}
        </button>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <li key={item.path}>
                <Link href={item.path}>
                  <div
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <item.icon className={`${collapsed ? 'mx-auto' : 'mr-3'} w-5 h-5`} />
                    {!collapsed && <span>{item.name}</span>}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}