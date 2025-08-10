'use client';

import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Calendar, FileText, MapPin, Heart, Plus, Trash2 } from 'lucide-react';
import { petsService } from '@/lib/services/pets.service';

interface NovoClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cliente: {
    tipo_cliente: string;
    nome_cliente: string;
    numero_celular: string;
    sexo: 'M' | 'F';
    email?: string;
    data_nascimento?: string;
    endereco: {
      cep: string;
      cidade: string;
      estado: string;
      bairro: string;
      logradouro: string;
      numero: string;
      complemento?: string;
      obs?: string;
    };
  }) => Promise<{ id: number } | void>;
}

export function NovoClienteModal({
  isOpen,
  onClose,
  onSave
}: NovoClienteModalProps) {
  const [activeTab, setActiveTab] = useState<'cliente' | 'pets'>('cliente');
  
  const [formData, setFormData] = useState({
    tipo_cliente: 'PF',
    nome_cliente: '',
    numero_celular: '',
    sexo: 'M' as 'M' | 'F',
    email: '',
    data_nascimento: ''
  });

  const [enderecoData, setEnderecoData] = useState({
    cep: '',
    cidade: '',
    estado: '',
    bairro: '',
    logradouro: '',
    numero: '',
    complemento: '',
    obs: ''
  });

  const [petsData, setPetsData] = useState<{
    nome_pet: string;
    especie: string;
    raca: string;
    porte: string;
    data_aniversario: string;
    idade: number;
  }[]>([]);

  const [currentPet, setCurrentPet] = useState({
    nome_pet: '',
    especie: '',
    raca: '',
    porte: '',
    data_aniversario: '',
    idade: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Resetar form quando modal abrir/fechar
  useEffect(() => {
    if (isOpen) {
      setActiveTab('cliente');
      setFormData({
        tipo_cliente: 'PF',
        nome_cliente: '',
        numero_celular: '',
        sexo: 'M',
        email: '',
        data_nascimento: ''
      });
      setEnderecoData({
        cep: '',
        cidade: '',
        estado: '',
        bairro: '',
        logradouro: '',
        numero: '',
        complemento: '',
        obs: ''
      });
      setPetsData([]);
      setCurrentPet({
        nome_pet: '',
        especie: '',
        raca: '',
        porte: '',
        data_aniversario: '',
        idade: 0
      });
      setErrors({});
      setShowSuccess(false);
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Campos obrigatórios do cliente
    if (!formData.tipo_cliente.trim()) {
      newErrors.tipo_cliente = 'Tipo de cliente é obrigatório';
    } else if (formData.tipo_cliente.length > 11) {
      newErrors.tipo_cliente = 'Tipo de cliente deve ter no máximo 11 caracteres';
    }

    if (!formData.nome_cliente.trim()) {
      newErrors.nome_cliente = 'Nome do cliente é obrigatório';
    } else if (formData.nome_cliente.length < 2) {
      newErrors.nome_cliente = 'Nome deve ter pelo menos 2 caracteres';
    } else if (formData.nome_cliente.length > 100) {
      newErrors.nome_cliente = 'Nome deve ter no máximo 100 caracteres';
    }

    if (!formData.numero_celular.trim()) {
      newErrors.numero_celular = 'Número de celular é obrigatório';
    } else {
      const numeroLimpo = formData.numero_celular.replace(/\D/g, '');
      if (numeroLimpo.length < 10) {
        newErrors.numero_celular = 'Número de celular deve ter pelo menos 10 dígitos';
      } else if (numeroLimpo.length > 15) {
        newErrors.numero_celular = 'Número de celular deve ter no máximo 15 dígitos';
      }
    }

    if (!formData.sexo) {
      newErrors.sexo = 'Sexo é obrigatório';
    }

    // Campos opcionais com validação
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    } else if (formData.email && formData.email.length > 100) {
      newErrors.email = 'Email deve ter no máximo 100 caracteres';
    }

    if (formData.data_nascimento && formData.data_nascimento.length > 20) {
      newErrors.data_nascimento = 'Data de nascimento deve ter no máximo 20 caracteres';
    }

    // Campos obrigatórios do endereço
    if (!enderecoData.cep.trim()) {
      newErrors.cep = 'CEP é obrigatório';
    } else if (enderecoData.cep.length > 20) {
      newErrors.cep = 'CEP deve ter no máximo 20 caracteres';
    }

    if (!enderecoData.cidade.trim()) {
      newErrors.cidade = 'Cidade é obrigatória';
    } else if (enderecoData.cidade.length > 100) {
      newErrors.cidade = 'Cidade deve ter no máximo 100 caracteres';
    }

    if (!enderecoData.estado.trim()) {
      newErrors.estado = 'Estado é obrigatório';
    } else if (enderecoData.estado.length > 50) {
      newErrors.estado = 'Estado deve ter no máximo 50 caracteres';
    }

    if (!enderecoData.bairro.trim()) {
      newErrors.bairro = 'Bairro é obrigatório';
    } else if (enderecoData.bairro.length > 100) {
      newErrors.bairro = 'Bairro deve ter no máximo 100 caracteres';
    }

    if (!enderecoData.logradouro.trim()) {
      newErrors.logradouro = 'Logradouro é obrigatório';
    } else if (enderecoData.logradouro.length > 255) {
      newErrors.logradouro = 'Logradouro deve ter no máximo 255 caracteres';
    }

    if (!enderecoData.numero.trim()) {
      newErrors.numero = 'Número é obrigatório';
    } else if (enderecoData.numero.length > 20) {
      newErrors.numero = 'Número deve ter no máximo 20 caracteres';
    }

    // Campos opcionais do endereço
    if (enderecoData.complemento && enderecoData.complemento.length > 255) {
      newErrors.complemento = 'Complemento deve ter no máximo 255 caracteres';
    }

    if (enderecoData.obs && enderecoData.obs.length > 255) {
      newErrors.obs = 'Observações devem ter no máximo 255 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const dadosParaEnviar = {
        ...formData,
        endereco: enderecoData
      };
      
      console.log('[NovoClienteModal] Dados do formulário:', JSON.stringify(dadosParaEnviar, null, 2));
      
      // Salvar cliente e obter o ID
      const clienteResponse = await onSave(dadosParaEnviar);
      console.log('[NovoClienteModal] Resposta do cliente:', clienteResponse);
      console.log('[NovoClienteModal] Pets para cadastrar:', petsData.length);
      
      // Se há pets para cadastrar, temos o ID do cliente E é pessoa física
      if (petsData.length > 0 && formData.tipo_cliente === 'PF') {
        console.log('[NovoClienteModal] Verificando resposta do cliente...');
        console.log('[NovoClienteModal] clienteResponse:', clienteResponse);
        console.log('[NovoClienteModal] typeof clienteResponse:', typeof clienteResponse);
        console.log('[NovoClienteModal] has id:', clienteResponse && typeof clienteResponse === 'object' && 'id' in clienteResponse);
        
        if (clienteResponse && typeof clienteResponse === 'object' && 'id' in clienteResponse) {
          console.log('[NovoClienteModal] Cadastrando pets para cliente ID:', clienteResponse.id);
          
          // Cadastrar cada pet
          for (const pet of petsData) {
            if (pet.nome_pet.trim()) { // Só cadastra se tem nome
              console.log('[NovoClienteModal] Cadastrando pet:', pet);
              try {
                const petResponse = await petsService.createPet({
                  cliente_id: clienteResponse.id as number,
                  ...pet
                });
                console.log('[NovoClienteModal] Pet cadastrado com sucesso:', petResponse);
              } catch (petError) {
                console.error('[NovoClienteModal] Erro ao cadastrar pet:', petError);
                throw petError;
              }
            }
          }
        } else {
          console.warn('[NovoClienteModal] Não foi possível obter ID do cliente para cadastrar pets');
          console.warn('[NovoClienteModal] clienteResponse recebido:', clienteResponse);
        }
      }
      
      // Mostrar mensagem de sucesso
      setShowSuccess(true);
      
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleEnderecoChange = (field: string, value: string) => {
    setEnderecoData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  // Função para buscar CEP
  const buscarCEP = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) {
      return;
    }

    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setEnderecoData(prev => ({
          ...prev,
          cidade: data.localidade || '',
          estado: data.uf || '',
          bairro: data.bairro || '',
          logradouro: data.logradouro || ''
        }));
        
        // Limpar erros dos campos preenchidos automaticamente
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.cidade;
          delete newErrors.estado;
          delete newErrors.bairro;
          delete newErrors.logradouro;
          return newErrors;
        });
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    } finally {
      setLoadingCep(false);
    }
  };

  // Buscar CEP quando o campo for preenchido
  useEffect(() => {
    if (enderecoData.cep.replace(/\D/g, '').length === 8) {
      buscarCEP(enderecoData.cep);
    }
  }, [enderecoData.cep]);

  // Funções para gerenciar pets
  const handlePetInputChange = (field: string, value: string | number) => {
    setCurrentPet(prev => ({ ...prev, [field]: value }));
  };

  const addPet = () => {
    if (currentPet.nome_pet.trim()) {
      setPetsData(prev => [...prev, currentPet]);
      setCurrentPet({
        nome_pet: '',
        especie: '',
        raca: '',
        porte: '',
        data_aniversario: '',
        idade: 0
      });
    }
  };

  const removePet = (index: number) => {
    setPetsData(prev => prev.filter((_, i) => i !== index));
  };

  // Calcular idade automaticamente baseado na data de aniversário
  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Atualizar idade quando data de aniversário mudar
  useEffect(() => {
    if (currentPet.data_aniversario) {
      const idade = calculateAge(currentPet.data_aniversario);
      setCurrentPet(prev => ({ ...prev, idade }));
    }
    // Se não há data de aniversário, não alterar a idade (permite edição manual)
  }, [currentPet.data_aniversario]);

  // Resetar tab ativa e limpar dados de pets quando tipo de cliente mudar para PJ
  useEffect(() => {
    if (formData.tipo_cliente === 'PJ') {
      if (activeTab === 'pets') {
        setActiveTab('cliente');
      }
      // Limpar dados de pets para PJ
      setPetsData([]);
      setCurrentPet({
        nome_pet: '',
        data_aniversario: '',
        especie: '',
        raca: '',
        porte: '',
        idade: 0
      });
    }
  }, [formData.tipo_cliente, activeTab]);



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl border border-gray-100 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Novo Cliente
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            <button
              type="button"
              onClick={() => setActiveTab('cliente')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'cliente'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Dados do Cliente
            </button>
            {/* Tab de Pets - Apenas para Pessoa Física */}
            {formData.tipo_cliente === 'PF' && (
              <button
                type="button"
                onClick={() => setActiveTab('pets')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'pets'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Heart className="w-4 h-4 inline mr-2" />
                Pets ({petsData.length})
              </button>
            )}
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Aba de Dados do Cliente */}
            {activeTab === 'cliente' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tipo de Cliente */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Tipo de Cliente *
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="tipo_cliente"
                    value="PF"
                    checked={formData.tipo_cliente === 'PF'}
                    onChange={(e) => handleInputChange('tipo_cliente', e.target.value)}
                    className="mr-2 text-orange-500 focus:ring-orange-500"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm text-gray-700">Pessoa Física</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="tipo_cliente"
                    value="PJ"
                    checked={formData.tipo_cliente === 'PJ'}
                    onChange={(e) => handleInputChange('tipo_cliente', e.target.value)}
                    className="mr-2 text-orange-500 focus:ring-orange-500"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm text-gray-700">Pessoa Jurídica</span>
                </label>
              </div>
              {errors.tipo_cliente && (
                <p className="mt-1 text-sm text-red-600">{errors.tipo_cliente}</p>
              )}
            </div>

            {/* Nome do Cliente */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Nome do Cliente *
              </label>
              <input
                type="text"
                value={formData.nome_cliente}
                onChange={(e) => handleInputChange('nome_cliente', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.nome_cliente ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                }`}
                placeholder="João Silva"
                disabled={isSubmitting}
              />
              {errors.nome_cliente && (
                <p className="mt-1 text-sm text-red-600">{errors.nome_cliente}</p>
              )}
            </div>

            {/* Número de Celular */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Número de Celular *
              </label>
              <input
                type="text"
                value={formatPhone(formData.numero_celular)}
                onChange={(e) => handleInputChange('numero_celular', e.target.value.replace(/\D/g, ''))}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.numero_celular ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                }`}
                placeholder="(11) 99999-9999"
                maxLength={15}
                disabled={isSubmitting}
              />
              {errors.numero_celular && (
                <p className="mt-1 text-sm text-red-600">{errors.numero_celular}</p>
              )}
            </div>

            {/* Sexo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Sexo *
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="sexo"
                    value="M"
                    checked={formData.sexo === 'M'}
                    onChange={(e) => handleInputChange('sexo', e.target.value)}
                    className="mr-2 text-orange-500 focus:ring-orange-500"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm text-gray-700">Masculino</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="sexo"
                    value="F"
                    checked={formData.sexo === 'F'}
                    onChange={(e) => handleInputChange('sexo', e.target.value)}
                    className="mr-2 text-orange-500 focus:ring-orange-500"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm text-gray-700">Feminino</span>
                </label>
              </div>
              {errors.sexo && (
                <p className="mt-1 text-sm text-red-600">{errors.sexo}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                }`}
                placeholder="joao@email.com"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Data de Nascimento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Data de Nascimento
              </label>
              <input
                type="date"
                value={formData.data_nascimento}
                onChange={(e) => handleInputChange('data_nascimento', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.data_nascimento ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                }`}
                disabled={isSubmitting}
              />
              {errors.data_nascimento && (
                <p className="mt-1 text-sm text-red-600">{errors.data_nascimento}</p>
              )}
            </div>

            {/* Seção de Endereço */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
                <MapPin className="w-5 h-5 inline mr-2" />
                Endereço
              </h3>
            </div>

            {/* CEP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                CEP *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formatCEP(enderecoData.cep)}
                  onChange={(e) => handleEnderecoChange('cep', e.target.value.replace(/\D/g, ''))}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    errors.cep ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                  }`}
                  placeholder="00000-000"
                  maxLength={9}
                  disabled={isSubmitting || loadingCep}
                />
                {loadingCep && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                  </div>
                )}
              </div>
              {errors.cep && (
                <p className="mt-1 text-sm text-red-600">{errors.cep}</p>
              )}
            </div>

            {/* Cidade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cidade *
              </label>
              <input
                type="text"
                value={enderecoData.cidade}
                onChange={(e) => handleEnderecoChange('cidade', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.cidade ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                }`}
                placeholder="São Paulo"
                disabled={isSubmitting}
              />
              {errors.cidade && (
                <p className="mt-1 text-sm text-red-600">{errors.cidade}</p>
              )}
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado *
              </label>
              <input
                type="text"
                value={enderecoData.estado}
                onChange={(e) => handleEnderecoChange('estado', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.estado ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                }`}
                placeholder="SP"
                disabled={isSubmitting}
              />
              {errors.estado && (
                <p className="mt-1 text-sm text-red-600">{errors.estado}</p>
              )}
            </div>

            {/* Bairro */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bairro *
              </label>
              <input
                type="text"
                value={enderecoData.bairro}
                onChange={(e) => handleEnderecoChange('bairro', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.bairro ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                }`}
                placeholder="Centro"
                disabled={isSubmitting}
              />
              {errors.bairro && (
                <p className="mt-1 text-sm text-red-600">{errors.bairro}</p>
              )}
            </div>

            {/* Logradouro */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logradouro *
              </label>
              <input
                type="text"
                value={enderecoData.logradouro}
                onChange={(e) => handleEnderecoChange('logradouro', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.logradouro ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                }`}
                placeholder="Rua das Flores"
                disabled={isSubmitting}
              />
              {errors.logradouro && (
                <p className="mt-1 text-sm text-red-600">{errors.logradouro}</p>
              )}
            </div>

            {/* Número */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número *
              </label>
              <input
                type="text"
                value={enderecoData.numero}
                onChange={(e) => handleEnderecoChange('numero', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.numero ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                }`}
                placeholder="123"
                disabled={isSubmitting}
              />
              {errors.numero && (
                <p className="mt-1 text-sm text-red-600">{errors.numero}</p>
              )}
            </div>

            {/* Complemento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complemento
              </label>
              <input
                type="text"
                value={enderecoData.complemento}
                onChange={(e) => handleEnderecoChange('complemento', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.complemento ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                }`}
                placeholder="Apto 45"
                disabled={isSubmitting}
              />
              {errors.complemento && (
                <p className="mt-1 text-sm text-red-600">{errors.complemento}</p>
              )}
            </div>

            {/* Observações */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Observações
              </label>
              <textarea
                value={enderecoData.obs}
                onChange={(e) => handleEnderecoChange('obs', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.obs ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                }`}
                placeholder="Próximo ao mercado"
                rows={3}
                disabled={isSubmitting}
              />
              {errors.obs && (
                <p className="mt-1 text-sm text-red-600">{errors.obs}</p>
              )}
            </div>
              </div>
            )}

            {/* Aba de Pets - Apenas para Pessoa Física */}
            {activeTab === 'pets' && formData.tipo_cliente === 'PF' && (
              <div className="space-y-6">
                <div className="text-center">
                  <Heart className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Pets do Cliente</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Adicione informações sobre os pets do cliente (opcional)
                  </p>
                </div>

                {/* Formulário de Pet */}
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Adicionar Pet</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nome do Pet */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Pet
                      </label>
                      <input
                        type="text"
                        value={currentPet.nome_pet}
                        onChange={(e) => handlePetInputChange('nome_pet', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Rex, Mimi, etc."
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Espécie */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Espécie
                      </label>
                      <select
                        value={currentPet.especie}
                        onChange={(e) => handlePetInputChange('especie', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        disabled={isSubmitting}
                      >
                        <option value="">Selecione a espécie</option>
                        <option value="Cachorro">Cachorro</option>
                        <option value="Gato">Gato</option>
                        <option value="Pássaro">Pássaro</option>
                        <option value="Peixe">Peixe</option>
                        <option value="Hamster">Hamster</option>
                        <option value="Coelho">Coelho</option>
                        <option value="Outro">Outro</option>
                      </select>
                    </div>

                    {/* Raça */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Raça
                      </label>
                      <input
                        type="text"
                        value={currentPet.raca}
                        onChange={(e) => handlePetInputChange('raca', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Golden Retriever, SRD, etc."
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Porte */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Porte
                      </label>
                      <select
                        value={currentPet.porte}
                        onChange={(e) => handlePetInputChange('porte', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        disabled={isSubmitting}
                      >
                        <option value="">Selecione o porte</option>
                        <option value="Pequeno">Pequeno</option>
                        <option value="Médio">Médio</option>
                        <option value="Grande">Grande</option>
                        <option value="Gigante">Gigante</option>
                      </select>
                    </div>

                    {/* Data de Aniversário */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data de Aniversário
                      </label>
                      <input
                        type="date"
                        value={currentPet.data_aniversario}
                        onChange={(e) => handlePetInputChange('data_aniversario', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Idade */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Idade (anos)
                        {currentPet.data_aniversario && (
                          <span className="text-xs text-gray-500 ml-1">(calculado automaticamente)</span>
                        )}
                      </label>
                      <input
                        type="number"
                        value={currentPet.idade}
                        onChange={(e) => handlePetInputChange('idade', parseInt(e.target.value) || 0)}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          currentPet.data_aniversario 
                            ? 'bg-gray-100 text-gray-600' 
                            : 'bg-white text-gray-900'
                        }`}
                        disabled={!!currentPet.data_aniversario || isSubmitting}
                        placeholder={currentPet.data_aniversario ? "Calculado automaticamente" : "Digite a idade"}
                        min="0"
                        max="30"
                      />
                      {!currentPet.data_aniversario && (
                        <p className="text-xs text-gray-500 mt-1">
                          Preencha a data de aniversário para cálculo automático ou digite a idade manualmente
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={addPet}
                    disabled={!currentPet.nome_pet.trim() || isSubmitting}
                    className="w-full mt-4 px-4 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Pet</span>
                  </button>
                </div>

                {/* Lista de Pets Adicionados */}
                {petsData.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-md font-semibold text-gray-900">Pets Adicionados ({petsData.length})</h4>
                    <div className="space-y-3">
                      {petsData.map((pet, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                              <Heart className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-900">{pet.nome_pet}</h5>
                              <p className="text-sm text-gray-500">
                                {pet.especie} • {pet.raca} • {pet.porte} • {pet.idade} anos
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removePet(index)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            disabled={isSubmitting}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          {/* Mensagem de Sucesso */}
          {showSuccess && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Cliente criado com sucesso!
                  </p>
                  <p className="text-sm text-green-600">
                    Você pode fechar esta modal quando desejar.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium px-4 py-3 rounded-xl transition-colors duration-200"
              disabled={isSubmitting}
            >
              {showSuccess ? 'Fechar' : 'Cancelar'}
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium px-4 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || showSuccess}
            >
              {isSubmitting ? 'Salvando...' : showSuccess ? 'Cliente Criado!' : 'Criar Cliente'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}