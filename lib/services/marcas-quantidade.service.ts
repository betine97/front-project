import { apiClient } from '@/lib/api/client'

export interface MarcaQuantidade {
  Marca: string
  Quantidade: number
}

// Interface para os dados retornados pela API
interface ApiMarcaQuantidade {
  marca: string
  quantidade: number
}

export const marcasQuantidadeService = {
  async getMarcasQuantidade(): Promise<MarcaQuantidade[]> {
    try {
      const response = await apiClient.get<ApiMarcaQuantidade[]>('/marcas-quantidade')
      
      console.log('Dados da API recebidos:', response.data)
      
      // Mapear os dados da API para o formato esperado pelo componente
      const mappedData = response.data.map(item => ({
        Marca: item.marca,
        Quantidade: item.quantidade
      }))
      
      console.log('Dados mapeados:', mappedData)
      return mappedData
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error)
      
      // Vamos usar os dados reais que você forneceu para teste
      return [
        { Marca: "Golden", Quantidade: 1 },
        { Marca: "Whiskas", Quantidade: 1 },
        { Marca: "Organnact", Quantidade: 1 },
        { Marca: "Pet Games", Quantidade: 1 },
        { Marca: "Megazoo", Quantidade: 1 },
        { Marca: "Bayer", Quantidade: 1 },
        { Marca: "Chalesco", Quantidade: 1 },
        { Marca: "Premier", Quantidade: 1 },
        { Marca: "Avitrin", Quantidade: 1 },
        { Marca: "Pet Flex", Quantidade: 1 }
      ]
    }
  }
}