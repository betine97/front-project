import { useState, useEffect, useCallback } from 'react';
import { tagsService, Tag, TagsResponse, CreateTagRequest } from '../lib/services/tags.service';

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 30,
    totalPages: 0
  });

  // Buscar todas as tags
  const fetchTags = useCallback(async (params?: {
    page?: number;
    limit?: number;
    categoria?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tagsService.getAll(params);
      
      setTags(response.tags);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.total_pages
      });
    } catch (err) {
      console.error('Erro ao buscar tags:', err);
      setError('Erro ao carregar tags');
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar nova tag
  const createTag = useCallback(async (tagData: CreateTagRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tagsService.create(tagData);
      
      // Recarregar a lista de tags após criar
      await fetchTags();
      
      return response;
    } catch (err) {
      console.error('Erro ao criar tag:', err);
      setError('Erro ao criar tag');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTags]);

  // Atribuir tags a um cliente
  const assignTagsToClient = useCallback(async (clienteId: number, tagIds: number[]) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tagsService.assignToClient(clienteId, { ids_tags: tagIds });
      
      return response;
    } catch (err) {
      console.error('Erro ao atribuir tags ao cliente:', err);
      setError('Erro ao salvar tags do cliente');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar tags de um cliente
  const getClientTags = useCallback(async (clienteId: number) => {
    try {
      setError(null);
      
      const clientTags = await tagsService.getClientTags(clienteId);
      
      return clientTags;
    } catch (err) {
      console.error('Erro ao buscar tags do cliente:', err);
      setError('Erro ao carregar tags do cliente');
      return [];
    }
  }, []);

  // Remover tag de um cliente
  const removeTagFromClient = useCallback(async (clienteId: number, tagId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tagsService.removeFromClient(clienteId, tagId);
      
      return response;
    } catch (err) {
      console.error('Erro ao remover tag do cliente:', err);
      setError('Erro ao remover tag do cliente');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar clientes por tag
  const getClientsByTag = useCallback(async (tagId: number, params?: {
    page?: number;
    limit?: number;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tagsService.getClientsByTag(tagId, params);
      
      return response;
    } catch (err) {
      console.error('Erro ao buscar clientes por tag:', err);
      setError('Erro ao buscar clientes');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Excluir tag
  const deleteTag = useCallback(async (tagId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tagsService.delete(tagId);
      
      // Recarregar a lista de tags após excluir
      await fetchTags();
      
      return response;
    } catch (err) {
      console.error('Erro ao excluir tag:', err);
      setError('Erro ao excluir tag');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTags]);

  // Atualizar tag
  const updateTag = useCallback(async (tagId: number, dados: Partial<CreateTagRequest>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tagsService.update(tagId, dados);
      
      // Recarregar a lista de tags após atualizar
      await fetchTags();
      
      return response;
    } catch (err) {
      console.error('Erro ao atualizar tag:', err);
      setError('Erro ao atualizar tag');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTags]);

  // Buscar estatísticas
  const getEstatisticas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const stats = await tagsService.getEstatisticas();
      
      return stats;
    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err);
      setError('Erro ao carregar estatísticas');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Agrupar tags por categoria
  const getTagsByCategory = useCallback(() => {
    const grouped = tags.reduce((acc, tag) => {
      const categoria = tag.categoria_tag;
      if (!acc[categoria]) {
        acc[categoria] = [];
      }
      acc[categoria].push(tag);
      return acc;
    }, {} as Record<string, Tag[]>);

    return grouped;
  }, [tags]);

  // Buscar tag por ID
  const getTagById = useCallback((tagId: number) => {
    return tags.find(tag => tag.id_tag === tagId) || null;
  }, [tags]);

  // Filtrar tags por categoria
  const getTagsByCategoria = useCallback((categoria: string) => {
    return tags.filter(tag => tag.categoria_tag === categoria);
  }, [tags]);

  // Carregar tags na inicialização
  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return {
    // Estado
    tags,
    loading,
    error,
    pagination,
    
    // Ações
    fetchTags,
    createTag,
    assignTagsToClient,
    getClientTags,
    removeTagFromClient,
    getClientsByTag,
    deleteTag,
    updateTag,
    getEstatisticas,
    
    // Utilitários
    getTagsByCategory,
    getTagById,
    getTagsByCategoria,
    
    // Limpar erro
    clearError: () => setError(null)
  };
}