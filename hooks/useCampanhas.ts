import { useState, useEffect } from 'react';
import { Campanha } from '../types/entities';
import { CampanhasService, CriarCampanhaData } from '../lib/services/campanhas.service';

export function useCampanhas(page: number = 1, limit: number = 10) {
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarCampanhas = async (currentPage?: number, currentLimit?: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await CampanhasService.listarCampanhas(currentPage || page, currentLimit || limit);
      
      // Buscar públicos para cada campanha
      const campanhasComPublicos = await Promise.all(
        (data.campanhas || []).map(async (campanha) => {
          try {
            const publicosData = await CampanhasService.obterPublicosDaCampanha(campanha.id);
            return {
              ...campanha,
              publicos_vinculados: publicosData.publicos.map(p => p.nome)
            };
          } catch (error) {
            console.error(`Erro ao buscar públicos da campanha ${campanha.id}:`, error);
            return {
              ...campanha,
              publicos_vinculados: []
            };
          }
        })
      );
      
      setCampanhas(campanhasComPublicos);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar campanhas');
      console.error('Erro ao carregar campanhas:', err);
      // Em caso de erro, manter array vazio
      setCampanhas([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const criarCampanha = async (data: CriarCampanhaData, publicosIds?: number[]): Promise<{ message: string; id_campanha: number }> => {
    try {
      // 1. Criar a campanha
      const resposta = await CampanhasService.criarCampanha(data);
      console.log('[useCampanhas] Campanha criada:', resposta);
      
      // 2. Se há públicos selecionados, vincular à campanha
      if (publicosIds && publicosIds.length > 0) {
        console.log('[useCampanhas] Vinculando públicos à campanha:', publicosIds);
        await CampanhasService.vincularPublicos(resposta.id_campanha, publicosIds);
        console.log('[useCampanhas] Públicos vinculados com sucesso');
      }
      
      // 3. Recarregar a lista de campanhas para obter os dados completos
      await carregarCampanhas();
      
      return resposta;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar campanha';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const atualizarCampanha = async (id: number, data: Partial<CriarCampanhaData>): Promise<Campanha> => {
    try {
      const campanhaAtualizada = await CampanhasService.atualizarCampanha(id, data);
      setCampanhas(prev => prev.map(c => c.id === id ? campanhaAtualizada : c));
      return campanhaAtualizada;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar campanha';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deletarCampanha = async (id: number): Promise<void> => {
    try {
      await CampanhasService.deletarCampanha(id);
      setCampanhas(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar campanha';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    carregarCampanhas();
  }, [page, limit]);

  return {
    campanhas,
    total,
    totalPages,
    loading,
    error,
    criarCampanha,
    atualizarCampanha,
    deletarCampanha,
    recarregar: carregarCampanhas,
  };
}