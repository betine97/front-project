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
  CheckCircle
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { AnaliseFinanceiraComponent } from '../../components/financeiro/AnaliseFinanceira';
import { MovimentacaoFinanceira, ContaPagarReceber } from '../../types/entities';
import { MESSAGES } from '../../constants/index';
import { formatCurrency } from '../../lib/utils';
import { useContasPagarReceber, useMovimentacoes } from '../../hooks/useContasPagarReceber';
import { useFaturamento, useFluxoCaixa, useLiquidezCorrente } from '../../hooks/useMetricasFinanceiras';

export default function FinanceiroPage() {
  // Estados locais para UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showModal, setShowModal] = useState(false);
  const [editingMovimentacao, setEditingMovimentacao] = useState<MovimentacaoFinanceira | null>(null);
  const [selectedMovimentacao, setSelectedMovimentacao] = useState<MovimentacaoFinanceira | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [activeFinanceTab, setActiveFinanceTab] = useState<'movimentacoes' | 'pagar-receber'>('pagar-receber');

  // Hooks para buscar dados da API
  const { contas, loading, error, refetch } = useContasPagarReceber();
  const { movimentacoes, loading: loadingMovimentacoes, error: errorMovimentacoes, refetch: refetchMovimentacoes } = useMovimentacoes();
  const { faturamento, loading: loadingFaturamento } = useFaturamento();
  const { fluxoCaixa, loading: loadingFluxoCaixa } = useFluxoCaixa();
  const { liquidezCorrente, loading: loadingLiquidez } = useLiquidezCorrente();

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

  const handleEditMovimentacao = (movimentacao: MovimentacaoFinanceira) => {
    setEditingMovimentacao(movimentacao);
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

  const handleViewMovimentacao = (movimentacao: MovimentacaoFinanceira) => {
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
        {/* Stats Cards - Estilo ClickUp/Itaú */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card-metric-modern min-h-[80px]">
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
          </div>

          <div className="card-metric-modern min-h-[80px]">
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
          </div>

          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric gray">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">R$ 0,00</p>
                <p className="text-xs text-gray-500">Capital de Giro</p>
              </div>
            </div>
          </div>

          <div className="card-metric-modern min-h-[80px]">
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

        {/* Seção de Cards Personalizados */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card One - Margens */}
            <div className="lg:col-span-1 space-y-6">
              <div className="card w-full h-64" style={{ padding: '16px' }}>
                <div className="flex items-center justify-between mb-4">
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
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      backgroundColor: '#F3F4F6', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      margin: '0 auto 12px' 
                    }}>
                      <BarChart3 className="w-6 h-6 text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-500">Dados em breve</p>
                  </div>
                </div>
              </div>
              
              <div className="card w-full h-64" style={{ padding: '16px' }}>
                <div className="flex items-center justify-between mb-4">
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
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      backgroundColor: '#F3F4F6', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      margin: '0 auto 12px' 
                    }}>
                      <Calculator className="w-6 h-6 text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-500">Dados em breve</p>
                  </div>
                </div>
              </div>
            </div> 
           {/* Card Two - Fluxo de Caixa */}
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
                      <Activity className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Fluxo de Caixa</h3>
                      <p className="text-xs text-gray-500">Entradas vs Saídas</p>
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
                      <Activity className="w-8 h-8 text-gray-500" />
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

        {/* Título da Seção de Movimentações */}
        <div className="flex items-start justify-between mb-6 mt-12">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Movimentações Financeiras</h2>
            <p className="text-sm text-gray-500">Gerencie receitas, despesas e acompanhe todas as movimentações financeiras da empresa.</p>
          </div>
        </div>

        {/* Tabs para Movimentações */}
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1 w-fit mb-6">
          <button
            onClick={() => setActiveFinanceTab('pagar-receber')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
              activeFinanceTab === 'pagar-receber'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>A Pagar e Receber</span>
          </button>
          <button
            onClick={() => setActiveFinanceTab('movimentacoes')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
              activeFinanceTab === 'movimentacoes'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Movimentações</span>
          </button>
        </div>      
  {/* Movimentações Grid - Estilo Itaú */}
        <div className="card">
          {/* Filtros */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search Bar */}
              <div className="flex-1 min-w-[300px] relative">
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

              {/* Tipo Filter */}
              <select
                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors duration-200 text-sm min-w-[140px]"
                value={selectedTipo}
                onChange={(e) => setSelectedTipo(e.target.value)}
              >
                <option value="">Todos os tipos</option>
                <option value="receita">Receita</option>
                <option value="despesa">Despesa</option>
              </select>

              {/* Status Filter */}
              <select
                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors duration-200 text-sm min-w-[120px]"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">Status</option>
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
                <option value="vencido">Vencido</option>
                <option value="cancelado">Cancelado</option>
              </select>

              {/* Categoria Filter */}
              <select
                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors duration-200 text-sm min-w-[140px]"
                value={selectedCategoria}
                onChange={(e) => setSelectedCategoria(e.target.value)}
              >
                <option value="">Categoria</option>
                <option value="vendas">Vendas</option>
                <option value="marketing">Marketing</option>
                <option value="operacional">Operacional</option>
                <option value="administrativo">Administrativo</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Visualização em grade"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'list'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Visualização em lista"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>

              <span className="text-sm text-gray-500">
                {total} {total === 1 ? 'movimentação' : 'movimentações'}
              </span>
            </div>
          </div> 
         {/* Movimentações Grid/List */}
          {dadosAtivos.length === 0 ? (
            <div className="text-center py-12">
              <div className="icon-container orange mx-auto mb-4" style={{ width: '64px', height: '64px' }}>
                <DollarSign className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma movimentação encontrada</h4>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm || selectedTipo || selectedStatus
                  ? 'Tente ajustar os filtros ou registre novas movimentações'
                  : 'Comece registrando sua primeira movimentação financeira'
                }
              </p>
              <button
                onClick={handleCreateMovimentacao}
                className="btn-primary flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar Movimentação</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {activeFinanceTab === 'pagar-receber' ? (
                // Tabela A Pagar e Receber
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Tipo</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Descrição</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Valor</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Vencimento</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Cliente/Fornecedor</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dadosPaginados.map((conta) => (
                      <tr key={conta.id_conta} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            conta.tipo_conta === 'Receber' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            <div className={`w-2 h-2 rounded-full mr-1 ${
                              conta.tipo_conta === 'Receber' ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                            {conta.tipo_conta}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{conta.descricao}</div>
                          {conta.parcelamento > 1 && (
                            <div className="text-xs text-gray-500">{conta.parcelamento} parcelas</div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-gray-900">{formatCurrency(conta.valor)}</div>
                          <div className="flex items-center space-x-2 text-xs">
                            {conta.desconto > 0 && (
                              <span className="text-green-600">-{formatCurrency(conta.desconto)}</span>
                            )}
                            {conta.juros > 0 && (
                              <span className="text-red-600">+{formatCurrency(conta.juros)}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-gray-900">
                            {new Date(conta.data_vencimento).toLocaleDateString('pt-BR')}
                          </div>
                          {conta.data_pagamento && (
                            <div className="text-xs text-gray-500">
                              Pago: {new Date(conta.data_pagamento).toLocaleDateString('pt-BR')}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            conta.status === 'Paga' 
                              ? 'bg-green-100 text-green-700' 
                              : conta.status === 'Pendente'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {conta.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-900">{conta.id_cliente_fornecedor}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => console.log('Ver conta:', conta.id_conta)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Visualizar"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => console.log('Editar conta:', conta.id_conta)}
                              className="p-1 text-gray-400 hover:text-orange-600 transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMovimentacao(conta.id_conta)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                // Tabela Movimentações
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Tipo</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Descrição</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Valor</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Data</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Contas</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dadosPaginados.map((mov) => (
                      <tr key={mov.id_movimentacao} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            mov.tipo_transacao === 'Recebimento' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            <div className={`w-2 h-2 rounded-full mr-1 ${
                              mov.tipo_transacao === 'Recebimento' ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                            {mov.tipo_transacao}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{mov.descricao_movimentacao}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-gray-900">{formatCurrency(mov.valor)}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-gray-900">
                            {new Date(mov.data_movimentacao).toLocaleDateString('pt-BR')}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            mov.status_transacao === 'Concluída' 
                              ? 'bg-green-100 text-green-700' 
                              : mov.status_transacao === 'Pendente'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {mov.status_transacao}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-xs text-gray-600">
                            <div>Débito: {mov.id_conta_debito}</div>
                            <div>Crédito: {mov.id_conta_credito}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => console.log('Ver movimentação:', mov.id_movimentacao)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Visualizar"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => console.log('Editar movimentação:', mov.id_movimentacao)}
                              className="p-1 text-gray-400 hover:text-orange-600 transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMovimentacao(mov.id_movimentacao)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              
              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 px-4">
                  <div className="text-sm text-gray-500">
                    Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, total)} de {total} registros
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                            currentPage === page
                              ? 'bg-orange-500 text-white'
                              : 'border border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Próxima
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>        

        {/* Modals */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingMovimentacao ? 'Editar Movimentação' : 'Nova Movimentação'}
                  </h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-900">Em desenvolvimento</h4>
                      <p className="text-sm text-orange-700">
                        Modal de {editingMovimentacao ? 'edição' : 'criação'} de movimentação será implementado em breve.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium px-4 py-3 rounded-xl transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium px-4 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
