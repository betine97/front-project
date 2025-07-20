// Hook customizado para gerenciar pedidos de compra
import { useState, useEffect } from 'react';
import { pedidosCompraService } from '@/lib/services/pedidos-compra.service';
import { PedidoCompra, ItemPedido } from '@/types/entities';
import { LoadingState } from '@/types/common';

interface UsePedidosCompraParams {
  page?: number;
  limit?: number;
  search?: string;
  fornecedor?: string;
}

export function usePedidosCompra(params: UsePedidosCompraParams = {}) {
  const [pedidos, setPedidos] = useState<PedidoCompra[]>([]);
  const [itens, setItens] = useState<ItemPedido[]>([]);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPedidos = async () => {
    setLoading('loading');
    setError(null);

    try {
      const [pedidosResponse, itensResponse] = await Promise.all([
        pedidosCompraService.getAll(params),
        pedidosCompraService.getAllItens()
      ]);
      
      setPedidos(pedidosResponse.data);
      setItens(itensResponse);
      setTotal(pedidosResponse.total);
      setTotalPages(pedidosResponse.totalPages);
      setLoading('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos de compra');
      setLoading('error');
    }
  };

  const createPedido = async (pedido: Omit<PedidoCompra, 'id'>) => {
    try {
      const novoPedido = await pedidosCompraService.create(pedido);
      setPedidos(prev => [novoPedido, ...prev]);
      return novoPedido;
    } catch (err) {
      throw err;
    }
  };

  const updatePedido = async (id: number, pedido: Partial<PedidoCompra>) => {
    try {
      const pedidoAtualizado = await pedidosCompraService.update(id, pedido);
      setPedidos(prev => 
        prev.map(p => p.id === id ? pedidoAtualizado : p)
      );
      return pedidoAtualizado;
    } catch (err) {
      throw err;
    }
  };

  const deletePedido = async (id: number) => {
    try {
      await pedidosCompraService.delete(id);
      setPedidos(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const getItensByPedido = (pedidoId: number): ItemPedido[] => {
    return itens.filter(item => item.id_pedido === pedidoId);
  };

  useEffect(() => {
    fetchPedidos();
  }, [params.page, params.limit, params.search, params.fornecedor]);

  return {
    pedidos,
    itens,
    loading,
    error,
    total,
    totalPages,
    refetch: fetchPedidos,
    createPedido,
    updatePedido,
    deletePedido,
    getItensByPedido,
  };
}