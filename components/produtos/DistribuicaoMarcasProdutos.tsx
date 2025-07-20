'use client'

import React from 'react'

import { Produto } from '@/types/entities'

interface DistribuicaoMarcasProdutosProps {
  products: Produto[]
}

export const DistribuicaoMarcasProdutos: React.FC<DistribuicaoMarcasProdutosProps> = ({ products }) => {
  // Calcular distribuição de marcas
  const marcasCount = products.reduce((acc, product) => {
    const marca = product.marca || 'Sem Marca'
    acc[marca] = (acc[marca] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Ordenar marcas por quantidade
  const sortedMarcas = Object.entries(marcasCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10) // Top 10 marcas

  const totalProdutos = products.length
  const maxValue = Math.max(...Object.values(marcasCount))

  return (
    <div className="space-y-3">
      {sortedMarcas.map(([marca, quantidade], index) => {
        const percentage = (quantidade / totalProdutos) * 100
        
        return (
          <div key={marca} className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3 flex-1">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                  index === 0 ? 'bg-orange-500' : 
                  index === 1 ? 'bg-orange-400' : 
                  index === 2 ? 'bg-orange-300' : 
                  index === 3 ? 'bg-orange-200 text-orange-800' : 'bg-gray-400'
                }`}>
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900 truncate">{marca}</div>
                  <div className="text-xs text-gray-500">{quantidade} produtos</div>
                </div>
              </div>
              
              <div className="flex-1 max-w-[200px] mx-4">
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      index < 4 ? 'bg-orange-500' : 'bg-gray-300'
                    }`}
                    style={{ 
                      width: `${(quantidade / maxValue) * 100}%`,
                      minWidth: '4px'
                    }}
                  />
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900">{quantidade}</div>
                <div className="text-xs text-gray-500">{percentage.toFixed(0)}%</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}