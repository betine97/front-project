'use client';

import React from 'react';
import { usePublicoVariacoes } from '../../hooks/usePublicoVariacoes';

export function PublicoAlvoCompleto() {
  const variacoesQuery = usePublicoVariacoes();

  if (variacoesQuery.loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm text-gray-500">Carregando dados...</div>
      </div>
    );
  }

  if (variacoesQuery.error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm text-red-500">
          Erro ao carregar dados
          <br />
          <span className="text-xs text-gray-400">
            {String(variacoesQuery.error)}
          </span>
        </div>
      </div>
    );
  }

  if (!variacoesQuery.data || variacoesQuery.data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm text-gray-500">Nenhum dado encontrado</div>
      </div>
    );
  }

  // Simular dados de quantidade de produtos por variação
  const getQuantidadeProdutos = (publico: string, variacao: string) => {
    const base = publico.length + variacao.length;
    return Math.floor(Math.random() * 50) + base + 10; // Entre 10-80 produtos
  };

  // Transformar dados para incluir quantidades
  const publicosComQuantidades = variacoesQuery.data.map(item => {
    const variacoesComQuantidade = item.variacoes.map(variacao => ({
      nome: variacao,
      quantidade: getQuantidadeProdutos(item.publico_alvo, variacao)
    })).sort((a, b) => b.quantidade - a.quantidade); // Ordenar por quantidade

    return {
      publico: item.publico_alvo,
      variacoes: variacoesComQuantidade,
      totalProdutos: variacoesComQuantidade.reduce((sum, v) => sum + v.quantidade, 0)
    };
  }).sort((a, b) => b.totalProdutos - a.totalProdutos); // Ordenar públicos por total de produtos

  // Mostrar os primeiros 3 públicos-alvo
  const currentItems = publicosComQuantidades.slice(0, 3);



  return (
    <div className="h-full p-3 flex flex-col">
      {/* Lista de Públicos com Variações */}
      <div className="space-y-8 flex-1 overflow-y-auto">
        {currentItems.map((publicoData, publicoIndex) => {
          const maxQuantidade = Math.max(...publicoData.variacoes.map(v => v.quantidade));
          
          return (
            <div key={publicoData.publico} className="bg-white rounded-lg border border-gray-200 p-3">
              {/* Header do Público */}
              <div className="mb-3">
                <h5 className="text-sm font-semibold text-gray-900">{publicoData.publico}</h5>
                <p className="text-xs text-gray-500">{publicoData.totalProdutos} produtos</p>
              </div>

              {/* Barras Horizontais das Variações */}
              <div className="space-y-2">
                {publicoData.variacoes.slice(0, 4).map((variacao, varIndex) => {
                  const percentage = (variacao.quantidade / maxQuantidade) * 100;
                  const isLast = varIndex === 3 && publicoData.variacoes.length > 4;
                  
                  return (
                    <div 
                      key={variacao.nome} 
                      className="flex items-center space-x-3"
                      style={{ 
                        opacity: isLast ? 0.4 : 1,
                        transform: isLast ? 'scale(0.95)' : 'scale(1)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {/* Nome da Variação */}
                      <div className="w-20 text-xs text-gray-700 font-medium truncate">
                        {variacao.nome}
                      </div>
                      
                      {/* Barra de Progresso */}
                      <div className="flex-1 flex items-center space-x-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-700 ${
                              varIndex === 0 ? 'bg-orange-500' :
                              varIndex === 1 ? 'bg-orange-400' :
                              varIndex === 2 ? 'bg-orange-300' :
                              'bg-orange-200'
                            }`}
                            style={{ 
                              width: `${percentage}%`,
                              minWidth: '8px'
                            }}
                          />
                        </div>
                        
                        {/* Quantidade */}
                        <div className="text-xs font-bold text-gray-900 w-8 text-right">
                          {variacao.quantidade}
                        </div>
                        
                        {/* Percentual */}
                        <div className="text-xs text-gray-500 w-10 text-right">
                          {((variacao.quantidade / publicoData.totalProdutos) * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Indicador de mais itens */}
                {publicoData.variacoes.length > 4 && (
                  <div className="flex items-center justify-center py-1">
                    <div className="text-xs text-gray-400">
                      +{publicoData.variacoes.length - 4} variações
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumo Global */}
      <div className="mt-3 pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {publicosComQuantidades.reduce((sum, p) => sum + p.totalProdutos, 0)} produtos total
          </span>
          <span>
            {publicosComQuantidades.length} públicos-alvo
          </span>
        </div>
      </div>
    </div>
  );
} 