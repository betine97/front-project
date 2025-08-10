import { apiClient } from '../api/client';

export interface Criterio {
  id: number;
  nome_condicao: string;
}

export interface CriteriosResponse {
  criterios?: Criterio[];
  data?: Criterio[];
  total: number;
}

export interface PublicoAlvo {
  id?: number;
  nome: string;
  descricao: string;
  data_criacao: string;
  status: 'Ativo' | 'Inativo';
}

export interface PublicosResponse {
  publicos?: PublicoAlvo[];
  data?: PublicoAlvo[];
  total: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface CreatePublicoResponse {
  message: string;
  id_publico: number;
}

export interface AssociarCriteriosResponse {
  message: string;
}

export interface PublicoCriteriosResponse {
  criterios?: {
    id_publico: number;
    id_criterio: number;
    nome_condicao: string;
  }[];
  data?: {
    id_publico: number;
    id_criterio: number;
    nome_condicao: string;
  }[];
  total: number;
}

class PublicosService {
  // Buscar todos os critérios disponíveis
  async getCriterios(): Promise<CriteriosResponse> {
    try {
      console.log('[PublicosService] Buscando critérios:', '/api/criterios');
      const response = await apiClient.get<any>('/api/criterios');
      console.log('[PublicosService] Resposta dos critérios:', response.data);
      
      // Adaptar resposta para o formato esperado
      const adaptedResponse: CriteriosResponse = {
        criterios: response.data.criterios || response.data.data || response.data || [],
        total: response.data.total || (response.data.criterios || response.data.data || response.data || []).length
      };
      
      return adaptedResponse;
    } catch (error) {
      console.error('Erro ao buscar critérios:', error);
      throw new Error('Erro ao carregar critérios');
    }
  }

  // Buscar todos os públicos com paginação
  async getPublicos(params: {
    page?: number;
    limit?: number;
  } = {}): Promise<PublicosResponse> {
    try {
      const { page = 1, limit = 30 } = params;
      const queryParams = new URLSearchParams({ 
        page: page.toString(), 
        limit: limit.toString() 
      });
      const response = await apiClient.get<any>(`/api/publicos?${queryParams}`);
      
      // Adaptar resposta para o formato esperado
      const adaptedResponse: PublicosResponse = {
        publicos: response.data.publicos || [],
        total: response.data.total || 0,
        page: response.data.page || page,
        limit: response.data.limit || limit,
        totalPages: response.data.totalPages || Math.ceil((response.data.total || 0) / limit)
      };
      
      return adaptedResponse;
    } catch (error) {
      console.error('Erro ao buscar públicos:', error);
      throw new Error('Erro ao carregar públicos');
    }
  }

  // Criar um novo público
  async createPublico(publico: PublicoAlvo): Promise<CreatePublicoResponse> {
    try {
      const response = await apiClient.post<CreatePublicoResponse>('/api/publicos', publico);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar público:', error);
      throw new Error('Erro ao criar público');
    }
  }

  // Associar critérios ao público
  async associarCriterios(
    idPublico: number, 
    criterios: number[]
  ): Promise<AssociarCriteriosResponse> {
    try {
      const response = await apiClient.post<AssociarCriteriosResponse>(
        `/api/publicos/${idPublico}/criterios`, 
        { criterios }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao associar critérios:', error);
      throw new Error('Erro ao associar critérios');
    }
  }

  // Buscar critérios de um público específico
  async getPublicoCriterios(idPublico: number): Promise<PublicoCriteriosResponse> {
    try {
      console.log('[PublicosService] Buscando critérios do público:', `/api/publicos/${idPublico}/criterios`);
      const response = await apiClient.get<any>(`/api/publicos/${idPublico}/criterios`);
      console.log('[PublicosService] Critérios do público:', response.data);
      
      // Adaptar resposta para o formato esperado
      const criteriosData = response.data.criterios || response.data.data || response.data || [];
      const adaptedResponse: PublicoCriteriosResponse = {
        criterios: criteriosData,
        total: response.data.total || criteriosData.length
      };
      
      return adaptedResponse;
    } catch (error) {
      console.error(`Erro ao buscar critérios do público ${idPublico}:`, error);
      throw new Error('Erro ao carregar critérios do público');
    }
  }

  // Adicionar clientes ao público baseado nos critérios
  async adicionarClientesAoPublico(idPublico: number): Promise<{
    clientes_adicionados: number;
    clientes_ja_existiam: number;
    clientes_encontrados: Array<{
      id: number;
      tipo_cliente: string;
      sexo: string;
    }>;
    total: number;
  }> {
    try {
      console.log('[PublicosService] Adicionando clientes ao público:', idPublico);

      const response = await apiClient.post<{
        clientes_adicionados: number;
        clientes_ja_existiam: number;
        clientes_encontrados: Array<{
          id: number;
          tipo_cliente: string;
          sexo: string;
        }>;
        total: number;
      }>(`/api/clientes/adicionar-ao-publico/${idPublico}`);

      console.log('[PublicosService] Clientes adicionados ao público:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao adicionar clientes ao público ${idPublico}:`, error);
      throw new Error('Erro ao adicionar clientes ao público');
    }
  }

  // Buscar clientes de um público específico
  async getClientesDoPublico(idPublico: number, params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    clientes: Array<{
      id: number;
      tipo_cliente: string;
      nome_cliente: string;
      numero_celular: string;
      sexo: string;
      email: string;
      data_nascimento: string;
      data_cadastro: string;
      data_adicao: string;
    }>;
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    id_publico: number;
  }> {
    try {
      console.log('[PublicosService] Buscando clientes do público:', idPublico);

      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const url = queryParams.toString() 
        ? `/api/publicos/${idPublico}/clientes?${queryParams.toString()}`
        : `/api/publicos/${idPublico}/clientes`;

      const response = await apiClient.get<{
        clientes: Array<{
          id: number;
          tipo_cliente: string;
          nome_cliente: string;
          numero_celular: string;
          sexo: string;
          email: string;
          data_nascimento: string;
          data_cadastro: string;
          data_adicao: string;
        }>;
        total: number;
        page: number;
        limit: number;
        total_pages: number;
        id_publico: number;
      }>(url);

      console.log('[PublicosService] Clientes do público encontrados:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar clientes do público ${idPublico}:`, error);
      return {
        clientes: [],
        total: 0,
        page: params?.page || 1,
        limit: params?.limit || 30,
        total_pages: 0,
        id_publico: idPublico
      };
    }
  }
}

export const publicosService = new PublicosService();