'use client';

import React, { useState } from 'react';
import { FileText, Lightbulb } from 'lucide-react';
import { AnaliseSwotModal } from './AnaliseSwotModal';

export function AnaliseSwotComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Componente de Análise SWOT */}
      <div className="mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-orange-300 transition-colors duration-200 w-full min-w-[600px]">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <FileText className="w-6 h-6 text-gray-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h5 className="text-base font-semibold text-gray-900">Análise SWOT Completa</h5>
                <span className="text-sm text-gray-500">4 perguntas • 5 min</span>
              </div>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-orange-600 transition-colors duration-200 flex-shrink-0"
            >
              Responder
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnaliseSwotModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}