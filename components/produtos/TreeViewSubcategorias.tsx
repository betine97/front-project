'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

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

interface TreeViewSubcategoriasProps {
  products: Product[]
  formatCurrency: (value: number) => string
}

export const TreeViewSubcategorias: React.FC<TreeViewSubcategoriasProps> = ({ products, formatCurrency }) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  // Agrupar produtos por categoria e subcategoria
  const categorias = products.reduce((acc, product) => {
    const categoria = product.category
    
    // Inferir subcategoria do nome do produto
    let subcategoria = 'Geral'
    
    if (categoria === 'Alimentação') {
      if (product.name.toLowerCase().includes('gato')) subcategoria = 'Gatos'
      else if (product.name.toLowerCase().includes('cão') || product.name.toLowerCase().includes('cachorro')) subcategoria = 'Cães'
      else if (product.name.toLowerCase().includes('filhote')) subcategoria = 'Filhotes'
    } else if (categoria === 'Higiene') {
      if (product.name.toLowerCase().includes('shampoo')) subcategoria = 'Shampoos'
      else if (product.name.toLowerCase().includes('escova')) subcategoria = 'Escovas'
    } else if (categoria === 'Brinquedos') {
      if (product.name.toLowerCase().includes('bola')) subcategoria = 'Bolas'
      else if (product.name.toLowerCase().includes('interativo')) subcategoria = 'Interativos'
    } else if (categoria === 'Acessórios') {
      if (product.name.toLowerCase().includes('coleira')) subcategoria = 'Coleiras'
    } else if (categoria === 'Medicamentos') {
      if (product.name.toLowerCase().includes('vermífugo')) subcategoria = 'Vermífugos'
      else if (product.name.toLowerCase().includes('antipulgas')) subcategoria = 'Antipulgas'
    }
    
    if (!acc[categoria]) {
      acc[categoria] = {}
    }
    
    if (!acc[categoria][subcategoria]) {
      acc[categoria][subcategoria] = []
    }
    
    acc[categoria][subcategoria].push(product)
    
    return acc
  }, {} as Record<string, Record<string, Product[]>>)

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
    <div className="space-y-2">
      {Object.entries(categorias).map(([categoria, subcategorias]) => {
        const isExpanded = expandedCategories.has(categoria)
        const totalProdutos = Object.values(subcategorias).flat().length
        
        return (
          <div key={categoria} className="border border-neutral-200 rounded-lg overflow-hidden">
            <div 
              className="flex items-center justify-between p-3 bg-neutral-50 cursor-pointer hover:bg-neutral-100 transition-colors"
              onClick={() => toggleCategory(categoria)}
            >
              <div className="flex items-center space-x-2">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-neutral-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-neutral-500" />
                )}
                <span className="font-medium text-neutral-800">{categoria}</span>
              </div>
              <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full">
                {totalProdutos} produtos
              </span>
            </div>
            
            {isExpanded && (
              <div className="p-3 space-y-3 bg-white">
                {Object.entries(subcategorias).map(([subcategoria, produtos]) => (
                  <div key={subcategoria} className="pl-4 border-l-2 border-neutral-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-neutral-700">{subcategoria}</span>
                      <span className="text-xs text-neutral-500">
                        {produtos.length} {produtos.length === 1 ? 'produto' : 'produtos'}
                      </span>
                    </div>
                    
                    <div className="space-y-1 pl-3">
                      {produtos.slice(0, 3).map(produto => (
                        <div key={produto.id} className="text-xs text-neutral-600 flex items-center justify-between">
                          <span className="truncate max-w-[200px]">{produto.name}</span>
                          <span className="text-primary font-medium">{formatCurrency(produto.price)}</span>
                        </div>
                      ))}
                      
                      {produtos.length > 3 && (
                        <div className="text-xs text-neutral-400 italic">
                          + {produtos.length - 3} mais...
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}