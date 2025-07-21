'use client'

import React, { useState } from 'react'
import { useCategoriasMarcas } from '@/hooks/useCategoriasMarcas'
import { MarcasPorCategoriaModal } from './MarcasPorCategoriaModal'

export const MarcasPorCategoria: React.FC = () => {
  const { data: categoriasData, isLoading, error } = useCategoriasMarcas()
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
    console.error('Erro ao carregar categorias e marcas:', error)
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

  // Ordenar categorias por quantidade de marcas (decrescente)
  const sortedCategorias = categoriasData
    .sort((a, b) => b.QuantidadeMarcas - a.QuantidadeMarcas)
    .slice(0, 10)

  const totalMarcas = categoriasData.reduce((sum, categoria) => sum + categoria.QuantidadeMarcas, 0)
  const maxValue = Math.max(...categoriasData.map(categoria => categoria.QuantidadeMarcas))
  
  // Calcular paginação
  const totalPages = Math.ceil(sortedCategorias.length / itemsPerPage)
  const startIndex = currentPage * itemsPerPage
  const currentItems = sortedCategorias.slice(startIndex, startIndex + itemsPerPage)

  return (
    <>
      {/* Botão invisível para ser acionado externamente */}
      <button
        data-expand-marcas-categoria
        onClick={() => setIsModalOpen(true)}
        className="hidden"
      />
      
      <div className="space-y-4">
        {/* Lista de categorias da página atual */}
        <div className="space-y-2 pt-4" style={{ minHeight: '160px' }}>
          {currentItems.map((categoriaData, pageIndex) => {
            const originalIndex = startIndex + pageIndex
            const { Categoria: categoria, Marcas: marcas, QuantidadeMarcas: quantidade } = categoriaData
            const percentage = (quantidade / totalMarcas) * 100
            
            return (
              <div key={categoria} className="py-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2 flex-1">
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                      originalIndex === 0 ? 'bg-orange-500' : 
                      originalIndex === 1 ? 'bg-orange-400' : 
                      originalIndex === 2 ? 'bg-orange-300' : 
                      originalIndex === 3 ? 'bg-orange-200 text-orange-800' : 'bg-gray-400'
                    }`}>
                      {originalIndex + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{categoria}</div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-1 bg-gray-100 rounded-full">
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
                      
                      <div className="text-right min-w-[40px]">
                        <div className="text-sm font-bold text-gray-900">{quantidade}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Lista compacta de marcas da categoria */}
                <div className="ml-7 flex flex-wrap gap-1">
                  {marcas.slice(0, 6).map((marca, index) => (
                    <span
                      key={marca}
                      className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      {marca}
                    </span>
                  ))}
                  {marcas.length > 6 && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700">
                      +{marcas.length - 6}
                    </span>
                  )}
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
      <MarcasPorCategoriaModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}