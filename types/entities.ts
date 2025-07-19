// Entidades principais do negócio

export interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  categoria: string;
  subcategoria?: string;
  marca: string;
  estoque: number;
  estoqueMinimo: number;
  ativo: boolean;
  dataCadastro: Date;
}