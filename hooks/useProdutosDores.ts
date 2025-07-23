'use client'

import { useQuery } from '@tanstack/react-query'
import { ProdutosDoresService, ProdutoDor } from '@/lib/services/produtos-dores.service'

export const useProdutosDores = () => {
  return useQuery<ProdutoDor[]>({
    queryKey: ['produtos-dores'],
    queryFn: ProdutosDoresService.getProdutosDores,
    staleTime: 0, // Sempre considerar dados como stale para buscar atualizações
    refetchOnWindowFocus: true, // Tentar buscar quando o usuário voltar à aba
    retry: 3, // Tentar 3 vezes em caso de erro
    retryDelay: 1000, // 1 segundo entre tentativas
  })
} 