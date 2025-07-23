'use client';

import React from 'react';
import { useCategoriasQuantidade } from '@/hooks/useCategoriasQuantidade';
import { useCategoriasMargem } from '@/hooks/useCategoriasMargem';

export function QuantidadeMargemPorCategoria() {
  const quantidadeQuery = useCategoriasQuantidade();
  const margemQuery = useCategoriasMargem();
  
  // Verificação de segurança para evitar erros de null
  if (!quantidadeQuery || !margemQuery) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm text-gray-500">Carregando dados...</div>
      </div>
    );
  }
  
  const quantidadeData = quantidadeQuery.data;
  const loadingQuantidade = quantidadeQuery.isLoading;
  const errorQuantidade = quantidadeQuery.error;
  
  const margemData = margemQuery.data;
  const loadingMargem = margemQuery.loading;
  const errorMargem = margemQuery.error;

  if (loadingQuantidade || loadingMargem) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm text-gray-500">Carregando dados...</div>
      </div>
    );
  }

  if (errorQuantidade || errorMargem) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm text-red-500">
          Erro ao carregar dados
          <br />
          <span className="text-xs text-gray-400">
            {String(errorQuantidade || errorMargem)}
          </span>
        </div>
      </div>
    );
  }

  if (!quantidadeData || !margemData || quantidadeData.length === 0 || margemData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm text-gray-500">Nenhum dado encontrado</div>
      </div>
    );
  }

  // Combinar dados de quantidade e margem por categoria
  const combinedData = quantidadeData && margemData ? quantidadeData.map(qItem => {
    const margemItem = margemData.find(mItem => mItem.categoria === qItem.Categoria);
    return {
      categoria: qItem.Categoria,
      quantidade: qItem.Quantidade,
      margem: margemItem ? margemItem.margem : 0
    };
  }).filter(item => item.margem > 0) : []; // Apenas categorias com dados de margem

  // Ordenar por quantidade decrescente
  const sortedData = combinedData.sort((a, b) => b.quantidade - a.quantidade);
  
  const maxQuantidade = sortedData.length > 0 ? Math.max(...sortedData.map(item => item.quantidade)) : 1;
  const maxMargem = sortedData.length > 0 ? Math.max(...sortedData.map(item => item.margem)) : 1;
  
  // Mostrar os primeiros 3 itens (o 3º com efeito fade)
  const currentItems = sortedData.slice(0, 3);
  const remainingItems = sortedData.length - 3;

  // Se não há dados para mostrar
  if (sortedData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm text-gray-500">Nenhum dado combinado encontrado</div>
      </div>
    );
  }

  return (
    <div className="h-full p-3 flex flex-col">
      {/* Lista de categorias */}
      <div className="space-y-2 pt-4" style={{ minHeight: '180px' }}>
        {currentItems.map((item, index) => {
          const percentage = (item.quantidade / sortedData.reduce((sum, cat) => sum + cat.quantidade, 0)) * 100
          
          return (
            <div 
              key={item.categoria} 
              className="py-2 space-y-1"
            >
              {/* Linha principal com ranking, categoria, barra de quantidade e números */}
              <div className="flex items-center">
                <div className="flex items-center space-x-2">
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                    index === 0 ? 'bg-orange-500' : 
                    index === 1 ? 'bg-orange-400' : 
                    index === 2 ? 'bg-orange-300' : 'bg-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="min-w-[80px]">
                    <div className="text-sm font-medium text-gray-900">
                      {item.categoria.length > 12 ? item.categoria.substring(0, 12) + '...' : item.categoria}
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 mx-3">
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        index < 3 ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                      style={{ 
                        width: `${(item.quantidade / maxQuantidade) * 100}%`,
                        minWidth: '4px'
                      }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="text-sm font-bold text-gray-900">{item.quantidade}</div>
                  <div className="text-xs font-medium text-orange-600 min-w-[30px]">{percentage.toFixed(0)}%</div>
                </div>
              </div>

              {/* Barra de margem abaixo */}
              <div className="flex items-center ml-7">
                <div className="flex-1 mr-3">
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        index < 3 ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                      style={{ 
                        width: `${(item.margem / maxMargem) * 100}%`,
                        minWidth: '4px'
                      }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <div className="text-xs font-medium text-gray-600">{item.margem.toFixed(1)}%</div>
                  <div className="text-xs text-gray-400">margem</div>
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
              mais {remainingItems} {remainingItems === 1 ? 'categoria' : 'categorias'}
            </div>
          </div>
        )}
      </div>

              
    </div>
  );
} 