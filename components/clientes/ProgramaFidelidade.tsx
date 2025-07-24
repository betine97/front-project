'use client';

import React, { useState } from 'react';
import { 
  Gift, 
  Star, 
  Plus, 
  Settings, 
  Trophy, 
  Target, 
  DollarSign, 
  Calendar,
  Users,
  TrendingUp,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

interface CriterioFidelidade {
  id: number;
  nome: string;
  descricao: string;
  pontos: number;
  tipo: 'compra' | 'indicacao' | 'aniversario' | 'avaliacao' | 'personalizado';
  ativo: boolean;
  condicoes?: {
    valorMinimo?: number;
    frequencia?: string;
    limite?: number;
  };
}

interface RecompensaFidelidade {
  id: number;
  nome: string;
  descricao: string;
  pontosNecessarios: number;
  tipo: 'desconto' | 'produto' | 'servico' | 'cashback';
  valor: number;
  ativo: boolean;
  limitePorCliente?: number;
  validadeEmDias?: number;
}

export const ProgramaFidelidade: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'visao-geral' | 'criterios' | 'recompensas' | 'configuracoes'>('visao-geral');
  const [showCriterioModal, setShowCriterioModal] = useState(false);
  const [showRecompensaModal, setShowRecompensaModal] = useState(false);
  const [editingCriterio, setEditingCriterio] = useState<CriterioFidelidade | null>(null);
  const [editingRecompensa, setEditingRecompensa] = useState<RecompensaFidelidade | null>(null);

  // Dados mockados
  const criterios: CriterioFidelidade[] = [
    {
      id: 1,
      nome: 'Compra Realizada',
      descricao: 'Ganhe pontos a cada compra realizada',
      pontos: 10,
      tipo: 'compra',
      ativo: true,
      condicoes: { valorMinimo: 50 }
    },
    {
      id: 2,
      nome: 'Indicação de Amigo',
      descricao: 'Ganhe pontos ao indicar novos clientes',
      pontos: 100,
      tipo: 'indicacao',
      ativo: true,
      condicoes: { limite: 5 }
    },
    {
      id: 3,
      nome: 'Aniversário',
      descricao: 'Pontos especiais no mês do aniversário',
      pontos: 50,
      tipo: 'aniversario',
      ativo: true,
      condicoes: { frequencia: 'anual' }
    }
  ];

  const recompensas: RecompensaFidelidade[] = [
    {
      id: 1,
      nome: 'Desconto 10%',
      descricao: 'Desconto de 10% na próxima compra',
      pontosNecessarios: 100,
      tipo: 'desconto',
      valor: 10,
      ativo: true,
      validadeEmDias: 30
    },
    {
      id: 2,
      nome: 'Produto Grátis',
      descricao: 'Produto selecionado grátis',
      pontosNecessarios: 500,
      tipo: 'produto',
      valor: 0,
      ativo: true,
      limitePorCliente: 1
    },
    {
      id: 3,
      nome: 'Cashback R$ 25',
      descricao: 'Crédito de R$ 25 na conta',
      pontosNecessarios: 250,
      tipo: 'cashback',
      valor: 25,
      ativo: true,
      validadeEmDias: 60
    }
  ];

  const estatisticas = {
    totalClientes: 1250,
    clientesAtivos: 890,
    pontosDistribuidos: 45600,
    recompensasResgatadas: 156,
    taxaEngajamento: 71.2
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'compra': return <DollarSign className="w-4 h-4" />;
      case 'indicacao': return <Users className="w-4 h-4" />;
      case 'aniversario': return <Calendar className="w-4 h-4" />;
      case 'avaliacao': return <Star className="w-4 h-4" />;
      case 'desconto': return <Target className="w-4 h-4" />;
      case 'produto': return <Gift className="w-4 h-4" />;
      case 'servico': return <Settings className="w-4 h-4" />;
      case 'cashback': return <DollarSign className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'compra': return 'green';
      case 'indicacao': return 'blue';
      case 'aniversario': return 'purple';
      case 'avaliacao': return 'orange';
      case 'desconto': return 'red';
      case 'produto': return 'green';
      case 'servico': return 'blue';
      case 'cashback': return 'orange';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="icon-container-metric orange">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Programa de Fidelidade</h3>
            <p className="text-sm text-gray-500">Configure critérios e recompensas para engajar seus clientes</p>
          </div>
        </div>
        <button className="btn-primary flex items-center space-x-2 text-sm px-4 py-2">
          <Settings className="w-4 h-4" />
          <span>Configurar</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'visao-geral', label: 'Visão Geral', icon: TrendingUp },
            { id: 'criterios', label: 'Critérios', icon: Target },
            { id: 'recompensas', label: 'Recompensas', icon: Gift },
            { id: 'configuracoes', label: 'Configurações', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'visao-geral' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="card-metric-modern min-h-[80px]">
              <div className="flex items-center space-x-3">
                <div className="icon-container-metric blue">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{estatisticas.totalClientes}</p>
                  <p className="text-xs text-gray-500">Total Clientes</p>
                </div>
              </div>
            </div>

            <div className="card-metric-modern min-h-[80px]">
              <div className="flex items-center space-x-3">
                <div className="icon-container-metric green">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{estatisticas.clientesAtivos}</p>
                  <p className="text-xs text-gray-500">Clientes Ativos</p>
                </div>
              </div>
            </div>

            <div className="card-metric-modern min-h-[80px]">
              <div className="flex items-center space-x-3">
                <div className="icon-container-metric orange">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{estatisticas.pontosDistribuidos.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Pontos Distribuídos</p>
                </div>
              </div>
            </div>

            <div className="card-metric-modern min-h-[80px]">
              <div className="flex items-center space-x-3">
                <div className="icon-container-metric purple">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{estatisticas.recompensasResgatadas}</p>
                  <p className="text-xs text-gray-500">Recompensas Resgatadas</p>
                </div>
              </div>
            </div>

            <div className="card-metric-modern min-h-[80px]">
              <div className="flex items-center space-x-3">
                <div className="icon-container-metric gray">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{estatisticas.taxaEngajamento}%</p>
                  <p className="text-xs text-gray-500">Taxa Engajamento</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Critérios Ativos</h4>
                <button 
                  onClick={() => setActiveTab('criterios')}
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  Ver todos
                </button>
              </div>
              <div className="space-y-3">
                {criterios.slice(0, 3).map((criterio) => (
                  <div key={criterio.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`icon-container-metric ${getTipoColor(criterio.tipo)}`}>
                        {getTipoIcon(criterio.tipo)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{criterio.nome}</p>
                        <p className="text-xs text-gray-500">{criterio.pontos} pontos</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      criterio.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {criterio.ativo ? 'Ativo' : 'Inativo'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Recompensas Populares</h4>
                <button 
                  onClick={() => setActiveTab('recompensas')}
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  Ver todas
                </button>
              </div>
              <div className="space-y-3">
                {recompensas.slice(0, 3).map((recompensa) => (
                  <div key={recompensa.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`icon-container-metric ${getTipoColor(recompensa.tipo)}`}>
                        {getTipoIcon(recompensa.tipo)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{recompensa.nome}</p>
                        <p className="text-xs text-gray-500">{recompensa.pontosNecessarios} pontos</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      recompensa.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {recompensa.ativo ? 'Ativo' : 'Inativo'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'criterios' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">Critérios de Pontuação</h4>
            <button 
              onClick={() => setShowCriterioModal(true)}
              className="btn-primary flex items-center space-x-2 text-sm px-4 py-2"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Critério</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {criterios.map((criterio) => (
              <div key={criterio.id} className="card p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`icon-container-metric ${getTipoColor(criterio.tipo)}`}>
                      {getTipoIcon(criterio.tipo)}
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">{criterio.nome}</h5>
                      <p className="text-sm text-gray-500">{criterio.pontos} pontos</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{criterio.descricao}</p>
                <div className="flex items-center justify-between">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    criterio.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {criterio.ativo ? 'Ativo' : 'Inativo'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {criterio.condicoes?.valorMinimo && `Min: R$ ${criterio.condicoes.valorMinimo}`}
                    {criterio.condicoes?.limite && `Limite: ${criterio.condicoes.limite}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'recompensas' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">Recompensas Disponíveis</h4>
            <button 
              onClick={() => setShowRecompensaModal(true)}
              className="btn-primary flex items-center space-x-2 text-sm px-4 py-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Recompensa</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recompensas.map((recompensa) => (
              <div key={recompensa.id} className="card p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`icon-container-metric ${getTipoColor(recompensa.tipo)}`}>
                      {getTipoIcon(recompensa.tipo)}
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">{recompensa.nome}</h5>
                      <p className="text-sm text-gray-500">{recompensa.pontosNecessarios} pontos</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{recompensa.descricao}</p>
                <div className="flex items-center justify-between">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    recompensa.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {recompensa.ativo ? 'Ativo' : 'Inativo'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {recompensa.tipo === 'desconto' && `${recompensa.valor}% off`}
                    {recompensa.tipo === 'cashback' && `R$ ${recompensa.valor}`}
                    {recompensa.validadeEmDias && ` • ${recompensa.validadeEmDias}d`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'configuracoes' && (
        <div className="space-y-6">
          <div className="card p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Configurações Gerais</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-gray-900">Programa Ativo</h5>
                  <p className="text-sm text-gray-500">Ativar/desativar o programa de fidelidade</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-gray-900">Notificações por Email</h5>
                  <p className="text-sm text-gray-500">Enviar emails sobre pontos e recompensas</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-gray-900">Expiração de Pontos</h5>
                  <p className="text-sm text-gray-500">Pontos expiram após período de inatividade</p>
                </div>
                <select className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm">
                  <option value="never">Nunca</option>
                  <option value="6">6 meses</option>
                  <option value="12" selected>12 meses</option>
                  <option value="24">24 meses</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showCriterioModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Novo Critério</h2>
              <button
                onClick={() => setShowCriterioModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-900">Em desenvolvimento</h4>
                    <p className="text-sm text-orange-700">
                      Modal de criação de critério será implementado em breve.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCriterioModal(false)}
                  className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium px-4 py-3 rounded-xl transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setShowCriterioModal(false)}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium px-4 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRecompensaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Nova Recompensa</h2>
              <button
                onClick={() => setShowRecompensaModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-900">Em desenvolvimento</h4>
                    <p className="text-sm text-orange-700">
                      Modal de criação de recompensa será implementado em breve.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRecompensaModal(false)}
                  className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium px-4 py-3 rounded-xl transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setShowRecompensaModal(false)}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium px-4 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};