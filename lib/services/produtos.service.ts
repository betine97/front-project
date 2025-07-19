// Serviço para operações com produtos
import { apiClient } from '@/lib/api/client';
import { Produto } from '@/types/entities';
import { PaginatedResponse } from '@/types/api';

export class ProdutosService {
  private endpoint = '/produtos';

  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoria?: string;
    marca?: string;
  }): Promise<PaginatedResponse<Produto>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.categoria) searchParams.set('categoria', params.categoria);
    if (params?.marca) searchParams.set('marca', params.marca);

    const query = searchParams.toString();
    const endpoint = query ? `${this.endpoint}?${query}` : this.endpoint;
    
    const response = await apiClient.get<PaginatedResponse<Produto>>(endpoint);
    return response.data;
  }

  async getById(id: string): Promise<Produto> {
    const response = await apiClient.get<Produto>(`${this.endpoint}/${id}`);
    return response.data;
  }

  async create(produto: Omit<Produto, 'id' | 'dataCadastro'>): Promise<Produto> {
    const response = await apiClient.post<Produto>(this.endpoint, produto);
    return response.data;
  }

  async update(id: string, produto: Partial<Produto>): Promise<Produto> {
    const response = await apiClient.put<Produto>(`${this.endpoint}/${id}`, produto);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`);
  }

  async updateEstoque(id: string, quantidade: number): Promise<Produto> {
    const response = await apiClient.put<Produto>(`${this.endpoint}/${id}/estoque`, {
      quantidade
    });
    return response.data;
  }

  async getCategorias(): Promise<string[]> {
    const response = await apiClient.get<string[]>(`${this.endpoint}/categorias`);
    return response.data;
  }

  async getMarcas(): Promise<string[]> {
    const response = await apiClient.get<string[]>(`${this.endpoint}/marcas`);
    return response.data;
  }
}

export const produtosService = new ProdutosService();