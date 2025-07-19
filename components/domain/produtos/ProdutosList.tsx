// Componente de lista de produtos usando a nova arquitetura
'use client';

import { useState } from 'react';
import { useProdutos } from '@/hooks/useProdutos';
import { DataTable } from '@/components/shared/DataTable';
import { Pagination } from '@/components/shared/Pagination';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { TableColumn, SortState } from '@/types/common';
import { Produto } from '@/types/entities';
import { formatCurrency, formatDate, debounce } from '@/lib/utils';
import { PAGINATION, MESSAGES } from '@/constants';
import { Plus, Edit, Trash2, Search, Package } from 'lucide-react';

export function ProdutosList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('');
  const [sortState, setSortState] = useState<SortState>({ field: 'nome', direction: 'asc' });
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { 
    produtos, 
    loading, 
    error, 
    total, 
    totalPages, 
    deleteProduto,
    refetch 
  } = useProdutos({
    page,
    limit: PAGINATION.DEFAULT_LIMIT,
    search: search || undefined,
    categoria: categoria || undefined,
  });

  const debouncedSearch = debounce((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);

  const handleSort = (field: string) => {
    setSortState(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDelete = async () => {
    if (!selectedProduto) return;

    try {
      await deleteProduto(selectedProduto.id);
      setShowDeleteModal(false);
      setSelectedProduto(null);
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
    }
  };

  const columns: TableColumn<Produto>[] = [
    {
      key: 'nome',
      label: 'Produto',
      sortable: true,
      render: (value, produto) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Package size={16} className="text-gray-500" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{produto.categoria}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'marca',
      label: 'Marca',
      sortable: true,
    },
    {
      key: 'preco',
      label: 'Preço',
      sortable: true,
      render: (value) => formatCurrency(value),
    },
    {
      key: 'estoque',
      label: 'Estoque',
      sortable: true,
      render: (value, produto) => (
        <div className="flex items-center space-x-2">
          <span className={`font-medium ${
            value <= produto.estoqueMinimo ? 'text-red-600' : 'text-gray-900'
          }`}>
            {value}
          </span>
          {value <= produto.estoqueMinimo && (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
              Baixo
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'ativo',
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Ativo' : 'Inativo'}
        </span>
      ),
    },
    {
      key: 'id',
      label: 'Ações',
      render: (_, produto) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedProduto(produto);
              setShowModal(true);
            }}
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedProduto(produto);
              setShowDeleteModal(true);
            }}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">{error}</p>
        <Button onClick={refetch} className="mt-2">
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={16} className="mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar produtos..."
            className="pl-10"
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </div>
        <select
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={categoria}
          onChange={(e) => {
            setCategoria(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Todas as categorias</option>
          <option value="racao">Ração</option>
          <option value="brinquedos">Brinquedos</option>
          <option value="higiene">Higiene</option>
          <option value="acessorios">Acessórios</option>
        </select>
      </div>

      {/* Tabela */}
      <DataTable
        data={produtos}
        columns={columns}
        loading={loading}
        sortState={sortState}
        onSort={handleSort}
        emptyMessage="Nenhum produto encontrado"
      />

      {/* Paginação */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          total={total}
          limit={PAGINATION.DEFAULT_LIMIT}
        />
      )}

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar Exclusão"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            {MESSAGES.CONFIRM.DELETE}
          </p>
          <p className="font-medium">
            Produto: {selectedProduto?.nome}
          </p>
          <div className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
            >
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}