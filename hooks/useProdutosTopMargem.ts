import { useState, useEffect } from 'react';
import { ProdutoTopMargem, ProdutosTopMargemService } from '../lib/services/produtos-top-margem.service';

export function useProdutosTopMargem() {
  const [data, setData] = useState<ProdutoTopMargem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      console.log('useProdutosTopMargem - Iniciando busca de dados...');
      setLoading(true);
      setError(null);
      const produtosTopMargem = await ProdutosTopMargemService.getProdutosTopMargem();
      console.log('useProdutosTopMargem - Dados recebidos:', produtosTopMargem);
      setData(produtosTopMargem);
    } catch (err) {
      console.error('useProdutosTopMargem - Erro:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}