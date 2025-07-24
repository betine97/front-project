'use client';

import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { Movimentacao } from '../../types/entities';
import { formatCurrency } from '../../lib/utils';

interface GraficoFluxoCaixaProps {
  movimentacoes: Movimentacao[];
  loading?: boolean;
}

export const GraficoFluxoCaixa: React.FC<GraficoFluxoCaixaProps> = ({ 
  movimentacoes, 
  loading = false 
}) => {
  const dadosFluxo = useMemo(() => {
    const entradas = movimentacoes
      .filter(m => m.tipo_transacao === 'Recebimento')
      .reduce((sum, m) => sum + m.valor, 0);
    
    const saidas = movimentacoes
      .filter(m => m.tipo_transacao === 'Pagamento')
      .reduce((sum, m) => sum + m.valor, 0);
    
    const saldo = entradas - saidas;
    const total = entradas + saidas;
    
    const percentualEntradas = total > 0 ? (entradas / total) * 100 : 0;
    const percentualSaidas = total > 0 ? (saidas / total) * 100 : 0;
    
    return {
      entradas,
      saidas,
      saldo,
      percentualEntradas,
      percentualSaidas,
      total
    };
  }, [movimentacoes]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
        <div className="mt-6 h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumo do Fluxo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Entradas</p>
              <p className="text-lg font-bold text-green-700">
                {formatCurrency(dadosFluxo.entradas)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4 border border-red-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-red-600 font-medium">Saídas</p>
              <p className="text-lg font-bold text-red-700">
                {formatCurrency(dadosFluxo.saidas)}
              </p>
            </div>
          </div>
        </div>

        <div className={`${dadosFluxo.saldo >= 0 ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'} rounded-lg p-4 border`}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${dadosFluxo.saldo >= 0 ? 'bg-blue-100' : 'bg-orange-100'} rounded-lg flex items-center justify-center`}>
              <Activity className={`w-5 h-5 ${dadosFluxo.saldo >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
            </div>
            <div>
              <p className={`text-sm font-medium ${dadosFluxo.saldo >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                Saldo
              </p>
              <p className={`text-lg font-bold ${dadosFluxo.saldo >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                {formatCurrency(dadosFluxo.saldo)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Barras Minimalista */}
      <div className="bg-white rounded-lg border border-gray-100 p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-6">Comparativo Entradas vs Saídas</h4>
        
        <div className="space-y-4">
          {/* Barra de Entradas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Entradas</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(dadosFluxo.entradas)}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${dadosFluxo.percentualEntradas}%` }}
              ></div>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500">
                {dadosFluxo.percentualEntradas.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Barra de Saídas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Saídas</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(dadosFluxo.saidas)}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-red-400 to-red-500 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${dadosFluxo.percentualSaidas}%` }}
              ></div>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500">
                {dadosFluxo.percentualSaidas.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Linha de Saldo */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className={`w-4 h-4 ${dadosFluxo.saldo >= 0 ? 'text-blue-500' : 'text-orange-500'}`} />
              <span className="text-sm font-semibold text-gray-900">Saldo Final</span>
            </div>
            <div className="text-right">
              <p className={`text-lg font-bold ${dadosFluxo.saldo >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                {formatCurrency(dadosFluxo.saldo)}
              </p>
              <p className="text-xs text-gray-500">
                {dadosFluxo.saldo >= 0 ? 'Superávit' : 'Déficit'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Indicadores Adicionais */}
      {dadosFluxo.total > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {movimentacoes.filter(m => m.tipo_transacao === 'Recebimento').length}
              </p>
              <p className="text-sm text-gray-600">Transações de Entrada</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {movimentacoes.filter(m => m.tipo_transacao === 'Pagamento').length}
              </p>
              <p className="text-sm text-gray-600">Transações de Saída</p>
            </div>
          </div>
        </div>
      )}

      {/* Estado Vazio */}
      {dadosFluxo.total === 0 && (
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Nenhuma movimentação encontrada</p>
          <p className="text-xs text-gray-400">Os dados do fluxo de caixa aparecerão aqui quando houver movimentações</p>
        </div>
      )}
    </div>
  );
};