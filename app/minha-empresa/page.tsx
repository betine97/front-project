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
  TrendingDown,
  Activity,
  Droplets,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Monitor,
  Lightbulb,
  Eye,
  Download,
  FileText,
  ChevronDown,
  ChevronUp,
  Zap,
  Globe,
  Truck,
  Wifi,
  Server,
  Database,
  Lock,
  Ghost
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { formatCurrency } from '../../lib/utils';

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

export default function MinhaEmpresaPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'financeiro' | 'riscos' | 'compliance' | 'metas'>('overview');
  const [selectedPeriodo, setSelectedPeriodo] = useState('12m');
  const [riscosExpanded, setRiscosExpanded] = useState(false);
  const [oportunidadesExpanded, setOportunidadesExpanded] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState<'concorrencia' | 'produtos' | 'marketing' | 'atendimento' | 'vendas' | 'pos-vendas'>('concorrencia');
  const [questionarioModalOpen, setQuestionarioModalOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="p-6 max-w-full overflow-x-hidden">


        {/* Sobre a Empresa */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Sobre a Empresa</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card de Valuation com Patrimônio Líquido */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-md font-semibold text-gray-900">Casa de Ração Premium</h3>
                  <p className="text-xs text-gray-500">Valuation</p>
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">R$ 2,8M</div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-sm text-green-600 font-medium">+12,5%</span>
                <span className="text-sm text-gray-500">vs último ano</span>
              </div>
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Múltiplo P/L:</span>
                  <span className="font-medium text-gray-900">18,2x</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">EV/EBITDA:</span>
                  <span className="font-medium text-gray-900">11,7x</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">ROE:</span>
                  <span className="font-medium text-gray-900">15,3%</span>
                </div>
              </div>
              
              {/* Patrimônio Líquido */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900">Patrimônio Líquido</h4>
                  <Building className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">R$ 1,2M</div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-sm text-blue-600 font-medium">+8,3%</span>
                  <span className="text-sm text-gray-500">vs último ano</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Capital Social:</span>
                    <span className="font-medium text-gray-900">R$ 500K</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Reservas:</span>
                    <span className="font-medium text-gray-900">R$ 450K</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Lucros Retidos:</span>
                    <span className="font-medium text-gray-900">R$ 250K</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações Corporativas */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Informações Corporativas</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Nome Fantasia</p>
                    <p className="text-sm font-medium text-gray-900">Casa de Ração Premium</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Nome Comercial</p>
                    <p className="text-sm font-medium text-gray-900">Premium Pet Care Ltda</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">CNPJ</p>
                    <p className="text-sm font-medium text-gray-900">12.345.678/0001-90</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Fundação</p>
                    <p className="text-sm font-medium text-gray-900">Janeiro 2016 (8 anos)</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Funcionários</p>
                    <p className="text-sm font-medium text-gray-900">47 colaboradores</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Localização</p>
                    <p className="text-sm font-medium text-gray-900">São Paulo, SP</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Área Total</p>
                    <p className="text-sm font-medium text-gray-900">1.200 m²</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Quadro Societário</p>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">João Silva - 60%</p>
                      <p className="text-sm font-medium text-gray-900">Maria Santos - 40%</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Capital Social</p>
                    <p className="text-sm font-medium text-gray-900">R$ 500.000</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Regime Tributário</p>
                    <p className="text-sm font-medium text-gray-900">Lucro Presumido</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Contador Responsável</p>
                    <p className="text-sm font-medium text-gray-900">CRC 1SP123456/O-7</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Banco Principal</p>
                    <p className="text-sm font-medium text-gray-900">Banco do Brasil</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Atividade Principal</p>
                    <p className="text-sm font-medium text-gray-900">Comércio de produtos para animais</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">CNAE</p>
                    <p className="text-sm font-medium text-gray-900">4789-0/99</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Inscrição Estadual</p>
                    <p className="text-sm font-medium text-gray-900">123.456.789.012</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Certificações</p>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">ISO 9001:2015</p>
                      <p className="text-sm font-medium text-gray-900">Certificação Orgânica</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Seguro Empresarial</p>
                    <p className="text-sm font-medium text-gray-900">R$ 2,5M cobertura</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Empresa especializada em produtos premium para animais de estimação, atuando no mercado há 8 anos com foco em qualidade, sustentabilidade e inovação no segmento pet care.
                </p>
              </div>
            </div>
          </div>

          {/* KPIs Principais da Empresa */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-xs text-gray-500 uppercase tracking-wide">Receita Anual</span>
              </div>
              <div className="text-lg font-bold text-gray-900">R$ 1,2M</div>
              <div className="text-xs text-green-600 font-medium">+18% YoY</div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-gray-500 uppercase tracking-wide">EBITDA</span>
              </div>
              <div className="text-lg font-bold text-gray-900">R$ 240K</div>
              <div className="text-xs text-blue-600 font-medium">20% margem</div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="text-xs text-gray-500 uppercase tracking-wide">Clientes Ativos</span>
              </div>
              <div className="text-lg font-bold text-gray-900">2.847</div>
              <div className="text-xs text-purple-600 font-medium">+156 este mês</div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-orange-600" />
                <span className="text-xs text-gray-500 uppercase tracking-wide">Market Share</span>
              </div>
              <div className="text-lg font-bold text-gray-900">8,7%</div>
              <div className="text-xs text-orange-600 font-medium">Região SP</div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <Award className="w-4 h-4 text-yellow-600" />
                <span className="text-xs text-gray-500 uppercase tracking-wide">NPS Score</span>
              </div>
              <div className="text-lg font-bold text-gray-900">72</div>
              <div className="text-xs text-yellow-600 font-medium">Excelente</div>
            </div>
          </div>
        </div>

        {/* Seção de Análise SWOT */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Análise SWOT</h2>
          


          {/* Análise de Forças e Fraquezas */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise de Forças e Fraquezas</h3>
            
            {/* Tabs de Categorias */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1 w-fit mb-6">
              {[
                { key: 'concorrencia', label: 'Concorrência', icon: Users },
                { key: 'produtos', label: 'Produtos', icon: Award },
                { key: 'marketing', label: 'Marketing', icon: Monitor },
                { key: 'atendimento', label: 'Atendimento', icon: Users },
                { key: 'vendas', label: 'Vendas', icon: TrendingUp },
                { key: 'pos-vendas', label: 'Pós-Vendas', icon: CheckCircle }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveCategoryTab(tab.key as any)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                    activeCategoryTab === tab.key
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
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              {/* Tab: Concorrência */}
              {activeCategoryTab === 'concorrencia' && (
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Análise de Concorrência</h4>
                  </div>

                  {/* Seção de Concorrentes */}
                  <div className="mb-8">
                    <div className="flex items-center mb-2">
                      <Users className="w-4 h-4 text-purple-600 mr-2" />
                      <h5 className="text-md font-semibold text-purple-800">Concorrentes</h5>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">É ideal ter de 3 a 6 concorrentes cadastrados para uma análise competitiva completa.</p>
                    
                    {/* Card para adicionar concorrente */}
                    <div className="bg-white border-2 border-dashed border-purple-200 rounded-lg p-6 hover:border-purple-300 transition-colors cursor-pointer group max-w-sm">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
                          <Plus className="w-6 h-6 text-purple-600" />
                        </div>
                        <h6 className="text-sm font-medium text-gray-900 mb-1">Adicionar Concorrente</h6>
                        <p className="text-xs text-gray-500">Clique para cadastrar informações sobre um concorrente</p>
                      </div>
                    </div>
                  </div>

                  {/* Questionário Estratégico Compacto */}
                  <div className="mb-8">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-purple-600" />
                          <h5 className="text-sm font-semibold text-purple-800">Questionário Estratégico</h5>
                          <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">4 perguntas • 3 min</span>
                        </div>
                        <button className="bg-purple-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-purple-700 transition-colors">
                          Responder
                        </button>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Lightbulb className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-purple-700">Responda para gerar Mini-SWOT de Concorrência específico desta categoria</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Produtos */}
              {activeCategoryTab === 'produtos' && (
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <Award className="w-5 h-5 text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Análise de Produtos</h4>
                  </div>

                  {/* Seção de Produtos */}
                  <div className="mb-8">
                    <div className="flex items-center mb-2">
                      <Award className="w-4 h-4 text-green-600 mr-2" />
                      <h5 className="text-md font-semibold text-green-800">Produtos</h5>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">É ideal ter produtos cadastrados para uma análise completa do portfólio.</p>
                    
                    {/* Card para adicionar produto */}
                    <div className="bg-white border-2 border-dashed border-green-200 rounded-lg p-6 hover:border-green-300 transition-colors cursor-pointer group max-w-sm">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
                          <Plus className="w-6 h-6 text-green-600" />
                        </div>
                        <h6 className="text-sm font-medium text-gray-900 mb-1">Adicionar Produto</h6>
                        <p className="text-xs text-gray-500">Clique para cadastrar informações sobre um produto</p>
                      </div>
                    </div>
                  </div>

                  {/* Questionário Estratégico Compacto */}
                  <div className="mb-8">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-green-600" />
                          <h5 className="text-sm font-semibold text-green-800">Questionário Estratégico</h5>
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">4 perguntas • 3 min</span>
                        </div>
                        <button className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-700 transition-colors">
                          Responder
                        </button>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Lightbulb className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-green-700">Responda para gerar Mini-SWOT de Produtos específico desta categoria</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Marketing */}
              {activeCategoryTab === 'marketing' && (
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <Monitor className="w-5 h-5 text-blue-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Análise de Marketing</h4>
                  </div>

                  {/* Questionário Estratégico Compacto */}
                  <div className="mb-8">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <h5 className="text-sm font-semibold text-blue-800">Questionário Estratégico</h5>
                          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">4 perguntas • 3 min</span>
                        </div>
                        <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors">
                          Responder
                        </button>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Lightbulb className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-blue-700">Responda para gerar Mini-SWOT de Marketing específico desta categoria</p>
                      </div>
                    </div>
                  </div>


                </div>
              )}

              {/* Tab: Atendimento */}
              {activeCategoryTab === 'atendimento' && (
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                      <Users className="w-5 h-5 text-yellow-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Análise de Atendimento</h4>
                  </div>

                  {/* Questionário Estratégico Compacto */}
                  <div className="mb-8">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-yellow-600" />
                          <h5 className="text-sm font-semibold text-yellow-800">Questionário Estratégico</h5>
                          <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">4 perguntas • 3 min</span>
                        </div>
                        <button className="bg-yellow-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-yellow-700 transition-colors">
                          Responder
                        </button>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Lightbulb className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-yellow-700">Responda para gerar Mini-SWOT de Atendimento específico desta categoria</p>
                      </div>
                    </div>
                  </div>


                </div>
              )}

              {/* Tab: Vendas */}
              {activeCategoryTab === 'vendas' && (
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                      <TrendingUp className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Análise de Vendas</h4>
                  </div>

                  {/* Questionário Estratégico Compacto */}
                  <div className="mb-8">
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          <h5 className="text-sm font-semibold text-indigo-800">Questionário Estratégico</h5>
                          <span className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded">4 perguntas • 3 min</span>
                        </div>
                        <button className="bg-indigo-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-indigo-700 transition-colors">
                          Responder
                        </button>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Lightbulb className="w-3 h-3 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-indigo-700">Responda para gerar Mini-SWOT de Vendas específico desta categoria</p>
                      </div>
                    </div>
                  </div>


                </div>
              )}

              {/* Tab: Pós-Vendas */}
              {activeCategoryTab === 'pos-vendas' && (
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                      <CheckCircle className="w-5 h-5 text-teal-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Análise de Pós-Vendas</h4>
                  </div>

                  {/* Questionário Estratégico Compacto */}
                  <div className="mb-8">
                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-teal-600" />
                          <h5 className="text-sm font-semibold text-teal-800">Questionário Estratégico</h5>
                          <span className="text-xs text-teal-600 bg-teal-100 px-2 py-1 rounded">4 perguntas • 3 min</span>
                        </div>
                        <button className="bg-teal-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-teal-700 transition-colors">
                          Responder
                        </button>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Lightbulb className="w-3 h-3 text-teal-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-teal-700">Responda para gerar Mini-SWOT de Pós-Vendas específico desta categoria</p>
                      </div>
                    </div>
                  </div>


                </div>
              )}
            </div>
          </div>

          {/* Análise de Riscos */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise de Riscos</h3>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                    <Shield className="w-5 h-5 text-red-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Gestão de Riscos</h4>
                </div>
                <button
                  onClick={() => setRiscosExpanded(!riscosExpanded)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {riscosExpanded ? 'Recolher' : 'Expandir'}
                  </span>
                  {riscosExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>
              
              {/* Resumo dos Riscos - Sempre Visível */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-red-800">Alto Risco</span>
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="text-2xl font-bold text-red-600">4</div>
                  <div className="text-xs text-red-600">Riscos críticos</div>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-orange-800">Médio Risco</span>
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold text-orange-600">6</div>
                  <div className="text-xs text-orange-600">Riscos moderados</div>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-yellow-800">Baixo Risco</span>
                    <CheckCircle className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">3</div>
                  <div className="text-xs text-yellow-600">Riscos controlados</div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-800">Total</span>
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">13</div>
                  <div className="text-xs text-blue-600">Riscos mapeados</div>
                </div>
              </div>

              {/* Conteúdo Expansível */}
              {riscosExpanded && (


            <div className="space-y-8">
              {/* Riscos Operacionais */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-gray-600" />
                  Operacionais
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Ruptura na Cadeia de Suprimentos */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg border border-red-200 p-4 shadow-sm">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Truck className="w-4 h-4 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">Ruptura na Cadeia de Suprimentos</h4>
                          <p className="text-xs text-gray-600 mb-3">Falta de insumos, atrasos em pedidos</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">Alto Risco</span>
                            <span className="text-xs text-gray-500">40%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200 p-3">
                      <h5 className="text-xs font-semibold text-red-900 mb-2">Ações de Mitigação:</h5>
                      <div className="space-y-1">
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-red-800">Diversificar fornecedores</p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-red-800">Estoque de segurança</p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-red-800">Contratos com cláusula de entrega rápida</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Falha de Equipamentos */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg border border-orange-200 p-4 shadow-sm">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Zap className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">Falha de Equipamentos / TI Crítico</h4>
                          <p className="text-xs text-gray-600 mb-3">Paralisa a expedição e vendas on-line</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Médio Risco</span>
                            <span className="text-xs text-gray-500">25%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200 p-3">
                      <h5 className="text-xs font-semibold text-orange-900 mb-2">Ações de Mitigação:</h5>
                      <div className="space-y-1">
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-orange-800">Manutenção preventiva</p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-orange-800">Peças de reposição em estoque</p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-orange-800">SLA claro com suporte externo</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Riscos Tecnológicos / Cibernéticos */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-gray-600" />
                  Tecnológico / Cibernético
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Ataque Ransomware */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg border border-red-200 p-4 shadow-sm">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Lock className="w-4 h-4 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">Ataque Ransomware</h4>
                          <p className="text-xs text-gray-600 mb-3">Perda de dados, parada de operações</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">Baixo Risco</span>
                            <span className="text-xs text-gray-500">15%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-3">
                      <h5 className="text-xs font-semibold text-blue-900 mb-2">Ações de Mitigação:</h5>
                      <div className="space-y-1">
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-blue-800">Backups diários offline</p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-blue-800">Antivírus + EDR</p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-blue-800">Treino de phishing para equipe</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Downtime do ERP */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg border border-orange-200 p-4 shadow-sm">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Server className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">Downtime do ERP / Loja Virtual</h4>
                          <p className="text-xs text-gray-600 mb-3">Perda de vendas, insatisfação de clientes</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Médio Risco</span>
                            <span className="text-xs text-gray-500">30%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200 p-3">
                      <h5 className="text-xs font-semibold text-orange-900 mb-2">Ações de Mitigação:</h5>
                      <div className="space-y-1">
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-orange-800">Alta disponibilidade (cloud)</p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-orange-800">Monitoramento 24/7</p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-orange-800">Plano de contingência manual</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Riscos Legal & Regulatório */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-gray-600" />
                  Legal & Regulatório
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* LGPD */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg border border-yellow-200 p-4 shadow-sm">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Database className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">Mudança nas Regras de Proteção de Dados (LGPD)</h4>
                          <p className="text-xs text-gray-600 mb-3">Multas, bloqueio de operação</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">Médio Risco</span>
                            <span className="text-xs text-gray-500">35%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200 p-3">
                      <h5 className="text-xs font-semibold text-yellow-900 mb-2">Ações de Mitigação:</h5>
                      <div className="space-y-1">
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-yellow-800">Auditoria de dados pessoais</p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-yellow-800">DPO nomeado</p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-yellow-800">Revisar contratos de terceiros</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Passivo Trabalhista */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg border border-orange-200 p-4 shadow-sm">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">Passivo Trabalhista</h4>
                          <p className="text-xs text-gray-600 mb-3">Custos judiciais, multas</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Baixo Risco</span>
                            <span className="text-xs text-gray-500">20%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200 p-3">
                      <h5 className="text-xs font-semibold text-orange-900 mb-2">Ações de Mitigação:</h5>
                      <div className="space-y-1">
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-orange-800">Compliance de RH</p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-orange-800">Acordos coletivos atualizados</p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-orange-800">Treinamento de líderes</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Riscos Reputacionais */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-gray-600" />
                  Reputacional
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Má Experiência do Cliente */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg border border-red-200 p-4 shadow-sm">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="w-4 h-4 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">Má Experiência do Cliente (reviews negativos)</h4>
                          <p className="text-xs text-gray-600 mb-3">Queda de vendas, perda de confiança</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">Alto Risco</span>
                            <span className="text-xs text-gray-500">45%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200 p-3">
                      <h5 className="text-xs font-semibold text-red-900 mb-2">Ações de Mitigação:</h5>
                      <div className="space-y-1">
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-red-800">Programa de atendimento 24h</p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-red-800">Política clara de devolução</p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-red-800">Monitorar redes sociais</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Crise nas Redes Sociais */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg border border-yellow-200 p-4 shadow-sm">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Globe className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">Crise nas Redes Sociais</h4>
                          <p className="text-xs text-gray-600 mb-3">Danos à marca, boicotes</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">Baixo Risco</span>
                            <span className="text-xs text-gray-500">10%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200 p-3">
                      <h5 className="text-xs font-semibold text-yellow-900 mb-2">Ações de Mitigação:</h5>
                      <div className="space-y-1">
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-yellow-800">Manual de resposta a crises</p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-yellow-800">Porta-voz treinado</p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-yellow-800">Monitoramento em tempo real</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Riscos Ambientais / ESG */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-green-600" />
                  Ambiental / ESG
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Descumprir Norma Ambiental */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg border border-orange-200 p-4 shadow-sm">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Globe className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">Descumprir Norma Ambiental Local</h4>
                          <p className="text-xs text-gray-600 mb-3">Multas, interdição, imagem</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Médio Risco</span>
                            <span className="text-xs text-gray-500">25%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 p-3">
                      <h5 className="text-xs font-semibold text-green-900 mb-2">Ações de Mitigação:</h5>
                      <div className="space-y-1">
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-green-800">Licenças atualizadas</p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-green-800">Medir e reduzir resíduos</p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-green-800">Relatório ESG anual</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Eventos Climáticos Extremos */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg border border-yellow-200 p-4 shadow-sm">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Zap className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">Eventos Climáticos Extremos</h4>
                          <p className="text-xs text-gray-600 mb-3">Interrupções logísticas, estoque perdido</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">Baixo Risco</span>
                            <span className="text-xs text-gray-500">15%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-3">
                      <h5 className="text-xs font-semibold text-blue-900 mb-2">Ações de Mitigação:</h5>
                      <div className="space-y-1">
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-blue-800">Plano de contingência logística</p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-blue-800">Seguro adequado</p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-blue-800">Avaliar rotas alternativas</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Riscos Estratégicos */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-gray-600" />
                  Estratégico
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Dependência de Fornecedor Crítico */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg border border-orange-200 p-4 shadow-sm">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Truck className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">Dependência de um Único Fornecedor Crítico</h4>
                          <p className="text-xs text-gray-600 mb-3">Poder de barganha perdido, risco de desabastecimento</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Médio Risco</span>
                            <span className="text-xs text-gray-500">30%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200 p-3">
                      <h5 className="text-xs font-semibold text-orange-900 mb-2">Ações de Mitigação:</h5>
                      <div className="space-y-1">
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-orange-800">Negociação de contratos múltiplos</p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-orange-800">Desenvolvimento de fornecedor alternativo</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mudança nas Preferências do Consumidor */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg border border-red-200 p-4 shadow-sm">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="w-4 h-4 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">Mudança Rápida nas Preferências do Consumidor</h4>
                          <p className="text-xs text-gray-600 mb-3">Estoque obsoleto, queda de receita</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">Alto Risco</span>
                            <span className="text-xs text-gray-500">40%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200 p-3">
                      <h5 className="text-xs font-semibold text-red-900 mb-2">Ações de Mitigação:</h5>
                      <div className="space-y-1">
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-red-800">Pesquisa de tendências contínua</p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-xs text-red-800">Portfólio flexível (linha premium/orgânica)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
              )}
            </div>
          </div>

          {/* Oportunidades Identificadas */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Oportunidades Identificadas</h3>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <Lightbulb className="w-5 h-5 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Oportunidades de Crescimento</h4>
                </div>
                <button
                  onClick={() => setOportunidadesExpanded(!oportunidadesExpanded)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {oportunidadesExpanded ? 'Recolher' : 'Expandir'}
                  </span>
                  {oportunidadesExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>
              
              {/* Resumo das Oportunidades - Sempre Visível */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-800">Alto Potencial</span>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">5</div>
                  <div className="text-xs text-green-600">Oportunidades estratégicas</div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-800">Médio Potencial</span>
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">8</div>
                  <div className="text-xs text-blue-600">Oportunidades táticas</div>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-yellow-800">Curto Prazo</span>
                    <Clock className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">6</div>
                  <div className="text-xs text-yellow-600">Implementação rápida</div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-800">Total</span>
                    <Lightbulb className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600">19</div>
                  <div className="text-xs text-purple-600">Oportunidades mapeadas</div>
                </div>
              </div>

              {/* Conteúdo Expansível */}
              {oportunidadesExpanded && (
                <div className="space-y-8">
                  {/* Oportunidades de Mercado */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-gray-600" />
                      Mercado & Expansão
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* E-commerce */}
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg border border-green-200 p-4 shadow-sm">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Globe className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1">Expansão E-commerce</h4>
                              <p className="text-xs text-gray-600 mb-3">Mercado online representa 40% do setor pet</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Alto Potencial</span>
                                <span className="text-xs text-gray-500">ROI: 250%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 p-3">
                          <h5 className="text-xs font-semibold text-green-900 mb-2">Ações Recomendadas:</h5>
                          <div className="space-y-1">
                            <div className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                              <p className="text-xs text-green-800">Desenvolver loja virtual completa</p>
                            </div>
                            <div className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                              <p className="text-xs text-green-800">Integrar com marketplaces</p>
                            </div>
                            <div className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                              <p className="text-xs text-green-800">Sistema de entrega próprio</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Novas Regiões */}
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg border border-blue-200 p-4 shadow-sm">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Building className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1">Expansão Geográfica</h4>
                              <p className="text-xs text-gray-600 mb-3">3 cidades vizinhas sem concorrência direta</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Médio Potencial</span>
                                <span className="text-xs text-gray-500">ROI: 180%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-3">
                          <h5 className="text-xs font-semibold text-blue-900 mb-2">Ações Recomendadas:</h5>
                          <div className="space-y-1">
                            <div className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                              <p className="text-xs text-blue-800">Pesquisa de mercado detalhada</p>
                            </div>
                            <div className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                              <p className="text-xs text-blue-800">Parcerias locais estratégicas</p>
                            </div>
                            <div className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                              <p className="text-xs text-blue-800">Modelo de franquia</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Oportunidades de Produto */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-gray-600" />
                      Produtos & Serviços
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Linha Premium */}
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg border border-yellow-200 p-4 shadow-sm">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Award className="w-4 h-4 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1">Linha Super Premium</h4>
                              <p className="text-xs text-gray-600 mb-3">Produtos orgânicos e sustentáveis</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">Alto Potencial</span>
                                <span className="text-xs text-gray-500">Margem: 45%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200 p-3">
                          <h5 className="text-xs font-semibold text-yellow-900 mb-2">Ações Recomendadas:</h5>
                          <div className="space-y-1">
                            <div className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1 flex-shrink-0"></div>
                              <p className="text-xs text-yellow-800">Certificações orgânicas</p>
                            </div>
                            <div className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1 flex-shrink-0"></div>
                              <p className="text-xs text-yellow-800">Parcerias com fornecedores sustentáveis</p>
                            </div>
                            <div className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1 flex-shrink-0"></div>
                              <p className="text-xs text-yellow-800">Marketing focado em sustentabilidade</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Serviços Adicionais */}
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg border border-purple-200 p-4 shadow-sm">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Users className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1">Serviços Pet Care</h4>
                              <p className="text-xs text-gray-600 mb-3">Banho, tosa, consulta veterinária</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Médio Potencial</span>
                                <span className="text-xs text-gray-500">Receita recorrente</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 p-3">
                          <h5 className="text-xs font-semibold text-purple-900 mb-2">Ações Recomendadas:</h5>
                          <div className="space-y-1">
                            <div className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1 flex-shrink-0"></div>
                              <p className="text-xs text-purple-800">Parcerias com veterinários</p>
                            </div>
                            <div className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1 flex-shrink-0"></div>
                              <p className="text-xs text-purple-800">Espaço dedicado na loja</p>
                            </div>
                            <div className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1 flex-shrink-0"></div>
                              <p className="text-xs text-purple-800">Sistema de agendamento online</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Oportunidades Tecnológicas */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Monitor className="w-5 h-5 mr-2 text-gray-600" />
                      Tecnologia & Inovação
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* App Mobile */}
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg border border-indigo-200 p-4 shadow-sm">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Monitor className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1">App Mobile</h4>
                              <p className="text-xs text-gray-600 mb-3">Fidelização e compras recorrentes</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">Alto Potencial</span>
                                <span className="text-xs text-gray-500">Engajamento +60%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200 p-3">
                          <h5 className="text-xs font-semibold text-indigo-900 mb-2">Ações Recomendadas:</h5>
                          <div className="space-y-1">
                            <div className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1 flex-shrink-0"></div>
                              <p className="text-xs text-indigo-800">Programa de fidelidade integrado</p>
                            </div>
                            <div className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1 flex-shrink-0"></div>
                              <p className="text-xs text-indigo-800">Notificações personalizadas</p>
                            </div>
                            <div className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1 flex-shrink-0"></div>
                              <p className="text-xs text-indigo-800">Compra com um clique</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Automação */}
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg border border-teal-200 p-4 shadow-sm">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Zap className="w-4 h-4 text-teal-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1">Automação de Processos</h4>
                              <p className="text-xs text-gray-600 mb-3">Redução de custos operacionais</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded-full">Médio Potencial</span>
                                <span className="text-xs text-gray-500">Economia: 30%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200 p-3">
                          <h5 className="text-xs font-semibold text-teal-900 mb-2">Ações Recomendadas:</h5>
                          <div className="space-y-1">
                            <div className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-1 flex-shrink-0"></div>
                              <p className="text-xs text-teal-800">ERP integrado completo</p>
                            </div>
                            <div className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-1 flex-shrink-0"></div>
                              <p className="text-xs text-teal-800">Automação de estoque</p>
                            </div>
                            <div className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-1 flex-shrink-0"></div>
                              <p className="text-xs text-teal-800">Chatbot para atendimento</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Seção de Cenários */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Cenários</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cenário Otimista */}
            <div className="bg-white rounded-lg border border-green-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold text-gray-900">Cenário Otimista</h3>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-green-800 mb-2">Crescimento de Receita: +35%</p>
                  <p className="text-xs text-green-700">Expansão para 3 novas regiões e aumento da base de clientes</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Receita Projetada:</span>
                    <span className="font-medium text-green-600">R$ 1,62M</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">EBITDA:</span>
                    <span className="font-medium text-green-600">R$ 324K (20%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Valuation:</span>
                    <span className="font-medium text-green-600">R$ 3,5M</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-green-100">
                  <p className="text-xs text-gray-600">
                    <strong>Fatores-chave:</strong> Lançamento de linha premium, parcerias estratégicas, marketing digital eficaz
                  </p>
                </div>
              </div>
            </div>

            {/* Cenário Realista */}
            <div className="bg-white rounded-lg border border-blue-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold text-gray-900">Cenário Realista</h3>
                <BarChart3 className="w-5 h-5 text-blue-500" />
              </div>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-blue-800 mb-2">Crescimento de Receita: +18%</p>
                  <p className="text-xs text-blue-700">Crescimento orgânico sustentável com base atual</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Receita Projetada:</span>
                    <span className="font-medium text-blue-600">R$ 1,42M</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">EBITDA:</span>
                    <span className="font-medium text-blue-600">R$ 284K (20%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Valuation:</span>
                    <span className="font-medium text-blue-600">R$ 3,1M</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-blue-100">
                  <p className="text-xs text-gray-600">
                    <strong>Fatores-chave:</strong> Manutenção da qualidade, fidelização de clientes, otimização operacional
                  </p>
                </div>
              </div>
            </div>

            {/* Cenário Pessimista */}
            <div className="bg-white rounded-lg border border-red-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold text-gray-900">Cenário Pessimista</h3>
                <TrendingDown className="w-5 h-5 text-red-500" />
              </div>
              <div className="space-y-4">
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-red-800 mb-2">Crescimento de Receita: -5%</p>
                  <p className="text-xs text-red-700">Impacto da concorrência e pressão de preços</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Receita Projetada:</span>
                    <span className="font-medium text-red-600">R$ 1,14M</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">EBITDA:</span>
                    <span className="font-medium text-red-600">R$ 171K (15%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Valuation:</span>
                    <span className="font-medium text-red-600">R$ 2,3M</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-red-100">
                  <p className="text-xs text-gray-600">
                    <strong>Fatores-chave:</strong> Entrada de grandes concorrentes, crise econômica, perda de fornecedores
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Probabilidades dos Cenários */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Probabilidade dos Cenários</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '25%'}}></div>
                </div>
                <p className="text-xs text-gray-600">Otimista: 25%</p>
              </div>
              <div className="text-center">
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '55%'}}></div>
                </div>
                <p className="text-xs text-gray-600">Realista: 55%</p>
              </div>
              <div className="text-center">
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{width: '20%'}}></div>
                </div>
                <p className="text-xs text-gray-600">Pessimista: 20%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Header de Objetivos e Metas */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Objetivos e Metas</h1>
            <p className="text-sm text-gray-500">Definição e acompanhamento de objetivos operacionais, comerciais e financeiros da empresa.</p>
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
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Visão Geral da Empresa</h3>
              <p className="text-gray-600">
                Esta seção apresenta uma visão geral completa da empresa, incluindo informações corporativas, 
                métricas financeiras principais e análise de riscos. Use as abas acima para navegar entre 
                diferentes aspectos da análise empresarial.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'financeiro' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise Financeira</h3>
              <p className="text-gray-600">
                Análise detalhada dos indicadores financeiros, incluindo rentabilidade, liquidez, 
                endividamento e análise de investimentos.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'riscos' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestão de Riscos & Compliance</h3>
              <p className="text-gray-600">
                Identificação e análise dos principais riscos empresariais, incluindo riscos de mercado, 
                fiscais e financeiros, com estratégias de mitigação.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SLA & Qualidade</h3>
              <p className="text-gray-600">
                Monitoramento de indicadores de qualidade, SLA e satisfação do cliente, 
                garantindo excelência operacional.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'metas' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Metas & Objetivos</h3>
              <p className="text-gray-600">
                Definição e acompanhamento de metas estratégicas, objetivos de crescimento 
                e indicadores de performance.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modal do Questionário */}
      {questionarioModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header da Modal */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Questionário Estratégico - Concorrência</h3>
                    <p className="text-sm text-gray-500">4 perguntas • Tempo estimado: 3-5 minutos</p>
                  </div>
                </div>
                <button 
                  onClick={() => setQuestionarioModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>

              {/* Conteúdo do Questionário */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-purple-800 mb-3">1. Quem são nossos 3 principais concorrentes diretos?</p>
                    <textarea 
                      className="w-full p-3 text-sm border border-purple-200 rounded-md resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                      rows={3}
                      placeholder="Ex: Pet Shop Premium, Ração & Cia, Animal Center..."
                    />
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-purple-800 mb-3">2. Qual nosso principal diferencial competitivo?</p>
                    <textarea 
                      className="w-full p-3 text-sm border border-purple-200 rounded-md resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                      rows={3}
                      placeholder="Ex: Atendimento consultivo, produtos premium..."
                    />
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-purple-800 mb-3">3. Em que aspectos perdemos para a concorrência?</p>
                    <textarea 
                      className="w-full p-3 text-sm border border-purple-200 rounded-md resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                      rows={3}
                      placeholder="Ex: Preço, localização, marketing digital..."
                    />
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-purple-800 mb-3">4. Quais ameaças competitivas mais nos preocupam?</p>
                    <textarea 
                      className="w-full p-3 text-sm border border-purple-200 rounded-md resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                      rows={3}
                      placeholder="Ex: Entrada de grandes redes, guerra de preços..."
                    />
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <button 
                    onClick={() => setQuestionarioModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors">
                      Salvar Rascunho
                    </button>
                    <button className="px-6 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
                      Gerar SWOT de Concorrência
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}