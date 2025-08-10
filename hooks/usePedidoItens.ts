import { useState } from 'react';
import { apiClient } from '@/lib/api/client';

interface ItemPedido {
  id_pedido: number;
  nome_produto: string;
  quantidade: number;
  preco_unitario: number;
  total_item: number;
}

interface PedidoItensResponse {
  detalhes: ItemPedido[];
  total: number;
  id_pedido: number;
  page: number;
  limit: number;
  total_pages: number;
}

export function usePedidoItens() {
  const [itensCache, setItensCache] = useState<Record<number, ItemPedido[]>>({});
  const [loadingItens, setLoadingItens] = useState<Set<number>>(new Set());
  const [errorItens, setErrorItens] = useState<Record<number, string>>({});

  const fetchItensPedido = async (pedidoId: number): Promise<ItemPedido[]> => {
    // Se já temos os itens em cache, retorna
    if (itensCache[pedidoId]) {
      return itensCache[pedidoId];
    }

    // Se já está carregando, aguarda
    if (loadingItens.has(pedidoId)) {
      return [];
    }

    try {
      setLoadingItens(prev => new Set(prev).add(pedidoId));
      setErrorItens(prev => ({ ...prev, [pedidoId]: '' }));

      console.log(`[usePedidoItens] Buscando itens do pedido ${pedidoId}`);

      const response = await apiClient.get<PedidoItensResponse>(`/api/pedidos/${pedidoId}/itens`);
      
      console.log(`[usePedidoItens] Resposta recebida para pedido ${pedidoId}:`, response.data);

      const itens = response.data.detalhes || [];
      
      // Atualiza o cache
      setItensCache(prev => ({ ...prev, [pedidoId]: itens }));
      
      return itens;
    } catch (err) {
      console.error(`[usePedidoItens] Erro ao buscar itens do pedido ${pedidoId}:`, err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar itens';
      setErrorItens(prev => ({ ...prev, [pedidoId]: errorMessage }));
      return [];
    } finally {
      setLoadingItens(prev => {
        const newSet = new Set(prev);
        newSet.delete(pedidoId);
        return newSet;
      });
    }
  };

  const getItens = (pedidoId: number): ItemPedido[] => {
    return itensCache[pedidoId] || [];
  };

  const isLoading = (pedidoId: number): boolean => {
    return loadingItens.has(pedidoId);
  };

  const getError = (pedidoId: number): string => {
    return errorItens[pedidoId] || '';
  };

  return {
    fetchItensPedido,
    getItens,
    isLoading,
    getError
  };
}