// Entidades principais do negócio

// Tipo para a API de contas a pagar/receber
export interface ContaPagarReceber {
  id_conta: number;
  data_pagamento: string | null;
  data_vencimento: string;
  desconto: number;
  descricao: string;
  id_cliente_fornecedor: string;
  juros: number;
  parcelamento: number;
  status: string;
  tipo_conta: 'Pagar' | 'Receber';
  valor: number;
}

// Tipo para a API de movimentações
export interface Movimentacao {
  id_movimentacao: number;
  data_movimentacao: string;
  descricao_movimentacao: string;
  id_conta_credito: number;
  id_conta_debito: number;
  status_transacao: string;
  tipo_transacao: string;
  valor: number;
}

export interface Produto {
  id: number;
  codigo_barra: string;
  nome_produto: string;
  sku: string;
  categoria: string;
  destinado_para: string;
  variacao: string;
  marca: string;
  descricao: string;
  status: 'ativo' | 'inativo';
  preco_venda: number;
  id_fornecedor: number;
}

export interface Fornecedor {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  data_cadastro: string;
  status: 'ativo' | 'inativo';
}

export interface PedidoCompra {
  id_pedido: number;
  id_fornecedor: number;
  data_pedido: string;
  data_entrega: string;
  valor_frete: number;
  custo_pedido: number;
  valor_total: number;
  descricao_pedido: string;
  status: string;
  // Campos calculados/relacionados
  fornecedor?: Fornecedor;
  itens?: ItemPedido[];
}

export interface ItemPedido {
  id: number;
  id_pedido: number;
  id_produto: number;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
  // Campos relacionados
  produto?: Produto;
}

export interface Estoque {
  id: number;
  id_produto: number;
  id_lote: string;
  quantidade: number;
  custo_unitario: number;
  data_entrada: string;
  data_saida?: string | null;
  status: 'disponível' | 'reservado' | 'vendido' | 'vencido';
  // Campos relacionados
  produto?: Produto;
}

export interface HistoricoPreco {
  id: number;
  data_registro: string;
  id_produto: number;
  custo_unidade: number;
  valor_venda: number;
  markup: number;
  margem: number;
  // Campos relacionados
  produto?: Produto;
}

export interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf_cnpj: string;
  tipo: 'pessoa_fisica' | 'pessoa_juridica';
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  data_cadastro: string;
  data_nascimento?: string;
  status: 'ativo' | 'inativo';
  observacoes?: string;
}

export interface Campanha {
  id: number;
  nome: string;
  descricao: string;
  tipo: 'email' | 'whatsapp' | 'sms' | 'social_media' | 'google_ads' | 'facebook_ads';
  status: 'rascunho' | 'ativa' | 'pausada' | 'finalizada' | 'cancelada';
  data_inicio: string;
  data_fim?: string;
  orcamento: number;
  gasto_atual: number;
  publico_alvo: string[];
  metricas: {
    impressoes: number;
    cliques: number;
    conversoes: number;
    ctr: number; // Click Through Rate
    cpc: number; // Cost Per Click
    roas: number; // Return on Ad Spend
  };
  created_at: string;
  updated_at: string;
}

export interface Venda {
  id: number;
  numero_pedido: string;
  id_cliente: number;
  data_venda: string;
  valor_total: number;
  valor_desconto: number;
  valor_liquido: number;
  quantidade_itens: number;
  canal_venda: 'loja_fisica' | 'ecommerce' | 'whatsapp' | 'telefone' | 'marketplace';
  status: 'pendente' | 'confirmada' | 'enviada' | 'entregue' | 'cancelada' | 'devolvida';
  tipo_venda: 'normal' | 'upsell' | 'crosssell';
  metodo_pagamento: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'boleto';
  vendedor_id?: number;
  observacoes?: string;
  // Campos relacionados
  cliente?: Cliente;
  itens?: ItemVenda[];
}

export interface ItemVenda {
  id: number;
  id_venda: number;
  id_produto: number;
  quantidade: number;
  preco_unitario: number;
  preco_total: number;
  desconto_aplicado: number;
  tipo_item: 'principal' | 'upsell' | 'crosssell';
  // Campos relacionados
  produto?: Produto;
  venda?: Venda;
}

export interface AnaliseVendas {
  ticket_medio_geral: number;
  quantidade_vendas_total: number;
  quantidade_produtos_vendidos: number;
  vendas_por_categoria: { [categoria: string]: number };
  produtos_por_categoria: { [categoria: string]: number };
  vendas_upsell: number;
  produtos_upsell: number;
  vendas_crosssell: number;
  produtos_crosssell: number;
  vendas_por_genero: {
    masculino: { vendas: number; ticket_medio: number };
    feminino: { vendas: number; ticket_medio: number };
  };
  ticket_medio_por_faixa_idade: {
    '18-25': number;
    '26-35': number;
    '36-45': number;
    '46-55': number;
    '55+': number;
  };
  icp_score: number;
  recorrencia_por_perfil: { [perfil: string]: number };
  vendas_por_canal: { [canal: string]: number };
}

export interface AnaliseFinanceira {
  // Margens
  margem_bruta: number; // %
  margem_operacional_ebitda: number; // %
  margem_liquida: number; // %
  
  // Capital e Fluxo
  capital_de_giro: number; // R$
  fluxo_de_caixa: {
    entrada: number;
    saida: number;
    saldo: number;
  };
  
  // Receitas e Despesas
  receitas: {
    total: number;
    operacionais: number;
    nao_operacionais: number;
    recorrentes: number;
  };
  despesas: {
    total: number;
    operacionais: number;
    administrativas: number;
    vendas: number;
    financeiras: number;
  };
  
  // Custos
  custo_fixo: number;
  custo_variavel: number;
  custo_total: number;
  
  // Indicadores
  break_even: {
    ponto_equilibrio_unidades: number;
    ponto_equilibrio_valor: number;
    margem_contribuicao: number;
  };
  
  liquidez: {
    corrente: number;
    seca: number;
    imediata: number;
  };
  
  // Métricas Adicionais
  roi: number; // Return on Investment
  roa: number; // Return on Assets
  roe: number; // Return on Equity
  endividamento: number; // %
  giro_ativo: number;
  prazo_medio_recebimento: number; // dias
  prazo_medio_pagamento: number; // dias
  ciclo_operacional: number; // dias
  ciclo_financeiro: number; // dias
}

export interface MovimentacaoFinanceira {
  id: number;
  tipo: 'receita' | 'despesa';
  categoria: string;
  subcategoria?: string;
  descricao: string;
  valor: number;
  data_vencimento: string;
  data_pagamento?: string;
  status: 'pendente' | 'pago' | 'vencido' | 'cancelado';
  forma_pagamento?: string;
  centro_custo?: string;
  observacoes?: string;
  recorrente: boolean;
  frequencia_recorrencia?: 'mensal' | 'trimestral' | 'semestral' | 'anual';
  created_at: string;
  updated_at: string;
}