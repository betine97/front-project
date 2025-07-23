'use client';

import React, { useState } from 'react';
import { Package, Plus, ShoppingCart, PieChart, BarChart3, Expand } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ProductModal } from '../../components/produtos/ProductModal';
import { NewOrderModal } from '../../components/produtos/NewOrderModal';
import { TreeViewSubcategorias } from '../../components/produtos/TreeViewSubcategorias';
import { DistribuicaoMarcasProdutos } from '../../components/produtos/DistribuicaoMarcasProdutos';
import { DistribuicaoCategoriasProdutos } from '../../components/produtos/DistribuicaoCategoriasProdutos';
import { MarcasPorCategoria } from '../../components/produtos/MarcasPorCategoria';
import { HistoricoPrecosModal } from '../../components/produtos/HistoricoPrecosModal';
import { ProdutoCard } from '../../components/produtos/ProdutoCard';
import { ProdutoTable } from '../../components/produtos/ProdutoTable';
import { ProdutoStats } from '../../components/produtos/ProdutoStats';
import { ProdutoFilters } from '../../components/produtos/ProdutoFilters';
import { ProdutoDetailModal } from '../../components/produtos/ProdutoDetailModal';
import { Pagination } from '../../components/produtos/Pagination';
import { CardOne } from '../../components/produtos/CardOne';
import { CardTwo } from '../../components/produtos/CardTwo';
import { CardThree } from '../../components/produtos/CardThree';
import { CardFour } from '../../components/produtos/CardFour';
import { useProdutos } from '../../hooks/useProdutos';
import { useHistoricoPrecos } from '../../hooks/useHistoricoPrecos';
import { Produto } from '../../types/entities';
import { debounce } from '../../lib/utils/index';
import { MESSAGES } from '../../constants/index';
import { formatCurrency } from '../../lib/utils';

export default function ProdutosPage() {
  // Estados locais para UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMarca, setSelectedMarca] = useState('');
  const [selectedPublicoAlvo, setSelectedPublicoAlvo] = useState('');
  const [selectedVariacao, setSelectedVariacao] = useState('');
  const [selectedValorTipo, setSelectedValorTipo] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDestinadoPara, setSelectedDestinadoPara] = useState('');
  const [codigoBarras, setCodigoBarras] = useState('');
  const [sortBy, setSortBy] = useState('nome');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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

  // Produtos para listagem (vem paginado do backend)
  const produtos = allProdutos;
  
  // Debug temporário
  console.log('Debug - Loading:', loading);
  console.log('Debug - Error:', error);
  console.log('Debug - Produtos:', produtos);
  console.log('Debug - Total:', total);

  // Para gráficos, vamos usar os mesmos produtos por enquanto
  // TODO: Implementar hook separado para gráficos sem paginação
  const produtosParaGraficos = allProdutos;

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
  const categories = Array.from(new Set(allProdutos.map(p => p.categoria))).filter(Boolean);
  const marcas = Array.from(new Set(allProdutos.map(p => p.marca))).filter(Boolean);
  const publicosAlvo = Array.from(new Set(allProdutos.map(p => p.destinado_para))).filter(Boolean);
  const variacoes = Array.from(new Set(allProdutos.map(p => p.variacao))).filter(Boolean);

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
        await deleteProduto(id);
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
      }
    }
  };

  const handleSaveProduct = async (produtoData: Omit<Produto, 'id'>) => {
    try {
      if (editingProduct) {
        await updateProduto(editingProduct.id, produtoData);
      } else {
        await createProduto(produtoData);
      }
      setShowModal(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
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

  const handleCloseHistorico = () => {
    setShowHistoricoModal(false);
    setProdutoHistorico(null);
  };

  // Loading state
  if (loading === 'loading') {
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <button
              onClick={refetch}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-full overflow-x-hidden">
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
                <p className="text-lg font-bold text-gray-900">{Array.from(new Set(produtosParaGraficos.map(p => p.marca))).length} Marcas no Total</p>
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
                <p className="text-lg font-bold text-gray-900">{Array.from(new Set(produtosParaGraficos.map(p => p.categoria))).length} Categorias Atendidas</p>
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
                <p className="text-lg font-bold text-gray-900">{Array.from(new Set(produtosParaGraficos.map(p => p.destinado_para))).length} Públicos-Alvos</p>
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












        {/* Seção de Cards Personalizados */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna 1 - Card One e Card Four */}
            <div className="lg:col-span-1 space-y-6">
              <CardOne />
              <CardFour />
            </div>
            
            {/* Coluna 2 - Card Two */}
            <div className="lg:col-span-1">
              <CardTwo />
            </div>
            
            {/* Coluna 3 - Card Three */}
            <div className="lg:col-span-1">
              <CardThree />
            </div>
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
        <div className="card">
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
            totalProdutos={produtos.length}
          />

          {/* Produtos Grid/List */}
          {produtos.length === 0 ? (
            <div className="text-center py-12">
              <div className="icon-container orange mx-auto mb-4" style={{ width: '64px', height: '64px' }}>
                <Package className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Nenhum produto encontrado</h4>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">Tente ajustar os filtros ou adicione novos produtos ao seu catálogo</p>
              <button
                onClick={handleCreateProduct}
                className="btn-primary flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Produto</span>
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {produtos.map(produto => (
                  <ProdutoCard
                    key={produto.id}
                    produto={produto}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                  />
                ))}
              </div>

              {/* Paginação */}
              {produtos.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={total}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            <>
              <ProdutoTable
                produtos={produtos}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />

              {/* Paginação para tabela */}
              {produtos.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={total}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>

        {/* Modals */}
        {
          showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                      <Package className="w-4 h-4 text-orange-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-orange-900">Em desenvolvimento</h4>
                        <p className="text-sm text-orange-700">
                          Modal de {editingProduct ? 'edição' : 'criação'} de produto será implementado em breve.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium px-4 py-3 rounded-xl transition-colors duration-200"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium px-4 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        }

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
        {
          produtoHistorico && (
            <HistoricoPrecosModal
              produto={produtoHistorico}
              isOpen={showHistoricoModal}
              onClose={handleCloseHistorico}
            />
          )
        }
      </div>
    </DashboardLayout>
  )
}
