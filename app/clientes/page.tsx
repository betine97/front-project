'use client';

import React, { useState } from 'react';
import { Users, Plus, Mail, Phone, MapPin, User, Building, Target, TrendingUp, DollarSign, Tag } from 'lucide-react';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PublicosAlvo } from '../../components/clientes/PublicosAlvo';
import { ProgramaFidelidade } from '../../components/clientes/ProgramaFidelidade';
import { NovoClienteModal } from '../../components/clientes/NovoClienteModal';
import { TagsClienteModal } from '../../components/clientes/TagsClienteModal';
import { useClientes } from '@/hooks/useClientes';
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
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [clienteParaTags, setClienteParaTags] = useState<Cliente | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Hook para buscar clientes da API
  const {
    clientes,
    completude,
    clientesTags: rawClientesTags,
    loading,
    error,
    total,
    totalPages,
    refetch,
    createCliente
  } = useClientes({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    status: selectedStatus
  });

  // Garantir que clientesTags seja sempre um objeto válido
  const clientesTags = rawClientesTags || {};

  // Dados para gráficos (valores nulos por enquanto)
  const clientesParaGraficos = clientes;

  // Função utilitária para verificar se uma tag é válida
  const isValidTag = (tag: any) => {
    return tag && 
           typeof tag.id_tag === 'number' && 
           typeof tag.nome_tag === 'string' && 
           typeof tag.categoria_tag === 'string' &&
           tag.nome_tag.trim() !== '' &&
           tag.categoria_tag.trim() !== '';
  };

  // Função utilitária para obter cor da categoria
  const getCategoryColor = (categoria: string) => {
    const colors: Record<string, string> = {
      'Fidelidade': 'bg-purple-100 text-purple-700',
      'Comportamento': 'bg-blue-100 text-blue-700',
      'Personalizada': 'bg-orange-100 text-orange-700',
      'Dores': 'bg-red-100 text-red-700',
      'Preferências': 'bg-green-100 text-green-700'
    };
    return colors[categoria] || 'bg-gray-100 text-gray-700';
  };

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

  const handleSaveCliente = async (clienteData: {
    tipo_cliente: string;
    nome_cliente: string;
    numero_celular: string;
    sexo: 'M' | 'F';
    email?: string;
    data_nascimento?: string;
    endereco: {
      cep: string;
      cidade: string;
      estado: string;
      bairro: string;
      logradouro: string;
      numero: string;
      complemento?: string;
      obs?: string;
    };
  }) => {
    try {
      const result = await createCliente(clienteData);
      console.log('[ClientesPage] Resultado do createCliente:', result);
      setShowModal(false);
      setEditingCliente(null);
      return result; // Retornar o resultado para o modal
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      alert('Erro ao salvar cliente. Tente novamente.');
      throw error; // Re-throw para o modal tratar
    }
  };

  const handleViewCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
  };

  const handleOpenTagsModal = (cliente: Cliente) => {
    setClienteParaTags(cliente);
    setShowTagsModal(true);
  };

  const handleCloseTagsModal = () => {
    setShowTagsModal(false);
    setClienteParaTags(null);
  };

  // Loading state
  if (loading === 'loading') {
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
  if (loading === 'error' && error) {
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
                <p className="text-lg font-bold text-gray-900">{total}</p>
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

        {/* Seção Públicos-Alvo */}
        <div className="flex items-start justify-between mb-6 mt-12">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Públicos-Alvo</h2>
            <p className="text-sm text-gray-500">Defina públicos-alvo para segmentar melhor sua base de clientes.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                // Trigger do modal será gerenciado pelo componente PublicosAlvo
                const novoPublicoBtn = document.querySelector('[data-novo-publico]') as HTMLButtonElement;
                if (novoPublicoBtn) novoPublicoBtn.click();
              }}
              className="btn-primary flex items-center space-x-2 text-sm px-4 py-2"
            >
              <Target className="w-4 h-4" />
              <span>Novo Público</span>
            </button>
          </div>
        </div>

        {/* Grid de Públicos-Alvo */}
        <div className="mb-12">
          <PublicosAlvo />
        </div>

        {/* Seção Programa de Fidelidade */}
        <div className="flex items-start justify-between mb-6 mt-12">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Programa de Fidelidade</h2>
            <p className="text-sm text-gray-500">Configure critérios de pontuação e recompensas para engajar e fidelizar seus clientes.</p>
          </div>
        </div>

        {/* Componente do Programa de Fidelidade */}
        <div className="mb-12">
          <ProgramaFidelidade />
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
          {loading !== 'success' && loading !== 'error' && loading !== 'idle' ? (
            <div className="p-4">
              <div className="animate-pulse space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          ) : clientes.length === 0 ? (
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {clientes.map((cliente) => (
                  <div
                    key={cliente.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 hover:border-orange-200"
                  >
                    {/* Barra de Progresso */}
                    <div className="mb-3">
                      <ProgressBar 
                        percentage={completude[cliente.id] || 0} 
                        size="sm"
                      />
                    </div>
                    
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {cliente.nome}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {cliente.tipo === 'pessoa_fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 truncate" title={cliente.email}>
                          {cliente.email || 'Email não informado'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {cliente.telefone || 'Telefone não informado'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {cliente.cpf_cnpj || 'CPF não informado'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Tags do Cliente */}
                    {clientesTags[cliente.id] && clientesTags[cliente.id].filter(isValidTag).length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {clientesTags[cliente.id].slice(0, 3).filter(isValidTag).map((tag) => (
                            <span
                              key={tag.id_tag}
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(tag.categoria_tag)}`}
                              title={`${tag.categoria_tag}: ${tag.nome_tag}`}
                            >
                              {tag.nome_tag.length > 12 ? `${tag.nome_tag.substring(0, 12)}...` : tag.nome_tag}
                            </span>
                          ))}
                          {clientesTags[cliente.id].filter(isValidTag).length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              +{clientesTags[cliente.id].filter(isValidTag).length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            cliente.status === 'ativo'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {cliente.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </span>
                        <button
                          onClick={() => handleOpenTagsModal(cliente)}
                          className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Gerenciar tags"
                        >
                          <Tag className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Cliente</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Telefone</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">CPF</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Tags</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Completude</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map((cliente) => (
                      <tr
                        key={cliente.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                              <User className="w-4 h-4 text-orange-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{cliente.nome}</div>
                              <div className="text-sm text-gray-500">
                                {cliente.tipo === 'pessoa_fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 max-w-xs">
                          <div className="truncate" title={cliente.email}>
                            {cliente.email || '-'}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {cliente.telefone || '-'}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {cliente.cpf_cnpj || '-'}
                        </td>
                        <td className="py-3 px-4">
                          {clientesTags[cliente.id] && clientesTags[cliente.id].filter(isValidTag).length > 0 ? (
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {clientesTags[cliente.id].slice(0, 2).filter(isValidTag).map((tag) => (
                                <span
                                  key={tag.id_tag}
                                  className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getCategoryColor(tag.categoria_tag)}`}
                                  title={`${tag.categoria_tag}: ${tag.nome_tag}`}
                                >
                                  {tag.nome_tag.length > 8 ? `${tag.nome_tag.substring(0, 8)}...` : tag.nome_tag}
                                </span>
                              ))}
                              {clientesTags[cliente.id].filter(isValidTag).length > 2 && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                  +{clientesTags[cliente.id].filter(isValidTag).length - 2}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs">Sem tags</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="w-20">
                            <ProgressBar 
                              percentage={completude[cliente.id] || 0} 
                              size="sm"
                              showLabel={false}
                            />
                            <span className="text-xs text-gray-500 mt-1 block">
                              {(completude[cliente.id] || 0).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              cliente.status === 'ativo'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {cliente.status === 'ativo' ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleOpenTagsModal(cliente)}
                            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Gerenciar tags"
                          >
                            <Tag className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, total)} de {total} clientes
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 text-sm border rounded-lg ${
                          currentPage === pageNum
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal de Novo Cliente */}
        <NovoClienteModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingCliente(null);
          }}
          onSave={handleSaveCliente}
        />

        {/* Modal de Tags do Cliente */}
        <TagsClienteModal
          isOpen={showTagsModal}
          onClose={handleCloseTagsModal}
          cliente={clienteParaTags}
          onTagsUpdated={refetch}
        />
      </div>
    </DashboardLayout>
  );
}