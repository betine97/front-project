import { apiClient } from '@/lib/api/client';

export interface ProdutoTopMargem {
  produto: string;
  marca: string;
  margem: number;
}

export class ProdutosTopMargemService {
  static async getProdutosTopMargem(): Promise<ProdutoTopMargem[]> {
    try {
      const response = await apiClient.get<ProdutoTopMargem[]>('/produtos-top-margem');
      return response.data;
    } catch (error) {
      console.error('Erro no serviço de produtos top margem:', error);
      // Dados de fallback para teste
      return [
        { produto: "Brinquedo Bola Mordedor", marca: "Pet Games", margem: 59.84 },
        { produto: "Ração Premium Golden", marca: "Golden", margem: 52.15 },
        { produto: "Suplemento Avitrin", marca: "Avitrin", margem: 51.28 },
        { produto: "Brinquedo Lazer Plus", marca: "Megazoo", margem: 49.83 },
        { produto: "Coleira Pet Flex", marca: "Pet Flex", margem: 48.92 },
        { produto: "Ração Whiskas Adulto", marca: "Whiskas", margem: 47.37 },
        { produto: "Medicamento Bayer", marca: "Bayer", margem: 46.73 },
        { produto: "Acessório Chalesco", marca: "Chalesco", margem: 45.37 },
        { produto: "Ração Premier", marca: "Premier", margem: 44.96 },
        { produto: "Suplemento Organnact", marca: "Organnact", margem: 43.65 }
      ];
    }
  }
}