// Serviço para operações com clientes
import { apiClient } from '../api/client';
import { Cliente } from '../../types/entities';
import { PaginatedResponse } from '../../types/api';

export class ClientesService {
  private endpoint = '/api/clientes';

  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<PaginatedResponse<Cliente>> {
    try {
      console.log('[ClientesService] Fazendo requisição para:', this.endpoint, 'com params:', params);

      // Construir query string para a API
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.status) queryParams.append('status', params.status);

      const url = queryParams.toString() ? `${this.endpoint}?${queryParams.toString()}` : this.endpoint;
      console.log('[ClientesService] URL final:', url);

      // Fazer requisição para a API
      const response = await apiClient.get<{
        clientes: any[];
        total: number;
        page: number;
        limit: number;
        total_pages: number;
      }>(url);

      console.log('[ClientesService] Resposta recebida:', response);

      // Verificar se a resposta tem a estrutura esperada
      if (!response.data.clientes || !Array.isArray(response.data.clientes)) {
        console.error('[ClientesService] Resposta não tem array de clientes:', response.data);
        throw new Error('Estrutura de resposta inválida da API - esperado objeto com array clientes');
      }

      console.log('[ClientesService] Processando', response.data.clientes.length, 'clientes da API');

      let clientes = response.data.clientes.map((cliente: any) => {
        return {
          id: cliente.id,
          nome: cliente.nome_cliente,
          email: cliente.email || '',
          telefone: cliente.numero_celular || '',
          cpf_cnpj: cliente.tipo_cliente || '',
          tipo: cliente.tipo_cliente === 'PF' ? 'pessoa_fisica' as const : 'pessoa_juridica' as const,
          endereco: '',
          cidade: '',
          estado: '',
          cep: '',
          data_cadastro: cliente.data_cadastro,
          data_nascimento: cliente.data_nascimento || undefined,
          status: 'ativo' as const,
          observacoes: ''
        };
      });

      console.log('[ClientesService] Clientes processados:', clientes.length);

      // Aplicar filtros locais se necessário
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        clientes = clientes.filter(c =>
          c.nome.toLowerCase().includes(searchLower) ||
          c.email.toLowerCase().includes(searchLower) ||
          c.cpf_cnpj.toLowerCase().includes(searchLower)
        );
      }

      if (params?.status) {
        clientes = clientes.filter(c => c.status === params.status);
      }

      // Usar dados de paginação da API
      const result = {
        data: clientes,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.total_pages
      };

      console.log('[ClientesService] Resultado final:', {
        dataLength: result.data.length,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      });

