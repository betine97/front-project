'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Calculator, 
  BarChart3, 
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Eye,
  Download,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Clock,
  Building,
  CreditCard,
  Wallet,
  Target,
  Activity
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { formatCurrency } from '../../lib/utils';

export default function ContabilPage() {
  const [activeTab, setActiveTab] = useState<'balanco' | 'dre' | 'fluxo' | 'impostos' | 'conciliacao'>('balanco');
  const [selectedPeriodo, setSelectedPeriodo] = useState('mensal');

  // Dados mockados para demonstração
  const dadosContabeis = {
    // Balanço Patrimonial
    balanco: {
      ativo_circulante: 0,
      ativo_nao_circulante: 0,
      passivo_circulante: 0,
      passivo_nao_circulante: 0,
      patrimonio_liquido: 0,
      total_ativo: 0,
      total_passivo: 0
    },
    
    // DRE
    dre: {
      receita_bruta: 0,
      deducoes: 0,
      receita_liquida: 0,
      custo_vendas: 0,
      lucro_bruto: 0,
      despesas_operacionais: 0,
      ebitda: 0,
      lucro_liquido: 0
    },
    
    // Fluxo de Caixa
    fluxo_caixa: {
      atividades_operacionais: 0,
      atividades_investimento: 0,
      atividades_financiamento: 0,
      variacao_caixa: 0,
      saldo_inicial: 0,
      saldo_final: 0
    },
    
    // Impostos
    impostos: {
      icms: 0,
      ipi: 0,
      pis: 0,
      cofins: 0,
      irpj: 0,
      csll: 0,
      total_impostos: 0
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
    format?: 'currency' | 'percentage' | 'number';
    status?: 'good' | 'warning' | 'danger';
  }) => {
    const formatValue = (val: string | number) => {
      if (typeof val === 'string') return val;
      
      switch (format) {
        case 'currency':
          return formatCurrency(val);
        case 'percentage':
          return `${val.toFixed(1)}%`;
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
                {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
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
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Módulo Contábil</h1>
            <p className="text-sm text-gray-500">Gestão completa da contabilidade: balanços, DRE, fluxo de caixa, impostos e conciliações bancárias.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="btn-secondary flex items-center space-x-2 text-sm px-4 py-2">
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
            <button className="btn-primary flex items-center space-x-2 text-sm px-4 py-2">
              <Plus className="w-4 h-4" />
              <span>Novo Lançamento</span>
            </button>
          </div>
        </div>

        {/* Stats Cards Principais */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric green">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">R$ 0,00</p>
                <p className="text-xs text-gray-500">Receita Líquida</p>
              </div>
            </div>
          </div>

          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric blue">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">R$ 0,00</p>
                <p className="text-xs text-gray-500">EBITDA</p>
              </div>
            </div>
          </div>

          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric orange">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">R$ 0,00</p>
                <p className="text-xs text-gray-500">Lucro Líquido</p>
              </div>
            </div>
          </div>

          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric red">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">R$ 0,00</p>
                <p className="text-xs text-gray-500">Total Impostos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controles de Período */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'mensal', label: 'Mensal' },
              { key: 'trimestral', label: 'Trimestral' },
              { key: 'semestral', label: 'Semestral' },
              { key: 'anual', label: 'Anual' }
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
            { key: 'balanco', label: 'Balanço Patrimonial', icon: Building },
            { key: 'dre', label: 'DRE', icon: BarChart3 },
            { key: 'fluxo', label: 'Fluxo de Caixa', icon: Activity },
            { key: 'impostos', label: 'Impostos', icon: Calculator },
            { key: 'conciliacao', label: 'Conciliação', icon: CheckCircle }
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
        {activeTab === 'balanco' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Balanço Patrimonial</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ativo */}
              <div className="card">
                <div className="p-4 border-b border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900">ATIVO</h4>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Ativo Circulante</h5>
                    <div className="space-y-2 ml-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Caixa e Equivalentes</span>
                        <span className="text-sm font-medium text-gray-900">R$ 0,00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Contas a Receber</span>
                        <span className="text-sm font-medium text-gray-900">R$ 0,00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Estoques</span>
                        <span className="text-sm font-medium text-gray-900">R$ 0,00</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 mt-2">
                      <span className="text-sm font-medium text-gray-900">Total Circulante</span>
                      <span className="text-sm font-bold text-blue-600">
                        {formatCurrency(dadosContabeis.balanco.ativo_circulante)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Ativo Não Circulante</h5>
                    <div className="space-y-2 ml-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Imobilizado</span>
                        <span className="text-sm font-medium text-gray-900">R$ 0,00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Intangível</span>
                        <span className="text-sm font-medium text-gray-900">R$ 0,00</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 mt-2">
                      <span className="text-sm font-medium text-gray-900">Total Não Circulante</span>
                      <span className="text-sm font-bold text-blue-600">
                        {formatCurrency(dadosContabeis.balanco.ativo_nao_circulante)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t-2 border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-gray-900">TOTAL DO ATIVO</span>
                      <span className="text-base font-bold text-blue-600">
                        {formatCurrency(dadosContabeis.balanco.total_ativo)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passivo + Patrimônio Líquido */}
              <div className="card">
                <div className="p-4 border-b border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900">PASSIVO + PATRIMÔNIO LÍQUIDO</h4>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Passivo Circulante</h5>
                    <div className="space-y-2 ml-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Fornecedores</span>
                        <span className="text-sm font-medium text-gray-900">R$ 0,00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Impostos a Pagar</span>
                        <span className="text-sm font-medium text-gray-900">R$ 0,00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Empréstimos</span>
                        <span className="text-sm font-medium text-gray-900">R$ 0,00</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 mt-2">
                      <span className="text-sm font-medium text-gray-900">Total Circulante</span>
                      <span className="text-sm font-bold text-red-600">
                        {formatCurrency(dadosContabeis.balanco.passivo_circulante)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Passivo Não Circulante</h5>
                    <div className="space-y-2 ml-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Financiamentos LP</span>
                        <span className="text-sm font-medium text-gray-900">R$ 0,00</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 mt-2">
                      <span className="text-sm font-medium text-gray-900">Total Não Circulante</span>
                      <span className="text-sm font-bold text-red-600">
                        {formatCurrency(dadosContabeis.balanco.passivo_nao_circulante)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Patrimônio Líquido</h5>
                    <div className="space-y-2 ml-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Capital Social</span>
                        <span className="text-sm font-medium text-gray-900">R$ 0,00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Lucros Acumulados</span>
                        <span className="text-sm font-medium text-gray-900">R$ 0,00</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 mt-2">
                      <span className="text-sm font-medium text-gray-900">Total PL</span>
                      <span className="text-sm font-bold text-green-600">
                        {formatCurrency(dadosContabeis.balanco.patrimonio_liquido)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t-2 border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-gray-900">TOTAL PASSIVO + PL</span>
                      <span className="text-base font-bold text-blue-600">
                        {formatCurrency(dadosContabeis.balanco.total_passivo)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dre' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Demonstração do Resultado do Exercício (DRE)</h3>
            
            <div className="card">
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">Receita Bruta</span>
                    <span className="text-sm font-bold text-green-600">
                      {formatCurrency(dadosContabeis.dre.receita_bruta)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">(-) Deduções e Impostos</span>
                    <span className="text-sm font-bold text-red-600">
                      {formatCurrency(dadosContabeis.dre.deducoes)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <span className="text-sm font-bold text-gray-900">Receita Líquida</span>
                    <span className="text-sm font-bold text-blue-600">
                      {formatCurrency(dadosContabeis.dre.receita_liquida)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">(-) Custo das Vendas</span>
                    <span className="text-sm font-bold text-orange-600">
                      {formatCurrency(dadosContabeis.dre.custo_vendas)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-2 border-green-200">
                    <span className="text-sm font-bold text-gray-900">Lucro Bruto</span>
                    <span className="text-sm font-bold text-green-600">
                      {formatCurrency(dadosContabeis.dre.lucro_bruto)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">(-) Despesas Operacionais</span>
                    <span className="text-sm font-bold text-purple-600">
                      {formatCurrency(dadosContabeis.dre.despesas_operacionais)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <span className="text-sm font-bold text-gray-900">EBITDA</span>
                    <span className="text-sm font-bold text-blue-600">
                      {formatCurrency(dadosContabeis.dre.ebitda)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-4 border-green-300">
                    <span className="text-base font-bold text-gray-900">LUCRO LÍQUIDO</span>
                    <span className="text-base font-bold text-green-600">
                      {formatCurrency(dadosContabeis.dre.lucro_liquido)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fluxo' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Fluxo de Caixa</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <MetricCard
                title="Atividades Operacionais"
                value={dadosContabeis.fluxo_caixa.atividades_operacionais}
                subtitle="Fluxo das operações"
                icon={Activity}
                color="blue"
                format="currency"
              />
              <MetricCard
                title="Atividades de Investimento"
                value={dadosContabeis.fluxo_caixa.atividades_investimento}
                subtitle="Investimentos e desinvestimentos"
                icon={TrendingUp}
                color="purple"
                format="currency"
              />
              <MetricCard
                title="Atividades de Financiamento"
                value={dadosContabeis.fluxo_caixa.atividades_financiamento}
                subtitle="Captação e pagamento"
                icon={CreditCard}
                color="orange"
                format="currency"
              />
            </div>

            <div className="card">
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">Saldo Inicial de Caixa</span>
                    <span className="text-sm font-bold text-gray-600">
                      {formatCurrency(dadosContabeis.fluxo_caixa.saldo_inicial)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">Variação do Caixa</span>
                    <span className="text-sm font-bold text-blue-600">
                      {formatCurrency(dadosContabeis.fluxo_caixa.variacao_caixa)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-2 border-green-200">
                    <span className="text-base font-bold text-gray-900">Saldo Final de Caixa</span>
                    <span className="text-base font-bold text-green-600">
                      {formatCurrency(dadosContabeis.fluxo_caixa.saldo_final)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'impostos' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Gestão de Impostos</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <MetricCard
                title="ICMS"
                value={dadosContabeis.impostos.icms}
                subtitle="Imposto sobre Circulação"
                icon={Calculator}
                color="blue"
                format="currency"
              />
              <MetricCard
                title="PIS/COFINS"
                value={dadosContabeis.impostos.pis + dadosContabeis.impostos.cofins}
                subtitle="Contribuições Sociais"
                icon={FileText}
                color="orange"
                format="currency"
              />
              <MetricCard
                title="IRPJ/CSLL"
                value={dadosContabeis.impostos.irpj + dadosContabeis.impostos.csll}
                subtitle="Imposto de Renda"
                icon={Building}
                color="red"
                format="currency"
              />
            </div>

            <div className="card">
              <div className="p-4 border-b border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900">Resumo de Impostos</h4>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">ICMS</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(dadosContabeis.impostos.icms)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">IPI</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(dadosContabeis.impostos.ipi)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">PIS</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(dadosContabeis.impostos.pis)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">COFINS</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(dadosContabeis.impostos.cofins)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">IRPJ</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(dadosContabeis.impostos.irpj)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">CSLL</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(dadosContabeis.impostos.csll)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-900">Total de Impostos</span>
                      <span className="text-sm font-bold text-red-600">
                        {formatCurrency(dadosContabeis.impostos.total_impostos)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'conciliacao' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Conciliação Bancária</h3>
            
            <div className="card">
              <div className="p-4">
                <div className="text-center py-8">
                  <CheckCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Módulo de conciliação bancária em desenvolvimento</p>
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
                  Receita Líquida: {formatCurrency(dadosContabeis.dre.receita_liquida)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  EBITDA: {formatCurrency(dadosContabeis.dre.ebitda)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Lucro Líquido: {formatCurrency(dadosContabeis.dre.lucro_liquido)}
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