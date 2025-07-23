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
      const response = await produtosService.getAll(params);
      setProdutos(response.data);
      if (response.allData) {
        setAllProdutos(response.allData);
      }
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setLoading('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
      setLoading('error');
    }
  };

  const createProduto = async (produto: Omit<Produto, 'id'>) => {
    try {
      const novoProduto = await produtosService.create(produto);
      setProdutos(prev => [novoProduto, ...prev]);
      return novoProduto;
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
      await produtosService.delete(id);
      setProdutos(prev => prev.filter(p => p.id !== id));
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
