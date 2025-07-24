'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Calculator, 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Download,
  CheckCircle,
  AlertTriangle,
  Building,
  CreditCard,
  Activity,
  ShoppingCart,
  Settings,
  Factory,
  Megaphone,
  Lightbulb,
  Truck,
  Banknote,
  Monitor,
  Users,
  Info,
  ChevronDown
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { formatCurrency } from '../../lib/utils';
import { Tooltip } from '../../components/ui/Tooltip';

export default function ContabilPage() {
  const [activeTab, setActiveTab] = useState<'balanco' | 'dre' | 'fluxo' | 'impostos' | 'conciliacao'>('balanco');
  const [selectedPeriodo, setSelectedPeriodo] = useState('mensal');
  const [selectedCentroCusto, setSelectedCentroCusto] = useState<string | null>(null);
  const [expandedLogisticaSections, setExpandedLogisticaSections] = useState<{[key: string]: boolean}>({
    operacional: true,
    investimento: false,
    financiamento: false
  });

  // Contas contábeis por centro de custo
  const contasContabeis = {
    vendas: [
      {
        centroCusto: 'Vendas',
        tipoConta: 'Receita',
        classeConta: 'Resultado',
        nomeConta: 'Receita de Vendas',
        descricao: 'Valor gerado pelas vendas de produtos e serviços.'
      },
      {
        centroCusto: 'Vendas',
        tipoConta: 'Despesa',
        classeConta: 'Resultado',
        nomeConta: 'Comissão de Vendas',
        descricao: 'Valor pago como comissão para vendedores.'
      },
      {
        centroCusto: 'Vendas',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Salário de Vendedores',
        descricao: 'Salário pago aos vendedores.'
      },
      {
        centroCusto: 'Vendas',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Despesas com Material de Vendas',
        descricao: 'Custos com materiais usados na área de vendas (ex: papel, cartazes, folhetos).'
      },
      {
        centroCusto: 'Vendas',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Despesas Administrativas',
        descricao: 'Custos administrativos da área de vendas (ex: aluguel de espaço, contas de telefone).'
      }
    ],
    logistica: [
      {
        centroCusto: 'Logística',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Frete',
        descricao: 'Custo com o transporte de mercadorias.'
      },
      {
        centroCusto: 'Logística',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Armazenamento de Estoques',
        descricao: 'Custo com o armazenamento de produtos em armazéns.'
      },
      {
        centroCusto: 'Logística',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Salário de Equipe de Logística',
        descricao: 'Salário pago aos trabalhadores da área logística.'
      },
      {
        centroCusto: 'Logística',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Despesas com Embalagens',
        descricao: 'Custo com materiais de embalagem (ex: caixas, fitas, plásticos).'
      }
    ],
    marketing: [
      {
        centroCusto: 'Marketing',
        tipoConta: 'Receita',
        classeConta: 'Resultado',
        nomeConta: 'Receita de Marketing',
        descricao: 'Valor gerado a partir de campanhas de marketing (ex: promoções que resultam em vendas).'
      },
      {
        centroCusto: 'Marketing',
        tipoConta: 'Despesa',
        classeConta: 'Resultado',
        nomeConta: 'Despesas com Publicidade',
        descricao: 'Custos com anúncios publicitários (ex: Facebook Ads, Google Ads).'
      },
      {
        centroCusto: 'Marketing',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Salário de Equipe de Marketing',
        descricao: 'Salário pago aos membros da equipe de marketing.'
      },
      {
        centroCusto: 'Marketing',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Despesas com Pesquisa de Mercado',
        descricao: 'Custos relacionados a pesquisa de mercado (ex: sondagens, foco de grupos).'
      },
      {
        centroCusto: 'Marketing',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Ferramentas de Marketing',
        descricao: 'Custos com ferramentas e softwares de marketing (ex: ferramentas de e-mail marketing).'
      }
    ],
    tecnologia: [
      {
        centroCusto: 'Tecnologia',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Infraestrutura de TI',
        descricao: 'Custos com servidores, redes e outros recursos de infraestrutura de tecnologia.'
      },
      {
        centroCusto: 'Tecnologia',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Licenças de Software',
        descricao: 'Custos com aquisição de licenças de software (ex: sistemas operacionais, softwares de gestão).'
      },
      {
        centroCusto: 'Tecnologia',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Manutenção de Sistemas',
        descricao: 'Custos com manutenção e atualização de sistemas de TI.'
      },
      {
        centroCusto: 'Tecnologia',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Salário de Equipe de TI',
        descricao: 'Salário pago aos profissionais da equipe de tecnologia (desenvolvedores, analistas, etc.).'
      },
      {
        centroCusto: 'Tecnologia',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Consultoria em Tecnologia',
        descricao: 'Custos com consultoria externa em tecnologia ou infraestrutura de TI.'
      }
    ],
    pd: [
      {
        centroCusto: 'P&D',
        tipoConta: 'Despesa',
        classeConta: 'Resultado',
        nomeConta: 'Pesquisa de Mercado',
        descricao: 'Custos com pesquisas de mercado para novos produtos ou serviços.'
      },
      {
        centroCusto: 'P&D',
        tipoConta: 'Despesa',
        classeConta: 'Resultado',
        nomeConta: 'Desenvolvimento de Produtos',
        descricao: 'Custos de desenvolvimento de novos produtos (ex: protótipos, testes).'
      },
      {
        centroCusto: 'P&D',
        tipoConta: 'Despesa',
        classeConta: 'Resultado',
        nomeConta: 'Salário de Equipe de P&D',
        descricao: 'Salário pago aos membros da equipe de pesquisa e desenvolvimento.'
      },
      {
        centroCusto: 'P&D',
        tipoConta: 'Despesa',
        classeConta: 'Resultado',
        nomeConta: 'Equipamentos de P&D',
        descricao: 'Custos com ferramentas e equipamentos necessários para pesquisa e desenvolvimento.'
      },
      {
        centroCusto: 'P&D',
        tipoConta: 'Despesa',
        classeConta: 'Resultado',
        nomeConta: 'Consultoria Técnica',
        descricao: 'Custos com consultorias externas especializadas em tecnologia ou pesquisa.'
      }
    ],
    rh: [
      {
        centroCusto: 'RH',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Salário de Funcionários',
        descricao: 'Salário pago aos colaboradores.'
      },
      {
        centroCusto: 'RH',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Benefícios (Plano de Saúde, Vale Alimentação)',
        descricao: 'Custos com benefícios aos funcionários (ex: plano de saúde, vale alimentação).'
      },
      {
        centroCusto: 'RH',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Treinamento e Capacitação',
        descricao: 'Custos com programas de treinamento e desenvolvimento de funcionários.'
      },
      {
        centroCusto: 'RH',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Recrutamento e Seleção',
        descricao: 'Custos com processos de recrutamento (ex: anúncios de vagas, entrevistas).'
      },
      {
        centroCusto: 'RH',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Consultoria de RH',
        descricao: 'Custos com serviços de consultoria de recursos humanos.'
      }
    ],
    producao: [
      {
        centroCusto: 'Produção',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Matéria-Prima',
        descricao: 'Custos com aquisição de matérias-primas utilizadas na produção.'
      },
      {
        centroCusto: 'Produção',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Salário de Funcionários da Produção',
        descricao: 'Salários pagos aos colaboradores da linha de produção.'
      },
      {
        centroCusto: 'Produção',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Manutenção de Máquinas',
        descricao: 'Custos de manutenção de equipamentos e maquinários usados na produção.'
      },
      {
        centroCusto: 'Produção',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Energia para Produção',
        descricao: 'Custos com consumo de energia elétrica na linha de produção.'
      },
      {
        centroCusto: 'Produção',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Embalagem de Produtos',
        descricao: 'Custos com materiais utilizados para embalar produtos acabados.'
      },
      {
        centroCusto: 'Produção',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Despesas com Transporte de Materiais',
        descricao: 'Custos com transporte de matérias-primas ou produtos entre as fábricas e os armazéns.'
      }
    ],
    financiamento: [
      {
        centroCusto: 'Financiamento',
        tipoConta: 'Receita',
        classeConta: 'Resultado',
        nomeConta: 'Juros Recebidos',
        descricao: 'Receita gerada a partir de juros recebidos de empréstimos ou investimentos.'
      },
      {
        centroCusto: 'Financiamento',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Juros Pagos',
        descricao: 'Despesas com juros pagos em financiamentos ou empréstimos.'
      },
      {
        centroCusto: 'Financiamento',
        tipoConta: 'Passivo',
        classeConta: 'Não Corrente',
        nomeConta: 'Empréstimos de Longo Prazo',
        descricao: 'Dívidas ou empréstimos que devem ser pagos em um período superior a 12 meses.'
      },
      {
        centroCusto: 'Financiamento',
        tipoConta: 'Passivo',
        classeConta: 'Corrente',
        nomeConta: 'Empréstimos de Curto Prazo',
        descricao: 'Dívidas ou empréstimos a serem pagos em até 12 meses.'
      },
      {
        centroCusto: 'Financiamento',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Despesas Bancárias',
        descricao: 'Custos com tarifas bancárias e serviços financeiros.'
      }
    ],
    administracao: [
      {
        centroCusto: 'Administração',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Salário de Funcionários',
        descricao: 'Salários pagos aos colaboradores administrativos.'
      },
      {
        centroCusto: 'Administração',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Material de Escritório',
        descricao: 'Custos com papel, canetas, impressoras, etc.'
      },
      {
        centroCusto: 'Administração',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Aluguel de Escritório',
        descricao: 'Custos com o aluguel do espaço administrativo.'
      },
      {
        centroCusto: 'Administração',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Consultoria Administrativa',
        descricao: 'Custos com serviços de consultoria administrativa (ex: gestão, reestruturação).'
      },
      {
        centroCusto: 'Administração',
        tipoConta: 'Despesa',
        classeConta: 'Corrente',
        nomeConta: 'Serviços Públicos (Energia, Água, Internet)',
        descricao: 'Custos com fornecimento de energia, água e internet para o escritório.'
      }
    ]
  };

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
            { key: 'fluxo', label: 'Centro de custos e Contas Contábeis', icon: Activity },
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
          <div className="space-y-8">
            <h3 className="text-lg font-semibold text-gray-900">Centro de custos e Contas Contábeis</h3>
            
            {/* Seção Fluxo de Caixa */}
            <div className="space-y-6">
              <h4 className="text-md font-semibold text-gray-800">Fluxo de Caixa</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Card customizado para Atividades Operacionais com tags */}
                <div className="card-metric-modern min-h-[140px] relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="icon-container-metric blue">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(dadosContabeis.fluxo_caixa.atividades_operacionais)}</p>
                        <p className="text-xs text-gray-500">Atividades Operacionais</p>
                        <p className="text-xs text-gray-400">Fluxo das operações</p>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Tooltip content="Serviço de uso recorrente ou de curto prazo, necessário para tocar o negócio no dia a dia." position="bottom">
                        <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                      </Tooltip>
                    </div>
                  </div>
                  
                  {/* Tags dos Centros de Custo */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      Vendas
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Administração
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      Logística
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Marketing
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      RH
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      P&D
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Produção
                    </span>
                  </div>
                </div>

                {/* Card customizado para Atividades de Investimento com tag */}
                <div className="card-metric-modern min-h-[140px] relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="icon-container-metric purple">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(dadosContabeis.fluxo_caixa.atividades_investimento)}</p>
                        <p className="text-xs text-gray-500">Atividades de Investimento</p>
                        <p className="text-xs text-gray-400">Investimentos e desinvestimentos</p>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Tooltip content="Aquisição ou melhoria de um ativo de longo prazo (ou gera direito econômico duradouro)." position="bottom">
                        <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                      </Tooltip>
                    </div>
                  </div>
                  
                  {/* Tag do Centro de Custo */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Tecnologia
                    </span>
                  </div>
                </div>

                {/* Card customizado para Atividades de Financiamento com tag */}
                <div className="card-metric-modern min-h-[140px] relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="icon-container-metric orange">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(dadosContabeis.fluxo_caixa.atividades_financiamento)}</p>
                        <p className="text-xs text-gray-500">Atividades de Financiamento</p>
                        <p className="text-xs text-gray-400">Captação e pagamento</p>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Tooltip content="Serviço vinculado a captar ou pagar recursos de terceiros." position="bottom">
                        <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                      </Tooltip>
                    </div>
                  </div>
                  
                  {/* Tag do Centro de Custo */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Financiamento
                    </span>
                  </div>
                </div>
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

            {/* Seção Centro de Custos */}
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-semibold text-gray-800">Centro de Custos</h4>
                <p className="text-sm text-gray-600 mt-1">Gerencie seus centros de custos e adicione contas contábeis para melhor controle financeiro. Em centros de custo não existe "certo" universal — vale a política de rateio que você adotar.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Vendas */}
                <div 
                  className={`card-metric-modern cursor-pointer hover:shadow-md transition-shadow ${
                    selectedCentroCusto === 'vendas' ? 'ring-2 ring-orange-500 bg-orange-50' : ''
                  }`}
                  onClick={() => setSelectedCentroCusto(selectedCentroCusto === 'vendas' ? null : 'vendas')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="icon-container-metric orange">
                        <ShoppingCart className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Vendas</p>
                        <p className="text-xs text-gray-500">R$ 0,00</p>
                        <p className="text-xs text-gray-400">Centro ativo</p>
                      </div>
                    </div>
                    <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                      <Plus className="w-4 h-4 text-gray-400 hover:text-orange-600" />
                    </button>
                  </div>
                </div>

                {/* Administração */}
                <div 
                  className={`card-metric-modern cursor-pointer hover:shadow-md transition-shadow ${
                    selectedCentroCusto === 'administracao' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedCentroCusto(selectedCentroCusto === 'administracao' ? null : 'administracao')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="icon-container-metric blue">
                        <Settings className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Administração</p>
                        <p className="text-xs text-gray-500">R$ 0,00</p>
                        <p className="text-xs text-gray-400">Centro ativo</p>
                      </div>
                    </div>
                    <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                      <Plus className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                    </button>
                  </div>
                </div>

                {/* Produção */}
                <div 
                  className={`card-metric-modern cursor-pointer hover:shadow-md transition-shadow ${
                    selectedCentroCusto === 'producao' ? 'ring-2 ring-green-500 bg-green-50' : ''
                  }`}
                  onClick={() => setSelectedCentroCusto(selectedCentroCusto === 'producao' ? null : 'producao')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="icon-container-metric green">
                        <Factory className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Produção</p>
                        <p className="text-xs text-gray-500">R$ 0,00</p>
                        <p className="text-xs text-gray-400">Centro ativo</p>
                      </div>
                    </div>
                    <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                      <Plus className="w-4 h-4 text-gray-400 hover:text-green-600" />
                    </button>
                  </div>
                </div>

                {/* Marketing */}
                <div 
                  className={`card-metric-modern cursor-pointer hover:shadow-md transition-shadow ${
                    selectedCentroCusto === 'marketing' ? 'ring-2 ring-purple-500 bg-purple-50' : ''
                  }`}
                  onClick={() => setSelectedCentroCusto(selectedCentroCusto === 'marketing' ? null : 'marketing')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="icon-container-metric purple">
                        <Megaphone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Marketing</p>
                        <p className="text-xs text-gray-500">R$ 0,00</p>
                        <p className="text-xs text-gray-400">Centro ativo</p>
                      </div>
                    </div>
                    <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                      <Plus className="w-4 h-4 text-gray-400 hover:text-purple-600" />
                    </button>
                  </div>
                </div>

                {/* P&D */}
                <div 
                  className={`card-metric-modern cursor-pointer hover:shadow-md transition-shadow ${
                    selectedCentroCusto === 'pd' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedCentroCusto(selectedCentroCusto === 'pd' ? null : 'pd')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="icon-container-metric blue">
                        <Lightbulb className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">P&D</p>
                        <p className="text-xs text-gray-500">R$ 0,00</p>
                        <p className="text-xs text-gray-400">Centro ativo</p>
                      </div>
                    </div>
                    <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                      <Plus className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                    </button>
                  </div>
                </div>

                {/* Logística */}
                <div 
                  className={`card-metric-modern cursor-pointer hover:shadow-md transition-shadow ${
                    selectedCentroCusto === 'logistica' ? 'ring-2 ring-orange-500 bg-orange-50' : ''
                  }`}
                  onClick={() => setSelectedCentroCusto(selectedCentroCusto === 'logistica' ? null : 'logistica')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="icon-container-metric orange">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Logística</p>
                        <p className="text-xs text-gray-500">R$ 0,00</p>
                        <p className="text-xs text-gray-400">Centro ativo</p>
                      </div>
                    </div>
                    <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                      <Plus className="w-4 h-4 text-gray-400 hover:text-orange-600" />
                    </button>
                  </div>
                </div>

                {/* Financiamento */}
                <div 
                  className={`card-metric-modern cursor-pointer hover:shadow-md transition-shadow ${
                    selectedCentroCusto === 'financiamento' ? 'ring-2 ring-green-500 bg-green-50' : ''
                  }`}
                  onClick={() => setSelectedCentroCusto(selectedCentroCusto === 'financiamento' ? null : 'financiamento')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="icon-container-metric green">
                        <Banknote className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Financiamento</p>
                        <p className="text-xs text-gray-500">R$ 0,00</p>
                        <p className="text-xs text-gray-400">Centro ativo</p>
                      </div>
                    </div>
                    <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                      <Plus className="w-4 h-4 text-gray-400 hover:text-green-600" />
                    </button>
                  </div>
                </div>

                {/* Tecnologia */}
                <div 
                  className={`card-metric-modern cursor-pointer hover:shadow-md transition-shadow ${
                    selectedCentroCusto === 'tecnologia' ? 'ring-2 ring-purple-500 bg-purple-50' : ''
                  }`}
                  onClick={() => setSelectedCentroCusto(selectedCentroCusto === 'tecnologia' ? null : 'tecnologia')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="icon-container-metric purple">
                        <Monitor className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Tecnologia</p>
                        <p className="text-xs text-gray-500">R$ 0,00</p>
                        <p className="text-xs text-gray-400">Centro ativo</p>
                      </div>
                    </div>
                    <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                      <Plus className="w-4 h-4 text-gray-400 hover:text-purple-600" />
                    </button>
                  </div>
                </div>

                {/* RH */}
                <div 
                  className={`card-metric-modern cursor-pointer hover:shadow-md transition-shadow ${
                    selectedCentroCusto === 'rh' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedCentroCusto(selectedCentroCusto === 'rh' ? null : 'rh')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="icon-container-metric blue">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">RH</p>
                        <p className="text-xs text-gray-500">R$ 0,00</p>
                        <p className="text-xs text-gray-400">Centro ativo</p>
                      </div>
                    </div>
                    <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                      <Plus className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                    </button>
                  </div>
                </div>

                {/* Card para Adicionar Nova Categoria */}
                <div className="card-metric-modern cursor-pointer hover:shadow-md transition-shadow border-2 border-dashed border-gray-300 hover:border-gray-400">
                  <div className="flex items-center justify-center h-full min-h-[80px]">
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <Plus className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-600">Adicionar Centro</p>
                      <p className="text-xs text-gray-400">Nova categoria</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contas Contábeis do Centro de Custo Selecionado */}
              {selectedCentroCusto === 'vendas' && (
                <div className="card">
                  <div className="p-4 border-b border-gray-100">
                    <h5 className="text-sm font-semibold text-gray-900">Centro de Custo: Vendas</h5>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Centro de Custo
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tipo da Conta
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Classe da Conta
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nome da Conta Contábil
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Descrição
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {contasContabeis.vendas.map((conta, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {conta.centroCusto}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                conta.tipoConta === 'Receita' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {conta.tipoConta}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                conta.classeConta === 'Resultado' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {conta.classeConta}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                              {conta.nomeConta}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {conta.descricao}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Contas Contábeis do Centro de Custo Logística */}
              {selectedCentroCusto === 'logistica' && (
                <div className="card">
                  <div className="p-4 border-b border-gray-100">
                    <h5 className="text-sm font-semibold text-gray-900">Centro de Custo: Logística</h5>
                  </div>
                  
                  {/* Seção Operacional */}
                  <div className="border-b border-gray-100">
                    <button
                      onClick={() => setExpandedLogisticaSections(prev => ({
                        ...prev,
                        operacional: !prev.operacional
                      }))}
                      className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">Operacional</span>
                        <Tooltip content="Exemplo: frete, armazenamento de estoque" position="right">
                          <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                        </Tooltip>
                      </div>
                      <ChevronDown 
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          expandedLogisticaSections.operacional ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    
                    {expandedLogisticaSections.operacional && (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Centro de Custo
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tipo da Conta
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Classe da Conta
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nome da Conta Contábil
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Descrição
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {contasContabeis.logistica.map((conta, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                  {conta.centroCusto}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                    conta.tipoConta === 'Receita' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {conta.tipoConta}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                    conta.classeConta === 'Resultado' 
                                      ? 'bg-blue-100 text-blue-800' 
                                      : 'bg-purple-100 text-purple-800'
                                  }`}>
                                    {conta.classeConta}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                  {conta.nomeConta}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                  {conta.descricao}
                                </td>
                              </tr>
                            ))}
                            
                            {/* Linha para adicionar nova conta operacional */}
                            <tr className="hover:bg-gray-50 border-t-2 border-dashed border-gray-300">
                              <td className="px-4 py-3 text-center" colSpan={5}>
                                <button className="flex items-center justify-center space-x-2 text-gray-500 hover:text-orange-600 transition-colors w-full py-2">
                                  <Plus className="w-4 h-4" />
                                  <span className="text-sm font-medium">Adicionar nova conta operacional</span>
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Seção Investimento */}
                  <div className="border-b border-gray-100">
                    <button
                      onClick={() => setExpandedLogisticaSections(prev => ({
                        ...prev,
                        investimento: !prev.investimento
                      }))}
                      className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">Investimento</span>
                        <Tooltip content="Exemplo: construção ou compra de um centro de distribuição, empilhadeiras, sistemas WMS capitalizados" position="right">
                          <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                        </Tooltip>
                      </div>
                      <ChevronDown 
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          expandedLogisticaSections.investimento ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    
                    {expandedLogisticaSections.investimento && (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Centro de Custo
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tipo da Conta
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Classe da Conta
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nome da Conta Contábil
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Descrição
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white">
                            {/* Linha para adicionar nova conta de investimento */}
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-center" colSpan={5}>
                                <button className="flex items-center justify-center space-x-2 text-gray-500 hover:text-orange-600 transition-colors w-full py-2">
                                  <Plus className="w-4 h-4" />
                                  <span className="text-sm font-medium">Adicionar nova conta de investimento</span>
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Seção Financiamento */}
                  <div>
                    <button
                      onClick={() => setExpandedLogisticaSections(prev => ({
                        ...prev,
                        financiamento: !prev.financiamento
                      }))}
                      className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">Financiamento</span>
                        <Tooltip content="Exemplo: levantamento de empréstimo para financiar a frota / pagamento de parcelas desse financiamento" position="right">
                          <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                        </Tooltip>
                      </div>
                      <ChevronDown 
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          expandedLogisticaSections.financiamento ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    
                    {expandedLogisticaSections.financiamento && (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Centro de Custo
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tipo da Conta
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Classe da Conta
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nome da Conta Contábil
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Descrição
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white">
                            {/* Linha para adicionar nova conta de financiamento */}
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-center" colSpan={5}>
                                <button className="flex items-center justify-center space-x-2 text-gray-500 hover:text-orange-600 transition-colors w-full py-2">
                                  <Plus className="w-4 h-4" />
                                  <span className="text-sm font-medium">Adicionar nova conta de financiamento</span>
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contas Contábeis do Centro de Custo Marketing */}
              {selectedCentroCusto === 'marketing' && (
                <div className="card">
                  <div className="p-4 border-b border-gray-100">
                    <h5 className="text-sm font-semibold text-gray-900">Centro de Custo: Marketing</h5>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Centro de Custo
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tipo da Conta
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Classe da Conta
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nome da Conta Contábil
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Descrição
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {contasContabeis.marketing.map((conta, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {conta.centroCusto}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                conta.tipoConta === 'Receita' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {conta.tipoConta}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                conta.classeConta === 'Resultado' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {conta.classeConta}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                              {conta.nomeConta}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {conta.descricao}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Contas Contábeis do Centro de Custo Tecnologia */}
              {selectedCentroCusto === 'tecnologia' && (
                <div className="card">
                  <div className="p-4 border-b border-gray-100">
                    <h5 className="text-sm font-semibold text-gray-900">Centro de Custo: Tecnologia</h5>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Centro de Custo
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tipo da Conta
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Classe da Conta
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nome da Conta Contábil
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Descrição
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {contasContabeis.tecnologia.map((conta, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {conta.centroCusto}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                conta.tipoConta === 'Receita' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {conta.tipoConta}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                conta.classeConta === 'Resultado' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {conta.classeConta}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                              {conta.nomeConta}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {conta.descricao}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Contas Contábeis do Centro de Custo P&D */}
              {selectedCentroCusto === 'pd' && (
                <div className="card">
                  <div className="p-4 border-b border-gray-100">
                    <h5 className="text-sm font-semibold text-gray-900">Centro de Custo: Pesquisa e Desenvolvimento (P&D)</h5>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Centro de Custo
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tipo da Conta
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Classe da Conta
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nome da Conta Contábil
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Descrição
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {contasContabeis.pd.map((conta, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {conta.centroCusto}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                conta.tipoConta === 'Receita' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {conta.tipoConta}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                conta.classeConta === 'Resultado' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {conta.classeConta}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                              {conta.nomeConta}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {conta.descricao}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Contas Contábeis do Centro de Custo RH */}
              {selectedCentroCusto === 'rh' && (
                <div className="card">
                  <div className="p-4 border-b border-gray-100">
                    <h5 className="text-sm font-semibold text-gray-900">Centro de Custo: Recursos Humanos (RH)</h5>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Centro de Custo
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tipo da Conta
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Classe da Conta
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nome da Conta Contábil
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Descrição
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {contasContabeis.rh.map((conta, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {conta.centroCusto}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                conta.tipoConta === 'Receita' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {conta.tipoConta}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                conta.classeConta === 'Resultado' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {conta.classeConta}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                              {conta.nomeConta}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {conta.descricao}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Contas Contábeis do Centro de Custo Produção */}
              {selectedCentroCusto === 'producao' && (
                <div className="card">
                  <div className="p-4 border-b border-gray-100">
                    <h5 className="text-sm font-semibold text-gray-900">Centro de Custo: Produção</h5>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Centro de Custo
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tipo da Conta
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Classe da Conta
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nome da Conta Contábil
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Descrição
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {contasContabeis.producao.map((conta, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {conta.centroCusto}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                conta.tipoConta === 'Receita' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {conta.tipoConta}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                conta.classeConta === 'Resultado' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {conta.classeConta}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                              {conta.nomeConta}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {conta.descricao}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Contas Contábeis do Centro de Custo Financiamento */}
              {selectedCentroCusto === 'financiamento' && (
                <div className="card">
                  <div className="p-4 border-b border-gray-100">
                    <h5 className="text-sm font-semibold text-gray-900">Centro de Custo: Financiamento</h5>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Centro de Custo
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tipo da Conta
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Classe da Conta
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nome da Conta Contábil
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Descrição
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {contasContabeis.financiamento.map((conta, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {conta.centroCusto}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                conta.tipoConta === 'Receita' 
                                  ? 'bg-green-100 text-green-800' 
                                  : conta.tipoConta === 'Despesa'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {conta.tipoConta}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                conta.classeConta === 'Resultado' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : conta.classeConta === 'Corrente'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {conta.classeConta}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                              {conta.nomeConta}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {conta.descricao}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Contas Contábeis do Centro de Custo Administração */}
              {selectedCentroCusto === 'administracao' && (
                <div className="card">
                  <div className="p-4 border-b border-gray-100">
                    <h5 className="text-sm font-semibold text-gray-900">Centro de Custo: Administração</h5>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Centro de Custo
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tipo da Conta
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Classe da Conta
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nome da Conta Contábil
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Descrição
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {contasContabeis.administracao.map((conta, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {conta.centroCusto}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                conta.tipoConta === 'Receita' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {conta.tipoConta}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                conta.classeConta === 'Resultado' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {conta.classeConta}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                              {conta.nomeConta}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {conta.descricao}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Resumo dos Centros de Custos */}
              <div className="card">
                <div className="p-4 border-b border-gray-100">
                  <h5 className="text-sm font-semibold text-gray-900">Resumo por Centro de Custos</h5>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total de Centros Ativos</span>
                      <span className="text-sm font-semibold text-gray-900">9</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total de Custos Alocados</span>
                      <span className="text-sm font-semibold text-gray-900">R$ 0,00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Centro com Maior Custo</span>
                      <span className="text-sm font-semibold text-gray-900">-</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900">Total Geral</span>
                        <span className="text-sm font-bold text-orange-600">R$ 0,00</span>
                      </div>
                    </div>
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