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
  X,
  FileText,
  Target,
  Bot,
  CreditCard,
  ClipboardList
} from 'lucide-react'

export const Sidebar: React.FC = () => {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const menuSections = [
    {
      title: null,
      items: [
        { name: 'Dashboard', icon: Home, path: '/', badge: null },
      ]
    },
    {
      title: 'Comercial',
      items: [
        { name: 'Vendas', icon: ShoppingCart, path: '/vendas', badge: 2 },
        { name: 'WhatsApp', icon: MessageSquare, path: '/whatsapp', badge: 5 },
        { name: 'Clientes', icon: Users, path: '/clientes', badge: null },
        { name: 'Marketing', icon: BarChart2, path: '/marketing', badge: null },
        { name: 'Ponto de Venda', icon: CreditCard, path: '/ponto-de-venda', badge: null },
      ]
    },
    {
      title: 'Operacional',
      items: [
        { name: 'Produtos', icon: Package, path: '/produtos', badge: null },
        { name: 'Pedidos', icon: ClipboardList, path: '/pedidos', badge: null },
        { name: 'Fornecedores', icon: Truck, path: '/fornecedores', badge: null },
        { name: 'Estoque', icon: Package, path: '/estoque', badge: null },
      ]
    },
    {
      title: 'Finanças',
      items: [
        { name: 'Financeiro', icon: DollarSign, path: '/financeiro', badge: null },
        { name: 'Plano de Crescimento', icon: TrendingUp, path: '/crescimento', badge: null },
        { name: 'Metas', icon: Target, path: '/metas', badge: null },
      ]
    },
    {
      title: 'Sistema',
      items: [
        { name: 'Agentes IA', icon: Bot, path: '/agentes-ia', badge: null },
        { name: 'Relatórios', icon: FileText, path: '/relatorios', badge: null },
        { name: 'Agenda', icon: Calendar, path: '/agenda', badge: null },
        { name: 'Configurações', icon: Settings, path: '/configuracoes', badge: null },
      ]
    }
  ]

  return (
    <>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ea580c;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #dc2626;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #ea580c transparent;
        }
      `}</style>
      <aside className={`bg-white border-r border-gray-200 h-screen transition-all duration-300 flex flex-col ${collapsed ? 'w-28' : 'w-72'}`}>
        {/* Header */}
        <div className="h-16 border-b border-gray-200 flex items-center px-4 relative">
          {/* Logo e Texto - com transição suave */}
          <div className={`flex items-center transition-all duration-300 ease-in-out ${collapsed
            ? 'opacity-0 scale-95 pointer-events-none absolute'
            : 'opacity-100 scale-100 relative'
            }`}>
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <div className="ml-3 min-w-0">
              <div className="font-bold text-gray-900 text-sm whitespace-nowrap">ERP & CRM</div>
              <div className="text-xs text-gray-500 whitespace-nowrap">Casa de Ração Premium</div>
            </div>
          </div>

          {/* Botão - sempre visível */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 transition-all duration-200 ${collapsed ? 'mx-auto' : 'ml-auto'
              }`}
          >
            {collapsed ? <Menu className="w-4 h-4 text-gray-400" /> : <X className="w-4 h-4 text-gray-400" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto custom-scrollbar">
          {collapsed ? (
            /* Layout para menu colapsado */
            <div className="h-full flex flex-col">
              {/* Seções principais no topo */}
              <div className="space-y-1">
                {menuSections.slice(0, -1).map((section) =>
                  section.items.map((item) => {
                    const isActive = pathname === item.path
                    return (
                      <div key={item.path}>
                        <Link href={item.path}>
                          <div
                            className={`flex items-center justify-center px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${isActive
                              ? 'bg-orange-500 text-white shadow-md'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }`}
                          >
                            <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                              }`} />

                            {/* Badge - sempre visível quando existe */}
                            {item.badge && (
                              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] w-4 h-4 inline-flex items-center justify-center font-bold rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        </Link>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Spacer para empurrar ícones de sistema para baixo */}
              <div className="flex-1"></div>

              {/* Ícones de sistema na parte inferior */}
              <div className="space-y-1 pb-2">
                {menuSections[menuSections.length - 1].items.map((item) => {
                  const isActive = pathname === item.path
                  return (
                    <div key={item.path}>
                      <Link href={item.path}>
                        <div
                          className={`flex items-center justify-center px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${isActive
                            ? 'bg-orange-500 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                          <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                            }`} />

                          {/* Badge - sempre visível quando existe */}
                          {item.badge && (
                            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] w-4 h-4 inline-flex items-center justify-center font-bold rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            /* Layout para menu expandido */
            <div className="space-y-4">
              {menuSections.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  {/* Section Title */}
                  {section.title && (
                    <div className="px-3 mb-2">
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {section.title}
                      </h3>
                    </div>
                  )}

                  {/* Section Items */}
                  <ul className="space-y-1">
                    {section.items.map((item) => {
                      const isActive = pathname === item.path
                      return (
                        <li key={item.path}>
                          <Link href={item.path}>
                            <div
                              className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${isActive
                                ? 'bg-orange-500 text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                              <div className="flex items-center">
                                <item.icon className={`mr-3 w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                                  }`} />
                                <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'
                                  }`}>
                                  {item.name}
                                </span>
                              </div>

                              {/* Badge - sempre visível quando existe */}
                              {item.badge && (
                                <span className={`px-2 py-1 min-w-[20px] h-5 inline-flex items-center justify-center text-xs font-bold rounded-full ${isActive
                                  ? 'bg-white text-orange-500'
                                  : 'bg-orange-100 text-orange-600'
                                  }`}>
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </nav>

        {/* User Profile */}
        {!collapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">JP</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">João Pedro</div>
                <div className="text-xs text-gray-500 truncate">Administrador</div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}