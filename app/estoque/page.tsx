'use client';

import React, { useState } from 'react';
import { Package, Plus, AlertTriangle, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useEstoque } from '../../hooks/useEstoque';
import { useProdutos } from '../../hooks/useProdutos';
import { Estoque } from '../../types/entities';
import { formatCurrency } from '../../lib/utils';
import { MESSAGES } from '../../constants/index';

export default function EstoquePage() {
  // Estados locais para UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedProduto, setSelectedProduto] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showModal, setShowModal] = useState(false);
  const [editingEstoque, setEditingEstoque] = useState<Estoque | null>(null);

  // Hooks para gerenciar dados
  const {
    estoque: allEstoque,
    loading,
    error,
    total,
    totalPages,
    createEstoque,
    updateEstoque,
    deleteEstoque,
    updateQuantidade,
    getTotalQuantidadePorProduto,
    refetch
  } = useEstoque({});

  const { produtos } = useProdutos({});

  // Função para filtrar estoque
  const filteredEstoque = allEstoque.filter(item => {
    const matchesSearch = !searchTerm || 
      item.id_lote.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.data_entrada.includes(searchTerm);

    const matchesStatus = !selectedStatus || item.status === selectedStatus;
    const matchesProduto = !selectedProduto || item.id_produto.toString() === selectedProduto;

    return matchesSearch && matchesStatus && matchesProduto;
  });

  // Funções auxiliares
  const getProdutoNome = (id: number) => {
    const produto = produtos.find(p => p.id === id);
    return produto?.nome_produto || `Produto ${id}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponível':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'reservado':
        return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'vendido':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'vencido':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'disponível':
        return 'bg-green-500';
      case 'reservado':
        return 'bg-yellow-500';
      case 'vendido':
        return 'bg-blue-500';
      case 'vencido':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Handlers
  const handleCreateEstoque = () => {
    setEditingEstoque(null);
    setShowModal(true);
  };

  const handleEditEstoque = (item: Estoque) => {
    setEditingEstoque(item);
    setShowModal(true);
  };

  const handleDeleteEstoque = async (id: number) => {
    if (confirm(MESSAGES.CONFIRM.DELETE)) {
      try {
        await deleteEstoque(id);
      } catch (error) {
        console.error('Erro ao excluir item do estoque:', error);
      }
    }
  };

  // Cálculos para estatísticas
  const totalItens = allEstoque.length;
  const itensDisponiveis = allEstoque.filter(e => e.status === 'disponível').length;
  const itensReservados = allEstoque.filter(e => e.status === 'reservado').length;
  const valorTotalEstoque = allEstoque
    .filter(e => e.status === 'disponível')
    .reduce((sum, e) => sum + (e.quantidade * e.custo_unitario), 0);

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
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Estoque</h1>
              <p className="text-sm text-gray-600">Gerencie seu estoque e lotes de produtos</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCreateEstoque}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl text-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova Entrada</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-xs text-green-600 font-medium">+3.2%</div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Total de Itens</p>
              <p className="text-xl font-bold text-gray-900">{totalItens}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-xs text-green-600 font-medium">+8.1%</div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Itens Disponíveis</p>
              <p className="text-xl font-bold text-gray-900">{itensDisponiveis}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              </div>
              <div className="text-xs text-yellow-600 font-medium">-1.2%</div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Itens Reservados</p>
              <p className="text-xl font-bold text-gray-900">{itensReservados}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-xs text-green-600 font-medium">+15.3%</div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Valor Total</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(valorTotalEstoque)}</p>
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
                placeholder="Buscar por lote ou data..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 bg-gray-50 focus:bg-white text-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
            </div>

            {/* Status Filter */}
            <select
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 focus:bg-white transition-colors duration-200 text-sm"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Todos os status</option>
              <option value="disponível">Disponível</option>
              <option value="reservado">Reservado</option>
              <option value="vendido">Vendido</option>
              <option value="vencido">Vencido</option>
            </select>

            {/* Produto Filter */}
            <select
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 focus:bg-white transition-colors duration-200 text-sm"
              value={selectedProduto}
              onChange={(e) => setSelectedProduto(e.target.value)}
            >
              <option value="">Todos os produtos</option>
              {produtos.map(produto => (
                <option key={produto.id} value={produto.id}>{produto.nome_produto}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Estoque List */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">Controle de Estoque</h3>
              <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                {filteredEstoque.length} itens
              </span>
            </div>

            {filteredEstoque.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-10 h-10 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Nenhum item encontrado</h4>
                <p className="text-gray-500 mb-6">Tente ajustar os filtros ou adicione novos itens ao estoque</p>
                <button
                  onClick={handleCreateEstoque}
                  className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  <span>Adicionar Item</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider">Produto</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider">Lote</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider">Quantidade</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider">Custo Unit.</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider">Valor Total</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider">Data Entrada</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider">Status</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredEstoque.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900 text-sm">{getProdutoNome(item.id_produto)}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600 font-mono">{item.id_lote}</div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="text-sm font-medium text-gray-900">{item.quantidade}</div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="text-sm text-gray-600">{formatCurrency(item.custo_unitario)}</div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(item.quantidade * item.custo_unitario)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {formatDate(item.data_entrada)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(item.status)}`}>
                            <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusIcon(item.status)}`} />
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEditEstoque(item)}
                              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors duration-150"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteEstoque(item.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-150"
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}