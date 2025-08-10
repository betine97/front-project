import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

interface ItemEstoque {
  nome_produto: string;
  lote: number;
  quantidade: number;
  data_entrada: string;
  data_saida?: string;
  vencimento: string;
  documento_referencia: string;
  status: string;
}

interface EstoqueResponse {
  estoque: ItemEstoque[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

interface UseEstoqueParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export function useEstoque(params: UseEstoqueParams = {}) {
  const [itensEstoque, setItensEstoque] = useState<ItemEstoque[]>([]);
  const [loading, setLoading] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchEstoque = async () => {
    try {
      setLoading('loading');
      setError(null);

      // Construir query string
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);

      const endpoint = queryParams.toString() 
        ? `/api/estoque?${queryParams.toString()}`
        : '/api/estoque';

      console.log('[useEstoque] Fazendo requisição para:', endpoint);

      const response = await apiClient.get<EstoqueResponse>(endpoint);
      
      console.log('[useEstoque] Resposta recebida:', response.data);

      // Extrair dados da resposta com a nova estrutura
      const estoque = response.data.estoque.map((item: any) => ({
        nome_produto: item.nome_produto || '',
        lote: item.lote || 0,
        quantidade: item.quantidade || 0,
        data_entrada: item.data_entrada || '',
        data_saida: item.data_saida || null,
        vencimento: item.vencimento || '',
        documento_referencia: item.documento_referencia || '',
        status: item.status || 'ativo'
      }));
      
      setItensEstoque(estoque);
      setTotal(response.data.total);
      setTotalPages(response.data.total_pages);
      setLoading('success');
    } catch (err) {
      console.error('[useEstoque] Erro ao buscar estoque:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar estoque');
      setItensEstoque([]);
      setTotal(0);
      setTotalPages(0);
      setLoading('error');
    }
  };

  const createItemEstoque = async (itemData: {
    id_produto: number;
    id_lote: number;
    quantidade: number;
    vencimento: string;
    custo_unitario: number;
    data_entrada: string;
    data_saida: string;
    documento_referencia: string;
    status: string;
  }) => {
    try {
      console.log('[useEstoque] Criando item de estoque:', itemData);
      
      const response = await apiClient.post<{message: string, id?: number}>('/api/estoque', itemData);
      
      console.log('[useEstoque] Item criado:', response.data);
      
      // Recarregar a lista após criar
      await fetchEstoque();
      
      return response.data;
    } catch (err) {
      console.error('[useEstoque] Erro ao criar item:', err);
      throw err;
    }
  };

  const deleteItemEstoque = async (id: number) => {
    try {
      console.log('[useEstoque] Excluindo item:', id);
      
      const response = await apiClient.delete<{message: string}>(`/api/estoque/${id}`);
      
      console.log('[useEstoque] Item excluído:', response.data);
      
      // Recarregar a lista após excluir
      await fetchEstoque();
      
      return response.data;
    } catch (err) {
      console.error('[useEstoque] Erro ao excluir item:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchEstoque();
  }, [params.page, params.limit, params.search, params.status]);

  return {
    itensEstoque,
    loading,
    error,
    total,
    totalPages,
    refetch: fetchEstoque,
    createItemEstoque,
    deleteItemEstoque
  };
}