import { Campanha } from '../../types/entities';
import { apiClient } from '../api/client';

export interface CriarCampanhaData {
  nome: string;
  desc?: string;
  data_criacao: string;
  data_lancamento: string;
  data_fim?: string;
  status: 'ativa' | 'inativa' | 'pausada' | 'finalizada';
}

export class CampanhasService {
  private static endpoint = '/api/campanhas';

  static async criarCampanha(data: CriarCampanhaData): Promise<{ message: string; id_campanha: number }> {
    try {
      console.log('[CampanhasService] Criando campanha:', data);
      const response = await apiClient.post<{ message: string; id_campanha: number }>(this.endpoint, data);
      console.log('[CampanhasService] Resposta da API:', response.data);
      return response.data;
    } catch (error) {
      console.error('[CampanhasService] Erro ao criar campanha:', error);
      throw error;
    }
  }

  static async listarCampanhas(page?: number, limit?: number): Promise<{ campanhas: Campanha[], total: number, totalPages: number }> {
    try {
      console.log('[CampanhasService] Listando campanhas - page:', page, 'limit:', limit);
      
      const params = new URLSearchParams();
      if (page) params.append('page', page.toString());
      if (limit) params.append('limit', limit.toString());
      
      const endpoint = params.toString() ? `${this.endpoint}?${params.toString()}` : this.endpoint;
      const response = await apiClient.get<{ campanhas: Campanha[], total: number, totalPages: number }>(endpoint);
      
      return response.data;
    } catch (error) {
      console.error('[CampanhasService] Erro ao listar campanhas:', error);
      throw error;
    }
  }

  static async obterCampanha(id: number): Promise<Campanha> {
    try {
      console.log('[CampanhasService] Obtendo campanha ID:', id);
      const response = await apiClient.get<Campanha>(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      console.error('[CampanhasService] Erro ao obter campanha:', error);
      throw error;
    }
  }

  static async atualizarCampanha(id: number, data: Partial<CriarCampanhaData>): Promise<Campanha> {
    try {
      console.log('[CampanhasService] Atualizando campanha ID:', id, 'dados:', data);
      const response = await apiClient.put<Campanha>(`${this.endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('[CampanhasService] Erro ao atualizar campanha:', error);
      throw error;
    }
  }

  static async deletarCampanha(id: number): Promise<void> {
    try {
      console.log('[CampanhasService] Deletando campanha ID:', id);
      await apiClient.delete<void>(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error('[CampanhasService] Erro ao deletar campanha:', error);
      throw error;
    }
  }

  static async vincularPublicos(campanhaId: number, publicosIds: number[]): Promise<{ message: string }> {
    try {
      console.log('[CampanhasService] Vinculando públicos à campanha:', campanhaId, publicosIds);
      const response = await apiClient.post<{ message: string }>(
        `${this.endpoint}/${campanhaId}/publicos`,
        { publicos: publicosIds }
      );
      return response.data;
    } catch (error) {
      console.error('[CampanhasService] Erro ao vincular públicos:', error);
      throw error;
    }
  }

  static async obterPublicosDaCampanha(campanhaId: number): Promise<{
    publicos: Array<{
      id: number;
      nome: string;
      descricao: string;
      data_criacao: string;
      status: string;
    }>;
    total: number;
    id_campanha: number;
  }> {
    try {
      console.log('[CampanhasService] Buscando públicos da campanha:', campanhaId);
      const response = await apiClient.get<{
        publicos: Array<{
          id: number;
          nome: string;
          descricao: string;
          data_criacao: string;
          status: string;
        }>;
        total: number;
        id_campanha: number;
      }>(`/api/campanhas/${campanhaId}/publicos`);
      return response.data;
    } catch (error) {
      console.error('[CampanhasService] Erro ao buscar públicos da campanha:', error);
      // Retornar estrutura vazia em caso de erro
      return {
        publicos: [],
        total: 0,
        id_campanha: campanhaId
      };
    }
  }
}