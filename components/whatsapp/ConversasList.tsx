'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface Conversa {
  id: string;
  nome: string;
  ultimaMensagem: string;
  horario: string;
  naoLidas: number;
  avatar: string;
  online: boolean;
}

const conversas: Conversa[] = [
  {
    id: '1',
    nome: 'Maria Silva',
    ultimaMensagem: 'Oi, gostaria de saber sobre a ração premium...',
    horario: '14:32',
    naoLidas: 2,
    avatar: 'MS',
    online: true
  },
  {
    id: '2',
    nome: 'João Santos',
    ultimaMensagem: 'Obrigado pela ajuda! Vou passar aí amanhã',
    horario: '13:45',
    naoLidas: 0,
    avatar: 'JS',
    online: false
  },
  {
    id: '3',
    nome: 'Ana Costa',
    ultimaMensagem: 'Vocês têm desconto para compra em quantidade?',
    horario: '12:18',
    naoLidas: 1,
    avatar: 'AC',
    online: true
  },
  {
    id: '4',
    nome: 'Pedro Lima',
    ultimaMensagem: 'Perfeito! Pode separar 3 sacos da Golden',
    horario: '11:55',
    naoLidas: 0,
    avatar: 'PL',
    online: false
  },
  {
    id: '5',
    nome: 'Carla Mendes',
    ultimaMensagem: 'Bom dia! Vocês fazem entrega?',
    horario: '09:30',
    naoLidas: 3,
    avatar: 'CM',
    online: true
  },
  {
    id: '6',
    nome: 'Roberto Alves',
    ultimaMensagem: 'Qual o horário de funcionamento no sábado?',
    horario: '09:15',
    naoLidas: 0,
    avatar: 'RA',
    online: false
  },
  {
    id: '7',
    nome: 'Fernanda Oliveira',
    ultimaMensagem: 'Preciso de ração para filhote de labrador',
    horario: '08:45',
    naoLidas: 2,
    avatar: 'FO',
    online: true
  },
  {
    id: '8',
    nome: 'Carlos Pereira',
    ultimaMensagem: 'Vocês têm brinquedos para gatos?',
    horario: '08:20',
    naoLidas: 1,
    avatar: 'CP',
    online: false
  },
  {
    id: '9',
    nome: 'Juliana Martins',
    ultimaMensagem: 'Oi! Gostaria de agendar um banho e tosa',
    horario: '07:55',
    naoLidas: 0,
    avatar: 'JM',
    online: true
  },
  {
    id: '10',
    nome: 'Ricardo Souza',
    ultimaMensagem: 'Tem alguma promoção de ração esta semana?',
    horario: '07:30',
    naoLidas: 4,
    avatar: 'RS',
    online: false
  },
  {
    id: '11',
    nome: 'Patrícia Rocha',
    ultimaMensagem: 'Meu cachorro não está comendo bem...',
    horario: '07:10',
    naoLidas: 0,
    avatar: 'PR',
    online: true
  },
  {
    id: '12',
    nome: 'Eduardo Silva',
    ultimaMensagem: 'Vocês fazem delivery para Alphaville?',
    horario: '06:45',
    naoLidas: 1,
    avatar: 'ES',
    online: false
  },
  {
    id: '13',
    nome: 'Luciana Santos',
    ultimaMensagem: 'Preciso de uma coleira antipulgas urgente',
    horario: '06:20',
    naoLidas: 2,
    avatar: 'LS',
    online: true
  },
  {
    id: '14',
    nome: 'Marcos Ferreira',
    ultimaMensagem: 'Qual a diferença entre as rações premium?',
    horario: '06:00',
    naoLidas: 0,
    avatar: 'MF',
    online: false
  },
  {
    id: '15',
    nome: 'Beatriz Lima',
    ultimaMensagem: 'Minha gata está grávida, que ração dar?',
    horario: '05:40',
    naoLidas: 3,
    avatar: 'BL',
    online: true
  },
  {
    id: '16',
    nome: 'André Costa',
    ultimaMensagem: 'Vocês têm aquário completo para venda?',
    horario: '05:15',
    naoLidas: 0,
    avatar: 'AC2',
    online: false
  },
  {
    id: '17',
    nome: 'Camila Rodrigues',
    ultimaMensagem: 'Preciso de medicamento para verme',
    horario: '04:50',
    naoLidas: 1,
    avatar: 'CR',
    online: true
  },
  {
    id: '18',
    nome: 'Felipe Barbosa',
    ultimaMensagem: 'Tem ração para pássaros em estoque?',
    horario: '04:25',
    naoLidas: 0,
    avatar: 'FB',
    online: false
  }
];

interface ConversasListProps {
  conversaSelecionada: string | null;
  onSelecionarConversa: (id: string) => void;
}

export function ConversasList({ conversaSelecionada, onSelecionarConversa }: ConversasListProps) {
  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col flex-shrink-0" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div className="px-4 border-b border-gray-200 flex items-center" style={{ minHeight: '77px' }}>
        {/* Search */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar conversas..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Lista de Conversas */}
      <div className="flex-1 overflow-y-auto scrollbar-insights">
        {conversas.map((conversa) => (
          <div
            key={conversa.id}
            onClick={() => onSelecionarConversa(conversa.id)}
            className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
              conversaSelecionada === conversa.id ? 'bg-orange-50 border-l-4 border-l-orange-500' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              {/* Avatar */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {conversa.avatar}
                </div>
                {conversa.online && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>

              {/* Conteúdo */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {conversa.nome}
                  </h3>
                  <span className="text-xs text-gray-500">{conversa.horario}</span>
                </div>
                
                <p className="text-sm text-gray-600 truncate mb-1">
                  {conversa.ultimaMensagem}
                </p>
                
                {conversa.naoLidas > 0 && (
                  <div className="flex justify-end">
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                      {conversa.naoLidas}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}