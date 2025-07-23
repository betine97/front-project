'use client';

import React, { useState } from 'react';
import { Truck, Plus, Mail, Phone, MapPin } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useFornecedores } from '../../hooks/useFornecedores';
import { Fornecedor } from '../../types/entities';
import { MESSAGES } from '../../constants/index';

export default function FornecedoresPage() {
  // Estados locais para UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showModal, setShowModal] = useState(false);
  const [editingFornecedor, setEditingFornecedor] = useState<Fornecedor | null>(null);

  // Hook para gerenciar fornecedores
  const {
    fornecedores: allFornecedores,
    loading,
    error,
    total,
    totalPages,
    createFornecedor,
    updateFornecedor,
    deleteFornecedor,
    refetch
  } = useFornecedores({});

  // Função para filtrar fornecedores
  const filteredFornecedores = allFornecedores.filter(fornecedor => {
    const matchesSearch = !searchTerm || 
      fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fornecedor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fornecedor.cidade.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !selectedStatus || fornecedor.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Handlers
  const handleCreateFornecedor = () => {
    setEditingFornecedor(null);
    setShowModal(true);
  };

  const handleEditFornecedor = (fornecedor: Fornecedor) => {
    setEditingFornecedor(fornecedor);
    setShowModal(true);
  };

  const handleDeleteFornecedor = async (id: number) => {
    if (confirm(MESSAGES.CONFIRM.DELETE)) {
      try {
        await deleteFornecedor(id);
      } catch (error) {
        console.error('Erro ao excluir fornecedor:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Loading state
  if (loading === 'loading') {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <button
              onClick={refetch}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-3" style={{ paddingLeft: '4rem', paddingTop: '4rem', paddingBottom: '4rem', paddingRight: '6rem' }}>
        {/* Header Simplificado */}
        <div>
          <p className="text-sm text-gray-600 font-medium">Gerencie seus fornecedores</p>
        </div>

        {/* Stats Cards - Estilo ClickUp/Itaú */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric orange">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{allFornecedores.length} fornecedores total</p>
              </div>
            </div>
          </div>
          
          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric gray">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{allFornecedores.filter(f => f.status === 'ativo').length} ativos</p>
              </div>
            </div>
          </div>
          
          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric gray">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">
                  {Array.from(new Set(allFornecedores.map(f => f.estado))).length} estados
                </p>
              </div>
            </div>
          </div>
          
          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric gray">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">
                  {Array.from(new Set(allFornecedores.map(f => f.cidade))).length} cidades
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 mb-4">
          <button
            onClick={handleCreateFornecedor}
            className="btn-primary flex items-center space-x-2 text-sm px-4 py-2"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Fornecedor</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="w-80 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar fornecedores..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 bg-gray-50 focus:bg-white text-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
            </div>

            {/* Status Filter */}
            <select
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors duration-200 text-sm"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Todos os status</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
        </div>

        {/* Fornecedores Grid */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">Lista de Fornecedores</h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-gray-50 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                  {filteredFornecedores.length} fornecedores
                </span>
              </div>
            </div>

            {filteredFornecedores.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-10 h-10 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Nenhum fornecedor encontrado</h4>
                <p className="text-gray-500 mb-6">Tente ajustar os filtros ou adicione novos fornecedores</p>
                <button
                  onClick={handleCreateFornecedor}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  <span>Adicionar Fornecedor</span>
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFornecedores.map(fornecedor => (
                  <div key={fornecedor.id} className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                    {/* Status Badge */}
                    <div className="flex justify-between items-start mb-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        fornecedor.status === 'ativo' 
                          ? 'bg-green-50 text-green-600 border border-green-200' 
                          : 'bg-red-50 text-red-600 border border-red-200'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          fornecedor.status === 'ativo' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        {fornecedor.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>

                    {/* Fornecedor Name */}
                    <div className="mb-3">
                      <h4 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">
                        {fornecedor.nome}
                      </h4>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-xs text-gray-600">
                        <Mail className="w-3 h-3 mr-2 text-gray-400" />
                        <span className="truncate">{fornecedor.email}</span>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-600">
                        <Phone className="w-3 h-3 mr-2 text-gray-400" />
                        <span>{fornecedor.telefone}</span>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-600">
                        <MapPin className="w-3 h-3 mr-2 text-gray-400" />
                        <span className="truncate">{fornecedor.cidade}, {fornecedor.estado}</span>
                      </div>
                    </div>

                    {/* Date & Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        Cadastrado em {formatDate(fornecedor.data_cadastro)}
                      </span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEditFornecedor(fornecedor)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-150"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteFornecedor(fornecedor.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-150"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider">Nome</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider">Contato</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider">Localização</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider">Cadastro</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredFornecedores.map(fornecedor => (
                      <tr key={fornecedor.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900 text-sm">{fornecedor.nome}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">{fornecedor.email}</div>
                          <div className="text-xs text-gray-500">{fornecedor.telefone}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">{fornecedor.cidade}</div>
                          <div className="text-xs text-gray-500">{fornecedor.estado} - {fornecedor.cep}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                            fornecedor.status === 'ativo' 
                              ? 'bg-green-50 text-green-600 border border-green-200' 
                              : 'bg-red-50 text-red-600 border border-red-200'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              fornecedor.status === 'ativo' ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                            {fornecedor.status === 'ativo' ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {formatDate(fornecedor.data_cadastro)}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEditFornecedor(fornecedor)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-150"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteFornecedor(fornecedor.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-150"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}