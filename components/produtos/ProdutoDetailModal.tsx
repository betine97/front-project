// Componente temporariamente desabilitado - necessita atualização do tipo Produto

/*
'use client';

import { X } from 'lucide-react';
import { Produto } from '@/types/entities';
import { formatCurrency } from '@/lib/utils';
import styles from '@/app/produtos/produtos.module.css';

interface ProdutoDetailModalProps {
  produto: Produto | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProdutoDetailModal({ produto, isOpen, onClose }: ProdutoDetailModalProps) {
  if (!isOpen || !produto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-100 animate-modalSlideIn">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Detalhes do Produto</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <p className="text-gray-900">{produto.nome}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <p className="text-gray-900">{produto.categoria}</p>
              </div>

              {produto.subcategoria && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subcategoria</label>
                  <p className="text-gray-900">{produto.subcategoria}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                <p className="text-gray-900">{produto.marca}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
                <p className="text-lg font-bold text-primary">{formatCurrency(produto.preco_venda)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Cadastro</label>
                <p className="text-gray-900">{formatDate(produto.dataCadastro)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  produto.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {produto.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estoque</label>
                <div className="flex items-center space-x-2">
                  <span className={`font-medium ${
                    produto.estoque <= produto.estoqueMinimo ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {produto.estoque}
                  </span>
                  {produto.estoque <= produto.estoqueMinimo && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      Baixo
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Mínimo</label>
                <p className="text-gray-900">{produto.estoqueMinimo}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                <p className="text-gray-900 font-mono">{produto.id}</p>
              </div>

              {produto.descricao && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <p className="text-gray-900 text-sm">{produto.descricao}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
*/

// Componente temporariamente desabilitado
export function ProdutoDetailModal() {
  return null;
}