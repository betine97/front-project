'use client';

import React, { useState, useEffect } from 'react';
import { X, Tag, Plus, ChevronDown, ChevronRight, Brain, AlertTriangle, Loader2 } from 'lucide-react';
import { Cliente } from '../../types/entities';
import { useTags } from '../../hooks/useTags';
import { Tag as TagType } from '../../lib/services/tags.service';

interface TagsClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: Cliente | null;
  onTagsUpdated?: () => void;
}

export function TagsClienteModal({ 
  isOpen, 
  onClose, 
  cliente,
  onTagsUpdated
}: TagsClienteModalProps) {
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [novaTag, setNovaTag] = useState('');
  const [clienteTags, setClienteTags] = useState<TagType[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  
  const { 
    tags, 
    loading, 
    error, 
    createTag, 
    assignTagsToClient, 
    getClientTags,
    getTagsByCategory,
    clearError 
  } = useTags();

  // Carregar tags do cliente quando o modal abrir
  useEffect(() => {
    if (isOpen && cliente) {
      loadClientTags();
      clearError();
    }
  }, [isOpen, cliente]);

  const loadClientTags = async () => {
    if (!cliente) return;
    
    try {
      const tags = await getClientTags(cliente.id);
      setClienteTags(tags);
      setSelectedTagIds(tags.map(tag => tag.id_tag));
    } catch (error) {
      console.error('Erro ao carregar tags do cliente:', error);
    }
  };

  if (!isOpen || !cliente) return null;

  const handleCreateTag = async () => {
    if (!novaTag.trim()) return;
    
    try {
      await createTag({
        categoria_tag: 'Personalizada',
        nome_tag: novaTag.trim()
      });
      setNovaTag('');
    } catch (error) {
      console.error('Erro ao criar tag:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreateTag();
    }
  };

  const toggleSection = (categoria: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [categoria]: !prev[categoria]
    }));
  };

  const toggleTagSelection = (tagId: number) => {
    setSelectedTagIds(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };

  const handleSaveTags = async () => {
    if (!cliente) return;
    
    try {
      setSaving(true);
      await assignTagsToClient(cliente.id, selectedTagIds);
      
      // Chamar callback para atualizar a lista de clientes
      if (onTagsUpdated) {
        onTagsUpdated();
      }
      
      onClose();
    } catch (error) {
      console.error('Erro ao salvar tags:', error);
    } finally {
      setSaving(false);
    }
  };

  // Agrupar tags por categoria
  const tagsByCategory = getTagsByCategory();

  // Obter cor da categoria
  const getCategoryColor = (categoria: string) => {
    const colors: Record<string, string> = {
      'Fidelidade': 'bg-purple-100 text-purple-800',
      'Comportamento': 'bg-blue-100 text-blue-800',
      'Personalizada': 'bg-orange-100 text-orange-800',
      'Dores': 'bg-red-100 text-red-800',
      'Preferências': 'bg-green-100 text-green-800'
    };
    return colors[categoria] || 'bg-gray-100 text-gray-800';
  };

  // Obter ícone da categoria
  const getCategoryIcon = (categoria: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Comportamento': <Brain className="w-4 h-4" />,
      'Dores': <AlertTriangle className="w-4 h-4" />,
      'Personalizada': <Tag className="w-4 h-4" />
    };
    return icons[categoria] || <Tag className="w-4 h-4" />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Tags do Cliente</h2>
              <p className="text-sm text-gray-500">{cliente.nome}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
                <span className="ml-2 text-sm text-gray-600">Carregando tags...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {!loading && (
              <>
                {/* Adicionar Nova Tag */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Criar Nova Tag Personalizada
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={novaTag}
                      onChange={(e) => setNovaTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Digite o nome da nova tag..."
                    />
                    <button
                      onClick={handleCreateTag}
                      disabled={!novaTag.trim()}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Criar</span>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Tags personalizadas serão salvas na categoria "Personalizada"
                  </p>
                </div>

                {/* Tags Selecionadas */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Tags Selecionadas ({selectedTagIds.length})
                  </label>
                  {selectedTagIds.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Tag className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">Nenhuma tag selecionada</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Selecione tags das categorias abaixo para organizar este cliente
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedTagIds.map((tagId) => {
                        const tag = tags.find(t => t.id_tag === tagId);
                        if (!tag) return null;
                        
                        return (
                          <span
                            key={tagId}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(tag.categoria_tag)}`}
                          >
                            {tag.nome_tag}
                            <button
                              onClick={() => toggleTagSelection(tagId)}
                              className="ml-2 hover:opacity-70"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Tags por Categoria */}
                {Object.entries(tagsByCategory).map(([categoria, categoryTags]) => (
                  <div key={categoria} className="space-y-3">
                    <button
                      onClick={() => toggleSection(categoria)}
                      className="flex items-center justify-between w-full text-left"
                    >
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(categoria)}
                        <label className="text-sm font-medium text-gray-700 cursor-pointer">
                          {categoria} ({categoryTags.length})
                        </label>
                      </div>
                      {expandedSections[categoria] ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                    
                    {expandedSections[categoria] && (
                      <div className="pl-6 space-y-2">
                        <p className="text-xs text-gray-500 mb-3">
                          Clique nas tags para selecioná-las ou removê-las
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {categoryTags.map((tag) => {
                            const isSelected = selectedTagIds.includes(tag.id_tag);
                            return (
                              <button
                                key={tag.id_tag}
                                onClick={() => toggleTagSelection(tag.id_tag)}
                                className={`text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center space-x-2 ${
                                  isSelected
                                    ? `${getCategoryColor(categoria)} border-2 border-current`
                                    : `${getCategoryColor(categoria).replace('text-', 'text-').replace('bg-', 'bg-').replace('100', '50')} hover:${getCategoryColor(categoria).replace('100', '100')}`
                                }`}
                              >
                                <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${
                                  isSelected ? 'bg-current border-current' : 'border-current'
                                }`}>
                                  {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                </div>
                                <span className="truncate">{tag.nome_tag}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveTags}
            disabled={saving || loading}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Tag className="w-4 h-4" />
                <span>Salvar Tags</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}