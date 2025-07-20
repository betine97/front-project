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
}