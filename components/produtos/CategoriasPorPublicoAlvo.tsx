'use client';

import React from 'react';
import { usePublicoCategorias } from '../../hooks/usePublicoCategorias';

export function CategoriasPorPublicoAlvo() {
  const { data, loading, error } = usePublicoCategorias();
  
  console.log('CategoriasPorPublicoAlvo - loading:', loading, 'error:', error, 'data:', data);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm text-gray-500">Carregando dados...</div>
      </div>
    );
  }

  if (error) {
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
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm text-gray-500">Nenhum dado encontrado</div>
      </div>
    );
  }

  // Ordenar por número de categorias (decrescente) - mostrar apenas 2 para garantir o efeito fade
  const sortedData = [...data]
    .sort((a, b) => b.categorias.length - a.categorias.length)
    .slice(0, 2);

  // Ícones para diferentes públicos-alvo
  const getPublicoIcon = (publico: string) => {
    const publicoLower = publico.toLowerCase();
    if (publicoLower.includes('cão') || publicoLower.includes('cachorro')) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.5 12a7.5 7.5 0 0015 0 7.5 7.5 0 00-15 0zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      );
    }
    if (publicoLower.includes('gato')) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      );
    }
    if (publicoLower.includes('pássaro') || publicoLower.includes('ave')) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      );
    }
    // Ícone padrão para outros animais
    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    );
  };

  const remainingItems = data.length - 2;

  return (
    <div className="space-y-3 p-2">
      {sortedData.map((item, index) => {
        const { publico_alvo, categorias } = item;
        const isLast = index === 1;
        
        return (
          <div 
            key={publico_alvo}
            className={`bg-white rounded-lg border border-gray-200 p-3 transition-all duration-300 ${
              isLast ? 'opacity-30' : 'opacity-100'
            }`}
            style={{
              transform: isLast ? 'translateY(20%)' : 'translateY(0)',
            }}
          >
            {/* Header com ícone e nome do público */}
            <div className="flex items-center space-x-2 mb-2">
              <div className={`p-1.5 rounded-lg ${
                index === 0 ? 'bg-orange-500 text-white' :
                'bg-orange-400 text-white'
              }`}>
                {getPublicoIcon(publico_alvo)}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{publico_alvo}</div>
                <div className="text-xs text-gray-500">{categorias.length} categorias</div>
              </div>
            </div>
            
            {/* Lista de categorias */}
            <div className="flex flex-wrap gap-1">
              {categorias.slice(0, 3).map((categoria, catIndex) => (
                <span 
                  key={catIndex}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                >
                  {categoria}
                </span>
              ))}
              {categorias.length > 3 && (
                <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-md">
                  +{categorias.length - 3}
                </span>
              )}
            </div>
          </div>
        );
      })}
      
      {/* Indicador de mais itens */}
      {remainingItems > 0 && (
        <div 
          className="flex items-center justify-center py-2"
          style={{ 
            opacity: 0.4,
            transition: 'opacity 0.3s ease'
          }}
        >
          <div className="text-xs font-medium text-gray-500">
            mais {remainingItems} {remainingItems === 1 ? 'público' : 'públicos'}
          </div>
        </div>
      )}
    </div>
  );
}