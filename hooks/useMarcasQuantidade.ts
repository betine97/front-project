'use client'

import { useQuery } from '@tanstack/react-query'
import { marcasQuantidadeService, MarcaQuantidade } from '@/lib/services/marcas-quantidade.service'

export const useMarcasQuantidade = () => {
  return useQuery<MarcaQuantidade[]>({
    queryKey: ['marcas-quantidade'],
    queryFn: marcasQuantidadeService.getMarcasQuantidade,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  })
}