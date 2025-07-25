'use client'

import React, { useState } from 'react'
import { useCategoriasQuantidade } from '@/hooks/useCategoriasQuantidade'
import { DistribuicaoCategoriasModal } from './DistribuicaoCategoriasModal'

export const DistribuicaoCategoriasProdutos: React.FC = () => {
  const { data: categoriasData, isLoading, error } = useCategoriasQuantidade()
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm text-gray-500">Carregando dados...</div>
      </div>
    )
  }

  if (error) {
    console.error('Erro ao carregar categorias:', error)
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm text-red-500">
          Erro ao carregar dados
          <br />
          <span className="text-xs text-gray-400">
            {typeof error === 'string' ? error : 'Erro desconhecido'}
          </span>
        </div>
      </div>
    )
  }

  if (!categoriasData || categoriasData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm text-gray-500">Nenhum dado encontrado</div>
      </div>
    )
  }

  // Ordenar categorias por quantidade (decrescente) e pegar top 10
  const sortedCategorias = categoriasData
    .sort((a, b) => b.Quantidade - a.Quantidade)
    .slice(0, 10)

  const totalProdutos = categoriasData.reduce((sum, categoria) => sum + categoria.Quantidade, 0)
  const maxValue = Math.max(...categoriasData.map(categoria => categoria.Quantidade))
  
  // Mostrar os primeiros 4 itens (o 4º com efeito fade)
  const currentItems = sortedCategorias.slice(0, 4)
  const remainingItems = sortedCategorias.length - 4

  return (
    <>
      {/* Botão invisível para ser acionado externamente */}
      <button
        data-expand-categorias
        onClick={() => setIsModalOpen(true)}
        className="hidden"
      />
      
      <div className="space-y-4">
        {/* Lista de categorias da página atual */}
        <div className="space-y-2 pt-4" style={{ minHeight: '140px' }}>
        {currentItems.map((categoriaData, index) => {
          const { Categoria: categoria, Quantidade: quantidade } = categoriaData
          const percentage = (quantidade / totalProdutos) * 100
          
          return (
            <div 
              key={categoria} 
              className="flex items-center py-1"
              style={{ 
                opacity: index === 3 ? 0.3 : 1,
                transform: index === 3 ? 'translateY(20%)' : 'translateY(0)',
                transition: 'all 0.3s ease'
              }}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                  index === 0 ? 'bg-orange-500' : 
                  index === 1 ? 'bg-orange-400' : 
                  index === 2 ? 'bg-orange-300' : 
                  index === 3 ? 'bg-orange-200 text-orange-800' : 'bg-gray-400'
                }`}>
                  {index + 1}
                </div>
                <div className="min-w-[80px]">
                  <div className="text-sm font-medium text-gray-900">{categoria}</div>
                </div>
              </div>
              
              <div className="flex-1 mx-3">
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      index < 4 ? 'bg-orange-500' : 'bg-gray-300'
                    }`}
                    style={{ 
                      width: `${(quantidade / maxValue) * 100}%`,
                      minWidth: '4px'
                    }}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="text-sm font-bold text-gray-900">{quantidade}</div>
                <div className="text-xs font-medium text-orange-600 min-w-[30px]">{percentage.toFixed(0)}%</div>
              </div>
            </div>
          )
        })}
        
        {/* Texto indicativo de itens restantes */}
        {remainingItems > 0 && (
          <div 
            className="flex items-center justify-center py-2"
            style={{ 
              opacity: 0.4,
              transition: 'opacity 0.3s ease'
            }}
          >
            <div className="text-xs font-medium text-gray-500">
              mais {remainingItems} {remainingItems === 1 ? 'item' : 'itens'}
            </div>
          </div>
        )}
      </div>


    </div>

    {/* Modal para visualização completa */}
    <DistribuicaoCategoriasModal 
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    />
  </>
  )
}