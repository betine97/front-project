'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { BackendTest } from '@/components/debug/BackendTest';

interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  companyName?: string;
  businessCategory?: string;
  businessNiche?: string;
}

interface PasswordCriteria {
  minLength: boolean;
  hasSpecialChar: boolean;
}

export default function LoginPage() {
  const { isLoading, error, login, register, loginWithGoogle, clearError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1 = dados pessoais, 2 = dados da empresa
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    city: '',
    state: '',
    companyName: '',
    businessCategory: '',
    businessNiche: ''
  });

  // Dados de categorias e nichos
  const businessCategories = [
    { value: 'produtos', label: 'Produtos' },
    { value: 'servicos', label: 'Serviços' },
    { value: 'ambos', label: 'Produtos e Serviços' }
  ];

  const businessNiches = {
    produtos: [
      { value: 'vestuario', label: 'Vestuário' },
      { value: 'supermercado', label: 'Supermercado' },
      { value: 'papelaria', label: 'Papelaria' },
      { value: 'farmacia', label: 'Farmácia' },
      { value: 'eletronicos', label: 'Eletrônicos' },
      { value: 'casa-construcao', label: 'Casa e Construção' }
    ],
    servicos: [
      { value: 'consultoria', label: 'Consultoria' },
      { value: 'academia', label: 'Academia' },
      { value: 'beleza', label: 'Beleza e Estética' },
      { value: 'educacao', label: 'Educação' },
      { value: 'saude', label: 'Saúde' },
      { value: 'tecnologia', label: 'Tecnologia' }
    ],
    ambos: [
      { value: 'petshop', label: 'Petshop' },
      { value: 'auto-center', label: 'Auto Center' },
      { value: 'restaurante', label: 'Restaurante' },
      { value: 'hotel', label: 'Hotel e Hospedagem' },
      { value: 'clinica', label: 'Clínica' },
      { value: 'oficina', label: 'Oficina' }
    ]
  };

  const getAvailableNiches = () => {
    if (!formData.businessCategory) return [];
    return businessNiches[formData.businessCategory as keyof typeof businessNiches] || [];
  };

  const [passwordCriteria, setPasswordCriteria] = useState<PasswordCriteria>({
    minLength: false,
    hasSpecialChar: false
  });

  const validatePassword = (password: string): PasswordCriteria => {
    return {
      minLength: password.length >= 6,
      hasSpecialChar: /[!@#$%*]/.test(password)
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value,
      // Reset nicho quando categoria muda
      ...(name === 'businessCategory' ? { businessNiche: '' } : {})
    }));

    if (name === 'password') {
      setPasswordCriteria(validatePassword(value));
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Validar dados do primeiro step
    if (!formData.firstName || !formData.lastName || !formData.city || !formData.state || !formData.email || !formData.password || !formData.confirmPassword) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    if (!isPasswordValid) {
      return;
    }

    setCurrentStep(2);
  };

  const handlePreviousStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (isLogin) {
      await login({
        email: formData.email,
        password: formData.password
      });
    } else {
      // Validar dados da empresa (step 2)
      if (!formData.companyName || !formData.businessCategory || !formData.businessNiche) {
        console.log('=== VALIDAÇÃO STEP 2 FALHOU ===');
        console.log('companyName:', formData.companyName);
        console.log('businessCategory:', formData.businessCategory);
        console.log('businessNiche:', formData.businessNiche);
        return;
      }

      console.log('=== DADOS ANTES DO REGISTRO ===');
      console.log('formData completo:', formData);
      console.log('businessCategory:', formData.businessCategory);
      console.log('businessNiche:', formData.businessNiche);

      const result = await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName!,
        lastName: formData.lastName!,
        city: formData.city!,
        state: formData.state!,
        companyName: formData.companyName!,
        businessCategory: formData.businessCategory!,
        businessNiche: formData.businessNiche!
      });

      if (result.success) {
        setShowSuccess(true);
      }
    }
  };

  const handleGoogleAuth = async () => {
    clearError();
    await loginWithGoogle();
  };

  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            
            <h1 className="text-xl font-bold text-gray-900 mb-3">
              Conta criada com sucesso!
            </h1>
            
            <p className="text-gray-600 text-sm mb-6">
              Agora você pode fazer login com suas credenciais.
            </p>
            
            <button
              onClick={() => {
                setShowSuccess(false);
                setIsLogin(true);
                setFormData({
                  email: formData.email,
                  password: '',
                  confirmPassword: '',
                  firstName: '',
                  lastName: '',
                  city: '',
                  state: '',
                  companyName: '',
                  businessCategory: '',
                  businessNiche: ''
                });
              }}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all"
            >
              Fazer Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className={`w-full ${isLogin ? 'max-w-md' : 'max-w-2xl'}`}>
        <div className="text-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <span className="text-white font-bold text-base">P</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            {isLogin ? 'Bem-vindo de volta!' : 
             currentStep === 1 ? 'Crie sua conta' : 'Dados da sua empresa'}
          </h1>
          <p className="text-gray-600 text-sm">
            {isLogin 
              ? 'Faça login para acessar sua conta' 
              : currentStep === 1 
                ? 'Preencha seus dados pessoais'
                : 'Agora vamos conhecer sua empresa'
            }
          </p>
          
          {/* Indicador de progresso para cadastro */}
          {!isLogin && (
            <div className="flex items-center justify-center mt-4 space-x-2">
              <div className={`w-8 h-1 rounded-full ${currentStep >= 1 ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-1 rounded-full ${currentStep >= 2 ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
            </div>
          )}
        </div>

        <div className={`bg-white rounded-2xl shadow-xl ${isLogin ? 'p-8' : 'p-6'}`}>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {!isLogin && formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">As senhas não coincidem</p>
            </div>
          )}

          <form onSubmit={currentStep === 1 && !isLogin ? handleNextStep : handleSubmit} className={isLogin ? "space-y-4" : "space-y-3"}>
            {!isLogin && currentStep === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Nome
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                        placeholder="Seu nome"
                        required={!isLogin}
                        minLength={2}
                        maxLength={100}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Sobrenome
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                        placeholder="Seu sobrenome"
                        required={!isLogin}
                        minLength={2}
                        maxLength={100}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Cidade
                    </label>
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                        placeholder="Sua cidade"
                        required={!isLogin}
                        minLength={2}
                        maxLength={100}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                        placeholder="Seu estado"
                        required={!isLogin}
                        minLength={2}
                        maxLength={50}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {!isLogin && currentStep === 2 && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Nome da Empresa
                  </label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                      placeholder="Nome da empresa"
                      required={!isLogin}
                      minLength={2}
                      maxLength={100}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Categoria do Negócio
                    </label>
                    <select
                      name="businessCategory"
                      value={formData.businessCategory}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white text-sm"
                      required={!isLogin}
                    >
                      <option value="">Selecione...</option>
                      {businessCategories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Nicho do Negócio
                    </label>
                    <select
                      name="businessNiche"
                      value={formData.businessNiche}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white text-sm"
                      required={!isLogin}
                      disabled={!formData.businessCategory}
                    >
                      <option value="">
                        {formData.businessCategory ? 'Selecione o nicho...' : 'Primeiro selecione a categoria'}
                      </option>
                      {getAvailableNiches().map(niche => (
                        <option key={niche.value} value={niche.value}>
                          {niche.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {(isLogin || (!isLogin && currentStep === 1)) && (
              <>
                <div>
                  <label className={`block font-medium text-gray-700 ${isLogin ? 'text-sm mb-2' : 'text-xs mb-1'}`}>
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${isLogin ? 'w-5 h-5' : 'w-4 h-4'}`} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full ${isLogin ? 'pl-10 pr-4 py-2.5' : 'pl-9 pr-3 py-2'} border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${isLogin ? '' : 'text-sm'}`}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={`block font-medium text-gray-700 ${isLogin ? 'text-sm mb-2' : 'text-xs mb-1'}`}>
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${isLogin ? 'w-5 h-5' : 'w-4 h-4'}`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full ${isLogin ? 'pl-10 pr-12 py-2.5' : 'pl-9 pr-10 py-2'} border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${isLogin ? '' : 'text-sm'}`}
                      placeholder={isLogin ? "Sua senha" : "Senha (mín. 6 chars + !@#$%*)"}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className={`${isLogin ? 'w-5 h-5' : 'w-4 h-4'}`} /> : <Eye className={`${isLogin ? 'w-5 h-5' : 'w-4 h-4'}`} />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Confirmar Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                        placeholder="Confirme sua senha"
                        required={!isLogin}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {!isLogin && formData.password && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="text-xs font-medium text-gray-700 mb-2">Critérios da senha:</h4>
                    <div className="space-y-1">
                      {[
                        { key: 'minLength', text: 'Pelo menos 6 caracteres' },
                        { key: 'hasSpecialChar', text: 'Um caractere especial (!@#$%*)' }
                      ].map(({ key, text }) => (
                        <div key={key} className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                            passwordCriteria[key as keyof PasswordCriteria] 
                              ? 'bg-green-500' 
                              : 'bg-gray-300'
                          }`}>
                            {passwordCriteria[key as keyof PasswordCriteria] && (
                              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span className={`text-xs ${
                            passwordCriteria[key as keyof PasswordCriteria] 
                              ? 'text-green-600' 
                              : 'text-gray-500'
                          }`}>
                            {text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {isLogin && (
              <div className="text-right">
                <Link href="/forgot-password" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                  Esqueceu sua senha?
                </Link>
              </div>
            )}

            {/* Botões de navegação para cadastro em steps */}
            {!isLogin && currentStep === 2 && (
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isLoading ? 'Processando...' : 'Criar Conta'}</span>
                </button>
              </div>
            )}

            {/* Botão único para login e primeiro step do cadastro */}
            {(isLogin || (!isLogin && currentStep === 1)) && (
              <button
                type="submit"
                disabled={isLoading || (!isLogin && (!isPasswordValid || formData.password !== formData.confirmPassword))}
                className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white ${isLogin ? 'py-3' : 'py-2.5'} px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{isLoading ? 'Processando...' : (isLogin ? 'Entrar' : 'Continuar')}</span>
              </button>
            )}

            {/* Botão do Google apenas no login e primeiro step */}
            {(isLogin || (!isLogin && currentStep === 1)) && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">ou</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  className={`w-full bg-white border border-gray-300 text-gray-700 ${isLogin ? 'py-3' : 'py-2.5'} px-4 rounded-lg font-semibold hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continuar com Google</span>
                </button>
              </>
            )}
          </form>

          <div className={`${isLogin ? 'mt-6' : 'mt-4'} text-center`}>
            <p className="text-gray-600">
              {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setCurrentStep(1); // Reset para o primeiro step
                  clearError();
                }}
                className="ml-2 text-orange-600 hover:text-orange-700 font-semibold"
              >
                {isLogin ? 'Cadastre-se' : 'Faça login'}
              </button>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao início</span>
          </Link>
        </div>
      </div>
      
      {process.env.NODE_ENV === 'development' && <BackendTest />}
    </div>
  );
}