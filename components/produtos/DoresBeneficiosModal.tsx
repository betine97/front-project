'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useProdutos } from '@/hooks/useProdutos'

interface DoresBeneficiosModalProps {
  isOpen: boolean
  onClose: () => void
}

export const DoresBeneficiosModal: React.FC<DoresBeneficiosModalProps> = ({
  isOpen,
  onClose
}) => {
  const { produtos: doresData, loading, error, refetch } = useProdutos()

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

  // Contar dores e benefícios
  const contarItems = (items: typeof doresData, campo: 'dor' | 'beneficio') => {
    if (!items) return []
    
    const contagem = items.reduce((acc, item) => {
      const valor = item[campo];
      acc[valor] = (acc[valor] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(contagem)
      .sort((a, b) => b[1] - a[1])
      .map(([nome, quantidade]) => ({ nome, quantidade }));
  };

  // Agrupar por categoria
  const dadosPorCategoria = doresData ? doresData.reduce((acc, item) => {
    if (!acc[item.categoria]) {
      acc[item.categoria] = [];
    }
    acc[item.categoria].push(item);
    return acc;
  }, {} as Record<string, typeof doresData>) : {}

  // Preparar dados para visualização - mostrar todas as categorias na modal
  const categoriasComDados = Object.entries(dadosPorCategoria)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([categoria, items]) => ({
      categoria,
      items,
      dores: contarItems(items, 'dor'),
      beneficios: contarItems(items, 'beneficio')
    }));

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
        {loading === 'loading' ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-sm text-gray-500">Carregando dados...</div>
          </div>
        ) : error || !doresData || doresData.length === 0 ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Dores e Benefícios</h2>
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
                <div className="w-6 h-6 bg-gray-500 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 border border-white rounded-full" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Dores e Benefícios</h2>
                  <p className="text-xs text-gray-500">Problemas e soluções identificados</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Lista completa de categorias */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 mx-6 scrollbar-minimal">
              {categoriasComDados.map((categoriaData, categoriaIndex) => (
                <div 
                  key={categoriaData.categoria} 
                  className="bg-white rounded-lg border border-gray-200 p-2.5 hover:bg-gray-50 transition-colors"
                >
                  {/* Header da Categoria */}
                  <div className="mb-2">
                    <h5 className="text-sm font-semibold text-gray-900 capitalize">
                      {categoriaData.categoria}
                    </h5>
                    <p className="text-xs text-gray-500">
                      {categoriaData.items.length} {categoriaData.items.length === 1 ? 'relação' : 'relações'}
                    </p>
                  </div>

                  {/* Seção de Dores */}
                  <div className="mb-2">
                    <div className="mb-1.5">
                      <span className="text-xs font-semibold text-gray-700">Dores</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {categoriaData.dores.slice(0, 6).map((dor) => (
                        <span 
                          key={dor.nome}
                          className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-700 border border-gray-300"
                        >
                          {dor.nome}
                          {dor.quantidade > 1 && (
                            <span className="ml-1 px-1 py-0.5 bg-gray-200 text-gray-800 rounded text-xs font-bold">
                              {dor.quantidade}
                            </span>
                          )}
                        </span>
                      ))}
                      {categoriaData.dores.length > 6 && (
                        <span className="text-xs text-gray-400 px-1.5 py-0.5">
                          +{categoriaData.dores.length - 6} mais
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Seção de Benefícios */}
                  <div>
                    <div className="mb-1.5">
                      <span className="text-xs font-semibold text-gray-700">Benefícios</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {categoriaData.beneficios.slice(0, 6).map((beneficio) => (
                        <span 
                          key={beneficio.nome}
                          className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-700 border border-gray-300"
                        >
                          {beneficio.nome}
                          {beneficio.quantidade > 1 && (
                            <span className="ml-1 px-1 py-0.5 bg-gray-200 text-gray-800 rounded text-xs font-bold">
                              {beneficio.quantidade}
                            </span>
                          )}
                        </span>
                      ))}
                      {categoriaData.beneficios.length > 6 && (
                        <span className="text-xs text-gray-400 px-1.5 py-0.5">
                          +{categoriaData.beneficios.length - 6} mais
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Rodapé com estatísticas */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Total de categorias: {categoriasComDados.length}</span>
                <span>Total de itens: {doresData.length}</span>
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