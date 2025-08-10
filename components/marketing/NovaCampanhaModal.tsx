'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Infinity, Users, Target } from 'lucide-react';
import { CriarCampanhaData } from '../../lib/services/campanhas.service';
import { usePublicos } from '../../hooks/usePublicos';
import { PublicoAlvo } from '../../lib/services/publicos.service';

interface NovaCampanhaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CriarCampanhaData, publicosIds?: number[]) => Promise<void>;
  loading?: boolean;
}

export function NovaCampanhaModal({ isOpen, onClose, onSave, loading = false }: NovaCampanhaModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    desc: '',
    data_lancamento: '',
    data_fim: '',
    status: 'ativa' as const,
  });
  
  const [tipoPrazo, setTipoPrazo] = useState<'definido' | 'indeterminado'>('definido');
  const [publicosSelecionados, setPublicosSelecionados] = useState<number[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Hook para buscar públicos-alvo
  const { publicos, loading: loadingPublicos, fetchPublicos } = usePublicos({ autoFetch: false });
  
  // Converter loading para boolean
  const isLoadingPublicos = loadingPublicos === 'loading';

  // Função para formatar data no padrão dd/mm/yyyy de forma consistente
  const formatarData = (data: string): string => {
    if (!data) return '';
    const date = new Date(data);
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const ano = date.getFullYear().toString();
    return `${dia}/${mes}/${ano}`;
  };

  // Função para converter data do input (yyyy-mm-dd) para o formato da API (dd/mm/yyyy)
  const converterDataParaAPI = (data: string): string => {
    if (!data) return '';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  // Função para obter data atual no formato dd/mm/yyyy de forma consistente
  const obterDataAtual = (): string => {
    const hoje = new Date();
    const dia = hoje.getDate().toString().padStart(2, '0');
    const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
    const ano = hoje.getFullYear().toString();
    return `${dia}/${mes}/${ano}`;
  };

  const validarFormulario = (): boolean => {
    const novosErrors: Record<string, string> = {};

    // Nome obrigatório (2-255 chars)
    if (!formData.nome.trim()) {
      novosErrors.nome = 'Nome da campanha é obrigatório';
    } else if (formData.nome.trim().length < 2) {
      novosErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    } else if (formData.nome.trim().length > 255) {
      novosErrors.nome = 'Nome deve ter no máximo 255 caracteres';
    }

    // Descrição opcional (max 1000 chars)
    if (formData.desc && formData.desc.length > 1000) {
      novosErrors.desc = 'Descrição deve ter no máximo 1000 caracteres';
    }

    // Data de lançamento obrigatória
    if (!formData.data_lancamento) {
      novosErrors.data_lancamento = 'Data de lançamento é obrigatória';
    }

    // Data fim obrigatória se prazo definido
    if (tipoPrazo === 'definido' && !formData.data_fim) {
      novosErrors.data_fim = 'Data de fim é obrigatória para campanhas com prazo definido';
    }

    // Validar se data de fim é posterior à data de lançamento
    if (formData.data_lancamento && formData.data_fim) {
      const dataLancamento = new Date(formData.data_lancamento);
      const dataFim = new Date(formData.data_fim);
      
      if (dataFim <= dataLancamento) {
        novosErrors.data_fim = 'Data de fim deve ser posterior à data de lançamento';
      }
    }

    setErrors(novosErrors);
    return Object.keys(novosErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    try {
      // Criar data de criação automaticamente no formato dd/mm/yyyy
      const dataCriacao = obterDataAtual();

      const dadosParaAPI: CriarCampanhaData = {
        nome: formData.nome.trim(),
        desc: formData.desc.trim() || undefined,
        data_criacao: dataCriacao,
        data_lancamento: converterDataParaAPI(formData.data_lancamento),
        data_fim: tipoPrazo === 'definido' ? converterDataParaAPI(formData.data_fim) : undefined,
        status: formData.status,
      };

      // Passar os dados da campanha e os públicos selecionados separadamente
      await onSave(dadosParaAPI, publicosSelecionados);
      handleClose();
    } catch (error) {
      console.error('Erro ao salvar campanha:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      nome: '',
      desc: '',
      data_lancamento: '',
      data_fim: '',
      status: 'ativa',
    });
    setTipoPrazo('definido');
    setPublicosSelecionados([]);
    setErrors({});
    onClose();
  };

  // Carregar públicos quando a modal abrir
  useEffect(() => {
    if (isOpen && publicos.length === 0) {
      fetchPublicos();
    }
  }, [isOpen, publicos.length, fetchPublicos]);



  // Funções para gerenciar seleção de públicos
  const handleTogglePublico = (publicoId: number) => {
    setPublicosSelecionados(prev => {
      if (prev.includes(publicoId)) {
        return prev.filter(id => id !== publicoId);
      } else {
        return [...prev, publicoId];
      }
    });
  };

  const handleSelectAllPublicos = () => {
    if (publicosSelecionados.length === publicos.length) {
      setPublicosSelecionados([]);
    } else {
      setPublicosSelecionados(publicos.map(p => p.id!).filter(Boolean));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Nova Campanha</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nome da Campanha */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nome da Campanha *
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                errors.nome ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ex: Campanha Black Friday 2025"
              maxLength={255}
              disabled={loading}
            />
            {errors.nome && (
              <p className="mt-1 text-sm text-red-600">{errors.nome}</p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={formData.desc}
              onChange={(e) => handleInputChange('desc', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none transition-all duration-200 ${
                errors.desc ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Descreva sua campanha..."
              rows={3}
              maxLength={1000}
              disabled={loading}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.desc && (
                <p className="text-sm text-red-600">{errors.desc}</p>
              )}
              <p className="text-xs ml-auto" style={{ color: '#6C757D' }}>
                {formData.desc.length}/1000 caracteres
              </p>
            </div>
          </div>

          {/* Tipo de Prazo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Duração da Campanha *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTipoPrazo('definido')}
                className={`flex items-center justify-center p-3 border rounded-lg transition-all duration-200 hover:shadow-sm ${
                  tipoPrazo === 'definido'
                    ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                }`}
                disabled={loading}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Prazo Definido
              </button>
              <button
                type="button"
                onClick={() => setTipoPrazo('indeterminado')}
                className={`flex items-center justify-center p-3 border rounded-lg transition-all duration-200 hover:shadow-sm ${
                  tipoPrazo === 'indeterminado'
                    ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                }`}
                disabled={loading}
              >
                <Infinity className="w-4 h-4 mr-2" />
                Indeterminado
              </button>
            </div>
          </div>

          {/* Data de Lançamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Lançamento *
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.data_lancamento}
                onChange={(e) => handleInputChange('data_lancamento', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.data_lancamento ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              <Clock className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {errors.data_lancamento && (
              <p className="mt-1 text-sm text-red-600">{errors.data_lancamento}</p>
            )}
          </div>

          {/* Data de Fim - só aparece se prazo definido */}
          {tipoPrazo === 'definido' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Fim *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.data_fim}
                  onChange={(e) => handleInputChange('data_fim', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.data_fim ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.data_fim && (
                <p className="mt-1 text-sm text-red-600">{errors.data_fim}</p>
              )}
            </div>
          )}

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status Inicial
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              disabled={loading}
            >
              <option value="ativa">Ativa</option>
              <option value="inativa">Inativa</option>
              <option value="pausada">Pausada</option>
            </select>
          </div>

          {/* Públicos-Alvo */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Públicos-Alvo
              </label>
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">
                  {publicosSelecionados.length} selecionado(s)
                </span>
              </div>
            </div>
            

            
            {isLoadingPublicos ? (
              <div className="border border-gray-300 rounded-lg p-4 text-center">
                <div className="animate-pulse flex items-center justify-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400 animate-spin" />
                  <span className="text-sm text-gray-500">Carregando públicos...</span>
                </div>
              </div>
            ) : !publicos || publicos.length === 0 ? (
              <div className="border border-gray-300 rounded-lg p-4 text-center">
                <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-2">Nenhum público-alvo encontrado</p>
                <p className="text-xs text-gray-400">
                  Crie públicos-alvo na página de Clientes primeiro
                </p>
              </div>
            ) : (
              <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                {/* Header com seleção geral */}
                <div className="sticky top-0 bg-gray-50 border-b border-gray-200 p-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={publicosSelecionados.length === publicos.length && publicos.length > 0}
                      onChange={handleSelectAllPublicos}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      disabled={loading}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Selecionar todos ({publicos.length})
                    </span>
                  </label>
                </div>

                {/* Lista de públicos */}
                <div className="p-2 space-y-1">
                  {publicos.map((publico) => (
                    <label
                      key={publico.id}
                      className="flex items-start space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                    >
                      <input
                        type="checkbox"
                        checked={publicosSelecionados.includes(publico.id!)}
                        onChange={() => handleTogglePublico(publico.id!)}
                        className="mt-0.5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        disabled={loading}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {publico.nome}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            publico.status === 'Ativo' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {publico.status}
                          </span>
                        </div>
                        {publico.descricao && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {publico.descricao}
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
            

            
            <p className="text-xs text-gray-500 mt-1">
              Os públicos-alvo selecionados receberão esta campanha de marketing
            </p>
          </div>

          {/* Resumo */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Resumo da Campanha</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Nome:</strong> {formData.nome || 'Não informado'}</p>
              <p><strong>Data de criação:</strong> {obterDataAtual()}</p>
              <p><strong>Data de lançamento:</strong> {formData.data_lancamento ? formatarData(formData.data_lancamento) : 'Não informada'}</p>
              {tipoPrazo === 'definido' && (
                <p><strong>Data de fim:</strong> {formData.data_fim ? formatarData(formData.data_fim) : 'Não informada'}</p>
              )}
              {tipoPrazo === 'indeterminado' && (
                <p><strong>Duração:</strong> Indeterminada</p>
              )}
              <p><strong>Status:</strong> {formData.status}</p>
              <p><strong>Públicos-alvo:</strong> {
                publicosSelecionados.length > 0 
                  ? `${publicosSelecionados.length} selecionado(s)`
                  : 'Nenhum selecionado'
              }</p>
            </div>
          </div>

          {/* Preview do JSON que será enviado */}
          <div className="bg-gray-900 rounded-lg p-3 space-y-3">
            <div>
              <h4 className="text-xs font-medium text-gray-300 mb-2">1. Criar Campanha (POST /api/campanhas):</h4>
              <pre className="text-xs text-green-400 overflow-x-auto">
{JSON.stringify({
  nome: formData.nome || "Campanha Black Friday 2025",
  desc: formData.desc || "Promoção especial para pets",
  data_criacao: obterDataAtual(),
  data_lancamento: formData.data_lancamento ? converterDataParaAPI(formData.data_lancamento) : "15/08/2025",
  data_fim: tipoPrazo === 'definido' && formData.data_fim ? converterDataParaAPI(formData.data_fim) : undefined,
  status: formData.status
}, null, 2)}
              </pre>
            </div>
            
            {publicosSelecionados.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-300 mb-2">2. Vincular Públicos (POST /api/campanhas/:id/publicos):</h4>
                <pre className="text-xs text-blue-400 overflow-x-auto">
{JSON.stringify({
  publicos: publicosSelecionados
}, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 hover:shadow-sm font-medium"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md font-medium"
              disabled={loading}
            >
              {loading ? 'Criando...' : 'Criar Campanha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}