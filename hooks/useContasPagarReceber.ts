import { useState, useEffect } from 'react';
import { ContaPagarReceber, Movimentacao } from '../types/entities';

export const useContasPagarReceber = () => {
  const [contas, setContas] = useState<ContaPagarReceber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8080/contas_a_pagar_receber');
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }
      
      const data = await response.json();
      setContas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao buscar contas:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setContas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContas();
  }, []);

  const refetch = () => {
    fetchContas();
  };

  return {
    contas,
    loading,
    error,
    refetch
  };
};

export const useMovimentacoes = () => {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovimentacoes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8080/movimentacoes');
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }
      
      const data = await response.json();
      setMovimentacoes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao buscar movimentações:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setMovimentacoes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovimentacoes();
  }, []);

  const refetch = () => {
    fetchMovimentacoes();
  };

  return {
    movimentacoes,
    loading,
    error,
    refetch
  };
};