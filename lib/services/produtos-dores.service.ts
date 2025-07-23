import { apiClient } from '@/lib/api/client';

export interface ProdutoDor {
  id: number;
  dor: string;
  beneficio: string;
  categoria: string;
}

// Interface para os dados retornados pela API
interface ApiProdutoDor {
  id: number;
  dor: string;
  beneficio: string;
  categoria: string;
}

export class ProdutosDoresService {
  static async getProdutosDores(): Promise<ProdutoDor[]> {
    console.log('🚀 Tentando buscar dados da API /produtos-dores...');
    
    try {
      const response = await apiClient.get<ApiProdutoDor[]>('/produtos-dores');
      
      console.log('✅ Sucesso! Dados da API recebidos:', response.data);
      
      // Verificar se realmente recebemos dados
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        // Mapear os dados da API para o formato esperado pelo componente
        const mappedData = response.data.map(item => ({
          id: item.id,
          dor: item.dor,
          beneficio: item.beneficio,
          categoria: item.categoria
        }));
        
        console.log('📊 Dados reais mapeados:', mappedData);
        return mappedData;
      } else {
        console.warn('⚠️ API retornou dados vazios, usando fallback');
        throw new Error('API retornou dados vazios');
      }
    } catch (error) {
      console.error('❌ Erro ao buscar dados da API:', error);
      console.log('🔄 Usando dados de fallback para demonstração...');
      
      // Dados de fallback para teste
      return [
        { 
          id: 1, 
          dor: "Falta de apetite", 
          beneficio: "Estimula apetite", 
          categoria: "alimentação" 
        },
        { 
          id: 2, 
          dor: "Pelo opaco", 
          beneficio: "Vitaminas para brilho", 
          categoria: "saúde" 
        },
        { 
          id: 3, 
          dor: "Tédio e stress", 
          beneficio: "Brinquedos interativos", 
          categoria: "lazer" 
        },
        { 
          id: 4, 
          dor: "Mau hálito", 
          beneficio: "Higiene oral", 
          categoria: "higiene" 
        },
        { 
          id: 5, 
          dor: "Ansiedade de separação", 
          beneficio: "Calmantes naturais", 
          categoria: "saúde" 
        },
        { 
          id: 6, 
          dor: "Digestão difícil", 
          beneficio: "Probióticos", 
          categoria: "alimentação" 
        },
        { 
          id: 7, 
          dor: "Pulgas e carrapatos", 
          beneficio: "Antipulgas", 
          categoria: "medicamentos" 
        },
        { 
          id: 8, 
          dor: "Unhas longas", 
          beneficio: "Cortadores de unha", 
          categoria: "higiene" 
        }
      ];
    }
  }
} 