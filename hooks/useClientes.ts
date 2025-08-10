// Hook customizado para gerenciar clientes
import { useState, useEffect, useCallback } from 'react';
import { clientesService } from '../lib/services/clientes.service';
import { completudeService, ClienteCompletude } from '../lib/services/completude.service';
import { tagsService, Tag } from '../lib/services/tags.service';
import { Cliente } from '../types/entities';
import { LoadingState } from '../types/common';

interface UseClientesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export function useClientes(params: UseClientesParams = {}) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [completude, setCompletude] = useState<Record<number, number>>({});
  const [clientesTags, setClientesTags] = useState<Record<number, Tag[]>>({});
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchClientes = useCallback(async () => {
    setLoading('loading');
    setError(null);

    try {
      console.log('[useClientes] Buscando clientes com params:', params);
      
      // Buscar clientes e completude em paralelo
      const [clientesResponse, completudeResponse] = await Promise.all([
        clientesService.getAll(params),
        completudeService.getCompletude(params)
      ]);
      
      console.log('[useClientes] Resposta clientes recebida:', {
        total: clientesResponse.total,
        dataLength: clientesResponse.data.length,
        page: clientesResponse.page,
        limit: clientesResponse.limit,
        totalPages: clientesResponse.totalPages
      });
      
      console.log('[useClientes] Resposta completude recebida:', {
        total: completudeResponse.total,
        clientesLength: completudeResponse.clientes.length
      });
      
      // Criar mapa de completude por cliente_id
      const completudeMap: Record<number, number> = {};
      completudeResponse.clientes.forEach(cliente => {
        completudeMap[cliente.cliente_id] = cliente.percentual_completo;
      });
      
      // Buscar tags de cada cliente
      const tagsMap: Record<number, Tag[]> = {};
      if (clientesResponse.data.length > 0) {
        const tagsPromises = clientesResponse.data.map(async (cliente) => {
          try {
            const tags = await tagsService.getClientTags(cliente.id);
            return { clienteId: cliente.id, tags };
          } catch (error) {
            console.error(`[useClientes] Erro ao buscar tags do cliente ${cliente.id}:`, error);
            return { clienteId: cliente.id, tags: [] };
          }
        });
        
        const tagsResults = await Promise.all(tagsPromises);
        tagsResults.forEach(({ clienteId, tags }) => {
          // Filtrar tags válidas (que tenham as propriedades necessárias)
          const validTags = tags.filter(tag => 
            tag && 
            typeof tag.id_tag === 'number' && 
            typeof tag.nome_tag === 'string' && 
            typeof tag.categoria_tag === 'string'
          );
          tagsMap[clienteId] = validTags;
        });
      }
      
      setClientes(clientesResponse.data);
      setCompletude(completudeMap);
      setClientesTags(tagsMap);
      setTotal(clientesResponse.total);
      setTotalPages(clientesResponse.totalPages);
      setLoading('success');
    } catch (err) {
      console.error('[useClientes] Erro:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar clientes');
      setLoading('error');
      
      // Garantir que os estados sejam limpos em caso de erro
      setClientes([]);
      setCompletude({});
      setClientesTags({});
      setTotal(0);
      setTotalPages(0);
    }
  }, [params.page, params.limit, params.search, params.status]);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const createCliente = async (cliente: {
    tipo_cliente: string;
    nome_cliente: string;
    numero_celular: string;
    sexo: 'M' | 'F';
    email?: string;
    data_nascimento?: string;
    endereco: {
      cep: string;
      cidade: string;
      estado: string;
      bairro: string;
      logradouro: string;
      numero: string;
      complemento?: string;
      obs?: string;
    };
  }) => {
    try {
      const result = await clientesService.create(cliente);
      // Recarregar a lista após criar
      await fetchClientes();
      return result;
    } catch (err) {
      throw err;
    }
  };

  return {
    clientes,
    completude,
    clientesTags,
    loading,
    error,
    total,
    totalPages,
    refetch: fetchClientes,
    createCliente,
  };
}