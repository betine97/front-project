'use client';

import React from 'react';
import { Produto } from '@/types/entities';
import { formatCurrency } from '@/lib/utils';
import { Edit, Trash2 } from 'lucide-react';
import styles from '@/app/produtos/produtos.module.css';

interface ProdutoTableProps {
  produtos: Produto[];
  onEdit: (produto: Produto) => void;
  onDelete: (id: number) => void;
}

export function ProdutoTable({ produtos, onEdit, onDelete }: ProdutoTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Produto</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Categoria</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Marca</th>
            <th className="text-right py-3 px-4 font-medium text-gray-600 text-sm">Preço</th>
            <th className="text-center py-3 px-4 font-medium text-gray-600 text-sm">Status</th>
            <th className="text-center py-3 px-4 font-medium text-gray-600 text-sm">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {produtos.map(produto => (
            <tr key={produto.id} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{produto.nome_produto}</p>
                  <p className="text-xs text-gray-500 font-mono">{produto.sku}</p>
                </div>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">{produto.categoria}</td>
              <td className="py-3 px-4 text-sm text-gray-600">{produto.marca}</td>
              <td className="py-3 px-4 text-right">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{formatCurrency(produto.preco_venda)}</p>
                </div>
              </td>
              <td className="py-3 px-4 text-center">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  produto.status === 'ativo'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                    produto.status === 'ativo' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  {produto.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-center space-x-1">
                  <button
                    onClick={() => onEdit(produto)}
                    className="p-2 text-orange-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-150"
                    title="Editar produto"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(produto.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                    title="Excluir produto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}