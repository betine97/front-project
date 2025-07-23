'use client';

import React, { useState } from 'react';
import { Users, Plus, Mail, Phone, MapPin, User, Building, Target, TrendingUp, DollarSign } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PersonasPublicoAlvo } from '../../components/clientes/PersonasPublicoAlvo';
import { Cliente } from '../../types/entities';
import { MESSAGES } from '../../constants/index';
import { formatCurrency } from '../../lib/utils';

export default function ClientesPage() {
  // Estados locais para UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCidade, setSelectedCidade] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showModal, setShowModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Dados mockados por enquanto (será substituído por hook)
  const clientes: Cliente[] = [];
  const loading = false;
  const error = null;
  const total = 0;
  const totalPages = 0;

  // Dados para gráficos (valores nulos por enquanto)
  const clientesParaGraficos = clientes;

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
  const tipos = Array.from(new Set(clientes.map(c => c.tipo))).filter(Boolean);
  const cidades = Array.from(new Set(clientes.map(c => c.cidade))).filter(Boolean);
  const estados = Array.from(new Set(clientes.map(c => c.estado))).filter(Boolean);

  // Handlers
  const handleCreateCliente = () => {
    setEditingCliente(null);
    setShowModal(true);
  };

  const handleEditCliente = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setShowModal(true);
  };

  const handleDeleteCliente = async (id: number) => {
    if (confirm(MESSAGES.CONFIRM.DELETE)) {
      try {
        // TODO: Implementar deletar cliente
        console.log('Deletar cliente:', id);
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
      }
    }
  };

  const handleSaveCliente = async (clienteData: Omit<Cliente, 'id'>) => {
    try {
      if (editingCliente) {
        // TODO: Implementar atualizar cliente
        console.log('Atualizar cliente:', editingCliente.id, clienteData);
      } else {
        // TODO: Implementar criar cliente
        console.log('Criar cliente:', clienteData);
      }
      setShowModal(false);
      setEditingCliente(null);
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    }
  };

  const handleViewCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
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
                <p className="text-xs text-gray-500">ICP</p>
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
                <p className="text-xs text-gray-500">LTV</p>
              </div>
            </div>
          </div>

          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric gray">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-500">NPS</p>
              </div>
            </div>
          </div>

          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric gray">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-500">Total Clientes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Título da Análise e Action Buttons */}
        <div className="flex items-start justify-between mb-6 mt-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Análise da Base de Clientes</h2>
            <p className="text-sm text-gray-500">Insights sobre distribuição, segmentação e localização dos seus clientes por tipo e região.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCreateCliente}
              className="btn-primary flex items-center space-x-2 text-sm px-4 py-2"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Cliente</span>
            </button>
          </div>
        </div>

        {/* Seção de Cards Personalizados */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card One - Ocupa 1 coluna */}
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
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Distribuição por Tipo</h3>
                      <p className="text-xs text-gray-500">PF vs PJ</p>
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
                      <Users className="w-6 h-6 text-gray-500" />
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
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Localização</h3>
                      <p className="text-xs text-gray-500">Por região</p>
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
                      <MapPin className="w-6 h-6 text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-500">Dados em breve</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Card Two - Ocupa 1 coluna */}
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
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Engajamento</h3>
                      <p className="text-xs text-gray-500">Comunicação</p>
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
                      <Mail className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-500">Dados em breve</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Card Three - Ocupa 1 coluna */}
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
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Crescimento</h3>
                      <p className="text-xs text-gray-500">Novos clientes</p>
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
          </div>
        </div>

        {/* Seção Personas & Público-Alvo */}
        <div className="flex items-start justify-between mb-6 mt-12">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Personas & Público-Alvo</h2>
            <p className="text-sm text-gray-500">Defina públicos-alvo e crie personas detalhadas para segmentar melhor sua base de clientes.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => console.log('Criar Público')}
              className="btn-secondary flex items-center space-x-2 text-sm px-4 py-2"
            >
              <Target className="w-4 h-4" />
              <span>Novo Público</span>
            </button>
            <button
              onClick={() => console.log('Criar Persona')}
              className="btn-primary flex items-center space-x-2 text-sm px-4 py-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Persona</span>
            </button>
          </div>
        </div>

        {/* Grid de Personas e Públicos */}
        <div className="mb-12">
          <PersonasPublicoAlvo />
        </div>

        {/* Título da Seção de Clientes */}
        <div className="flex items-start justify-between mb-6 mt-12">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Base de Clientes</h2>
            <p className="text-sm text-gray-500">Gerencie seus clientes, visualize detalhes e acompanhe o relacionamento com cada cliente.</p>
          </div>
        </div>

        {/* Clients Grid - Estilo Itaú */}
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
                  placeholder="Buscar clientes..."
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
                <option value="pessoa_fisica">Pessoa Física</option>
                <option value="pessoa_juridica">Pessoa Jurídica</option>
              </select>

              {/* Status Filter */}
              <select
                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors duration-200 text-sm min-w-[120px]"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">Status</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
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
                {clientes.length} {clientes.length === 1 ? 'cliente' : 'clientes'}
              </span>
            </div>
          </div>

          {/* Clientes Grid/List */}
          {clientes.length === 0 ? (
            <div className="text-center py-12">
              <div className="icon-container orange mx-auto mb-4" style={{ width: '64px', height: '64px' }}>
                <Users className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Nenhum cliente encontrado</h4>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm || selectedTipo || selectedStatus
                  ? 'Tente ajustar os filtros ou adicione novos clientes'
                  : 'Comece adicionando seus primeiros clientes ao sistema'
                }
              </p>
              <button
                onClick={handleCreateCliente}
                className="btn-primary flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Cliente</span>
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Grid de clientes será implementado aqui */}
                <div className="text-center py-8 col-span-full">
                  <p className="text-gray-500">Grid de clientes será implementado em breve</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4">
              {/* Tabela de clientes será implementada aqui */}
              <div className="text-center py-8">
                <p className="text-gray-500">Tabela de clientes será implementada em breve</p>
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
                    <Users className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingCliente ? 'Editar Cliente' : 'Novo Cliente'}
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
                        Modal de {editingCliente ? 'edição' : 'criação'} de cliente será implementado em breve.
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