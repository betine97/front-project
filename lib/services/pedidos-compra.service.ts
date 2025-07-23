// Serviço para operações com pedidos de compra
import { apiClient } from '@/lib/api/client';
import { PedidoCompra, ItemPedido } from '@/types/entities';
import { PaginatedResponse } from '@/types/api';

export class PedidosCompraService {
  private endpoint = '/pedidos-compra';
  private itensEndpoint = '/itens-pedido';

  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    fornecedor?: string;
  }): Promise<PaginatedResponse<PedidoCompra>> {
    // A API retorna um array direto, então vamos simular a paginação no frontend
    const response = await apiClient.get<any[]>(this.endpoint);
    let pedidos = response.data;

    // Aplicar filtros
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      pedidos = pedidos.filter((p: PedidoCompra) => 
        p.descricao_pedido.toLowerCase().includes(searchLower) ||
        p.data_pedido.includes(searchLower) ||
        p.data_entrega.includes(searchLower)
      );
    }

    if (params?.fornecedor) {
      pedidos = pedidos.filter((p: PedidoCompra) => p.id_fornecedor.toString() === params.fornecedor);
    }

    // Simular paginação
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPedidos = pedidos.slice(startIndex, endIndex);

    return {
      data: paginatedPedidos,
      total: pedidos.length,
      page,
      limit,
      totalPages: Math.ceil(pedidos.length / limit)
    };
  }

  async getById(id: number): Promise<PedidoCompra> {
    const response = await apiClient.get<any>(`${this.endpoint}/${id}`);
    return response.data;
  }

  async getItensByPedidoId(pedidoId: number): Promise<ItemPedido[]> {
    const response = await apiClient.get<any[]>(`${this.itensEndpoint}?pedido_id=${pedidoId}`);
    return response.data.map((item: any) => ({
      ...item,
      id: item.id_item || item.id
    }));
  }

  async getAllItens(): Promise<ItemPedido[]> {
    const response = await apiClient.get<any[]>(this.itensEndpoint);
    return response.data.map((item: any) => ({
      ...item,
      id: item.id_item || item.id
    }));
  }

  async create(pedido: Omit<PedidoCompra, 'id_pedido'>): Promise<PedidoCompra> {
    const response = await apiClient.post<any>(this.endpoint, pedido);
    return response.data;
  }

  async update(id: number, pedido: Partial<PedidoCompra>): Promise<PedidoCompra> {
    const response = await apiClient.put<any>(`${this.endpoint}/${id}`, pedido);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`);
  }
}

export const pedidosCompraService = new PedidosCompraService();