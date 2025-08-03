'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, Building2, MapPin, Phone, Mail } from 'lucide-react';
import { useAuthCheck } from '../../hooks/useAuthCheck';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useFornecedores } from '../../hooks/useFornecedores';
import { Fornecedor } from '../../types/entities';
import { LoadingState } from '../../types/common';
import { MESSAGES } from '@/constants/index';
import { FornecedoresDebug } from '@/components/debug/FornecedoresDebug';
import { NovoFornecedorModal } from '@/components/fornecedores/NovoFornecedorModal';
import { EditarFornecedorModal } from '@/components/fornecedores/EditarFornecedorModal';

export default function FornecedoresPage() {
  // Verificação de autenticação
  const { isAuthenticated, requireAuth } = useAuthCheck();

  // Estados locais para UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('');
  const [selectedCidade, setSelectedCidade] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFornecedor, setEditingFornecedor] = useState<Fornecedor | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Hook para gerenciar fornecedores
  const {
    fornecedores,
    loading,
    error,
    total,
    totalPages,
    createFornecedor,
    updateFornecedorField,
    updateFornecedorStatus,
    deleteFornecedor,
    refetch
  } = useFornecedores({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    status: selectedStatus
  });

  // Aplicar filtros adicionais no frontend
  const fornecedoresFiltrados = fornecedores.filter(fornecedor => {
    if (selectedEstado && fornecedor.estado !== selectedEstado) return false;
    if (selectedCidade && fornecedor.cidade !== selectedCidade) return false;
    return true;
  });

  // Verificar autenticação
  useEffect(() => {
    if (isAuthenticated === false) {
      requireAuth();
    }
  }, [isAuthenticated, requireAuth]);

  // Filtros derivados dos dados
  const estados = Array.from(new Set(fornecedores.map(f => f.estado))).filter(Boolean);
  const cidades = Array.from(new Set(fornecedores.map(f => f.cidade))).filter(Boolean);
  const fornecedoresAtivos = fornecedores.filter(f => f.status === 'ativo');
  const fornecedoresInativos = fornecedores.filter(f => f.status === 'inativo');

  // Handlers
  const handleCreateFornecedor = () => {
    setEditingFornecedor(null);
    setShowModal(true);
  };

  const handleSaveFornecedor = async (fornecedorData: {
    nome: string;
    telefone: string;
    email: string;
    cidade: string;
    estado: string;
    status: string;
    data_cadastro: string;
  }) => {
    try {
      const result = await createFornecedor(fornecedorData as any);
      console.log('Fornecedor criado:', result.message);
    } catch (error) {
      console.error('Erro ao criar fornecedor:', error);
      throw error; // Re-throw para que a modal possa lidar com o erro
    }
  };

  const handleSaveEditFornecedor = async (id: number, changes: { status?: string; fields?: Array<{campo: string, valor: string}> }) => {
    try {
      // Alterar status se necessário
      if (changes.status) {
        const statusResult = await updateFornecedorStatus(id);
        console.log('Status do fornecedor alterado:', statusResult.message);
      }
      
      // Alterar campos se necessário
      if (changes.fields && changes.fields.length > 0) {
        for (const field of changes.fields) {
          const fieldResult = await updateFornecedorField(id, field.campo, field.valor);
          console.log(`Campo ${field.campo} alterado:`, fieldResult.message);
        }
      }
    } catch (error) {
      console.error('Erro ao alterar fornecedor:', error);
      throw error;
    }
  };

  const handleEditFornecedor = (fornecedor: Fornecedor) => {
    setEditingFornecedor(fornecedor);
    setShowEditModal(true);
  };

  const handleDeleteFornecedor = async (id: number) => {
    try {
      const result = await deleteFornecedor(id);
      console.log('Fornecedor excluído:', result.message);
    } catch (error) {
      console.error('Erro ao excluir fornecedor:', error);
      throw error;
    }
  };



  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  // Loading state
  if (isAuthenticated === null || loading === ('loading' as LoadingState)) {
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

  // Determinar o tipo de erro e mensagem apropriada
  const getErrorInfo = () => {
    if (!error) return null;
    
    // Verificar se é erro de rede/API quebrada
    if (error.includes('fetch') || error.includes('Network') || error.includes('Failed to fetch')) {
      return {
        type: 'network',
        title: 'Problema de Conexão',
        message: 'Não foi possível conectar com o servidor. Verifique sua conexão com a internet.',
        icon: '🌐'
      };
    }
    
    // Verificar se é erro 404 (endpoint não encontrado)
    if (error.includes('404') || error.includes('Not Found')) {
      return {
        type: 'notfound',
        title: 'Endpoint Não Encontrado',
        message: 'A rota da API foi alterada ou não existe. Entre em contato com o suporte técnico.',
        icon: '🔍'
      };
    }
    
    // Verificar se é erro 500 (problema interno)
    if (error.includes('500') || error.includes('Internal Server Error')) {
      return {
        type: 'server',
        title: 'Problema Interno no Sistema',
        message: 'O servidor está com problemas internos. Tente novamente em alguns minutos.',
        icon: '⚠️'
      };
    }
    
    // Erro genérico
    return {
      type: 'generic',
      title: 'Erro no Sistema',
      message: 'Ocorreu um erro inesperado. Tente recarregar a página.',
      icon: '❌'
    };
  };

  const errorInfo = getErrorInfo();

  return (
    <DashboardLayout>
      <div className="p-6 max-w-full overflow-x-hidden flex-1 flex flex-col">


        {/* Stats Cards - Estilo ClickUp/Itaú */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric orange">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">
                  {error ? '--' : fornecedores.length} Fornecedores
                </p>
                {error && <p className="text-xs text-gray-500">Dados indisponíveis</p>}
              </div>
            </div>
          </div>

          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric gray">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">
                  {error ? '--' : fornecedoresAtivos.length} Ativos
                </p>
                {error && <p className="text-xs text-gray-500">Dados indisponíveis</p>}
              </div>
            </div>
          </div>

          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric gray">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">
                  {error ? '--' : estados.length} Estados
                </p>
                {error && <p className="text-xs text-gray-500">Dados indisponíveis</p>}
              </div>
            </div>
          </div>

          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric gray">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">
                  {error ? '--' : fornecedoresInativos.length} Inativos
                </p>
                {error && <p className="text-xs text-gray-500">Dados indisponíveis</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Título da Análise e Action Buttons */}
        <div className="flex items-start justify-between mb-6 mt-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Gestão de Fornecedores</h2>
            <p className="text-sm text-gray-500">Gerencie sua rede de fornecedores, contratos e relacionamentos comerciais.</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Botão de debug - apenas em desenvolvimento */}
            {process.env.NODE_ENV === 'development' && (
              <div className="flex items-center space-x-2">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${loading === ('loading' as LoadingState) ? 'bg-blue-100 text-blue-800' :
                  error ? 'bg-red-100 text-red-800' :
                    fornecedores.length > 0 ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                  }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${loading === ('loading' as LoadingState) ? 'bg-blue-400 animate-pulse' :
                    error ? 'bg-red-400' :
                      fornecedores.length > 0 ? 'bg-green-400' :
                        'bg-gray-400'
                    }`} />
                  {loading === ('loading' as LoadingState) ? 'Carregando...' :
                    error ? 'API Error' :
                      fornecedores.length > 0 ? `${fornecedores.length} fornecedores` :
                        'Sem dados'}
                </div>
                <button
                  onClick={() => {
                    console.log('=== DEBUG FORNECEDORES ===');
                    console.log('Loading:', loading);
                    console.log('Error:', error);
                    console.log('Fornecedores:', fornecedores);
                    console.log('Token:', localStorage.getItem('auth_token'));
                    refetch();
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-2 rounded-lg flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Debug API</span>
                </button>
              </div>
            )}
            <button
              onClick={handleCreateFornecedor}
              className="btn-primary flex items-center space-x-2 text-sm px-4 py-2"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Fornecedor</span>
            </button>
          </div>
        </div>

        {/* Título da Seção de Fornecedores */}
        <div className="flex items-start justify-between mb-6 mt-12">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Lista de Fornecedores</h2>
            <p className="text-sm text-gray-500">Visualize e gerencie todos os seus fornecedores cadastrados.</p>
          </div>
        </div>

        {/* Fornecedores Grid - Estilo Itaú */}
        <div className="card flex-1 flex flex-col">
          {/* Filtros - Estilo da imagem */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              {/* Lado Esquerdo - Busca e Filtros */}
              <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder={error ? "Busca indisponível..." : "Buscar Fornecedores..."}
                    className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 bg-white text-sm w-64"
                    onChange={(e) => handleSearchChange(e.target.value)}
                    value={searchTerm}
                    disabled={error ? true : false}
                  />
                </div>

                {/* Todos os Status */}
                <select
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm min-w-[140px]"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  disabled={error ? true : false}
                >
                  <option value="">Todos os Status</option>
                  {!error && (
                    <>
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                    </>
                  )}
                </select>

                {/* Todos os Estados */}
                <select
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm min-w-[140px]"
                  value={selectedEstado}
                  onChange={(e) => setSelectedEstado(e.target.value)}
                  disabled={error ? true : false}
                >
                  <option value="">Todos os Estados</option>
                  {!error && estados.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>

                {/* Filtro por Cidade */}
                <select
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm min-w-[140px]"
                  value={selectedCidade}
                  onChange={(e) => setSelectedCidade(e.target.value)}
                  disabled={error ? true : false}
                >
                  <option value="">Todas as Cidades</option>
                  {!error && cidades.map(cidade => (
                    <option key={cidade} value={cidade}>{cidade}</option>
                  ))}
                </select>

                {/* Filtro Adicional */}
                <select
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm min-w-[120px]"
                  disabled={error ? true : false}
                >
                  <option value="">Por Cadastro</option>
                </select>

                {/* Botão de Filtro */}
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                  </svg>
                </button>
              </div>

              {/* Lado Direito - Contador e Ícones de Visualização */}
              <div className="flex items-center gap-3">
                {/* Contador de Fornecedores */}
                <span className="text-sm text-gray-600">
                  {error ? '0 Fornecedores' : `${fornecedoresFiltrados.length} Fornecedores`}
                </span>

                {/* Ícones de Visualização */}
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-gray-100 text-gray-900' 
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
                    className={`p-2 transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    title="Visualização em lista"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Fornecedores Grid/List */}
          <div className="flex-1 flex flex-col">
            {loading === ('loading' as LoadingState) ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-500">Carregando fornecedores...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="icon-container red mx-auto mb-4" style={{ width: '64px', height: '64px' }}>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {errorInfo?.type === 'network' ? 'Sem Conexão com a API' :
                     errorInfo?.type === 'notfound' ? 'Endpoint Não Encontrado' :
                     errorInfo?.type === 'server' ? 'Problema no Servidor' :
                     'Sistema Indisponível'}
                  </h4>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {errorInfo?.type === 'network' ? 'Não foi possível carregar os dados dos fornecedores. Verifique sua conexão.' :
                     errorInfo?.type === 'notfound' ? 'A rota da API foi alterada. Os dados não podem ser carregados no momento.' :
                     errorInfo?.type === 'server' ? 'O servidor está com problemas. Tente novamente em alguns minutos.' :
                     'Ocorreu um erro inesperado. Entre em contato com o suporte.'}
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={refetch}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Tentar Novamente</span>
                    </button>
                    <button
                      onClick={handleCreateFornecedor}
                      className="btn-primary flex items-center space-x-2"
                      title="Funcionalidade disponível mesmo com erro na API"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adicionar Fornecedor</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : fornecedoresFiltrados.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="icon-container orange mx-auto mb-4" style={{ width: '64px', height: '64px' }}>
                    <Users className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {fornecedores.length === 0 ? 'Nenhum fornecedor cadastrado' : 'Nenhum fornecedor encontrado'}
                  </h4>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {fornecedores.length === 0 
                      ? 'Você ainda não possui fornecedores cadastrados no sistema. Comece adicionando seu primeiro fornecedor.'
                      : 'Tente ajustar os filtros ou limpar a busca para ver mais fornecedores.'
                    }
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={handleCreateFornecedor}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{fornecedores.length === 0 ? 'Adicionar Primeiro Fornecedor' : 'Adicionar Fornecedor'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="flex-1 flex flex-col">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 content-start">
              {fornecedoresFiltrados.map(fornecedor => (
                <div key={fornecedor.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{fornecedor.nome}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          fornecedor.status === 'ativo' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {fornecedor.status}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEditFornecedor(fornecedor)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Editar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{fornecedor.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{fornecedor.telefone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{fornecedor.cidade}, {fornecedor.estado}</span>
                    </div>
                  </div>
                  </div>
                ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-auto">
                  <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fornecedor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localização</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fornecedoresFiltrados.map(fornecedor => (
                    <tr key={fornecedor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                            <Building2 className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{fornecedor.nome}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{fornecedor.email}</div>
                        <div className="text-sm text-gray-500">{fornecedor.telefone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{fornecedor.cidade}</div>
                        <div className="text-sm text-gray-500">{fornecedor.estado}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          fornecedor.status === 'ativo' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {fornecedor.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditFornecedor(fornecedor)}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                  </table>
                </div>
              </div>
            )
          }
          </div>

          {/* Paginação */}
          {fornecedoresFiltrados.length > 0 && totalPages > 1 && (
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, total)} de {total} fornecedores
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Anterior
                  </button>
                  <span className="px-3 py-1 text-sm">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal de Novo Fornecedor */}
        <NovoFornecedorModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveFornecedor}
        />

        {/* Modal de Editar Fornecedor */}
        <EditarFornecedorModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingFornecedor(null);
          }}
          fornecedor={editingFornecedor}
          onSave={handleSaveEditFornecedor}
          onDelete={handleDeleteFornecedor}
        />

        {/* Debug Component - apenas em desenvolvimento */}
        {process.env.NODE_ENV === 'development' && <FornecedoresDebug />}
      </div>
    </DashboardLayout>
  );
}