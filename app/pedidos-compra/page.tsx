'use client';

import React, { useState } from 'react';
import { ShoppingCart, Plus, Package, Truck, Calendar, DollarSign } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { usePedidosCompra } from '../../hooks/usePedidosCompra';
import { useFornecedores } from '../../hooks/useFornecedores';
import { useProdutos } from '../../hooks/useProdutos';
import { PedidoCompra, ItemPedido } from '../../types/entities';
import { formatCurrency } from '../../lib/utils';
import { MESSAGES } from '../../constants/index';

export default function PedidosCompraPage() {
  // Estados locais para UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFornecedor, setSelectedFornecedor] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showModal, setShowModal] = useState(false);
  const [editingPedido, setEditingPedido] = useState<PedidoCompra | null>(null);
  const [expandedPedido, setExpandedPedido] = useState<number | null>(null);

  // Hooks para gerenciar dados
  const {
    pedidos: allPedidos,
    itens: allItens,
    loading,
    error,
    total,
    totalPages,
    createPedido,
    updatePedido,
    deletePedido,
    getItensByPedido,
    refetch
  } = usePedidosCompra({});

  const { fornecedores } = useFornecedores({});
  const { produtos } = useProdutos({});

  // Função para filtrar pedidos
  const filteredPedidos = allPedidos.filter(pedido => {
    const matchesSearch = !searchTerm ||
      pedido.descricao_pedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.data_pedido.includes(searchTerm) ||
      pedido.data_entrega.includes(searchTerm);

    const matchesFornecedor = !selectedFornecedor || pedido.id_fornecedor.toString() === selectedFornecedor;

    return matchesSearch && matchesFornecedor;
  });

  // Funções auxiliares
  const getFornecedorNome = (id: number) => {
    const fornecedor = fornecedores.find(f => f.id === id);
    return fornecedor?.nome || `Fornecedor ${id}`;
  };

  const getProdutoNome = (id: number) => {
    const produto = produtos.find(p => p.id === id);
    return produto?.nome_produto || `Produto ${id}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusEntrega = (dataEntrega: string) => {
    const hoje = new Date();
    const entrega = new Date(dataEntrega);

    if (entrega < hoje) {
      return { status: 'entregue', color: 'green', text: 'Entregue' };
    } else {
      return { status: 'pendente', color: 'orange', text: 'Pendente' };
    }
  };

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
    if (confirm(MESSAGES.CONFIRM.DELETE)) {
      try {
        await deletePedido(id);
      } catch (error) {
        console.error('Erro ao excluir pedido:', error);
      }
    }
  };

  const toggleExpandPedido = (pedidoId: number) => {
    setExpandedPedido(expandedPedido === pedidoId ? null : pedidoId);
  };

  // Cálculos para estatísticas
  const totalPedidos = allPedidos.length;
  const pedidosEntregues = allPedidos.filter(p => new Date(p.data_entrega) < new Date()).length;
  const pedidosPendentes = totalPedidos - pedidosEntregues;
  const valorTotalPedidos = allPedidos.reduce((sum, p) => sum + p.valor_total, 0);

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
  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <button
              onClick={refetch}
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
      <div className="space-y-4" style={{ padding: '4rem' }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Pedidos de Compra</h1>
              <p className="text-sm text-gray-600">Gerencie seus pedidos de compra e fornecedores</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCreatePedido}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl text-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Pedido</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-xs text-green-600 font-medium">+8.2%</div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Total de Pedidos</p>
              <p className="text-xl font-bold text-gray-900">{totalPedidos}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-xs text-green-600 font-medium">+5.1%</div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Pedidos Entregues</p>
              <p className="text-xl font-bold text-gray-900">{pedidosEntregues}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                <Truck className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-xs text-orange-600 font-medium">-2.3%</div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Pedidos Pendentes</p>
              <p className="text-xl font-bold text-gray-900">{pedidosPendentes}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-xs text-green-600 font-medium">+12.5%</div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Valor Total</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(valorTotalPedidos)}</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="w-80 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar pedidos..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-gray-50 focus:bg-white text-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
            </div>

            {/* Fornecedor Filter */}
            <select
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 focus:bg-white transition-colors duration-200 text-sm"
              value={selectedFornecedor}
              onChange={(e) => setSelectedFornecedor(e.target.value)}
            >
              <option value="">Todos os fornecedores</option>
              {fornecedores.map(fornecedor => (
                <option key={fornecedor.id} value={fornecedor.id}>{fornecedor.nome}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Pedidos List */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">Lista de Pedidos de Compra</h3>
              <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                {filteredPedidos.length} pedidos
              </span>
            </div>

            {filteredPedidos.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-10 h-10 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h4>
                <p className="text-gray-500 mb-6">Tente ajustar os filtros ou adicione novos pedidos</p>
                <button
                  onClick={handleCreatePedido}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  <span>Adicionar Pedido</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPedidos.map(pedido => {
                  const statusEntrega = getStatusEntrega(pedido.data_entrega);
                  const itensPedido = getItensByPedido(pedido.id);
                  const isExpanded = expandedPedido === pedido.id;

                  return (
                    <div key={pedido.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Cabeçalho do Pedido */}
                      <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900">Pedido #{pedido.id}</span>
                              <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${statusEntrega.status === 'entregue'
                                ? 'bg-green-50 text-green-600 border border-green-200'
                                : 'bg-orange-50 text-orange-600 border border-orange-200'
                                }`}>
                                <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusEntrega.status === 'entregue' ? 'bg-green-500' : 'bg-orange-500'
                                  }`} />
                                {statusEntrega.text}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">{getFornecedorNome(pedido.id_fornecedor)}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="text-sm font-bold text-gray-900">{formatCurrency(pedido.valor_total)}</div>
                              <div className="text-xs text-gray-500">{itensPedido.length} itens</div>
                            </div>
                            <button
                              onClick={() => toggleExpandPedido(pedido.id)}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-150"
                            >
                              <svg className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            <span>Pedido: {formatDate(pedido.data_pedido)}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Truck className="w-4 h-4 mr-2 text-gray-400" />
                            <span>Entrega: {formatDate(pedido.data_entrega)}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                            <span>Frete: {formatCurrency(pedido.valor_frete)}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Package className="w-4 h-4 mr-2 text-gray-400" />
                            <span>Produtos: {formatCurrency(pedido.custo_pedido)}</span>
                          </div>
                        </div>

                        {pedido.descricao_pedido && (
                          <div className="mt-3 text-sm text-gray-600">
                            <span className="font-medium">Descrição:</span> {pedido.descricao_pedido}
                          </div>
                        )}
                      </div>

                      {/* Detalhes dos Itens (Expandível) */}
                      {isExpanded && (
                        <div className="p-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Itens do Pedido</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-gray-100">
                                  <th className="text-left py-2 font-medium text-gray-500">Produto</th>
                                  <th className="text-center py-2 font-medium text-gray-500">Quantidade</th>
                                  <th className="text-right py-2 font-medium text-gray-500">Preço Unit.</th>
                                  <th className="text-right py-2 font-medium text-gray-500">Subtotal</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-50">
                                {itensPedido.map(item => (
                                  <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="py-2 text-gray-900">{getProdutoNome(item.id_produto)}</td>
                                    <td className="py-2 text-center text-gray-600">{item.quantidade}</td>
                                    <td className="py-2 text-right text-gray-600">{formatCurrency(item.preco_unitario)}</td>
                                    <td className="py-2 text-right font-medium text-gray-900">{formatCurrency(item.subtotal)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}