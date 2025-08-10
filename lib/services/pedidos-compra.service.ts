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
      const response = await apiClient.get<any>(url);
      
      console.log('[PedidosCompraService] Resposta recebida:', response);
      console.log('[PedidosCompraService] Tipo de response.data:', typeof response.data);
      console.log('[PedidosCompraService] Conteúdo completo:', JSON.stringify(response.data, null, 2));
      
      // Verificar se a resposta tem a estrutura esperada
      if (!response.data) {
        console.error('[PedidosCompraService] Resposta vazia:', response.data);
        throw new Error('Resposta vazia da API');
      }

      // Tentar diferentes estruturas de resposta
      let pedidosData = response.data.pedidos || 
                       response.data.descricao_pedido || 
                       response.data.data || 
                       response.data;
      
      // Se response.data é um array diretamente
      if (Array.isArray(response.data)) {
        pedidosData = response.data;
      }
      
      if (!Array.isArray(pedidosData)) {
        console.error('[PedidosCompraService] Estrutura de resposta inesperada:', response.data);
        console.error('[PedidosCompraService] Tipo de pedidosData:', typeof pedidosData);
        throw new Error('Estrutura de resposta inválida da API - esperado array de pedidos');
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
    try {
      const response = await apiClient.get<any[]>(this.itensEndpoint);
      return response.data.map((item: any) => ({
        ...item,
        id: item.id_item || item.id
      }));
    } catch (error) {
      console.warn('[PedidosCompraService] Endpoint de itens não disponível:', error);
      return []; // Retornar array vazio se o endpoint não existir
    }
  }

  async create(pedido: {
    id_fornecedor: number;
    data_pedido: string;
    data_entrega: string;
    valor_frete: number;
    custo_pedido: number;
    valor_total: number;
    descricao_pedido: string;
    status: string;
  }): Promise<{message: string, id_pedido: number}> {
    console.log('[PedidosCompraService] Criando pedido:', pedido);
    console.log('[PedidosCompraService] Endpoint:', this.endpoint);
    console.log('[PedidosCompraService] JSON que será enviado:', JSON.stringify(pedido, null, 2));
    
    const response = await apiClient.post<{message: string, id_pedido: number}>(this.endpoint, pedido);
    
    console.log('[PedidosCompraService] Resposta recebida:', response.data);
    return response.data;
  }

  async addItemToPedido(pedidoId: number, item: {
    id_produto: number;
    quantidade: number;
    preco_unitario: number;
    subtotal: number;
  }): Promise<any> {
    console.log(`[PedidosCompraService] Adicionando item ao pedido ${pedidoId}:`, item);
    console.log(`[PedidosCompraService] Endpoint: ${this.endpoint}/${pedidoId}/itens`);
    
    // Mantém o endpoint original para adicionar itens, pois pode ser diferente do endpoint de consulta
    const response = await apiClient.post(`${this.endpoint}/${pedidoId}/itens`, item);
    
    console.log(`[PedidosCompraService] Item adicionado com sucesso:`, response.data);
    return response.data;
  }

  async getItensPedido(pedidoId: number): Promise<any[]> {
    const response = await apiClient.get<any>(`${this.endpoint}/${pedidoId}/itens`);
    
    // Extrair itens da resposta
    let itens = [];
    
    if (response.data.detalhes && Array.isArray(response.data.detalhes)) {
      itens = response.data.detalhes;
    } else if (Array.isArray(response.data)) {
      itens = response.data;
    } else if (response.data.itens && Array.isArray(response.data.itens)) {
      itens = response.data.itens;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      itens = response.data.data;
    } else {
      itens = [];
    }
    
    // Mapear os campos para garantir consistência
    return itens.map((item: any, index: number) => ({
      ...item,
      id_pedido: item.id_pedido,
      nome_produto: item.nome_produto,
      quantidade: item.quantidade,
      preco_unitario: item.preco_unitario,
      total_item: item.total_item,
      subtotal: item.total_item || item.subtotal,
      id_produto: item.id_produto,
      id: item.id_item || item.id || index
    }));
  }

  async update(id: number, pedido: Partial<PedidoCompra>): Promise<PedidoCompra> {
    const response = await apiClient.put<PedidoCompra>(`${this.endpoint}/${id}`, pedido);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`);
  }

  async cancelar(id: number): Promise<{message: string}> {
    console.log(`[PedidosCompraService] Cancelando pedido ${id}`);
    console.log(`[PedidosCompraService] Endpoint: ${this.endpoint}/cancelar/${id}`);
    
    const response = await apiClient.put<{message: string}>(`${this.endpoint}/cancelar/${id}`, {});
    
    console.log(`[PedidosCompraService] Pedido cancelado:`, response.data);
    return response.data;
  }
}

export const pedidosCompraService = new PedidosCompraService();