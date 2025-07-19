'use client'

import React from 'react'

interface Product {
  id: string
  name: string
  category: string
  price: number
  cost: number
  stock: number
  minStock: number
  sku: string
  status: 'active' | 'inactive' | 'out_of_stock'
  image?: string
  description?: string
  supplier?: string
  lastSale?: string
  totalSales: number
  targetAudience?: string
  solves?: string
  benefits?: string[]
  animalTypes?: string[]
}

interface DistribuicaoMarcasProdutosProps {
  products: Product[]
}

export const DistribuicaoMarcasProdutos: React.FC<DistribuicaoMarcasProdutosProps> = ({ products }) => {
  // Calcular distribuição de marcas
  const marcasCount = products.reduce((acc, product) => {
    const marca = product.supplier || 'Sem Marca'
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
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-neutral-900">Distribuição por Marca</h3>
      
      <div className="space-y-3">
        {sortedMarcas.map(([marca, quantidade]) => {
          const percentage = (quantidade / totalProdutos) * 100
          
          return (
            <div key={marca} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-700">{marca}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-primary">{quantidade}</span>
                  <span className="text-xs text-neutral-500">({percentage.toFixed(1)}%)</span>
                </div>
              </div>
              
              <div className="w-full bg-neutral-100 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${(quantidade / maxValue) * 100}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}