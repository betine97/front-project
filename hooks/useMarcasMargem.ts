import { useState, useEffect } from 'react';
import { MarcaMargem, MarcasMargemService } from '../lib/services/marcas-margem.service';

export function useMarcasMargem() {
  const [data, setData] = useState<MarcaMargem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      console.log('useMarcasMargem - Iniciando busca de dados...');
      setLoading(true);
      setError(null);
      const marcasMargem = await MarcasMargemService.getMarcasMargem();
      console.log('useMarcasMargem - Dados recebidos:', marcasMargem);
      setData(marcasMargem);
    } catch (err) {
      console.error('useMarcasMargem - Erro:', err);
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