'use client';

import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface CancelarPedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  pedidoId: number;
  descricaoPedido: string;
}

export function CancelarPedidoModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  pedidoId, 
  descricaoPedido 
}: CancelarPedidoModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmacaoTexto, setConfirmacaoTexto] = useState('');

  const handleConfirm = async () => {
    if (confirmacaoTexto.toUpperCase() !== 'CANCELAR') {
      alert('Digite "CANCELAR" para confirmar o cancelamento do pedido.');
      return;
    }

    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
      // Limpar o texto de confirmação
      setConfirmacaoTexto('');
    } catch (error) {
      console.error('Erro ao cancelar pedido:', error);
      // O erro será tratado pelo componente pai
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setConfirmacaoTexto('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Cancelar Pedido
              </h2>
              <p className="text-sm text-gray-500">
                Esta ação não pode ser desfeita
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800 mb-1">
                    Atenção: Cancelamento de Pedido
                  </h3>
                  <p className="text-sm text-red-700">
                    Você está prestes a cancelar este pedido. Esta ação não pode ser desfeita.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pedido
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                  #{pedidoId}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                  {descricaoPedido}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800 mb-1">
                  O que acontece quando você cancela?
                </h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• O status do pedido será alterado para "cancelado"</li>
                  <li>• O fornecedor será notificado sobre o cancelamento</li>
                  <li>• Os itens do pedido não serão mais processados</li>
                  <li>• Esta ação não pode ser desfeita</li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Tem certeza de que deseja cancelar este pedido? Digite "CANCELAR" abaixo para confirmar:
          </p>

          <input
            type="text"
            placeholder="Digite CANCELAR para confirmar"
            value={confirmacaoTexto}
            onChange={(e) => setConfirmacaoTexto(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-6"
            id="confirmacao-cancelamento"
            disabled={isLoading}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-100">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
          >
            Manter Pedido
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || confirmacaoTexto.toUpperCase() !== 'CANCELAR'}
            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Cancelando...</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4" />
                <span>Sim, Cancelar Pedido</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}