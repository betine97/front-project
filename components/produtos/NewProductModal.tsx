'use client';

import React, { useState } from 'react';
import { Package, Upload, ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { Modal } from '../ui/Modal';

interface ProductFormData {
  nome: string;
  sku: string;
  categoria: string;
  marca: string;
  destinadoPara: string;
  variacao: string;
  precoVenda: string;
  precoCMV: string;
  margem: string;
  estoque: string;
  descricao: string;
  imagem?: File;
}

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (product: ProductFormData) => void;
  editingProduct?: any;
}

const INITIAL_DATA: ProductFormData = {
  nome: '',
  sku: '',
  categoria: '',
  marca: '',
  destinadoPara: '',
  variacao: '',
  precoVenda: '',
  precoCMV: '',
  margem: '',
  estoque: '',
  descricao: '',
};

export function NewProductModal({ isOpen, onClose, onSave, editingProduct }: NewProductModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProductFormData>(INITIAL_DATA);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const totalSteps = 5;

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Gerar SKU automaticamente
      if (field === 'nome' || field === 'marca' || field === 'categoria') {
        updated.sku = generateSKU(updated.nome, updated.marca, updated.categoria);
      }
      
      // Calcular margem automaticamente
      if (field === 'precoVenda' || field === 'precoCMV') {
        const venda = parseFloat(updated.precoVenda) || 0;
        const cmv = parseFloat(updated.precoCMV) || 0;
        if (venda > 0 && cmv > 0) {
          const margem = ((venda - cmv) / venda * 100).toFixed(1);
          updated.margem = margem;
        }
      }
      
      return updated;
    });
  };

  const generateSKU = (nome: string, marca: string, categoria: string) => {
    if (!nome || !marca || !categoria) return '';
    
    const nomeCode = nome.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
    const marcaCode = marca.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
    const categoriaCode = categoria.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
    const randomNum = Math.floor(Math.random() * 999).toString().padStart(3, '0');
    
    return `${nomeCode}-${marcaCode}-${categoriaCode}-${randomNum}`;
  };

  const generateDescription = () => {
    const { nome, marca, categoria, destinadoPara, variacao } = formData;
    if (!nome || !marca || !categoria) return;

    const descriptions = [
      `${nome} da marca ${marca} é ideal para ${destinadoPara.toLowerCase()} ${variacao.toLowerCase()}. Desenvolvido com ingredientes de alta qualidade para proporcionar nutrição completa e balanceada.`,
      `Produto premium ${nome} desenvolvido especialmente para ${destinadoPara.toLowerCase()} ${variacao.toLowerCase()}. A marca ${marca} garante qualidade superior e resultados comprovados.`,
      `${nome} é um produto da categoria ${categoria.toLowerCase()} da renomada marca ${marca}, formulado especificamente para atender as necessidades de ${destinadoPara.toLowerCase()} ${variacao.toLowerCase()}.`
    ];

    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
    setFormData(prev => ({ ...prev, descricao: randomDescription }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        setFormData(prev => ({ ...prev, imagem: file }));
      }
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    handleClose();
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData(INITIAL_DATA);
    setSelectedImage(null);
    onClose();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.nome && formData.marca && formData.categoria;
      case 2:
        return formData.destinadoPara && formData.variacao;
      case 3:
        return formData.precoVenda && formData.precoCMV && formData.estoque;
      case 4:
        return true; // Imagem e descrição são opcionais
      case 5:
        return true; // Resumo
      default:
        return false;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Informações Básicas';
      case 2: return 'Detalhes e SKU';
      case 3: return 'Preços e Estoque';
      case 4: return 'Imagem e Descrição';
      case 5: return 'Resumo do Produto';
      default: return '';
    }
  };



  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="max-w-md mx-auto space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Produto *</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ex: Ração Premium para Cães"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Marca *</label>
              <input
                type="text"
                value={formData.marca}
                onChange={(e) => handleInputChange('marca', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ex: Royal Canin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
              <select
                value={formData.categoria}
                onChange={(e) => handleInputChange('categoria', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Selecione uma categoria</option>
                <option value="Alimentação">Alimentação</option>
                <option value="Brinquedos">Brinquedos</option>
                <option value="Higiene">Higiene</option>
                <option value="Acessórios">Acessórios</option>
                <option value="Saúde">Saúde</option>
                <option value="Lazer">Lazer</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="max-w-md mx-auto space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Destinado Para *</label>
              <select
                value={formData.destinadoPara}
                onChange={(e) => handleInputChange('destinadoPara', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Selecione o público-alvo</option>
                <option value="Cães">Cães</option>
                <option value="Gatos">Gatos</option>
                <option value="Pássaros">Pássaros</option>
                <option value="Peixes">Peixes</option>
                <option value="Roedores">Roedores</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Variação *</label>
              <select
                value={formData.variacao}
                onChange={(e) => handleInputChange('variacao', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Selecione a variação</option>
                <option value="Filhotes">Filhotes</option>
                <option value="Adulto">Adulto</option>
                <option value="Raças Pequenas">Raças Pequenas</option>
                <option value="Raças Grandes">Raças Grandes</option>
                <option value="Sênior">Sênior</option>
              </select>
            </div>
            {formData.sku && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SKU (Gerado Automaticamente)</label>
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-mono text-sm">
                  {formData.sku}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  ✅ SKU gerado automaticamente com base nas informações
                </p>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="max-w-md mx-auto space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preço CMV (Custo) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.precoCMV}
                onChange={(e) => handleInputChange('precoCMV', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ex: 62.93"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preço de Venda *</label>
              <input
                type="number"
                step="0.01"
                value={formData.precoVenda}
                onChange={(e) => handleInputChange('precoVenda', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ex: 89.90"
              />
            </div>
            {formData.margem && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Margem de Lucro (Calculada Automaticamente)</label>
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-semibold text-sm">
                  {formData.margem}%
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  ✅ Margem calculada automaticamente: ((Venda - CMV) / Venda) × 100
                </p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade em Estoque *</label>
              <input
                type="number"
                value={formData.estoque}
                onChange={(e) => handleInputChange('estoque', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ex: 50"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 gap-8 h-full min-h-[300px] items-center">
              {/* Seção de Imagem - Lado Esquerdo */}
              <div className="flex flex-col items-center justify-center text-center space-y-8">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="product-image-upload"
                />
                
                {selectedImage ? (
                  <div className="space-y-4">
                    <div className="w-32 h-32 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                      <img 
                        src={URL.createObjectURL(selectedImage)} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedImage.name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <label 
                      htmlFor="product-image-upload" 
                      className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                      Trocar imagem
                    </label>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <label 
                        htmlFor="product-image-upload" 
                        className="cursor-pointer inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200"
                      >
                        Adicionar imagem
                      </label>
                      <p className="text-xs text-gray-500 mt-3">
                        Formatos aceitos: PNG, JPG, JPEG (opcional)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Seção de Descrição - Lado Direito */}
              <div className="flex flex-col justify-center space-y-6">
                                  <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">Descrição (opcional)</label>
                  <button
                    type="button"
                    onClick={generateDescription}
                    disabled={!formData.nome || !formData.marca || !formData.categoria}
                    className="text-xs px-3 py-1 rounded-full transition-colors duration-200 bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    ✨ Gerar com IA
                  </button>
                </div>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm resize-none"
                  placeholder="Descreva as características do produto... ou use a IA para gerar automaticamente"
                />
                                {formData.descricao && (
                  <p className="text-xs text-green-600 mt-2">
                    ✅ Descrição {formData.descricao.includes('ingredientes de alta qualidade') ? 'gerada pela IA' : 'personalizada'}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Resumo do Produto</h3>
              <p className="text-sm text-gray-500">Revise as informações antes de criar o produto</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-700 mb-1">Nome</p>
                <p className="text-gray-900">{formData.nome}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-700 mb-1">Marca</p>
                <p className="text-gray-900">{formData.marca}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-700 mb-1">Categoria</p>
                <p className="text-gray-900">{formData.categoria}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-700 mb-1">SKU</p>
                <p className="text-gray-900 font-mono text-xs">{formData.sku}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-700 mb-1">Destinado Para</p>
                <p className="text-gray-900">{formData.destinadoPara}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-700 mb-1">Variação</p>
                <p className="text-gray-900">{formData.variacao}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="font-medium text-orange-700 mb-1">Preço CMV</p>
                <p className="text-orange-900">R$ {formData.precoCMV}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="font-medium text-orange-700 mb-1">Preço Venda</p>
                <p className="text-orange-900">R$ {formData.precoVenda}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="font-medium text-blue-700 mb-1">Margem</p>
                <p className="text-blue-900 font-semibold">{formData.margem}%</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="font-medium text-blue-700 mb-1">Estoque</p>
                <p className="text-blue-900">{formData.estoque} unidades</p>
              </div>
            </div>

            {(selectedImage || formData.descricao) && (
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Conteúdo Adicional</h4>
                <div className="grid grid-cols-1 gap-4">
                  {selectedImage && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="font-medium text-green-700 mb-2">Imagem</p>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <img 
                            src={URL.createObjectURL(selectedImage)} 
                            alt="Preview" 
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div>
                          <p className="text-green-900 text-sm font-medium">{selectedImage.name}</p>
                          <p className="text-green-700 text-xs">
                            {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {formData.descricao && (
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="font-medium text-purple-700 mb-2">Descrição</p>
                      <p className="text-purple-900 text-sm leading-relaxed">{formData.descricao}</p>
                      {formData.descricao.includes('ingredientes de alta qualidade') && (
                        <p className="text-purple-600 text-xs mt-2">✨ Gerada com IA</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Botões de Ação */}
            <div className="flex justify-center space-x-4 pt-6">
              <button
                onClick={handleBack}
                className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                <Check className="w-5 h-5 mr-2" />
                Criar Produto
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" showCloseButton={false}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-gray-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{getStepTitle()}</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-8 overflow-hidden flex items-center justify-center">
          <div className="w-full">
            {renderStepContent()}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </button>

          <span className="text-sm text-gray-500">
            {currentStep} de {totalSteps}
          </span>

          {currentStep < 5 && (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                canProceed()
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continuar
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          )}
          {currentStep === 5 && (
            <div className="w-[88px]"></div>
          )}
        </div>
      </div>
    </Modal>
  );
} 