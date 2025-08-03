// Serviço para operações com fornecedores
import { apiClient } from '@/lib/api/client';
import { Fornecedor } from '@/types/entities';
import { PaginatedResponse } from '@/types/api';

export class FornecedoresService {
  private endpoint = '/api/fornecedores';

  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<PaginatedResponse<Fornecedor>> {
    try {
      console.log('[FornecedoresService] Fazendo requisição para:', this.endpoint, 'com params:', params);
      
      // Construir query string para a API
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.status) queryParams.append('status', params.status);
      
      const url = queryParams.toString() ? `${this.endpoint}?${queryParams.toString()}` : this.endpoint;
      console.log('[FornecedoresService] URL final:', url);
      
      // A nova API retorna um objeto com fornecedores, total, page, limit, total_pages
      const response = await apiClient.get<{
        fornecedores: any[];
        total: number;
        page: number;
        limit: number;
        total_pages: number;
      }>(url);
      
      console.log('[FornecedoresService] Resposta recebida:', response);
      console.log('[FornecedoresService] Estrutura da resposta:', {
        hasFornecedores: !!response.data.fornecedores,
        totalFornecedores: response.data.fornecedores?.length,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.total_pages
      });
      
      // Verificar se a resposta tem a estrutura esperada
      if (!response.data || !response.data.fornecedores) {
        console.error('[FornecedoresService] Resposta sem fornecedores:', response.data);
        throw new Error('Resposta inválida da API - fornecedores não encontrados');
      }

      const fornecedoresData = response.data.fornecedores;
      
      if (!Array.isArray(fornecedoresData)) {
        console.error('[FornecedoresService] Fornecedores não é um array:', typeof fornecedoresData);
        throw new Error('Estrutura de resposta inválida da API - esperado array de fornecedores');
      }
      
      console.log('[FornecedoresService] Processando', fornecedoresData.length, 'fornecedores da API');
      
      let fornecedores = fornecedoresData.map((fornecedor: any) => {
        return {
          id: fornecedor.id_fornecedor,
          nome: fornecedor.nome,
          telefone: fornecedor.telefone || '',
          email: fornecedor.email || '',
          endereco: '', // Não vem na API, deixar vazio
          cidade: fornecedor.cidade || '',
          estado: fornecedor.estado || '',
          cep: '', // Não vem na API, deixar vazio
          data_cadastro: fornecedor.data_cadastro,
          status: (fornecedor.status?.toLowerCase() === 'ativo' ? 'ativo' : 'inativo') as 'ativo' | 'inativo'
        };
      });
      
      console.log('[FornecedoresService] Fornecedores processados:', fornecedores.length);

      // Aplicar filtros locais apenas se não foram aplicados na API
      if (params?.search && !queryParams.has('search')) {
        const searchLower = params.search.toLowerCase();
        fornecedores = fornecedores.filter(f => 
          f.nome.toLowerCase().includes(searchLower) ||
          f.email.toLowerCase().includes(searchLower) ||
          f.cidade.toLowerCase().includes(searchLower) ||
          f.estado.toLowerCase().includes(searchLower)
        );
      }

      if (params?.status && !queryParams.has('status')) {
        fornecedores = fornecedores.filter(f => f.status === params.status);
      }

      const result = {
        data: fornecedores,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.total_pages
      };
      
      console.log('[FornecedoresService] Resultado final:', {
        dataLength: result.data.length,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      });
      
      return result;
    } catch (error) {
      console.error('[FornecedoresService] Erro ao buscar fornecedores:', error);
      
      // Retornar estrutura vazia em caso de erro
      return {
        data: [],
        total: 0,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: 0
      };
    }
  }

  async getById(id: number): Promise<Fornecedor> {
    const response = await apiClient.get<any>(`${this.endpoint}/${id}`);
    return {
      id: response.data.id_fornecedor,
      nome: response.data.nome,
      telefone: response.data.telefone,
      email: response.data.email,
      endereco: '',
      cidade: response.data.cidade,
      estado: response.data.estado,
      cep: '',
      data_cadastro: response.data.data_cadastro,
      status: response.data.status.toLowerCase() as 'ativo' | 'inativo'
    };
  }

  async create(fornecedor: {
    nome: string;
    telefone: string;
    email: string;
    cidade: string;
    estado: string;
    status: string;
    data_cadastro: string;
  }): Promise<{message: string}> {
    const response = await apiClient.post<{message: string}>(this.endpoint, {
      nome: fornecedor.nome,
      telefone: fornecedor.telefone,
      email: fornecedor.email,
      cidade: fornecedor.cidade,
      estado: fornecedor.estado,
      status: fornecedor.status,
      data_cadastro: fornecedor.data_cadastro
    });
    return response.data;
  }

  async updateField(id: number, campo: string, valor: string): Promise<{message: string}> {
    const response = await apiClient.put<{message: string}>(`${this.endpoint}/changefields/${id}`, {
      campo,
      valor
    });
    return response.data;
  }

  async updateStatus(id: number): Promise<{message: string}> {
    const response = await apiClient.put<{message: string}>(`/api/fornecedores/changestatus/${id}`);
    return response.data;
  }

  async delete(id: number): Promise<{message: string}> {
    const response = await apiClient.delete<{message: string}>(`${this.endpoint}/${id}`);
    return response.data;
  }

  // Método específico para carregar todos os fornecedores ativos (para uso em selects)
  async getAllActive(): Promise<Fornecedor[]> {
    try {
      console.log('[FornecedoresService] Carregando todos os fornecedores ativos...');
      
      // Fazer uma única requisição com limit alto para pegar todos
      const response = await this.getAll({ 
        page: 1, 
        limit: 1000, // Limit alto para pegar todos de uma vez
        status: 'ativo' 
      });
      
      console.log(`[FornecedoresService] Total de fornecedores ativos carregados: ${response.data.length}`);
      return response.data;
      
    } catch (error) {
      console.error('[FornecedoresService] Erro ao carregar fornecedores ativos:', error);
      return [];
    }
  }
}

export const fornecedoresService = new FornecedoresService();