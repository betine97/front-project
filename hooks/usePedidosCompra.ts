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
      console.log('[usePedidosCompra] Buscando pedidos com params:', params);
      const pedidosResponse = await pedidosCompraService.getAll(params);
      
      console.log('[usePedidosCompra] Resposta recebida:', {
        total: pedidosResponse.total,
        dataLength: pedidosResponse.data.length,
        page: pedidosResponse.page,
        limit: pedidosResponse.limit,
        totalPages: pedidosResponse.totalPages
      });
      
      setPedidos(pedidosResponse.data);
      setTotal(pedidosResponse.total);
      setTotalPages(pedidosResponse.totalPages);
      setLoading('success');
      
      // Carregar itens apenas se houver pedidos (opcional)
      if (pedidosResponse.data.length > 0) {
        try {
          const itensResponse = await pedidosCompraService.getAllItens();
          setItens(itensResponse);
        } catch (itensError) {
          console.warn('[usePedidosCompra] Erro ao carregar itens (não crítico):', itensError);
          setItens([]); // Continuar sem itens se houver erro
        }
      } else {
        setItens([]);
      }
    } catch (err) {
      console.error('[usePedidosCompra] Erro:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos de compra');
      setLoading('error');
    }
  };

  const createPedido = async (pedido: {
    id_fornecedor: number;
    data_pedido: string;
    data_entrega: string;
    valor_frete: number;
    custo_pedido: number;
    valor_total: number;
    descricao_pedido: string;
    status: string;
  }) => {
    try {
      const result = await pedidosCompraService.create(pedido);
      // Recarregar a lista após criar
      await fetchPedidos();
      return result;
    } catch (err) {
      throw err;
    }
  };

  const updatePedido = async (id: number, pedido: Partial<PedidoCompra>) => {
    try {
      const pedidoAtualizado = await pedidosCompraService.update(id, pedido);
            setPedidos(prev =>
        prev.map(p => p.id_pedido === id ? pedidoAtualizado : p)
      );
      return pedidoAtualizado;
    } catch (err) {
      throw err;
    }
  };

  const deletePedido = async (id: number) => {
    try {
      await pedidosCompraService.delete(id);
      setPedidos(prev => prev.filter(p => p.id_pedido !== id));
    } catch (err) {
      throw err;
    }
  };

  const cancelarPedido = async (id: number) => {
    try {
      const result = await pedidosCompraService.cancelar(id);
      // Recarregar a lista após cancelar para atualizar o status
      await fetchPedidos();
      return result;
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
    cancelarPedido,
    getItensByPedido,
  };
}