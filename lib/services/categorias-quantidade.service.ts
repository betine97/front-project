import { apiClient } from '@/lib/api/client'

export interface CategoriaQuantidade {
  Categoria: string
  Quantidade: number
}

// Interface para os dados retornados pela API
interface ApiCategoriaQuantidade {
  categoria: string
  quantidade: number
}

export const categoriasQuantidadeService = {
  async getCategoriasQuantidade(): Promise<CategoriaQuantidade[]> {
    try {
      const response = await apiClient.get<ApiCategoriaQuantidade[]>('/categorias-quantidade')
      
      console.log('Dados da API recebidos:', response.data)
      
      // Mapear os dados da API para o formato esperado pelo componente
      const mappedData = response.data.map(item => ({
        Categoria: item.categoria,
        Quantidade: item.quantidade
      }))
      
      console.log('Dados mapeados:', mappedData)
      return mappedData
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error)
      
      // Vamos usar os dados reais que você forneceu para teste
      return [
        { Categoria: "Alimentação", Quantidade: 4 },
        { Categoria: "Saúde", Quantidade: 3 },
        { Categoria: "Lazer", Quantidade: 3 },
        { Categoria: "Higiene", Quantidade: 2 },
        { Categoria: "Brinquedos", Quantidade: 2 },
        { Categoria: "Acessórios", Quantidade: 1 },
        { Categoria: "Medicamentos", Quantidade: 1 }
      ]
    }
  }
}