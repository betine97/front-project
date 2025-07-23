'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useMarcasQuantidade } from '@/hooks/useMarcasQuantidade'
import { useCategoriasMarcas } from '@/hooks/useCategoriasMarcas'
import { useProdutos } from '@/hooks/useProdutos'

interface DistribuicaoMarcasModalProps {
  isOpen: boolean
  onClose: () => void
}

export const DistribuicaoMarcasModal: React.FC<DistribuicaoMarcasModalProps> = ({
  isOpen,
  onClose
}) => {
  const { data: marcasData, isLoading, error } = useMarcasQuantidade()
  const { data: categoriasMarcasData, isLoading: loadingCategorias, error: errorCategorias } = useCategoriasMarcas()
  const { produtos: produtosData } = useProdutos()
  
  // Função para buscar categorias da marca
  const getCategoriasDaMarca = (marca: string) => {
    if (!categoriasMarcasData) return []
    
    return categoriasMarcasData
      .filter(categoria => categoria.Marcas.includes(marca))
      .map(categoria => categoria.Categoria)
  }

  // Função para buscar públicos-alvo da marca
  const getPublicosAlvoDaMarca = (marca: string) => {
    if (!produtosData || produtosData.length === 0) return []
    
    try {
      const publicosUnicos = Array.from(
        new Set(
          produtosData
            .filter(produto => produto.marca === marca)
            .map(produto => produto.destinado_para)
            .filter(Boolean)
        )
      )
      
      return publicosUnicos
    } catch (err) {
      return []
    }
  }

  // Controlar scroll do body quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup quando componente desmonta
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Fechar modal com ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Ordenar marcas por quantidade (decrescente)
  const sortedMarcas = marcasData
    ?.sort((a, b) => b.Quantidade - a.Quantidade)
    .slice(0, 10) || []

  const totalProdutos = marcasData?.reduce((sum, marca) => sum + marca.Quantidade, 0) || 0
  const maxValue = marcasData?.length ? Math.max(...marcasData.map(marca => marca.Quantidade)) : 1

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={handleBackdropClick}
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        zIndex: 9999
      }}
    >
      <div 
        className="bg-white rounded-xl p-6 w-[1000px] h-[600px] mx-4 overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-sm text-gray-500">Carregando dados...</div>
          </div>
        ) : error || !marcasData || marcasData.length === 0 ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Quantidade por Marca</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex items-center justify-center h-64">
              <div className="text-sm text-red-500">
                {error ? 'Erro ao carregar dados' : 'Nenhum dado encontrado'}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Cabeçalho do Modal */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 border border-white rounded-full" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Quantidade por Marca</h2>
                  <p className="text-xs text-gray-500">Distribuição completa de produtos</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Lista completa de marcas */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 mx-6 scrollbar-minimal" style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#e5e7eb #f9fafb'
            }}>
              {sortedMarcas.map((marcaData, index) => {
                const { Marca: marca, Quantidade: quantidade } = marcaData
                const percentage = (quantidade / totalProdutos) * 100
                const categorias = getCategoriasDaMarca(marca)
                const publicosAlvo = getPublicosAlvoDaMarca(marca)
                
                return (
                  <div key={marca} className="py-1.5 hover:bg-gray-50 rounded-lg px-3 transition-colors">
                    {/* Linha principal com ranking, marca, barra e números */}
                    <div className="flex items-center">
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                          index === 0 ? 'bg-orange-500' : 
                          index === 1 ? 'bg-orange-400' : 
                          index === 2 ? 'bg-orange-300' : 
                          index === 3 ? 'bg-orange-200 text-orange-800' : 'bg-gray-400'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="min-w-[100px]">
                          <div className="text-sm font-medium text-gray-900">{marca}</div>
                        </div>
                      </div>
                      
                      <div className="flex-1 mx-3">
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
                      
                      <div className="flex items-center space-x-2">
                        <div className="text-sm font-bold text-gray-900">{quantidade}</div>
                        <div className="text-xs font-medium text-orange-600 min-w-[30px]">{percentage.toFixed(0)}%</div>
                      </div>
                    </div>

                    {/* Tags das categorias e públicos-alvo lado a lado */}
                    {(categorias.length > 0 || publicosAlvo.length > 0) && (
                      <div className="flex items-center flex-wrap gap-1 mt-1 ml-6">
                        {/* Tags de categorias */}
                        {categorias.slice(0, 2).map((categoria) => (
                          <span
                            key={categoria}
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200"
                          >
                            {categoria}
                          </span>
                        ))}
                        
                        {/* Tags de públicos-alvo */}
                        {publicosAlvo.slice(0, 2).map((publico) => (
                          <span
                            key={publico}
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200"
                          >
                            {publico}
                          </span>
                        ))}
                        
                        {/* Indicador de mais itens */}
                        {(categorias.length > 2 || publicosAlvo.length > 2) && (
                          <span className="text-xs text-gray-400">
                            +{Math.max(0, categorias.length - 2) + Math.max(0, publicosAlvo.length - 2)} mais
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Rodapé com estatísticas */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Total de marcas: {sortedMarcas.length}</span>
                <span>Total de produtos: {totalProdutos}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )

  // Usar portal para renderizar no body
  return typeof window !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : null
}