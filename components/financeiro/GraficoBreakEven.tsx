'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Target } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface BreakEvenData {
  custo_variavel_unidade: number;
  custos_fixos: number;
  ponto_equilibrio_unidades: number;
  ponto_equilibrio_valor: number;
  preco_por_unidade: number;
}

interface GraficoBreakEvenProps {
  loading?: boolean;
}

export const GraficoBreakEven: React.FC<GraficoBreakEvenProps> = ({ 
  loading = false 
}) => {
  const [breakEvenData, setBreakEvenData] = useState<BreakEvenData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBreakEvenData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/break_even');
        if (!response.ok) {
          throw new Error('Endpoint não disponível');
        }
        const data = await response.json();
        setBreakEvenData(data);
      } catch (err) {
        // Para desenvolvimento, vamos usar dados mockados
        const mockData: BreakEvenData = {
          custo_variavel_unidade: 200,
          custos_fixos: 10000,
          ponto_equilibrio_unidades: 33.33,
          ponto_equilibrio_valor: 16666.67,
          preco_por_unidade: 500
        };
        setBreakEvenData(mockData);
        setError(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBreakEvenData();
  }, []);

  if (loading || isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    );
  }

  if (error || !breakEvenData) {
    return (
      <div className="text-center py-4">
        <Calculator className="w-6 h-6 text-gray-400 mx-auto mb-2" />
        <p className="text-xs text-gray-400">
          {error || 'Dados em breve'}
        </p>
      </div>
    );
  }

  // Calcular margem de contribuição
  const margemContribuicao = breakEvenData.preco_por_unidade - breakEvenData.custo_variavel_unidade;
  const margemContribuicaoPercentual = (margemContribuicao / breakEvenData.preco_por_unidade) * 100;

  // Calcular lucro esperado após break even (exemplo: 20% acima do ponto de equilíbrio)
  const unidadesAcimaBreakEven = Math.ceil(breakEvenData.ponto_equilibrio_unidades * 1.2);
  const lucroEsperado = (unidadesAcimaBreakEven - breakEvenData.ponto_equilibrio_unidades) * margemContribuicao;

  return (
    <div className="h-full w-full flex flex-col justify-center overflow-hidden">
      {/* Métricas Superiores - Layout Horizontal */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-1">
          <Target className="w-3 h-3 text-orange-600" />
          <div>
            <p className="text-xs font-bold text-gray-900">{breakEvenData.ponto_equilibrio_unidades.toFixed(0)} un</p>
            <p className="text-xs text-gray-500">Break Even</p>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-xs font-semibold text-orange-600">
            {formatCurrency(breakEvenData.ponto_equilibrio_valor)}
          </p>
          <p className="text-xs text-gray-500">Valor para equilibrar</p>
        </div>
        
        <div className="flex items-center space-x-1">
          <TrendingUp className="w-3 h-3 text-gray-600" />
          <div>
            <p className="text-xs font-bold text-gray-900">{margemContribuicaoPercentual.toFixed(1)}%</p>
            <p className="text-xs text-gray-500">Margem</p>
          </div>
        </div>
      </div>

      {/* Gráfico de Composição */}
      <div className="space-y-1 mb-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-700">Composição por Unidade</span>
          <span className="text-gray-500">{formatCurrency(breakEvenData.preco_por_unidade)}</span>
        </div>
        
        {/* Barra de Composição */}
        <div className="w-full bg-gray-100 rounded-full h-4 flex overflow-hidden">
          <div 
            className="bg-orange-500 h-4 flex items-center justify-center"
            style={{ width: `${(breakEvenData.custo_variavel_unidade / breakEvenData.preco_por_unidade) * 100}%` }}
          >
            <span className="text-xs text-white font-medium">
              {((breakEvenData.custo_variavel_unidade / breakEvenData.preco_por_unidade) * 100).toFixed(0)}%
            </span>
          </div>
          <div 
            className="bg-gray-400 h-4 flex items-center justify-center"
            style={{ width: `${(margemContribuicao / breakEvenData.preco_por_unidade) * 100}%` }}
          >
            <span className="text-xs text-white font-medium">
              {((margemContribuicao / breakEvenData.preco_por_unidade) * 100).toFixed(0)}%
            </span>
          </div>
        </div>
        
        <div className="flex justify-between text-xs">
          <span className="text-orange-600">Custo Variável</span>
          <span className="text-gray-600">Margem</span>
        </div>
      </div>

      {/* Projeção de Lucro */}
      <div className="flex items-center justify-between text-xs bg-gray-50 rounded-lg p-2">
        <div>
          <span className="text-gray-700">Projeção +20%:</span>
          <span className="text-gray-900 font-medium ml-1">{unidadesAcimaBreakEven} unidades</span>
        </div>
        <span className="text-orange-600 font-bold">{formatCurrency(lucroEsperado)}</span>
      </div>
    </div>
  );
};