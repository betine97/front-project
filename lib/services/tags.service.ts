// Serviço para operações com tags
import { apiClient } from '../api/client';

export interface Tag {
  id_tag: number;
  categoria_tag: string;
  nome_tag: string;
}

export interface TagsResponse {
  tags: Tag[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface CreateTagRequest {
  categoria_tag: string;
  nome_tag: string;
}

export interface CreateTagResponse {
  message: string;
}

export interface AssignTagsRequest {
  ids_tags: number[];
}

export interface AssignTagsResponse {
  message: string;
}

export class TagsService {
  private endpoint = '/api/tags';

  // Buscar todas as tags
  async getAll(params?: {
    page?: number;
    limit?: number;
    categoria?: string;
  }): Promise<TagsResponse> {
    try {
      console.log('[TagsService] Buscando tags com params:', params);

      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.categoria) queryParams.append('categoria', params.categoria);

      const url = queryParams.toString() ? `${this.endpoint}?${queryParams.toString()}` : this.endpoint;
      console.log('[TagsService] URL final:', url);

      const response = await apiClient.get<TagsResponse>(url);
      console.log('[TagsService] Resposta recebida:', response.data);

      return response.data;
    } catch (error) {
      console.error('[TagsService] Erro ao buscar tags:', error);
      return {
        tags: [],
        total: 0,
        page: params?.page || 1,
        limit: params?.limit || 30,
        total_pages: 0
      };
    }
  }

  // Criar nova tag
  async create(tag: CreateTagRequest): Promise<CreateTagResponse> {
    try {
      console.log('[TagsService] Criando nova tag:', tag);

      const response = await apiClient.post<CreateTagResponse>(this.endpoint, tag);
      console.log('[TagsService] Tag criada com sucesso:', response.data);

      return response.data;
    } catch (error) {
      console.error('[TagsService] Erro ao criar tag:', error);
      throw new Error('Erro ao criar tag. Tente novamente.');
    }
  }

  // Atribuir tags a um cliente
  async assignToClient(clienteId: number, tags: AssignTagsRequest): Promise<AssignTagsResponse> {
    try {
      console.log('[TagsService] Atribuindo tags ao cliente:', clienteId, 'tags:', tags);

      const response = await apiClient.post<AssignTagsResponse>(
        `/api/clientes/${clienteId}/tags`,
        tags
      );
      console.log('[TagsService] Tags atribuídas com sucesso:', response.data);

      return response.data;
    } catch (error) {
      console.error('[TagsService] Erro ao atribuir tags ao cliente:', error);
      throw new Error('Erro ao salvar tags do cliente. Tente novamente.');
    }
  }

  // Buscar tags de um cliente específico
  async getClientTags(clienteId: number): Promise<Tag[]> {
    try {
      console.log('[TagsService] Buscando tags do cliente:', clienteId);

      const response = await apiClient.get<{ tags: Tag[] }>(`/api/clientes/${clienteId}/tags`);
      console.log('[TagsService] Tags do cliente encontradas:', response.data);

      return response.data.tags || [];
    } catch (error) {
      console.error('[TagsService] Erro ao buscar tags do cliente:', error);
      return [];
    }
  }

  // Remover tag de um cliente
  async removeFromClient(clienteId: number, tagId: number): Promise<{ message: string }> {
    try {
      console.log('[TagsService] Removendo tag', tagId, 'do cliente:', clienteId);

      const response = await apiClient.delete<{ message: string }>(
        `/api/clientes/${clienteId}/tags/${tagId}`
      );
      console.log('[TagsService] Tag removida com sucesso:', response.data);

      return response.data;
    } catch (error) {
      console.error('[TagsService] Erro ao remover tag do cliente:', error);
      throw new Error('Erro ao remover tag do cliente. Tente novamente.');
    }
  }

  // Buscar clientes por tag
  async getClientsByTag(tagId: number, params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    clientes: any[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }> {
    try {
      console.log('[TagsService] Buscando clientes com tag:', tagId, 'params:', params);

      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const url = queryParams.toString() 
        ? `${this.endpoint}/${tagId}/clientes?${queryParams.toString()}`
        : `${this.endpoint}/${tagId}/clientes`;

      const response = await apiClient.get<{
        clientes: any[];
        total: number;
        page: number;
        limit: number;
        total_pages: number;
      }>(url);

      console.log('[TagsService] Clientes encontrados:', response.data);
      return response.data;
    } catch (error) {
      console.error('[TagsService] Erro ao buscar clientes por tag:', error);
      return {
        clientes: [],
        total: 0,
        page: params?.page || 1,
        limit: params?.limit || 30,
        total_pages: 0
      };
    }
  }

  // Excluir tag
  async delete(tagId: number): Promise<{ message: string }> {
    try {
      console.log('[TagsService] Excluindo tag:', tagId);

      const response = await apiClient.delete<{ message: string }>(`${this.endpoint}/${tagId}`);
      console.log('[TagsService] Tag excluída com sucesso:', response.data);

      return response.data;
    } catch (error) {
      console.error('[TagsService] Erro ao excluir tag:', error);
      throw new Error('Erro ao excluir tag. Verifique se não há clientes vinculados.');
    }
  }

  // Atualizar tag
  async update(tagId: number, dados: Partial<CreateTagRequest>): Promise<{ message: string }> {
    try {
      console.log('[TagsService] Atualizando tag:', tagId, 'dados:', dados);

      const response = await apiClient.put<{ message: string }>(`${this.endpoint}/${tagId}`, dados);
      console.log('[TagsService] Tag atualizada com sucesso:', response.data);

      return response.data;
    } catch (error) {
      console.error('[TagsService] Erro ao atualizar tag:', error);
      throw new Error('Erro ao atualizar tag. Tente novamente.');
    }
  }

  // Buscar estatísticas de uso das tags
  async getEstatisticas(): Promise<{
    totalTags: number;
    tagsPopulares: Array<{
      tag: Tag;
      totalClientes: number;
    }>;
    categorias: Array<{
      categoria: string;
      totalTags: number;
      totalClientes: number;
    }>;
  }> {
    try {
      console.log('[TagsService] Buscando estatísticas de tags');

      const response = await apiClient.get<{
        total_tags: number;
        tags_populares: Array<{
          tag: Tag;
          total_clientes: number;
        }>;
        categorias: Array<{
          categoria: string;
          total_tags: number;
          total_clientes: number;
        }>;
      }>(`${this.endpoint}/estatisticas`);

      return {
        totalTags: response.data.total_tags || 0,
        tagsPopulares: response.data.tags_populares?.map(item => ({
          tag: item.tag,
          totalClientes: item.total_clientes
        })) || [],
        categorias: response.data.categorias?.map(item => ({
          categoria: item.categoria,
          totalTags: item.total_tags,
          totalClientes: item.total_clientes
        })) || []
      };
    } catch (error) {
      console.error('[TagsService] Erro ao buscar estatísticas:', error);
      return {
        totalTags: 0,
        tagsPopulares: [],
        categorias: []
      };
    }
  }
}

export const tagsService = new TagsService();