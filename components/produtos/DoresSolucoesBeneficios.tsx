'use client';

import React from 'react';
import { useProdutosDores } from '../../hooks/useProdutosDores';

export function DoresSolucoesBeneficios() {
  const { data: doresData, isLoading, error, refetch } = useProdutosDores();

  // Função para tentar buscar dados novamente
  const handleRefresh = () => {
    console.log('🔄 Forçando nova busca dos dados...');
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm text-gray-500">Carregando dados...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-3">
        <div className="text-center">
          <div className="text-sm text-red-500">
            Erro ao carregar dados da API
            <br />
            <span className="text-xs text-gray-400">
              {typeof error === 'string' ? error : 'Erro desconhecido'}
            </span>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="px-3 py-1.5 text-xs bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          🔄 Tentar novamente
        </button>
      </div>
    );
  }

  if (!doresData || doresData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm text-gray-500">Nenhum dado encontrado</div>
      </div>
    );
  }

  // Contar dores e benefícios
  const contarItems = (items: typeof doresData, campo: 'dor' | 'beneficio') => {
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
  const dadosPorCategoria = doresData.reduce((acc, item) => {
    if (!acc[item.categoria]) {
      acc[item.categoria] = [];
    }
    acc[item.categoria].push(item);
    return acc;
  }, {} as Record<string, typeof doresData>);

  // Preparar dados para visualização - limitar a 2 para caber sem rolagem
  const categoriasComDados = Object.entries(dadosPorCategoria)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 2)
    .map(([categoria, items]) => ({
      categoria,
      items,
      dores: contarItems(items, 'dor'),
      beneficios: contarItems(items, 'beneficio')
    }));





  return (
    <div className="h-full p-3 flex flex-col">
      {/* Cards de Dores e Soluções */}
      <div className="flex-1 space-y-4 overflow-y-auto scrollbar-minimal mx-4 px-2">
        {categoriasComDados.map((categoriaData, categoriaIndex) => {
          const isSecondCard = categoriaIndex === 1;
          
          return (
            <div 
              key={categoriaData.categoria} 
              className="bg-white rounded-lg border border-gray-200 p-2.5"
              style={{ 
                transform: isSecondCard ? 'translateY(-8%)' : 'translateY(0)',
                transition: 'all 0.3s ease'
              }}
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
                  {categoriaData.dores.slice(0, 3).map((dor, index) => (
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
                  {categoriaData.dores.length > 3 && (
                    <span className="text-xs text-gray-400 px-1.5 py-0.5">
                      +{categoriaData.dores.length - 3} mais
                    </span>
                  )}
                </div>
              </div>

              {/* Seção de Benefícios */}
              <div 
                style={{ 
                  opacity: isSecondCard ? 0.3 : 1,
                  transition: 'opacity 0.3s ease'
                }}
              >
                <div className="mb-1.5">
                  <span className="text-xs font-semibold text-gray-700">Benefícios</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {categoriaData.beneficios.slice(0, 3).map((beneficio, index) => (
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
                  {categoriaData.beneficios.length > 3 && (
                    <span className="text-xs text-gray-400 px-1.5 py-0.5">
                      +{categoriaData.beneficios.length - 3} mais
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumo */}
      <div className="mt-3 pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {doresData.length} {doresData.length === 1 ? 'problema identificado' : 'problemas identificados'}
          </span>
          <span>
            {Object.keys(dadosPorCategoria).length} {Object.keys(dadosPorCategoria).length === 1 ? 'categoria' : 'categorias'}
          </span>
        </div>
      </div>
    </div>
  );
}