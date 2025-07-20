'use client';

import { Eye, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Produto } from '@/types/entities';
import { formatCurrency } from '@/lib/utils';
import styles from '@/app/produtos/produtos.module.css';

interface ProdutoTableProps {
  produtos: Produto[];
  onView: (produto: Produto) => void;
  onEdit: (produto: Produto) => void;
  onDelete: (id: string) => void;
}

export function ProdutoTable({ produtos, onView, onEdit, onDelete }: ProdutoTableProps) {
  const getStatusColor = (ativo: boolean, estoque: number) => {
    if (estoque === 0) return 'bg-red-100 text-red-800';
    if (!ativo) return 'bg-gray-100 text-gray-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (ativo: boolean, estoque: number) => {
    if (estoque === 0) return 'Sem Estoque';
    if (!ativo) return 'Inativo';
    return 'Ativo';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            <th className="text-left py-3 px-4 font-medium text-neutral-700">Produto</th>
            <th className="text-left py-3 px-4 font-medium text-neutral-700">Categoria</th>
            <th className="text-left py-3 px-4 font-medium text-neutral-700">Marca</th>
            <th className="text-left py-3 px-4 font-medium text-neutral-700">Preço</th>
            <th className="text-left py-3 px-4 font-medium text-neutral-700">Estoque</th>
            <th className="text-left py-3 px-4 font-medium text-neutral-700">Status</th>
            <th className="text-left py-3 px-4 font-medium text-neutral-700">Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map(produto => {
            const isLowStock = produto.estoque <= produto.estoqueMinimo;
            
            return (
              <tr key={produto.id} className={styles.tableRow}>
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-neutral-900">{produto.nome}</p>
                    <p className="text-sm text-neutral-500">ID: {produto.id}</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-neutral-600">{produto.categoria}</td>
                <td className="py-3 px-4 text-neutral-600">{produto.marca}</td>
                <td className="py-3 px-4 font-semibold text-primary">
                  {formatCurrency(produto.preco_venda)}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium ${
                      isLowStock ? 'text-red-600' : 'text-neutral-900'
                    }`}>
                      {produto.estoque}
                    </span>
                    {isLowStock && (
                      <AlertTriangle className={`w-4 h-4 text-red-500 ${styles.lowStockIndicator}`} />
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    getStatusColor(produto.ativo, produto.estoque)
                  }`}>
                    {getStatusText(produto.ativo, produto.estoque)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onView(produto)}
                      className={`${styles.actionButton} ${styles.actionButtonView}`}
                      title="Ver detalhes"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(produto)}
                      className={`${styles.actionButton} ${styles.actionButtonEdit}`}
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(produto.id)}
                      className={`${styles.actionButton} ${styles.actionButtonDelete}`}
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}