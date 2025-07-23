'use client';

import React, { useState, useEffect } from 'react';
import { useProdutos } from '@/hooks/useProdutos';
import { DataTable } from '@/components/shared/DataTable';
import { Pagination } from '@/components/shared/Pagination';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { TableColumn } from '@/types/common';
import { Produto } from '@/types/entities';
import { formatCurrency, debounce } from '@/lib/utils/index';
import { PAGINATION } from '@/constants';

interface ProdutosListProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onEdit?: (produto: Produto) => void;
  onDelete?: (id: number) => void;
}

export function ProdutosList({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  viewMode,
  onViewModeChange,
  onEdit,
  onDelete,
}: ProdutosListProps) {
  const { produtos, loading, error, refetch } = useProdutos();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Função debounced para busca
  const debouncedSearch = React.useMemo(
    () => debounce((value: string) => {
      onSearchChange(value);
      setCurrentPage(1);
    }, 300),
    [onSearchChange]
  );

  // Reset da página quando filtros mudam
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  // Filtrar produtos
  const filteredProdutos = React.useMemo(() => {
    return produtos.filter(produto => {
      const matchesSearch = produto.nome_produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           produto.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || produto.categoria === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [produtos, searchTerm, selectedCategory]);

  // Paginação
  const totalPages = Math.ceil(filteredProdutos.length / PAGINATION.DEFAULT_LIMIT);
  const startIndex = (currentPage - 1) * PAGINATION.DEFAULT_LIMIT;
  const paginatedProdutos = filteredProdutos.slice(startIndex, startIndex + PAGINATION.DEFAULT_LIMIT);

  // Colunas da tabela
  const columns: TableColumn<Produto>[] = [
    {
      key: 'nome_produto',
      label: 'Produto',
      render: (produto) => (
        <div>
          <p className="font-medium text-gray-900">{produto.nome_produto}</p>
          <p className="text-sm text-gray-500">{produto.sku}</p>
        </div>
      ),
    },
    {
      key: 'categoria',
      label: 'Categoria',
    },
    {
      key: 'marca',
      label: 'Marca',
    },
    {
      key: 'preco_venda',
      label: 'Preço',
      render: (produto) => formatCurrency(produto.preco_venda),
    },
    {
      key: 'status',
      label: 'Status',
      render: (produto) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          produto.status === 'ativo'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {produto.status === 'ativo' ? 'Ativo' : 'Inativo'}
        </span>
      ),
    },
    {
      key: 'id',
      label: 'Ações',
      render: (produto) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEdit(produto)}
          >
            Editar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDelete(produto)}
            className="text-red-600 hover:text-red-700"
          >
            Excluir
          </Button>
        </div>
      ),
    },
  ];

  const handleEdit = (produto: Produto) => {
    setSelectedProduto(produto);
    setShowModal(true);
    onEdit?.(produto);
  };

  const handleDelete = (produto: Produto) => {
    if (confirm(`Tem certeza que deseja excluir o produto ${produto.nome_produto}?`)) {
      onDelete?.(produto.id);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading === 'loading') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Erro ao carregar produtos: {error}</p>
        <Button onClick={() => refetch()} className="mt-4">
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedProdutos.map(produto => (
            <div key={produto.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <h3 className="font-medium text-gray-900 mb-2">{produto.nome_produto}</h3>
              <p className="text-sm text-gray-500 mb-2">{produto.sku}</p>
              <p className="text-sm text-gray-600 mb-2">{produto.categoria}</p>
              <p className="font-semibold text-lg mb-2">{formatCurrency(produto.preco_venda)}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(produto)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(produto)}
                  className="text-red-600 hover:text-red-700"
                >
                  Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            showInfo={true}
            total={filteredProdutos.length}
            limit={PAGINATION.DEFAULT_LIMIT}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <DataTable
        data={paginatedProdutos}
        columns={columns}
      />
      
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          showInfo={true}
          total={filteredProdutos.length}
          limit={PAGINATION.DEFAULT_LIMIT}
        />
      )}
    </div>
  );
} 