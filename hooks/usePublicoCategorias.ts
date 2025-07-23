import { useState, useEffect } from 'react';
import { PublicoCategorias, PublicoCategoriasService } from '../lib/services/publico-categorias.service';

export function usePublicoCategorias() {
  const [data, setData] = useState<PublicoCategorias[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      console.log('usePublicoCategorias - Iniciando busca de dados...');
      setLoading(true);
      setError(null);
      const publicoCategorias = await PublicoCategoriasService.getPublicoCategorias();
      console.log('usePublicoCategorias - Dados recebidos:', publicoCategorias);
      setData(publicoCategorias);
    } catch (err) {
      console.error('usePublicoCategorias - Erro:', err);
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