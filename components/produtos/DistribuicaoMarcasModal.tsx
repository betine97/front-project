'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useMarcasQuantidade } from '@/hooks/useMarcasQuantidade'

interface DistribuicaoMarcasModalProps {
  isOpen: boolean
  onClose: () => void
}

export const DistribuicaoMarcasModal: React.FC<DistribuicaoMarcasModalProps> = ({
  isOpen,
  onClose
}) => {
  const { data: marcasData, isLoading, error } = useMarcasQuantidade()

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
        className="bg-white rounded-xl p-5 max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto shadow-2xl"
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
            <div className="space-y-2">
              {sortedMarcas.map((marcaData, index) => {
                const { Marca: marca, Quantidade: quantidade } = marcaData
                const percentage = (quantidade / totalProdutos) * 100
                
                return (
                  <div key={marca} className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors">
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
                              minWidth: '6px'
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="text-right min-w-[60px]">
                        <div className="text-sm font-bold text-gray-900">{quantidade}</div>
                        <div className="text-xs text-gray-500">{percentage.toFixed(0)}%</div>
                      </div>
                    </div>
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