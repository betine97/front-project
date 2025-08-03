'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Package, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { useAuthCheck } from '../../hooks/useAuthCheck';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Pagination } from '../../components/produtos/Pagination';
import { usePedidosCompra } from '../../hooks/usePedidosCompra';
import { PedidoCompra } from '../../types/entities';
import { LoadingState } from '../../types/common';

export default function PedidosCompraPage() {
  // Verificação de autenticação
  const { isAuthenticated, requireAuth } = useAuthCheck();

  // Estados locais para UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFornecedor, setSelectedFornecedor] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showModal, setShowModal] = useState(false);
  const [editingPedido, setEditingPedido] = useState<PedidoCompra | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Hook para gerenciar pedidos de compra
  const {
    pedidos,
    loading,
    error,
    total,
    totalPages,
    createPedido,
    updatePedido,
    deletePedido,
    refetch
  } = usePedidosCompra({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    fornecedor: selectedFornecedor
  });

  // Verificar autenticação
  useEffect(() => {
    if (isAuthenticated === false) {
      requireAuth();
    }
  }, [isAuthenticated, requireAuth]);

  // Handlers
  const handleCreatePedido = () => {
    setEditingPedido(null);
    setShowModal(true);
  };

  const handleEditPedido = (pedido: PedidoCompra) => {
    setEditingPedido(pedido);
    setShowModal(true);
  };

  const handleDeletePedido = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este pedido de compra?')) {
      try {
        await deletePedido(id);
        console.log('Pedido excluído com sucesso');
      } catch (error) {
        console.error('Erro ao excluir pedido:', error);
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

  // Calcular estatísticas
  const totalPedidos = pedidos.length;
  const pedidosPendentes = pedidos.filter(p => p.status === 'pendente').length;
  const valorTotalPedidos = pedidos.reduce((acc, p) => acc + p.valor_total, 0);
  const valorMedioPedido = totalPedidos > 0 ? valorTotalPedidos / totalPedidos : 0;

  // Fornecedores únicos para filtro
  const fornecedoresUnicos = Array.from(new Set(pedidos.map(p => p.id_fornecedor))).filter(Boolean);

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

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Erro ao carregar pedidos</h3>
            <p className="text-red-800 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
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
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{totalPedidos}</p>
                <p className="text-sm text-gray-500">Total de Pedidos</p>
              </div>
            </div>
          </div>

          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric yellow">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{pedidosPendentes}</p>
                <p className="text-sm text-gray-500">Pedidos Pendentes</p>
              </div>
            </div>
          </div>

          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric green">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">
                  R$ {valorTotalPedidos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-gray-500">Valor Total</p>
              </div>
            </div>
          </div>

          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric blue">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">
                  R$ {valorMedioPedido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-gray-500">Valor Médio</p>
              </div>
            </div>
          </div>
        </div>

        {/* Título da Seção */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Gestão de Pedidos de Compra</h2>
            <p className="text-sm text-gray-500">Gerencie seus pedidos de compra, acompanhe entregas e controle custos.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCreatePedido}
              className="btn-primary flex items-center space-x-2 text-sm px-4 py-2"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Pedido</span>
            </button>
          </div>
        </div>

        {/* Tabela de Pedidos */}
        <div className="card flex-1 flex flex-col">
          {/* Filtros */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Buscar pedidos..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedFornecedor}
                  onChange={(e) => setSelectedFornecedor(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Todos os Fornecedores</option>
                  {fornecedoresUnicos.map(fornecedorId => (
                    <option key={fornecedorId} value={fornecedorId}>
                      Fornecedor {fornecedorId}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Todos os Status</option>
                  <option value="pendente">Pendente</option>
                  <option value="aprovado">Aprovado</option>
                  <option value="entregue">Entregue</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Conteúdo da Tabela */}
          <div className="flex-1 flex flex-col">
            {loading === ('loading' as LoadingState) ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-500">Carregando pedidos...</p>
                </div>
              </div>
            ) : pedidos.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="icon-container orange mx-auto mb-4" style={{ width: '64px', height: '64px' }}>
                    <ShoppingCart className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Nenhum pedido encontrado</h4>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Tente ajustar os filtros ou crie seu primeiro pedido de compra.
                  </p>
                  <button
                    onClick={handleCreatePedido}
                    className="btn-primary flex items-center space-x-2 mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Criar Primeiro Pedido</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Pedido</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Fornecedor</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Data Pedido</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Data Entrega</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Valor Total</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pedidos.map((pedido) => (
                      <tr key={pedido.id_pedido} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">#{pedido.id_pedido}</p>
                            <p className="text-sm text-gray-500 truncate max-w-xs">
                              {pedido.descricao_pedido}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-gray-900">Fornecedor {pedido.id_fornecedor}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-gray-900">
                            {new Date(pedido.data_pedido).toLocaleDateString('pt-BR')}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-gray-900">
                            {new Date(pedido.data_entrega).toLocaleDateString('pt-BR')}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-gray-900">
                            R$ {pedido.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            pedido.status === 'entregue' ? 'bg-green-100 text-green-800' :
                            pedido.status === 'aprovado' ? 'bg-blue-100 text-blue-800' :
                            pedido.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {pedido.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditPedido(pedido)}
                              className="text-orange-600 hover:text-orange-800 p-1"
                              title="Editar"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeletePedido(pedido.id_pedido)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Excluir"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Paginação */}
            {pedidos.length > 0 && totalPages > 1 && (
              <div className="border-t border-gray-200 p-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={total}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>

        {/* Modal de Novo/Editar Pedido - Placeholder */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-100">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingPedido ? 'Editar Pedido' : 'Novo Pedido de Compra'}
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
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-900">Modal em desenvolvimento</h4>
                      <p className="text-sm text-blue-700">
                        Modal de criação/edição de pedidos será implementado em breve.
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
                    {editingPedido ? 'Atualizar' : 'Criar'} Pedido
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