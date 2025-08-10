'use client';

import React, { useState, useEffect } from 'react';
import { Package, Plus, TrendingUp, AlertTriangle, Calendar, DollarSign } from 'lucide-react';
import { useAuthCheck } from '../../hooks/useAuthCheck';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useEstoque } from '../../hooks/useEstoque';
import { LoadingState } from '../../types/common';
import { NovoItemEstoqueModal } from '../../components/estoque/NovoItemEstoqueModal';

export default function EstoquePage() {
  // Verificação de autenticação
  const { isAuthenticated, requireAuth } = useAuthCheck();

  // Estados locais para UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Estados para colunas opcionais
  const [showLote, setShowLote] = useState(false);
  const [showDataSaida, setShowDataSaida] = useState(false);
  const [showDocReferencia, setShowDocReferencia] = useState(false);

  // Hook para gerenciar estoque
  const {
    itensEstoque,
    loading,
    error,
    total,
    totalPages,
    createItemEstoque,
    deleteItemEstoque,
    refetch
  } = useEstoque({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    status: selectedStatus
  });

  // Verificar autenticação
  useEffect(() => {
    if (isAuthenticated === false) {
      requireAuth();
    }
  }, [isAuthenticated, requireAuth]);

  // Cálculos para métricas
  const totalItens = itensEstoque.length;
  const itensAtivos = itensEstoque.filter(item => item.status === 'ativo').length;
  const quantidadeTotal = itensEstoque.reduce((acc, item) => acc + (item.quantidade || 0), 0);
  const itensVencendo = itensEstoque.filter(item => {
    if (!item.vencimento) return false;
    const hoje = new Date();
    const validade = new Date(item.vencimento);
    const diasParaVencer = Math.ceil((validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    return diasParaVencer <= 30 && diasParaVencer > 0;
  }).length;

  // Handlers
  const handleCreateItem = () => {
    setShowModal(true);
  };

  const handleDeleteItem = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este item do estoque?')) {
      try {
        await deleteItemEstoque(id);
        console.log('Item excluído com sucesso');
      } catch (error) {
        console.error('Erro ao excluir item:', error);
        alert('Erro ao excluir item. Tente novamente.');
      }
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Loading state
  if (isAuthenticated === null || loading === 'loading') {
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
              onClick={() => refetch()}
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
      <div className="p-6 max-w-full overflow-x-hidden flex-1 flex flex-col">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric orange">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">
                  {error ? '--' : totalItens}
                </p>
                <p className="text-sm text-gray-500">Total de Itens</p>
                {error && <p className="text-xs text-gray-500">Dados indisponíveis</p>}
              </div>
            </div>
          </div>

          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric green">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">
                  {error ? '--' : itensAtivos}
                </p>
                <p className="text-sm text-gray-500">Itens Ativos</p>
                {error && <p className="text-xs text-gray-500">Dados indisponíveis</p>}
              </div>
            </div>
          </div>

          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric blue">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">
                  {error ? '--' : quantidadeTotal.toLocaleString('pt-BR')}
                </p>
                <p className="text-sm text-gray-500">Quantidade Total</p>
                {error && <p className="text-xs text-gray-500">Dados indisponíveis</p>}
              </div>
            </div>
          </div>

          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric yellow">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">
                  {error ? '--' : itensVencendo}
                </p>
                <p className="text-sm text-gray-500">Vencendo em 30 dias</p>
                {error && <p className="text-xs text-gray-500">Dados indisponíveis</p>}
              </div>
            </div>
          </div>
        </div>     
   {/* Título da Seção */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Gestão de Estoque</h2>
            <p className="text-sm text-gray-500">Controle seu inventário, monitore quantidades e gerencie validades.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCreateItem}
              className="btn-primary flex items-center space-x-2 text-sm px-4 py-2"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Item</span>
            </button>
          </div>
        </div>

        {/* Lista de Estoque */}
        <div className="card flex-1 flex flex-col">
          {/* Filtros */}
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
                    placeholder={error ? "Busca indisponível..." : "Buscar itens..."}
                    className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 bg-white text-sm w-64"
                    onChange={(e) => handleSearchChange(e.target.value)}
                    value={searchTerm}
                    disabled={!!error}
                  />
                </div>

                {/* Status Filter */}
                <select
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm min-w-[140px]"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  disabled={!!error}
                >
                  <option value="">Todos os Status</option>
                  {!error && (
                    <>
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                      <option value="vencido">Vencido</option>
                    </>
                  )}
                </select>

                {/* Controles de Colunas */}
                <div className="flex items-center space-x-2 border border-gray-200 rounded-lg p-2">
                  <span className="text-xs text-gray-500 font-medium">Colunas:</span>
                  <label className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={showLote}
                      onChange={(e) => setShowLote(e.target.checked)}
                      className="w-3 h-3 text-orange-500 rounded focus:ring-orange-500"
                    />
                    <span className="text-xs text-gray-600">Lote</span>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={showDataSaida}
                      onChange={(e) => setShowDataSaida(e.target.checked)}
                      className="w-3 h-3 text-orange-500 rounded focus:ring-orange-500"
                    />
                    <span className="text-xs text-gray-600">Data Saída</span>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={showDocReferencia}
                      onChange={(e) => setShowDocReferencia(e.target.checked)}
                      className="w-3 h-3 text-orange-500 rounded focus:ring-orange-500"
                    />
                    <span className="text-xs text-gray-600">Doc. Ref.</span>
                  </label>
                </div>
              </div>

              {/* Lado Direito - Contador e Visualização */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {error ? '0 Itens' : `${itensEstoque.length} Itens`}
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
    {/* Conteúdo Principal */}
          <div className="flex-1 flex flex-col">
            {loading === ('loading' as LoadingState) ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-500">Carregando estoque...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="icon-container red mx-auto mb-4" style={{ width: '64px', height: '64px' }}>
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Sistema Indisponível</h4>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Não foi possível carregar os dados do estoque. Verifique sua conexão ou tente novamente.
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
                      onClick={handleCreateItem}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adicionar Item</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : itensEstoque.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="icon-container orange mx-auto mb-4" style={{ width: '64px', height: '64px' }}>
                    <Package className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Não existe nenhum registro no estoque atualmente
                  </h4>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Você ainda não possui itens cadastrados no estoque. Comece adicionando seu primeiro item.
                  </p>
                  <button
                    onClick={handleCreateItem}
                    className="btn-primary flex items-center space-x-2 mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Primeiro Item</span>
                  </button>
                </div>
              </div>     
       ) : viewMode === 'grid' ? (
              <div className="flex-1 flex flex-col">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 content-start">
                  {itensEstoque.map((item, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{item.nome_produto}</h3>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === 'ativo' 
                                ? 'bg-green-100 text-green-800' 
                                : item.status === 'vencido'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteItem(index)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Excluir"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Lote:</span>
                          <span className="font-medium">{item.lote}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quantidade:</span>
                          <span className="font-medium">{item.quantidade}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Data Entrada:</span>
                          <span className="font-medium">
                            {item.data_entrada ? new Date(item.data_entrada).toLocaleDateString('pt-BR') : '-'}
                          </span>
                        </div>
                        {item.data_saida && (
                          <div className="flex justify-between">
                            <span>Data Saída:</span>
                            <span className="font-medium">{new Date(item.data_saida).toLocaleDateString('pt-BR')}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Vencimento:</span>
                          <span className="font-medium">
                            {item.vencimento ? new Date(item.vencimento).toLocaleDateString('pt-BR') : '-'}
                          </span>
                        </div>
                        {item.documento_referencia && (
                          <div className="flex justify-between">
                            <span>Doc. Ref.:</span>
                            <span className="font-medium">{item.documento_referencia}</span>
                          </div>
                        )}
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                        {showLote && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lote</th>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Entrada</th>
                        {showDataSaida && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Saída</th>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimento</th>
                        {showDocReferencia && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doc. Referência</th>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {itensEstoque.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {/* Produto */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <Package className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{item.nome_produto}</div>
                              </div>
                            </div>
                          </td>

                          {/* Lote (opcional) */}
                          {showLote && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{item.lote}</div>
                            </td>
                          )}
                          {/* Quantidade */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.quantidade}</div>
                          </td>

                          {/* Data Entrada */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {item.data_entrada ? new Date(item.data_entrada).toLocaleDateString('pt-BR') : '-'}
                            </div>
                          </td>

                          {/* Data Saída (opcional) */}
                          {showDataSaida && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {item.data_saida ? new Date(item.data_saida).toLocaleDateString('pt-BR') : '-'}
                              </div>
                            </td>
                          )}
                          {/* Vencimento */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {item.vencimento ? new Date(item.vencimento).toLocaleDateString('pt-BR') : '-'}
                            </div>
                          </td>

                          {/* Documento Referência (opcional) */}
                          {showDocReferencia && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{item.documento_referencia || '-'}</div>
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === 'ativo' 
                                ? 'bg-green-100 text-green-800' 
                                : item.status === 'vencido'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleDeleteItem(index)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Excluir item"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>   
        {/* Modal de Novo Item */}
        <NovoItemEstoqueModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={() => {
            refetch();
          }}
          createItemEstoque={createItemEstoque}
        />
      </div>
    </DashboardLayout>
  );
}