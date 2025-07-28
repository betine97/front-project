'use client';

import React, { useState } from 'react';
import { MoreVertical, Send, Paperclip, Smile, ToggleLeft, ToggleRight, CreditCard, Truck, UserPlus } from 'lucide-react';

interface Mensagem {
  id: string;
  texto: string;
  horario: string;
  enviada: boolean;
  lida: boolean;
}

const mensagens: Mensagem[] = [
  {
    id: '1',
    texto: 'Oi, boa tarde! Gostaria de saber sobre a ração premium para cães adultos.',
    horario: '14:28',
    enviada: false,
    lida: true
  },
  {
    id: '2',
    texto: 'Oi Maria! Tudo bem? Temos várias opções de ração premium. Qual o porte do seu cãozinho?',
    horario: '14:29',
    enviada: true,
    lida: true
  },
  {
    id: '3',
    texto: 'Ele é de porte médio, tem 3 anos. Queria algo bem nutritivo.',
    horario: '14:30',
    enviada: false,
    lida: true
  },
  {
    id: '4',
    texto: 'Perfeito! Recomendo a Golden Formula para cães adultos porte médio. É super completa e os pets adoram o sabor. Quer que eu separe um saco para você?',
    horario: '14:31',
    enviada: true,
    lida: true
  },
  {
    id: '5',
    texto: 'Qual o preço?',
    horario: '14:32',
    enviada: false,
    lida: false
  }
];

interface ChatAreaProps {
  conversaSelecionada: string | null;
}

export function ChatArea({ conversaSelecionada }: ChatAreaProps) {
  const [novaMensagem, setNovaMensagem] = useState('');
  const [controleAssumido, setControleAssumido] = useState(false);
  const [modalInteracaoAberta, setModalInteracaoAberta] = useState(false);
  const [mensagemSelecionada, setMensagemSelecionada] = useState<Mensagem | null>(null);
  const [textoInteracao, setTextoInteracao] = useState('');

  const handleEnviarMensagem = () => {
    if (novaMensagem.trim()) {
      // Aqui você adicionaria a lógica para enviar a mensagem
      console.log('Enviando mensagem:', novaMensagem);
      setNovaMensagem('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviarMensagem();
    }
  };

  const handleSalvarInteracao = (mensagem: Mensagem) => {
    setMensagemSelecionada(mensagem);
    setTextoInteracao(mensagem.texto);
    setModalInteracaoAberta(true);
  };

  const handleConfirmarInteracao = () => {
    // Aqui você salvaria a interação no backend
    console.log('Interação salva:', textoInteracao);
    setModalInteracaoAberta(false);
    setMensagemSelecionada(null);
    setTextoInteracao('');
  };

  const handleCancelarInteracao = () => {
    setModalInteracaoAberta(false);
    setMensagemSelecionada(null);
    setTextoInteracao('');
  };

  if (!conversaSelecionada) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione uma conversa</h3>
          <p className="text-gray-500">Escolha uma conversa da lista para começar a conversar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white min-w-0" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Header do Chat */}
      <div className="p-4 border-b border-gray-200 bg-white" style={{ minHeight: '77px' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                MS
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <div>
                  <h3 className="font-medium text-gray-900">Maria Silva</h3>
                  <p className="text-sm text-green-600">Online</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setControleAssumido(!controleAssumido)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                      controleAssumido 
                        ? 'bg-white text-orange-600 border-orange-300 hover:bg-orange-50' 
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {controleAssumido ? (
                      <ToggleRight className="w-5 h-5" />
                    ) : (
                      <ToggleLeft className="w-5 h-5" />
                    )}
                    <span>Assumir Controle</span>
                  </button>
                  
                  <button
                    onClick={() => {/* Lógica para criar link de pagamento */}}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border bg-white text-orange-600 border-orange-300 hover:bg-orange-50"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Link Pagamento</span>
                  </button>
                  
                  <button
                    onClick={() => {/* Lógica para calcular frete */}}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border bg-white text-orange-600 border-orange-300 hover:bg-orange-50"
                  >
                    <Truck className="w-5 h-5" />
                    <span>Calcular Frete</span>
                  </button>
                  
                  <button
                    onClick={() => {/* Lógica para adicionar cliente */}}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border bg-white text-orange-600 border-orange-300 hover:bg-orange-50"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Adicionar Cliente</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar-orange bg-gray-50">
        {mensagens.map((mensagem) => (
          <div
            key={mensagem.id}
            className={`flex ${mensagem.enviada ? 'justify-end' : 'justify-start'}`}
          >
            <div
              onClick={() => !mensagem.enviada && handleSalvarInteracao(mensagem)}
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                mensagem.enviada
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-900 border border-gray-200 cursor-pointer hover:border-orange-300 hover:bg-orange-50'
              }`}
            >
              <p className="text-sm">{mensagem.texto}</p>
              <div className={`flex items-center justify-end mt-1 space-x-1 ${
                mensagem.enviada ? 'text-orange-100' : 'text-gray-500'
              }`}>
                <span className="text-xs">{mensagem.horario}</span>
                {mensagem.enviada && (
                  <div className="flex">
                    <span className="text-white text-xs opacity-70">
                      ✓✓
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Indicador de digitação */}
        <div className="flex justify-start">
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Input de Mensagem */}
      <div className="p-6 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors">
            <Paperclip className="w-5 h-5 text-gray-500" />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              value={novaMensagem}
              onChange={(e) => setNovaMensagem(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm leading-relaxed"
              rows={2}
              style={{ minHeight: '60px', maxHeight: '160px' }}
            />
            <button className="absolute right-3 bottom-3 p-1 hover:bg-gray-100 rounded transition-colors">
              <Smile className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          <button
            onClick={handleEnviarMensagem}
            className="p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Modal de Salvar Interação */}
      {modalInteracaoAberta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Salvar Interação</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição da interação:
              </label>
              <textarea
                value={textoInteracao}
                onChange={(e) => setTextoInteracao(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Ex: perguntou sobre palitinhos da marca x"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelarInteracao}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarInteracao}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}