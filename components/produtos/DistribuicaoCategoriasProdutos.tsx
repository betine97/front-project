'use client'

import React, { useState } from 'react'
import { useCategoriasQuantidade } from '@/hooks/useCategoriasQuantidade'
import { DistribuicaoCategoriasModal } from './DistribuicaoCategoriasModal'

export const DistribuicaoCategoriasProdutos: React.FC = () => {
  const { data: categoriasData, isLoading, error } = useCategoriasQuantidade()
  const [currentPage, setCurrentPage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const itemsPerPage = 3

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
            {error instanceof Error ? error.message : 'Erro desconhecido'}
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
  
  // Calcular paginação
  const totalPages = Math.ceil(sortedCategorias.length / itemsPerPage)
  const startIndex = currentPage * itemsPerPage
  const currentItems = sortedCategorias.slice(startIndex, startIndex + itemsPerPage)

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
          {currentItems.map((categoriaData, pageIndex) => {
            const originalIndex = startIndex + pageIndex
            const { Categoria: categoria, Quantidade: quantidade } = categoriaData
            const percentage = (quantidade / totalProdutos) * 100
            
            return (
              <div key={categoria} className="flex items-center py-1">
                <div className="flex items-center space-x-2">
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                    originalIndex === 0 ? 'bg-orange-500' : 
                    originalIndex === 1 ? 'bg-orange-400' : 
                    originalIndex === 2 ? 'bg-orange-300' : 
                    originalIndex === 3 ? 'bg-orange-200 text-orange-800' : 'bg-gray-400'
                  }`}>
                    {originalIndex + 1}
                  </div>
                  <div className="min-w-[80px]">
                    <div className="text-sm font-medium text-gray-900">{categoria}</div>
                  </div>
                </div>
                
                <div className="flex-1 mx-3">
                  <div className="w-full bg-gray-100 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full transition-all duration-500 ${
                        originalIndex < 4 ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                      style={{ 
                        width: `${(quantidade / maxValue) * 100}%`,
                        minWidth: '2px'
                      }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="text-lg font-bold text-gray-900">{quantidade}</div>
                  <div className="text-xs font-medium text-orange-600 min-w-[30px]">{percentage.toFixed(0)}%</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Controles de paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 pt-2">
            {/* Seta para esquerda */}
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className={`p-1 rounded-full transition-colors ${
                currentPage === 0 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-500 hover:text-orange-500 hover:bg-orange-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Bolinhas de paginação */}
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentPage 
                    ? 'bg-orange-500 scale-125' 
                    : 'bg-gray-300 hover:bg-orange-300'
                }`}
              />
            ))}

            {/* Seta para direita */}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className={`p-1 rounded-full transition-colors ${
                currentPage === totalPages - 1 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-500 hover:text-orange-500 hover:bg-orange-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Modal para visualização completa */}
      <DistribuicaoCategoriasModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}