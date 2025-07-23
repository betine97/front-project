'use client';

import React, { useState } from 'react';
import { 
  Megaphone, 
  Plus, 
  Mail, 
  MessageCircle, 
  Share2, 
  TrendingUp, 
  TrendingDown,
  Target,
  BarChart3,
  Users,
  DollarSign,
  Eye,
  MousePointer
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { CampanhasMarketing } from '../../components/marketing/CampanhasMarketing';
import { Campanha } from '../../types/entities';
import { MESSAGES } from '../../constants/index';
import { formatCurrency } from '../../lib/utils';

export default function MarketingPage() {
  // Estados locais para UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCanal, setSelectedCanal] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showModal, setShowModal] = useState(false);
  const [editingCampanha, setEditingCampanha] = useState<Campanha | null>(null);
  const [selectedCampanha, setSelectedCampanha] = useState<Campanha | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Dados mockados por enquanto (será substituído por hook)
  const campanhas: Campanha[] = [];
  const loading = false;
  const error = null;
  const total = 0;
  const totalPages = 0;

  // Dados para gráficos (valores nulos por enquanto)
  const campanhasParaGraficos = campanhas;

  // Busca em tempo real
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handler para mudança de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Listas únicas para filtros
  const tipos = Array.from(new Set(campanhas.map(c => c.tipo))).filter(Boolean);
  const canais = Array.from(new Set(campanhas.map(c => c.tipo))).filter(Boolean);

  // Handlers
  const handleCreateCampanha = () => {
    setEditingCampanha(null);
    setShowModal(true);
  };

  const handleEditCampanha = (campanha: Campanha) => {
    setEditingCampanha(campanha);
    setShowModal(true);
  };

  const handleDeleteCampanha = async (id: number) => {
    if (confirm(MESSAGES.CONFIRM.DELETE)) {
      try {
        // TODO: Implementar deletar campanha
        console.log('Deletar campanha:', id);
      } catch (error) {
        console.error('Erro ao excluir campanha:', error);
      }
    }
  };

  const handleSaveCampanha = async (campanhaData: Omit<Campanha, 'id'>) => {
    try {
      if (editingCampanha) {
        // TODO: Implementar atualizar campanha
        console.log('Atualizar campanha:', editingCampanha.id, campanhaData);
      } else {
        // TODO: Implementar criar campanha
        console.log('Criar campanha:', campanhaData);
      }
      setShowModal(false);
      setEditingCampanha(null);
    } catch (error) {
      console.error('Erro ao salvar campanha:', error);
    }
  };

  const handleViewCampanha = (campanha: Campanha) => {
    setSelectedCampanha(campanha);
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-full overflow-x-hidden">
        {/* Stats Cards - Estilo ClickUp/Itaú */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric orange">
                <Megaphone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">0 Campanhas Ativas</p>
              </div>
            </div>
          </div>

          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric gray">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">R$ 0,00</p>
                <p className="text-xs text-gray-500">Investimento Total</p>
              </div>
            </div>
          </div>

          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric gray">
                <MousePointer className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-500">Cliques Totais</p>
              </div>
            </div>
          </div>

          <div className="card-metric-modern min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="icon-container-metric gray">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">0.0x</p>
                <p className="text-xs text-gray-500">ROAS Médio</p>
              </div>
            </div>
          </div>
        </div>

        {/* Título da Análise e Action Buttons */}
        <div className="flex items-start justify-between mb-6 mt-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Análise de Performance</h2>
            <p className="text-sm text-gray-500">Insights sobre performance, ROI e efetividade das suas campanhas de marketing por canal e público-alvo.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCreateCampanha}
              className="btn-primary flex items-center space-x-2 text-sm px-4 py-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Campanha</span>
            </button>
          </div>
        </div>

        {/* Seção de Cards Personalizados */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card One - Ocupa 1 coluna */}
            <div className="lg:col-span-1 space-y-6">
              <div className="card w-full h-64" style={{ padding: '16px' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      backgroundColor: '#FF6600', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Performance por Canal</h3>
                      <p className="text-xs text-gray-500">ROI por tipo</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      backgroundColor: '#F3F4F6', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      margin: '0 auto 12px' 
                    }}>
                      <BarChart3 className="w-6 h-6 text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-500">Dados em breve</p>
                  </div>
                </div>
              </div>
              
              <div className="card w-full h-64" style={{ padding: '16px' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      backgroundColor: '#8B5CF6', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Segmentação</h3>
                      <p className="text-xs text-gray-500">Público-alvo</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      backgroundColor: '#F3F4F6', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      margin: '0 auto 12px' 
                    }}>
                      <Target className="w-6 h-6 text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-500">Dados em breve</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Card Two - Ocupa 1 coluna */}
            <div className="lg:col-span-1">
              <div className="card w-full" style={{ padding: '16px', height: '33.5rem' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      backgroundColor: '#28A745', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Conversões</h3>
                      <p className="text-xs text-gray-500">Taxa de conversão</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div style={{ 
                      width: '64px', 
                      height: '64px', 
                      backgroundColor: '#F3F4F6', 
                      borderRadius: '16px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      margin: '0 auto 16px' 
                    }}>
                      <TrendingUp className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-500">Dados em breve</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Card Three - Ocupa 1 coluna */}
            <div className="lg:col-span-1">
              <div className="card w-full" style={{ padding: '16px', height: '33.5rem' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      backgroundColor: '#6C757D', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Alcance</h3>
                      <p className="text-xs text-gray-500">Impressões e reach</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div style={{ 
                      width: '64px', 
                      height: '64px', 
                      backgroundColor: '#F3F4F6', 
                      borderRadius: '16px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      margin: '0 auto 16px' 
                    }}>
                      <Users className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-500">Dados em breve</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção Campanhas de Marketing */}
        <div className="flex items-start justify-between mb-6 mt-12">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Campanhas de Marketing</h2>
            <p className="text-sm text-gray-500">Gerencie suas campanhas, monitore performance e otimize resultados em todos os canais de marketing.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => console.log('Relatório de Performance')}
              className="btn-secondary flex items-center space-x-2 text-sm px-4 py-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Relatório</span>
            </button>
            <button
              onClick={handleCreateCampanha}
              className="btn-primary flex items-center space-x-2 text-sm px-4 py-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Campanha</span>
            </button>
          </div>
        </div>

        {/* Grid de Campanhas */}
        <div className="mb-12">
          <CampanhasMarketing />
        </div>

        {/* Seção Funil de Vendas */}
        <div className="flex items-start justify-between mb-6 mt-12">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Funil de Vendas & Qualificação de Leads</h2>
            <p className="text-sm text-gray-500">Acompanhe o processo completo desde a geração de leads até o fechamento, incluindo qualificação, follow-up e pós-venda.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => console.log('Relatório de Funil')}
              className="btn-secondary flex items-center space-x-2 text-sm px-4 py-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Relatório Funil</span>
            </button>
            <button
              onClick={() => console.log('Configurar Funil')}
              className="btn-primary flex items-center space-x-2 text-sm px-4 py-2"
            >
              <Target className="w-4 h-4" />
              <span>Configurar Funil</span>
            </button>
          </div>
        </div>

        {/* Cards do Funil de Vendas */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Lead Magnet */}
            <div className="card-metric-modern min-h-[100px]">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="icon-container-metric blue">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">0</p>
                  <p className="text-xs text-gray-500">Lead Magnet</p>
                  <p className="text-xs text-gray-400">Capturas</p>
                </div>
              </div>
            </div>

            {/* Lead Frio */}
            <div className="card-metric-modern min-h-[100px]">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="icon-container-metric gray">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">0</p>
                  <p className="text-xs text-gray-500">Lead Frio</p>
                  <p className="text-xs text-gray-400">Sem qualificação</p>
                </div>
              </div>
            </div>

            {/* Lead Quente */}
            <div className="card-metric-modern min-h-[100px]">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="icon-container-metric orange">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">0</p>
                  <p className="text-xs text-gray-500">Lead Quente</p>
                  <p className="text-xs text-gray-400">Engajado</p>
                </div>
              </div>
            </div>

            {/* SQL (Sales Qualified Lead) */}
            <div className="card-metric-modern min-h-[100px]">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="icon-container-metric green">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">0</p>
                  <p className="text-xs text-gray-500">SQL</p>
                  <p className="text-xs text-gray-400">Qualificado</p>
                </div>
              </div>
            </div>

            {/* Conversão */}
            <div className="card-metric-modern min-h-[100px]">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="icon-container-metric purple">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">0</p>
                  <p className="text-xs text-gray-500">Conversão</p>
                  <p className="text-xs text-gray-400">Fechamento</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Métricas do Funil */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card-metric-modern min-h-[80px]">
              <div className="flex items-center space-x-3">
                <div className="icon-container-metric red">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">0%</p>
                  <p className="text-xs text-gray-500">Taxa de Churn</p>
                </div>
              </div>
            </div>

            <div className="card-metric-modern min-h-[80px]">
              <div className="flex items-center space-x-3">
                <div className="icon-container-metric blue">
                  <MousePointer className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">0%</p>
                  <p className="text-xs text-gray-500">CTR Campanhas</p>
                </div>
              </div>
            </div>

            <div className="card-metric-modern min-h-[80px]">
              <div className="flex items-center space-x-3">
                <div className="icon-container-metric green">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">0%</p>
                  <p className="text-xs text-gray-500">Taxa Conversão</p>
                </div>
              </div>
            </div>

            <div className="card-metric-modern min-h-[80px]">
              <div className="flex items-center space-x-3">
                <div className="icon-container-metric orange">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">0</p>
                  <p className="text-xs text-gray-500">Follow-ups Ativos</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seções Detalhadas do Funil */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Qualificação de Leads */}
            <div className="card">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="icon-container-metric blue">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Qualificação de Leads</h3>
                    <p className="text-xs text-gray-500">Etapas de follow-up e qualificação</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-sm text-gray-700">Primeiro Contato</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">0 leads</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Follow-up 1</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">0 leads</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Follow-up 2</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">0 leads</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Qualificado (SQL)</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">0 leads</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pós-venda e Remarketing */}
            <div className="card">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="icon-container-metric purple">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Pós-venda & Remarketing</h3>
                    <p className="text-xs text-gray-500">Retenção e reativação</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Onboarding</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">0 clientes</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Follow-up Pós-venda</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">0 clientes</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Remarketing</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">0 campanhas</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Reativação</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">0 clientes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Título da Seção de Histórico */}
        <div className="flex items-start justify-between mb-6 mt-12">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Histórico de Campanhas</h2>
            <p className="text-sm text-gray-500">Visualize campanhas anteriores, analise resultados e extraia insights para futuras estratégias.</p>
          </div>
        </div>

        {/* Histórico Grid - Estilo Itaú */}
        <div className="card">
          {/* Filtros */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search Bar */}
              <div className="flex-1 min-w-[300px] relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Buscar campanhas..."
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 bg-gray-50 focus:bg-white text-sm"
                  onChange={(e) => handleSearchChange(e.target.value)}
                  value={searchTerm}
                />
              </div>

              {/* Tipo Filter */}
              <select
                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors duration-200 text-sm min-w-[140px]"
                value={selectedTipo}
                onChange={(e) => setSelectedTipo(e.target.value)}
              >
                <option value="">Todos os tipos</option>
                <option value="email">Email Marketing</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="google_ads">Google Ads</option>
                <option value="facebook_ads">Facebook Ads</option>
                <option value="social_media">Redes Sociais</option>
              </select>

              {/* Status Filter */}
              <select
                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors duration-200 text-sm min-w-[120px]"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">Status</option>
                <option value="ativa">Ativa</option>
                <option value="pausada">Pausada</option>
                <option value="finalizada">Finalizada</option>
                <option value="cancelada">Cancelada</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Visualização em grade"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'list'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Visualização em lista"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>

              <span className="text-sm text-gray-500">
                {campanhas.length} {campanhas.length === 1 ? 'campanha' : 'campanhas'}
              </span>
            </div>
          </div>

          {/* Campanhas Grid/List */}
          {campanhas.length === 0 ? (
            <div className="text-center py-12">
              <div className="icon-container orange mx-auto mb-4" style={{ width: '64px', height: '64px' }}>
                <Megaphone className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma campanha encontrada</h4>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm || selectedTipo || selectedStatus
                  ? 'Tente ajustar os filtros ou crie novas campanhas'
                  : 'Comece criando sua primeira campanha de marketing'
                }
              </p>
              <button
                onClick={handleCreateCampanha}
                className="btn-primary flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Criar Campanha</span>
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Grid de campanhas será implementado aqui */}
                <div className="text-center py-8 col-span-full">
                  <p className="text-gray-500">Grid de campanhas será implementado em breve</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4">
              {/* Tabela de campanhas será implementada aqui */}
              <div className="text-center py-8">
                <p className="text-gray-500">Tabela de campanhas será implementada em breve</p>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                    <Megaphone className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingCampanha ? 'Editar Campanha' : 'Nova Campanha'}
                  </h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
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
                        Modal de {editingCampanha ? 'edição' : 'criação'} de campanha será implementado em breve.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium px-4 py-3 rounded-xl transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
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
    </DashboardLayout>
  );
}