      return result;
    } catch (error) {
      console.error('[ClientesService] Erro ao buscar clientes:', error);

      // Retornar estrutura vazia em caso de erro
      return {
        data: [],
        total: 0,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: 0
      };
    }
  }

  async create(cliente: {
    tipo_cliente: string;
    nome_cliente: string;
    numero_celular: string;
    sexo: 'M' | 'F';
    email?: string;
    data_nascimento?: string;
    endereco: {
      cep: string;
      cidade: string;
      estado: string;
      bairro: string;
      logradouro: string;
      numero: string;
      complemento?: string;
      obs?: string;
    };
  }): Promise<{ message: string; id: number }> {
    try {
      console.log('[ClientesService] Criando cliente:', cliente);

      // Função para formatar data no formato dd/mm/yyyy
      const formatarDataCadastro = () => {
        const hoje = new Date();
        const dia = hoje.getDate().toString().padStart(2, '0');
        const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
        const ano = hoje.getFullYear().toString();
        return `${dia}/${mes}/${ano}`;
      };

      // Primeiro, criar o cliente - enviando apenas os campos especificados
      const clienteData: any = {
        tipo_cliente: cliente.tipo_cliente,
        nome_cliente: cliente.nome_cliente,
        numero_celular: cliente.numero_celular.replace(/\D/g, ''), // Apenas números
        sexo: cliente.sexo,
        data_cadastro: formatarDataCadastro()
      };

      // Adicionar campos opcionais apenas se preenchidos
      if (cliente.email && cliente.email.trim()) {
        clienteData.email = cliente.email;
      }

      if (cliente.data_nascimento && cliente.data_nascimento.trim()) {
        clienteData.data_nascimento = cliente.data_nascimento;
      }

      console.log('[ClientesService] Enviando dados do cliente para:', this.endpoint);
      console.log('[ClientesService] Dados do cliente:', JSON.stringify(clienteData, null, 2));
      console.log('[ClientesService] Validação dos dados:');
      console.log('- tipo_cliente:', clienteData.tipo_cliente, '(length:', clienteData.tipo_cliente?.length, ')');
      console.log('- nome_cliente:', clienteData.nome_cliente, '(length:', clienteData.nome_cliente?.length, ')');
      console.log('- numero_celular:', clienteData.numero_celular, '(length:', clienteData.numero_celular?.length, ')');
      console.log('- sexo:', clienteData.sexo);
      console.log('- data_cadastro:', clienteData.data_cadastro, '(length:', clienteData.data_cadastro?.length, ')');
      console.log('- email:', clienteData.email, '(length:', clienteData.email?.length, ')');
      console.log('- data_nascimento:', clienteData.data_nascimento, '(length:', clienteData.data_nascimento?.length, ')');

      const clienteResponse = await apiClient.post<{
        id_cliente: number;
        message: string;
      }>(this.endpoint, clienteData);

      console.log('[ClientesService] Cliente criado com sucesso:', clienteResponse);

      // Capturar o ID do cliente criado
      const clienteId = clienteResponse.data.id_cliente;
      console.log('[ClientesService] ID do cliente capturado:', clienteId);

      if (!clienteId) {
        throw new Error('ID do cliente não foi retornado pela API');
      }

      // Depois, criar o endereço - enviando apenas os campos especificados
      console.log('[ClientesService] Construindo objeto enderecoData...');
      console.log('[ClientesService] clienteId recebido:', clienteId, '(type:', typeof clienteId, ')');

      const enderecoData: any = {
        id_cliente: clienteId,
        cep: cliente.endereco.cep.replace(/\D/g, ''), // Apenas números
        cidade: cliente.endereco.cidade,
        estado: cliente.endereco.estado,
        bairro: cliente.endereco.bairro,
        logradouro: cliente.endereco.logradouro,
        numero: cliente.endereco.numero
      };

      console.log('[ClientesService] enderecoData construído:', enderecoData);

      // Adicionar campos opcionais apenas se preenchidos
      if (cliente.endereco.complemento && cliente.endereco.complemento.trim()) {
        enderecoData.complemento = cliente.endereco.complemento;
      }

      if (cliente.endereco.obs && cliente.endereco.obs.trim()) {
        enderecoData.obs = cliente.endereco.obs;
      }

      console.log('[ClientesService] Enviando dados do endereço para: /api/enderecos');
      console.log('[ClientesService] Dados do endereço:', JSON.stringify(enderecoData, null, 2));
      console.log('[ClientesService] Verificação detalhada:');
      console.log('- id_cliente:', enderecoData.id_cliente, '(type:', typeof enderecoData.id_cliente, ')');
      console.log('- cep:', enderecoData.cep);
      console.log('- cidade:', enderecoData.cidade);
      console.log('- estado:', enderecoData.estado);
      console.log('- bairro:', enderecoData.bairro);
      console.log('- logradouro:', enderecoData.logradouro);
      console.log('- numero:', enderecoData.numero);
      if (enderecoData.complemento) console.log('- complemento:', enderecoData.complemento);
      if (enderecoData.obs) console.log('- obs:', enderecoData.obs);

      const enderecoResponse = await apiClient.post<{
        id_endereco: number;
        id_cliente: number;
        cep: string;
        cidade: string;
        estado: string;
        bairro: string;
        logradouro: string;
        numero: string;
        complemento: string;
        obs: string;
      }>('/api/enderecos', enderecoData);

      console.log('[ClientesService] Endereço criado com sucesso:', enderecoResponse);

      return { message: 'Cliente e endereço criados com sucesso', id: clienteId };
    } catch (error) {
      console.error('[ClientesService] Erro ao criar cliente:', error);

      // Melhorar a mensagem de erro
      if (error instanceof Error) {
        if (error.message.includes('400')) {
          throw new Error('Dados inválidos. Verifique se todos os campos obrigatórios estão preenchidos corretamente.');
        } else if (error.message.includes('500')) {
          throw new Error('Erro interno do servidor. Tente novamente em alguns instantes.');
        } else if (error.message.includes('Network')) {
          throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
        }
      }

      throw error;
    }
  }

  // Buscar cliente por ID
  async getById(id: number): Promise<Cliente | null> {
    try {
      console.log('[ClientesService] Buscando cliente por ID:', id);

      const response = await apiClient.get<any>(`${this.endpoint}/${id}`);

      if (!response.data) {
        return null;
      }

      const cliente = response.data;
      return {
        id: cliente.id,
        nome: cliente.nome_cliente,
        email: cliente.email || '',
        telefone: cliente.numero_celular || '',
        cpf_cnpj: cliente.tipo_cliente || '',
        tipo: cliente.tipo_cliente === 'PF' ? 'pessoa_fisica' as const : 'pessoa_juridica' as const,
        endereco: '',
        cidade: '',
        estado: '',
        cep: '',
        data_cadastro: cliente.data_cadastro,
        data_nascimento: cliente.data_nascimento || undefined,
        status: 'ativo' as const,
        observacoes: ''
      };
    } catch (error) {
      console.error('[ClientesService] Erro ao buscar cliente por ID:', error);
      return null;
    }
  }

  // Atualizar cliente
  async update(id: number, dados: Partial<{
    nome_cliente: string;
    email: string;
    numero_celular: string;
    data_nascimento: string;
    observacoes: string;
  }>): Promise<{ message: string }> {
    try {
      console.log('[ClientesService] Atualizando cliente ID:', id, 'com dados:', dados);

      const response = await apiClient.put<{ message: string }>(`${this.endpoint}/${id}`, dados);

      return response.data;
    } catch (error) {
      console.error('[ClientesService] Erro ao atualizar cliente:', error);
      throw new Error('Erro ao atualizar cliente. Tente novamente.');
    }
  }

  // Excluir cliente (soft delete)
  async delete(id: number): Promise<{ message: string }> {
    try {
      console.log('[ClientesService] Excluindo cliente ID:', id);

      const response = await apiClient.delete<{ message: string }>(`${this.endpoint}/${id}`);

      return response.data;
    } catch (error) {
      console.error('[ClientesService] Erro ao excluir cliente:', error);
      throw new Error('Erro ao excluir cliente. Verifique se não há pedidos vinculados.');
    }
  }

  // Buscar histórico de compras do cliente
  async getHistoricoCompras(clienteId: number, params?: {
    page?: number;
    limit?: number;
    dataInicio?: string;
    dataFim?: string;
  }): Promise<PaginatedResponse<any>> {
    try {
      console.log('[ClientesService] Buscando histórico de compras para cliente:', clienteId);

      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.dataInicio) queryParams.append('data_inicio', params.dataInicio);
      if (params?.dataFim) queryParams.append('data_fim', params.dataFim);

      const url = `${this.endpoint}/${clienteId}/historico-compras${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

      const response = await apiClient.get<{
        pedidos: any[];
        total: number;
        page: number;
        limit: number;
        total_pages: number;
      }>(url);

      return {
        data: response.data.pedidos || [],
        total: response.data.total || 0,
        page: response.data.page || 1,
        limit: response.data.limit || 10,
        totalPages: response.data.total_pages || 0
      };
    } catch (error) {
      console.error('[ClientesService] Erro ao buscar histórico de compras:', error);
      return {
        data: [],
        total: 0,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: 0
      };
    }
  }

  // Obter estatísticas do cliente
  async getEstatisticas(clienteId: number): Promise<{
    totalCompras: number;
    valorTotalGasto: number;
    ticketMedio: number;
    ultimaCompra: string | null;
    produtosFavoritos: Array<{ produto: string; quantidade: number }>;
    frequenciaCompras: 'alta' | 'media' | 'baixa';
  }> {
    try {
      console.log('[ClientesService] Buscando estatísticas para cliente:', clienteId);

      const response = await apiClient.get<any>(`${this.endpoint}/${clienteId}/estatisticas`);

      return {
        totalCompras: response.data.total_compras || 0,
        valorTotalGasto: response.data.valor_total_gasto || 0,
        ticketMedio: response.data.ticket_medio || 0,
        ultimaCompra: response.data.ultima_compra || null,
        produtosFavoritos: response.data.produtos_favoritos || [],
        frequenciaCompras: response.data.frequencia_compras || 'baixa'
      };
    } catch (error) {
      console.error('[ClientesService] Erro ao buscar estatísticas:', error);
      return {
        totalCompras: 0,
        valorTotalGasto: 0,
        ticketMedio: 0,
        ultimaCompra: null,
        produtosFavoritos: [],
        frequenciaCompras: 'baixa'
      };
    }
  }

  // Buscar clientes por aniversário
  async getAniversariantes(mes?: number): Promise<Cliente[]> {
    try {
      const mesAtual = mes || new Date().getMonth() + 1;
      console.log('[ClientesService] Buscando aniversariantes do mês:', mesAtual);

      const response = await apiClient.get<{ clientes: any[] }>(`${this.endpoint}/aniversariantes?mes=${mesAtual}`);

      return response.data.clientes.map((cliente: any) => ({
        id: cliente.id,
        nome: cliente.nome_cliente,
        email: cliente.email || '',
        telefone: cliente.numero_celular || '',
        cpf_cnpj: cliente.tipo_cliente || '',
        tipo: cliente.tipo_cliente === 'PF' ? 'pessoa_fisica' as const : 'pessoa_juridica' as const,
        endereco: '',
        cidade: '',
        estado: '',
        cep: '',
        data_cadastro: cliente.data_cadastro,
        data_nascimento: cliente.data_nascimento || undefined,
        status: 'ativo' as const,
        observacoes: ''
      }));
    } catch (error) {
      console.error('[ClientesService] Erro ao buscar aniversariantes:', error);
      return [];
    }
  }

  // Segmentar clientes por comportamento
  async getSegmentacao(): Promise<{
    vips: Cliente[];
    frequentes: Cliente[];
    inativos: Cliente[];
    novos: Cliente[];
  }> {
    try {
      console.log('[ClientesService] Buscando segmentação de clientes');

      const response = await apiClient.get<{
        vips: any[];
        frequentes: any[];
        inativos: any[];
        novos: any[];
      }>(`${this.endpoint}/segmentacao`);

      const mapearCliente = (cliente: any): Cliente => ({
        id: cliente.id,
        nome: cliente.nome_cliente,
        email: cliente.email || '',
        telefone: cliente.numero_celular || '',
        cpf_cnpj: cliente.tipo_cliente || '',
        tipo: cliente.tipo_cliente === 'PF' ? 'pessoa_fisica' as const : 'pessoa_juridica' as const,
        endereco: '',
        cidade: '',
        estado: '',
        cep: '',
        data_cadastro: cliente.data_cadastro,
        data_nascimento: cliente.data_nascimento || undefined,
        status: 'ativo' as const,
        observacoes: ''
      });

      return {
        vips: response.data.vips.map(mapearCliente),
        frequentes: response.data.frequentes.map(mapearCliente),
        inativos: response.data.inativos.map(mapearCliente),
        novos: response.data.novos.map(mapearCliente)
      };
    } catch (error) {
      console.error('[ClientesService] Erro ao buscar segmentação:', error);
      return {
        vips: [],
        frequentes: [],
        inativos: [],
        novos: []
      };
    }
  }

  // Exportar clientes para CSV
  async exportarCSV(filtros?: {
    status?: string;
    dataInicio?: string;
    dataFim?: string;
    segmento?: string;
  }): Promise<Blob> {
    try {
      console.log('[ClientesService] Exportando clientes para CSV com filtros:', filtros);

      const queryParams = new URLSearchParams();
      if (filtros?.status) queryParams.append('status', filtros.status);
      if (filtros?.dataInicio) queryParams.append('data_inicio', filtros.dataInicio);
      if (filtros?.dataFim) queryParams.append('data_fim', filtros.dataFim);
      if (filtros?.segmento) queryParams.append('segmento', filtros.segmento);

      const url = `${this.endpoint}/exportar/csv${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

      // Para download de blob, fazemos uma requisição fetch direta
      const baseURL = 'http://localhost:8080';
      const fullUrl = `${baseURL}${url}`;
      const token = localStorage.getItem('auth_token');

      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('[ClientesService] Erro ao exportar CSV:', error);
      throw new Error('Erro ao exportar dados. Tente novamente.');
    }
  }

  // Importar clientes de CSV
  async importarCSV(arquivo: File): Promise<{
    sucesso: number;
    erros: number;
    detalhes: string[];
  }> {
    try {
      console.log('[ClientesService] Importando clientes de CSV:', arquivo.name);

      const formData = new FormData();
      formData.append('arquivo', arquivo);

      // Para upload de arquivo, fazemos uma requisição fetch direta
      const baseURL = 'http://localhost:8080';
      const fullUrl = `${baseURL}${this.endpoint}/importar/csv`;
      const token = localStorage.getItem('auth_token');

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
          // Não definir Content-Type para FormData - o browser define automaticamente
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const data = await response.json() as {
        sucesso: number;
        erros: number;
        detalhes: string[];
      };

      return data;
    } catch (error) {
      console.error('[ClientesService] Erro ao importar CSV:', error);
      throw new Error('Erro ao importar arquivo. Verifique o formato e tente novamente.');
    }
  }

  // Buscar clientes próximos (por CEP)
  async getClientesProximos(cep: string, raio: number = 10): Promise<Cliente[]> {
    try {
      console.log('[ClientesService] Buscando clientes próximos ao CEP:', cep, 'raio:', raio);

      const response = await apiClient.get<{ clientes: any[] }>(`${this.endpoint}/proximos?cep=${cep}&raio=${raio}`);

      return response.data.clientes.map((cliente: any) => ({
        id: cliente.id,
        nome: cliente.nome_cliente,
        email: cliente.email || '',
        telefone: cliente.numero_celular || '',
        cpf_cnpj: cliente.tipo_cliente || '',
        tipo: cliente.tipo_cliente === 'PF' ? 'pessoa_fisica' as const : 'pessoa_juridica' as const,
        endereco: cliente.endereco_completo || '',
        cidade: cliente.cidade || '',
        estado: cliente.estado || '',
        cep: cliente.cep || '',
        data_cadastro: cliente.data_cadastro,
        data_nascimento: cliente.data_nascimento || undefined,
        status: 'ativo' as const,
        observacoes: ''
      }));
    } catch (error) {
      console.error('[ClientesService] Erro ao buscar clientes próximos:', error);
      return [];
    }
  }

  // Enviar comunicação em massa
  async enviarComunicacao(dados: {
    clienteIds: number[];
    tipo: 'email' | 'sms' | 'whatsapp';
    assunto?: string;
    mensagem: string;
    agendarPara?: string;
  }): Promise<{
    enviados: number;
    falhas: number;
    detalhes: string[];
  }> {
    try {
      console.log('[ClientesService] Enviando comunicação em massa:', dados);

      const response = await apiClient.post<{
        enviados: number;
        falhas: number;
        detalhes: string[];
      }>(`${this.endpoint}/comunicacao`, dados);

      return response.data;
    } catch (error) {
      console.error('[ClientesService] Erro ao enviar comunicação:', error);
      throw new Error('Erro ao enviar comunicação. Tente novamente.');
    }
  }

  // Atribuir tags a um cliente
  async assignTags(clienteId: number, tagIds: number[]): Promise<{ message: string }> {
    try {
      console.log('[ClientesService] Atribuindo tags ao cliente:', clienteId, 'tags:', tagIds);

      const response = await apiClient.post<{ message: string }>(
        `${this.endpoint}/${clienteId}/tags`,
        { ids_tags: tagIds }
      );

      return response.data;
    } catch (error) {
      console.error('[ClientesService] Erro ao atribuir tags ao cliente:', error);
      throw new Error('Erro ao salvar tags do cliente. Tente novamente.');
    }
  }

  // Buscar tags de um cliente
  async getTags(clienteId: number): Promise<Array<{
    id_tag: number;
    categoria_tag: string;
    nome_tag: string;
  }>> {
    try {
      console.log('[ClientesService] Buscando tags do cliente:', clienteId);

      const response = await apiClient.get<{
        tags: Array<{
          id_tag: number;
          categoria_tag: string;
          nome_tag: string;
        }>
      }>(`${this.endpoint}/${clienteId}/tags`);

      return response.data.tags || [];
    } catch (error) {
      console.error('[ClientesService] Erro ao buscar tags do cliente:', error);
      return [];
    }
  }

  // Remover tag de um cliente
  async removeTag(clienteId: number, tagId: number): Promise<{ message: string }> {
    try {
      console.log('[ClientesService] Removendo tag', tagId, 'do cliente:', clienteId);

      const response = await apiClient.delete<{ message: string }>(
        `${this.endpoint}/${clienteId}/tags/${tagId}`
      );

      return response.data;
    } catch (error) {
      console.error('[ClientesService] Erro ao remover tag do cliente:', error);
      throw new Error('Erro ao remover tag do cliente. Tente novamente.');
    }
  }

  // Criar campanha de marketing
  async criarCampanha(campanha: {
    nome: string;
    descricao: string;
    segmentoAlvo: 'vips' | 'frequentes' | 'inativos' | 'novos' | 'todos';
    tipo: 'promocional' | 'informativa' | 'fidelizacao';
    canal: 'email' | 'sms' | 'whatsapp';
    conteudo: {
      assunto?: string;
      mensagem: string;
      anexos?: string[];
    };
    agendamento?: {
      dataInicio: string;
      dataFim?: string;
      horario?: string;
    };
  }): Promise<{ id: number; message: string }> {
    try {
      console.log('[ClientesService] Criando campanha de marketing:', campanha);

      const response = await apiClient.post<{ id: number; message: string }>(`${this.endpoint}/campanhas`, campanha);

      return response.data;
    } catch (error) {
      console.error('[ClientesService] Erro ao criar campanha:', error);
      throw new Error('Erro ao criar campanha. Verifique os dados e tente novamente.');
    }
  }

  // Obter relatório de satisfação
  async getRelatorioSatisfacao(periodo?: {
    dataInicio: string;
    dataFim: string;
  }): Promise<{
    notaMedia: number;
    totalAvaliacoes: number;
    distribuicao: { nota: number; quantidade: number }[];
    comentarios: Array<{
      cliente: string;
      nota: number;
      comentario: string;
      data: string;
    }>;
  }> {
    try {
      console.log('[ClientesService] Buscando relatório de satisfação:', periodo);

      const queryParams = new URLSearchParams();
      if (periodo?.dataInicio) queryParams.append('data_inicio', periodo.dataInicio);
      if (periodo?.dataFim) queryParams.append('data_fim', periodo.dataFim);

      const url = `${this.endpoint}/satisfacao${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

      const response = await apiClient.get<any>(url);

      return {
        notaMedia: response.data.nota_media || 0,
        totalAvaliacoes: response.data.total_avaliacoes || 0,
        distribuicao: response.data.distribuicao || [],
        comentarios: response.data.comentarios || []
      };
    } catch (error) {
      console.error('[ClientesService] Erro ao buscar relatório de satisfação:', error);
      return {
        notaMedia: 0,
        totalAvaliacoes: 0,
        distribuicao: [],
        comentarios: []
      };
    }
  }
}

export const clientesService = new ClientesService();