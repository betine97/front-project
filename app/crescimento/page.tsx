'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Plus, 
  Target, 
  Shield, 
  CheckCircle, 
  Clock,
  DollarSign,
  BarChart3,
  PieChart,
  Calculator,
  AlertTriangle,
  Award,
  Building,
  Briefcase,
  TrendingDown,
  Activity,
  Droplets,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Edit,
  Download,
  FileText,
  Settings
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { formatCurrency } from '../../lib/utils';

export default function CrescimentoPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'financeiro' | 'riscos' | 'compliance' | 'metas'>('overview');
  const [selectedPeriodo, setSelectedPeriodo] = useState('12m');

  // Dados mockados para demonstração
  const dadosCrescimento = {
    // Benchmarking
    benchmarking: {
      posicao_mercado: 0,
      market_share: 0,
      crescimento_setor: 0,
      performance_vs_concorrentes: 0
    },
    
    // Valuation
    valuation: {
      valor_empresa: 0,
      multiplo_receita: 0,
      multiplo_ebitda: 0,
      valor_por_acao: 0
    },
    
    // Rentabilidade
    rentabilidade: {
      roa: 0, // Return on Assets
      roe: 0, // Return on Equity
      roic: 0, // Return on Invested Capital
      margem_ebitda: 0,
      margem_liquida: 0
    },
    
    // Análise DuPont
    dupont: {
      margem_liquida: 0,
      giro_ativo: 0,
      multiplicador_patrimonio: 0,
      roe_dupont: 0
    },
    
    // Capital Social
    capital_social: {
      capital_subscrito: 0,
      capital_integralizado: 0,
      reservas: 0,
      lucros_acumulados: 0
    },
    
    // Análise de Investimentos
    investimentos: {
      vpl: 0, // Valor Presente Líquido
      tir: 0, // Taxa Interna de Retorno
      payback: 0, // Período de Payback
      payback_descontado: 0
    },
    
    // Endividamento
    endividamento: {
      divida_total: 0,
      divida_liquida: 0,
      grau_endividamento: 0,
      cobertura_juros: 0
    },
    
    // Liquidez Avançada
    liquidez: {
      corrente: 0,
      seca: 0,
      imediata: 0,
      geral: 0
    },
    
    // SLA e Compliance
    sla: {
      disponibilidade: 0,
      tempo_resposta: 0,
      satisfacao_cliente: 0,
      incidentes_resolvidos: 0
    },
    
    // Riscos
    riscos: {
      risco_credito: 'baixo',
      risco_mercado: 'medio',
      risco_operacional: 'baixo',
      risco_liquidez: 'baixo'
    }
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
    format?: 'currency' | 'percentage' | 'number' | 'days' | 'multiplier';
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
        case 'multiplier':
          return `${val.toFixed(1)}x`;
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
    <DashboardLayout>
      <div className="p-6 max-w-full overflow-x-hidden">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Plano de Crescimento</h1>
            <p className="text-sm text-gray-500">Análise completa de crescimento, valuation, rentabilidade e gestão de riscos empresariais.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="btn-secondary flex items-center space-x-2 text-sm px-4 py-2">
              <Download className="w-4 h-4" />
              <span>Relatório</span>
            </button>
            <button className="btn-primary flex items-center space-x-2 text-sm px-4 py-2">
              <Plus className="w-4 h-4" />
              <span>Nova Meta</span>
            </button>
          </div>
        </div>

        {/* Controles de Período */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: '3m', label: '3 meses' },
              { key: '6m', label: '6 meses' },
              { key: '12m', label: '12 meses' },
              { key: '24m', label: '24 meses' }
            ].map((periodo) => (
              <button
                key={periodo.key}
                onClick={() => setSelectedPeriodo(periodo.key)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                  selectedPeriodo === periodo.key
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {periodo.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs de Análise */}
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1 w-fit mb-6">
          {[
            { key: 'overview', label: 'Visão Geral', icon: BarChart3 },
            { key: 'financeiro', label: 'Análise Financeira', icon: DollarSign },
            { key: 'riscos', label: 'Riscos & Compliance', icon: Shield },
            { key: 'compliance', label: 'SLA & Qualidade', icon: CheckCircle },
            { key: 'metas', label: 'Metas & Objetivos', icon: Target }
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
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Benchmarking */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Benchmarking & Posicionamento</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <MetricCard
                  title="Posição no Mercado"
                  value={dadosCrescimento.benchmarking.posicao_mercado}
                  subtitle="Ranking setorial"
                  icon={Award}
                  color="gold"
                  format="number"
                />
                <MetricCard
                  title="Market Share"
                  value={dadosCrescimento.benchmarking.market_share}
                  subtitle="Participação de mercado"
                  icon={PieChart}
                  color="blue"
                  format="percentage"
                />
                <MetricCard
                  title="Crescimento do Setor"
                  value={dadosCrescimento.benchmarking.crescimento_setor}
                  subtitle="Taxa anual"
                  icon={TrendingUp}
                  color="green"
                  format="percentage"
                />
                <MetricCard
                  title="vs Concorrentes"
                  value={dadosCrescimento.benchmarking.performance_vs_concorrentes}
                  subtitle="Performance relativa"
                  icon={BarChart3}
                  color="purple"
                  format="percentage"
                />
              </div>
            </div>

            {/* Valuation */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Valuation & Valor da Empresa</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <MetricCard
                  title="Valor da Empresa"
                  value={dadosCrescimento.valuation.valor_empresa}
                  subtitle="Valuation atual"
                  icon={Building}
                  color="green"
                  format="currency"
                />
                <MetricCard
                  title="Múltiplo de Receita"
                  value={dadosCrescimento.valuation.multiplo_receita}
                  subtitle="P/S Ratio"
                  icon={Calculator}
                  color="blue"
                  format="multiplier"
                />
                <MetricCard
                  title="Múltiplo EBITDA"
                  value={dadosCrescimento.valuation.multiplo_ebitda}
                  subtitle="EV/EBITDA"
                  icon={BarChart3}
                  color="orange"
                  format="multiplier"
                />
                <MetricCard
                  title="Valor por Ação"
                  value={dadosCrescimento.valuation.valor_por_acao}
                  subtitle="Preço unitário"
                  icon={DollarSign}
                  color="purple"
                  format="currency"
                />
              </div>
            </div>

            {/* Dividendos e Aporte */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900">Dividendos & Distribuição</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Dividendos Pagos</span>
                    <span className="text-sm font-semibold text-gray-900">R$ 0,00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Yield Dividendos</span>
                    <span className="text-sm font-semibold text-gray-900">0.0%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Payout Ratio</span>
                    <span className="text-sm font-semibold text-gray-900">0.0%</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900">Aporte & Investimentos</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Aporte Necessário</span>
                    <span className="text-sm font-semibold text-gray-900">R$ 0,00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Investimentos Realizados</span>
                    <span className="text-sm font-semibold text-gray-900">R$ 0,00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">ROI Esperado</span>
                    <span className="text-sm font-semibold text-gray-900">0.0%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'financeiro' && (
          <div className="space-y-6">
            {/* Índices de Rentabilidade */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Índices de Rentabilidade</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <MetricCard
                  title="ROA"
                  value={dadosCrescimento.rentabilidade.roa}
                  subtitle="Return on Assets"
                  icon={BarChart3}
                  color="green"
                  format="percentage"
                  status={dadosCrescimento.rentabilidade.roa > 5 ? 'good' : dadosCrescimento.rentabilidade.roa > 2 ? 'warning' : 'danger'}
                />
                <MetricCard
                  title="ROE"
                  value={dadosCrescimento.rentabilidade.roe}
                  subtitle="Return on Equity"
                  icon={TrendingUp}
                  color="blue"
                  format="percentage"
                  status={dadosCrescimento.rentabilidade.roe > 15 ? 'good' : dadosCrescimento.rentabilidade.roe > 10 ? 'warning' : 'danger'}
                />
                <MetricCard
                  title="ROIC"
                  value={dadosCrescimento.rentabilidade.roic}
                  subtitle="Return on Invested Capital"
                  icon={Target}
                  color="purple"
                  format="percentage"
                  status={dadosCrescimento.rentabilidade.roic > 10 ? 'good' : dadosCrescimento.rentabilidade.roic > 5 ? 'warning' : 'danger'}
                />
              </div>
            </div>

            {/* Análise DuPont */}
            <div className="card">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">Análise DuPont - Decomposição do ROE</h3>
                <p className="text-xs text-gray-500">ROE = Margem Líquida × Giro do Ativo × Multiplicador do Patrimônio</p>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="bg-blue-50 rounded-lg p-3 mb-2">
                      <p className="text-lg font-bold text-blue-600">{dadosCrescimento.dupont.margem_liquida.toFixed(1)}%</p>
                    </div>
                    <p className="text-xs text-gray-600">Margem Líquida</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-orange-50 rounded-lg p-3 mb-2">
                      <p className="text-lg font-bold text-orange-600">{dadosCrescimento.dupont.giro_ativo.toFixed(2)}x</p>
                    </div>
                    <p className="text-xs text-gray-600">Giro do Ativo</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-50 rounded-lg p-3 mb-2">
                      <p className="text-lg font-bold text-purple-600">{dadosCrescimento.dupont.multiplicador_patrimonio.toFixed(2)}x</p>
                    </div>
                    <p className="text-xs text-gray-600">Mult. Patrimônio</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-50 rounded-lg p-3 mb-2">
                      <p className="text-lg font-bold text-green-600">{dadosCrescimento.dupont.roe_dupont.toFixed(1)}%</p>
                    </div>
                    <p className="text-xs text-gray-600">ROE DuPont</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Capital Social */}
            <div className="card">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">Capital Social & Patrimônio</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Capital Subscrito</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(dadosCrescimento.capital_social.capital_subscrito)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Capital Integralizado</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(dadosCrescimento.capital_social.capital_integralizado)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Reservas</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(dadosCrescimento.capital_social.reservas)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Lucros Acumulados</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(dadosCrescimento.capital_social.lucros_acumulados)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Análise de Investimentos */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise de Investimentos</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <MetricCard
                  title="VPL"
                  value={dadosCrescimento.investimentos.vpl}
                  subtitle="Valor Presente Líquido"
                  icon={Calculator}
                  color="green"
                  format="currency"
                  status={dadosCrescimento.investimentos.vpl > 0 ? 'good' : 'danger'}
                />
                <MetricCard
                  title="TIR"
                  value={dadosCrescimento.investimentos.tir}
                  subtitle="Taxa Interna de Retorno"
                  icon={TrendingUp}
                  color="blue"
                  format="percentage"
                  status={dadosCrescimento.investimentos.tir > 12 ? 'good' : dadosCrescimento.investimentos.tir > 8 ? 'warning' : 'danger'}
                />
                <MetricCard
                  title="Payback"
                  value={dadosCrescimento.investimentos.payback}
                  subtitle="Período de Retorno"
                  icon={Clock}
                  color="orange"
                  format="days"
                  status={dadosCrescimento.investimentos.payback < 365 ? 'good' : dadosCrescimento.investimentos.payback < 730 ? 'warning' : 'danger'}
                />
                <MetricCard
                  title="Payback Descontado"
                  value={dadosCrescimento.investimentos.payback_descontado}
                  subtitle="Período com desconto"
                  icon={Activity}
                  color="purple"
                  format="days"
                />
              </div>
            </div>

            {/* Grau de Endividamento */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Grau de Endividamento</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <MetricCard
                  title="Dívida Total"
                  value={dadosCrescimento.endividamento.divida_total}
                  subtitle="Passivo total"
                  icon={CreditCard}
                  color="red"
                  format="currency"
                />
                <MetricCard
                  title="Dívida Líquida"
                  value={dadosCrescimento.endividamento.divida_liquida}
                  subtitle="Dívida - Caixa"
                  icon={Wallet}
                  color="orange"
                  format="currency"
                />
                <MetricCard
                  title="Grau de Endividamento"
                  value={dadosCrescimento.endividamento.grau_endividamento}
                  subtitle="Dívida / Patrimônio"
                  icon={BarChart3}
                  color="yellow"
                  format="percentage"
                  status={dadosCrescimento.endividamento.grau_endividamento < 30 ? 'good' : dadosCrescimento.endividamento.grau_endividamento < 50 ? 'warning' : 'danger'}
                />
                <MetricCard
                  title="Cobertura de Juros"
                  value={dadosCrescimento.endividamento.cobertura_juros}
                  subtitle="EBIT / Juros"
                  icon={Shield}
                  color="green"
                  format="multiplier"
                  status={dadosCrescimento.endividamento.cobertura_juros > 5 ? 'good' : dadosCrescimento.endividamento.cobertura_juros > 2 ? 'warning' : 'danger'}
                />
              </div>
            </div>

            {/* Índices de Liquidez Avançados */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Índices de Liquidez Avançados</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <MetricCard
                  title="Liquidez Corrente"
                  value={dadosCrescimento.liquidez.corrente}
                  subtitle="Ativo Circulante / Passivo Circulante"
                  icon={Droplets}
                  color="blue"
                  format="multiplier"
                  status={dadosCrescimento.liquidez.corrente > 1.5 ? 'good' : dadosCrescimento.liquidez.corrente > 1 ? 'warning' : 'danger'}
                />
                <MetricCard
                  title="Liquidez Seca"
                  value={dadosCrescimento.liquidez.seca}
                  subtitle="(AC - Estoque) / PC"
                  icon={Activity}
                  color="orange"
                  format="multiplier"
                  status={dadosCrescimento.liquidez.seca > 1 ? 'good' : dadosCrescimento.liquidez.seca > 0.8 ? 'warning' : 'danger'}
                />
                <MetricCard
                  title="Liquidez Imediata"
                  value={dadosCrescimento.liquidez.imediata}
                  subtitle="Disponível / PC"
                  icon={Wallet}
                  color="green"
                  format="multiplier"
                  status={dadosCrescimento.liquidez.imediata > 0.3 ? 'good' : dadosCrescimento.liquidez.imediata > 0.1 ? 'warning' : 'danger'}
                />
                <MetricCard
                  title="Liquidez Geral"
                  value={dadosCrescimento.liquidez.geral}
                  subtitle="(AC + RLP) / (PC + PNC)"
                  icon={BarChart3}
                  color="purple"
                  format="multiplier"
                  status={dadosCrescimento.liquidez.geral > 1 ? 'good' : dadosCrescimento.liquidez.geral > 0.8 ? 'warning' : 'danger'}
                />
              </div>
            </div>

            {/* Planejamento de Finanças */}
            <div className="card">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">Planejamento de Finanças</h3>
                <p className="text-xs text-gray-500">Projeções e cenários financeiros</p>
              </div>
              <div className="p-4">
                <div className="text-center py-8">
                  <Calculator className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Módulo de planejamento financeiro em desenvolvimento</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'riscos' && (
          <div className="space-y-6">
            {/* Mitigação de Riscos */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mitigação de Riscos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                  <div className="p-4 border-b border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-900">Riscos Identificados</h4>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Risco de Crédito</span>
                      </div>
                      <span className="text-xs font-medium text-green-700 uppercase">Baixo</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Risco de Mercado</span>
                      </div>
                      <span className="text-xs font-medium text-yellow-700 uppercase">Médio</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Risco Operacional</span>
                      </div>
                      <span className="text-xs font-medium text-green-700 uppercase">Baixo</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Risco de Liquidez</span>
                      </div>
                      <span className="text-xs font-medium text-green-700 uppercase">Baixo</span>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="p-4 border-b border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-900">Planos de Mitigação</h4>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-900 mb-1">Diversificação de Portfólio</h5>
                      <p className="text-xs text-gray-600">Reduzir concentração de riscos</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-900 mb-1">Hedge Financeiro</h5>
                      <p className="text-xs text-gray-600">Proteção contra volatilidade</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-900 mb-1">Reserva de Emergência</h5>
                      <p className="text-xs text-gray-600">Capital para contingências</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-900 mb-1">Monitoramento Contínuo</h5>
                      <p className="text-xs text-gray-600">Acompanhamento em tempo real</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="space-y-6">
            {/* SLA */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SLA & Indicadores de Qualidade</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <MetricCard
                  title="Disponibilidade"
                  value={dadosCrescimento.sla.disponibilidade}
                  subtitle="Uptime do sistema"
                  icon={CheckCircle}
                  color="green"
                  format="percentage"
                  status={dadosCrescimento.sla.disponibilidade > 99 ? 'good' : dadosCrescimento.sla.disponibilidade > 95 ? 'warning' : 'danger'}
                />
                <MetricCard
                  title="Tempo de Resposta"
                  value={dadosCrescimento.sla.tempo_resposta}
                  subtitle="Média em segundos"
                  icon={Clock}
                  color="blue"
                  format="number"
                  status={dadosCrescimento.sla.tempo_resposta < 2 ? 'good' : dadosCrescimento.sla.tempo_resposta < 5 ? 'warning' : 'danger'}
                />
                <MetricCard
                  title="Satisfação Cliente"
                  value={dadosCrescimento.sla.satisfacao_cliente}
                  subtitle="Score de satisfação"
                  icon={Award}
                  color="orange"
                  format="percentage"
                  status={dadosCrescimento.sla.satisfacao_cliente > 90 ? 'good' : dadosCrescimento.sla.satisfacao_cliente > 80 ? 'warning' : 'danger'}
                />
                <MetricCard
                  title="Incidentes Resolvidos"
                  value={dadosCrescimento.sla.incidentes_resolvidos}
                  subtitle="Taxa de resolução"
                  icon={Shield}
                  color="purple"
                  format="percentage"
                  status={dadosCrescimento.sla.incidentes_resolvidos > 95 ? 'good' : dadosCrescimento.sla.incidentes_resolvidos > 90 ? 'warning' : 'danger'}
                />
              </div>
            </div>

            {/* Compliance */}
            <div className="card">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">Compliance & Conformidade</h3>
              </div>
              <div className="p-4">
                <div className="text-center py-8">
                  <Shield className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Módulo de compliance em desenvolvimento</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'metas' && (
          <div className="space-y-6">
            {/* Metas */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Metas & Objetivos Estratégicos</h3>
              <div className="card">
                <div className="p-4">
                  <div className="text-center py-8">
                    <Target className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Sistema de metas em desenvolvimento</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resumo Geral */}
        <div className="bg-gray-50 rounded-lg p-4 mt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  ROE: {dadosCrescimento.rentabilidade.roe.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  ROA: {dadosCrescimento.rentabilidade.roa.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Droplets className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Liquidez: {dadosCrescimento.liquidez.corrente.toFixed(1)}
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
    </DashboardLayout>
  );
}