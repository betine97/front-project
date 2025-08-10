'use client';

import React, { useState } from 'react';
import { TrendingUp, Target, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { NovoPublicoModal } from './NovoPublicoModal';
import { usePublicos } from '@/hooks/usePublicos';
import { PublicoAlvo as PublicoAlvoType } from '@/lib/services/publicos.service';

interface PublicoAlvoDisplay {
  id: string;
  nome: string;
  descricao: string;
  criterios: string[];
  tamanho_estimado: number;
  cor: string;
  created_at: string;
}

export function PublicosAlvo() {
  const [showNovoPublicoModal, setShowNovoPublicoModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Hook para gerenciar públicos
  const { 
    publicos: publicosData, 
    criterios, 
    publicosCriterios,
    publicosClientes,
    loading, 
    error, 
    createPublico 
  } = usePublicos();

  // Converter dados da API para o formato de exibição
  const publicos: PublicoAlvoDisplay[] = publicosData.map((publico, index) => {
    const criteriosDoPublico = publico.id ? publicosCriterios[publico.id] || [] : [];
    const clientesDoPublico = publico.id ? publicosClientes[publico.id] || [] : [];
    
    return {
      id: publico.id?.toString() || index.toString(),
      nome: publico.nome,
      descricao: publico.descricao,
      criterios: criteriosDoPublico.map(c => c.nome_condicao),
      tamanho_estimado: clientesDoPublico.length, // Usar o número real de clientes
      cor: ['#FF6600', '#28A745', '#8B5CF6', '#DC2626', '#059669'][index % 5],
      created_at: publico.data_criacao
    };
  });

  // Função para gerar iniciais do nome
  const getInitials = (nome: string) => {
    return nome
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  // Função para gerar cor baseada no nome
  const getColorFromName = (nome: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 
      'bg-indigo-500', 'bg-yellow-500', 'bg-red-500', 'bg-teal-500'
    ];
    const index = nome.length % colors.length;
    return colors[index];
  };

  // Handler para criar novo público
  const handleCreatePublico = async (publicoData: PublicoAlvoType, criteriosSelecionados: number[]) => {
    try {
      const resultado = await createPublico(publicoData, criteriosSelecionados);
      setShowNovoPublicoModal(false);
      
      // Criar mensagem de sucesso com detalhes dos clientes (quando disponível)
      let mensagem = `Público "${publicoData.nome}" criado com sucesso!`;
      
      if (resultado.resultadoClientes) {
        const { clientes_adicionados, clientes_ja_existiam, total } = resultado.resultadoClientes;
        mensagem += ` ${total} clientes encontrados`;
        if (clientes_adicionados > 0) {
          mensagem += `, ${clientes_adicionados} adicionados`;
        }
        if (clientes_ja_existiam > 0) {
          mensagem += `, ${clientes_ja_existiam} já faziam parte`;
        }
        mensagem += '.';
      }
      
      setSuccessMessage(mensagem);
      
      // Limpar mensagem após 7 segundos (mais tempo para ler os detalhes)
      setTimeout(() => {
        setSuccessMessage(null);
      }, 7000);
    } catch (error) {
      console.error('Erro ao criar público:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
          <Target className="w-4 h-4 text-orange-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Públicos-Alvo</h2>
        </div>
      </div>

      {/* Mensagem de Sucesso */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 text-sm">{successMessage}</p>
        </div>
      )}

      {/* Conteúdo */}
      <div className="space-y-4">
        {/* Loading State */}
        {loading === 'loading' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                    <div className="space-y-1">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {loading === 'error' && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Content */}
        {loading !== 'loading' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicos.map((publico) => (
              <div key={publico.id} className="card hover:shadow-lg transition-all duration-200">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: publico.cor }}
                      >
                        <Target className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{publico.nome}</h3>
                        <p className="text-xs text-gray-500">
                          {publicosClientes[parseInt(publico.id)]?.length || 0} cliente{(publicosClientes[parseInt(publico.id)]?.length || 0) !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                        <Eye className="w-3 h-3" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-orange-600 rounded">
                        <Edit className="w-3 h-3" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 rounded">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mb-3">{publico.descricao}</p>

                  <div className="space-y-2 mb-3">
                    <p className="text-xs font-medium text-gray-700">Critérios:</p>
                    <div className="flex flex-wrap gap-1">
                      {publico.criterios.length === 0 ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-500">
                          Nenhum critério definido
                        </span>
                      ) : (
                        publico.criterios.map((criterio, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-50 text-orange-700"
                          >
                            {criterio}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Clientes do Público */}
                  {publicosClientes[parseInt(publico.id)] && publicosClientes[parseInt(publico.id)].length > 0 && (
                    <div className="space-y-2 mb-3">
                      <p className="text-xs font-medium text-gray-700">Clientes:</p>
                      <div className="flex items-center space-x-1">
                        {publicosClientes[parseInt(publico.id)].slice(0, 3).map((cliente, index) => (
                          <div
                            key={cliente.id}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white ${getColorFromName(cliente.nome_cliente)}`}
                            title={cliente.nome_cliente}
                          >
                            {getInitials(cliente.nome_cliente)}
                          </div>
                        ))}
                        {publicosClientes[parseInt(publico.id)].length > 3 && (
                          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-600">
                            +{publicosClientes[parseInt(publico.id)].length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}



                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Criado em {new Date(publico.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Card para adicionar novo público */}
            <div className="card border-2 border-dashed border-gray-200 hover:border-orange-300 transition-colors duration-200">
              <div className="p-4 flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mb-3">
                  <Plus className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Novo Público-Alvo</h3>
                <p className="text-xs text-gray-500 mb-3">Defina um novo segmento de clientes</p>
                <button 
                  onClick={() => setShowNovoPublicoModal(true)}
                  className="btn-primary text-xs px-3 py-2"
                  data-novo-publico
                >
                  Criar Público
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resumo */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{publicos.length} Públicos-Alvo</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 font-medium">Segmentação ativa</span>
          </div>
        </div>
      </div>

      {/* Modal Novo Público */}
      <NovoPublicoModal
        isOpen={showNovoPublicoModal}
        onClose={() => setShowNovoPublicoModal(false)}
        onSave={handleCreatePublico}
        criterios={criterios}
        loading={loading === 'loading'}
      />
    </div>
  );
}