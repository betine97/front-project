'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useCategoriasMarcas } from '@/hooks/useCategoriasMarcas'

// Componente da Tabela de Intersecções
const VennTableView: React.FC<{ data: any[] }> = ({ data }) => {
  if (!data || data.length < 2) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p>Dados insuficientes para análise de intersecções</p>
        </div>
      </div>
    )
  }

  // Pegar as 3 principais categorias
  const [cat1, cat2, cat3] = data.slice(0, 3)

  // Calcular intersecções
  const calculateIntersections = () => {
    const intersection12 = cat1.Marcas.filter((marca: string) => cat2.Marcas.includes(marca))
    const intersection13 = cat3 ? cat1.Marcas.filter((marca: string) => cat3.Marcas.includes(marca)) : []
    const intersection23 = cat3 ? cat2.Marcas.filter((marca: string) => cat3.Marcas.includes(marca)) : []
    const intersection123 = cat3 ? cat1.Marcas.filter((marca: string) => 
      cat2.Marcas.includes(marca) && cat3.Marcas.includes(marca)
    ) : []

    // Marcas exclusivas
    const exclusive1 = cat1.Marcas.filter((marca: string) => 
      !cat2.Marcas.includes(marca) && (!cat3 || !cat3.Marcas.includes(marca))
    )
    const exclusive2 = cat2.Marcas.filter((marca: string) => 
      !cat1.Marcas.includes(marca) && (!cat3 || !cat3.Marcas.includes(marca))
    )
    const exclusive3 = cat3 ? cat3.Marcas.filter((marca: string) => 
      !cat1.Marcas.includes(marca) && !cat2.Marcas.includes(marca)
    ) : []

    return { 
      intersection12, intersection13, intersection23, intersection123,
      exclusive1, exclusive2, exclusive3
    }
  }

  const intersections = calculateIntersections()

  // Criar dados para a tabela
  const tableData = []

  // Categorias exclusivas
  if (intersections.exclusive1.length > 0) {
    tableData.push({
      categoria: cat1.Categoria,
      marcas: intersections.exclusive1,
      total: intersections.exclusive1.length,
      color: '#FB923C'
    })
  }

  if (intersections.exclusive2.length > 0) {
    tableData.push({
      categoria: cat2.Categoria,
      marcas: intersections.exclusive2,
      total: intersections.exclusive2.length,
      color: '#6B7280'
    })
  }

  if (cat3 && intersections.exclusive3.length > 0) {
    tableData.push({
      categoria: cat3.Categoria,
      marcas: intersections.exclusive3,
      total: intersections.exclusive3.length,
      color: '#9CA3AF'
    })
  }

  // Intersecções duplas
  if (intersections.intersection12.length > 0) {
    tableData.push({
      categoria: `${cat1.Categoria} e ${cat2.Categoria}`,
      marcas: intersections.intersection12,
      total: intersections.intersection12.length,
      color: '#4B5563'
    })
  }

  if (cat3 && intersections.intersection13.length > 0) {
    tableData.push({
      categoria: `${cat1.Categoria} e ${cat3.Categoria}`,
      marcas: intersections.intersection13,
      total: intersections.intersection13.length,
      color: '#4B5563'
    })
  }

  if (cat3 && intersections.intersection23.length > 0) {
    tableData.push({
      categoria: `${cat2.Categoria} e ${cat3.Categoria}`,
      marcas: intersections.intersection23,
      total: intersections.intersection23.length,
      color: '#4B5563'
    })
  }

  // Intersecção tripla
  if (cat3 && intersections.intersection123.length > 0) {
    tableData.push({
      categoria: `${cat1.Categoria}, ${cat2.Categoria} e ${cat3.Categoria}`,
      marcas: intersections.intersection123,
      total: intersections.intersection123.length,
      color: '#374151'
    })
  }

  return (
    <div className="space-y-4">
      {tableData.map((item, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{item.categoria}</h3>
                <p className="text-xs text-gray-500">{item.total} marca{item.total !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="text-lg font-bold" style={{ color: item.color }}>
              {item.total}
            </div>
          </div>
          
          {/* Lista de marcas */}
          <div className="flex flex-wrap gap-2">
            {item.marcas.map((marca: string, marcaIndex: number) => (
              <span
                key={marcaIndex}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
              >
                {marca}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Componente do Diagrama de Venn em escala maior
const VennDiagramLarge: React.FC<{ data: any[] }> = ({ data }) => {
  const [hoveredArea, setHoveredArea] = useState<string | null>(null)
  
  if (!data || data.length < 2) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p>Dados insuficientes para Diagrama de Venn</p>
        </div>
      </div>
    )
  }

  // Pegar as 3 principais categorias
  const [cat1, cat2, cat3] = data.slice(0, 3)

  // Calcular intersecções
  const calculateIntersections = () => {
    const intersection12 = cat1.Marcas.filter((marca: string) => cat2.Marcas.includes(marca))
    const intersection13 = cat3 ? cat1.Marcas.filter((marca: string) => cat3.Marcas.includes(marca)) : []
    const intersection23 = cat3 ? cat2.Marcas.filter((marca: string) => cat3.Marcas.includes(marca)) : []
    const intersection123 = cat3 ? cat1.Marcas.filter((marca: string) => 
      cat2.Marcas.includes(marca) && cat3.Marcas.includes(marca)
    ) : []

    return { intersection12, intersection13, intersection23, intersection123 }
  }

  const intersections = calculateIntersections()

  return (
    <svg width="600" height="500" viewBox="0 0 600 500" className="max-w-full max-h-full">
      {/* Definir gradientes em tons de cinza */}
      <defs>
        <radialGradient id="gradGray1Large" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#9CA3AF" stopOpacity="0.04" />
        </radialGradient>
        <radialGradient id="gradGray2Large" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6B7280" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#6B7280" stopOpacity="0.04" />
        </radialGradient>
        <radialGradient id="gradGray3Large" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4B5563" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#4B5563" stopOpacity="0.04" />
        </radialGradient>
      </defs>

      {cat3 ? (
        // Diagrama de 3 círculos - Escala grande
        <>
          {/* Círculo 1 - Categoria 1 */}
          <circle
            cx="200"
            cy="180"
            r="140"
            fill="url(#gradGray1Large)"
            stroke="#9CA3AF"
            strokeWidth="2"
            className="cursor-pointer transition-all duration-300"
            opacity={hoveredArea === 'cat1' || hoveredArea === null ? 1 : 0.3}
            onMouseEnter={() => setHoveredArea('cat1')}
            onMouseLeave={() => setHoveredArea(null)}
          />
          
          {/* Círculo 2 - Categoria 2 */}
          <circle
            cx="400"
            cy="180"
            r="140"
            fill="url(#gradGray2Large)"
            stroke="#6B7280"
            strokeWidth="2"
            className="cursor-pointer transition-all duration-300"
            opacity={hoveredArea === 'cat2' || hoveredArea === null ? 1 : 0.3}
            onMouseEnter={() => setHoveredArea('cat2')}
            onMouseLeave={() => setHoveredArea(null)}
          />
          
          {/* Círculo 3 - Categoria 3 */}
          <circle
            cx="300"
            cy="300"
            r="140"
            fill="url(#gradGray3Large)"
            stroke="#4B5563"
            strokeWidth="2"
            className="cursor-pointer transition-all duration-300"
            opacity={hoveredArea === 'cat3' || hoveredArea === null ? 1 : 0.3}
            onMouseEnter={() => setHoveredArea('cat3')}
            onMouseLeave={() => setHoveredArea(null)}
          />

          {/* Labels das categorias */}
          <text x="130" y="100" textAnchor="start" style={{ fontSize: '14px', fontWeight: '600', fill: '#6B7280' }}>
            {cat1.Categoria}
          </text>
          <text x="470" y="100" textAnchor="end" style={{ fontSize: '14px', fontWeight: '600', fill: '#6B7280' }}>
            {cat2.Categoria}
          </text>
          <text x="300" y="420" textAnchor="middle" style={{ fontSize: '14px', fontWeight: '600', fill: '#6B7280' }}>
            {cat3.Categoria}
          </text>

          {/* Marcas nas áreas exclusivas */}
          {/* Área exclusiva cat1 */}
          <g>
            {cat1.Marcas.filter((marca: string) => 
              !cat2.Marcas.includes(marca) && !cat3.Marcas.includes(marca)
            ).slice(0, 6).map((marca: string, index: number) => (
              <text 
                key={marca} 
                x="150" 
                y={160 + (index * 16)} 
                textAnchor="start" 
                style={{ fontSize: '12px', fontWeight: '400', fill: '#9CA3AF' }}
              >
                {marca.length > 12 ? marca.substring(0, 12) + '...' : marca}
              </text>
            ))}
          </g>

          {/* Área exclusiva cat2 */}
          <g>
            {cat2.Marcas.filter((marca: string) => 
              !cat1.Marcas.includes(marca) && !cat3.Marcas.includes(marca)
            ).slice(0, 6).map((marca: string, index: number) => (
              <text 
                key={marca} 
                x="450" 
                y={160 + (index * 16)} 
                textAnchor="end" 
                style={{ fontSize: '12px', fontWeight: '400', fill: '#9CA3AF' }}
              >
                {marca.length > 12 ? marca.substring(0, 12) + '...' : marca}
              </text>
            ))}
          </g>

          {/* Área exclusiva cat3 */}
          <g>
            {cat3.Marcas.filter((marca: string) => 
              !cat1.Marcas.includes(marca) && !cat2.Marcas.includes(marca)
            ).slice(0, 6).map((marca: string, index: number) => (
              <text 
                key={marca} 
                x="300" 
                y={320 + (index * 16)} 
                textAnchor="middle" 
                style={{ fontSize: '12px', fontWeight: '400', fill: '#9CA3AF' }}
              >
                {marca.length > 12 ? marca.substring(0, 12) + '...' : marca}
              </text>
            ))}
          </g>

          {/* Marcas nas intersecções */}
          {intersections.intersection12.length > 0 && (
            <g>
              {intersections.intersection12.slice(0, 3).map((marca: string, index: number) => (
                <text 
                  key={marca}
                  x="300" 
                  y={150 + (index * 16)} 
                  textAnchor="middle" 
                  style={{ fontSize: '12px', fontWeight: '500', fill: '#6B7280' }}
                >
                  {marca.length > 10 ? marca.substring(0, 10) + '...' : marca}
                </text>
              ))}
            </g>
          )}

          {intersections.intersection13.length > 0 && (
            <g>
              {intersections.intersection13.slice(0, 2).map((marca: string, index: number) => (
                <text 
                  key={marca}
                  x="250" 
                  y={240 + (index * 16)} 
                  textAnchor="start" 
                  style={{ fontSize: '12px', fontWeight: '500', fill: '#6B7280' }}
                >
                  {marca.length > 10 ? marca.substring(0, 10) + '...' : marca}
                </text>
              ))}
            </g>
          )}

          {intersections.intersection23.length > 0 && (
            <g>
              {intersections.intersection23.slice(0, 2).map((marca: string, index: number) => (
                <text 
                  key={marca}
                  x="350" 
                  y={240 + (index * 16)} 
                  textAnchor="end" 
                  style={{ fontSize: '12px', fontWeight: '500', fill: '#6B7280' }}
                >
                  {marca.length > 10 ? marca.substring(0, 10) + '...' : marca}
                </text>
              ))}
            </g>
          )}

          {intersections.intersection123.length > 0 && (
            <text x="300" y="220" textAnchor="middle" style={{ fontSize: '12px', fontWeight: '600', fill: '#4B5563' }}>
              {intersections.intersection123[0].length > 10 ? 
                intersections.intersection123[0].substring(0, 10) + '...' : 
                intersections.intersection123[0]
              }
            </text>
          )}
        </>
      ) : (
        // Diagrama de 2 círculos - Escala grande
        <>
          {/* Círculo 1 - Categoria 1 */}
          <circle
            cx="220"
            cy="250"
            r="160"
            fill="url(#gradGray1Large)"
            stroke="#9CA3AF"
            strokeWidth="2"
            className="cursor-pointer transition-all duration-300"
            opacity={hoveredArea === 'cat1' || hoveredArea === null ? 1 : 0.3}
            onMouseEnter={() => setHoveredArea('cat1')}
            onMouseLeave={() => setHoveredArea(null)}
          />
          
          {/* Círculo 2 - Categoria 2 */}
          <circle
            cx="380"
            cy="250"
            r="160"
            fill="url(#gradGray2Large)"
            stroke="#6B7280"
            strokeWidth="2"
            className="cursor-pointer transition-all duration-300"
            opacity={hoveredArea === 'cat2' || hoveredArea === null ? 1 : 0.3}
            onMouseEnter={() => setHoveredArea('cat2')}
            onMouseLeave={() => setHoveredArea(null)}
          />

          {/* Labels das categorias */}
          <text x="140" y="130" textAnchor="start" style={{ fontSize: '14px', fontWeight: '600', fill: '#6B7280' }}>
            {cat1.Categoria}
          </text>
          <text x="460" y="130" textAnchor="end" style={{ fontSize: '14px', fontWeight: '600', fill: '#6B7280' }}>
            {cat2.Categoria}
          </text>

          {/* Marcas nas áreas exclusivas */}
          {/* Área exclusiva cat1 */}
          <g>
            {cat1.Marcas.filter((marca: string) => !cat2.Marcas.includes(marca)).slice(0, 8).map((marca: string, index: number) => (
              <text 
                key={marca} 
                x="160" 
                y={220 + (index * 18)} 
                textAnchor="start" 
                style={{ fontSize: '12px', fontWeight: '400', fill: '#9CA3AF' }}
              >
                {marca.length > 12 ? marca.substring(0, 12) + '...' : marca}
              </text>
            ))}
          </g>

          {/* Área exclusiva cat2 */}
          <g>
            {cat2.Marcas.filter((marca: string) => !cat1.Marcas.includes(marca)).slice(0, 8).map((marca: string, index: number) => (
              <text 
                key={marca} 
                x="440" 
                y={220 + (index * 18)} 
                textAnchor="end" 
                style={{ fontSize: '12px', fontWeight: '400', fill: '#9CA3AF' }}
              >
                {marca.length > 12 ? marca.substring(0, 12) + '...' : marca}
              </text>
            ))}
          </g>

          {/* Marcas na intersecção */}
          <g>
            {intersections.intersection12.slice(0, 5).map((marca: string, index: number) => (
              <text 
                key={marca} 
                x="300" 
                y={220 + (index * 18)} 
                textAnchor="middle" 
                style={{ fontSize: '12px', fontWeight: '500', fill: '#6B7280' }}
              >
                {marca.length > 10 ? marca.substring(0, 10) + '...' : marca}
              </text>
            ))}
          </g>
        </>
      )}
    </svg>
  )
}

interface MarcasPorCategoriaModalProps {
  isOpen: boolean
  onClose: () => void
}

export const MarcasPorCategoriaModal: React.FC<MarcasPorCategoriaModalProps> = ({
  isOpen,
  onClose
}) => {
  const { data: categoriasData, isLoading, error } = useCategoriasMarcas()

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

  // Ordenar categorias por quantidade de marcas (decrescente)
  const sortedCategorias = categoriasData
    ?.sort((a, b) => b.QuantidadeMarcas - a.QuantidadeMarcas)
    .slice(0, 10) || []

  const totalMarcas = categoriasData?.reduce((sum, categoria) => sum + categoria.QuantidadeMarcas, 0) || 0
  const maxValue = categoriasData?.length ? Math.max(...categoriasData.map(categoria => categoria.QuantidadeMarcas)) : 1

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
        className="bg-white rounded-xl p-5 max-w-3xl w-full mx-4 max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-sm text-gray-500">Carregando dados...</div>
          </div>
        ) : error || !categoriasData || categoriasData.length === 0 ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Marcas por Categoria</h2>
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
                  <h2 className="text-lg font-semibold text-gray-900">Marcas por Categoria</h2>
                  <p className="text-xs text-gray-500">Relação categoria/marca completa</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Tabela de intersecções */}
            <div className="space-y-4">
              <VennTableView data={sortedCategorias} />
            </div>

            {/* Rodapé com estatísticas */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Total de categorias: {sortedCategorias.length}</span>
                <span>Total de marcas: {totalMarcas}</span>
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