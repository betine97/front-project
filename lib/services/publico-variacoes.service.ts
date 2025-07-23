import { apiClient } from '@/lib/api/client';

export interface PublicoVariacoes {
  publico_alvo: string;
  variacoes: string[];
}

export class PublicoVariacoesService {
  static async getPublicoVariacoes(): Promise<PublicoVariacoes[]> {
    try {
      const response = await apiClient.get<PublicoVariacoes[]>('/publico-variacoes');
      return response.data;
    } catch (error) {
      console.error('Erro no serviço de público variações:', error);
      // Dados de fallback para teste
      return [
        { publico_alvo: "Cães", variacoes: ["Raças Grandes", "Idosos", "Raças Pequenas", "Filhotes"] },
        { publico_alvo: "Gatos", variacoes: ["Filhotes", "Adultos", "Idosos"] },
        { publico_alvo: "Pássaros", variacoes: ["Canários", "Periquitos"] },
        { publico_alvo: "Peixes", variacoes: ["Água Doce", "Água Salgada"] },
        { publico_alvo: "Roedores", variacoes: ["Hamsters", "Coelhos", "Chinchilas"] }
      ];
    }
  }
}