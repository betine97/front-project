import { useState, useEffect } from 'react';
import { 
  publicosService, 
  PublicoAlvo, 
  Criterio, 
  PublicosResponse,
  CriteriosResponse 
} from '@/lib/services/publicos.service';

interface UsePublicosParams {
  page?: number;
  limit?: number;
  autoFetch?: boolean;
}

export function usePublicos(params: UsePublicosParams = {}) {
  const { page = 1, limit = 30, autoFetch = true } = params;

  const [publicos, setPublicos] = useState<PublicoAlvo[]>([]);
  const [criterios, setCriterios] = useState<Criterio[]>([]);
  const [publicosCriterios, setPublicosCriterios] = useState<Record<number, Criterio[]>>({});
  const [publicosClientes, setPublicosClientes] = useState<Record<number, any[]>>({});
  const [loading, setLoading] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Buscar públicos
  const fetchPublicos = async () => {
    try {
      setLoading('loading');
      setError(null);
      
      const response = await publicosService.getPublicos({ page, limit });
      
      setPublicos(response.publicos || []);
      setTotal(response.total || 0);
      setTotalPages(response.totalPages || 0);
      
      // Para a modal de campanhas, não precisamos buscar critérios e clientes
      // Apenas definir loading como idle
      setLoading('idle');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setLoading('error');
    }
  };

  // Buscar critérios
  const fetchCriterios = async () => {
    try {
      const response = await publicosService.getCriterios();
      setCriterios(response.criterios);
    } catch (err) {
      console.error('Erro ao buscar critérios:', err);
    }
  };

  // Buscar critérios para todos os públicos
  const fetchCriteriosParaTodosPublicos = async (publicosList: PublicoAlvo[]) => {
    try {
      const criteriosPromises = publicosList.map(async (publico) => {
        if (publico.id) {
          try {
            const response = await publicosService.getPublicoCriterios(publico.id);
            return {
              publicoId: publico.id,
              criterios: response.criterios.map(c => ({
                id: c.id_criterio,
                nome_condicao: c.nome_condicao
              }))
            };
          } catch (err) {
            console.error(`Erro ao buscar critérios do público ${publico.id}:`, err);
            return {
              publicoId: publico.id,
              criterios: []
            };
          }
        }
        return null;
      });

      const results = await Promise.all(criteriosPromises);
      const criteriosMap: Record<number, Criterio[]> = {};
      
      results.forEach(result => {
        if (result) {
          criteriosMap[result.publicoId] = result.criterios;
        }
      });

      setPublicosCriterios(criteriosMap);
    } catch (err) {
      console.error('Erro ao buscar critérios dos públicos:', err);
    }
  };

  // Buscar clientes para todos os públicos
  const fetchClientesParaTodosPublicos = async (publicosList: PublicoAlvo[]) => {
    try {
      const clientesPromises = publicosList.map(async (publico) => {
        if (publico.id) {
          try {
            const response = await publicosService.getClientesDoPublico(publico.id, { limit: 5 }); // Buscar apenas os primeiros 5
            return {
              publicoId: publico.id,
              clientes: response.clientes,
              total: response.total
            };
          } catch (err) {
            console.error(`Erro ao buscar clientes do público ${publico.id}:`, err);
            return {
              publicoId: publico.id,
              clientes: [],
              total: 0
            };
          }
        }
        return null;
      });

      const results = await Promise.all(clientesPromises);
      const clientesMap: Record<number, any[]> = {};
      
      results.forEach(result => {
        if (result) {
          clientesMap[result.publicoId] = result.clientes;
        }
      });

      setPublicosClientes(clientesMap);
    } catch (err) {
      console.error('Erro ao buscar clientes dos públicos:', err);
    }
  };

  // Buscar critérios de um público específico
  const fetchCriteriosPublico = async (publicoId: number) => {
    try {
      const response = await publicosService.getPublicoCriterios(publicoId);
      const criterios = response.criterios.map(c => ({
        id: c.id_criterio,
        nome_condicao: c.nome_condicao
      }));
      
      setPublicosCriterios(prev => ({
        ...prev,
        [publicoId]: criterios
      }));
      
      return criterios;
    } catch (err) {
      console.error(`Erro ao buscar critérios do público ${publicoId}:`, err);
      return [];
    }
  };

  // Criar novo público
  const createPublico = async (
    publicoData: PublicoAlvo, 
    criteriosSelecionados: number[] = []
  ) => {
    try {
      setLoading('loading');
      setError(null);

      // 1. Criar o público
      const response = await publicosService.createPublico(publicoData);
      
      // 2. Se há critérios selecionados, associá-los
      if (criteriosSelecionados.length > 0) {
        await publicosService.associarCriterios(response.id_publico, criteriosSelecionados);
      }

      // 3. NOVA FUNCIONALIDADE: Adicionar clientes que atendem aos critérios
      let resultadoClientes = null;
      try {
        resultadoClientes = await publicosService.adicionarClientesAoPublico(response.id_publico);
        console.log('[usePublicos] Resultado da adição de clientes:', resultadoClientes);
        
        // Log detalhado para debug
        console.log(`[usePublicos] Público "${publicoData.nome}" criado:`, {
          id_publico: response.id_publico,
          clientes_adicionados: resultadoClientes.clientes_adicionados,
          clientes_ja_existiam: resultadoClientes.clientes_ja_existiam,
          total_clientes: resultadoClientes.total,
          clientes_encontrados: resultadoClientes.clientes_encontrados.length
        });
      } catch (clientesError) {
        console.error('[usePublicos] Erro ao adicionar clientes ao público:', clientesError);
        // Não vamos falhar a criação do público se houver erro na adição de clientes
        // Apenas logamos o erro
      }

      // 4. Recarregar a lista
      await fetchPublicos();
      
      setLoading('idle');
      
      // Retornar tanto a resposta do público quanto o resultado dos clientes
      return {
        ...response,
        resultadoClientes
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar público');
      setLoading('error');
      throw err;
    }
  };

  // Refetch
  const refetch = () => {
    fetchPublicos();
  };

  // Auto fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchPublicos();
      fetchCriterios();
    }
  }, [page, limit, autoFetch]);

  return {
    publicos,
    criterios,
    publicosCriterios,
    publicosClientes,
    loading,
    error,
    total,
    totalPages,
    fetchPublicos,
    fetchCriterios,
    fetchCriteriosPublico,
    createPublico,
    refetch
  };
}