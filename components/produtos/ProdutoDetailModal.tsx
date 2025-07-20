'use client';

import { X } from 'lucide-react';
import { Produto } from '@/types/entities';
import { formatCurrency, formatDate } from '@/lib/utils';
import styles from '@/app/produtos/produtos.module.css';

interface ProdutoDetailModalProps {
  produto: Produto;
  onClose: () => void;
}

export function ProdutoDetailModal({ produto, onClose }: ProdutoDetailModalProps) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <h2 className="text-xl font-semibold text-neutral-900">Detalhes do Produto</h2>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-neutral-900 mb-4">{produto.nome}</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-neutral-700">Categoria</p>
                  <p className="text-neutral-600">{produto.categoria}</p>
                </div>
                {produto.subcategoria && (
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Subcategoria</p>
                    <p className="text-neutral-600">{produto.subcategoria}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-neutral-700">Marca</p>
                  <p className="text-neutral-600">{produto.marca}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-700">ID</p>
                  <p className="text-neutral-600">{produto.id}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-neutral-700">Preço de Venda</p>
                <p className="text-xl font-bold text-primary">{formatCurrency(produto.preco_venda)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Data de Cadastro</p>
                <p className="text-lg font-semibold text-neutral-900">
                  {formatDate(produto.dataCadastro)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Status</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  produto.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {produto.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-neutral-700 mb-1">Estoque Atual</p>
              <p className={`text-2xl font-bold ${
                produto.estoque <= produto.estoqueMinimo ? 'text-red-600' : 'text-neutral-900'
              }`}>
                {produto.estoque}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-700 mb-1">Estoque Mínimo</p>
              <p className="text-2xl font-bold text-neutral-900">{produto.estoqueMinimo}</p>
            </div>
          </div>

          {produto.descricao && (
            <div>
              <p className="text-sm font-medium text-neutral-700 mb-2">Descrição</p>
              <p className="text-neutral-600">{produto.descricao}</p>
            </div>
          )}

          {produto.estoque <= produto.estoqueMinimo && (
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
  );
}