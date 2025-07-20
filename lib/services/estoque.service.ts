// Serviço para operações com estoque
import { apiClient } from '@/lib/api/client';
import { Estoque } from '@/types/entities';
import { PaginatedResponse } from '@/types/api';

export class EstoqueService {
  private endpoint = '/estoque';

  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    produto?: string;
  }): Promise<PaginatedResponse<Estoque>> {
    // A API retorna um array direto, então vamos simular a paginação no frontend
    const response = await apiClient.get<any[]>(this.endpoint);
    let estoque = response.data.map((item: any) => ({
      ...item,
      id: item.id_estoque || item.id
    }));

    // Aplicar filtros
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      estoque = estoque.filter((e: Estoque) => 
        e.id_lote.toLowerCase().includes(searchLower) ||
        e.data_entrada.includes(searchLower)
      );
    }

    if (params?.status) {
      estoque = estoque.filter((e: Estoque) => e.status === params.status);
    }

    if (params?.produto) {
      estoque = estoque.filter((e: Estoque) => e.id_produto.toString() === params.produto);
    }

    // Simular paginação
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEstoque = estoque.slice(startIndex, endIndex);

    return {
      data: paginatedEstoque,
      total: estoque.length,
      page,
      limit,
      totalPages: Math.ceil(estoque.length / limit)
    };
  }

  async getById(id: number): Promise<Estoque> {
    const response = await apiClient.get<any>(`${this.endpoint}/${id}`);
    return {
      ...response.data,
      id: response.data.id_estoque || response.data.id
    };
  }

  async create(estoque: Omit<Estoque, 'id'>): Promise<Estoque> {
    const response = await apiClient.post<any>(this.endpoint, estoque);
    return {
      ...response.data,
      id: response.data.id_estoque || response.data.id
    };
  }

  async update(id: number, estoque: Partial<Estoque>): Promise<Estoque> {
    const response = await apiClient.put<any>(`${this.endpoint}/${id}`, estoque);
    return {
      ...response.data,
      id: response.data.id_estoque || response.data.id
    };
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`);
  }

  async updateQuantidade(id: number, quantidade: number): Promise<Estoque> {
    const response = await apiClient.put<any>(`${this.endpoint}/${id}/quantidade`, {
      quantidade
    });
    return {
      ...response.data,
      id: response.data.id_estoque || response.data.id
    };
  }

  async getByProduto(produtoId: number): Promise<Estoque[]> {
    const response = await apiClient.get<any[]>(`${this.endpoint}/produto/${produtoId}`);
    return response.data.map((item: any) => ({
      ...item,
      id: item.id_estoque || item.id
    }));
  }

  async getLowStock(limite: number = 10): Promise<Estoque[]> {
    const response = await apiClient.get<any[]>(`${this.endpoint}/low-stock?limite=${limite}`);
    return response.data.map((item: any) => ({
      ...item,
      id: item.id_estoque || item.id
    }));
  }
}

export const estoqueService = new EstoqueService();