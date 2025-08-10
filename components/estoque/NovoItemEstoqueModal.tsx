'use client';

import React, { useState, useEffect } from 'react';
import { X, Package, Calendar, DollarSign, FileText } from 'lucide-react';
import { useProdutosFornecedores } from '../../hooks/useProdutosFornecedores';

interface NovoItemEstoqueData {
  id_produto: number;
  id_lote: number;
  quantidade: number;
  vencimento: string;
  custo_unitario: number;
  data_entrada: string;
  data_saida: string;
  documento_referencia: string;
  status: string;
}

interface NovoItemEstoqueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  createItemEstoque?: (data: NovoItemEstoqueData) => Promise<any>;
}

export function NovoItemEstoqueModal({ isOpen, onClose, onSave, createItemEstoque }: NovoItemEstoqueModalProps) {
  // Estados do formulário
  const [formData, setFormData] = useState<NovoItemEstoqueData>({
    id_produto: 0,
    id_lote: 0,
    quantidade: 0,
    vencimento: '',
    custo_unitario: 0,
    data_entrada: new Date().toISOString().split('T')[0],
    data_saida: '',
    documento_referencia: '',
    status: 'ativo'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Hook para buscar produtos
  const { produtos, loadingProdutos, errorProdutos } = useProdutosFornecedores();

  // Reset form quando modal abre/fecha
  useEffect(() => {
    if (isOpen) {
      setFormData({
        id_produto: 0,
        id_lote: 0,
        quantidade: 0,
        vencimento: '',
        custo_unitario: 0,
        data_entrada: new Date().toISOString().split('T')[0],
        data_saida: '',
        documento_referencia: '',
        status: 'ativo'
      });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof NovoItemEstoqueData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.id_produto || formData.id_produto <= 0) {
      newErrors.id_produto = 'Selecione um produto';
    }
    if (!formData.id_lote || formData.id_lote <= 0) {
      newErrors.id_lote = 'ID do lote é obrigatório e deve ser maior que 0';
    }
    if (formData.quantidade < 0) {
      newErrors.quantidade = 'Quantidade deve ser maior ou igual a 0';
    }
    if (!formData.custo_unitario || formData.custo_unitario <= 0) {
      newErrors.custo_unitario = 'Custo unitário é obrigatório e deve ser maior que 0';
    }
    if (!formData.status) {
      newErrors.status = 'Status é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!createItemEstoque) {
      alert('Função de criação não disponível');
      return;
    }

    try {
      setIsSubmitting(true);

      console.log('[NovoItemEstoqueModal] Criando item de estoque:', formData);

      await createItemEstoque(formData);
      
      console.log('[NovoItemEstoqueModal] Item criado com sucesso');

      // Sucesso - fechar modal e atualizar lista
      onClose();
      if (onSave) {
        onSave();
      }

    } catch (error) {
      console.error('[NovoItemEstoqueModal] Erro ao criar item:', error);
      alert('Erro ao criar item de estoque. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;  
return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Novo Item de Estoque</h2>
              <p className="text-sm text-gray-500">Adicione um novo item ao seu estoque</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coluna Esquerda */}
            <div className="space-y-4">
              {/* Produto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Produto *
                </label>
                {loadingProdutos ? (
                  <div className="flex items-center justify-center py-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-200 border-t-blue-500"></div>
                    <span className="ml-2 text-sm text-gray-500">Carregando produtos...</span>
                  </div>
                ) : errorProdutos ? (
                  <div className="text-red-500 text-sm py-2">{errorProdutos}</div>
                ) : (
                  <select
                    value={formData.id_produto}
                    onChange={(e) => handleInputChange('id_produto', parseInt(e.target.value))}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm ${
                      errors.id_produto ? 'border-red-300' : 'border-gray-200'
                    }`}
                  >
                    <option value={0}>Selecione um produto</option>
                    {produtos.map(produto => (
                      <option key={produto.id_produto} value={produto.id_produto}>
                        {produto.marca} - {produto.nome_produto}
                      </option>
                    ))}
                  </select>
                )}
                {errors.id_produto && (
                  <p className="text-red-500 text-xs mt-1">{errors.id_produto}</p>
                )}
              </div>

              {/* ID do Lote */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID do Lote *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.id_lote || ''}
                  onChange={(e) => handleInputChange('id_lote', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                    errors.id_lote ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="Digite o ID do lote"
                />
                {errors.id_lote && (
                  <p className="text-red-500 text-xs mt-1">{errors.id_lote}</p>
                )}
              </div>

              {/* Quantidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantidade *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.quantidade || ''}
                  onChange={(e) => handleInputChange('quantidade', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                    errors.quantidade ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="Digite a quantidade"
                />
                {errors.quantidade && (
                  <p className="text-red-500 text-xs mt-1">{errors.quantidade}</p>
                )}
              </div>

              {/* Custo Unitário */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custo Unitário (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.custo_unitario || ''}
                  onChange={(e) => handleInputChange('custo_unitario', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                    errors.custo_unitario ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="0,00"
                />
                {errors.custo_unitario && (
                  <p className="text-red-500 text-xs mt-1">{errors.custo_unitario}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm ${
                    errors.status ? 'border-red-300' : 'border-gray-200'
                  }`}
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="vencido">Vencido</option>
                  <option value="reservado">Reservado</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-xs mt-1">{errors.status}</p>
                )}
              </div>
            </div>      
      {/* Coluna Direita */}
            <div className="space-y-4">
              {/* Data de Entrada */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Entrada
                </label>
                <input
                  type="date"
                  value={formData.data_entrada}
                  onChange={(e) => handleInputChange('data_entrada', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              {/* Data de Saída */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Saída
                </label>
                <input
                  type="date"
                  value={formData.data_saida}
                  onChange={(e) => handleInputChange('data_saida', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Deixe em branco se ainda não saiu</p>
              </div>

              {/* Vencimento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Vencimento
                </label>
                <input
                  type="date"
                  value={formData.vencimento}
                  onChange={(e) => handleInputChange('vencimento', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Opcional - para produtos perecíveis</p>
              </div>

              {/* Documento de Referência */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Documento de Referência
                </label>
                <input
                  type="text"
                  value={formData.documento_referencia}
                  onChange={(e) => handleInputChange('documento_referencia', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Ex: NF-001, Pedido-123"
                />
                <p className="text-xs text-gray-500 mt-1">Nota fiscal, pedido de compra, etc.</p>
              </div>

              {/* Resumo dos Cálculos */}
              {formData.quantidade > 0 && formData.custo_unitario > 0 && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <h4 className="text-sm font-medium text-blue-900 mb-3 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Resumo Financeiro
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantidade:</span>
                      <span className="font-medium text-gray-900">{formData.quantidade} unidades</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Custo unitário:</span>
                      <span className="font-medium text-gray-900">
                        R$ {formData.custo_unitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="border-t border-blue-200 pt-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-blue-900">Valor Total:</span>
                        <span className="font-bold text-blue-600">
                          R$ {(formData.quantidade * formData.custo_unitario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <Package className="w-4 h-4" />
                  <span>Salvar Item</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}