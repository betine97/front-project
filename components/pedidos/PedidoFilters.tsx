'use client';

import { useState } from 'react';
import { Search, Grid3X3, List, Filter, ChevronDown } from 'lucide-react';

interface PedidoFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedFornecedor: string;
  onFornecedorChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  fornecedores: string[];
  totalPedidos: number;
}

export function PedidoFilters({
  searchTerm,
  onSearchChange,
  selectedFornecedor,
  onFornecedorChange,
  selectedStatus,
  onStatusChange,
  viewMode,
  onViewModeChange,
  fornecedores,
  totalPedidos,
}: PedidoFiltersProps) {
  const statusOptions = [
    'aguardando confirmação do fornecedor',
    'confirmado',
    'em produção',
    'enviado',
    'entregue',
    'cancelado'
  ];

  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
      {/* Filtros da esquerda */}
      <div className="flex items-center space-x-3">
        {/* Campo de busca */}
        <div className="w-64 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-3.5 w-3.5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar pedidos..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 bg-gray-50 focus:bg-white text-sm"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Filtro de Fornecedores */}
        <select
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors duration-200 text-sm min-w-[160px]"
          value={selectedFornecedor}
          onChange={(e) => onFornecedorChange(e.target.value)}
        >
          <option value="">Todos os Fornecedores</option>
          {fornecedores.map(fornecedor => (
            <option key={fornecedor} value={fornecedor}>{fornecedor}</option>
          ))}
        </select>

        {/* Filtro de Status */}
        <select
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors duration-200 text-sm min-w-[140px]"
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="">Todos os Status</option>
          {statusOptions.map(status => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Controles da direita */}
      <div className="flex items-center space-x-3">
        {/* Contador de pedidos */}
        <span className="text-sm text-gray-500">
          {totalPedidos} {totalPedidos === 1 ? 'Pedido' : 'Pedidos'}
        </span>

        {/* Toggle de visualização */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded-md transition-colors duration-200 ${
              viewMode === 'grid'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            title="Visualização em grade"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-1.5 rounded-md transition-colors duration-200 ${
              viewMode === 'list'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            title="Visualização em lista"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}