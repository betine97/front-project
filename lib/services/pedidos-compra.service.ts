// Serviço para operações com pedidos de compra
import { apiClient } from '@/lib/api/client';
import { PedidoCompra, ItemPedido } from '@/types/entities';
import { PaginatedResponse } from '@/types/api';

export class PedidosCompraService {
  private endpoint = '/api/pedidos';
  private itensEndpoint = '/itens-pedido';

  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    fornecedor?: string;
  }): Promise<PaginatedResponse<PedidoCompra>> {
    try {
      console.log('[PedidosCompraService] Fazendo requisição para:', this.endpoint, 'com params:', params);
      
      // Construir query string para a API
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.fornecedor) queryParams.append('fornecedor', params.fornecedor);
      
      const url = queryParams.toString() ? `${this.endpoint}?${queryParams.toString()}` : this.endpoint;
      console.log('[PedidosCompraService] URL final:', url);
      
      // A nova API pode retornar estrutura paginada similar aos outros endpoints
      const response = await apiClient.get<{
        pedidos?: PedidoCompra[];
        descricao_pedido?: PedidoCompra[];
        total: number;
        page?: number;
        limit?: number;
        total_pages?: number;
      }>(url);
      
      console.log('[PedidosCompraService] Resposta recebida:', response);
      
      // Verificar se a resposta tem a estrutura esperada
      if (!response.data) {
        console.error('[PedidosCompraService] Resposta vazia:', response.data);
        throw new Error('Resposta vazia da API');
      }

      // Tentar diferentes estruturas de resposta
      let pedidosData = response.data.pedidos || response.data.descricao_pedido || [];
      
      if (!Array.isArray(pedidosData)) {
        console.error('[PedidosCompraService] Pedidos não é um array:', typeof pedidosData);
        pedidosData = [];
      }
      
      console.log('[PedidosCompraService] Processando', pedidosData.length, 'pedidos da API');
      
      // Aplicar filtros locais se necessário
      let pedidos = pedidosData;
      
      if (params?.search && !queryParams.has('search')) {
        const searchLower = params.search.toLowerCase();
        pedidos = pedidos.filter((p: PedidoCompra) => 
          p.descricao_pedido.toLowerCase().includes(searchLower) ||
          p.data_pedido.includes(searchLower) ||
          p.data_entrega.includes(searchLower)
        );
      }

      if (params?.fornecedor && !queryParams.has('fornecedor')) {
        pedidos = pedidos.filter((p: PedidoCompra) => p.id_fornecedor.toString() === params.fornecedor);
      }

      const result = {
        data: pedidos,
        total: response.data.total || pedidos.length,
        page: response.data.page || params?.page || 1,
        limit: response.data.limit || params?.limit || 10,
        totalPages: response.data.total_pages || Math.ceil((response.data.total || pedidos.length) / (params?.limit || 10))
      };
      
      console.log('[PedidosCompraService] Resultado final:', {
        dataLength: result.data.length,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      });
      
      return result;
    } catch (error) {
      console.error('[PedidosCompraService] Erro ao buscar pedidos:', error);
      
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

  async getById(id: number): Promise<PedidoCompra> {
    const response = await apiClient.get<{descricao_pedido: PedidoCompra[]}>(`${this.endpoint}/${id}`);
    // Assumindo que a API retorna um pedido específico no mesmo formato
    return response.data.descricao_pedido[0] || response.data as any;
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
    const response = await apiClient.post<PedidoCompra>(this.endpoint, pedido);
    return response.data;
  }

  async update(id: number, pedido: Partial<PedidoCompra>): Promise<PedidoCompra> {
    const response = await apiClient.put<PedidoCompra>(`${this.endpoint}/${id}`, pedido);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`);
  }
}

export const pedidosCompraService = new PedidosCompraService();