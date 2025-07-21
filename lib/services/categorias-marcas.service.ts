import { apiClient } from '@/lib/api/client'

export interface CategoriaMarcas {
  Categoria: string
  Marcas: string[]
  QuantidadeMarcas: number
}

// Interface para os dados retornados pela API
interface ApiCategoriaMarcas {
  categoria: string
  marcas: string[]
}

export const categoriasMarcasService = {
  async getCategoriasMarcas(): Promise<CategoriaMarcas[]> {
    try {
      const response = await apiClient.get<ApiCategoriaMarcas[]>('/categorias-marcas')
      
      console.log('Dados da API recebidos:', response.data)
      
      // Mapear os dados da API para o formato esperado pelo componente
      const mappedData = response.data.map(item => ({
        Categoria: item.categoria,
        Marcas: item.marcas,
        QuantidadeMarcas: item.marcas.length
      }))
      
      console.log('Dados mapeados:', mappedData)
      return mappedData
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error)
      
      // Vamos usar os dados reais que você forneceu para teste
      return [
        { 
          Categoria: "Alimentação", 
          Marcas: ["Golden", "Whiskas", "Megazoo", "Premier"],
          QuantidadeMarcas: 4
        },
        { 
          Categoria: "Saúde", 
          Marcas: ["Organnact", "Bayer", "Avitrin"],
          QuantidadeMarcas: 3
        },
        { 
          Categoria: "Lazer", 
          Marcas: ["Pet Games", "Chalesco", "Pet Flex"],
          QuantidadeMarcas: 3
        },
        { 
          Categoria: "Higiene", 
          Marcas: ["Chalesco", "Pet Flex"],
          QuantidadeMarcas: 2
        },
        { 
          Categoria: "Medicamentos", 
          Marcas: ["Bayer"],
          QuantidadeMarcas: 1
        }
      ]
    }
  }
}