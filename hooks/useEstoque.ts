// Hook customizado para gerenciar estoque
import { useState, useEffect } from 'react';
import { estoqueService } from '@/lib/services/estoque.service';
import { Estoque } from '@/types/entities';
import { LoadingState } from '@/types/common';

interface UseEstoqueParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  produto?: string;
}

export function useEstoque(params: UseEstoqueParams = {}) {
  const [estoque, setEstoque] = useState<Estoque[]>([]);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchEstoque = async () => {
    setLoading('loading');
    setError(null);

    try {
      const response = await estoqueService.getAll(params);
      setEstoque(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setLoading('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estoque');
      setLoading('error');
    }
  };

  const createEstoque = async (estoque: Omit<Estoque, 'id'>) => {
    try {
      const novoEstoque = await estoqueService.create(estoque);
      setEstoque(prev => [novoEstoque, ...prev]);
      return novoEstoque;
    } catch (err) {
      throw err;
    }
  };

  const updateEstoque = async (id: number, estoque: Partial<Estoque>) => {
    try {
      const estoqueAtualizado = await estoqueService.update(id, estoque);
      setEstoque(prev => 
        prev.map(e => e.id === id ? estoqueAtualizado : e)
      );
      return estoqueAtualizado;
    } catch (err) {
      throw err;
    }
  };

  const deleteEstoque = async (id: number) => {
    try {
      await estoqueService.delete(id);
      setEstoque(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const updateQuantidade = async (id: number, quantidade: number) => {
    try {
      const estoqueAtualizado = await estoqueService.updateQuantidade(id, quantidade);
      setEstoque(prev => 
        prev.map(e => e.id === id ? estoqueAtualizado : e)
      );
      return estoqueAtualizado;
    } catch (err) {
      throw err;
    }
  };

  const getEstoquePorProduto = (produtoId: number): Estoque[] => {
    return estoque.filter(e => e.id_produto === produtoId);
  };

  const getTotalQuantidadePorProduto = (produtoId: number): number => {
    return estoque
      .filter(e => e.id_produto === produtoId && e.status === 'disponível')
      .reduce((total, e) => total + e.quantidade, 0);
  };

  useEffect(() => {
    fetchEstoque();
  }, [params.page, params.limit, params.search, params.status, params.produto]);

  return {
    estoque,
    loading,
    error,
    total,
    totalPages,
    refetch: fetchEstoque,
    createEstoque,
    updateEstoque,
    deleteEstoque,
    updateQuantidade,
    getEstoquePorProduto,
    getTotalQuantidadePorProduto,
  };
}