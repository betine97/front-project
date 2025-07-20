// Serviço para operações com fornecedores
import { apiClient } from '@/lib/api/client';
import { Fornecedor } from '@/types/entities';
import { PaginatedResponse } from '@/types/api';

export class FornecedoresService {
  private endpoint = '/fornecedores';

  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<PaginatedResponse<Fornecedor>> {
    // A API retorna um array direto, então vamos simular a paginação no frontend
    const response = await apiClient.get<any[]>(this.endpoint);
    let fornecedores = response.data.map((fornecedor: any) => ({
      ...fornecedor,
      id: fornecedor.id_fornecedor || fornecedor.id
    }));

    // Aplicar filtros
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      fornecedores = fornecedores.filter(f => 
        f.nome.toLowerCase().includes(searchLower) ||
        f.email.toLowerCase().includes(searchLower) ||
        f.cidade.toLowerCase().includes(searchLower) ||
        f.estado.toLowerCase().includes(searchLower)
      );
    }

    if (params?.status) {
      fornecedores = fornecedores.filter(f => f.status === params.status);
    }

    // Simular paginação
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFornecedores = fornecedores.slice(startIndex, endIndex);

    return {
      data: paginatedFornecedores,
      total: fornecedores.length,
      page,
      limit,
      totalPages: Math.ceil(fornecedores.length / limit)
    };
  }

  async getById(id: number): Promise<Fornecedor> {
    const response = await apiClient.get<any>(`${this.endpoint}/${id}`);
    return {
      ...response.data,
      id: response.data.id_fornecedor || response.data.id
    };
  }

  async create(fornecedor: Omit<Fornecedor, 'id'>): Promise<Fornecedor> {
    const response = await apiClient.post<any>(this.endpoint, fornecedor);
    return {
      ...response.data,
      id: response.data.id_fornecedor || response.data.id
    };
  }

  async update(id: number, fornecedor: Partial<Fornecedor>): Promise<Fornecedor> {
    const response = await apiClient.put<any>(`${this.endpoint}/${id}`, fornecedor);
    return {
      ...response.data,
      id: response.data.id_fornecedor || response.data.id
    };
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`);
  }
}

export const fornecedoresService = new FornecedoresService();