import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

interface Produto {
  id_produto: number;
  codigo_barra: string;
  nome_produto: string;
  sku: string;
  categoria: string;
  destinado_para: string;
  variacao: string;
  marca: string;
  descricao: string;
  status: string;
  preco_venda: number;
  id_fornecedor: number;
}

interface Fornecedor {
  id_fornecedor: number;
  nome: string;
  telefone: string;
  email: string;
  cidade: string;
  estado: string;
  status: string;
  data_cadastro: string;
}

interface ProdutosResponse {
  products: Produto[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

interface FornecedoresResponse {
  fornecedores: Fornecedor[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export function useProdutosFornecedores() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loadingProdutos, setLoadingProdutos] = useState(false);
  const [loadingFornecedores, setLoadingFornecedores] = useState(false);
  const [errorProdutos, setErrorProdutos] = useState<string | null>(null);
  const [errorFornecedores, setErrorFornecedores] = useState<string | null>(null);

  const fetchProdutos = async () => {
    try {
      setLoadingProdutos(true);
      setErrorProdutos(null);

      console.log('[useProdutosFornecedores] Buscando produtos...');
      
      const response = await apiClient.get<ProdutosResponse>('/api/produtos');
      
      console.log('[useProdutosFornecedores] Produtos recebidos:', response.data);
      
      setProdutos(response.data.products || []);
    } catch (err) {
      console.error('[useProdutosFornecedores] Erro ao buscar produtos:', err);
      setErrorProdutos(err instanceof Error ? err.message : 'Erro ao carregar produtos');
      setProdutos([]);
    } finally {
      setLoadingProdutos(false);
    }
  };

  const fetchFornecedores = async () => {
    try {
      setLoadingFornecedores(true);
      setErrorFornecedores(null);

      console.log('[useProdutosFornecedores] Buscando fornecedores...');
      
      const response = await apiClient.get<FornecedoresResponse>('/api/fornecedores');
      
      console.log('[useProdutosFornecedores] Fornecedores recebidos:', response.data);
      
      setFornecedores(response.data.fornecedores || []);
    } catch (err) {
      console.error('[useProdutosFornecedores] Erro ao buscar fornecedores:', err);
      setErrorFornecedores(err instanceof Error ? err.message : 'Erro ao carregar fornecedores');
      setFornecedores([]);
    } finally {
      setLoadingFornecedores(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
    fetchFornecedores();
  }, []);

  return {
    produtos,
    fornecedores,
    loadingProdutos,
    loadingFornecedores,
    errorProdutos,
    errorFornecedores,
    refetchProdutos: fetchProdutos,
    refetchFornecedores: fetchFornecedores
  };
}