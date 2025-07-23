import { apiClient } from '@/lib/api/client';

export interface MarcaMargem {
  marca: string;
  margem: number;
}

export class MarcasMargemService {
  static async getMarcasMargem(): Promise<MarcaMargem[]> {
    try {
      const response = await apiClient.get<MarcaMargem[]>('/marcas-margem');
      return response.data;
    } catch (error) {
      console.error('Erro no serviço de margem por marca:', error);
      // Dados de fallback para teste
      return [
        { marca: "Golden", margem: 47.37 },
        { marca: "Whiskas", margem: 44.96 },
        { marca: "Organnact", margem: 45.37 },
        { marca: "Pet Games", margem: 59.84 },
        { marca: "Megazoo", margem: 49.83 },
        { marca: "Bayer", margem: 52.15 },
        { marca: "Chalesco", margem: 48.92 },
        { marca: "Premier", margem: 46.73 },
        { marca: "Avitrin", margem: 51.28 },
        { marca: "Pet Flex", margem: 43.65 }
      ];
    }
  }
}