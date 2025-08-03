'use client';

import React, { useState, useEffect } from 'react';
import { X, Building2, Check, Trash2 } from 'lucide-react';
import { Fornecedor } from '@/types/entities';

interface EditarFornecedorModalProps {
  isOpen: boolean;
  onClose: () => void;
  fornecedor: Fornecedor | null;
  onSave: (id: number, changes: { status?: string; fields?: Array<{campo: string, valor: string}> }) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function EditarFornecedorModal({ isOpen, onClose, fornecedor, onSave, onDelete }: EditarFornecedorModalProps) {
  const [status, setStatus] = useState<'ativo' | 'inativo'>('ativo');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cidade: '',
    estado: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalStatus, setOriginalStatus] = useState<'ativo' | 'inativo'>('ativo');
  const [originalFormData, setOriginalFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cidade: '',
    estado: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const estados = [
    'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal',
    'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul',
    'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí',
    'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia',
    'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'
  ];

  // Função para formatar telefone
  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 0) return '';
    
    if (numbers.length <= 2) {
      return `(${numbers}`;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  useEffect(() => {
    if (fornecedor) {
      const currentStatus = fornecedor.status as 'ativo' | 'inativo';
      const currentFormData = {
        nome: fornecedor.nome,
        email: fornecedor.email,
        telefone: fornecedor.telefone,
        cidade: fornecedor.cidade,
        estado: fornecedor.estado
      };
      
      setStatus(currentStatus);
      setOriginalStatus(currentStatus);
      setFormData(currentFormData);
      setOriginalFormData(currentFormData);
      setHasChanges(false);
    }
  }, [fornecedor]);

  const checkForChanges = (newFormData: typeof formData, newStatus: 'ativo' | 'inativo') => {
    const statusChanged = newStatus !== originalStatus;
    const fieldsChanged = Object.keys(newFormData).some(key => 
      newFormData[key as keyof typeof newFormData] !== originalFormData[key as keyof typeof originalFormData]
    );
    setHasChanges(statusChanged || fieldsChanged);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let newFormData = { ...formData };
    
    if (name === 'telefone') {
      newFormData[name] = formatTelefone(value);
    } else {
      newFormData[name] = value;
    }
    
    setFormData(newFormData);
    checkForChanges(newFormData, status);
  };

  const handleStatusChange = (newStatus: 'ativo' | 'inativo') => {
    setStatus(newStatus);
    checkForChanges(formData, newStatus);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fornecedor || !hasChanges) {
      onClose();
      return;
    }

    setIsLoading(true);
    try {
      const changes: { status?: string; fields?: Array<{campo: string, valor: string}> } = {};
      
      // Verificar mudança de status
      if (status !== originalStatus) {
        changes.status = status.charAt(0).toUpperCase() + status.slice(1);
      }
      
      // Verificar mudanças nos campos
      const fieldChanges: Array<{campo: string, valor: string}> = [];
      Object.keys(formData).forEach(key => {
        const fieldKey = key as keyof typeof formData;
        if (formData[fieldKey] !== originalFormData[fieldKey]) {
          fieldChanges.push({
            campo: key,
            valor: formData[fieldKey]
          });
        }
      });
      
      if (fieldChanges.length > 0) {
        changes.fields = fieldChanges;
      }
      
      await onSave(fornecedor.id, changes);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setHasChanges(false);
      onClose();
    }
  };

  const getChangesDescription = () => {
    const changes = [];
    
    if (status !== originalStatus) {
      changes.push(`Status: ${originalStatus} → ${status}`);
    }
    
    Object.keys(formData).forEach(key => {
      const fieldKey = key as keyof typeof formData;
      if (formData[fieldKey] !== originalFormData[fieldKey]) {
        const fieldName = key === 'nome' ? 'Nome' : 
                         key === 'email' ? 'Email' :
                         key === 'telefone' ? 'Telefone' :
                         key === 'cidade' ? 'Cidade' :
                         key === 'estado' ? 'Estado' : key;
        changes.push(`${fieldName}: ${originalFormData[fieldKey]} → ${formData[fieldKey]}`);
      }
    });
    
    return changes;
  };

  const handleDelete = async () => {
    if (!fornecedor) return;
    
    setIsLoading(true);
    try {
      await onDelete(fornecedor.id);
      onClose();
    } catch (error) {
      console.error('Erro ao excluir fornecedor:', error);
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!isOpen || !fornecedor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Editar Fornecedor</h2>
              <p className="text-sm text-gray-500">{fornecedor.nome}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Informações do Fornecedor - Editáveis */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Informações do Fornecedor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}
              <div className="md:col-span-2">
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Fornecedor
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-sm"
                  disabled={isLoading}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-sm"
                  disabled={isLoading}
                />
              </div>

              {/* Telefone */}
              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-sm"
                  maxLength={15}
                  disabled={isLoading}
                />
              </div>

              {/* Cidade */}
              <div>
                <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  id="cidade"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-sm"
                  disabled={isLoading}
                />
              </div>

              {/* Estado */}
              <div>
                <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-sm"
                  disabled={isLoading}
                >
                  <option value="">Selecione o estado</option>
                  {estados.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Status Toggle */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Status do Fornecedor
            </label>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${status === 'ativo' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium text-gray-900">
                  {status === 'ativo' ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              
              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => handleStatusChange(status === 'ativo' ? 'inativo' : 'ativo')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  status === 'ativo' ? 'bg-green-500' : 'bg-red-500'
                }`}
                disabled={isLoading}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    status === 'ativo' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Status Description */}
            <p className="mt-2 text-xs text-gray-500">
              {status === 'ativo' 
                ? 'Fornecedor ativo pode receber novos pedidos e aparecer nas listagens.'
                : 'Fornecedor inativo não receberá novos pedidos e ficará oculto nas listagens.'
              }
            </p>
          </div>

          {/* Changes Indicator */}
          {hasChanges && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Alterações que serão aplicadas:</h4>
                  <div className="space-y-1">
                    {getChangesDescription().map((change, index) => (
                      <div key={index} className="text-sm text-blue-800">
                        • {change}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Zona de Perigo - Excluir Fornecedor */}
          <div className="pt-6 border-t border-gray-100">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-red-900 mb-1">Zona de Perigo</h4>
                  <p className="text-sm text-red-700 mb-3">
                    Excluir este fornecedor removerá permanentemente todos os seus dados. Esta ação não pode ser desfeita.
                  </p>
                  {!showDeleteConfirm ? (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={isLoading}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50 font-medium"
                    >
                      Excluir Fornecedor
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-red-900">
                        Tem certeza que deseja excluir "{fornecedor?.nome}"?
                      </p>
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowDeleteConfirm(false)}
                          disabled={isLoading}
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors disabled:opacity-50"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={handleDelete}
                          disabled={isLoading}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Excluindo...</span>
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-3 h-3" />
                              <span>Confirmar Exclusão</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !hasChanges}
              className={`px-6 py-3 rounded-xl transition-all duration-200 font-medium flex items-center space-x-2 ${
                hasChanges
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Salvando...</span>
                </>
              ) : hasChanges ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </>
              ) : (
                <span>Nenhuma Alteração</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}