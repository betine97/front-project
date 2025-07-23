import { apiClient } from '@/lib/api/client';

export interface CategoriaMargem {
  categoria: string;
  margem: number;
}

export class CategoriasMargemService {
  static async getCategoriasMargem(): Promise<CategoriaMargem[]> {
    try {
      const response = await apiClient.get<CategoriaMargem[]>('/categorias-margem');
      return response.data;
    } catch (error) {
      console.error('Erro no serviço de margem por categoria:', error);
      // Dados de fallback para teste
      return [
        { categoria: "Alimentação", margem: 47.54 },
        { categoria: "Saúde", margem: 14.68 },
        { categoria: "Lazer", margem: 52.02 }
      ];
    }
  }
}