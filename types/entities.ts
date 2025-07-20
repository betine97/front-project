// Entidades principais do negócio

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
  id: number;
  id_fornecedor: number;
  data_pedido: string;
  data_entrega: string;
  valor_frete: number;
  custo_pedido: number;
  valor_total: number;
  descricao_pedido: string;
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