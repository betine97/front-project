'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

import { Produto } from '@/types/entities'

interface TreeViewSubcategoriasProps {
  products: Produto[]
  formatCurrency: (value: number) => string
}

export const TreeViewSubcategorias: React.FC<TreeViewSubcategoriasProps> = ({ products, formatCurrency }) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  // Agrupar produtos por categoria e variação
  const categorias = products.reduce((acc, product) => {
    const categoria = product.categoria
    const subcategoria = product.variacao || 'Geral'
    
    if (!acc[categoria]) {
      acc[categoria] = {}
    }
    
    if (!acc[categoria][subcategoria]) {
      acc[categoria][subcategoria] = []
    }
    
    acc[categoria][subcategoria].push(product)
    
    return acc
  }, {} as Record<string, Record<string, Produto[]>>)

  const toggleCategory = (categoria: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoria)) {
        newSet.delete(categoria)
      } else {
        newSet.add(categoria)
      }
      return newSet
    })
  }

  return (
    <div className="space-y-3">
      {Object.entries(categorias).map(([categoria, subcategorias], index) => {
        const totalProdutos = Object.values(subcategorias).flat().length
        const percentage = ((totalProdutos / products.length) * 100).toFixed(0)
        const maxProdutos = Math.max(...Object.entries(categorias).map(([, subs]) => Object.values(subs).flat().length))
        
        return (
          <div key={categoria} className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3 flex-1">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                  index === 0 ? 'bg-orange-500' : 
                  index === 1 ? 'bg-orange-400' : 
                  index === 2 ? 'bg-orange-300' : 'bg-gray-400'
                }`}>
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900 truncate">{categoria}</div>
                  <div className="text-xs text-gray-500">{totalProdutos} produtos</div>
                </div>
              </div>
              
              <div className="flex-1 max-w-[200px] mx-4">
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      index < 3 ? 'bg-orange-500' : 'bg-gray-300'
                    }`}
                    style={{ 
                      width: `${(totalProdutos / maxProdutos) * 100}%`,
                      minWidth: '4px'
                    }}
                  />
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900">{totalProdutos}</div>
                <div className="text-xs text-gray-500">{percentage}%</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}