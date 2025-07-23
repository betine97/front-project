'use client';

import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  DollarSign, 
  Package, 
  TrendingUp, 
  Users,
  Target,
  BarChart3,
  PieChart,
  Calendar,
  Filter,
  Eye,
  Edit,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Smartphone,
  Store,
  Globe,
  Phone
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { AnaliseVendasComponent } from '../../components/vendas/AnaliseVendas';
import { Venda } from '../../types/entities';
import { MESSAGES } from '../../constants/index';
import { formatCurrency } from '../../lib/utils';

export default function VendasPage() {
  // Estados locais para UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCanal, setSelectedCanal] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPeriodo, setSelectedPeriodo] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showModal, setShowModal] = useState(false);
  const [editingVenda, setEditingVenda] = useState<Venda | null>(null);
  const [selectedVenda, setSelectedVenda] = useState<Venda | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Dados mockados por enquanto (será substituído por hook)
  const vendas: Venda[] = [];
  const loading = false;
  const error = null;
  const total = 0;
  const totalPages = 0;

  // Dados para gráficos (valores nulos por enquanto)
  const vendasParaGraficos = vendas;

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
  const canais = Array.from(new Set(vendas.map(v => v.canal_venda))).filter(Boolean);
  const status = Array.from(new Set(vendas.map(v => v.status))).filter(Boolean);

  // Handlers
  const handleCreateVenda = () => {
    setEditingVenda(null);
    setShowModal(true);
  };

  const handleEditVenda = (venda: Venda) => {
    setEditingVenda(venda);
    setShowModal(true);
  };

  const handleDeleteVenda = async (id: number) => {
    if (confirm(MESSAGES.CONFIRM.DELETE)) {
      try {
        // TODO: Implementar deletar venda
        console.log('Deletar venda:', id);
      } catch (error) {
        console.error('Erro ao excluir venda:', error);
      }
    }
  };

  const handleSaveVenda = async (vendaData: Omit<Venda, 'id'>) => {
    try {
      if (editingVenda) {
        // TODO: Implementar atualizar venda
        console.log('Atualizar venda:', editingVenda.id, vendaData);
      } else {
        // TODO: Implementar criar venda
        console.log('Criar venda:', vendaData);
      }
      setShowModal(false);
      setEditingVenda(null);
    } catch (error) {
      console.error('Erro ao salvar venda:', error);
    }
  };

  const handleViewVenda = (venda: Venda) => {
    setSelectedVenda(venda);
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
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">R$ 0,00</p>
                <p className="text-xs text-gray-500">Ticket Médio</p>
              </div>
            </div>
          </div>

          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric gray">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-500">Vendas Total</p>
              </div>
            </div>
          </div>

          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric gray">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-500">Produtos Vendidos</p>
              </div>
            </div>
          </div>

          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric gray">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">R$ 0,00</p>
                <p className="text-xs text-gray-500">MRR</p>
              </div>
            </div>
          </div>
        </div>

        {/* Título da Análise e Action Buttons */}
        <div className="flex items-start justify-between mb-6 mt-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Análise de Performance de Vendas</h2>
            <p className="text-sm text-gray-500">Insights detalhados sobre vendas, categorias, up-sell, cross-sell, perfil demográfico e canais de venda.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => console.log('Relatório de Vendas')}
              className="btn-secondary flex items-center space-x-2 text-sm px-4 py-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Relatório</span>
            </button>
            <button
              onClick={handleCreateVenda}
              className="btn-primary flex items-center space-x-2 text-sm px-4 py-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Venda</span>
            </button>
          </div>
        </div>

        {/* Seção de Cards Personalizados */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card One - Performance Geral */}
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
                      <h3 className="text-sm font-semibold text-gray-900">Performance Geral</h3>
                      <p className="text-xs text-gray-500">Métricas principais</p>
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
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Canais de Venda</h3>
                      <p className="text-xs text-gray-500">Distribuição</p>
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
                      <Target className="w-6 h-6 text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-500">Dados em breve</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Card Two - Up-sell e Cross-sell */}
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
                      <h3 className="text-sm font-semibold text-gray-900">Up-sell & Cross-sell</h3>
                      <p className="text-xs text-gray-500">Vendas adicionais</p>
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
            
            {/* Card Three - Análise Demográfica */}
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
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Análise Demográfica</h3>
                      <p className="text-xs text-gray-500">Perfil dos clientes</p>
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
                      <Users className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-500">Dados em breve</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção Análise Detalhada de Vendas */}
        <div className="flex items-start justify-between mb-6 mt-12">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Análise Detalhada de Vendas</h2>
            <p className="text-sm text-gray-500">Dashboard completo com todas as métricas de vendas, segmentação e performance por categoria e canal.</p>
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
              onClick={() => console.log('Exportar Dados')}
              className="btn-primary flex items-center space-x-2 text-sm px-4 py-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Componente de Análise Detalhada */}
        <div className="mb-12">
          <AnaliseVendasComponent />
        </div>

        {/* Título da Seção de Histórico de Vendas */}
        <div className="flex items-start justify-between mb-6 mt-12">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Histórico de Vendas</h2>
            <p className="text-sm text-gray-500">Gerencie todas as vendas, visualize detalhes dos pedidos e acompanhe o status de cada transação.</p>
          </div>
        </div>

        {/* Histórico de Vendas Grid - Estilo Itaú */}
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
                  placeholder="Buscar vendas..."
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 bg-gray-50 focus:bg-white text-sm"
                  onChange={(e) => handleSearchChange(e.target.value)}
                  value={searchTerm}
                />
              </div>

              {/* Canal Filter */}
              <select
                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors duration-200 text-sm min-w-[140px]"
                value={selectedCanal}
                onChange={(e) => setSelectedCanal(e.target.value)}
              >
                <option value="">Todos os canais</option>
                <option value="loja_fisica">Loja Física</option>
                <option value="ecommerce">E-commerce</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="telefone">Telefone</option>
                <option value="marketplace">Marketplace</option>
              </select>

              {/* Status Filter */}
              <select
                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors duration-200 text-sm min-w-[120px]"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">Status</option>
                <option value="pendente">Pendente</option>
                <option value="confirmada">Confirmada</option>
                <option value="enviada">Enviada</option>
                <option value="entregue">Entregue</option>
                <option value="cancelada">Cancelada</option>
              </select>

              {/* Período Filter */}
              <select
                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors duration-200 text-sm min-w-[120px]"
                value={selectedPeriodo}
                onChange={(e) => setSelectedPeriodo(e.target.value)}
              >
                <option value="">Período</option>
                <option value="hoje">Hoje</option>
                <option value="7d">7 dias</option>
                <option value="30d">30 dias</option>
                <option value="90d">90 dias</option>
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
                {vendas.length} {vendas.length === 1 ? 'venda' : 'vendas'}
              </span>
            </div>
          </div>

          {/* Vendas Grid/List */}
          {vendas.length === 0 ? (
            <div className="text-center py-12">
              <div className="icon-container orange mx-auto mb-4" style={{ width: '64px', height: '64px' }}>
                <ShoppingCart className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma venda encontrada</h4>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm || selectedCanal || selectedStatus || selectedPeriodo
                  ? 'Tente ajustar os filtros ou registre novas vendas'
                  : 'Comece registrando sua primeira venda no sistema'
                }
              </p>
              <button
                onClick={handleCreateVenda}
                className="btn-primary flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar Venda</span>
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Grid de vendas será implementado aqui */}
                <div className="text-center py-8 col-span-full">
                  <p className="text-gray-500">Grid de vendas será implementado em breve</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4">
              {/* Tabela de vendas será implementada aqui */}
              <div className="text-center py-8">
                <p className="text-gray-500">Tabela de vendas será implementada em breve</p>
              </div>
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
                    <ShoppingCart className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingVenda ? 'Editar Venda' : 'Nova Venda'}
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
                        Modal de {editingVenda ? 'edição' : 'criação'} de venda será implementado em breve.
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