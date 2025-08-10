// Hook customizado para gerenciar produtos
import { useState, useEffect } from 'react';
import { produtosService } from '@/lib/services/produtos.service';
import { Produto } from '@/types/entities';
import { LoadingState } from '@/types/common';

interface UseProdutosParams {
  page?: number;
  limit?: number;
  search?: string;
  categoria?: string;
  marca?: string;
}

export function useProdutos(params: UseProdutosParams = {}) {
  const [produtos, setProdutos] = useState<Produto[]>([]); // Produtos paginados
  const [allProdutos, setAllProdutos] = useState<Produto[]>([]); // Todos os produtos
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProdutos = async () => {
    setLoading('loading');
    setError(null);

    try {
      console.log('[useProdutos] Iniciando busca de produtos com params:', params);
      const response = await produtosService.getAll(params);
      
      console.log('[useProdutos] Resposta recebida:', response);
      
      setProdutos(response.data || []);
      if (response.allData) {
        setAllProdutos(response.allData);
      } else {
        setAllProdutos(response.data || []);
      }
      setTotal(response.total || 0);
      setTotalPages(response.totalPages || 0);
      setLoading('success');
    } catch (err) {
      console.error('[useProdutos] Erro ao buscar produtos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
      setLoading('error');
      
      // Definir valores padrão em caso de erro
      setProdutos([]);
      setAllProdutos([]);
      setTotal(0);
      setTotalPages(0);
    }
  };

  const createProduto = async (produto: {
    data_cadastro: string;
    codigo_barra: string;
    nome_produto: string;
    sku: string;
    categoria: string;
    destinado_para: string;
    variacao: string;
    marca: string;
    descricao: string;
    status: string;
    preco_venda: number;
    id_fornecedor: number;
  }) => {
    try {
      const result = await produtosService.create(produto);
      // Recarregar a lista após criar
      await fetchProdutos();
      return result;
    } catch (err) {
      throw err;
    }
  };

  const updateProduto = async (id: number, produto: Partial<Produto>) => {
    try {
      const produtoAtualizado = await produtosService.update(id, produto);
      setProdutos(prev => 
        prev.map(p => p.id === id ? produtoAtualizado : p)
      );
      return produtoAtualizado;
    } catch (err) {
      throw err;
    }
  };

  const deleteProduto = async (id: number) => {
    try {
      const result = await produtosService.delete(id);
      // Recarregar a lista após deletar
      await fetchProdutos();
      return result;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, [params.page, params.limit, params.search, params.categoria, params.marca]);

  return {
    produtos,
    allProdutos,
    loading,
    error,
    total,
    totalPages,
    refetch: fetchProdutos,
    createProduto,
    updateProduto,
    deleteProduto,
  };
}
