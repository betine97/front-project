'use client'

import React, { useState } from 'react'

import { useMarcasQuantidade } from '@/hooks/useMarcasQuantidade'
import { useCategoriasMarcas } from '@/hooks/useCategoriasMarcas'
import { useProdutos } from '@/hooks/useProdutos'
import { DistribuicaoMarcasModal } from './DistribuicaoMarcasModal'

export const DistribuicaoMarcasProdutos: React.FC = () => {
  const { data: marcasData, isLoading, error } = useMarcasQuantidade()
  const { data: categoriasMarcasData, isLoading: loadingCategorias, error: errorCategorias } = useCategoriasMarcas()
  const { produtos: produtosData, loading: loadingProdutos, error: errorProdutos } = useProdutos()
  const [isModalOpen, setIsModalOpen] = useState(false)



  if (isLoading || loadingCategorias) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm text-gray-500">Carregando dados...</div>
      </div>
    )
  }

  if (error || errorCategorias) {
    console.error('Erro ao carregar marcas:', error)
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm text-red-500">
          Erro ao carregar dados
          <br />
          <span className="text-xs text-gray-400">
            {typeof error === 'string' ? error : (typeof errorCategorias === 'string' ? errorCategorias : 'Erro desconhecido')}
          </span>
        </div>
      </div>
    )
  }

  if (!marcasData || marcasData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm text-gray-500">Nenhum dado encontrado</div>
      </div>
    )
  }

  // Função para encontrar categorias de uma marca
  const getCategoriasDaMarca = (marca: string) => {
    if (!categoriasMarcasData) return []
    
    return categoriasMarcasData
      .filter(categoria => categoria.Marcas.includes(marca))
      .map(categoria => categoria.Categoria)
  }

  // Função para encontrar públicos-alvo de uma marca (usar dados diretos quando disponível)
  const getPublicosAlvoDaMarca = (marca: string) => {
    // Se não tem dados ainda, retorna array vazio silenciosamente
    if (!produtosData || produtosData.length === 0) return []
    
    try {
      const publicosUnicos = Array.from(
        new Set(
          produtosData
            .filter(produto => produto.marca === marca)
            .map(produto => produto.destinado_para)
            .filter(Boolean) // Remove valores vazios/null
        )
      )
      
      return publicosUnicos
    } catch (err) {
      return []
    }
  }

  // Ordenar marcas por quantidade (decrescente) e pegar top 10
  const sortedMarcas = marcasData
    .sort((a, b) => b.Quantidade - a.Quantidade)
    .slice(0, 10)

  const totalProdutos = marcasData.reduce((sum, marca) => sum + marca.Quantidade, 0)
  const maxValue = Math.max(...marcasData.map(marca => marca.Quantidade))
  
  // Mostrar os primeiros 3 itens (o 3º com efeito fade)
  const currentItems = sortedMarcas.slice(0, 3)
  const remainingItems = sortedMarcas.length - 3

  return (
    <>
      {/* Botão invisível para ser acionado externamente */}
      <button
        data-expand-marcas
        onClick={() => setIsModalOpen(true)}
        className="hidden"
      />
      
      <div className="space-y-4">
        {/* Lista de marcas da página atual */}
        <div className="space-y-2 pt-4" style={{ minHeight: '120px' }}>
        {currentItems.map((marcaData, index) => {
          const { Marca: marca, Quantidade: quantidade } = marcaData
          const percentage = (quantidade / totalProdutos) * 100
          const categorias = getCategoriasDaMarca(marca)
          const publicosAlvo = getPublicosAlvoDaMarca(marca)
          
          return (
            <div 
              key={marca} 
              className="py-2"
              style={{ 
                opacity: index === 2 ? 0.3 : 1,
                transform: index === 2 ? 'translateY(20%)' : 'translateY(0)',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Linha principal com ranking, marca, barra e números */}
              <div className="flex items-center">
                <div className="flex items-center space-x-2">
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                    index === 0 ? 'bg-orange-500' : 
                    index === 1 ? 'bg-orange-400' : 
                    index === 2 ? 'bg-orange-300 text-orange-800' : 'bg-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="min-w-[80px]">
                    <div className="text-sm font-medium text-gray-900">{marca}</div>
                  </div>
                </div>
                
                <div className="flex-1 mx-3">
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        index < 3 ? 'bg-orange-500' : 'bg-gray-300'
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
                <div className="flex items-center flex-wrap gap-1 mt-1 ml-7">
                  {/* Tags de categorias */}
                  {categorias.slice(0, 2).map((categoria, catIndex) => (
                    <span
                      key={categoria}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200"
                    >
                      {categoria}
                    </span>
                  ))}
                  
                  {/* Tags de públicos-alvo */}
                  {publicosAlvo.slice(0, 2).map((publico, pubIndex) => (
                    <span
                      key={publico}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200"
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


    </div>

    {/* Modal para visualização completa */}
    <DistribuicaoMarcasModal 
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    />
  </>
  )
}