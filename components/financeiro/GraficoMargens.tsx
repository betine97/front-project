'use client';

import React from 'react';
import { formatCurrency } from '../../lib/utils';

interface MargensData {
  lucro_bruto: {
    percentual: number;
    valor: number;
  };
  lucro_liquido: {
    percentual: number;
    valor: number;
  };
  lucro_operacional: {
    percentual: number;
    valor: number;
  };
}

interface GraficoMargensProps {
  margens: MargensData;
  loading?: boolean;
}

export const GraficoMargens: React.FC<GraficoMargensProps> = ({ 
  margens, 
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    );
  }

  const margensArray = [
    {
      nome: 'Bruta',
      percentual: margens.lucro_bruto.percentual,
      valor: margens.lucro_bruto.valor,
      meta: 66
    },
    {
      nome: 'Operacional',
      percentual: margens.lucro_operacional.percentual,
      valor: margens.lucro_operacional.valor,
      meta: 34
    },
    {
      nome: 'Líquida',
      percentual: margens.lucro_liquido.percentual,
      valor: margens.lucro_liquido.valor,
      meta: 25
    }
  ];

  const maxPercentual = Math.max(...margensArray.map(m => Math.max(m.percentual, m.meta)));

  return (
    <div className="h-full w-full flex flex-col justify-center space-y-2 overflow-hidden px-1">
      {margensArray.map((margem, index) => (
        <div key={index} className="space-y-1">
          {/* Header com valores */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-shrink-0">
              <span className="text-xs font-medium text-gray-700">{margem.nome}</span>
              <span className="text-xs text-gray-500">Meta {margem.meta}%</span>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-xs font-bold text-gray-900">
                {margem.percentual.toFixed(1)}%
              </span>
              <span className="text-xs text-gray-500 ml-1">
                {formatCurrency(margem.valor)}
              </span>
            </div>
          </div>
          
          {/* Barra Única Simplificada */}
          <div className="relative">
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              {/* Barra de Meta (fundo cinza) */}
              <div 
                className="absolute bg-gray-300 h-2.5 rounded-full"
                style={{ 
                  width: maxPercentual > 0 ? `${(margem.meta / maxPercentual) * 100}%` : '0%' 
                }}
              ></div>
              
              {/* Barra Atual (laranja) */}
              <div 
                className="bg-orange-500 h-2.5 rounded-full transition-all duration-1000 ease-out relative z-10"
                style={{ 
                  width: maxPercentual > 0 ? `${(margem.percentual / maxPercentual) * 100}%` : '0%' 
                }}
              ></div>
            </div>
          </div>
        </div>
      ))}

      {/* Estado Vazio */}
      {maxPercentual === 0 && (
        <div className="text-center py-2">
          <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-1">
            <span className="text-gray-400 text-xs">📊</span>
          </div>
          <p className="text-xs text-gray-400">Dados em breve</p>
        </div>
      )}
    </div>
  );
};