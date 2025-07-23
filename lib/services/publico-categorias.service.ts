import { apiClient } from '@/lib/api/client';

export interface PublicoCategorias {
  publico_alvo: string;
  categorias: string[];
}

export class PublicoCategoriasService {
  static async getPublicoCategorias(): Promise<PublicoCategorias[]> {
    try {
      const response = await apiClient.get<PublicoCategorias[]>('/publico-categorias');
      return response.data;
    } catch (error) {
      console.error('Erro no serviço de público categorias:', error);
      // Dados de fallback para teste
      return [
        { publico_alvo: "Cães", categorias: ["Alimentação", "Saúde", "Lazer"] },
        { publico_alvo: "Gatos", categorias: ["Alimentação", "Saúde"] },
        { publico_alvo: "Pássaros", categorias: ["Alimentação", "Lazer"] },
        { publico_alvo: "Peixes", categorias: ["Alimentação"] },
        { publico_alvo: "Roedores", categorias: ["Alimentação", "Lazer"] }
      ];
    }
  }
}