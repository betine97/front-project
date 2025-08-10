'use client';

import React, { useState } from 'react';
import { ShoppingCart, Plus, TrendingUp, Calendar, DollarSign, Package, Truck, ChevronDown, ChevronRight } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { usePedidos } from '../../hooks/usePedidos';
import { usePedidoItens } from '../../hooks/usePedidoItens';
import { NovoPedidoModal } from '../../components/pedidos/NovoPedidoModal';

export default function PedidosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedPedidos, setExpandedPedidos] = useState<Set<number>>(new Set());
  const itemsPerPage = 10;

  // Hook para buscar pedidos
  const { pedidos, loading, error, total, totalPages, refetch } = usePedidos({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    status: selectedStatus
  });

  // Hook para buscar itens dos pedidos
  const { fetchItensPedido, getItens, isLoading: isLoadingItens, getError: getItensError } = usePedidoItens();

  // Calcular estatísticas
  const totalPedidos = pedidos.length;
  const pedidosPendentes = pedidos.filter(p =>
    p.status === 'pendente' || p.status === 'aguardando confirmação do fornecedor'
  ).length;
  const valorTotal = pedidos.reduce((acc, p) => acc + p.valor_total, 0);
  const valorMedio = totalPedidos > 0 ? valorTotal / totalPedidos : 0;

  const handleCreatePedido = () => {
    setShowModal(true);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'entregue':
        return 'bg-green-100 text-green-800';
      case 'confirmado':
      case 'aprovado':
        return 'bg-blue-100 text-blue-800';
      case 'pendente':
      case 'aguardando confirmação do fornecedor':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      case 'em produção':
        return 'bg-purple-100 text-purple-800';
      case 'enviado':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleToggleExpandPedido = async (pedidoId: number) => {
    const isExpanded = expandedPedidos.has(pedidoId);

    if (isExpanded) {
      // Colapsar
      setExpandedPedidos(prev => {
        const newSet = new Set(prev);
        newSet.delete(pedidoId);
        return newSet;
      });
    } else {
      // Expandir e buscar itens se necessário
      setExpandedPedidos(prev => new Set(prev).add(pedidoId));

      // Buscar itens do pedido se ainda não foram carregados
      if (getItens(pedidoId).length === 0 && !isLoadingItens(pedidoId)) {
        await fetchItensPedido(pedidoId);
      }
    }
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Erro ao carregar pedidos</h3>
            <p className="text-red-800 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 mr-2"
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
                <p className="text-lg font-bold text-gray-900">{total}</p>
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
                <p className="text-sm text-gray-500">Pendentes</p>
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
                  R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                  R$ {valorMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-gray-500">Valor Médio</p>
              </div>
            </div>
          </div>
        </div>
        {/* Título da Seção */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Gestão de Pedidos</h2>
            <p className="text-sm text-gray-500">Gerencie seus pedidos de compra e acompanhe entregas.</p>
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

        {/* Filtros */}
        <div className="card mb-6">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex-1 min-w-[300px] relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Buscar pedidos..."
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 bg-gray-50 focus:bg-white text-sm"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
              <select
                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors duration-200 text-sm min-w-[140px]"
                value={selectedStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="">Todos os Status</option>
                <option value="pendente">Pendente</option>
                <option value="aguardando confirmação do fornecedor">Aguardando Confirmação</option>
                <option value="confirmado">Confirmado</option>
                <option value="em produção">Em Produção</option>
                <option value="enviado">Enviado</option>
                <option value="entregue">Entregue</option>
                <option value="cancelado">Cancelado</option>
              </select>
              <span className="text-sm text-gray-500">
                {pedidos.length} de {total} {total === 1 ? 'pedido' : 'pedidos'}
              </span>
            </div>
          </div>
        </div>
        {/* Conteúdo Principal */}
        <div className="card flex-1 flex flex-col">
          {pedidos.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-12">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
                <p className="text-gray-500 text-sm mb-6">
                  {searchTerm || selectedStatus
                    ? 'Tente ajustar os filtros ou crie um novo pedido.'
                    : 'Comece criando seu primeiro pedido de compra.'}
                </p>
                <button
                  onClick={handleCreatePedido}
                  className="btn-primary flex items-center space-x-2 mx-auto text-sm px-4 py-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Criar Primeiro Pedido</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                        Pedido <span className="text-xs text-gray-400 ml-2 font-normal">(clique para expandir)</span>
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Fornecedor</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Data Pedido</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Data Entrega</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Valor Total</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pedidos.map((pedido) => (
                      <React.Fragment key={pedido.id_pedido}>
                        <tr
                          className="hover:bg-gray-50/50 cursor-pointer transition-all duration-200 border-l-2 border-transparent hover:border-orange-400"
                          onClick={() => handleToggleExpandPedido(pedido.id_pedido)}
                          title="Clique para ver os detalhes do pedido"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                {expandedPedidos.has(pedido.id_pedido) ? (
                                  <ChevronDown className="w-4 h-4 text-gray-500" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-gray-500" />
                                )}
                              </div>
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                  <Package className="w-4 h-4 text-orange-600" />
                                </div>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">#{pedido.id_pedido}</p>
                                <p className="text-xs text-gray-500 truncate max-w-[200px]" title={pedido.descricao_pedido}>
                                  {pedido.descricao_pedido}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <Truck className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-900">Fornecedor {pedido.id_fornecedor}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-gray-900">
                              {new Date(pedido.data_pedido).toLocaleDateString('pt-BR')}
                            </p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-gray-900">
                              {pedido.data_entrega === 'não informada' || !pedido.data_entrega ?
                                'Não informada' :
                                new Date(pedido.data_entrega).toLocaleDateString('pt-BR')
                              }
                            </p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-medium text-gray-900">
                              R$ {pedido.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                            <p className="text-xs text-gray-500">
                              Frete: R$ {pedido.valor_frete.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(pedido.status)}`}>
                              {pedido.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                className="p-1.5 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-md transition-colors"
                                title="Editar"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                                title="Ver Detalhes"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Linha expandida com detalhes do pedido */}
                        {expandedPedidos.has(pedido.id_pedido) && (
                          <tr className="bg-gray-50/20">
                            <td colSpan={7} className="px-4 py-4">
                              <div className="bg-white rounded-lg border border-gray-200 shadow-sm mx-2">
                                <div className="px-6 py-4 border-b border-gray-100">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h4 className="text-base font-medium text-gray-900">Itens do Pedido #{pedido.id_pedido}</h4>
                                      <p className="text-sm text-gray-500">Detalhes dos produtos incluídos neste pedido</p>
                                    </div>
                                    {isLoadingItens(pedido.id_pedido) && (
                                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-200 border-t-orange-500"></div>
                                        <span>Carregando...</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="px-6 py-4">
                                  {isLoadingItens(pedido.id_pedido) ? (
                                    <div className="flex items-center justify-center py-12">
                                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-200 border-t-orange-500"></div>
                                    </div>
                                  ) : getItensError(pedido.id_pedido) ? (
                                    <div className="text-center py-8 text-red-500">
                                      <p className="text-sm">Erro ao carregar itens: {getItensError(pedido.id_pedido)}</p>
                                    </div>
                                  ) : getItens(pedido.id_pedido).length > 0 ? (
                                    <div className="space-y-3">
                                      {getItens(pedido.id_pedido).map((item, index) => (
                                        <div key={index} className="flex items-center justify-between py-3 px-4 bg-gray-50/50 rounded-lg hover:bg-gray-50 transition-colors">
                                          <div className="flex-1">
                                            <div className="flex items-center space-x-3">
                                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <Package className="w-5 h-5 text-blue-600" />
                                              </div>
                                              <div>
                                                <h6 className="font-medium text-gray-900 text-sm">{item.nome_produto}</h6>
                                                <div className="flex items-center space-x-4 mt-1">
                                                  <span className="text-xs text-gray-500">
                                                    Qtd: <span className="font-medium text-gray-700">{item.quantidade}</span>
                                                  </span>
                                                  <span className="text-xs text-gray-500">
                                                    Unit: <span className="font-medium text-gray-700">R$ {item.preco_unitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <p className="font-semibold text-orange-600 text-sm">
                                              R$ {item.total_item.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              {item.quantidade} × R$ {item.preco_unitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </p>
                                          </div>
                                        </div>
                                      ))}

                                      {/* Resumo do pedido */}
                                      <div className="border-t border-gray-200 pt-4 mt-4">
                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                          <div className="text-center">
                                            <p className="text-gray-500">Subtotal Itens</p>
                                            <p className="font-semibold text-gray-900">
                                              R$ {getItens(pedido.id_pedido)
                                                .reduce((total, item) => total + item.total_item, 0)
                                                .toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                                              }
                                            </p>
                                          </div>
                                          <div className="text-center">
                                            <p className="text-gray-500">Frete</p>
                                            <p className="font-semibold text-gray-900">
                                              R$ {pedido.valor_frete.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </p>
                                          </div>
                                          <div className="text-center">
                                            <p className="text-orange-600 font-medium">Total do Pedido</p>
                                            <p className="font-bold text-orange-600 text-lg">
                                              R$ {pedido.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-center py-8 text-gray-400">
                                      <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                      <p className="text-sm">Nenhum item encontrado neste pedido</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-500">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, total)} de {total} pedidos
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="px-3 py-1 text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
          </div>
        )}

        {/* Modal de Novo Pedido */}
        <NovoPedidoModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={refetch}
        />
      </div>
    </DashboardLayout>
  );
}