'use client';

import React from 'react';
import { Produto } from '@/types/entities';
import { formatCurrency } from '@/lib/utils';
import { Eye, BarChart3, Edit, Package } from 'lucide-react';

interface ProdutoCardProps {
  produto: Produto;
  onEdit: (produto: Produto) => void;
  onDelete: (id: number) => void;
}

export function ProdutoCard({ produto, onEdit, onDelete }: ProdutoCardProps) {
  // CMV e Margem ficam vazios até que tenhamos dados de custo de outro endpoint
  const precoCMV = null; // Será preenchido quando houver endpoint de custo
  const margemPercentual = null; // Será calculado quando houver dados de custo

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow duration-200">
      {/* Header com ícone laranja e nome do produto */}
      <div className="flex items-start gap-2 mb-3">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Package className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
            {produto.nome_produto}
          </h3>
          <p className="text-xs text-gray-400 font-mono uppercase tracking-wider">
            {produto.sku}
          </p>
        </div>
      </div>

      {/* Seção Categoria e Marca - Backgrounds individuais */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-xs text-gray-400 mb-1">Categoria</p>
          <p className="text-sm font-semibold text-gray-900">{produto.categoria}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-xs text-gray-400 mb-1">Marca</p>
          <p className="text-sm font-semibold text-gray-900">{produto.marca}</p>
        </div>
      </div>

      {/* Seção Para e Tipo - Backgrounds individuais */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-xs text-gray-400 mb-1">Para</p>
          <p className="text-sm font-semibold text-gray-900">{produto.destinado_para}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-xs text-gray-400 mb-1">Tipo</p>
          <p className="text-sm font-semibold text-gray-900">{produto.variacao}</p>
        </div>
      </div>

      {/* Seção de Preços - Backgrounds individuais com alinhamento correto */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-xs text-gray-400 mb-1 text-center">CMV</p>
          <p className="text-sm font-bold text-gray-900 text-center">
            {precoCMV ? formatCurrency(precoCMV) : '-'}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-xs text-gray-400 mb-1 text-center">Margem Bruta</p>
          <p className="text-sm font-bold text-gray-900 text-center">
            {margemPercentual ? `${margemPercentual}%` : '-'}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-xs text-gray-400 mb-1 text-center">Venda</p>
          <p className="text-sm font-bold text-gray-900 text-center">{formatCurrency(produto.preco_venda)}</p>
        </div>
      </div>

      {/* Botões de Ação - Backgrounds individuais */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
        <div className="bg-gray-50 rounded-lg">
          <button
            onClick={() => {
              // Funcionalidade de ver detalhes
            }}
            className="w-full flex flex-col items-center gap-1 py-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Ver detalhes"
          >
            <Eye className="w-4 h-4" />
            <span className="text-xs">Ver</span>
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-lg">
          <button
            onClick={() => {
              // Funcionalidade de ver preços/histórico
            }}
            className="w-full flex flex-col items-center gap-1 py-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Ver preços"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-xs">Preços</span>
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-lg">
          <button
            onClick={() => onEdit(produto)}
            className="w-full flex flex-col items-center gap-1 py-2 text-gray-400 hover:text-orange-500 transition-colors"
            title="Editar produto"
          >
            <Edit className="w-4 h-4" />
            <span className="text-xs">Editar</span>
          </button>
        </div>
      </div>
    </div>
  );
}