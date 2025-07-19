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
import { formatCurrency } from '../../lib/utils/index';

export default function ProdutosPage() {
  // Estados locais para UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showModal, setShowModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Produto | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);

  // Hook para gerenciar produtos (conecta com API)
  const {
    produtos,
    loading,
    error,
    total,
    totalPages,
    createProduto,
    updateProduto,
    deleteProduto,
    refetch
  } = useProdutos({
    search: searchTerm || undefined,
    categoria: selectedCategory || undefined,
  });

  // Debounce para busca
  const debouncedSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, 300);

  // Categorias únicas dos produtos
  const categories = Array.from(new Set(produtos.map(p => p.categoria))).filter(Boolean);

  // Handlers
  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (produto: Produto) => {
    setEditingProduct(produto);
    setShowModal(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm(MESSAGES.CONFIRM.DELETE)) {
      try {
        await deleteProduto(id);
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
      }
    }
  };

  const handleSaveProduct = async (produtoData: Omit<Produto, 'id' | 'dataCadastro'>) => {
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
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-neutral-900">Produtos</h1>
              <p className="text-sm text-neutral-500">Gerencie seu catálogo de produtos</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowOrderModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Novo Pedido</span>
            </button>
            <button
              onClick={handleCreateProduct}
              className="bg-primary hover:bg-primary-dark text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Produto</span>
            </button>
          </div>
        </div>

        {/* Stats Cards - Temporário */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Total de Produtos</p>
                <p className="text-2xl font-bold text-neutral-900">{produtos.length}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Produtos Ativos</p>
                <p className="text-2xl font-bold text-green-600">{produtos.filter(p => p.ativo).length}</p>
              </div>
              <Package className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Valor Total</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(produtos.reduce((sum, p) => sum + (p.preco * p.estoque), 0))}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Estoque Baixo</p>
                <p className="text-2xl font-bold text-red-600">
                  {produtos.filter(p => p.estoque <= p.estoqueMinimo).length}
                </p>
              </div>
              <Package className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">Categorias</h3>
              <PieChart className="w-5 h-5 text-neutral-400" />
            </div>
            <TreeViewSubcategorias products={produtos} formatCurrency={formatCurrency} />
          </div>

          <div className="bg-white rounded-xl p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">Marcas</h3>
              <BarChart3 className="w-5 h-5 text-neutral-400" />
            </div>
            <DistribuicaoMarcasProdutos products={produtos} />
          </div>
        </div>

        {/* Filters and Search - Temporário */}
        <div className="bg-white rounded-xl p-4 border border-neutral-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="w-full pl-4 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                onChange={(e) => debouncedSearch(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Todas as categorias</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products List - Temporário */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Lista de Produtos</h3>
            {produtos.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-500">Nenhum produto encontrado</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {produtos.map(produto => (
                  <div key={produto.id} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-neutral-900 text-sm">{produto.nome}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${produto.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {produto.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mb-2">{produto.categoria}</p>
                    <p className="text-xs text-neutral-400 mb-3">Marca: {produto.marca}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-primary">{formatCurrency(produto.preco)}</span>
                      <span className="text-xs text-neutral-500">Estoque: {produto.estoque}</span>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button
                        onClick={() => handleViewProduct(produto)}
                        className="flex-1 bg-blue-50 text-blue-600 px-3 py-1 rounded text-xs hover:bg-blue-100"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => handleEditProduct(produto)}
                        className="flex-1 bg-green-50 text-green-600 px-3 py-1 rounded text-xs hover:bg-green-100"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(produto.id)}
                        className="flex-1 bg-red-50 text-red-600 px-3 py-1 rounded text-xs hover:bg-red-100"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals - Temporariamente desabilitados até ajustar tipos */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <h2 className="text-xl font-semibold text-neutral-900">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <p className="text-neutral-600 mb-4">
                Modal de {editingProduct ? 'edição' : 'criação'} de produto será implementado em breve.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <h2 className="text-xl font-semibold text-neutral-900">Novo Pedido</h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <p className="text-neutral-600 mb-4">
                Modal de criação de pedido será implementado em breve.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
                >
                  Criar Pedido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal - Temporário */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <h2 className="text-xl font-semibold text-neutral-900">Detalhes do Produto</h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-4">{selectedProduct.nome}</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-neutral-700">Categoria</p>
                      <p className="text-neutral-600">{selectedProduct.categoria}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-700">Marca</p>
                      <p className="text-neutral-600">{selectedProduct.marca}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-700">ID</p>
                      <p className="text-neutral-600">{selectedProduct.id}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Preço de Venda</p>
                    <p className="text-xl font-bold text-primary">{formatCurrency(selectedProduct.preco)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Status</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${selectedProduct.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {selectedProduct.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-neutral-700 mb-1">Estoque Atual</p>
                  <p className={`text-2xl font-bold ${selectedProduct.estoque <= selectedProduct.estoqueMinimo ? 'text-red-600' : 'text-neutral-900'
                    }`}>
                    {selectedProduct.estoque}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-700 mb-1">Estoque Mínimo</p>
                  <p className="text-2xl font-bold text-neutral-900">{selectedProduct.estoqueMinimo}</p>
                </div>
              </div>

              {selectedProduct.descricao && (
                <div>
                  <p className="text-sm font-medium text-neutral-700 mb-2">Descrição</p>
                  <p className="text-neutral-600">{selectedProduct.descricao}</p>
                </div>
              )}

              {selectedProduct.estoque <= selectedProduct.estoqueMinimo && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Estoque baixo
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>
                          Este produto está com estoque abaixo do mínimo recomendado.
                          Considere fazer uma nova compra.
                        </p>
                      </div>
                    </div>
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