'use client'

import { useQuery } from '@tanstack/react-query'
import { categoriasMarcasService, CategoriaMarcas } from '@/lib/services/categorias-marcas.service'

export const useCategoriasMarcas = () => {
  return useQuery<CategoriaMarcas[]>({
    queryKey: ['categorias-marcas'],
    queryFn: categoriasMarcasService.getCategoriasMarcas,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  })
}