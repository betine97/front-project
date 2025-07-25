// Constantes da aplicação

export const APP_CONFIG = {
  name: 'Sistema de Gestão',
  version: '1.0.0',
  description: 'Sistema completo de gestão empresarial',
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  LIMITS: [10, 25, 50, 100],
} as const;

export const STATUS = {
  ATIVO: 'ativo',
  INATIVO: 'inativo',
} as const;



export const ROUTES = {
  HOME: '/',
  PRODUTOS: '/produtos',
  CLIENTES: '/clientes',
  ESTOQUE: '/estoque',
  VENDAS: '/vendas',
  FINANCEIRO: '/financeiro',
  FORNECEDORES: '/fornecedores',
  FUNCIONARIOS: '/funcionarios',
  MARKETING: '/marketing',
  AGENDA: '/agenda',
  WHATSAPP: '/whatsapp',
  CONFIGURACOES: '/configuracoes',
  MINHA_EMPRESA: '/minha-empresa',
  AGENTES_IA: '/agentes-ia',
} as const;

export const MESSAGES = {
  SUCCESS: {
    CREATED: 'Item criado com sucesso!',
    UPDATED: 'Item atualizado com sucesso!',
    DELETED: 'Item excluído com sucesso!',
  },
  ERROR: {
    GENERIC: 'Ocorreu um erro inesperado',
    NETWORK: 'Erro de conexão',
    NOT_FOUND: 'Item não encontrado',
    VALIDATION: 'Dados inválidos',
  },
  CONFIRM: {
    DELETE: 'Tem certeza que deseja excluir este item?',
    CANCEL: 'Tem certeza que deseja cancelar?',
  },
} as const;