import { useState, useEffect } from 'react';
import { PublicoVariacoes, PublicoVariacoesService } from '../lib/services/publico-variacoes.service';

export function usePublicoVariacoes() {
  const [data, setData] = useState<PublicoVariacoes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      console.log('usePublicoVariacoes - Iniciando busca de dados...');
      setLoading(true);
      setError(null);
      const publicoVariacoes = await PublicoVariacoesService.getPublicoVariacoes();
      console.log('usePublicoVariacoes - Dados recebidos:', publicoVariacoes);
      setData(publicoVariacoes);
    } catch (err) {
      console.error('usePublicoVariacoes - Erro:', err);
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