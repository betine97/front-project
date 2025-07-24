'use client';

import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  BarChart3, 
  PieChart,
  Calculator,
  Target,
  Droplets,
  Activity,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Eye,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { AnaliseFinanceira } from '../../types/entities';
import { formatCurrency } from '../../lib/utils';

export function AnaliseFinanceiraComponent() {
  const [activeTab, setActiveTab] = useState<'margens' | 'fluxo' | 'custos' | 'indicadores' | 'liquidez'>('margens');
  const [periodoSelecionado, setPeriodoSelecionado] = useState('30d');

  // Dados mockados para demonstração (valores nulos como solicitado)
  const analiseFinanceira: AnaliseFinanceira = {
    // Margens
    margem_bruta: 0,
    margem_operacional_ebitda: 0,
    margem_liquida: 0,
    
    // Capital e Fluxo
    capital_de_giro: 0,
    fluxo_de_caixa: {
      entrada: 0,
      saida: 0,
      saldo: 0
    },
    
    // Receitas e Despesas
    receitas: {
      total: 0,
      operacionais: 0,
      nao_operacionais: 0,
      recorrentes: 0
    },
    despesas: {
      total: 0,
      operacionais: 0,
      administrativas: 0,
      vendas: 0,
      financeiras: 0
    },
    
    // Custos
    custo_fixo: 0,
    custo_variavel: 0,
    custo_total: 0,
    
    // Indicadores
    break_even: {
      ponto_equilibrio_unidades: 0,
      ponto_equilibrio_valor: 0,
      margem_contribuicao: 0
    },
    
    liquidez: {
      corrente: 0,
      seca: 0,
      imediata: 0
    },
    
    // Métricas Adicionais
    roi: 0,
    roa: 0,
    roe: 0,
    endividamento: 0,
    giro_ativo: 0,
    prazo_medio_recebimento: 0,
    prazo_medio_pagamento: 0,
    ciclo_operacional: 0,
    ciclo_financeiro: 0
  };

  const MetricCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    color = 'orange',
    trend,
    trendValue,
    format = 'currency',
    status
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: any;
    color?: string;
    trend?: 'up' | 'down';
    trendValue?: string;
    format?: 'currency' | 'percentage' | 'number' | 'days';
    status?: 'good' | 'warning' | 'danger';
  }) => {
    const formatValue = (val: string | number) => {
      if (typeof val === 'string') return val;
      
      switch (format) {
        case 'currency':
          return formatCurrency(val);
        case 'percentage':
          return `${val.toFixed(1)}%`;
        case 'days':
          return `${val} dias`;
        default:
          return val.toString();
      }
    };

    const getStatusColor = () => {
      switch (status) {
        case 'good': return 'text-green-600';
        case 'warning': return 'text-yellow-600';
        case 'danger': return 'text-red-600';
        default: return 'text-gray-900';
      }
    };

    return (
      <div className="card-metric-modern min-h-[100px]">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`icon-container-metric ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <p className={`text-lg font-bold ${getStatusColor()}`}>{formatValue(value)}</p>
              <p className="text-xs text-gray-500">{title}</p>
              {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            {trend && trendValue && (
              <div className={`flex items-center space-x-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                <span className="text-xs font-medium">{trendValue}</span>
              </div>
            )}
            {status && (
              <div className="flex items-center">
                {status === 'good' && <CheckCircle className="w-3 h-3 text-green-500" />}
                {status === 'warning' && <AlertTriangle className="w-3 h-3 text-yellow-500" />}
                {status === 'danger' && <AlertTriangle className="w-3 h-3 text-red-500" />}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Controles de Período */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'ontem', label: 'Ontem' },
            { key: '7d', label: '7 dias' },
            { key: '30d', label: '30 dias atrás' },
            { key: 'mes-passado', label: 'Mês passado' },
            { key: '90d', label: '90 dias' },
            { key: 'semestre-passado', label: 'Semestre passado' },
            { key: 'ano-passado', label: 'Ano passado' }
          ].map((periodo) => (
            <button
              key={periodo.key}
              onClick={() => setPeriodoSelecionado(periodo.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                periodoSelecionado === periodo.key
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {periodo.label}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <button className="btn-secondary text-sm px-3 py-2 flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
          <button className="btn-secondary text-sm px-3 py-2 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Relatório</span>
          </button>
        </div>
      </div>

      {/* Tabs de Análise */}
      <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1 w-fit">
        {[
          { key: 'margens', label: 'Margens', icon: BarChart3 },
          { key: 'fluxo', label: 'Fluxo de Caixa', icon: Activity },
          { key: 'custos', label: 'Custos', icon: Calculator },
          { key: 'indicadores', label: 'Indicadores', icon: Target },
          { key: 'liquidez', label: 'Liquidez', icon: Droplets }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
              activeTab === tab.key
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Conteúdo das Tabs */}
      {activeTab === 'margens' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Margem Bruta"
              value={analiseFinanceira.margem_bruta}
              subtitle="Receita - CMV"
              icon={TrendingUp}
              color="green"
              format="percentage"
              trend="up"
              trendValue="+0%"
              status="good"
            />
            <MetricCard
              title="Margem Operacional (EBITDA)"
              value={analiseFinanceira.margem_operacional_ebitda}
              subtitle="Lucro antes de juros, impostos, depreciação"
              icon={BarChart3}
              color="blue"
              format="percentage"
              trend="up"
              trendValue="+0%"
              status="good"
            />
            <MetricCard
              title="Margem Líquida"
              value={analiseFinanceira.margem_liquida}
              subtitle="Lucro líquido / Receita total"
              icon={Target}
              color="purple"
              format="percentage"
              trend="up"
              trendValue="+0%"
              status="good"
            />
          </div>

          {/* Gráfico de Evolução das Margens */}
          <div className="card">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Evolução das Margens</h3>
              <div className="text-center py-8">
                <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Gráfico de evolução das margens em breve</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'fluxo' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard
              title="Entradas"
              value={analiseFinanceira.fluxo_de_caixa.entrada}
              subtitle="Receitas do período"
              icon={TrendingUp}
              color="green"
              format="currency"
            />
            <MetricCard
              title="Saídas"
              value={analiseFinanceira.fluxo_de_caixa.saida}
              subtitle="Despesas do período"
              icon={TrendingDown}
              color="red"
              format="currency"
            />
            <MetricCard
              title="Saldo"
              value={analiseFinanceira.fluxo_de_caixa.saldo}
              subtitle="Entradas - Saídas"
              icon={Activity}
              color="orange"
              format="currency"
              status={analiseFinanceira.fluxo_de_caixa.saldo >= 0 ? 'good' : 'danger'}
            />
            <MetricCard
              title="Capital de Giro"
              value={analiseFinanceira.capital_de_giro}
              subtitle="Ativo circulante - Passivo circulante"
              icon={Wallet}
              color="blue"
              format="currency"
              status={analiseFinanceira.capital_de_giro >= 0 ? 'good' : 'warning'}
            />
          </div>

          {/* Receitas vs Despesas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Receitas</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Operacionais</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(analiseFinanceira.receitas.operacionais)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Não Operacionais</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(analiseFinanceira.receitas.nao_operacionais)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Recorrentes</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(analiseFinanceira.receitas.recorrentes)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">Total</span>
                      <span className="text-sm font-bold text-green-600">
                        {formatCurrency(analiseFinanceira.receitas.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Despesas</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Operacionais</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(analiseFinanceira.despesas.operacionais)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Administrativas</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(analiseFinanceira.despesas.administrativas)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Vendas</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(analiseFinanceira.despesas.vendas)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Financeiras</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(analiseFinanceira.despesas.financeiras)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">Total</span>
                      <span className="text-sm font-bold text-red-600">
                        {formatCurrency(analiseFinanceira.despesas.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'custos' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Custo Fixo"
              value={analiseFinanceira.custo_fixo}
              subtitle="Custos independentes do volume"
              icon={Calculator}
              color="red"
              format="currency"
            />
            <MetricCard
              title="Custo Variável"
              value={analiseFinanceira.custo_variavel}
              subtitle="Custos proporcionais ao volume"
              icon={Activity}
              color="orange"
              format="currency"
            />
            <MetricCard
              title="Custo Total"
              value={analiseFinanceira.custo_total}
              subtitle="Fixo + Variável"
              icon={BarChart3}
              color="gray"
              format="currency"
            />
          </div>

          {/* Break Even */}
          <div className="card">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Análise de Break Even</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ponto de Equilíbrio (Unidades)</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {analiseFinanceira.break_even.ponto_equilibrio_unidades.toLocaleString()} un
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ponto de Equilíbrio (Valor)</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(analiseFinanceira.break_even.ponto_equilibrio_valor)}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Margem de Contribuição</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {analiseFinanceira.break_even.margem_contribuicao.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'indicadores' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="ROI"
              value={analiseFinanceira.roi}
              subtitle="Return on Investment"
              icon={Target}
              color="green"
              format="percentage"
              status={analiseFinanceira.roi > 10 ? 'good' : analiseFinanceira.roi > 5 ? 'warning' : 'danger'}
            />
            <MetricCard
              title="ROA"
              value={analiseFinanceira.roa}
              subtitle="Return on Assets"
              icon={BarChart3}
              color="blue"
              format="percentage"
              status={analiseFinanceira.roa > 5 ? 'good' : analiseFinanceira.roa > 2 ? 'warning' : 'danger'}
            />
            <MetricCard
              title="ROE"
              value={analiseFinanceira.roe}
              subtitle="Return on Equity"
              icon={TrendingUp}
              color="purple"
              format="percentage"
              status={analiseFinanceira.roe > 15 ? 'good' : analiseFinanceira.roe > 10 ? 'warning' : 'danger'}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              title="Endividamento"
              value={analiseFinanceira.endividamento}
              subtitle="Passivo / Patrimônio Líquido"
              icon={CreditCard}
              color="red"
              format="percentage"
              status={analiseFinanceira.endividamento < 30 ? 'good' : analiseFinanceira.endividamento < 50 ? 'warning' : 'danger'}
            />
            <MetricCard
              title="Giro do Ativo"
              value={analiseFinanceira.giro_ativo}
              subtitle="Receita / Ativo Total"
              icon={Activity}
              color="orange"
              format="number"
              status={analiseFinanceira.giro_ativo > 1 ? 'good' : 'warning'}
            />
          </div>

          {/* Prazos */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard
              title="Prazo Médio Recebimento"
              value={analiseFinanceira.prazo_medio_recebimento}
              subtitle="Tempo para receber"
              icon={Clock}
              color="blue"
              format="days"
              status={analiseFinanceira.prazo_medio_recebimento < 30 ? 'good' : analiseFinanceira.prazo_medio_recebimento < 60 ? 'warning' : 'danger'}
            />
            <MetricCard
              title="Prazo Médio Pagamento"
              value={analiseFinanceira.prazo_medio_pagamento}
              subtitle="Tempo para pagar"
              icon={Calendar}
              color="orange"
              format="days"
              status={analiseFinanceira.prazo_medio_pagamento > 30 ? 'good' : 'warning'}
            />
            <MetricCard
              title="Ciclo Operacional"
              value={analiseFinanceira.ciclo_operacional}
              subtitle="Estoque + Recebimento"
              icon={Activity}
              color="purple"
              format="days"
            />
            <MetricCard
              title="Ciclo Financeiro"
              value={analiseFinanceira.ciclo_financeiro}
              subtitle="Operacional - Pagamento"
              icon={DollarSign}
              color="green"
              format="days"
              status={analiseFinanceira.ciclo_financeiro < 30 ? 'good' : analiseFinanceira.ciclo_financeiro < 60 ? 'warning' : 'danger'}
            />
          </div>
        </div>
      )}

      {activeTab === 'liquidez' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Liquidez Corrente"
              value={analiseFinanceira.liquidez.corrente}
              subtitle="Ativo Circulante / Passivo Circulante"
              icon={Droplets}
              color="blue"
              format="number"
              status={analiseFinanceira.liquidez.corrente > 1.5 ? 'good' : analiseFinanceira.liquidez.corrente > 1 ? 'warning' : 'danger'}
            />
            <MetricCard
              title="Liquidez Seca"
              value={analiseFinanceira.liquidez.seca}
              subtitle="(AC - Estoque) / PC"
              icon={Activity}
              color="orange"
              format="number"
              status={analiseFinanceira.liquidez.seca > 1 ? 'good' : analiseFinanceira.liquidez.seca > 0.8 ? 'warning' : 'danger'}
            />
            <MetricCard
              title="Liquidez Imediata"
              value={analiseFinanceira.liquidez.imediata}
              subtitle="Disponível / Passivo Circulante"
              icon={Wallet}
              color="green"
              format="number"
              status={analiseFinanceira.liquidez.imediata > 0.3 ? 'good' : analiseFinanceira.liquidez.imediata > 0.1 ? 'warning' : 'danger'}
            />
          </div>

          {/* Interpretação dos Índices */}
          <div className="card">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Interpretação dos Índices de Liquidez</h3>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Liquidez Saudável</span>
                  </div>
                  <p className="text-xs text-green-700">
                    Corrente &gt; 1.5 | Seca &gt; 1.0 | Imediata &gt; 0.3
                  </p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-900">Atenção Necessária</span>
                  </div>
                  <p className="text-xs text-yellow-700">
                    Corrente 1.0-1.5 | Seca 0.8-1.0 | Imediata 0.1-0.3
                  </p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-900">Situação Crítica</span>
                  </div>
                  <p className="text-xs text-red-700">
                    Corrente &lt; 1.0 | Seca &lt; 0.8 | Imediata &lt; 0.1
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resumo Geral */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Margem Bruta: {analiseFinanceira.margem_bruta.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Fluxo: {formatCurrency(analiseFinanceira.fluxo_de_caixa.saldo)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                ROI: {analiseFinanceira.roi.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-gray-400" />
            <span className="text-sm font-medium text-gray-500">Aguardando dados</span>
          </div>
        </div>
      </div>
    </div>
  );
}