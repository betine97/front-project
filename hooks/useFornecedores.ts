// Hook customizado para gerenciar fornecedores
import { useState, useEffect, useCallback } from 'react';
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

  const fetchFornecedores = useCallback(async () => {
    setLoading('loading');
    setError(null);

    try {
      console.log('[useFornecedores] Buscando fornecedores com params:', params);
      const response = await fornecedoresService.getAll(params);
      console.log('[useFornecedores] Resposta recebida:', {
        total: response.total,
        dataLength: response.data.length,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages
      });
      setFornecedores(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setLoading('success');
    } catch (err) {
      console.error('[useFornecedores] Erro:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar fornecedores');
      setLoading('error');
    }
  }, [params.page, params.limit, params.search, params.status]); // Dependências específicas

  const createFornecedor = async (fornecedor: {
    nome: string;
    telefone: string;
    email: string;
    cidade: string;
    estado: string;
    status: string;
    data_cadastro: string;
  }) => {
    try {
      const result = await fornecedoresService.create(fornecedor);
      // Recarregar a lista após criar
      await fetchFornecedores();
      return result;
    } catch (err) {
      throw err;
    }
  };

  const updateFornecedorField = async (id: number, campo: string, valor: string) => {
    try {
      const result = await fornecedoresService.updateField(id, campo, valor);
      // Recarregar a lista após atualizar
      await fetchFornecedores();
      return result;
    } catch (err) {
      throw err;
    }
  };

  const updateFornecedorStatus = async (id: number) => {
    try {
      const result = await fornecedoresService.updateStatus(id);
      // Recarregar a lista após atualizar status
      await fetchFornecedores();
      return result;
    } catch (err) {
      throw err;
    }
  };

  const deleteFornecedor = async (id: number) => {
    try {
      const result = await fornecedoresService.delete(id);
      // Recarregar a lista após deletar
      await fetchFornecedores();
      return result;
    } catch (err) {
      throw err;
    }
  };

  const fetchAllActiveFornecedores = useCallback(async () => {
    setLoading('loading');
    setError(null);

    try {
      console.log('[useFornecedores] Buscando todos os fornecedores ativos...');
      const allFornecedores = await fornecedoresService.getAllActive();
      console.log('[useFornecedores] Fornecedores ativos carregados:', allFornecedores.length);
      
      setFornecedores(allFornecedores);
      setTotal(allFornecedores.length);
      setTotalPages(1);
      setLoading('success');
    } catch (err) {
      console.error('[useFornecedores] Erro ao carregar fornecedores ativos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar fornecedores ativos');
      setLoading('error');
    }
  }, []); // Sem dependências pois não usa nenhum valor externo

  useEffect(() => {
    fetchFornecedores();
  }, [fetchFornecedores]);

  return {
    fornecedores,
    loading,
    error,
    total,
    totalPages,
    refetch: fetchFornecedores,
    fetchAllActive: fetchAllActiveFornecedores,
    createFornecedor,
    updateFornecedorField,
    updateFornecedorStatus,
    deleteFornecedor,
  };
}