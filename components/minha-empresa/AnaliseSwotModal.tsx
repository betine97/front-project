'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { ChevronLeft, X, CheckCircle } from 'lucide-react';

interface AnaliseSwotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AnaliseSwotModal({ isOpen, onClose }: AnaliseSwotModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const perguntas = [
    {
      id: 1,
      titulo: "Participação de mercado estimada (região)",
      opcoes: [
        "< 5%",
        "5-15%", 
        "15-30%",
        "> 30%",
        "Não sei"
      ]
    },
    {
      id: 2,
      titulo: "Base de clientes ativa",
      opcoes: [
        "< 100",
        "100-499",
        "500-999", 
        "1000-9999",
        "10000+"
      ]
    },
    {
      id: 3,
      titulo: "Principais tipos de cliente",
      opcoes: [
        "Consumidor final (B2C)",
        "Lojas / revendas (B2B)",
        "Governo",
        "Misto"
      ]
    },
    {
      id: 4,
      titulo: "Frequência média de compra do cliente",
      opcoes: [
        "Diária",
        "Semanal",
        "Quinzenal",
        "Mensal",
        "Trimestral+"
      ]
    },
    {
      id: 5,
      titulo: "Recorrência média de compras por cliente/ano",
      opcoes: [
        "1-2 vezes",
        "3-5 vezes",
        "6-10 vezes",
        "> 10 vezes"
      ]
    },
    {
      id: 6,
      titulo: "Ticket médio (R$)",
      opcoes: [
        "< 50",
        "50-99",
        "100-199",
        "200-499",
        "500+"
      ]
    },
    {
      id: 7,
      titulo: "Posicionamento atual (modelo de atuação)",
      opcoes: [
        "Varejo",
        "Atacadista",
        "Distribuidora",
        "Fabricante",
        "E-commerce",
        "Prestadora de Serviços"
      ]
    },
    {
      id: 8,
      titulo: "Segmentos que pretende operar futuramente",
      opcoes: [
        "Varejo",
        "Atacadista", 
        "Distribuidora",
        "Fabricante",
        "E-commerce",
        "Prestadora de Serviços"
      ]
    },
    {
      id: 9,
      titulo: "Número de unidades físicas (lojas / centros)",
      opcoes: [
        "0",
        "1",
        "2-3",
        "4-10",
        "> 10"
      ]
    },
    {
      id: 10,
      titulo: "Área média da loja principal (m²)",
      opcoes: [
        "< 50",
        "50-100",
        "101-300",
        "> 300"
      ]
    },
    {
      id: 11,
      titulo: "Área geográfica atendida",
      opcoes: [
        "Bairro",
        "Cidade",
        "Estado",
        "Região (Sudeste/Norte/...)",
        "Todo o Brasil"
      ]
    },
    {
      id: 12,
      titulo: "Tempo de operação",
      opcoes: [
        "< 1 ano",
        "1-3 anos",
        "3-5 anos",
        "5-10 anos",
        "> 10 anos"
      ]
    }
  ];

  const totalPerguntas = perguntas.length;
  const perguntaAtual = perguntas[currentStep - 1];

  const handleOptionSelect = (opcao: string) => {
    setRespostas(prev => ({
      ...prev,
      [`pergunta${currentStep}`]: opcao
    }));

    // Avança automaticamente para a próxima pergunta
    setTimeout(() => {
      if (currentStep < totalPerguntas) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }, 300);
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Respostas:', respostas);
    setShowSuccess(true);
  };

  const respostaSelecionada = respostas[`pergunta${currentStep}`];

  // Tela de sucesso
  if (showSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={false}>
        <div className="flex flex-col h-full">
          {/* Header com botão X */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div></div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Mensagem de sucesso centralizada */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Respostas salvas com sucesso!
              </h3>
              
              <p className="text-sm text-gray-600 leading-relaxed">
                Dentro de 5 minutos faremos um planejamento estratégico para sua empresa.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={false}>
      <div className="flex flex-col h-full">
        {/* Header minimalista com botão X */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
            )}
            <div>
              <h2 className="text-base font-medium text-gray-900">Análise SWOT</h2>
              <p className="text-xs text-gray-500">{currentStep} de {totalPerguntas}</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Content com posições fixas e escala menor */}
        <div className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            {/* Título fixo com tamanho menor */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 text-center min-h-[40px] flex items-center justify-center px-4">
                {perguntaAtual.titulo}
              </h3>
            </div>
            
            {/* Container de opções com altura menor */}
            <div className="space-y-3 max-w-2xl mx-auto">
              {/* Renderiza sempre 6 slots para manter posições fixas */}
              {Array.from({ length: 6 }, (_, index) => {
                const opcao = perguntaAtual.opcoes[index];
                
                if (!opcao) {
                  // Slot vazio para manter espaçamento
                  return <div key={index} className="h-[44px]" />;
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(opcao)}
                    className={`w-full px-4 py-3 text-left border rounded-md transition-all duration-200 h-[44px] flex items-center text-sm ${
                      respostaSelecionada === opcao
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{opcao}</span>
                      {respostaSelecionada === opcao && (
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}