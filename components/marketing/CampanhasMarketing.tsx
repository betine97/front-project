'use client';

import React, { useState } from 'react';
import { 
  Megaphone, 
  Mail, 
  MessageCircle, 
  Smartphone, 
  Share2, 
  Search, 
  Facebook,
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Play,
  Pause,
  TrendingUp,
  Target,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { Campanha } from '../../types/entities';
import { formatCurrency } from '../../lib/utils';
import { useCampanhas } from '../../hooks/useCampanhas';
import { usePublicos } from '../../hooks/usePublicos';
import { NovaCampanhaModal } from './NovaCampanhaModal';
import { CriarCampanhaData } from '../../lib/services/campanhas.service';

export function CampanhasMarketing() {
  const [activeTab, setActiveTab] = useState<'ativas' | 'todas' | 'rascunhos'>('ativas');
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Hook para gerenciar campanhas
  const { campanhas, total, totalPages, loading, error, criarCampanha, deletarCampanha } = useCampanhas();
  
  // Hook para buscar públicos (para mostrar nomes em vez de IDs)
  const { publicos } = usePublicos({ autoFetch: true });

  // Dados mockados para demonstração (manter por enquanto para fallback)
  const campanhasMockadas: Campanha[] = [
    {
      id: 1,
      nome: 'Black Friday Pet 2024',
      descricao: 'Campanha promocional para Black Friday com descontos especiais em produtos pet',
      tipo: 'facebook_ads',
      status: 'ativa',
      data_inicio: '2024-11-20',
      data_fim: '2024-11-30',
      orcamento: 5000,
      gasto_atual: 2350,
      publico_alvo: ['Tutores Domésticos', 'Família Pet Lover'],
      metricas: {
        impressoes: 45000,
        cliques: 1250,
        conversoes: 89,
        ctr: 2.78,
        cpc: 1.88,
        roas: 4.2
      },
      created_at: '2024-11-15',
      updated_at: '2024-11-25'
    },
    {
      id: 2,
      nome: 'Newsletter Semanal',
      descricao: 'Email marketing semanal com dicas de cuidados pet e promoções',
      tipo: 'email',
      status: 'ativa',
      data_inicio: '2024-01-01',
      orcamento: 500,
      gasto_atual: 120,
      publico_alvo: ['Todos os clientes'],
      metricas: {
        impressoes: 8500,
        cliques: 340,
        conversoes: 25,
        ctr: 4.0,
        cpc: 0.35,
        roas: 3.1
      },
      created_at: '2023-12-28',
      updated_at: '2024-11-25'
    },
    {
      id: 3,
      nome: 'WhatsApp Carrinho Abandonado',
      descricao: 'Recuperação de carrinho abandonado via WhatsApp',
      tipo: 'whatsapp',
      status: 'pausada',
      data_inicio: '2024-10-01',
      data_fim: '2024-12-31',
      orcamento: 800,
      gasto_atual: 245,
      publico_alvo: ['Clientes com carrinho abandonado'],
      metricas: {
        impressoes: 1200,
        cliques: 180,
        conversoes: 32,
        ctr: 15.0,
        cpc: 1.36,
        roas: 5.8
      },
      created_at: '2024-09-25',
      updated_at: '2024-11-10'
    },
    {
      id: 4,
      nome: 'Google Ads - Ração Premium',
      descricao: 'Anúncios no Google para produtos de ração premium',
      tipo: 'google_ads',
      status: 'rascunho',
      data_inicio: '2024-12-01',
      data_fim: '2024-12-31',
      orcamento: 3000,
      gasto_atual: 0,
      publico_alvo: ['Pet Shops Locais', 'Criadores Profissionais'],
      metricas: {
        impressoes: 0,
        cliques: 0,
        conversoes: 0,
        ctr: 0,
        cpc: 0,
        roas: 0
      },
      created_at: '2024-11-20',
      updated_at: '2024-11-20'
    }
  ];

  // Usar dados reais se disponíveis, senão usar mockados
  const campanhasParaExibir = campanhas.length > 0 ? campanhas : campanhasMockadas;

  // Função para obter nome do público pelo ID
  const getPublicoNome = (publicoId: number | string): string => {
    const publico = publicos.find(p => p.id === Number(publicoId));
    return publico ? publico.nome : `Público ${publicoId}`;
  };

  // Função para formatar data de forma consistente
  const formatarDataConsistente = (dataString: string): string => {
    if (!dataString) return 'N/A';
    try {
      const date = new Date(dataString);
      const dia = date.getDate().toString().padStart(2, '0');
      const mes = (date.getMonth() + 1).toString().padStart(2, '0');
      const ano = date.getFullYear().toString();
      return `${dia}/${mes}/${ano}`;
    } catch (error) {
      return 'Data inválida';
    }
  };

  const handleCriarCampanha = async (data: CriarCampanhaData, publicosIds?: number[]) => {
    try {
      setModalLoading(true);
      const resposta = await criarCampanha(data, publicosIds);
      setShowModal(false);
      
      // Mostrar mensagem de sucesso com informações sobre públicos
      const mensagemPublicos = publicosIds && publicosIds.length > 0 
        ? ` com ${publicosIds.length} público(s) vinculado(s)`
        : '';
      
      alert(`${resposta.message} (ID: ${resposta.id_campanha})${mensagemPublicos}`);
    } catch (error) {
      console.error('Erro ao criar campanha:', error);
      alert('Erro ao criar campanha. Verifique se a API está rodando em localhost:8080');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeletarCampanha = async (id: number, nome: string) => {
    if (confirm(`Tem certeza que deseja excluir a campanha "${nome}"?`)) {
      try {
        await deletarCampanha(id);
      } catch (error) {
        console.error('Erro ao deletar campanha:', error);
        // O erro já é tratado no hook
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'green';
      case 'pausada': return 'yellow';
      case 'finalizada': return 'blue';
      case 'cancelada': return 'red';
      case 'rascunho': return 'gray';
      default: return 'gray';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ativa': return 'Ativa';
      case 'pausada': return 'Pausada';
      case 'finalizada': return 'Finalizada';
      case 'cancelada': return 'Cancelada';
      case 'rascunho': return 'Rascunho';
      default: return status;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'whatsapp': return <MessageCircle className="w-4 h-4" />;
      case 'sms': return <Smartphone className="w-4 h-4" />;
      case 'social_media': return <Share2 className="w-4 h-4" />;
      case 'google_ads': return <Search className="w-4 h-4" />;
      case 'facebook_ads': return <Facebook className="w-4 h-4" />;
      default: return <Megaphone className="w-4 h-4" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'email': return '#3B82F6';
      case 'whatsapp': return '#25D366';
      case 'sms': return '#8B5CF6';
      case 'social_media': return '#EC4899';
      case 'google_ads': return '#EA4335';
      case 'facebook_ads': return '#1877F2';
      default: return '#6B7280';
    }
  };

  const filteredCampanhas = campanhasParaExibir.filter(campanha => {
    switch (activeTab) {
      case 'ativas': return campanha.status === 'ativa';
      case 'rascunhos': return campanha.status === 'rascunho';
      case 'todas': return true;
      default: return true;
    }
  });

  const totalOrcamento = campanhasParaExibir.reduce((sum, c) => sum + (c.orcamento || 0), 0);
  const totalGasto = campanhasParaExibir.reduce((sum, c) => sum + (c.gasto_atual || 0), 0);
  const campanhasAtivas = campanhasParaExibir.filter(c => c.status === 'ativa').length;
  
  // Calcular ROAS médio com verificação de segurança
  const campanhasComROAS = campanhasParaExibir.filter(c => c.metricas && c.metricas.roas && c.metricas.roas > 0);
  const mediaROAS = campanhasComROAS.length > 0 
    ? campanhasComROAS.reduce((sum, c) => sum + c.metricas.roas, 0) / campanhasComROAS.length 
    : 0;

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-metric-modern min-h-[80px]">
          <div className="flex items-center space-x-3">
            <div className="icon-container-metric orange">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{campanhasAtivas} Campanhas Ativas</p>
            </div>
          </div>
        </div>

        <div className="card-metric-modern min-h-[80px]">
          <div className="flex items-center space-x-3">
            <div className="icon-container-metric blue">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(totalOrcamento)}</p>
              <p className="text-xs text-gray-500">Orçamento Total</p>
            </div>
          </div>
        </div>

        <div className="card-metric-modern min-h-[80px]">
          <div className="flex items-center space-x-3">
            <div className="icon-container-metric green">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{mediaROAS.toFixed(1)}x</p>
              <p className="text-xs text-gray-500">ROAS Médio</p>
            </div>
          </div>
        </div>

        <div className="card-metric-modern min-h-[80px]">
          <div className="flex items-center space-x-3">
            <div className="icon-container-metric purple">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(totalGasto)}</p>
              <p className="text-xs text-gray-500">Gasto Atual</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab('ativas')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeTab === 'ativas'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Play className="w-4 h-4 inline mr-2" />
          Ativas ({campanhasParaExibir.filter(c => c.status === 'ativa').length})
        </button>
        <button
          onClick={() => setActiveTab('rascunhos')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeTab === 'rascunhos'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Edit className="w-4 h-4 inline mr-2" />
          Rascunhos ({campanhasParaExibir.filter(c => c.status === 'rascunho').length})
        </button>
        <button
          onClick={() => setActiveTab('todas')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeTab === 'todas'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Megaphone className="w-4 h-4 inline mr-2" />
          Todas ({campanhasParaExibir.length})
        </button>
      </div>

      {/* Grid de Campanhas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampanhas.map((campanha) => {
          const statusColor = getStatusColor(campanha.status);
          const tipoColor = getTipoColor(campanha.tipo);
          const progressoOrcamento = campanha.orcamento && campanha.orcamento > 0 
            ? ((campanha.gasto_atual || 0) / campanha.orcamento) * 100 
            : 0;

          return (
            <div key={campanha.id} className="card hover:shadow-lg transition-all duration-200">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: tipoColor }}
                    >
                      {getTipoIcon(campanha.tipo)}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{campanha.nome}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span 
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${statusColor}-100 text-${statusColor}-800 border border-${statusColor}-200`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full mr-1.5 bg-${statusColor}-500`} />
                          {getStatusText(campanha.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                      <Eye className="w-3 h-3" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-orange-600 rounded">
                      <Edit className="w-3 h-3" />
                    </button>
                    {campanha.status === 'ativa' ? (
                      <button className="p-1 text-gray-400 hover:text-yellow-600 rounded">
                        <Pause className="w-3 h-3" />
                      </button>
                    ) : campanha.status === 'pausada' ? (
                      <button className="p-1 text-gray-400 hover:text-green-600 rounded">
                        <Play className="w-3 h-3" />
                      </button>
                    ) : null}
                    <button 
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                      onClick={() => handleDeletarCampanha(campanha.id, campanha.nome)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-600 mb-3">{campanha.descricao}</p>

                {/* Métricas */}
                {campanha.status !== 'rascunho' && (
                  <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Impressões</span>
                        <span className="font-semibold text-gray-900">
                          {campanha.metricas?.impressoes ? campanha.metricas.impressoes.toLocaleString() : '0'}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">CTR</span>
                        <span className="font-semibold text-gray-900">
                          {campanha.metricas?.ctr ? campanha.metricas.ctr.toFixed(1) : '0.0'}%
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Conversões</span>
                        <span className="font-semibold text-gray-900">
                          {campanha.metricas?.conversoes || 0}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">ROAS</span>
                        <span className="font-semibold text-green-600">
                          {campanha.metricas?.roas ? campanha.metricas.roas.toFixed(1) : '0.0'}x
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Orçamento */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Orçamento</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(campanha.gasto_atual || 0)} / {formatCurrency(campanha.orcamento || 0)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        progressoOrcamento > 90 ? 'bg-red-500' : 
                        progressoOrcamento > 70 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(progressoOrcamento, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Público-alvo */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-700">Público-alvo:</p>
                  <div className="flex flex-wrap gap-1">
                    {/* Usar públicos vinculados da API se disponíveis, senão usar dados mockados */}
                    {(campanha.publicos_vinculados && campanha.publicos_vinculados.length > 0 ? 
                      campanha.publicos_vinculados : 
                      (campanha.publico_alvo || [])
                    ).slice(0, 2).map((publico, index) => {
                      // Se publico é um número (ID), buscar o nome; se é string, usar diretamente
                      const nomePublico = typeof publico === 'number' ? getPublicoNome(publico) : publico;
                      return (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200"
                        >
                          <Target className="w-3 h-3 mr-1" />
                          {nomePublico}
                        </span>
                      );
                    })}
                    
                    {/* Mostrar "+X mais" baseado nos públicos vinculados ou mockados */}
                    {(() => {
                      const publicosParaExibir = campanha.publicos_vinculados && campanha.publicos_vinculados.length > 0 ? 
                        campanha.publicos_vinculados : 
                        (campanha.publico_alvo || []);
                      
                      if (publicosParaExibir.length > 2) {
                        return <span className="text-xs text-gray-500">+{publicosParaExibir.length - 2} mais</span>;
                      }
                      
                      if (publicosParaExibir.length === 0) {
                        return <span className="text-xs text-gray-400 italic">Nenhum público definido</span>;
                      }
                      
                      return null;
                    })()}
                  </div>
                </div>

                {/* Datas */}
                <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                  <div className="flex items-center justify-between">
                    <span>Início: {formatarDataConsistente(campanha.data_inicio)}</span>
                    {campanha.data_fim && (
                      <span>Fim: {formatarDataConsistente(campanha.data_fim)}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Card para adicionar nova campanha */}
        <div className="card border-2 border-dashed border-gray-200 hover:border-orange-300 transition-colors duration-200">
          <div className="p-4 flex flex-col items-center justify-center h-full min-h-[400px] text-center">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mb-3">
              <Plus className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Nova Campanha</h3>
            <p className="text-xs text-gray-500 mb-3">Crie uma nova campanha de marketing</p>
            <button 
              className="btn-primary text-xs px-3 py-2"
              onClick={() => setShowModal(true)}
            >
              Criar Campanha
            </button>
          </div>
        </div>
      </div>

      {/* Resumo */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Megaphone className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{campanhas.length} Campanhas Total</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {formatCurrency(totalGasto)} de {formatCurrency(totalOrcamento)} gastos
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">ROAS médio: {mediaROAS.toFixed(1)}x</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${campanhasAtivas > 0 ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span className={`text-sm font-medium ${campanhasAtivas > 0 ? 'text-green-600' : 'text-gray-500'}`}>
              {campanhasAtivas > 0 ? 'Campanhas ativas' : 'Nenhuma campanha ativa'}
            </span>
          </div>
        </div>
      </div>

      {/* Modal de Nova Campanha */}
      <NovaCampanhaModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleCriarCampanha}
        loading={modalLoading}
      />
    </div>
  );
}