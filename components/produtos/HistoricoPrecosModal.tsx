'use client';

import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Calendar, DollarSign, Percent } from 'lucide-react';
import { HistoricoPreco, Produto } from '@/types/entities';
import { historicoPrecosService } from '@/lib/services/historico-precos.service';
import { formatCurrency } from '@/lib/utils';

interface HistoricoPrecosModalProps {
  produto: Produto;
  isOpen: boolean;
  onClose: () => void;
}

export function HistoricoPrecosModal({ produto, isOpen, onClose }: HistoricoPrecosModalProps) {
  const [historico, setHistorico] = useState<HistoricoPreco[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estatisticas, setEstatisticas] = useState<any>(null);

  useEffect(() => {
    if (isOpen && produto) {
      fetchHistorico();
      fetchEstatisticas();
    }
  }, [isOpen, produto]);

  const fetchHistorico = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Buscando histórico para produto ID:', produto.id);
      const data = await historicoPrecosService.getByProdutoId(produto.id);
      console.log('Dados do histórico recebidos:', data);
      setHistorico(data);
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
      setError('Erro ao carregar histórico de preços');
    } finally {
      setLoading(false);
    }
  };

  const fetchEstatisticas = async () => {
    try {
      console.log('Buscando estatísticas para produto ID:', produto.id);
      const stats = await historicoPrecosService.getEstatisticasPorProduto(produto.id);
      console.log('Estatísticas recebidas:', stats);
      setEstatisticas(stats);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const getVariacaoColor = (variacao: number) => {
    if (variacao > 0) return 'text-green-600';
    if (variacao < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getVariacaoIcon = (variacao: number) => {
    if (variacao > 0) return <TrendingUp className="w-4 h-4" />;
    if (variacao < 0) return <TrendingDown className="w-4 h-4" />;
    return <div className="w-4 h-4" />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header - Estilo Itaú */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100">
          <div className="flex items-center space-x-3">
            <div className="icon-container orange">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Histórico de Preços</h2>
              <p className="text-sm text-gray-600 mt-1">{produto.nome_produto}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-tertiary p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Estatísticas - Estilo Itaú */}
        {estatisticas && (
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card-metric">
                <div className="flex items-center justify-between mb-4">
                  <div className="icon-container blue">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div className={`flex items-center space-x-1 text-xs font-semibold bg-gray-50 px-2 py-1 rounded-full ${getVariacaoColor(estatisticas.variacao)}`}>
                    {getVariacaoIcon(estatisticas.variacao)}
                    <span>{formatCurrency(Math.abs(estatisticas.variacao))}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-2">Preço Atual</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(estatisticas.precoAtual)}</p>
                </div>
              </div>

              <div className="card-metric">
                <div className="flex items-center justify-between mb-4">
                  <div className="icon-container green">
                    <Percent className="w-5 h-5" />
                  </div>
                  <div className={`text-xs font-semibold px-2 py-1 rounded-full ${estatisticas.percentualVariacao >= 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                    {estatisticas.percentualVariacao >= 0 ? '+' : ''}{formatPercentage(estatisticas.percentualVariacao)}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-2">Variação</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPercentage(estatisticas.percentualVariacao)}</p>
                </div>
              </div>

              <div className="card-metric">
                <div className="flex items-center justify-between mb-4">
                  <div className="icon-container purple">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-2">Margem Atual</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPercentage(estatisticas.margemAtual)}</p>
                </div>
              </div>

              <div className="card-metric">
                <div className="flex items-center justify-between mb-4">
                  <div className="icon-container orange">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-2">Markup Atual</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPercentage(estatisticas.markupAtual)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="icon-container orange mx-auto mb-6" style={{ width: '64px', height: '64px' }}>
                <X className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Erro ao carregar dados</h3>
              <p className="text-red-600 mb-6">{error}</p>
              <button
                onClick={fetchHistorico}
                className="btn-primary"
              >
                Tentar novamente
              </button>
            </div>
          ) : historico.length === 0 ? (
            <div className="text-center py-12">
              <div className="icon-container blue mx-auto mb-6" style={{ width: '64px', height: '64px' }}>
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Nenhum histórico encontrado</h3>
              <p className="text-gray-500">Este produto ainda não possui histórico de preços registrado.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Histórico de Alterações ({historico.length} registros)
              </h3>
              
              <div className="space-y-3">
                {historico.map((item, index) => {
                  const isFirst = index === 0;
                  const anterior = index < historico.length - 1 ? historico[index + 1] : null;
                  const variacao = anterior ? item.valor_venda - anterior.valor_venda : 0;
                  
                  return (
                    <div key={item.id} className={`p-4 rounded-lg border ${isFirst ? 'border-orange-200 bg-orange-50' : 'border-gray-200 bg-white'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{formatDate(item.data_registro)}</span>
                          {isFirst && (
                            <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                              Atual
                            </span>
                          )}
                        </div>
                        {anterior && (
                          <div className={`flex items-center space-x-1 text-sm font-medium ${getVariacaoColor(variacao)}`}>
                            {getVariacaoIcon(variacao)}
                            <span>{formatCurrency(Math.abs(variacao))}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 mb-1">Custo</p>
                          <p className="font-medium text-gray-900">{formatCurrency(item.custo_unidade)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Preço de Venda</p>
                          <p className="font-medium text-gray-900">{formatCurrency(item.valor_venda)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Markup</p>
                          <p className="font-medium text-gray-900">{formatPercentage(item.markup)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Margem</p>
                          <p className="font-medium text-gray-900">{formatPercentage(item.margem)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer - Estilo Itaú */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="btn-tertiary"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}