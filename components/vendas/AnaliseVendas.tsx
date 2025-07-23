'use client';

import React, { useState } from 'react';
import { 
  ShoppingCart, 
  TrendingUp, 
  Package, 
  Users, 
  Target,
  DollarSign,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Eye,
  Download
} from 'lucide-react';
import { AnaliseVendas } from '../../types/entities';
import { formatCurrency } from '../../lib/utils';

export function AnaliseVendasComponent() {
  const [activeTab, setActiveTab] = useState<'geral' | 'categorias' | 'upsell' | 'demografico' | 'canais'>('geral');
  const [periodoSelecionado, setPeriodoSelecionado] = useState('30d');

  // Dados mockados para demonstração (valores nulos como solicitado)
  const analiseVendas: AnaliseVendas = {
    ticket_medio_geral: 0,
    quantidade_vendas_total: 0,
    quantidade_produtos_vendidos: 0,
    vendas_por_categoria: {},
    produtos_por_categoria: {},
    vendas_upsell: 0,
    produtos_upsell: 0,
    vendas_crosssell: 0,
    produtos_crosssell: 0,
    vendas_por_genero: {
      masculino: { vendas: 0, ticket_medio: 0 },
      feminino: { vendas: 0, ticket_medio: 0 }
    },
    ticket_medio_por_faixa_idade: {
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46-55': 0,
      '55+': 0
    },
    icp_score: 0,
    recorrencia_por_perfil: {},
    vendas_por_canal: {}
  };

  const MetricCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    color = 'orange',
    trend,
    trendValue 
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: any;
    color?: string;
    trend?: 'up' | 'down';
    trendValue?: string;
  }) => (
    <div className="card-metric-modern min-h-[100px]">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={`icon-container-metric ${color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{title}</p>
            {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
          </div>
        </div>
        {trend && trendValue && (
          <div className={`flex items-center space-x-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            <span className="text-xs font-medium">{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Controles de Período */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: '7d', label: '7 dias' },
            { key: '30d', label: '30 dias' },
            { key: '90d', label: '90 dias' },
            { key: '1y', label: '1 ano' }
          ].map((periodo) => (
            <button
              key={periodo.key}
              onClick={() => setPeriodoSelecionado(periodo.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                periodoSelecionado === periodo.key
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {periodo.label}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <button className="btn-secondary text-sm px-3 py-2 flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
          <button className="btn-secondary text-sm px-3 py-2 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Tabs de Análise */}
      <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1 w-fit">
        {[
          { key: 'geral', label: 'Visão Geral', icon: BarChart3 },
          { key: 'categorias', label: 'Categorias', icon: Package },
          { key: 'upsell', label: 'Up/Cross-sell', icon: TrendingUp },
          { key: 'demografico', label: 'Demográfico', icon: Users },
          { key: 'canais', label: 'Canais', icon: Target }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
              activeTab === tab.key
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Conteúdo das Tabs */}
      {activeTab === 'geral' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Ticket Médio Geral"
            value="R$ 0,00"
            icon={DollarSign}
            color="orange"
            trend="up"
            trendValue="+0%"
          />
          <MetricCard
            title="Vendas Total"
            value="0"
            subtitle="pedidos"
            icon={ShoppingCart}
            color="blue"
            trend="up"
            trendValue="+0%"
          />
          <MetricCard
            title="Produtos Vendidos"
            value="0"
            subtitle="unidades"
            icon={Package}
            color="green"
            trend="up"
            trendValue="+0%"
          />
          <MetricCard
            title="ICP Score"
            value="0%"
            subtitle="Ideal Customer Profile"
            icon={Target}
            color="purple"
            trend="up"
            trendValue="+0%"
          />
        </div>
      )}

      {activeTab === 'categorias' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vendas por Categoria */}
            <div className="card">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">Vendas por Categoria</h3>
                  <Eye className="w-4 h-4 text-gray-400" />
                </div>
                <div className="space-y-3">
                  {Object.keys(analiseVendas.vendas_por_categoria).length === 0 ? (
                    <div className="text-center py-8">
                      <PieChart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Dados em breve</p>
                    </div>
                  ) : (
                    Object.entries(analiseVendas.vendas_por_categoria).map(([categoria, vendas]) => (
                      <div key={categoria} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{categoria}</span>
                        <span className="text-sm font-semibold text-gray-900">{vendas}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Produtos por Categoria */}
            <div className="card">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">Produtos por Categoria</h3>
                  <Eye className="w-4 h-4 text-gray-400" />
                </div>
                <div className="space-y-3">
                  {Object.keys(analiseVendas.produtos_por_categoria).length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Dados em breve</p>
                    </div>
                  ) : (
                    Object.entries(analiseVendas.produtos_por_categoria).map(([categoria, produtos]) => (
                      <div key={categoria} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{categoria}</span>
                        <span className="text-sm font-semibold text-gray-900">{produtos}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'upsell' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Vendas Up-sell"
            value="0"
            subtitle="pedidos"
            icon={TrendingUp}
            color="green"
          />
          <MetricCard
            title="Produtos Up-sell"
            value="0"
            subtitle="unidades"
            icon={Package}
            color="green"
          />
          <MetricCard
            title="Vendas Cross-sell"
            value="0"
            subtitle="pedidos"
            icon={Target}
            color="blue"
          />
          <MetricCard
            title="Produtos Cross-sell"
            value="0"
            subtitle="unidades"
            icon={Package}
            color="blue"
          />
        </div>
      )}

      {activeTab === 'demografico' && (
        <div className="space-y-6">
          {/* Vendas por Gênero */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Vendas por Gênero</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Masculino</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">0 vendas</p>
                      <p className="text-xs text-gray-500">Ticket: R$ 0,00</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Feminino</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">0 vendas</p>
                      <p className="text-xs text-gray-500">Ticket: R$ 0,00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Médio por Faixa Etária */}
            <div className="card">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Ticket Médio por Idade</h3>
                <div className="space-y-3">
                  {Object.entries(analiseVendas.ticket_medio_por_faixa_idade).map(([faixa, ticket]) => (
                    <div key={faixa} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{faixa} anos</span>
                      <span className="text-sm font-semibold text-gray-900">R$ {ticket.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recorrência por Perfil */}
          <div className="card">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Recorrência de Compra por Perfil</h3>
              <div className="text-center py-8">
                <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Dados em breve</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'canais' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <MetricCard
              title="Loja Física"
              value="0%"
              subtitle="das vendas"
              icon={ShoppingCart}
              color="orange"
            />
            <MetricCard
              title="E-commerce"
              value="0%"
              subtitle="das vendas"
              icon={Target}
              color="blue"
            />
            <MetricCard
              title="WhatsApp"
              value="0%"
              subtitle="das vendas"
              icon={Users}
              color="green"
            />
            <MetricCard
              title="Telefone"
              value="0%"
              subtitle="das vendas"
              icon={DollarSign}
              color="purple"
            />
            <MetricCard
              title="Marketplace"
              value="0%"
              subtitle="das vendas"
              icon={Package}
              color="gray"
            />
          </div>

          {/* Gráfico de Canais */}
          <div className="card">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Distribuição por Canal de Venda</h3>
              <div className="text-center py-8">
                <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Dados em breve</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resumo Geral */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">0 Vendas no período</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">R$ 0,00 Faturamento</span>
            </div>
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">0 Produtos vendidos</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-gray-400" />
            <span className="text-sm font-medium text-gray-500">Aguardando dados</span>
          </div>
        </div>
      </div>
    </div>
  );
}