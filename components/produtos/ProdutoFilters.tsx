'use client';

import { useState } from 'react';
import { Search, Grid3X3, List, Filter, ChevronDown } from 'lucide-react';

interface ProdutoFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedMarca: string;
  onMarcaChange: (value: string) => void;
  selectedPublicoAlvo: string;
  onPublicoAlvoChange: (value: string) => void;
  selectedVariacao: string;
  onVariacaoChange: (value: string) => void;
  selectedValorTipo: string;
  onValorTipoChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onAdvancedFiltersToggle: () => void;
  categories: string[];
  marcas: string[];
  publicosAlvo: string[];
  variacoes: string[];
  totalProdutos: number;
}

export function ProdutoFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedMarca,
  onMarcaChange,
  selectedPublicoAlvo,
  onPublicoAlvoChange,
  selectedVariacao,
  onVariacaoChange,
  selectedValorTipo,
  onValorTipoChange,
  viewMode,
  onViewModeChange,
  onAdvancedFiltersToggle,
  categories,
  marcas,
  publicosAlvo,
  variacoes,
  totalProdutos,
}: ProdutoFiltersProps) {
  const [showValorDropdown, setShowValorDropdown] = useState(false);

  const valorOptions = [
    { value: 'cmv', label: 'CMV' },
    { value: 'margem', label: 'Margem' },
    { value: 'venda', label: 'Venda' }
  ];

  const getValorLabel = () => {
    const option = valorOptions.find(opt => opt.value === selectedValorTipo);
    return option ? option.label : 'Por valores';
  };

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
            placeholder="Buscar Produtos..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 bg-gray-50 focus:bg-white text-sm"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Filtro de Marcas */}
        <select
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors duration-200 text-sm min-w-[140px]"
          value={selectedMarca}
          onChange={(e) => onMarcaChange(e.target.value)}
        >
          <option value="">Todas as Marcas</option>
          {marcas.map(marca => (
            <option key={marca} value={marca}>{marca}</option>
          ))}
        </select>

        {/* Filtro de Categorias */}
        <select
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors duration-200 text-sm min-w-[160px]"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">Todas as Categorias</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        {/* Filtro de Públicos-Alvo */}
        <select
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors duration-200 text-sm min-w-[150px]"
          value={selectedPublicoAlvo}
          onChange={(e) => onPublicoAlvoChange(e.target.value)}
        >
          <option value="">Todos os Públicos</option>
          {publicosAlvo.map(publico => (
            <option key={publico} value={publico}>{publico}</option>
          ))}
        </select>

        {/* Filtro de Variações */}
        <select
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors duration-200 text-sm min-w-[140px]"
          value={selectedVariacao}
          onChange={(e) => onVariacaoChange(e.target.value)}
        >
          <option value="">Todas as Variações</option>
          {variacoes.map(variacao => (
            <option key={variacao} value={variacao}>{variacao}</option>
          ))}
        </select>

        {/* Filtro Por Valores (Dropdown customizado) */}
        <div className="relative">
          <button
            onClick={() => setShowValorDropdown(!showValorDropdown)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 hover:bg-white transition-colors duration-200 text-sm min-w-[120px] flex items-center justify-between"
          >
            <span className={selectedValorTipo ? 'text-gray-900' : 'text-gray-500'}>
              {getValorLabel()}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>
          
          {showValorDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  onValorTipoChange('');
                  setShowValorDropdown(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg"
              >
                Por Valores
              </button>
              {valorOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    onValorTipoChange(option.value);
                    setShowValorDropdown(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 last:rounded-b-lg"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Ícone de filtros avançados */}
        <button
          onClick={onAdvancedFiltersToggle}
          className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-gray-500 hover:text-gray-700"
          title="Filtros Avançados"
        >
          <Filter className="w-3.5 h-3.5" />
        </button>

        {/* Contador de produtos */}
        <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full font-medium">
          {totalProdutos} Produtos
        </span>
      </div>

      {/* Filtros de visualização alinhados à direita */}
      <div className="flex items-center bg-gray-50 rounded-lg p-1">
        <button
          onClick={() => onViewModeChange('grid')}
          className={`p-2 rounded-md transition-colors ${
            viewMode === 'grid' 
              ? 'bg-white shadow-sm text-orange-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          title="Visualização em Cards"
        >
          <Grid3X3 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className={`p-2 rounded-md transition-colors ${
            viewMode === 'list' 
              ? 'bg-white shadow-sm text-orange-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          title="Visualização em Tabela"
        >
          <List className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}