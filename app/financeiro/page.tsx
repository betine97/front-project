'use client';

import React, { useState } from 'react';
import { 
  DollarSign, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  BarChart3, 
  Calculator,
  Activity,
  Wallet,
  CreditCard,
  Target,
  Droplets,
  PieChart,
  Calendar,
  Filter,
  Eye,
  Edit,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { AnaliseFinanceiraComponent } from '../../components/financeiro/AnaliseFinanceira';
import { GraficoFluxoCaixa } from '../../components/financeiro/GraficoFluxoCaixa';
import { GraficoMargens } from '../../components/financeiro/GraficoMargens';
import { GraficoBreakEven } from '../../components/financeiro/GraficoBreakEven';
import { Tooltip } from '../../components/ui/Tooltip';
import { MovimentacaoFinanceira, ContaPagarReceber, Movimentacao } from '../../types/entities';
import { MESSAGES } from '../../constants/index';
import { formatCurrency } from '../../lib/utils';
import { useContasPagarReceber, useMovimentacoes } from '../../hooks/useContasPagarReceber';
import { useFaturamento, useFluxoCaixa, useLiquidezCorrente, useMargens } from '../../hooks/useMetricasFinanceiras';

export default function FinanceiroPage() {
  // Estados locais para UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showModal, setShowModal] = useState(false);
  const [editingMovimentacao, setEditingMovimentacao] = useState<MovimentacaoFinanceira | null>(null);
  const [selectedMovimentacao, setSelectedMovimentacao] = useState<Movimentacao | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [activeFinanceTab, setActiveFinanceTab] = useState<'movimentacoes' | 'pagar-receber'>('pagar-receber');
  const [selectedPeriodo, setSelectedPeriodo] = useState('mes');

  // Hooks para buscar dados da API
  const { contas, loading, error, refetch } = useContasPagarReceber();
  const { movimentacoes, loading: loadingMovimentacoes, error: errorMovimentacoes, refetch: refetchMovimentacoes } = useMovimentacoes();
  const { faturamento, loading: loadingFaturamento } = useFaturamento();
  const { fluxoCaixa, loading: loadingFluxoCaixa } = useFluxoCaixa();
  const { liquidezCorrente, loading: loadingLiquidez } = useLiquidezCorrente();
  const { margens, loading: loadingMargens } = useMargens();

  // Filtrar dados baseado nos filtros selecionados para contas a pagar/receber
  const contasFiltradas = contas.filter(conta => {
    const matchesSearch = !searchTerm || 
      conta.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conta.id_cliente_fornecedor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTipo = !selectedTipo || 
      (selectedTipo === 'receita' && conta.tipo_conta === 'Receber') ||
      (selectedTipo === 'despesa' && conta.tipo_conta === 'Pagar');
    
    const matchesStatus = !selectedStatus || 
      conta.status.toLowerCase() === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesTipo && matchesStatus;
  });

  // Filtrar dados baseado nos filtros selecionados para movimentações
  const movimentacoesFiltradas = movimentacoes.filter(mov => {
    const matchesSearch = !searchTerm || 
      mov.descricao_movimentacao.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTipo = !selectedTipo || 
      (selectedTipo === 'receita' && mov.tipo_transacao === 'Recebimento') ||
      (selectedTipo === 'despesa' && mov.tipo_transacao === 'Pagamento');
    
    const matchesStatus = !selectedStatus || 
      mov.status_transacao.toLowerCase() === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesTipo && matchesStatus;
  });

  // Dados ativos baseados na aba selecionada
  const dadosAtivos = activeFinanceTab === 'pagar-receber' ? contasFiltradas : movimentacoesFiltradas;
  const total = dadosAtivos.length;
  const totalPages = Math.ceil(total / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const dadosPaginados = dadosAtivos.slice(startIndex, startIndex + itemsPerPage);

  // Dados para gráficos (valores nulos por enquanto)
  const movimentacoesParaGraficos = contas;
  
  // Busca em tempo real
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handler para mudança de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Listas únicas para filtros
  const tipos = Array.from(new Set(contas.map(c => c.tipo_conta))).filter(Boolean);
  const status = Array.from(new Set(contas.map(c => c.status))).filter(Boolean);

  // Handlers
  const handleCreateMovimentacao = () => {
    setEditingMovimentacao(null);
    setShowModal(true);
  };

  const handleEditMovimentacao = (movimentacao: Movimentacao) => {
    setEditingMovimentacao(movimentacao as any);
    setShowModal(true);
  };

  const handleDeleteMovimentacao = async (id: number) => {
    if (confirm(MESSAGES.CONFIRM.DELETE)) {
      try {
        // TODO: Implementar deletar movimentação
        console.log('Deletar movimentação:', id);
      } catch (error) {
        console.error('Erro ao excluir movimentação:', error);
      }
    }
  };

  const handleSaveMovimentacao = async (movimentacaoData: Omit<MovimentacaoFinanceira, 'id'>) => {
    try {
      if (editingMovimentacao) {
        // TODO: Implementar atualizar movimentação
        console.log('Atualizar movimentação:', editingMovimentacao.id, movimentacaoData);
      } else {
        // TODO: Implementar criar movimentação
        console.log('Criar movimentação:', movimentacaoData);
      }
      setShowModal(false);
      setEditingMovimentacao(null);
    } catch (error) {
      console.error('Erro ao salvar movimentação:', error);
    }
  };

  const handleViewMovimentacao = (movimentacao: Movimentacao) => {
    setSelectedMovimentacao(movimentacao);
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-full overflow-x-hidden">
        {/* Stats Cards - Estilo ClickUp/Itau */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card-metric-modern min-h-[100px] relative">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric orange">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                {loadingFaturamento ? (
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-20 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(faturamento)}</p>
                    <p className="text-xs text-gray-500">Faturamento</p>
                  </>
                )}
              </div>
            </div>
            <div className="absolute top-3 right-3">
              <Tooltip content="Total de receitas geradas pela empresa no período selecionado. Representa o valor bruto das vendas antes de descontos e impostos." position="bottom">
                <Info className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
              </Tooltip>
            </div>
          </div>

          <div className="card-metric-modern min-h-[80px] relative">
            <div className="flex items-center space-x-3">
              <div className={`icon-container-metric ${fluxoCaixa >= 0 ? 'green' : 'red'}`}>
                <Activity className="w-4 h-4" />
              </div>
              <div>
                {loadingFluxoCaixa ? (
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-20 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                ) : (
                  <>
                    <p className={`text-lg font-bold ${fluxoCaixa >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(fluxoCaixa)}
                    </p>
                    <p className="text-xs text-gray-500">Fluxo de Caixa</p>
                  </>
                )}
              </div>
            </div>
            <div className="absolute top-3 right-3">
              <Tooltip content="Diferença entre entradas e saídas de dinheiro no período. Positivo indica que a empresa está gerando mais caixa do que gastando." position="bottom">
                <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
              </Tooltip>
            </div>
          </div>

          <div className="card-metric-modern min-h-[80px] relative">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric gray">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">R$ 0,00</p>
                <p className="text-xs text-gray-500">Capital de Giro</p>
              </div>
            </div>
            <div className="absolute top-3 right-3">
              <Tooltip content="Recursos disponíveis para financiar as operações diárias da empresa. Calculado como Ativo Circulante menos Passivo Circulante." position="bottom">
                <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
              </Tooltip>
            </div>
          </div>

          <div className="card-metric-modern min-h-[80px] relative">
            <div className="flex items-center space-x-3">
              <div className={`icon-container-metric ${liquidezCorrente >= 1.5 ? 'green' : liquidezCorrente >= 1 ? 'orange' : 'red'}`}>
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                {loadingLiquidez ? (
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-20 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                ) : (
                  <>
                    <p className={`text-lg font-bold ${
                      liquidezCorrente >= 1.5 ? 'text-green-600' : 
                      liquidezCorrente >= 1 ? 'text-orange-600' : 
                      'text-red-600'
                    }`}>
                      {liquidezCorrente.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">Liquidez Corrente</p>
                  </>
                )}
              </div>
            </div>
            <div className="absolute top-3 right-3">
              <Tooltip content="Capacidade da empresa de pagar suas dívidas de curto prazo. Calculada como Ativo Circulante dividido pelo Passivo Circulante. Ideal: acima de 1.5." position="bottom">
                <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
              </Tooltip>
            </div>
          </div>
        </div>   
     {/* Título da Análise e Action Buttons */}
        <div className="flex items-start justify-between mb-6 mt-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Análise Financeira Completa</h2>
            <p className="text-sm text-gray-500">Margens, fluxo de caixa, custos, indicadores de liquidez e performance financeira detalhada.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => console.log('Relatório Financeiro')}
              className="btn-secondary flex items-center space-x-2 text-sm px-4 py-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Relatório</span>
            </button>
            <button
              onClick={handleCreateMovimentacao}
              className="btn-primary flex items-center space-x-2 text-sm px-4 py-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Movimentação</span>
            </button>
          </div>
        </div>

        {/* Filtro de Data */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'hoje', label: 'Hoje' },
              { key: '7d', label: '7 dias' },
              { key: 'mes', label: 'Mês atual' },
              { key: 'proximo-mes', label: 'Próximo mês' },
              { key: 'trimestre', label: 'Trimestre' },
              { key: 'semestre', label: 'Semestre' },
              { key: 'ano', label: 'Ano' }
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
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Período selecionado: {
              selectedPeriodo === 'hoje' ? 'Hoje' :
              selectedPeriodo === '7d' ? '7 dias' :
              selectedPeriodo === 'mes' ? 'Mês atual' :
              selectedPeriodo === 'proximo-mes' ? 'Próximo mês' :
              selectedPeriodo === 'trimestre' ? 'Trimestre' :
              selectedPeriodo === 'semestre' ? 'Semestre' :
              'Ano'
            }</span>
          </div>
        </div>

        {/* Seção de Cards Personalizados */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card One - Margens */}
            <div className="lg:col-span-1 space-y-6">
              <div className="card w-full h-64 flex flex-col" style={{ padding: '16px' }}>
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                  <div className="flex items-center space-x-2">
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      backgroundColor: '#FF6600', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Margens</h3>
                      <p className="text-xs text-gray-500">Bruta, Operacional, Líquida</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-h-0 w-full">
                  <GraficoMargens 
                    margens={margens} 
                    loading={loadingMargens} 
                  />
                </div>
              </div>
              
              <div className="card w-full h-64 flex flex-col" style={{ padding: '16px' }}>
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                  <div className="flex items-center space-x-2">
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      backgroundColor: '#8B5CF6', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <Calculator className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Break Even</h3>
                      <p className="text-xs text-gray-500">Ponto de equilíbrio</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-h-0 w-full">
                  <GraficoBreakEven />
                </div>
              </div>
            </div> 
           {/* Card Two - Lucro Contábil */}
            <div className="lg:col-span-1">
              <div className="card w-full" style={{ padding: '16px', height: '33.5rem' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      backgroundColor: '#28A745', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Lucro Contábil</h3>
                      <p className="text-xs text-gray-500">Receitas - Despesas Totais</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div style={{ 
                      width: '64px', 
                      height: '64px', 
                      backgroundColor: '#F3F4F6', 
                      borderRadius: '16px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      margin: '0 auto 16px' 
                    }}>
                      <TrendingUp className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-500">Dados em breve</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Card Three - Indicadores */}
            <div className="lg:col-span-1">
              <div className="card w-full" style={{ padding: '16px', height: '33.5rem' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      backgroundColor: '#6C757D', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <Droplets className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Liquidez</h3>
                      <p className="text-xs text-gray-500">Corrente, Seca, Imediata</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div style={{ 
                      width: '64px', 
                      height: '64px', 
                      backgroundColor: '#F3F4F6', 
                      borderRadius: '16px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      margin: '0 auto 16px' 
                    }}>
                      <Droplets className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-500">Dados em breve</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>        

        {/* Seção de Metas */}
        <div className="flex items-start justify-between mb-6 mt-12">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Metas Financeiras</h2>
            <p className="text-sm text-gray-500">Acompanhe o progresso das metas financeiras e objetivos estratégicos da empresa.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => console.log('Relatório de Metas')}
              className="btn-secondary flex items-center space-x-2 text-sm px-4 py-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Relatório</span>
            </button>
            <button
              onClick={() => console.log('Nova Meta')}
              className="btn-primary flex items-center space-x-2 text-sm px-4 py-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Meta</span>
            </button>
          </div>
        </div>

        {/* Cards de Metas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">Faturamento Mensal</span>
              </div>
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Em andamento</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-xs text-gray-500">Atual</span>
                <span className="text-lg font-bold text-gray-900">R$ 0,00</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xs text-gray-500">Meta</span>
                <span className="text-sm font-medium text-gray-600">R$ 100.000,00</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">0% concluído</span>
                <span className="text-xs text-gray-500">30 dias restantes</span>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">Margem Bruta</span>
              </div>
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">No prazo</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-xs text-gray-500">Atual</span>
                <span className="text-lg font-bold text-gray-900">0%</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xs text-gray-500">Meta</span>
                <span className="text-sm font-medium text-gray-600">25%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">0% concluído</span>
                <span className="text-xs text-gray-500">trimestral</span>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Droplets className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">Liquidez Corrente</span>
              </div>
              <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Atenção</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-xs text-gray-500">Atual</span>
                <span className="text-lg font-bold text-gray-900">0.0</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xs text-gray-500">Meta</span>
                <span className="text-sm font-medium text-gray-600">1.5</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">0% concluído</span>
                <span className="text-xs text-gray-500">60 dias restantes</span>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">Redução de Custos</span>
              </div>
              <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Planejada</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-xs text-gray-500">Economia</span>
                <span className="text-lg font-bold text-gray-900">R$ 0,00</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xs text-gray-500">Meta</span>
                <span className="text-sm font-medium text-gray-600">R$ 15.000,00</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">0% concluído</span>
                <span className="text-xs text-gray-500">120 dias restantes</span>
              </div>
            </div>
          </div>
        </div>

{/* Seção Análise Financeira Detalhada */}
        <div className="flex items-start justify-between mb-6 mt-12">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Dashboard Financeiro Detalhado</h2>
            <p className="text-sm text-gray-500">Análise completa de margens, custos, liquidez, indicadores de performance e saúde financeira.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => console.log('Dashboard Avançado')}
              className="btn-secondary flex items-center space-x-2 text-sm px-4 py-2"
            >
              <Eye className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => console.log('Exportar DRE')}
              className="btn-primary flex items-center space-x-2 text-sm px-4 py-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>DRE</span>
            </button>
          </div>
        </div>

        {/* Componente de Análise Financeira */}
        <div className="mb-12">
          <AnaliseFinanceiraComponent />
        </div>

        {/* Seção de Movimentações Financeiras */}
        <div className="mt-12">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Movimentações Financeiras</h2>
              <p className="text-sm text-gray-500">Gerencie receitas, despesas e acompanhe todas as movimentações financeiras da empresa.</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setActiveFinanceTab('movimentacoes')}
                className={`btn-secondary flex items-center space-x-2 text-sm px-4 py-2 ${activeFinanceTab === 'movimentacoes' ? 'bg-orange-50 text-orange-600 border-orange-200' : ''}`}
              >
                <Activity className="w-4 h-4" />
                <span>Movimentações</span>
              </button>
              <button
                onClick={() => setActiveFinanceTab('pagar-receber')}
                className={`btn-secondary flex items-center space-x-2 text-sm px-4 py-2 ${activeFinanceTab === 'pagar-receber' ? 'bg-orange-50 text-orange-600 border-orange-200' : ''}`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Contas a Pagar/Receber</span>
              </button>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="w-1/2 max-w-md relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar movimentações..."
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 bg-gray-50 focus:bg-white text-sm"
                    onChange={(e) => handleSearchChange(e.target.value)}
                    value={searchTerm}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors duration-200 text-sm min-w-[140px]"
                    value={selectedTipo}
                    onChange={(e) => setSelectedTipo(e.target.value)}
                  >
                    <option value="">Todos os tipos</option>
                    <option value="receita">Receitas</option>
                    <option value="despesa">Despesas</option>
                  </select>
                  <select
                    className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors duration-200 text-sm min-w-[140px]"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="">Status</option>
                    <option value="pago">Pago</option>
                    <option value="pendente">Pendente</option>
                    <option value="atrasado">Atrasado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                  <select
                    className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors duration-200 text-sm min-w-[140px]"
                    value={selectedCategoria}
                    onChange={(e) => setSelectedCategoria(e.target.value)}
                  >
                    <option value="">Categoria</option>
                    <option value="operacional">Operacional</option>
                    <option value="vendas">Vendas</option>
                    <option value="marketing">Marketing</option>
                    <option value="administrativo">Administrativo</option>
                    <option value="financeiro">Financeiro</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Tabela de Movimentações */}
          {activeFinanceTab === 'movimentacoes' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descrição
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vencimento
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente/Fornecedor
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {movimentacoesFiltradas.slice(startIndex, startIndex + itemsPerPage).length > 0 ? (
                      movimentacoesFiltradas.slice(startIndex, startIndex + itemsPerPage).map((mov) => (
                        <tr key={mov.id_movimentacao} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              mov.tipo_transacao === 'Recebimento' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {mov.tipo_transacao === 'Recebimento' ? 'Receber' : 'Pagar'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{mov.descricao_movimentacao}</div>
                            <div className="text-xs text-gray-500">{mov.tipo_transacao}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm font-medium ${mov.tipo_transacao === 'Recebimento' ? 'text-green-600' : 'text-red-600'}`}>
                              {mov.tipo_transacao === 'Recebimento' ? '+' : '-'}{formatCurrency(Math.abs(Number(mov.valor) || 0))}
                            </div>

                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{new Date(mov.data_movimentacao).toLocaleDateString('pt-BR')}</div>
                            <div className="text-xs text-gray-500">Status: {mov.status_transacao}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              mov.status_transacao === 'Pago' ? 'bg-green-100 text-green-800' : 
                              mov.status_transacao === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : 
                              mov.status_transacao === 'Atrasado' ? 'bg-red-100 text-red-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {mov.status_transacao}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">Conta {mov.id_conta_credito}</div>
                            <div className="text-xs text-gray-500">Débito: {mov.id_conta_debito}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleViewMovimentacao(mov)}
                              className="text-gray-400 hover:text-gray-600 mr-2"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditMovimentacao(mov)}
                              className="text-blue-400 hover:text-blue-600 mr-2"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMovimentacao(mov.id_movimentacao)}
                              className="text-red-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                          Nenhuma movimentação encontrada
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Paginação */}
              {movimentacoesFiltradas.length > 0 && (
                <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, total)} de {total} movimentações
                  </div>
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded-md text-sm ${
                          currentPage === page
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tabela de Contas a Pagar/Receber */}
          {activeFinanceTab === 'pagar-receber' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descrição
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vencimento
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente/Fornecedor
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {contasFiltradas.slice(startIndex, startIndex + itemsPerPage).length > 0 ? (
                      contasFiltradas.slice(startIndex, startIndex + itemsPerPage).map((conta) => (
                        <tr key={conta.id_conta} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              conta.tipo_conta === 'Receber' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {conta.tipo_conta}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{conta.descricao}</div>
                            <div className="text-xs text-gray-500">{conta.tipo_conta}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm font-medium ${conta.tipo_conta === 'Receber' ? 'text-green-600' : 'text-red-600'}`}>
                              {conta.tipo_conta === 'Receber' ? '+' : '-'}{formatCurrency(Math.abs(Number(conta.valor) || 0))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{new Date(conta.data_vencimento).toLocaleDateString('pt-BR')}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              conta.status === 'Pago' ? 'bg-green-100 text-green-800' : 
                              conta.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : 
                              conta.status === 'Atrasado' ? 'bg-red-100 text-red-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {conta.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{conta.nome_cliente_fornecedor}</div>
                            <div className="text-xs text-gray-500">{conta.id_cliente_fornecedor}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              className="text-gray-400 hover:text-gray-600 mr-2"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className="text-blue-400 hover:text-blue-600 mr-2"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              className="text-red-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                          Nenhuma conta a pagar/receber encontrada
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Paginação */}
              {contasFiltradas.length > 0 && (
                <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, total)} de {total} contas
                  </div>
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded-md text-sm ${
                          currentPage === page
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}