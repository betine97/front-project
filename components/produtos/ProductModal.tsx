'use client'

import React, { useState, useEffect } from 'react'
import { X, Save, Package } from 'lucide-react'

interface Product {
  id: string
  name: string
  category: string
  price: number
  cost: number
  stock: number
  minStock: number
  sku: string
  status: 'active' | 'inactive' | 'out_of_stock'
  image?: string
  description?: string
  supplier?: string
  lastSale?: string
  totalSales: number
  targetAudience?: string
  solves?: string
  benefits?: string[]
  animalTypes?: string[]
}

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  onSave: (product: Product) => void
}

export const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product, onSave }) => {
  const [formData, setFormData] = useState<Product>({
    id: '',
    name: '',
    category: '',
    price: 0,
    cost: 0,
    stock: 0,
    minStock: 0,
    sku: '',
    status: 'active',
    totalSales: 0,
    supplier: '',
    targetAudience: '',
    solves: '',
    benefits: [],
    animalTypes: []
  })

  useEffect(() => {
    if (product) {
      setFormData(product)
    } else {
      setFormData({
        id: Date.now().toString(),
        name: '',
        category: '',
        price: 0,
        cost: 0,
        stock: 0,
        minStock: 0,
        sku: '',
        status: 'active',
        totalSales: 0,
        supplier: '',
        targetAudience: '',
        solves: '',
        benefits: [],
        animalTypes: []
      })
    }
  }, [product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'cost' || name === 'stock' || name === 'minStock' 
        ? parseFloat(value) || 0 
        : value
    }))
  }

  const handleArrayChange = (field: 'benefits' | 'animalTypes', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim()).filter(Boolean)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[85vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">
                {product ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <p className="text-sm text-neutral-500">
                {product ? `Editando: ${product.name}` : 'Preencha os dados do produto'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-neutral-100 hover:bg-neutral-200 rounded-lg flex items-center justify-center transition-colors duration-200"
          >
            <X className="w-4 h-4 text-neutral-600" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <h3 className="text-base font-medium text-neutral-900 border-b pb-2">Informações Básicas</h3>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Nome do Produto</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Categoria</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Brinquedos">Brinquedos</option>
                    <option value="Higiene">Higiene</option>
                    <option value="Acessórios">Acessórios</option>
                    <option value="Medicamentos">Medicamentos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">SKU</label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Fornecedor/Marca</label>
                  <input
                    type="text"
                    name="supplier"
                    value={formData.supplier || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                    <option value="out_of_stock">Sem Estoque</option>
                  </select>
                </div>
              </div>

              {/* Preços e Estoque */}
              <div className="space-y-4">
                <h3 className="text-base font-medium text-neutral-900 border-b pb-2">Preços e Estoque</h3>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Preço de Venda (R$)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Custo (R$)</label>
                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Estoque Atual</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Estoque Mínimo</label>
                  <input
                    type="number"
                    name="minStock"
                    value={formData.minStock}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Informações Adicionais */}
            <div className="space-y-4">
              <h3 className="text-base font-medium text-neutral-900 border-b pb-2">Informações Adicionais</h3>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Público-alvo</label>
                <input
                  type="text"
                  name="targetAudience"
                  value={formData.targetAudience || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Soluciona</label>
                <input
                  type="text"
                  name="solves"
                  value={formData.solves || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Benefícios (separados por vírgula)</label>
                <input
                  type="text"
                  value={formData.benefits?.join(', ') || ''}
                  onChange={(e) => handleArrayChange('benefits', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Tipos de Animais (separados por vírgula)</label>
                <input
                  type="text"
                  value={formData.animalTypes?.join(', ') || ''}
                  onChange={(e) => handleArrayChange('animalTypes', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Ex: Cães, Gatos, Pequeno porte, Filhotes"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Produto</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}