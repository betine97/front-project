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
    // A API retorna um array direto, então vamos simular a paginação no frontend
    const response = await apiClient.get<Produto[]>(this.endpoint);
    let produtos = response.data;

    // Aplicar filtros
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      produtos = produtos.filter(p => 
        p.nome_produto.toLowerCase().includes(searchLower) ||
        p.descricao.toLowerCase().includes(searchLower) ||
        p.sku.toLowerCase().includes(searchLower)
      );
    }

    if (params?.categoria) {
      produtos = produtos.filter(p => p.categoria === params.categoria);
    }

    if (params?.marca) {
      produtos = produtos.filter(p => p.marca === params.marca);
    }

    // Simular paginação
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProdutos = produtos.slice(startIndex, endIndex);

    return {
      data: paginatedProdutos,
      total: produtos.length,
      page,
      limit,
      totalPages: Math.ceil(produtos.length / limit)
    };
  }

  async getById(id: number): Promise<Produto> {
    const response = await apiClient.get<Produto>(`${this.endpoint}/${id}`);
    return response.data;
  }

  async create(produto: Omit<Produto, 'id'>): Promise<Produto> {
    const response = await apiClient.post<Produto>(this.endpoint, produto);
    return response.data;
  }

  async update(id: number, produto: Partial<Produto>): Promise<Produto> {
    const response = await apiClient.put<Produto>(`${this.endpoint}/${id}`, produto);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`);
  }

  async updateEstoque(id: number, quantidade: number): Promise<Produto> {
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