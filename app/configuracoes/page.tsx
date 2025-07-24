'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Building, 
  Bell, 
  Shield, 
  Database, 
  Save,
  Eye,
  EyeOff,
  Upload,
  Download,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('geral');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Dados da Empresa
    nomeEmpresa: 'Minha Empresa LTDA',
    cnpj: '12.345.678/0001-90',
    email: 'contato@minhaempresa.com',
    telefone: '(11) 99999-9999',
    endereco: 'Rua das Flores, 123',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567',
    website: 'www.minhaempresa.com',
    
    // Configurações do Sistema
    moeda: 'BRL',
    timezone: 'America/Sao_Paulo',
    idioma: 'pt-BR',
    formatoData: 'DD/MM/YYYY',
    
    // Notificações
    emailNotificacoes: true,
    pushNotificacoes: true,
    notificacaoVendas: true,
    notificacaoEstoque: true,
    notificacaoFinanceiro: true,
    
    // Segurança
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: '',
    autenticacaoDoisFatores: false,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Salvando configurações:', formData);
    alert('Configurações salvas com sucesso!');
  };

  const tabs = [
    { id: 'geral', label: 'Geral', icon: Settings },
    { id: 'empresa', label: 'Empresa', icon: Building },
    { id: 'usuario', label: 'Usuário', icon: User },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
    { id: 'seguranca', label: 'Segurança', icon: Shield },
    { id: 'sistema', label: 'Sistema', icon: Database },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
            <p className="text-gray-600 mt-2">Gerencie as configurações do seu sistema</p>
          </div>

          <div className="flex gap-6">
            {/* Sidebar de Tabs */}
            <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-orange-50 text-orange-600 border border-orange-200 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Conteúdo Principal */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Tab Geral */}
              {activeTab === 'geral' && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Configurações Gerais</h2>
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Moeda Padrão
                        </label>
                        <select
                          value={formData.moeda}
                          onChange={(e) => handleInputChange('moeda', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                        >
                          <option value="BRL">Real Brasileiro (R$)</option>
                          <option value="USD">Dólar Americano ($)</option>
                          <option value="EUR">Euro (€)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Fuso Horário
                        </label>
                        <select
                          value={formData.timezone}
                          onChange={(e) => handleInputChange('timezone', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                        >
                          <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                          <option value="America/New_York">Nova York (GMT-5)</option>
                          <option value="Europe/London">Londres (GMT+0)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Idioma
                        </label>
                        <select
                          value={formData.idioma}
                          onChange={(e) => handleInputChange('idioma', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                        >
                          <option value="pt-BR">Português (Brasil)</option>
                          <option value="en-US">English (US)</option>
                          <option value="es-ES">Español</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Formato de Data
                        </label>
                        <select
                          value={formData.formatoData}
                          onChange={(e) => handleInputChange('formatoData', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                        >
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Empresa */}
              {activeTab === 'empresa' && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Dados da Empresa</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Nome da Empresa
                        </label>
                        <input
                          type="text"
                          value={formData.nomeEmpresa}
                          onChange={(e) => handleInputChange('nomeEmpresa', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          CNPJ
                        </label>
                        <input
                          type="text"
                          value={formData.cnpj}
                          onChange={(e) => handleInputChange('cnpj', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          E-mail
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Telefone
                        </label>
                        <input
                          type="text"
                          value={formData.telefone}
                          onChange={(e) => handleInputChange('telefone', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Endereço
                        </label>
                        <input
                          type="text"
                          value={formData.endereco}
                          onChange={(e) => handleInputChange('endereco', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Cidade
                        </label>
                        <input
                          type="text"
                          value={formData.cidade}
                          onChange={(e) => handleInputChange('cidade', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Estado
                        </label>
                        <input
                          type="text"
                          value={formData.estado}
                          onChange={(e) => handleInputChange('estado', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          CEP
                        </label>
                        <input
                          type="text"
                          value={formData.cep}
                          onChange={(e) => handleInputChange('cep', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Website
                        </label>
                        <input
                          type="text"
                          value={formData.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Usuário */}
              {activeTab === 'usuario' && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Perfil do Usuário</h2>
                  <div className="space-y-8">
                    <div className="flex items-center space-x-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-3xl">JP</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">João Pedro</h3>
                        <p className="text-gray-600 text-lg">Administrador</p>
                        <button className="text-orange-600 hover:text-orange-700 font-medium mt-2">
                          Alterar foto
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Nome Completo
                        </label>
                        <input
                          type="text"
                          defaultValue="João Pedro Silva"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          E-mail
                        </label>
                        <input
                          type="email"
                          defaultValue="joao@minhaempresa.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Telefone
                        </label>
                        <input
                          type="text"
                          defaultValue="(11) 99999-9999"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Cargo
                        </label>
                        <input
                          type="text"
                          defaultValue="Administrador"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Notificações */}
              {activeTab === 'notificacoes' && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Configurações de Notificações</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">Notificações por E-mail</h3>
                        <p className="text-gray-600">Receba notificações importantes por e-mail</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.emailNotificacoes}
                          onChange={(e) => handleInputChange('emailNotificacoes', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">Notificações Push</h3>
                        <p className="text-gray-600">Receba notificações no navegador</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.pushNotificacoes}
                          onChange={(e) => handleInputChange('pushNotificacoes', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">Notificações de Vendas</h3>
                        <p className="text-gray-600">Seja notificado sobre novas vendas</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.notificacaoVendas}
                          onChange={(e) => handleInputChange('notificacaoVendas', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">Notificações de Estoque</h3>
                        <p className="text-gray-600">Alertas sobre estoque baixo</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.notificacaoEstoque}
                          onChange={(e) => handleInputChange('notificacaoEstoque', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">Notificações Financeiras</h3>
                        <p className="text-gray-600">Alertas sobre vencimentos e pagamentos</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.notificacaoFinanceiro}
                          onChange={(e) => handleInputChange('notificacaoFinanceiro', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Segurança */}
              {activeTab === 'seguranca' && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Configurações de Segurança</h2>
                  <div className="space-y-8">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                      <div className="flex items-center">
                        <Shield className="w-6 h-6 text-yellow-600 mr-3" />
                        <h3 className="font-semibold text-yellow-800 text-lg">Alterar Senha</h3>
                      </div>
                      <p className="text-yellow-700 mt-2">
                        Mantenha sua conta segura alterando sua senha regularmente
                      </p>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Senha Atual
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={formData.senhaAtual}
                            onChange={(e) => handleInputChange('senhaAtual', e.target.value)}
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center"
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5 text-gray-400" />
                            ) : (
                              <Eye className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Nova Senha
                        </label>
                        <input
                          type="password"
                          value={formData.novaSenha}
                          onChange={(e) => handleInputChange('novaSenha', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Confirmar Nova Senha
                        </label>
                        <input
                          type="password"
                          value={formData.confirmarSenha}
                          onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">Autenticação de Dois Fatores</h3>
                        <p className="text-gray-600">Adicione uma camada extra de segurança</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.autenticacaoDoisFatores}
                          onChange={(e) => handleInputChange('autenticacaoDoisFatores', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Sistema */}
              {activeTab === 'sistema' && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Configurações do Sistema</h2>
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-6 rounded-xl">
                        <h3 className="font-semibold text-gray-900 mb-3 text-lg">Backup de Dados</h3>
                        <p className="text-gray-600 mb-4">
                          Faça backup dos seus dados regularmente
                        </p>
                        <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2">
                          <Download className="w-5 h-5" />
                          <span>Fazer Backup</span>
                        </button>
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-xl">
                        <h3 className="font-semibold text-gray-900 mb-3 text-lg">Restaurar Dados</h3>
                        <p className="text-gray-600 mb-4">
                          Restaure dados de um backup anterior
                        </p>
                        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                          <Upload className="w-5 h-5" />
                          <span>Restaurar</span>
                        </button>
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-xl">
                        <h3 className="font-semibold text-gray-900 mb-3 text-lg">Limpar Cache</h3>
                        <p className="text-gray-600 mb-4">
                          Limpe o cache para melhorar a performance
                        </p>
                        <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                          <RefreshCw className="w-5 h-5" />
                          <span>Limpar Cache</span>
                        </button>
                      </div>
                      
                      <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                        <h3 className="font-semibold text-red-900 mb-3 text-lg">Zona de Perigo</h3>
                        <p className="text-red-700 mb-4">
                          Ações irreversíveis - use com cuidado
                        </p>
                        <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
                          <Trash2 className="w-5 h-5" />
                          <span>Resetar Sistema</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Botão de Salvar */}
              <div className="border-t border-gray-200 px-8 py-6">
                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2 font-semibold"
                  >
                    <Save className="w-5 h-5" />
                    <span>Salvar Configurações</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}