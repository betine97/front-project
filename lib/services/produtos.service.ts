// Serviço para operações com produtos
import { apiClient } from '@/lib/api/client';
import { Produto } from '@/types/entities';
import { PaginatedResponse } from '@/types/api';

export class ProdutosService {
  private endpoint = '/api/produtos';

  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoria?: string;
    marca?: string;
  }): Promise<PaginatedResponse<Produto>> {
    try {
      console.log('[ProdutosService] Fazendo requisição para:', this.endpoint, 'com params:', params);
      
      // Construir query string para a API
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.categoria) queryParams.append('categoria', params.categoria);
      if (params?.marca) queryParams.append('marca', params.marca);
      
      const url = queryParams.toString() ? `${this.endpoint}?${queryParams.toString()}` : this.endpoint;
      console.log('[ProdutosService] URL final:', url);
      
      // A nova API retorna um objeto com products, total, page, limit, total_pages
      const response = await apiClient.get<{
        products: any[];
        total: number;
        page: number;
        limit: number;
        total_pages: number;
      }>(url);
      
      console.log('[ProdutosService] Resposta recebida:', response);
      console.log('[ProdutosService] Estrutura da resposta:', {
        hasProducts: !!response.data.products,
        totalProducts: response.data.products?.length,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.total_pages
      });
      
      // Verificar se a resposta tem a estrutura esperada
      if (!response.data || !response.data.products) {
        console.error('[ProdutosService] Resposta sem produtos:', response.data);
        throw new Error('Resposta inválida da API - produtos não encontrados');
      }

      const productsData = response.data.products;
      
      if (!Array.isArray(productsData)) {
        console.error('[ProdutosService] Products não é um array:', typeof productsData);
        throw new Error('Estrutura de resposta inválida da API - esperado array de produtos');
      }
      
      console.log('[ProdutosService] Processando', productsData.length, 'produtos da API');
      
      // Mapear produtos da nova estrutura da API
      const produtos = productsData.map((produto: any) => ({
        id: produto.id_produto,
        codigo_barra: produto.codigo_barra || '',
        nome_produto: produto.nome_produto || '',
        sku: produto.sku || '',
        categoria: produto.categoria || '',
        destinado_para: produto.destinado_para || '',
        variacao: produto.variacao || '',
        marca: produto.marca || '',
        descricao: produto.descricao || '',
        status: (produto.status?.toLowerCase() === 'ativo' ? 'ativo' : 'inativo') as 'ativo' | 'inativo',
        preco_venda: typeof produto.preco_venda === 'string' 
          ? parseFloat(produto.preco_venda.replace(',', '.'))
          : produto.preco_venda || 0,
        id_fornecedor: produto.id_fornecedor || 0
      }));
      
      console.log('[ProdutosService] Produtos processados:', produtos.length);

      const result = {
        data: produtos,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.total_pages,
        allData: produtos // Retorna todos os dados para uso em gráficos e filtros
      };
      
      console.log('[ProdutosService] Resultado final:', {
        dataLength: result.data.length,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      });
      
      return result;
    } catch (error) {
      console.error('[ProdutosService] Erro ao buscar produtos:', error);
      
      // Retornar estrutura vazia em caso de erro
      return {
        data: [],
        total: 0,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: 0,
        allData: []
      };
    }
  }

  async getById(id: number): Promise<Produto> {
    const response = await apiClient.get<any>(`${this.endpoint}/${id}`);
    return {
      id: response.data.id_produto,
      codigo_barra: response.data.codigo_barra,
      nome_produto: response.data.nome_produto,
      sku: response.data.sku,
      categoria: response.data.categoria,
      destinado_para: response.data.destinado_para,
      variacao: response.data.variacao,
      marca: response.data.marca,
      descricao: response.data.descricao,
      status: response.data.status as 'ativo' | 'inativo',
      preco_venda: typeof response.data.preco_venda === 'string' 
        ? parseFloat(response.data.preco_venda.replace(',', '.'))
        : response.data.preco_venda,
      id_fornecedor: response.data.id_fornecedor
    };
  }

  async create(produto: {
    data_cadastro: string;
    codigo_barra: string;
    nome_produto: string;
    sku: string;
    categoria: string;
    destinado_para: string;
    variacao: string;
    marca: string;
    descricao: string;
    status: string;
    preco_venda: number;
    id_fornecedor: number;
  }): Promise<{message: string}> {
    const response = await apiClient.post<{message: string}>(this.endpoint, produto);
    return response.data;
  }

  async update(id: number, produto: Partial<Produto>): Promise<Produto> {
    const response = await apiClient.put<any>(`${this.endpoint}/${id}`, produto);
    return {
      id: response.data.id_produto,
      codigo_barra: response.data.codigo_barra,
      nome_produto: response.data.nome_produto,
      sku: response.data.sku,
      categoria: response.data.categoria,
      destinado_para: response.data.destinado_para,
      variacao: response.data.variacao,
      marca: response.data.marca,
      descricao: response.data.descricao,
      status: response.data.status as 'ativo' | 'inativo',
      preco_venda: typeof response.data.preco_venda === 'string' 
        ? parseFloat(response.data.preco_venda.replace(',', '.'))
        : response.data.preco_venda,
      id_fornecedor: response.data.id_fornecedor
    };
  }

  async delete(id: number): Promise<{message: string}> {
    const response = await apiClient.delete<{message: string}>(`${this.endpoint}/${id}`);
    return response.data;
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
