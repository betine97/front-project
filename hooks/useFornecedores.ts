// Hook customizado para gerenciar fornecedores
import { useState, useEffect } from 'react';
import { fornecedoresService } from '@/lib/services/fornecedores.service';
import { Fornecedor } from '@/types/entities';
import { LoadingState } from '@/types/common';

interface UseFornecedoresParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export function useFornecedores(params: UseFornecedoresParams = {}) {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchFornecedores = async () => {
    setLoading('loading');
    setError(null);

    try {
      const response = await fornecedoresService.getAll(params);
      setFornecedores(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setLoading('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar fornecedores');
      setLoading('error');
    }
  };

  const createFornecedor = async (fornecedor: Omit<Fornecedor, 'id'>) => {
    try {
      const novoFornecedor = await fornecedoresService.create(fornecedor);
      setFornecedores(prev => [novoFornecedor, ...prev]);
      return novoFornecedor;
    } catch (err) {
      throw err;
    }
  };

  const updateFornecedor = async (id: number, fornecedor: Partial<Fornecedor>) => {
    try {
      const fornecedorAtualizado = await fornecedoresService.update(id, fornecedor);
      setFornecedores(prev => 
        prev.map(f => f.id === id ? fornecedorAtualizado : f)
      );
      return fornecedorAtualizado;
    } catch (err) {
      throw err;
    }
  };

  const deleteFornecedor = async (id: number) => {
    try {
      await fornecedoresService.delete(id);
      setFornecedores(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchFornecedores();
  }, [params.page, params.limit, params.search, params.status]);

  return {
    fornecedores,
    loading,
    error,
    total,
    totalPages,
    refetch: fetchFornecedores,
    createFornecedor,
    updateFornecedor,
    deleteFornecedor,
  };
}