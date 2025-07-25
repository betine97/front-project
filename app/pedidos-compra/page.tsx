'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Package, Truck, DollarSign } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { NewPedidoModal } from '../../components/produtos/NewPedidoModal';
import { usePedidosCompra } from '../../hooks/usePedidosCompra';
import { useFornecedores } from '../../hooks/useFornecedores';
import { useProdutos } from '../../hooks/useProdutos';
import { PedidoCompra } from '../../types/entities';
import { formatCurrency } from '../../lib/utils';
import { MESSAGES } from '../../constants/index';



export default function PedidosCompraPage() {
  // Estados locais para UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFornecedor, setSelectedFornecedor] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedProdutos, setSelectedProdutos] = useState<string[]>([]);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [tipoData, setTipoData] = useState<'pedido' | 'entrega'>('pedido');
  const [valorMin, setValorMin] = useState('');
  const [valorMax, setValorMax] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showValueRange, setShowValueRange] = useState(false);
  const [showDateRange, setShowDateRange] = useState(false);
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  const [tipoOrdenacao, setTipoOrdenacao] = useState('');
  const [campoOrdenacao, setCampoOrdenacao] = useState('');
  const [direcaoOrdenacao, setDirecaoOrdenacao] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  // Função para alternar entre visualizações em grade e lista
  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };
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

  // Effect para fechar dropdowns quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        setShowProductsDropdown(false);
        setShowValueRange(false);
        setShowDateRange(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Função para filtrar e ordenar pedidos
  const filteredPedidos = allPedidos.filter(pedido => {
    const matchesSearch = !searchTerm ||
      pedido.descricao_pedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.data_pedido.includes(searchTerm) ||
      pedido.data_entrega.includes(searchTerm);

    const matchesFornecedor = !selectedFornecedor || pedido.id_fornecedor.toString() === selectedFornecedor;

    // Filtro por status
    const matchesStatus = !selectedStatus || getStatusEntrega(pedido.status).status === selectedStatus;

    // Filtro por produtos
    const itensPedido = getItensByPedido(pedido.id_pedido);
    const matchesProduto = selectedProdutos.length === 0 || itensPedido.some(item => selectedProdutos.includes(item.id_produto.toString()));

    // Filtro por período
    let matchesPeriodo = true;
    if (dataInicio || dataFim) {
      const dataComparacao = tipoData === 'pedido' ? new Date(pedido.data_pedido) : new Date(pedido.data_entrega);
      const inicio = dataInicio ? new Date(dataInicio) : null;
      const fim = dataFim ? new Date(dataFim) : null;

      if (inicio && dataComparacao < inicio) matchesPeriodo = false;
      if (fim && dataComparacao > fim) matchesPeriodo = false;
    }

    // Filtro por valor
    let matchesValor = true;
    if (valorMin && pedido.valor_total < parseFloat(valorMin)) matchesValor = false;
    if (valorMax && pedido.valor_total > parseFloat(valorMax)) matchesValor = false;

    return matchesSearch && matchesFornecedor && matchesStatus && matchesProduto && matchesPeriodo && matchesValor;
  }).sort((a, b) => {
    // Aplicar ordenação baseada nos novos estados
    if (!tipoOrdenacao || !direcaoOrdenacao) return 0;

    let comparison = 0;

    if (tipoOrdenacao === 'data') {
      const dataA = campoOrdenacao === 'entrega' ? new Date(a.data_entrega) : new Date(a.data_pedido);
      const dataB = campoOrdenacao === 'entrega' ? new Date(b.data_entrega) : new Date(b.data_pedido);
      comparison = dataA.getTime() - dataB.getTime();
    } else if (tipoOrdenacao === 'valor') {
      comparison = a.valor_total - b.valor_total;
    } else if (tipoOrdenacao === 'fornecedor') {
      comparison = getFornecedorNome(a.id_fornecedor).localeCompare(getFornecedorNome(b.id_fornecedor));
    } else if (tipoOrdenacao === 'status') {
      const statusA = getStatusEntrega(a.status).status;
      const statusB = getStatusEntrega(b.status).status;
      comparison = statusA.localeCompare(statusB);
    }

    return direcaoOrdenacao === 'desc' ? -comparison : comparison;
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

  const getStatusEntrega = (status: string) => {
    switch (status.toLowerCase()) {
      case 'entregue':
        return { status: 'entregue', color: 'green', text: 'Entregue' };
      case 'pendente':
        return { status: 'pendente', color: 'orange', text: 'Pendente' };
      case 'em_transporte':
      case 'em transporte':
        return { status: 'em_transporte', color: 'blue', text: 'Em Transporte' };
      case 'cancelado':
        return { status: 'cancelado', color: 'red', text: 'Cancelado' };
      case 'processando':
        return { status: 'processando', color: 'yellow', text: 'Processando' };
      default:
        return { status: 'pendente', color: 'gray', text: status || 'Pendente' };
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
        // Após excluir, atualiza a lista de pedidos
        refetch();
      } catch (error) {
        console.error('Erro ao excluir pedido:', error);
      }
    }
  };

  const handleSavePedido = async (pedidoData: Omit<PedidoCompra, 'id_pedido'>) => {
    try {
      if (editingPedido) {
        await updatePedido(editingPedido.id_pedido, pedidoData);
      } else {
        const pedidoParaCriar = { ...pedidoData } as any;
        await createPedido(pedidoParaCriar);
      }
      refetch();
    } catch (error) {
      console.error('Erro ao salvar pedido:', error);
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
            <div className="h-64 bg-gray-200 rounded">            </div>
          </div>
        </div>

        {/* Modal de Novo/Editar Pedido */}
        <NewPedidoModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          pedido={editingPedido}
          onSave={handleSavePedido}
        />
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
      <div className="p-6 max-w-full overflow-x-hidden space-y-3">
        {/* Stats Cards - Estilo ClickUp/Itaú */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric orange">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{totalPedidos} pedidos total</p>
              </div>
            </div>
          </div>

          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric gray">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{pedidosEntregues} entregues</p>
              </div>
            </div>
          </div>

          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric gray">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{pedidosPendentes} pendentes</p>
              </div>
            </div>
          </div>

          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric gray">
                <DollarSign className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg font-bold text-gray-900 truncate">{formatCurrency(valorTotalPedidos)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo de Compras */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Resumo de Compras</h3>
              <p className="text-sm text-gray-600">Casa de Ração Premium - Gestão de Pedidos</p>
            </div>
            <div className="flex items-center text-blue-600">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(valorTotalPedidos)}</p>
              <p className="text-sm text-gray-600">Total em Pedidos</p>
              <p className="text-xs text-green-600 font-medium">+8,5% vs mês anterior</p>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{totalPedidos}</p>
              <p className="text-sm text-gray-600">Pedidos Ativos</p>
              <p className="text-xs text-blue-600 font-medium">{pedidosPendentes} pendentes</p>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{fornecedores.length}</p>
              <p className="text-sm text-gray-600">Fornecedores</p>
              <p className="text-xs text-gray-500">Cadastrados</p>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{allItens.length}</p>
              <p className="text-sm text-gray-600">Itens Pedidos</p>
              <p className="text-xs text-orange-600 font-medium">Este mês</p>
            </div>
          </div>
        </div>

        {/* Informações Corporativas Expandidas */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestão de Compras</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Coluna 1 - Métricas de Compras */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Métricas de Compras</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Ticket Médio:</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(valorTotalPedidos / (totalPedidos || 1))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Prazo Médio Entrega:</span>
                    <span className="text-sm font-medium text-gray-900">7 dias</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Taxa de Entrega:</span>
                    <span className="text-sm font-medium text-green-600">94,2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Economia Negociada:</span>
                    <span className="text-sm font-medium text-blue-600">R$ 45.200</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna 2 - Fornecedores */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Fornecedores</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Fornecedores Ativos:</span>
                    <span className="text-sm font-medium text-gray-900">{fornecedores.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Novos este mês:</span>
                    <span className="text-sm font-medium text-green-600">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avaliação Média:</span>
                    <span className="text-sm font-medium text-yellow-600">4.2/5.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Contratos Ativos:</span>
                    <span className="text-sm font-medium text-gray-900">18</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna 3 - Categorias de Produtos */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Categorias Principais</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Ração Premium:</span>
                    <span className="text-sm font-medium text-gray-900">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Acessórios:</span>
                    <span className="text-sm font-medium text-gray-900">28%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Medicamentos:</span>
                    <span className="text-sm font-medium text-gray-900">18%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Outros:</span>
                    <span className="text-sm font-medium text-gray-900">9%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Linha adicional com informações de performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 pt-6 border-t border-gray-100">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Pedidos em Atraso</h4>
              <p className="text-2xl font-bold text-red-600">3</p>
              <p className="text-xs text-gray-500">Requer atenção</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Estoque Crítico</h4>
              <p className="text-2xl font-bold text-orange-600">12</p>
              <p className="text-xs text-gray-500">Itens abaixo do mínimo</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Aprovações Pendentes</h4>
              <p className="text-2xl font-bold text-blue-600">5</p>
              <p className="text-xs text-gray-500">Aguardando aprovação</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Economia Mensal</h4>
              <p className="text-2xl font-bold text-green-600">8,5%</p>
              <p className="text-xs text-gray-500">vs orçamento</p>
            </div>
          </div>
        </div>

        {/* Header com descrição */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 font-medium">Gerencie seus pedidos de compra e fornecedores</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* View Mode Toggle */}
            <button
              onClick={toggleViewMode}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              title={`Alternar para visualização em ${viewMode === 'list' ? 'grade' : 'lista'}`}
            >
              {viewMode === 'list' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              )}
              <span>{viewMode === 'list' ? 'Grade' : 'Lista'}</span>
            </button>

            {/* Pagination Info */}
            {totalPages > 1 && (
              <div className="text-sm text-gray-500">
                Página 1 de {totalPages} ({total} pedidos)
              </div>
            )}

            {/* Items Info */}
            {allItens.length > 0 && (
              <div className="text-sm text-gray-500">
                {allItens.length} itens no total
              </div>
            )}
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

        {/* Filters and Search */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-visible">
          {/* Barra de Filtros Principal */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {/* Search Bar - Metade do tamanho */}
              <div className="w-1/2 max-w-md relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Buscar pedidos..."
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 bg-gray-50 focus:bg-white text-sm"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
                />
              </div>

              {/* Fornecedores Filter */}
              <select
                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors duration-200 text-sm min-w-[140px]"
                value={selectedFornecedor}
                onChange={(e) => setSelectedFornecedor(e.target.value)}
              >
                <option value="">Fornecedores</option>
                {fornecedores.map(fornecedor => (
                  <option key={fornecedor.id} value={fornecedor.id}>{fornecedor.nome}</option>
                ))}
              </select>

              {/* Produtos Filter - Multi-select */}
              <div className="relative">
                <button
                  onClick={() => setShowProductsDropdown(!showProductsDropdown)}
                  className="flex items-center justify-between px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors duration-200 text-sm min-w-[140px]"
                >
                  <span>{selectedProdutos.length > 0 ? `${selectedProdutos.length} produto${selectedProdutos.length > 1 ? 's' : ''}` : 'Produtos'}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showProductsDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-[99999] max-h-60 overflow-y-auto">
                    {produtos.map(produto => (
                      <label key={produto.id} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedProdutos.includes(produto.id.toString())}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProdutos([...selectedProdutos, produto.id.toString()]);
                            } else {
                              setSelectedProdutos(selectedProdutos.filter(id => id !== produto.id.toString()));
                            }
                          }}
                          className="mr-2 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">{produto.nome_produto}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Filter */}
              <select
                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors duration-200 text-sm min-w-[120px]"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">Status</option>
                <option value="pendente">Pendente</option>
                <option value="processando">Processando</option>
                <option value="em_transporte">Em Transporte</option>
                <option value="entregue">Entregue</option>
                <option value="cancelado">Cancelado</option>
              </select>

              {/* Valor Range Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowValueRange(!showValueRange)}
                  className="flex items-center justify-between px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors duration-200 text-sm min-w-[120px]"
                >
                  <span>{(valorMin || valorMax) ? 'Valor ✓' : 'Valor'}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showValueRange && (
                  <div className="absolute top-full right-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-[99999] p-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Valor Mínimo</label>
                        <input
                          type="range"
                          min="0"
                          max="10000"
                          step="100"
                          value={valorMin || '0'}
                          onChange={(e) => setValorMin(e.target.value)}
                          className="w-full"
                        />
                        <div className="text-xs text-gray-500 mt-1">R$ {formatCurrency(parseFloat(valorMin || '0'))}</div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Valor Máximo</label>
                        <input
                          type="range"
                          min="0"
                          max="50000"
                          step="100"
                          value={valorMax || '50000'}
                          onChange={(e) => setValorMax(e.target.value)}
                          className="w-full"
                        />
                        <div className="text-xs text-gray-500 mt-1">R$ {formatCurrency(parseFloat(valorMax || '50000'))}</div>
                      </div>
                      <div className="flex justify-between pt-2">
                        <button
                          onClick={() => { setValorMin(''); setValorMax(''); setShowValueRange(false); }}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Limpar
                        </button>
                        <button
                          onClick={() => setShowValueRange(false)}
                          className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                        >
                          Aplicar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Data Range Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowDateRange(!showDateRange)}
                  className="flex items-center justify-between px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors duration-200 text-sm min-w-[120px]"
                >
                  <span>{(dataInicio || dataFim) ? 'Data ✓' : 'Data'}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showDateRange && (
                  <div className="absolute top-full right-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-[99999] p-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Tipo de Data</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm"
                          value={tipoData}
                          onChange={(e) => setTipoData(e.target.value as 'pedido' | 'entrega')}
                        >
                          <option value="pedido">Data do Pedido</option>
                          <option value="entrega">Data de Entrega</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">De</label>
                          <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm"
                            value={dataInicio}
                            onChange={(e) => setDataInicio(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Até</label>
                          <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm"
                            value={dataFim}
                            onChange={(e) => setDataFim(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between pt-2">
                        <button
                          onClick={() => { setDataInicio(''); setDataFim(''); setShowDateRange(false); }}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Limpar
                        </button>
                        <button
                          onClick={() => setShowDateRange(false)}
                          className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                        >
                          Aplicar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Filtros Avançados (Ordenação) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-3 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm text-gray-600 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                <span>Ordenar</span>
              </button>
            </div>
          </div>

          {/* Filtros de Ordenação */}
          {showFilters && (
            <div className="p-4 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
                </div>

                {/* Tipo de Ordenação */}
                <select
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-colors duration-200 text-sm min-w-[120px]"
                  value={tipoOrdenacao}
                  onChange={(e) => {
                    setTipoOrdenacao(e.target.value);
                    if (e.target.value === 'data') setCampoOrdenacao('pedido');
                    else setCampoOrdenacao('');
                  }}
                >
                  <option value="">Selecionar</option>
                  <option value="data">Data</option>
                  <option value="valor">Valor</option>
                  <option value="fornecedor">Fornecedor</option>
                  <option value="status">Status</option>
                </select>

                {/* Campo específico para Data */}
                {tipoOrdenacao === 'data' && (
                  <select
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-colors duration-200 text-sm min-w-[130px]"
                    value={campoOrdenacao}
                    onChange={(e) => setCampoOrdenacao(e.target.value)}
                  >
                    <option value="pedido">do Pedido</option>
                    <option value="entrega">de Entrega</option>
                  </select>
                )}

                {/* Direção da Ordenação */}
                {tipoOrdenacao && (
                  <select
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-colors duration-200 text-sm min-w-[140px]"
                    value={direcaoOrdenacao}
                    onChange={(e) => setDirecaoOrdenacao(e.target.value)}
                  >
                    <option value="">Direção</option>
                    {tipoOrdenacao === 'data' && (
                      <>
                        <option value="desc">Mais recente</option>
                        <option value="asc">Mais antigo</option>
                      </>
                    )}
                    {tipoOrdenacao === 'valor' && (
                      <>
                        <option value="desc">Maior primeiro</option>
                        <option value="asc">Menor primeiro</option>
                      </>
                    )}
                    {tipoOrdenacao === 'fornecedor' && (
                      <>
                        <option value="asc">A → Z</option>
                        <option value="desc">Z → A</option>
                      </>
                    )}
                    {tipoOrdenacao === 'status' && (
                      <>
                        <option value="asc">Entregue primeiro</option>
                        <option value="desc">Pendente primeiro</option>
                      </>
                    )}
                  </select>
                )}

                {/* Limpar Ordenação */}
                {tipoOrdenacao && (
                  <button
                    onClick={() => {
                      setTipoOrdenacao('');
                      setCampoOrdenacao('');
                      setDirecaoOrdenacao('');
                    }}
                    className="px-3 py-2 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Filtros Ativos */}
          {(selectedFornecedor || selectedStatus || selectedProdutos.length > 0 || dataInicio || dataFim || valorMin || valorMax) && (
            <div className="p-3 bg-blue-50 border-b border-gray-100">
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-xs font-medium text-gray-600">Filtros ativos:</span>
                {selectedFornecedor && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-orange-100 text-orange-800 border border-orange-200">
                    Fornecedor: {getFornecedorNome(parseInt(selectedFornecedor))}
                    <button onClick={() => setSelectedFornecedor('')} className="ml-1 text-orange-600 hover:text-orange-800">×</button>
                  </span>
                )}
                {selectedStatus && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-orange-100 text-orange-800 border border-orange-200">
                    Status: {selectedStatus}
                    <button onClick={() => setSelectedStatus('')} className="ml-1 text-orange-600 hover:text-orange-800">×</button>
                  </span>
                )}
                {selectedProdutos.length > 0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-orange-100 text-orange-800 border border-orange-200">
                    Produtos: {selectedProdutos.length} selecionado{selectedProdutos.length > 1 ? 's' : ''}
                    <button onClick={() => setSelectedProdutos([])} className="ml-1 text-orange-600 hover:text-orange-800">×</button>
                  </span>
                )}
                {(dataInicio || dataFim) && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-orange-100 text-orange-800 border border-orange-200">
                    Período: {dataInicio} até {dataFim}
                    <button onClick={() => { setDataInicio(''); setDataFim(''); }} className="ml-1 text-orange-600 hover:text-orange-800">×</button>
                  </span>
                )}
                {(valorMin || valorMax) && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-orange-100 text-orange-800 border border-orange-200">
                    Valor: R$ {valorMin || '0'} - R$ {valorMax || '∞'}
                    <button onClick={() => { setValorMin(''); setValorMax(''); }} className="ml-1 text-orange-600 hover:text-orange-800">×</button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Pedidos List */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Header da Lista */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Lista de Pedidos de Compra</h3>
                  <p className="text-xs text-gray-500">{filteredPedidos.length} de {total} {filteredPedidos.length === 1 ? 'pedido encontrado' : 'pedidos encontrados'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">

            {filteredPedidos.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-base font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h4>
                <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                  {searchTerm || selectedFornecedor || selectedStatus || selectedProdutos.length > 0 || dataInicio || dataFim || valorMin || valorMax
                    ? 'Tente ajustar os filtros para encontrar os pedidos desejados'
                    : 'Comece criando seu primeiro pedido de compra'
                  }
                </p>
                <button
                  onClick={handleCreatePedido}
                  className="btn-primary flex items-center space-x-2 mx-auto px-4 py-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Pedido</span>
                </button>
              </div>
            ) : (
              filteredPedidos.map(pedido => {
                const statusEntrega = getStatusEntrega(pedido.status);
                const itensPedido = getItensByPedido(pedido.id_pedido);
                const isExpanded = expandedPedido === pedido.id_pedido;

                return (
                  <div key={pedido.id_pedido} className="hover:bg-gray-50 transition-colors duration-200">
                    {/* Cabeçalho do Pedido */}
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Identificação e Status */}
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                              <span className="text-sm font-bold text-white">{pedido.id_pedido}</span>
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-semibold text-gray-900">
                                  {getFornecedorNome(pedido.id_fornecedor)}
                                </span>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                  <div className="w-1.5 h-1.5 rounded-full mr-1.5 bg-gray-500" />
                                  {statusEntrega.text}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                {itensPedido.length} {itensPedido.length === 1 ? 'item' : 'itens'} • Pedido em {formatDate(pedido.data_pedido)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          {/* Valor Total */}
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">{formatCurrency(pedido.valor_total)}</div>
                            <div className="text-xs text-gray-500">Valor total</div>
                          </div>
                          {/* Ações */}
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleEditPedido(pedido)}
                              className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-150"
                              title="Editar pedido"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeletePedido(pedido.id_pedido)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                              title="Excluir pedido"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                            <button
                              onClick={() => toggleExpandPedido(pedido.id_pedido)}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                              title={isExpanded ? "Recolher detalhes" : "Ver detalhes"}
                            >
                              <svg className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
                        <span>Pedido: {formatDate(pedido.data_pedido)}</span>
                        <span>Entrega: {formatDate(pedido.data_entrega)}</span>
                        <span>Frete: {formatCurrency(pedido.valor_frete)}</span>
                        <span>Produtos: {formatCurrency(pedido.custo_pedido)}</span>
                      </div>

                      {pedido.descricao_pedido && (
                        <div className="mt-1.5 text-xs text-gray-500">
                          {pedido.descricao_pedido}
                        </div>
                      )}
                    </div>

                    {/* Detalhes dos Itens (Expandível) */}
                    {isExpanded && (
                      <div className="px-4 pb-3 pt-2 border-t border-gray-100 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-medium text-gray-700">Itens do Pedido</h4>
                          <span className="text-xs text-gray-500">
                            {itensPedido.length} {itensPedido.length === 1 ? 'item' : 'itens'}
                          </span>
                        </div>
                        <div className="bg-white rounded-lg overflow-hidden border">
                          <table className="w-full text-xs">
                            <thead className="bg-gray-50">
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-2 px-12 font-medium text-gray-600 w-auto">Produto</th>
                                <th className="text-center py-2 px-12 font-medium text-gray-600 w-20">Qtd.</th>
                                <th className="text-left py-2 px-12 font-medium text-gray-600 w-40">Unit.</th>
                                <th className="text-left py-2 px-12 font-medium text-gray-600 w-44">Total</th>
                                <th className="w-full"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {itensPedido.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                                  <td className="py-2 px-12 text-gray-900 font-medium w-auto">{getProdutoNome(item.id_produto)}</td>
                                  <td className="py-2 px-12 text-center text-gray-600 w-20">{item.quantidade}</td>
                                  <td className="py-2 px-12 text-gray-600 font-mono" style={{
                                    textAlign: 'left',
                                    width: '140px',
                                    minWidth: '140px',
                                    fontFamily: 'JetBrains Mono, monospace',
                                    fontSize: '12px'
                                  }}>
                                    {formatCurrency(item.preco_unitario)}
                                  </td>
                                  <td className="py-2 px-12 font-semibold text-gray-900 font-mono" style={{
                                    textAlign: 'left',
                                    width: '160px',
                                    minWidth: '160px',
                                    fontFamily: 'JetBrains Mono, monospace',
                                    fontSize: '12px'
                                  }}>
                                    {formatCurrency(item.subtotal)}
                                  </td>
                                  <td className="w-full"></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Modal de Novo/Editar Pedido */}
      <NewPedidoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        pedido={editingPedido}
        onSave={handleSavePedido}
      />
    </DashboardLayout>
  );
}