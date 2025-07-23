'use client';

import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Modal } from '../ui/Modal';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport?: (file: File) => void;
}

export function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (isValidFile(file)) {
        setSelectedFile(file);
        setError(null);
      } else {
        setError('Tipo de arquivo não suportado. Use apenas Excel (.xlsx, .xls) ou CSV (.csv)');
      }
    }
  };

  const isValidFile = (file: File) => {
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'application/csv'
    ];
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    return validTypes.includes(file.type) || validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  };

  const handleImport = () => {
    if (selectedFile && onImport) {
      onImport(selectedFile);
      setSelectedFile(null);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" showCloseButton={false}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Upload className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Importar Produtos</h2>
              <p className="text-sm text-gray-500">Carregue seus dados em massa</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center space-y-6 py-12">
          {/* Upload Button Area */}
          <div className="text-center">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            
            {selectedFile ? (
              <div className="space-y-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div className="flex justify-center space-x-3">
                  <label 
                    htmlFor="file-upload" 
                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200"
                  >
                    Substituir arquivo
                  </label>
                  <button
                    onClick={handleImport}
                    className="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                  >
                    Importar
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <label 
                    htmlFor="file-upload" 
                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200"
                  >
                    Selecionar arquivo
                  </label>
                  <p className="text-xs text-gray-500 mt-3">
                    Arquivos aceitos: Excel (.xlsx, .xls) ou CSV (.csv)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
} 