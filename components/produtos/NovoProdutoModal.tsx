'use client';

import React, { useState, useEffect } from 'react';
import { X, Package, Plus, ExternalLink } from 'lucide-react';
import { fornecedoresService } from '@/lib/services/fornecedores.service';
import { useRouter } from 'next/navigation';

interface NovoProdutoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (produto: {
    data_cadastro: string;
    codigo_barra: string;
    nome_produto: string;
    sku: string;
    categoria: string;
    destinado_para: string;
    variacao: string;
    marca: string;
    descricao: string;
    status: string;
    preco_venda: number;
    id_fornecedor: number;
  }) => Promise<void>;
  editingProduct?: {
    id: number;
    codigo_barra: string;
    nome_produto: string;
    sku: string;
    categoria: string;
    destinado_para: string;
    variacao: string;
    marca: string;
    descricao: string;
    status: string;
    preco_venda: number;
    id_fornecedor: number;
  } | null;
}

export function NovoProdutoModal({ isOpen, onClose, onSave, editingProduct }: NovoProdutoModalProps) {
  const router = useRouter();
  
  // Estado específico para fornecedores na modal
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [loadingFornecedores, setLoadingFornecedores] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorFornecedores, setErrorFornecedores] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    data_cadastro: new Date().toISOString().split('T')[0],
    codigo_barra: '',
    nome_produto: '',
    sku: '',
    categoria: '',
    destinado_para: '',
    variacao: '',
    marca: '',
    descricao: '',
    status: 'ativo',
    preco_venda: '',
    id_fornecedor: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({}); // Erros específicos da API
  const [showFornecedorModal, setShowFornecedorModal] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  // Função para carregar fornecedores ativos
  const carregarFornecedores = async () => {
    setLoadingFornecedores('loading');
    setErrorFornecedores(null);
    
    try {
      console.log('[NovoProdutoModal] Carregando fornecedores ativos...');
      const fornecedoresAtivos = await fornecedoresService.getAllActive();
      console.log('[NovoProdutoModal] Fornecedores carregados:', fornecedoresAtivos.length);
      
      setFornecedores(fornecedoresAtivos);
      setLoadingFornecedores('success');
    } catch (error) {
      console.error('[NovoProdutoModal] Erro ao carregar fornecedores:', error);
      setErrorFornecedores('Erro ao carregar fornecedores');
      setLoadingFornecedores('error');
    }
  };

  // Carregar fornecedores quando a modal abrir
  useEffect(() => {
    if (isOpen) {
      console.log('[NovoProdutoModal] Modal aberta, carregando fornecedores...');
      carregarFornecedores();
    }
  }, [isOpen]);

  // Preencher formulário quando estiver editando um produto
  useEffect(() => {
    if (isOpen && editingProduct) {
      console.log('[NovoProdutoModal] Preenchendo formulário para edição:', editingProduct);
      setFormData({
        data_cadastro: new Date().toISOString().split('T')[0], // Manter data atual
        codigo_barra: editingProduct.codigo_barra || '',
        nome_produto: editingProduct.nome_produto || '',
        sku: editingProduct.sku || '',
        categoria: editingProduct.categoria || '',
        destinado_para: editingProduct.destinado_para || '',
        variacao: editingProduct.variacao || '',
        marca: editingProduct.marca || '',
        descricao: editingProduct.descricao || '',
        status: editingProduct.status || 'ativo',
        preco_venda: editingProduct.preco_venda ? editingProduct.preco_venda.toString() : '',
        id_fornecedor: editingProduct.id_fornecedor ? editingProduct.id_fornecedor.toString() : ''
      });
    } else if (isOpen && !editingProduct) {
      // Limpar formulário para novo produto
      console.log('[NovoProdutoModal] Limpando formulário para novo produto');
      setFormData({
        data_cadastro: new Date().toISOString().split('T')[0],
        codigo_barra: '',
        nome_produto: '',
        sku: '',
        categoria: '',
        destinado_para: '',
        variacao: '',
        marca: '',
        descricao: '',
        status: 'ativo',
        preco_venda: '',
        id_fornecedor: ''
      });
    }
  }, [isOpen, editingProduct]);

  // Debug logs usando useEffect para capturar mudanças de estado
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('=== DEBUG ESTADOS DE ERRO (ATUALIZADO) ===');
      console.log('errors:', errors);
      console.log('apiErrors:', apiErrors);
      console.log('errors.codigo_barra:', errors.codigo_barra);
      console.log('apiErrors.codigo_barra:', apiErrors.codigo_barra);
      console.log('Condição CSS:', (errors.codigo_barra || apiErrors.codigo_barra));
      
      if (apiErrors.codigo_barra) {
        console.log('🔴 CAMPO DEVE ESTAR VERMELHO AGORA!');
      }
    }
  }, [errors, apiErrors]);

  const categorias = [
    'Alimentação', 'Acessórios', 'Brinquedos', 'Higiene', 'Medicamentos',
    'Camas e Casinhas', 'Coleiras e Guias', 'Transporte', 'Aquarismo', 'Outros'
  ];

  const publicosAlvo = [
    'Cães', 'Gatos', 'Aves', 'Peixes', 'Roedores', 'Répteis', 'Todos'
  ];

  const variacoes = [
    'Filhotes', 'Adultos', 'Idosos', 'Pequeno Porte', 'Médio Porte', 
    'Grande Porte', 'Premium', 'Standard', 'Light', 'Sem Variação'
  ];

  const marcas = [
    'Whiskas', 'Pedigree', 'Royal Canin', 'Premier', 'Golden', 
    'Biofresh', 'Nutrópica', 'Alcon', 'Tetra', 'Outros'
  ];

  // Sistema de mapeamento de respostas do endpoint
  const handleApiError = (error: any) => {
    console.log('🔍 INICIANDO MAPEAMENTO DE ERRO');
    console.log('🔍 ERROR COMPLETO:', error);
    console.log('🔍 ERROR.RESPONSE:', error?.response);
    console.log('🔍 ERROR.MESSAGE:', error?.message);
    
    // Extrair mensagem de erro de diferentes estruturas possíveis
    let errorMessage = '';
    let statusCode = 0;
    
    if (error?.response) {
      statusCode = error.response.status;
      // Tentar diferentes caminhos para a mensagem de erro
      errorMessage = error.response.data?.error || 
                    error.response.data?.message || 
                    error.message || 
                    '';
    } else {
      errorMessage = error?.message || '';
    }
    
    console.log('📋 DADOS EXTRAÍDOS:');
    console.log('- Status:', statusCode);
    console.log('- errorMessage:', errorMessage);
    console.log('- Tipo do errorMessage:', typeof errorMessage);
    
    // Verificar qualquer mensagem relacionada a código de barras duplicado
    const lowerMessage = errorMessage.toLowerCase();
    console.log('🔍 VERIFICANDO MENSAGEM:', lowerMessage);
    
    if (lowerMessage.includes('código de barras') || 
        lowerMessage.includes('barcode') || 
        lowerMessage.includes('já está sendo usado') ||
        lowerMessage.includes('already') ||
        lowerMessage.includes('duplicado') ||
        lowerMessage.includes('duplicate') ||
        lowerMessage.includes('associated') ||
        errorMessage.includes('Este código de barras já está sendo usado')) {
      
      console.log('✅ DETECTADO: Erro de código de barras duplicado');
      
      // Destacar campo em vermelho usando apiErrors
      setApiErrors(prev => {
        console.log('🎨 APLICANDO ESTILO VERMELHO NO CAMPO');
        const newApiErrors = {
          ...prev,
          codigo_barra: 'Este código de barras já está cadastrado'
        };
        console.log('🎨 NOVO ESTADO apiErrors:', newApiErrors);
        return newApiErrors;
      });
      
      // Mostrar mensagem do backend
      setApiError(errorMessage || 'Este código de barras já está cadastrado no sistema.');
      return;
    }
    
    // Outros erros - mostrar mensagem do backend
    if (errorMessage) {
      console.log('⚠️ ERRO GENÉRICO:', errorMessage);
      setApiError(errorMessage);
      return;
    }
    
    // Fallback para erro sem mensagem específica
    const genericMessage = 'Ocorreu um erro inesperado. Tente novamente.';
    console.log('❌ ERRO SEM MENSAGEM ESPECÍFICA');
    setApiError(genericMessage);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar apenas erros de validação local (não erros de API)
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Limpar erro da API geral quando usuário começar a digitar
    if (apiError) {
      setApiError('');
    }
    
    // Para o campo código de barras, só limpar o erro da API quando o usuário realmente mudar o valor
    if (name === 'codigo_barra' && apiErrors.codigo_barra) {
      // Só limpar se o valor mudou significativamente (mais de 3 caracteres diferentes)
      const currentValue = formData.codigo_barra;
      if (Math.abs(value.length - currentValue.length) > 2 || value !== currentValue) {
        setApiErrors(prev => ({ ...prev, codigo_barra: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome_produto.trim()) {
      newErrors.nome_produto = 'Nome do produto é obrigatório';
    }

    if (!formData.codigo_barra.trim()) {
      newErrors.codigo_barra = 'Código de barras é obrigatório';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU é obrigatório';
    }

    if (!formData.categoria.trim()) {
      newErrors.categoria = 'Categoria é obrigatória';
    }

    if (!formData.destinado_para.trim()) {
      newErrors.destinado_para = 'Público-alvo é obrigatório';
    }

    if (!formData.marca.trim()) {
      newErrors.marca = 'Marca é obrigatória';
    }

    if (!formData.id_fornecedor.trim()) {
      newErrors.id_fornecedor = 'Fornecedor é obrigatório';
    }

    if (!formData.preco_venda.trim()) {
      newErrors.preco_venda = 'Preço de venda é obrigatório';
    } else {
      const preco = parseFloat(formData.preco_venda.replace(',', '.'));
      if (isNaN(preco) || preco <= 0) {
        newErrors.preco_venda = 'Preço deve ser um número válido maior que zero';
      }
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    // Limpar erros de API anteriores ao tentar salvar novamente
    setApiErrors({});
    setApiError('');
    
    try {
      const produtoData = {
        ...formData,
        preco_venda: parseFloat(formData.preco_venda.replace(',', '.')),
        id_fornecedor: parseInt(formData.id_fornecedor)
      };
      
      await onSave(produtoData);
      
      // Resetar formulário após sucesso
      setFormData({
        data_cadastro: new Date().toISOString().split('T')[0],
        codigo_barra: '',
        nome_produto: '',
        sku: '',
        categoria: '',
        destinado_para: '',
        variacao: '',
        marca: '',
        descricao: '',
        status: 'ativo',
        preco_venda: '',
        id_fornecedor: ''
      });
      setErrors({});
      setApiErrors({});
      setApiError('');
      onClose();
    } catch (error: any) {
      console.error('=== ERRO CAPTURADO NO SUBMIT ===');
      console.error('Error completo:', error);
      console.error('Error response:', error?.response);
      console.error('Error response data:', error?.response?.data);
      console.error('Error response status:', error?.response?.status);
      console.error('Error message:', error?.message);
      
      // Sistema de mapeamento de respostas do endpoint
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      // Limpar formulário
      setFormData({
        data_cadastro: new Date().toISOString().split('T')[0],
        codigo_barra: '',
        nome_produto: '',
        sku: '',
        categoria: '',
        destinado_para: '',
        variacao: '',
        marca: '',
        descricao: '',
        status: 'ativo',
        preco_venda: '',
        id_fornecedor: ''
      });
      setErrors({});
      setApiErrors({});
      setApiError('');
      setShowFornecedorModal(false);
      // Limpar estado dos fornecedores
      setFornecedores([]);
      setLoadingFornecedores('idle');
      setErrorFornecedores(null);
      onClose();
    }
  };

  const handleFornecedorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    
    if (value === 'outro') {
      setShowFornecedorModal(true);
    } else {
      setFormData(prev => ({ ...prev, id_fornecedor: value }));
      if (errors.id_fornecedor) {
        setErrors(prev => ({ ...prev, id_fornecedor: '' }));
      }
    }
  };

  const handleRedirectToFornecedores = () => {
    setShowFornecedorModal(false);
    onClose();
    router.push('/fornecedores');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <p className="text-sm text-gray-500">
                {editingProduct ? 'Edite as informações do produto' : 'Adicione um novo produto ao catálogo'}
              </p>
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

        {/* Alerta de Erro da API */}
        {apiError && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 text-red-500 mt-0.5">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">{apiError}</p>
              </div>
              <button
                onClick={() => setApiError('')}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Nome do Produto */}
              <div className="md:col-span-2 lg:col-span-3">
                <label htmlFor="nome_produto" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  id="nome_produto"
                  name="nome_produto"
                  value={formData.nome_produto}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    errors.nome_produto ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                  }`}
                  placeholder="Digite o nome do produto"
                  disabled={isLoading}
                />
                {errors.nome_produto && <p className="mt-1 text-sm text-red-600">{errors.nome_produto}</p>}
              </div>

              {/* Código de Barras */}
              <div>
                <label htmlFor="codigo_barra" className="block text-sm font-medium text-gray-700 mb-2">
                  Código de Barras *
                </label>
                <input
                  type="text"
                  id="codigo_barra"
                  name="codigo_barra"
                  value={formData.codigo_barra}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                    (errors.codigo_barra || apiErrors.codigo_barra) 
                      ? 'border-red-500 bg-red-50 text-red-900 focus:border-red-600 focus:ring-4 focus:ring-red-100' 
                      : 'border-gray-200 bg-gray-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100'
                  }`}
                  placeholder="7891234567890"
                  disabled={isLoading}
                />
                {(errors.codigo_barra || apiErrors.codigo_barra) && (
                  <p className="mt-1 text-sm text-red-600 font-medium">
                    {errors.codigo_barra || apiErrors.codigo_barra}
                  </p>
                )}
              </div>

              {/* SKU */}
              <div>
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">
                  SKU *
                </label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    errors.sku ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                  }`}
                  placeholder="RAC-PREM-GAT-FIL"
                  disabled={isLoading}
                />
                {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku}</p>}
              </div>

              {/* Preço de Venda */}
              <div>
                <label htmlFor="preco_venda" className="block text-sm font-medium text-gray-700 mb-2">
                  Preço de Venda *
                </label>
                <input
                  type="text"
                  id="preco_venda"
                  name="preco_venda"
                  value={formData.preco_venda}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    errors.preco_venda ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                  }`}
                  placeholder="99.90"
                  disabled={isLoading}
                />
                {errors.preco_venda && <p className="mt-1 text-sm text-red-600">{errors.preco_venda}</p>}
              </div>

              {/* Categoria */}
              <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria *
                </label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    errors.categoria ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                  }`}
                  disabled={isLoading}
                >
                  <option value="">Selecione a categoria</option>
                  {categorias.map(categoria => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </select>
                {errors.categoria && <p className="mt-1 text-sm text-red-600">{errors.categoria}</p>}
              </div>

              {/* Destinado Para */}
              <div>
                <label htmlFor="destinado_para" className="block text-sm font-medium text-gray-700 mb-2">
                  Destinado Para *
                </label>
                <select
                  id="destinado_para"
                  name="destinado_para"
                  value={formData.destinado_para}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    errors.destinado_para ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                  }`}
                  disabled={isLoading}
                >
                  <option value="">Selecione o público-alvo</option>
                  {publicosAlvo.map(publico => (
                    <option key={publico} value={publico}>{publico}</option>
                  ))}
                </select>
                {errors.destinado_para && <p className="mt-1 text-sm text-red-600">{errors.destinado_para}</p>}
              </div>

              {/* Variação */}
              <div>
                <label htmlFor="variacao" className="block text-sm font-medium text-gray-700 mb-2">
                  Variação
                </label>
                <select
                  id="variacao"
                  name="variacao"
                  value={formData.variacao}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors"
                  disabled={isLoading}
                >
                  <option value="">Selecione a variação</option>
                  {variacoes.map(variacao => (
                    <option key={variacao} value={variacao}>{variacao}</option>
                  ))}
                </select>
              </div>

              {/* Marca */}
              <div>
                <label htmlFor="marca" className="block text-sm font-medium text-gray-700 mb-2">
                  Marca *
                </label>
                <select
                  id="marca"
                  name="marca"
                  value={formData.marca}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    errors.marca ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                  }`}
                  disabled={isLoading}
                >
                  <option value="">Selecione a marca</option>
                  {marcas.map(marca => (
                    <option key={marca} value={marca}>{marca}</option>
                  ))}
                </select>
                {errors.marca && <p className="mt-1 text-sm text-red-600">{errors.marca}</p>}
              </div>

              {/* Fornecedor */}
              <div>
                <label htmlFor="id_fornecedor" className="block text-sm font-medium text-gray-700 mb-2">
                  Fornecedor *
                </label>
                <select
                  id="id_fornecedor"
                  name="id_fornecedor"
                  value={formData.id_fornecedor}
                  onChange={handleFornecedorChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    errors.id_fornecedor ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                  }`}
                  disabled={isLoading || loadingFornecedores === 'loading'}
                >
                  <option value="">Selecione o fornecedor</option>
                  {fornecedores.map(fornecedor => (
                    <option key={fornecedor.id} value={fornecedor.id}>
                      {fornecedor.nome}
                    </option>
                  ))}
                  <option value="outro" className="font-medium text-orange-600">
                    + Outro fornecedor
                  </option>
                </select>
                {errors.id_fornecedor && <p className="mt-1 text-sm text-red-600">{errors.id_fornecedor}</p>}
                {loadingFornecedores === 'loading' && (
                  <p className="mt-1 text-xs text-gray-500">Carregando fornecedores...</p>
                )}
                {errorFornecedores && (
                  <p className="mt-1 text-xs text-red-500">Erro: {errorFornecedores}</p>
                )}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-1">
                    <p className="text-xs text-blue-500">
                      Debug: {fornecedores?.length || 0} fornecedores carregados | Status: {loadingFornecedores}
                    </p>
                    <p className="text-xs text-gray-500">
                      Fornecedores: {fornecedores.map(f => f.nome).join(', ')}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        console.log('=== DEBUG FORNECEDORES ===');
                        console.log('Total fornecedores:', fornecedores.length);
                        console.log('Fornecedores:', fornecedores);
                        console.log('Status loading:', loadingFornecedores);
                        console.log('Forçando reload...');
                        carregarFornecedores();
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
                    >
                      🔄 Debug & Recarregar
                    </button>
                  </div>
                )}
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors"
                  disabled={isLoading}
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>

              {/* Data de Cadastro */}
              <div>
                <label htmlFor="data_cadastro" className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Cadastro
                </label>
                <input
                  type="date"
                  id="data_cadastro"
                  name="data_cadastro"
                  value={formData.data_cadastro}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors"
                  disabled={isLoading}
                />
                <p className="mt-1 text-xs text-gray-500">Data será preenchida automaticamente com a data atual</p>
              </div>

              {/* Descrição */}
              <div className="md:col-span-2 lg:col-span-3">
                <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none ${
                    errors.descricao ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                  }`}
                  placeholder="Descreva o produto detalhadamente..."
                  disabled={isLoading}
                />
                {errors.descricao && <p className="mt-1 text-sm text-red-600">{errors.descricao}</p>}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-100">
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
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 font-medium flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Salvando...</span>
                  </>
                ) : (
                  <span>{editingProduct ? 'Atualizar Produto' : 'Salvar Produto'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de Confirmação para Criar Fornecedor */}
      {showFornecedorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Criar Novo Fornecedor</h3>
                  <p className="text-sm text-gray-500">Fornecedor não encontrado na lista</p>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-800">
                  Para vincular este produto a um novo fornecedor, você precisa criá-lo primeiro. 
                  Deseja ir para a página de fornecedores agora?
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowFornecedorModal(false)}
                  className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium px-4 py-3 rounded-xl transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRedirectToFornecedores}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-4 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Ir para Fornecedores</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}