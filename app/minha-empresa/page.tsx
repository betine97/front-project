'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Plus, 
  Target, 
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
import { AnaliseSwotComponent } from '../../components/minha-empresa/AnaliseSwotComponent';

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
  const [activeTab, setActiveTab] = useState<'operacao' | 'comercial' | 'financeiro'>('operacao');
  const [selectedPeriodo, setSelectedPeriodo] = useState('12m');
  const [swotExpanded, setSwotExpanded] = useState(false);
  const [riscosExpanded, setRiscosExpanded] = useState(false);
  const [forcasExpanded, setForcasExpanded] = useState(false);
  const [fraquezasExpanded, setFraquezasExpanded] = useState(false);
  const [oportunidadesExpanded, setOportunidadesExpanded] = useState(false);
  const [questionarioModalOpen, setQuestionarioModalOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="p-6 w-full min-w-0">
        {/* Sobre a Empresa */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Sobre a Empresa</h2>
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
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

            {/* KPIs Principais da Empresa */}
            <div className="xl:col-span-2 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-md font-semibold text-gray-900 mb-4">KPIs Principais da Empresa</h3>
              
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                {/* Receita Anual */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Receita Anual</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">R$ 1,2M</div>
                  <div className="text-xs text-green-600 font-medium">+18% YoY</div>
                </div>

                {/* EBITDA */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-gray-500 uppercase tracking-wide">EBITDA</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">R$ 240K</div>
                  <div className="text-xs text-blue-600 font-medium">20% margem</div>
                </div>

                {/* Clientes */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Clientes Ativos</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">2.847</div>
                  <div className="text-xs text-purple-600 font-medium">+156 este mês</div>
                </div>

                {/* Market Share */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-4 h-4 text-orange-600" />
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Market Share</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">8,7%</div>
                  <div className="text-xs text-orange-600 font-medium">Região SP</div>
                </div>

                {/* NPS Score */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="w-4 h-4 text-yellow-600" />
                    <span className="text-xs text-gray-500 uppercase tracking-wide">NPS Score</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">72</div>
                  <div className="text-xs text-yellow-600 font-medium">Excelente</div>
                </div>
              </div>
            </div>
          </div>
        </div>
   
     {/* Seção de Análise SWOT */}
        <div className="mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            {/* Header da seção com botão expandir */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Análise SWOT</h2>
                <p className="text-sm text-gray-600">
                  Responda o questionário abaixo para montar sua análise SWOT
                </p>
              </div>
              
              {/* Botão Expandir */}
              <button
                onClick={() => setSwotExpanded(!swotExpanded)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                <span className="text-sm font-medium text-gray-700">
                  {swotExpanded ? 'Recolher' : 'Expandir'}
                </span>
                {swotExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>
            
            {/* Componente de Análise SWOT sempre visível */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col xl:flex-row items-start gap-6">
                <div className="flex-shrink-0">
                  <AnaliseSwotComponent />
                </div>
                
                {/* Totais SWOT alinhados à esquerda */}
                <div className="flex flex-wrap gap-3 items-start">
                  {/* Forças */}
                  <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm min-w-[100px]">
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">18</div>
                      <div className="text-xs text-gray-600">Forças</div>
                    </div>
                  </div>
                  
                  {/* Fraquezas */}
                  <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm min-w-[100px]">
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">12</div>
                      <div className="text-xs text-gray-600">Fraquezas</div>
                    </div>
                  </div>
                  
                  {/* Oportunidades */}
                  <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm min-w-[100px]">
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">19</div>
                      <div className="text-xs text-gray-600">Oportunidades</div>
                    </div>
                  </div>
                  
                  {/* Riscos */}
                  <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm min-w-[100px]">
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">13</div>
                      <div className="text-xs text-gray-600">Riscos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Conteúdo Expansível */}
            {swotExpanded && (
              <div className="mt-8 space-y-8">
                {/* Riscos Identificados */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Riscos Identificados</h3>
                  
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    {/* Métricas de Riscos e Botão Expandir na mesma linha */}
                    <div className="flex items-center justify-between mb-6">
                      {/* Métricas de Riscos */}
                      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 flex-1 mr-6">
                        <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-800">Riscos Graves</span>
                            <AlertTriangle className="w-3 h-3 text-orange-500" />
                          </div>
                          <div className="text-xl font-bold text-orange-600">4</div>
                          <div className="text-xs text-gray-600">Críticos</div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-800">Riscos Moderados</span>
                            <AlertTriangle className="w-3 h-3 text-orange-500" />
                          </div>
                          <div className="text-xl font-bold text-orange-600">6</div>
                          <div className="text-xs text-gray-600">Moderados</div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-800">Riscos Fracos</span>
                            <AlertTriangle className="w-3 h-3 text-orange-500" />
                          </div>
                          <div className="text-xl font-bold text-orange-600">3</div>
                          <div className="text-xs text-gray-600">Controlados</div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-800">Total</span>
                            <AlertTriangle className="w-3 h-3 text-orange-500" />
                          </div>
                          <div className="text-xl font-bold text-orange-600">13</div>
                          <div className="text-xs text-gray-600">Mapeados</div>
                        </div>
                      </div>
                      
                      {/* Botão Expandir */}
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

                    {/* Conteúdo Expansível de Riscos */}
                    {riscosExpanded && (
                      <div className="space-y-8">
                        {/* Riscos Operacionais */}
                        <div>
                          <h4 className="text-md font-semibold text-gray-800 mb-4">
                            Operacionais
                          </h4>
                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            {/* Ruptura na Cadeia de Suprimentos */}
                            <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200">
                              <div className="mb-3">
                                <h5 className="text-base font-semibold mb-1.5 text-gray-700">Ruptura na Cadeia de Suprimentos</h5>
                                <p className="text-gray-600 text-xs mb-2">Falta de insumos, atrasos em pedidos</p>
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs font-semibold bg-orange-500 text-white px-2 py-0.5 rounded-full">Alto Risco</span>
                                  <span className="text-base font-bold text-gray-900">40%</span>
                                </div>
                              </div>
                              
                              <div className="border-t border-gray-200 pt-3">
                                <h6 className="text-xs font-medium mb-2 text-gray-600">Ações de Mitigação:</h6>
                                <div className="space-y-1.5">
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-700">Diversificar fornecedores</p>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-700">Estoque de segurança</p>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-700">Contratos com cláusula de entrega rápida</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Falha de Equipamentos */}
                            <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200">
                              <div className="mb-3">
                                <h5 className="text-base font-semibold mb-1.5 text-gray-700">Falha de Equipamentos / TI Crítico</h5>
                                <p className="text-gray-600 text-xs mb-2">Paralisa a expedição e vendas on-line</p>
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs font-semibold bg-orange-500 text-white px-2 py-0.5 rounded-full">Médio Risco</span>
                                  <span className="text-base font-bold text-gray-900">25%</span>
                                </div>
                              </div>
                              
                              <div className="border-t border-gray-200 pt-3">
                                <h6 className="text-xs font-medium mb-2 text-gray-600">Ações de Mitigação:</h6>
                                <div className="space-y-1.5">
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-700">Manutenção preventiva</p>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-700">Peças de reposição em estoque</p>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-700">SLA claro com suporte externo</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Riscos Tecnológicos / Cibernéticos */}
                        <div>
                          <h4 className="text-md font-semibold text-gray-800 mb-4">
                            Tecnológico / Cibernético
                          </h4>
                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            {/* Ataque Ransomware */}
                            <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200">
                              <div className="mb-3">
                                <h5 className="text-base font-semibold mb-1.5 text-gray-700">Ataque Ransomware</h5>
                                <p className="text-gray-600 text-xs mb-2">Perda de dados, parada de operações</p>
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs font-semibold bg-orange-500 text-white px-2 py-0.5 rounded-full">Baixo Risco</span>
                                  <span className="text-base font-bold text-gray-900">15%</span>
                                </div>
                              </div>
                              
                              <div className="border-t border-gray-200 pt-4">
                                <h6 className="text-sm font-medium mb-3 text-gray-600">Ações de Mitigação:</h6>
                                <div className="space-y-2">
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-sm text-gray-700">Backups diários offline</p>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-sm text-gray-700">Antivírus + EDR</p>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-sm text-gray-700">Treino de phishing para equipe</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Downtime do ERP */}
                            <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200">
                              <div className="mb-3">
                                <h5 className="text-base font-semibold mb-1.5 text-gray-700">Downtime do ERP / Loja Virtual</h5>
                                <p className="text-gray-600 text-xs mb-2">Perda de vendas, insatisfação de clientes</p>
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs font-semibold bg-orange-500 text-white px-2 py-0.5 rounded-full">Médio Risco</span>
                                  <span className="text-base font-bold text-gray-900">30%</span>
                                </div>
                              </div>
                              
                              <div className="border-t border-gray-200 pt-4">
                                <h6 className="text-sm font-medium mb-3 text-gray-600">Ações de Mitigação:</h6>
                                <div className="space-y-2">
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-sm text-gray-700">Alta disponibilidade (cloud)</p>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-sm text-gray-700">Monitoramento 24/7</p>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-sm text-gray-700">Plano de contingência manual</p>
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
                
                {/* Forças Identificadas */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Forças Identificadas</h3>
                  
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    {/* Métricas de Forças e Botão Expandir na mesma linha */}
                    <div className="flex items-center justify-between mb-6">
                      {/* Métricas de Forças */}
                      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 flex-1 mr-6">
                        <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-800">Forças Críticas</span>
                            <AlertTriangle className="w-3 h-3 text-orange-500" />
                          </div>
                          <div className="text-xl font-bold text-orange-600">6</div>
                          <div className="text-xs text-gray-600">Essenciais</div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-800">Forças Moderadas</span>
                            <AlertTriangle className="w-3 h-3 text-orange-500" />
                          </div>
                          <div className="text-xl font-bold text-orange-600">8</div>
                          <div className="text-xs text-gray-600">Importantes</div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-800">Forças Menores</span>
                            <AlertTriangle className="w-3 h-3 text-orange-500" />
                          </div>
                          <div className="text-xl font-bold text-orange-600">4</div>
                          <div className="text-xs text-gray-600">Complementares</div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-800">Total</span>
                            <AlertTriangle className="w-3 h-3 text-orange-500" />
                          </div>
                          <div className="text-xl font-bold text-orange-600">18</div>
                          <div className="text-xs text-gray-600">Identificadas</div>
                        </div>
                      </div>
                      
                      {/* Botão Expandir */}
                      <button
                        onClick={() => setForcasExpanded(!forcasExpanded)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                      >
                        <span className="text-sm font-medium text-gray-700">
                          {forcasExpanded ? 'Recolher' : 'Expandir'}
                        </span>
                        {forcasExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </div>

                    {/* Conteúdo Expansível de Forças */}
                    {forcasExpanded && (
                      <div className="space-y-8">
                        {/* Forças Competitivas */}
                        <div>
                          <h4 className="text-md font-semibold text-gray-800 mb-4">
                            Competitivas
                          </h4>
                          <div className="flex flex-wrap gap-4 justify-start">
                            {/* Marca Consolidada */}
                            <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200 w-[560px]">
                              <div className="mb-3">
                                <h5 className="text-base font-semibold mb-1.5 text-gray-700">Marca Consolidada no Mercado</h5>
                                <p className="text-gray-600 text-xs mb-2">Reconhecimento e confiança dos clientes</p>
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs font-semibold bg-orange-500 text-white px-2 py-0.5 rounded-full">Força Crítica</span>
                                  <span className="text-base font-bold text-gray-900">95%</span>
                                </div>
                              </div>
                              
                              <div className="border-t border-gray-200 pt-3">
                                <h6 className="text-xs font-medium mb-2 text-gray-600">Como Potencializar:</h6>
                                <div className="space-y-1.5">
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-700">Investir em marketing digital</p>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-700">Programa de fidelidade</p>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-700">Parcerias estratégicas</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Equipe Especializada */}
                            <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200 w-[560px]">
                              <div className="mb-3">
                                <h5 className="text-base font-semibold mb-1.5 text-gray-700">Equipe Especializada</h5>
                                <p className="text-gray-600 text-xs mb-2">Conhecimento técnico em produtos pet</p>
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs font-semibold bg-orange-500 text-white px-2 py-0.5 rounded-full">Força Crítica</span>
                                  <span className="text-base font-bold text-gray-900">88%</span>
                                </div>
                              </div>
                              
                              <div className="border-t border-gray-200 pt-3">
                                <h6 className="text-xs font-medium mb-2 text-gray-600">Como Potencializar:</h6>
                                <div className="space-y-1.5">
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-700">Treinamentos contínuos</p>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-700">Certificações especializadas</p>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-700">Programa de incentivos</p>
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

                {/* Fraquezas Identificadas */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Fraquezas Identificadas</h3>
                  
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    {/* Métricas de Fraquezas e Botão Expandir na mesma linha */}
                    <div className="flex items-center justify-between mb-6">
                      {/* Métricas de Fraquezas */}
                      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 flex-1 mr-6">
                        <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-800">Fraquezas Críticas</span>
                            <AlertTriangle className="w-3 h-3 text-orange-500" />
                          </div>
                          <div className="text-xl font-bold text-orange-600">3</div>
                          <div className="text-xs text-gray-600">Urgentes</div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-800">Fraquezas Moderadas</span>
                            <AlertTriangle className="w-3 h-3 text-orange-500" />
                          </div>
                          <div className="text-xl font-bold text-orange-600">5</div>
                          <div className="text-xs text-gray-600">Importantes</div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-800">Fraquezas Menores</span>
                            <AlertTriangle className="w-3 h-3 text-orange-500" />
                          </div>
                          <div className="text-xl font-bold text-orange-600">4</div>
                          <div className="text-xs text-gray-600">Controláveis</div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-800">Total</span>
                            <AlertTriangle className="w-3 h-3 text-orange-500" />
                          </div>
                          <div className="text-xl font-bold text-orange-600">12</div>
                          <div className="text-xs text-gray-600">Identificadas</div>
                        </div>
                      </div>
                      
                      {/* Botão Expandir */}
                      <button
                        onClick={() => setFraquezasExpanded(!fraquezasExpanded)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                      >
                        <span className="text-sm font-medium text-gray-700">
                          {fraquezasExpanded ? 'Recolher' : 'Expandir'}
                        </span>
                        {fraquezasExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </div>

                    {/* Conteúdo Expansível de Fraquezas */}
                    {fraquezasExpanded && (
                      <div className="space-y-8">
                        {/* Fraquezas Tecnológicas */}
                        <div>
                          <h4 className="text-md font-semibold text-gray-800 mb-4">
                            Tecnológicas
                          </h4>
                          <div className="flex flex-wrap gap-4 justify-start">
                            {/* Sistema Desatualizado */}
                            <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200 w-[560px]">
                              <div className="mb-3">
                                <h5 className="text-base font-semibold mb-1.5 text-gray-700">Sistema de Gestão Desatualizado</h5>
                                <p className="text-gray-600 text-xs mb-2">Processos manuais e ineficientes</p>
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs font-semibold bg-orange-500 text-white px-2 py-0.5 rounded-full">Fraqueza Crítica</span>
                                  <span className="text-base font-bold text-gray-900">75%</span>
                                </div>
                              </div>
                              
                              <div className="border-t border-gray-200 pt-3">
                                <h6 className="text-xs font-medium mb-2 text-gray-600">Plano de Melhoria:</h6>
                                <div className="space-y-1.5">
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-700">Implementar ERP moderno</p>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-700">Automatizar processos</p>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-700">Treinamento da equipe</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Presença Digital Limitada */}
                            <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200 w-[560px]">
                              <div className="mb-3">
                                <h5 className="text-base font-semibold mb-1.5 text-gray-700">Presença Digital Limitada</h5>
                                <p className="text-gray-600 text-xs mb-2">Baixa visibilidade online</p>
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs font-semibold bg-orange-500 text-white px-2 py-0.5 rounded-full">Fraqueza Crítica</span>
                                  <span className="text-base font-bold text-gray-900">68%</span>
                                </div>
                              </div>
                              
                              <div className="border-t border-gray-200 pt-3">
                                <h6 className="text-xs font-medium mb-2 text-gray-600">Plano de Melhoria:</h6>
                                <div className="space-y-1.5">
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-700">Desenvolver e-commerce</p>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-700">Estratégia de redes sociais</p>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-700">SEO e marketing digital</p>
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
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Oportunidades Identificadas</h3>
                  
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      {/* Métricas de Oportunidades */}
                      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 flex-1 mr-6">
                        <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-800">Alto Potencial</span>
                            <TrendingUp className="w-3 h-3 text-orange-500" />
                          </div>
                          <div className="text-xl font-bold text-orange-600">5</div>
                          <div className="text-xs text-gray-600">Estratégicas</div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-800">Médio Potencial</span>
                            <TrendingUp className="w-3 h-3 text-orange-500" />
                          </div>
                          <div className="text-xl font-bold text-orange-600">8</div>
                          <div className="text-xs text-gray-600">Táticas</div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-800">Curto Prazo</span>
                            <TrendingUp className="w-3 h-3 text-orange-500" />
                          </div>
                          <div className="text-xl font-bold text-orange-600">6</div>
                          <div className="text-xs text-gray-600">Rápidas</div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-800">Total</span>
                            <TrendingUp className="w-3 h-3 text-orange-500" />
                          </div>
                          <div className="text-xl font-bold text-orange-600">19</div>
                          <div className="text-xs text-gray-600">Mapeadas</div>
                        </div>
                      </div>
                      
                      {/* Botão Expandir */}
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

                    {/* Conteúdo Expansível de Oportunidades */}
                    {oportunidadesExpanded && (
                      <div className="space-y-8">
                        {/* Oportunidades de Mercado */}
                        <div>
                          <h4 className="text-md font-semibold text-gray-800 mb-4">
                            Mercado & Expansão
                          </h4>
                          <div className="flex flex-wrap gap-4 justify-start">
                            {/* E-commerce */}
                            <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200 w-[560px]">
                              <div className="mb-3">
                                <h5 className="text-base font-semibold mb-1.5 text-gray-700">Expansão E-commerce</h5>
                                <p className="text-gray-600 text-xs mb-2">Mercado online representa 40% do setor pet</p>
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs font-semibold bg-orange-500 text-white px-2 py-0.5 rounded-full">Alto Potencial</span>
                                  <span className="text-base font-bold text-gray-900">ROI: 250%</span>
                                </div>
                              </div>
                              
                              <div className="border-t border-gray-200 pt-3">
                                <h6 className="text-xs font-medium mb-2 text-gray-600">Ações Recomendadas:</h6>
                                <div className="space-y-1.5">
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-700">Desenvolver loja virtual completa</p>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-700">Integrar com marketplaces</p>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-700">Sistema de entrega próprio</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Expansão Geográfica */}
                            <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200 w-[560px]">
                              <div className="mb-3">
                                <h5 className="text-base font-semibold mb-1.5 text-gray-700">Expansão Geográfica</h5>
                                <p className="text-gray-600 text-xs mb-2">3 cidades vizinhas sem concorrência direta</p>
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs font-semibold bg-orange-500 text-white px-2 py-0.5 rounded-full">Médio Potencial</span>
                                  <span className="text-base font-bold text-gray-900">ROI: 180%</span>
                                </div>
                              </div>
                              
                              <div className="border-t border-gray-200 pt-3">
                                <h6 className="text-xs font-medium mb-2 text-gray-600">Ações Recomendadas:</h6>
                                <div className="space-y-1.5">
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-700">Pesquisa de mercado detalhada</p>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-700">Parcerias locais estratégicas</p>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-700">Modelo de franquia</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Oportunidades de Produto */}
                        <div>
                          <h4 className="text-md font-semibold text-gray-800 mb-4">
                            Produtos & Serviços
                          </h4>
                          <div className="flex flex-wrap gap-4 justify-start">
                            {/* Linha Super Premium */}
                            <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200 w-[560px]">
                              <div className="mb-3">
                                <h5 className="text-base font-semibold mb-1.5 text-gray-700">Linha Super Premium</h5>
                                <p className="text-gray-600 text-xs mb-2">Produtos orgânicos e sustentáveis</p>
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs font-semibold bg-orange-500 text-white px-2 py-0.5 rounded-full">Alto Potencial</span>
                                  <span className="text-base font-bold text-gray-900">Margem: 45%</span>
                                </div>
                              </div>
                              
                              <div className="border-t border-gray-200 pt-3">
                                <h6 className="text-xs font-medium mb-2 text-gray-600">Ações Recomendadas:</h6>
                                <div className="space-y-1.5">
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-700">Certificações orgânicas</p>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-700">Parcerias com fornecedores sustentáveis</p>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-700">Marketing focado em sustentabilidade</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Serviços Pet Care */}
                            <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200 w-[560px]">
                              <div className="mb-3">
                                <h5 className="text-base font-semibold mb-1.5 text-gray-700">Serviços Pet Care</h5>
                                <p className="text-gray-600 text-xs mb-2">Banho, tosa, consulta veterinária</p>
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs font-semibold bg-orange-500 text-white px-2 py-0.5 rounded-full">Médio Potencial</span>
                                  <span className="text-base font-bold text-gray-900">Receita recorrente</span>
                                </div>
                              </div>
                              
                              <div className="border-t border-gray-200 pt-3">
                                <h6 className="text-xs font-medium mb-2 text-gray-600">Ações Recomendadas:</h6>
                                <div className="space-y-1.5">
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-700">Parcerias com veterinários</p>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-700">Espaço dedicado na loja</p>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-700">Sistema de agendamento online</p>
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
            )}
          </div>
        </div> 
        {/* Seção de Objetivos e Metas */}
        <div className="mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            {/* Header de Objetivos e Metas */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Objetivos e Metas</h2>
                <p className="text-sm text-gray-600">Definição e acompanhamento de objetivos operacionais, comerciais e financeiros da empresa.</p>
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

            {/* Tabs de Navegação */}
            <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
              <button
                onClick={() => setActiveTab('operacao')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'operacao'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Operação
              </button>
              <button
                onClick={() => setActiveTab('comercial')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'comercial'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Comercial
              </button>
              <button
                onClick={() => setActiveTab('financeiro')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'financeiro'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Financeiro
              </button>
            </div>

            {/* Conteúdo das Tabs */}
            {activeTab === 'operacao' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricCard
                  title="Eficiência Operacional"
                  value={87.5}
                  format="percentage"
                  icon={Activity}
                  color="blue"
                  trend="up"
                  trendValue="+5.2%"
                  status="good"
                />
                <MetricCard
                  title="Tempo Médio de Entrega"
                  value={2.3}
                  format="days"
                  icon={Clock}
                  color="orange"
                  trend="down"
                  trendValue="-0.5 dias"
                  status="good"
                />
                <MetricCard
                  title="Taxa de Defeitos"
                  value={0.8}
                  format="percentage"
                  icon={AlertTriangle}
                  color="red"
                  trend="down"
                  trendValue="-0.2%"
                  status="good"
                />
              </div>
            )}

            {activeTab === 'comercial' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricCard
                  title="Taxa de Conversão"
                  value={12.8}
                  format="percentage"
                  icon={Target}
                  color="green"
                  trend="up"
                  trendValue="+2.1%"
                  status="good"
                />
                <MetricCard
                  title="Ticket Médio"
                  value={156.50}
                  format="currency"
                  icon={DollarSign}
                  color="blue"
                  trend="up"
                  trendValue="+R$ 12"
                  status="good"
                />
                <MetricCard
                  title="CAC (Custo de Aquisição)"
                  value={45.20}
                  format="currency"
                  icon={Users}
                  color="orange"
                  trend="down"
                  trendValue="-R$ 8"
                  status="good"
                />
              </div>
            )}

            {activeTab === 'financeiro' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricCard
                  title="Margem Bruta"
                  value={35.2}
                  format="percentage"
                  icon={BarChart3}
                  color="green"
                  trend="up"
                  trendValue="+1.8%"
                  status="good"
                />
                <MetricCard
                  title="ROI"
                  value={2.4}
                  format="multiplier"
                  icon={TrendingUp}
                  color="blue"
                  trend="up"
                  trendValue="+0.3x"
                  status="good"
                />
                <MetricCard
                  title="Fluxo de Caixa"
                  value={125000}
                  format="currency"
                  icon={Wallet}
                  color="orange"
                  trend="up"
                  trendValue="+15%"
                  status="good"
                />
              </div>
            )}

            {/* Componente de Cenários */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Cenários Futuros</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cenário Otimista */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <h4 className="text-md font-semibold text-green-800">Cenário Otimista</h4>
                    </div>
                    <span className="text-xs font-semibold bg-green-500 text-white px-2 py-1 rounded-full">+35%</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-700">Receita Projetada:</span>
                      <span className="text-sm font-bold text-green-800">R$ 1,62M</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-700">EBITDA:</span>
                      <span className="text-sm font-bold text-green-800">R$ 324K</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-700">Valuation:</span>
                      <span className="text-sm font-bold text-green-800">R$ 3,5M</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-green-300">
                    <p className="text-xs text-green-600">
                      Expansão para 3 novas regiões, linha premium consolidada, parcerias estratégicas
                    </p>
                  </div>
                </div>

                {/* Cenário Realista */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <h4 className="text-md font-semibold text-blue-800">Cenário Realista</h4>
                    </div>
                    <span className="text-xs font-semibold bg-blue-500 text-white px-2 py-1 rounded-full">+18%</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-700">Receita Projetada:</span>
                      <span className="text-sm font-bold text-blue-800">R$ 1,42M</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-700">EBITDA:</span>
                      <span className="text-sm font-bold text-blue-800">R$ 284K</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-700">Valuation:</span>
                      <span className="text-sm font-bold text-blue-800">R$ 3,1M</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-blue-300">
                    <p className="text-xs text-blue-600">
                      Crescimento orgânico sustentável, foco em qualidade e fidelização de clientes
                    </p>
                  </div>
                </div>

                {/* Cenário Pessimista */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <h4 className="text-md font-semibold text-orange-800">Cenário Pessimista</h4>
                    </div>
                    <span className="text-xs font-semibold bg-orange-500 text-white px-2 py-1 rounded-full">-5%</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-orange-700">Receita Projetada:</span>
                      <span className="text-sm font-bold text-orange-800">R$ 1,14M</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-orange-700">EBITDA:</span>
                      <span className="text-sm font-bold text-orange-800">R$ 171K</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-orange-700">Valuation:</span>
                      <span className="text-sm font-bold text-orange-800">R$ 2,3M</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-orange-300">
                    <p className="text-xs text-orange-600">
                      Impacto da concorrência, pressão de preços, perda de fornecedores chave
                    </p>
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
                      <div className="bg-orange-500 h-2 rounded-full" style={{width: '20%'}}></div>
                    </div>
                    <p className="text-xs text-gray-600">Pessimista: 20%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
