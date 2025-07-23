import { useState, useEffect } from 'react';

interface FaturamentoResponse {
  faturamento: number;
}

interface FluxoCaixaResponse {
  fluxo_caixa: number;
}

interface LiquidezCorrenteResponse {
  liquidez_corrente: number;
}

export const useFaturamento = () => {
  const [faturamento, setFaturamento] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFaturamento = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8080/faturamento');
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }
      
      const data: FaturamentoResponse = await response.json();
      setFaturamento(data.faturamento || 0);
    } catch (err) {
      console.error('Erro ao buscar faturamento:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setFaturamento(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaturamento();
  }, []);

  return {
    faturamento,
    loading,
    error,
    refetch: fetchFaturamento
  };
};

export const useFluxoCaixa = () => {
  const [fluxoCaixa, setFluxoCaixa] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFluxoCaixa = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8080/fluxo_caixa');
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }
      
      const data: FluxoCaixaResponse = await response.json();
      setFluxoCaixa(data.fluxo_caixa || 0);
    } catch (err) {
      console.error('Erro ao buscar fluxo de caixa:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setFluxoCaixa(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFluxoCaixa();
  }, []);

  return {
    fluxoCaixa,
    loading,
    error,
    refetch: fetchFluxoCaixa
  };
};

export const useLiquidezCorrente = () => {
  const [liquidezCorrente, setLiquidezCorrente] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLiquidezCorrente = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8080/liquidez_corrente');
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }
      
      const data: LiquidezCorrenteResponse = await response.json();
      setLiquidezCorrente(data.liquidez_corrente || 0);
    } catch (err) {
      console.error('Erro ao buscar liquidez corrente:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setLiquidezCorrente(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiquidezCorrente();
  }, []);

  return {
    liquidezCorrente,
    loading,
    error,
    refetch: fetchLiquidezCorrente
  };
};