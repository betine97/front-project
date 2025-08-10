'use client';

import React, { useState, useEffect } from 'react';
import { X, Target, Check, Search } from 'lucide-react';
import { PublicoAlvo, Criterio } from '@/lib/services/publicos.service';

interface NovoPublicoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (publico: PublicoAlvo, criterios: number[]) => Promise<void>;
  criterios: Criterio[];
  loading?: boolean;
}

export function NovoPublicoModal({ 
  isOpen, 
  onClose, 
  onSave, 
  criterios,
  loading = false 
}: NovoPublicoModalProps) {
  const [formData, setFormData] = useState<PublicoAlvo>({
    nome: '',
    descricao: '',
    data_criacao: new Date().toISOString().split('T')[0],
    status: 'Ativo'
  });

  const [criteriosSelecionados, setCriteriosSelecionados] = useState<number[]>([]);
  const [searchCriterio, setSearchCriterio] = useState('');
  const [saving, setSaving] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        nome: '',
        descricao: '',
        data_criacao: new Date().toISOString().split('T')[0],
        status: 'Ativo'
      });
      setCriteriosSelecionados([]);
      setSearchCriterio('');
    }
  }, [isOpen]);

  // Filtrar critérios baseado na busca
  const criteriosFiltrados = criterios.filter(criterio =>
    criterio.nome_condicao.toLowerCase().includes(searchCriterio.toLowerCase())
  );

  const handleInputChange = (field: keyof PublicoAlvo, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCriterioToggle = (criterioId: number) => {
    setCriteriosSelecionados(prev => {
      if (prev.includes(criterioId)) {
        return prev.filter(id => id !== criterioId);
      } else {
        return [...prev, criterioId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim() || !formData.descricao.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setSaving(true);
      await onSave(formData, criteriosSelecionados);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar público:', error);
    } finally {
      setSaving(false);
    }
  };

  const getCriterioNome = (id: number) => {
    const criterio = criterios.find(c => c.id === id);
    return criterio?.nome_condicao || '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Novo Público-Alvo</h2>
              <p className="text-sm text-gray-500">Defina um novo segmento de clientes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={saving}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">Informações Básicas</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Público *
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Ex: Pet Lovers"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value as 'Ativo' | 'Inativo')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Descreva as características deste público-alvo..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Criação
                </label>
                <input
                  type="date"
                  value={formData.data_criacao}
                  onChange={(e) => handleInputChange('data_criacao', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                  readOnly
                />
              </div>
            </div>

            {/* Critérios */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Critérios de Segmentação</h3>
                <span className="text-xs text-gray-500">
                  {criteriosSelecionados.length} selecionado{criteriosSelecionados.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Busca de Critérios */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar critérios..."
                  value={searchCriterio}
                  onChange={(e) => setSearchCriterio(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Lista de Critérios */}
              <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                {criteriosFiltrados.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    {searchCriterio ? 'Nenhum critério encontrado' : 'Carregando critérios...'}
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {criteriosFiltrados.map((criterio) => (
                      <label
                        key={criterio.id}
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={criteriosSelecionados.includes(criterio.id)}
                            onChange={() => handleCriterioToggle(criterio.id)}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-colors ${
                            criteriosSelecionados.includes(criterio.id)
                              ? 'bg-orange-500 border-orange-500'
                              : 'border-gray-300'
                          }`}>
                            {criteriosSelecionados.includes(criterio.id) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-gray-700 flex-1">
                          {criterio.nome_condicao}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Critérios Selecionados */}
              {criteriosSelecionados.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Critérios selecionados:</p>
                  <div className="flex flex-wrap gap-2">
                    {criteriosSelecionados.map((criterioId) => (
                      <span
                        key={criterioId}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                      >
                        {getCriterioNome(criterioId)}
                        <button
                          type="button"
                          onClick={() => handleCriterioToggle(criterioId)}
                          className="ml-2 hover:text-orange-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || loading}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Target className="w-4 h-4" />
                <span>Criar Público</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}