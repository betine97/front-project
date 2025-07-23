import { useState, useEffect } from 'react';
import { CategoriaMargem, CategoriasMargemService } from '../lib/services/categorias-margem.service';

export function useCategoriasMargem() {
  const [data, setData] = useState<CategoriaMargem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      console.log('useCategoriasMargem - Iniciando busca de dados...');
      setLoading(true);
      setError(null);
      const categoriasMargem = await CategoriasMargemService.getCategoriasMargem();
      console.log('useCategoriasMargem - Dados recebidos:', categoriasMargem);
      setData(categoriasMargem);
    } catch (err) {
      console.error('useCategoriasMargem - Erro:', err);
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