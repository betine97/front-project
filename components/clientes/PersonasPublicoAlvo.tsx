'use client';

import React, { useState } from 'react';
import { Users, User, Building, MapPin, TrendingUp, Target, Plus, Edit, Trash2, Eye } from 'lucide-react';

interface PublicoAlvo {
  id: string;
  nome: string;
  descricao: string;
  criterios: string[];
  tamanho_estimado: number;
  cor: string;
  created_at: string;
}

interface PersonaData {
  id: string;
  nome: string;
  publico_id: string;
  tipo: 'pessoa_fisica' | 'pessoa_juridica';
  descricao: string;
  caracteristicas: string[];
  localizacao: string;
  percentual: number;
  idade_media?: number;
  renda_media?: string;
  comportamento: string[];
  dores: string[];
  objetivos: string[];
}

export function PersonasPublicoAlvo() {
  const [activeTab, setActiveTab] = useState<'publicos' | 'personas'>('publicos');

  // Dados mockados para demonstração
  const publicos: PublicoAlvo[] = [
    {
      id: '1',
      nome: 'Tutores Domésticos',
      descricao: 'Pessoas que têm pets em casa como companhia',
      criterios: ['Possui pets', 'Renda familiar > R$ 3.000', 'Mora em apartamento/casa'],
      tamanho_estimado: 1200,
      cor: '#FF6600',
      created_at: '2024-01-15'
    },
    {
      id: '2',
      nome: 'Empresários Pet',
      descricao: 'Donos de pet shops e negócios relacionados',
      criterios: ['CNPJ ativo', 'Setor pet', 'Compras recorrentes'],
      tamanho_estimado: 85,
      cor: '#28A745',
      created_at: '2024-01-10'
    }
  ];

  const personas: PersonaData[] = [
    {
      id: '1',
      nome: 'Maria - Família Pet Lover',
      publico_id: '1',
      tipo: 'pessoa_fisica',
      descricao: 'Mãe de família que trata pets como filhos',
      caracteristicas: ['Renda média-alta', 'Pets como família', 'Compras regulares'],
      localizacao: 'Zona Sul/Norte',
      percentual: 45,
      idade_media: 35,
      renda_media: 'R$ 5.000 - R$ 8.000',
      comportamento: ['Pesquisa antes de comprar', 'Prefere qualidade', 'Fiel a marcas'],
      dores: ['Falta de tempo', 'Preços altos', 'Produtos de baixa qualidade'],
      objetivos: ['Pet saudável', 'Praticidade', 'Economia inteligente']
    },
    {
      id: '2',
      nome: 'João - Pet Shop Local',
      publico_id: '2',
      tipo: 'pessoa_juridica',
      descricao: 'Dono de pet shop de bairro',
      caracteristicas: ['Compras em volume', 'Fidelidade à marca', 'Parcerias'],
      localizacao: 'Região Metropolitana',
      percentual: 30,
      comportamento: ['Negocia preços', 'Busca variedade', 'Relacionamento longo prazo'],
      dores: ['Concorrência', 'Margem apertada', 'Sazonalidade'],
      objetivos: ['Aumentar margem', 'Fidelizar clientes', 'Crescer negócio']
    }
  ];

  const getPublicoNome = (publicoId: string) => {
    const publico = publicos.find(p => p.id === publicoId);
    return publico?.nome || 'Público não encontrado';
  };

  const getPersonasByPublico = (publicoId: string) => {
    return personas.filter(p => p.publico_id === publicoId);
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab('publicos')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeTab === 'publicos'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Target className="w-4 h-4 inline mr-2" />
          Públicos-Alvo
        </button>
        <button
          onClick={() => setActiveTab('personas')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeTab === 'personas'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Personas
        </button>
      </div>

      {/* Conteúdo das Tabs */}
      {activeTab === 'publicos' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publicos.map((publico) => (
            <div key={publico.id} className="card hover:shadow-lg transition-all duration-200">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: publico.cor }}
                    >
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{publico.nome}</h3>
                      <p className="text-xs text-gray-500">{publico.tamanho_estimado} clientes</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                      <Eye className="w-3 h-3" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-orange-600 rounded">
                      <Edit className="w-3 h-3" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600 rounded">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-600 mb-3">{publico.descricao}</p>

                <div className="space-y-2 mb-3">
                  <p className="text-xs font-medium text-gray-700">Critérios:</p>
                  <div className="flex flex-wrap gap-1">
                    {publico.criterios.map((criterio, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        {criterio}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Criado em {new Date(publico.created_at).toLocaleDateString('pt-BR')}</span>
                  <span className="font-medium" style={{ color: publico.cor }}>
                    {getPersonasByPublico(publico.id).length} persona{getPersonasByPublico(publico.id).length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Card para adicionar novo público */}
          <div className="card border-2 border-dashed border-gray-200 hover:border-orange-300 transition-colors duration-200">
            <div className="p-4 flex flex-col items-center justify-center h-full min-h-[200px] text-center">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mb-3">
                <Plus className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Novo Público-Alvo</h3>
              <p className="text-xs text-gray-500 mb-3">Defina um novo segmento de clientes</p>
              <button className="btn-primary text-xs px-3 py-2">
                Criar Público
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {personas.map((persona) => (
            <div key={persona.id} className="card hover:shadow-lg transition-all duration-200">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                      {persona.tipo === 'pessoa_fisica' ? (
                        <User className="w-5 h-5 text-orange-600" />
                      ) : (
                        <Building className="w-5 h-5 text-orange-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{persona.nome}</h3>
                      <p className="text-xs text-gray-500">{getPublicoNome(persona.publico_id)}</p>
                      <p className="text-xs text-gray-500">{persona.localizacao}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-bold text-orange-600">{persona.percentual}%</span>
                    <div className="flex items-center space-x-1 ml-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                        <Eye className="w-3 h-3" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-orange-600 rounded">
                        <Edit className="w-3 h-3" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 rounded">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-600 mb-3">{persona.descricao}</p>

                {persona.idade_media && persona.renda_media && (
                  <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                    <div>
                      <span className="font-medium text-gray-700">Idade:</span>
                      <span className="text-gray-600 ml-1">{persona.idade_media} anos</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Renda:</span>
                      <span className="text-gray-600 ml-1">{persona.renda_media}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Comportamentos:</p>
                    <div className="flex flex-wrap gap-1">
                      {persona.comportamento.slice(0, 2).map((comp, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700"
                        >
                          {comp}
                        </span>
                      ))}
                      {persona.comportamento.length > 2 && (
                        <span className="text-xs text-gray-500">+{persona.comportamento.length - 2} mais</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Principais Dores:</p>
                    <div className="flex flex-wrap gap-1">
                      {persona.dores.slice(0, 2).map((dor, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700"
                        >
                          {dor}
                        </span>
                      ))}
                      {persona.dores.length > 2 && (
                        <span className="text-xs text-gray-500">+{persona.dores.length - 2} mais</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Barra de progresso */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">Representatividade</span>
                    <span className="font-semibold text-gray-900">{persona.percentual}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300"
                      style={{ width: `${persona.percentual}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Card para adicionar nova persona */}
          <div className="card border-2 border-dashed border-gray-200 hover:border-orange-300 transition-colors duration-200">
            <div className="p-4 flex flex-col items-center justify-center h-full min-h-[300px] text-center">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mb-3">
                <Plus className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Nova Persona</h3>
              <p className="text-xs text-gray-500 mb-3">Crie uma persona detalhada baseada em um público-alvo</p>
              <button className="btn-primary text-xs px-3 py-2">
                Criar Persona
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resumo */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{publicos.length} Públicos-Alvo</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{personas.length} Personas</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 font-medium">Segmentação ativa</span>
          </div>
        </div>
      </div>
    </div>
  );
}