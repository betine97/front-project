// Hook customizado para gerenciar histórico de preços
import { useState, useEffect } from 'react';
import { historicoPrecosService } from '@/lib/services/historico-precos.service';
import { HistoricoPreco } from '@/types/entities';
import { LoadingState } from '@/types/common';

interface UseHistoricoPrecosParams {
  page?: number;
  limit?: number;
  produto?: number;
  dataInicio?: string;
  dataFim?: string;
}

export function useHistoricoPrecos(params: UseHistoricoPrecosParams = {}) {
  const [historico, setHistorico] = useState<HistoricoPreco[]>([]);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchHistorico = async () => {
    setLoading('loading');
    setError(null);

    try {
      const response = await historicoPrecosService.getAll(params);
      setHistorico(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setLoading('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar histórico de preços');
      setLoading('error');
    }
  };

  const createHistorico = async (historico: Omit<HistoricoPreco, 'id'>) => {
    try {
      const novoHistorico = await historicoPrecosService.create(historico);
      setHistorico(prev => [novoHistorico, ...prev]);
      return novoHistorico;
    } catch (err) {
      throw err;
    }
  };

  const deleteHistorico = async (id: number) => {
    try {
      await historicoPrecosService.delete(id);
      setHistorico(prev => prev.filter(h => h.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const getHistoricoPorProduto = async (produtoId: number): Promise<HistoricoPreco[]> => {
    try {
      return await historicoPrecosService.getByProdutoId(produtoId);
    } catch (err) {
      throw err;
    }
  };

  const getUltimoPreco = async (produtoId: number): Promise<HistoricoPreco | null> => {
    try {
      return await historicoPrecosService.getLatestByProdutoId(produtoId);
    } catch (err) {
      throw err;
    }
  };

  const getEstatisticas = async (produtoId: number) => {
    try {
      return await historicoPrecosService.getEstatisticasPorProduto(produtoId);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchHistorico();
  }, [params.page, params.limit, params.produto, params.dataInicio, params.dataFim]);

  return {
    historico,
    loading,
    error,
    total,
    totalPages,
    refetch: fetchHistorico,
    createHistorico,
    deleteHistorico,
    getHistoricoPorProduto,
    getUltimoPreco,
    getEstatisticas,
  };
}