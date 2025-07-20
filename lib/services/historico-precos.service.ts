// Serviço para operações com histórico de preços
import { apiClient } from '@/lib/api/client';
import { HistoricoPreco } from '@/types/entities';
import { PaginatedResponse } from '@/types/api';

export class HistoricoPrecosService {
  private endpoint = '/historico-precos';

  async getAll(params?: {
    page?: number;
    limit?: number;
    produto?: number;
    dataInicio?: string;
    dataFim?: string;
  }): Promise<PaginatedResponse<HistoricoPreco>> {
    // A API retorna um array direto, então vamos simular a paginação no frontend
    const response = await apiClient.get<any[]>(this.endpoint);
    let historico = response.data.map((item: any) => ({
      ...item,
      custo_unidade: typeof item.custo_unidade === 'string' 
        ? parseFloat(item.custo_unidade.replace(',', '.'))
        : item.custo_unidade,
      valor_venda: typeof item.valor_venda === 'string' 
        ? parseFloat(item.valor_venda.replace(',', '.'))
        : item.valor_venda,
      markup: typeof item.markup === 'string' 
        ? parseFloat(item.markup.replace(',', '.'))
        : item.markup,
      margem: typeof item.margem === 'string' 
        ? parseFloat(item.margem.replace(',', '.'))
        : item.margem
    }));

    // Aplicar filtros
    if (params?.produto) {
      historico = historico.filter(h => h.id_produto === params.produto);
    }

    if (params?.dataInicio) {
      historico = historico.filter(h => h.data_registro >= params.dataInicio!);
    }

    if (params?.dataFim) {
      historico = historico.filter(h => h.data_registro <= params.dataFim!);
    }

    // Ordenar por data mais recente primeiro
    historico.sort((a, b) => new Date(b.data_registro).getTime() - new Date(a.data_registro).getTime());

    // Simular paginação
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedHistorico = historico.slice(startIndex, endIndex);

    return {
      data: paginatedHistorico,
      total: historico.length,
      page,
      limit,
      totalPages: Math.ceil(historico.length / limit)
    };
  }

  async getByProdutoId(produtoId: number): Promise<HistoricoPreco[]> {
    // Como não existe endpoint específico, vamos buscar todos e filtrar
    const response = await apiClient.get<any[]>(this.endpoint);
    const historico = response.data
      .filter((item: any) => item.id_produto === produtoId)
      .map((item: any) => ({
        ...item,
        custo_unidade: typeof item.custo_unidade === 'string' 
          ? parseFloat(item.custo_unidade.replace(',', '.'))
          : item.custo_unidade,
        valor_venda: typeof item.valor_venda === 'string' 
          ? parseFloat(item.valor_venda.replace(',', '.'))
          : item.valor_venda,
        markup: typeof item.markup === 'string' 
          ? parseFloat(item.markup.replace(',', '.'))
          : item.markup,
        margem: typeof item.margem === 'string' 
          ? parseFloat(item.margem.replace(',', '.'))
          : item.margem
      }));
    return historico.sort((a, b) => new Date(b.data_registro).getTime() - new Date(a.data_registro).getTime());
  }

  async getLatestByProdutoId(produtoId: number): Promise<HistoricoPreco | null> {
    const historico = await this.getByProdutoId(produtoId);
    return historico.length > 0 ? historico[0] : null;
  }

  async create(historico: Omit<HistoricoPreco, 'id'>): Promise<HistoricoPreco> {
    const response = await apiClient.post<any>(this.endpoint, historico);
    return {
      ...response.data,
      custo_unidade: typeof response.data.custo_unidade === 'string' 
        ? parseFloat(response.data.custo_unidade.replace(',', '.'))
        : response.data.custo_unidade,
      valor_venda: typeof response.data.valor_venda === 'string' 
        ? parseFloat(response.data.valor_venda.replace(',', '.'))
        : response.data.valor_venda,
      markup: typeof response.data.markup === 'string' 
        ? parseFloat(response.data.markup.replace(',', '.'))
        : response.data.markup,
      margem: typeof response.data.margem === 'string' 
        ? parseFloat(response.data.margem.replace(',', '.'))
        : response.data.margem
    };
  }

  async getById(id: number): Promise<HistoricoPreco> {
    const response = await apiClient.get<any>(`${this.endpoint}/${id}`);
    return {
      ...response.data,
      custo_unidade: typeof response.data.custo_unidade === 'string' 
        ? parseFloat(response.data.custo_unidade.replace(',', '.'))
        : response.data.custo_unidade,
      valor_venda: typeof response.data.valor_venda === 'string' 
        ? parseFloat(response.data.valor_venda.replace(',', '.'))
        : response.data.valor_venda,
      markup: typeof response.data.markup === 'string' 
        ? parseFloat(response.data.markup.replace(',', '.'))
        : response.data.markup,
      margem: typeof response.data.margem === 'string' 
        ? parseFloat(response.data.margem.replace(',', '.'))
        : response.data.margem
    };
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`);
  }

  // Método para calcular estatísticas de preços
  async getEstatisticasPorProduto(produtoId: number): Promise<{
    precoAtual: number;
    precoAnterior: number;
    variacao: number;
    percentualVariacao: number;
    margemAtual: number;
    markupAtual: number;
  }> {
    try {
      const historico = await this.getByProdutoId(produtoId);
      
      if (historico.length === 0) {
        return {
          precoAtual: 0,
          precoAnterior: 0,
          variacao: 0,
          percentualVariacao: 0,
          margemAtual: 0,
          markupAtual: 0
        };
      }

      const atual = historico[0];
      const anterior = historico.length > 1 ? historico[1] : atual;
      
      const variacao = atual.valor_venda - anterior.valor_venda;
      const percentualVariacao = anterior.valor_venda > 0 
        ? (variacao / anterior.valor_venda) * 100 
        : 0;

      return {
        precoAtual: atual.valor_venda || 0,
        precoAnterior: anterior.valor_venda || 0,
        variacao: variacao || 0,
        percentualVariacao: percentualVariacao || 0,
        margemAtual: atual.margem || 0,
        markupAtual: atual.markup || 0
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
      return {
        precoAtual: 0,
        precoAnterior: 0,
        variacao: 0,
        percentualVariacao: 0,
        margemAtual: 0,
        markupAtual: 0
      };
    }
  }
}

export const historicoPrecosService = new HistoricoPrecosService();