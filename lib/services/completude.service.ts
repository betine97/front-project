import { apiClient } from '../api/client';

export interface ClienteCompletude {
  cliente_id: number;
  nome_cliente: string;
  percentual_completo: number;
}

export interface CompletudePaginatedResponse {
  clientes: ClienteCompletude[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

class CompletudePaginatedService {
  // Buscar completude dos clientes
  async getCompletude(params: {
    page?: number;
    limit?: number;
  } = {}): Promise<CompletudePaginatedResponse> {
    try {
      const { page = 1, limit = 30 } = params;
      const queryParams = new URLSearchParams({ 
        page: page.toString(), 
        limit: limit.toString() 
      });
      
      console.log('[CompletudePaginatedService] Buscando completude:', `/api/completude/clientes?${queryParams}`);
      const response = await apiClient.get<any>(`/api/completude/clientes?${queryParams}`);
      console.log('[CompletudePaginatedService] Resposta da completude:', response.data);
      
      // Adaptar resposta para o formato esperado
      const adaptedResponse: CompletudePaginatedResponse = {
        clientes: response.data.clientes || response.data.data || response.data || [],
        total: response.data.total || 0,
        page: response.data.page || page,
        limit: response.data.limit || limit,
        total_pages: response.data.total_pages || Math.ceil((response.data.total || 0) / limit)
      };
      
      return adaptedResponse;
    } catch (error) {
      console.error('Erro ao buscar completude dos clientes:', error);
      throw new Error('Erro ao carregar completude dos clientes');
    }
  }
}

export const completudeService = new CompletudePaginatedService();