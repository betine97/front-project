'use client';

import React, { useState } from 'react';
import { Package, Plus, ShoppingCart, PieChart, BarChart3 } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
// Componentes antigos temporariamente removidos
// import { ProductModal } from '../../components/produtos/ProductModal';
// import { NewOrderModal } from '../../components/produtos/NewOrderModal';
import { TreeViewSubcategorias } from '../../components/produtos/TreeViewSubcategorias';
import { DistribuicaoMarcasProdutos } from '../../components/produtos/DistribuicaoMarcasProdutos';
// Componentes temporariamente comentados até serem criados
// import { ProdutoCard } from '../../components/produtos/ProdutoCard';
// import { ProdutoTable } from '../../components/produtos/ProdutoTable';
// import { ProdutoStats } from '../../components/produtos/ProdutoStats';
// import { ProdutoFilters } from '../../components/produtos/ProdutoFilters';
// import { ProdutoDetailModal } from '../../components/produtos/ProdutoDetailModal';
import { useProdutos } from '../../hooks/useProdutos';
import { Produto } from '../../types/entities';
import { debounce } from '../../lib/utils/index';
import { MESSAGES } from '../../constants/index';
import { formatCurrency } from '../../lib/utils';

export default function ProdutosPage() {
  // Estados locais para UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMarca, setSelectedMarca] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDestinadoPara, setSelectedDestinadoPara] = useState('');
  const [selectedVariacao, setSelectedVariacao] = useState('');
  const [codigoBarras, setCodigoBarras] = useState('');
  const [sortBy, setSortBy] = useState('nome');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showModal, setShowModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Produto | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);

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
  } = useProdutos({});

  // Função para filtrar produtos apenas para a listagem (não afeta gráficos)
  const filteredProdutos = allProdutos.filter(produto => {
    // Filtro de busca por nome, SKU ou descrição
    const matchesSearch = !searchTerm || 
      produto.nome_produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.descricao.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro por categoria
    const matchesCategory = !selectedCategory || produto.categoria === selectedCategory;

    // Filtro por marca
    const matchesMarca = !selectedMarca || produto.marca === selectedMarca;

    // Filtro por status
    const matchesStatus = !selectedStatus || produto.status === selectedStatus;

    // Filtros avançados
    const matchesDestinadoPara = !selectedDestinadoPara || produto.destinado_para === selectedDestinadoPara;
    const matchesVariacao = !selectedVariacao || produto.variacao === selectedVariacao;
    const matchesCodigoBarras = !codigoBarras || produto.codigo_barra.toLowerCase().includes(codigoBarras.toLowerCase());

    return matchesSearch && matchesCategory && matchesMarca && matchesStatus && 
           matchesDestinadoPara && matchesVariacao && matchesCodigoBarras;
  });

  // Aplicar ordenação aos produtos filtrados
  const sortedProdutos = [...filteredProdutos].sort((a, b) => {
    switch (sortBy) {
      case 'nome':
        return a.nome_produto.localeCompare(b.nome_produto);
      case 'nome_desc':
        return b.nome_produto.localeCompare(a.nome_produto);
      case 'categoria':
        return a.categoria.localeCompare(b.categoria);
      case 'marca':
        return a.marca.localeCompare(b.marca);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  // Produtos para listagem (afetados pelos filtros)
  const produtos = sortedProdutos;

  // Produtos para gráficos e estatísticas (sempre todos os produtos, não afetados pela busca)
  const produtosParaGraficos = allProdutos;

  // Busca em tempo real sem debounce
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Categorias e marcas únicas dos produtos (baseado em todos os produtos)
  const categories = Array.from(new Set(allProdutos.map(p => p.categoria))).filter(Boolean);
  const marcas = Array.from(new Set(allProdutos.map(p => p.marca))).filter(Boolean);

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
      <div className="space-y-4" style={{ padding: '4rem' }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Produtos</h1>
              <p className="text-sm text-gray-600">Gerencie seu catálogo de produtos</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowOrderModal(true)}
              className="bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-medium px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md text-sm"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Novo Pedido</span>
            </button>
            <button
              onClick={handleCreateProduct}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl text-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Produto</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-xs text-green-600 font-medium">+12.5%</div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Total de Produtos</p>
              <p className="text-xl font-bold text-gray-900">{produtosParaGraficos.length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-xs text-green-600 font-medium">+8.7%</div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Produtos Ativos</p>
              <p className="text-xl font-bold text-gray-900">{produtosParaGraficos.filter(p => p.status === 'ativo').length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-xs text-red-600 font-medium">-3.2%</div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Categorias</p>
              <p className="text-xl font-bold text-gray-900">
                {Array.from(new Set(produtosParaGraficos.map(p => p.categoria))).length}
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="text-xs text-green-600 font-medium">+5.1%</div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Marcas</p>
              <p className="text-xl font-bold text-gray-900">
                {Array.from(new Set(produtosParaGraficos.map(p => p.marca))).length}
              </p>
            </div>
          </div>
        </div>



        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                  <PieChart className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Performance por Canal</h3>
                  <p className="text-xs text-gray-500">Impressões e conversões</p>
                </div>
              </div>
            </div>
            <TreeViewSubcategorias products={produtosParaGraficos} formatCurrency={formatCurrency} />
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Tipos de Campanha</h3>
                  <p className="text-xs text-gray-500">Distribuição por categoria</p>
                </div>
              </div>
            </div>
            <DistribuicaoMarcasProdutos products={produtosParaGraficos} />
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Search Bar - Menor */}
            <div className="w-80 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 bg-gray-50 focus:bg-white text-sm"
                onChange={(e) => handleSearchChange(e.target.value)}
                value={searchTerm}
              />
            </div>

            {/* Basic Filters */}
            <select
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors duration-200 text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Todas as categorias</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors duration-200 text-sm"
              value={selectedMarca}
              onChange={(e) => setSelectedMarca(e.target.value)}
            >
              <option value="">Todas as marcas</option>
              {marcas.map(marca => (
                <option key={marca} value={marca}>{marca}</option>
              ))}
            </select>

            <select
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors duration-200 text-sm"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Todos os status</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>

            {/* Advanced Filters Button */}
            <button 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-3 py-2 border border-gray-200 rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                showAdvancedFilters 
                  ? 'bg-orange-50 border-orange-200 text-orange-700' 
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
              <span className="font-medium text-sm">Filtros</span>
              <svg className={`w-3 h-3 transition-transform duration-200 ${showAdvancedFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-900">Filtros Avançados</h4>
                <button 
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedMarca('');
                    setSelectedStatus('');
                    setSelectedDestinadoPara('');
                    setSelectedVariacao('');
                    setCodigoBarras('');
                    setSortBy('nome');
                    setSearchTerm('');
                  }}
                  className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                >
                  Limpar todos
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Destinado Para</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm"
                    value={selectedDestinadoPara}
                    onChange={(e) => setSelectedDestinadoPara(e.target.value)}
                  >
                    <option value="">Todos</option>
                    {Array.from(new Set(allProdutos.map(p => p.destinado_para))).map(dest => (
                      <option key={dest} value={dest}>{dest}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Variação</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm"
                    value={selectedVariacao}
                    onChange={(e) => setSelectedVariacao(e.target.value)}
                  >
                    <option value="">Todas</option>
                    {Array.from(new Set(allProdutos.map(p => p.variacao))).map(variacao => (
                      <option key={variacao} value={variacao}>{variacao}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Código de Barras</label>
                  <input
                    type="text"
                    placeholder="Digite o código..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm"
                    value={codigoBarras}
                    onChange={(e) => setCodigoBarras(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Ordenar por</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="nome">Nome A-Z</option>
                    <option value="nome_desc">Nome Z-A</option>
                    <option value="categoria">Categoria</option>
                    <option value="marca">Marca</option>
                    <option value="status">Status</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  {produtos.length} produtos encontrados
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setShowAdvancedFilters(false)}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Fechar
                  </button>
                  <button className="px-3 py-1.5 text-xs font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors duration-200">
                    Aplicar Filtros
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">Catálogo de Produtos</h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-gray-50 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                  {produtos.length} produtos
                </span>
              </div>
            </div>

            {produtos.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-10 h-10 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h4>
                <p className="text-gray-500 mb-6">Tente ajustar os filtros ou adicione novos produtos</p>
                <button
                  onClick={handleCreateProduct}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  <span>Adicionar Produto</span>
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {produtos.map(produto => (
                  <div key={produto.id} className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer">
                    {/* Status Badge */}
                    <div className="flex justify-between items-start mb-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        produto.status === 'ativo' 
                          ? 'bg-green-50 text-green-600 border border-green-200' 
                          : 'bg-red-50 text-red-600 border border-red-200'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          produto.status === 'ativo' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        {produto.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>

                    {/* Product Title */}
                    <div className="mb-3">
                      <h4 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">
                        {produto.nome_produto}
                      </h4>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Marca:</span>
                        <span className="text-gray-900 font-medium">{produto.marca}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Para:</span>
                        <span className="text-orange-600 font-medium">{produto.destinado_para}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Tipo:</span>
                        <span className="text-gray-700">{produto.variacao}</span>
                      </div>
                    </div>

                    {/* Category & SKU */}
                    <div className="mb-4 pb-3 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs font-medium border border-orange-200">
                          {produto.categoria}
                        </span>
                        <span className="text-gray-400 font-mono text-xs">
                          {produto.sku}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewProduct(produto)}
                        className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium px-3 py-2 rounded-md text-xs transition-colors duration-150 flex items-center justify-center space-x-1"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>Ver</span>
                      </button>
                      
                      <button
                        onClick={() => handleEditProduct(produto)}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium px-3 py-2 rounded-md text-xs transition-colors duration-150 flex items-center justify-center space-x-1"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Editar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Table View */
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Produto</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">SKU</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Categoria</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Marca</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Destinado Para</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Variação</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {produtos.map(produto => (
                      <tr key={produto.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                              <Package className="w-4 h-4 text-orange-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 text-sm">{produto.nome_produto}</div>
                              <div className="text-xs text-gray-500 mt-1">{produto.descricao}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-mono text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {produto.sku}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="bg-gray-50 text-gray-700 px-2 py-1 rounded-md text-sm font-medium">
                            {produto.categoria}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm font-medium text-gray-900">{produto.marca}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm font-medium text-orange-600">{produto.destinado_para}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-700">{produto.variacao}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            produto.status === 'ativo' 
                              ? 'bg-green-50 text-green-700 border border-green-200' 
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              produto.status === 'ativo' ? 'bg-green-400' : 'bg-red-400'
                            }`} />
                            {produto.status === 'ativo' ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleViewProduct(produto)}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                              title="Ver detalhes"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleEditProduct(produto)}
                              className="p-2 text-orange-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-150"
                              title="Editar produto"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(produto.id)}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                              title="Excluir produto"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showModal && (
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
      )}

      {showOrderModal && (
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
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
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
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        selectedProduct.status === 'ativo' 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          selectedProduct.status === 'ativo' ? 'bg-green-400' : 'bg-red-400'
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
      )}
    </DashboardLayout>
  )
}