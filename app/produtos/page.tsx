'use client';

import React, { useState, useEffect } from 'react';
import { Package, Plus, ShoppingCart } from 'lucide-react';
import { useAuthCheck } from '../../hooks/useAuthCheck';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ProdutoCard } from '../../components/produtos/ProdutoCard';
import { ProdutoTable } from '../../components/produtos/ProdutoTable';
import { ProdutoFilters } from '../../components/produtos/ProdutoFilters';
import { Pagination } from '../../components/produtos/Pagination';
// Imports temporariamente comentados para debug
// import { CardOne } from '../../components/produtos/CardOne';
// import { CardTwo } from '../../components/produtos/CardTwo';
// import { CardThree } from '../../components/produtos/CardThree';
// import { CardFour } from '../../components/produtos/CardFour';
import { NovoProdutoModal } from '../../components/produtos/NovoProdutoModal';
import { useProdutos } from '../../hooks/useProdutos';
import { Produto } from '../../types/entities';
import { LoadingState } from '../../types/common';
// import { HistoricoPrecosModal } from '@/components/produtos/HistoricoPrecosModal';
import { MESSAGES } from '@/constants/index';
import { ProdutosDebug } from '@/components/debug/ProdutosDebug';

// Imports mantidos para funcionalidades futuras (não utilizados atualmente mas preservados)
// import { ProductModal } from '../../components/produtos/ProductModal';
// import { NewOrderModal } from '../../components/produtos/NewOrderModal';
// import { TreeViewSubcategorias } from '../../components/produtos/TreeViewSubcategorias';
// import { DistribuicaoMarcasProdutos } from '../../components/produtos/DistribuicaoMarcasProdutos';
// import { DistribuicaoCategoriasProdutos } from '../../components/produtos/DistribuicaoCategoriasProdutos';
// import { MarcasPorCategoria } from '../../components/produtos/MarcasPorCategoria';
// import { ProdutoStats } from '../../components/produtos/ProdutoStats';
// import { ProdutoDetailModal } from '../../components/produtos/ProdutoDetailModal';
// import { useHistoricoPrecos } from '../../hooks/useHistoricoPrecos';
// import { debounce } from '../../lib/utils/index';
// import { MESSAGES } from '../../constants/index';


