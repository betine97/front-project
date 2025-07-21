'use client'

import { useQuery } from '@tanstack/react-query'
import { categoriasQuantidadeService, CategoriaQuantidade } from '@/lib/services/categorias-quantidade.service'

export const useCategoriasQuantidade = () => {
  return useQuery<CategoriaQuantidade[]>({
    queryKey: ['categorias-quantidade'],
    queryFn: categoriasQuantidadeService.getCategoriasQuantidade,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  })
}