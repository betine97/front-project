'use client';

import React from 'react';
import { useMarcasMargem } from '../../hooks/useMarcasMargem';

export function MargemPorMarca() {
  const { data, loading, error } = useMarcasMargem();
  
  console.log('MargemPorMarca - loading:', loading, 'error:', error, 'data:', data);

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

  // Ordenar por margem decrescente e pegar apenas os top 10
  const sortedData = [...data]
    .sort((a, b) => b.margem - a.margem)
    .slice(0, 10);

  const maxValue = Math.max(...sortedData.map(item => item.margem));
  
  // Mostrar os primeiros 3 itens (o 3º com efeito fade)
  const currentItems = sortedData.slice(0, 3);
  const remainingItems = sortedData.length - 3;

  return (
    <div className="space-y-4">
      {/* Lista de marcas */}
      <div className="space-y-2 pt-4" style={{ minHeight: '140px' }}>
        {currentItems.map((marcaData, index) => {
          const { marca, margem } = marcaData;
          
          return (
            <div 
              key={marca} 
              className="flex items-center py-1"
              style={{ 
                opacity: index === 2 ? 0.3 : 1,
                transform: index === 2 ? 'translateY(20%)' : 'translateY(0)',
                transition: 'all 0.3s ease'
              }}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                  index === 0 ? 'bg-orange-500' : 
                  index === 1 ? 'bg-orange-400' : 
                  index === 2 ? 'bg-orange-300' : 'bg-gray-400'
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
                      width: `${(margem / maxValue) * 100}%`,
                      minWidth: '4px'
                    }}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="text-sm font-bold text-gray-900">{margem.toFixed(1)}%</div>
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
  );
}