export default function ProdutosPage() {
  // Verificação de autenticação
  const { isAuthenticated, requireAuth } = useAuthCheck();

  // Estados locais para UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMarca, setSelectedMarca] = useState('');
  const [selectedPublicoAlvo, setSelectedPublicoAlvo] = useState('');
  // Estados para filtros avançados (preservados para funcionalidades futuras)
  const [selectedVariacao, setSelectedVariacao] = useState('');
  const [selectedValorTipo, setSelectedValorTipo] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(''); // Para filtro por status
  const [selectedDestinadoPara, setSelectedDestinadoPara] = useState(''); // Para filtro por público-alvo
  const [codigoBarras, setCodigoBarras] = useState(''); // Para busca por código de barras
  const [sortBy, setSortBy] = useState('nome'); // Para ordenação

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showModal, setShowModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Produto | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const [showHistoricoModal, setShowHistoricoModal] = useState(false);
  const [produtoHistorico, setProdutoHistorico] = useState<Produto | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // 8 produtos por página como na imagem

  // Hook para gerenciar produtos (conecta com API)
  const {
    produtos: allProdutos,
    loading,
    error,
    total,
    totalPages,
    createProduto,
    updateProduto,
    deleteProduto,
    refetch
  } = useProdutos({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    categoria: selectedCategory,
    marca: selectedMarca
  });

  // Prevenir warnings do TypeScript sobre variáveis não utilizadas
  void selectedStatus;
  void setSelectedStatus;
  void selectedDestinadoPara;
  void setSelectedDestinadoPara;
  void codigoBarras;
  void setCodigoBarras;
  void sortBy;
  void setSortBy;
  void editingProduct;
  void updateProduto;

  // Produtos para listagem (vem paginado do backend)
  const produtos = allProdutos || [];

  // Usar apenas dados reais da API
  const produtosParaExibir = produtos;

  // Verificar autenticação
  useEffect(() => {
    if (isAuthenticated === false) {
      requireAuth();
    }
  }, [isAuthenticated, requireAuth]);

  // Debug temporário
  console.log('Debug - Loading:', loading);
  console.log('Debug - Error:', error);
  console.log('Debug - Produtos:', produtos);
  console.log('Debug - Total:', total);
  console.log('Debug - Authenticated:', isAuthenticated);

  // Para gráficos, vamos usar os mesmos produtos por enquanto
  // TODO: Implementar hook separado para gráficos sem paginação
  const produtosParaGraficos = produtosParaExibir;

  // Busca em tempo real sem debounce
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset para primeira página ao buscar
  };

  // Handler para mudança de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Categorias, marcas, públicos-alvo e variações únicas dos produtos
  const categories = Array.from(new Set(produtosParaExibir.map(p => p.categoria))).filter(Boolean);
  const marcas = Array.from(new Set(produtosParaExibir.map(p => p.marca))).filter(Boolean);
  const publicosAlvo = Array.from(new Set(produtosParaExibir.map(p => p.destinado_para))).filter(Boolean);
  const variacoes = Array.from(new Set(produtosParaExibir.map(p => p.variacao))).filter(Boolean);

  // Handlers
  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (produto: Produto) => {
    setEditingProduct(produto);
    setShowModal(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm(MESSAGES.CONFIRM.DELETE)) {
      try {
        const result = await deleteProduto(id);
        console.log('Produto excluído:', result.message);
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
      }
    }
  };

  // Handler para salvar produto
  const handleSaveProduct = async (produtoData: {
    data_cadastro: string;
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
  }) => {
    try {
      if (editingProduct) {
        // Editar produto existente - converter dados para o tipo correto
        const produtoParaEdicao = {
          ...produtoData,
          status: produtoData.status as 'ativo' | 'inativo' // Cast para o tipo correto
        };
        console.log('Editando produto:', editingProduct.id, produtoParaEdicao);
        const result = await updateProduto(editingProduct.id, produtoParaEdicao);
        console.log('Produto atualizado:', result);
      } else {
        // Criar novo produto
        console.log('Criando novo produto:', produtoData);
        const result = await createProduto(produtoData);
        console.log('Produto criado:', result.message);
      }

      // Limpar estado de edição
      setEditingProduct(null);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      throw error;
    }
  };

  const handleViewProduct = (produto: Produto) => {
    setSelectedProduct(produto);
  };

  const handleSaveOrder = (orderData: any) => {
    console.log('Pedido salvo:', orderData);
    // Implementar salvamento do pedido
  };

  const handleViewHistorico = (produto: Produto) => {
    setProdutoHistorico(produto);
    setShowHistoricoModal(true);
  };

  // Prevenir warnings sobre funções não utilizadas
  void handleViewProduct;
  void handleSaveOrder;
  void handleViewHistorico;



  const handleCloseHistorico = () => {
    setShowHistoricoModal(false);
    setProdutoHistorico(null);
  };

  // Loading state (incluindo verificação de autenticação)
  if (isAuthenticated === null || loading === ('loading' as LoadingState)) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Erro ao carregar produtos</h3>
            <p className="text-red-800 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 mr-2"
            >
              Tentar novamente
            </button>
          </div>

          {/* Debug Info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-yellow-800 mb-2">Debug Info:</h4>
              <div className="text-xs text-yellow-700 space-y-1">
                <p>• Endpoint: http://localhost:8080/api/produtos</p>
                <p>• Token presente: {localStorage.getItem('auth_token') ? 'Sim' : 'Não'}</p>
                <p>• Erro: {error}</p>
                <p>• Verifique o console do navegador para mais detalhes</p>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-full overflow-x-hidden flex-1 flex flex-col">
        {/* Stats Cards - Estilo ClickUp/Itaú */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric orange">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{produtosParaGraficos.length} Produtos no Total</p>
              </div>
            </div>
          </div>

          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric gray">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{Array.from(new Set(produtosParaGraficos.map(p => p.marca).filter(Boolean))).length} Marcas no Total</p>
              </div>
            </div>
          </div>

          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric gray">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{Array.from(new Set(produtosParaGraficos.map(p => p.categoria).filter(Boolean))).length} Categorias Atendidas</p>
              </div>
            </div>
          </div>

          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric gray">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{Array.from(new Set(produtosParaGraficos.map(p => p.destinado_para).filter(Boolean))).length} Públicos-Alvos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Título da Análise e Action Buttons */}
        <div className="flex items-start justify-between mb-6 mt-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Análise da Linha de Produtos</h2>
            <p className="text-sm text-gray-500">Insights sobre distribuição, performance e margem dos seus produtos por marca, categoria e público-alvo.</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Botão de debug - apenas em desenvolvimento */}
            {process.env.NODE_ENV === 'development' && (
              <div className="flex items-center space-x-2">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${loading === ('loading' as LoadingState) ? 'bg-blue-100 text-blue-800' :
                  error ? 'bg-red-100 text-red-800' :
                    produtosParaExibir.length > 0 ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                  }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${loading === ('loading' as LoadingState) ? 'bg-blue-400 animate-pulse' :
                    error ? 'bg-red-400' :
                      produtosParaExibir.length > 0 ? 'bg-green-400' :
                        'bg-gray-400'
                    }`} />
                  {loading === ('loading' as LoadingState) ? 'Carregando...' :
                    error ? 'API Error' :
                      produtosParaExibir.length > 0 ? `${produtosParaExibir.length} produtos` :
                        'Sem dados'}
                </div>
                <button
                  onClick={() => {
                    console.log('=== DEBUG PRODUTOS ===');
                    console.log('Loading:', loading);
                    console.log('Error:', error);
                    console.log('AllProdutos:', allProdutos);
                    console.log('Produtos:', produtos);
                    console.log('ProdutosParaExibir:', produtosParaExibir);
                    console.log('Token:', localStorage.getItem('auth_token'));
                    refetch();
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-2 rounded-lg flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Debug API</span>
                </button>
              </div>
            )}
            <button
              onClick={() => setShowOrderModal(true)}
              className="btn-secondary flex items-center space-x-2 text-sm px-4 py-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Novo Pedido</span>
            </button>
            <button
              onClick={handleCreateProduct}
              className="btn-primary flex items-center space-x-2 text-sm px-4 py-2"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Produto</span>
            </button>
          </div>
        </div>












        {/* Seção de Cards Personalizados - Temporariamente desabilitada para debug */}
        <div className="mb-12">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              Cards temporariamente desabilitados para debug.
              Se a página carregar, o problema está nos componentes Card.
            </p>
          </div>
        </div>

        {/* Título da Seção de Produtos */}
        <div className="flex items-start justify-between mb-6 mt-12">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Catálogo de Produtos</h2>
            <p className="text-sm text-gray-500">Gerencie seu inventário, visualize detalhes e acompanhe o desempenho de cada produto do seu catálogo.</p>
          </div>
        </div>

        {/* Products Grid - Estilo Itaú */}
        <div className="card flex-1 flex flex-col">
          {/* Filtros usando o componente ProdutoFilters */}
          <ProdutoFilters
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedMarca={selectedMarca}
            onMarcaChange={setSelectedMarca}
            selectedPublicoAlvo={selectedPublicoAlvo}
            onPublicoAlvoChange={setSelectedPublicoAlvo}
            selectedVariacao={selectedVariacao}
            onVariacaoChange={setSelectedVariacao}
            selectedValorTipo={selectedValorTipo}
            onValorTipoChange={setSelectedValorTipo}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onAdvancedFiltersToggle={() => setShowAdvancedFilters(!showAdvancedFilters)}
            categories={categories}
            marcas={marcas}
            publicosAlvo={publicosAlvo}
            variacoes={variacoes}
            totalProdutos={produtosParaExibir.length}
          />

          {/* Produtos Grid/List */}
          <div className="flex-1 flex flex-col">
            {loading === ('loading' as LoadingState) ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-500">Carregando produtos...</p>
                </div>
              </div>
            ) : produtosParaExibir.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="icon-container orange mx-auto mb-4" style={{ width: '64px', height: '64px' }}>
                    <Package className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Nenhum produto encontrado</h4>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {error ? 'Erro ao carregar produtos da API. Verifique sua conexão.' : 'Tente ajustar os filtros ou adicione novos produtos ao seu catálogo'}
                  </p>
                  <div className="flex gap-3 justify-center">
                    {error && (
                      <button
                        onClick={refetch}
                        className="btn-secondary flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Tentar Novamente</span>
                      </button>
                    )}
                    <button
                      onClick={handleCreateProduct}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adicionar Produto</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="flex-1 flex flex-col">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 content-start">
                  {produtosParaExibir.map(produto => (
                    <ProdutoCard
                      key={produto.id}
                      produto={produto}
                      onEdit={handleEditProduct}
                      onDelete={handleDeleteProduct}
                    />
                  ))}
                </div>

                {/* Paginação */}
                {produtosParaExibir.length > 0 && totalPages > 1 && (
                  <div className="border-t border-gray-200 p-4">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={total}
                      itemsPerPage={itemsPerPage}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-auto">
                  <ProdutoTable
                    produtos={produtosParaExibir}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                  />
                </div>

                {/* Paginação para tabela */}
                {produtosParaExibir.length > 0 && totalPages > 1 && (
                  <div className="border-t border-gray-200 p-4">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={total}
                      itemsPerPage={itemsPerPage}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
            )
            }
          </div>
        </div>

        {/* Modal de Novo Produto */}
        <NovoProdutoModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null); // Limpar produto sendo editado
          }}
          onSave={handleSaveProduct}
          editingProduct={editingProduct}
        />

        {
          showOrderModal && (
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Novo Pedido</h2>
                  </div>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900">Em desenvolvimento</h4>
                        <p className="text-sm text-blue-700">
                          Modal de criação de pedido será implementado em breve.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowOrderModal(false)}
                      className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium px-4 py-3 rounded-xl transition-colors duration-200"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => setShowOrderModal(false)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-4 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Criar Pedido
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        }

        {/* Product Detail Modal */}
        {
          selectedProduct && (
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-100">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Detalhes do Produto</h2>
                      <p className="text-sm text-gray-600">Informações completas do produto</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-xl transition-colors shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]" style={{ backgroundColor: 'white' }}>
                  {/* Product Header */}
                  <div className="mb-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedProduct.nome_produto}</h3>
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${selectedProduct.status === 'ativo'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${selectedProduct.status === 'ativo' ? 'bg-green-400' : 'bg-red-400'
                              }`} />
                            {selectedProduct.status === 'ativo' ? 'Ativo' : 'Inativo'}
                          </span>
                          <span className="text-sm text-gray-500">ID: {selectedProduct.id}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProduct(selectedProduct)}
                          className="bg-orange-50 hover:bg-orange-100 text-orange-700 font-medium px-4 py-2 rounded-xl transition-colors duration-200 flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Editar</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Product Details Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-2xl p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                            <span className="text-sm font-medium text-gray-600">Categoria</span>
                            <span className="text-sm text-gray-900 bg-white px-3 py-1 rounded-lg">{selectedProduct.categoria}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                            <span className="text-sm font-medium text-gray-600">Marca</span>
                            <span className="text-sm text-gray-900 font-medium">{selectedProduct.marca}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                            <span className="text-sm font-medium text-gray-600">SKU</span>
                            <span className="text-sm text-gray-900 font-mono bg-white px-3 py-1 rounded-lg">{selectedProduct.sku}</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm font-medium text-gray-600">Código de Barras</span>
                            <span className="text-sm text-gray-900 font-mono bg-white px-3 py-1 rounded-lg">{selectedProduct.codigo_barra}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Especificações</h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center py-2 border-b border-orange-200 last:border-b-0">
                            <span className="text-sm font-medium text-gray-600">Destinado Para</span>
                            <span className="text-sm text-orange-700 font-semibold bg-white px-3 py-1 rounded-lg">{selectedProduct.destinado_para}</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm font-medium text-gray-600">Variação</span>
                            <span className="text-sm text-gray-900 bg-white px-3 py-1 rounded-lg">{selectedProduct.variacao}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {selectedProduct.descricao && (
                    <div className="mt-8">
                      <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Descrição</h4>
                        <p className="text-gray-700 leading-relaxed">{selectedProduct.descricao}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        }

        {/* Modal de Histórico de Preços */}
        {/* Modal temporariamente desabilitado para debug */}
        {
          produtoHistorico && showHistoricoModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md">
                <h3 className="text-lg font-semibold mb-4">Histórico de Preços</h3>
                <p className="text-gray-600 mb-4">Modal temporariamente simplificado para debug.</p>
                <button
                  onClick={handleCloseHistorico}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Fechar
                </button>
              </div>
            </div>
          )
        }

        {/* Debug Component - apenas em desenvolvimento */}
        {process.env.NODE_ENV === 'development' && <ProdutosDebug />}
      </div>
    </DashboardLayout>
  )
}
