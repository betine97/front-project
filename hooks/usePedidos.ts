import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';
import { PedidoCompra } from '@/types/entities';

interface PedidosResponse {
  pedidos: PedidoCompra[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

interface UsePedidosParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export function usePedidos(params: UsePedidosParams = {}) {
  const [pedidos, setPedidos] = useState<PedidoCompra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Construir query string
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);

      const endpoint = queryParams.toString() 
        ? `/api/pedidos?${queryParams.toString()}`
        : '/api/pedidos';

      console.log('[usePedidos] Fazendo requisição para:', endpoint);

      const response = await apiClient.get<PedidosResponse>(endpoint);
      
      console.log('[usePedidos] Resposta recebida:', response.data);

      setPedidos(response.data.pedidos || []);
      setTotal(response.data.total || 0);
      setTotalPages(response.data.total_pages || 0);
    } catch (err) {
      console.error('[usePedidos] Erro ao buscar pedidos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos');
      setPedidos([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, [params.page, params.limit, params.search, params.status]);

  return {
    pedidos,
    loading,
    error,
    total,
    totalPages,
    refetch: fetchPedidos
  };
}