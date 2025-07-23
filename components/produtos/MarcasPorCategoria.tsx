'use client'

import React, { useState } from 'react'
import { useCategoriasMarcas } from '@/hooks/useCategoriasMarcas'
import { MarcasPorCategoriaModal } from './MarcasPorCategoriaModal'

export const MarcasPorCategoria: React.FC = () => {
  const { data: categoriasData, isLoading, error } = useCategoriasMarcas()
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (error) {
    console.error('Erro ao carregar categorias e marcas:', error)
    return (
      <div className="flex items-center justify-center h-full text-xs text-red-500">
        <div className="text-center">
          <div style={{ width: '24px', height: '24px', backgroundColor: '#FEE2E2', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
            <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p>Erro ao carregar dados</p>
        </div>
      </div>
    )
  }

  if (!categoriasData || categoriasData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-xs text-gray-500">
        <div className="text-center">
          <div style={{ width: '24px', height: '24px', backgroundColor: '#F3F4F6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
            <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p>Nenhum dado disponível</p>
        </div>
      </div>
    )
  }

  // Ordenar categorias por quantidade de marcas (decrescente) e pegar top 10
  const sortedCategorias = categoriasData
    .sort((a, b) => b.QuantidadeMarcas - a.QuantidadeMarcas)
    .slice(0, 10)

  const maxValue = Math.max(...sortedCategorias.map(categoria => categoria.QuantidadeMarcas))
  
  // Mostrar os primeiros 4 itens (o 4º com efeito fade)
  const currentItems = sortedCategorias.slice(0, 4)
  const remainingItems = sortedCategorias.length - 4

  return (
    <>
      {/* Botão invisível para ser acionado externalmente */}
      <button
        data-expand-marcas-categoria
        onClick={() => setIsModalOpen(true)}
        className="hidden"
      />
      
      <div className="h-full p-3 flex flex-col">
        {/* Título */}
        <div className="mb-3">
          <h4 className="text-xs font-semibold text-gray-700">Marcas por Categoria</h4>
          <p className="text-xs text-gray-500">Relação categoria/marca</p>
        </div>

        {/* Lista de categorias com barras horizontais */}
        <div className="space-y-2 pt-4" style={{ minHeight: '140px' }}>
          {currentItems.map((categoriaData, index) => {
            const { Categoria: categoria, QuantidadeMarcas: quantidade, Marcas: marcas } = categoriaData
            
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
                    <div className="text-sm font-medium text-gray-900">
                      {categoria.length > 12 ? categoria.substring(0, 12) + '...' : categoria}
                    </div>
                    <div className="text-xs text-gray-500">
                      {marcas.slice(0, 2).join(', ')}{marcas.length > 2 ? '...' : ''}
                    </div>
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
                  <div className="text-xs font-medium text-orange-600 min-w-[40px]">
                    marca{quantidade !== 1 ? 's' : ''}
                  </div>
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

        {/* Resumo */}
        <div className="mt-3 pt-2 border-t border-gray-100">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Top {currentItems.length} categorias</span>
            <span>
              {sortedCategorias.reduce((total, cat) => total + cat.QuantidadeMarcas, 0)} total marcas
            </span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <MarcasPorCategoriaModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  )
}