'use client';

import { Eye, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Produto } from '@/types/entities';
import { formatCurrency } from '@/lib/utils';
import styles from '@/app/produtos/produtos.module.css';

interface ProdutoCardProps {
  produto: Produto;
  onView: (produto: Produto) => void;
  onEdit: (produto: Produto) => void;
  onDelete: (id: string) => void;
}

export function ProdutoCard({ produto, onView, onEdit, onDelete }: ProdutoCardProps) {
  const getStatusColor = (ativo: boolean, estoque: number) => {
    if (estoque === 0) return styles.statusOutOfStock;
    if (!ativo) return styles.statusInactive;
    return styles.statusActive;
  };

  const getStatusText = (ativo: boolean, estoque: number) => {
    if (estoque === 0) return 'Sem Estoque';
    if (!ativo) return 'Inativo';
    return 'Ativo';
  };

  const isLowStock = produto.estoque <= produto.estoqueMinimo;

  return (
    <div className={`${styles.productCard} group relative`}>
      <div className={styles.flipCard}>
        <div className={styles.flipCardInner}>
          {/* Front */}
          <div className={styles.flipCardFront}>
            <div className="flex items-start justify-between mb-3">
              <span className={`${styles.statusBadge} ${getStatusColor(produto.ativo, produto.estoque)}`}>
                {getStatusText(produto.ativo, produto.estoque)}
              </span>
              {isLowStock && (
                <AlertTriangle className={`w-4 h-4 text-red-500 ${styles.lowStockIndicator}`} />
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-neutral-900 text-sm mb-1 line-clamp-2">
                {produto.nome}
              </h3>
              <p className="text-xs text-neutral-500 mb-2">{produto.categoria}</p>
              <p className="text-xs text-neutral-400 mb-3">ID: {produto.id}</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(produto.preco)}
                </span>
                <span className="text-xs text-neutral-500">
                  Estoque: {produto.estoque}
                </span>
              </div>
            </div>
          </div>

          {/* Back */}
          <div className={styles.flipCardBack}>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-xs font-medium text-neutral-700 mb-1">Categoria:</p>
                <p className="text-xs text-neutral-600">{produto.categoria}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-neutral-700 mb-1">Marca:</p>
                <p className="text-xs text-neutral-600">{produto.marca}</p>
              </div>

              {produto.subcategoria && (
                <div>
                  <p className="text-xs font-medium text-neutral-700 mb-1">Subcategoria:</p>
                  <p className="text-xs text-neutral-600">{produto.subcategoria}</p>
                </div>
              )}

              {produto.descricao && (
                <div>
                  <p className="text-xs font-medium text-neutral-700 mb-1">Descrição:</p>
                  <p className="text-xs text-neutral-600 line-clamp-3">{produto.descricao}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
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
          </div>
        </div>
      </div>
    </div>
  );
}