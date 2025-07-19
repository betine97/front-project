'use client'

import React, { useState, useEffect } from 'react'
import {
  X,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  AlertCircle,
  Eye,
  Send,
  ArrowLeft,
  Check
} from 'lucide-react'

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
  supplier?: string
  totalSales: number
}

interface OrderItem {
  productId: string
  productName: string
  sku: string
  quantity: number
  unitCost: number
  totalCost: number
}

interface NewOrderModalProps {
  isOpen: boolean
  onClose: () => void
  products: Product[]
  onSave: (orderData: any) => void
}

export function NewOrderModal({ isOpen, onClose, products, onSave }: NewOrderModalProps) {
  const [currentStep, setCurrentStep] = useState<'create' | 'summary' | 'sent'>('create')
  const [selectedSupplier, setSelectedSupplier] = useState('')
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0])
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [selectedProductId, setSelectedProductId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [createdOrder, setCreatedOrder] = useState<any>(null)

  // Reset when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('create')
      setSelectedSupplier('')
      setOrderDate(new Date().toISOString().split('T')[0])
      setOrderItems([])
      setSelectedProductId('')
      setQuantity(1)
      setErrors({})
      setCreatedOrder(null)
    }
  }, [isOpen])

  // Obter fornecedores únicos dos produtos
  const suppliers = Array.from(new Set(products.filter(p => p.supplier).map(p => p.supplier!)))

  // Filtrar produtos pelo fornecedor selecionado
  const availableProducts = products.filter(p => p.supplier === selectedSupplier && p.status === 'active')

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.totalCost, 0)
  }

  const handleAddProduct = () => {
    if (!selectedProductId || quantity <= 0) return

    const product = products.find(p => p.id === selectedProductId)
    if (!product) return

    // Verificar se o produto já está na lista
    const existingItemIndex = orderItems.findIndex(item => item.productId === selectedProductId)

    if (existingItemIndex >= 0) {
      // Atualizar quantidade do produto existente
      const updatedItems = [...orderItems]
      updatedItems[existingItemIndex].quantity += quantity
      updatedItems[existingItemIndex].totalCost = updatedItems[existingItemIndex].quantity * product.cost
      setOrderItems(updatedItems)
    } else {
      // Adicionar novo produto
      const newItem: OrderItem = {
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        quantity: quantity,
        unitCost: product.cost,
        totalCost: quantity * product.cost
      }
      setOrderItems([...orderItems, newItem])
    }

    // Resetar seleção
    setSelectedProductId('')
    setQuantity(1)
  }

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveProduct(productId)
      return
    }

    const updatedItems = orderItems.map(item => {
      if (item.productId === productId) {
        return {
          ...item,
          quantity: newQuantity,
          totalCost: newQuantity * item.unitCost
        }
      }
      return item
    })
    setOrderItems(updatedItems)
  }

  const handleRemoveProduct = (productId: string) => {
    setOrderItems(orderItems.filter(item => item.productId !== productId))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!selectedSupplier) {
      newErrors.supplier = 'Fornecedor é obrigatório'
    }

    if (!orderDate) {
      newErrors.orderDate = 'Data do pedido é obrigatória'
    }

    if (orderItems.length === 0) {
      newErrors.items = 'Adicione pelo menos um produto ao pedido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const orderData = {
      id: Date.now().toString(),
      orderNumber: `PED-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      supplier: selectedSupplier,
      orderDate: orderDate,
      status: 'solicitado',
      shippingCost: 0, // Será definido pelo fornecedor
      totalValue: calculateTotal(),
      description: orderItems.map(item => `${item.productName} (${item.quantity} unidades)`).join(', '),
      items: orderItems
    }

    setCreatedOrder(orderData)
    setCurrentStep('summary')
  }

  const handleConfirmOrder = () => {
    if (createdOrder) {
      onSave(createdOrder)
      onClose()
    }
  }

  const handleRequestOrder = () => {
    if (!createdOrder) return

    // Salvar o pedido e ir para tela de confirmação
    onSave(createdOrder)
    setCurrentStep('sent')
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[700px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              {currentStep === 'create' ? (
                <ShoppingCart className="w-6 h-6 text-primary" />
              ) : (
                <Eye className="w-6 h-6 text-primary" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">
                {currentStep === 'create' ? 'Novo Pedido' : 'Resumo do Pedido'}
              </h2>
              <p className="text-sm text-neutral-500">
                {currentStep === 'create'
                  ? 'Criar um novo pedido para fornecedor'
                  : `Pedido ${createdOrder?.orderNumber} - ${createdOrder?.supplier}`
                }
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {currentStep === 'create' ? (
          <>
            <div className="flex flex-1 min-h-0">
              {/* Left Panel - Form */}
              <div className="w-1/2 p-6 border-r border-neutral-100 overflow-y-auto">
                <form onSubmit={handleCreateOrder} className="space-y-6">
                  {/* Fornecedor */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Fornecedor *
                    </label>
                    <select
                      className={`w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${errors.supplier ? 'border-red-300' : ''}`}
                      value={selectedSupplier}
                      onChange={(e) => {
                        setSelectedSupplier(e.target.value)
                        setOrderItems([]) // Limpar itens ao trocar fornecedor
                        setSelectedProductId('')
                        if (errors.supplier) {
                          setErrors(prev => ({ ...prev, supplier: '' }))
                        }
                      }}
                    >
                      <option value="">Selecione um fornecedor</option>
                      {suppliers.map(supplier => (
                        <option key={supplier} value={supplier}>{supplier}</option>
                      ))}
                    </select>
                    {errors.supplier && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.supplier}
                      </p>
                    )}
                  </div>

                  {/* Data do Pedido */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Data do Pedido *
                    </label>
                    <input
                      type="date"
                      className={`w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${errors.orderDate ? 'border-red-300' : ''}`}
                      value={orderDate}
                      onChange={(e) => {
                        setOrderDate(e.target.value)
                        if (errors.orderDate) {
                          setErrors(prev => ({ ...prev, orderDate: '' }))
                        }
                      }}
                    />
                    {errors.orderDate && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.orderDate}
                      </p>
                    )}
                  </div>

                  {/* Adicionar Produtos */}
                  {selectedSupplier && (
                    <div className="space-y-4">
                      <h3 className="font-medium text-neutral-900">Adicionar Produtos</h3>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">
                            Produto
                          </label>
                          <select
                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                          >
                            <option value="">Selecione um produto</option>
                            {availableProducts.map(product => (
                              <option key={product.id} value={product.id}>
                                {product.name} - {formatCurrency(product.cost)}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">
                            Quantidade
                          </label>
                          <input
                            type="number"
                            min="1"
                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddProduct}
                        disabled={!selectedProductId}
                        className="w-full px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Produto
                      </button>
                    </div>
                  )}

                  {errors.items && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.items}
                    </p>
                  )}
                </form>
              </div>

              {/* Right Panel - Order Items */}
              <div className="w-1/2 p-6 flex flex-col">
                <h3 className="font-medium text-neutral-900 mb-4">Itens do Pedido</h3>

                {orderItems.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-neutral-500">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
                      <p>Nenhum produto adicionado</p>
                      <p className="text-sm">Selecione um fornecedor e adicione produtos</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto pr-2">
                      <div className="space-y-3">
                        {orderItems.map((item) => (
                          <div key={item.productId} className="bg-neutral-50 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="font-medium text-neutral-900 text-sm">{item.productName}</h4>
                                <p className="text-xs text-neutral-500">{item.sku}</p>
                              </div>
                              <button
                                onClick={() => handleRemoveProduct(item.productId)}
                                className="p-1 text-neutral-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                                  className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="font-medium text-neutral-900 min-w-[2rem] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                                  className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="text-right">
                                <p className="text-xs text-neutral-500">
                                  {formatCurrency(item.unitCost)} x {item.quantity}
                                </p>
                                <p className="font-semibold text-neutral-900">
                                  {formatCurrency(item.totalCost)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total - Fixed at bottom */}
                    <div className="border-t border-neutral-200 pt-4 mt-4 bg-white">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-neutral-900">Total do Pedido:</span>
                        <span className="text-xl font-bold text-primary">
                          {formatCurrency(calculateTotal())}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">
                        * Valor do frete será definido pelo fornecedor
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-neutral-100">
              <button
                onClick={onClose}
                className="px-4 py-2 text-neutral-600 hover:text-neutral-800 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateOrder}
                disabled={orderItems.length === 0}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver Resumo
              </button>
            </div>
          </>
        ) : currentStep === 'summary' ? (
          <>
            {/* Summary Step - All in White */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Single White Container */}
              <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-neutral-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-neutral-900 mb-1">
                        {createdOrder?.orderNumber}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {createdOrder?.supplier} • {new Date(createdOrder?.orderDate || '').toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">
                        {formatCurrency(createdOrder?.totalValue || 0)}
                      </p>
                      <p className="text-xs text-neutral-500">+ frete a definir</p>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-6 border-b border-neutral-100">
                  <h4 className="font-semibold text-neutral-900 mb-4">Itens do Pedido</h4>
                  <div className="space-y-4">
                    {orderItems.map((item) => (
                      <div key={item.productId} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-b-0">
                        <div className="flex-1">
                          <h5 className="font-medium text-neutral-900">{item.productName}</h5>
                          <p className="text-sm text-neutral-500">{item.sku}</p>
                        </div>
                        <div className="flex items-center space-x-8 text-right">
                          <div>
                            <p className="text-sm text-neutral-500">Qtd</p>
                            <p className="font-medium">{item.quantity} un</p>
                          </div>
                          <div>
                            <p className="text-sm text-neutral-500">Unit.</p>
                            <p className="font-medium">{formatCurrency(item.unitCost)}</p>
                          </div>
                          <div className="min-w-[100px]">
                            <p className="text-sm text-neutral-500">Total</p>
                            <p className="font-bold text-primary">{formatCurrency(item.totalCost)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vendor Contact Info */}
                <div className="p-6">
                  <h4 className="font-medium text-neutral-900 mb-2">Contato do Vendedor</h4>
                  <p className="text-sm text-neutral-600">
                    <strong>João Silva</strong><br />
                    (43) 99671-0860
                  </p>
                </div>
              </div>
            </div>

            {/* Actions for Summary */}
            <div className="flex items-center justify-between p-6 border-t border-neutral-100">
              <button
                onClick={() => setCurrentStep('create')}
                className="flex items-center px-4 py-2 text-neutral-600 hover:text-neutral-800 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </button>
              <button
                onClick={handleRequestOrder}
                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors flex items-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Solicitar Pedido
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Sent Step - Simple Confirmation */}
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  Pedido Solicitado!
                </h3>
                <p className="text-neutral-600">
                  Seu pedido foi enviado ao fornecedor
                </p>
              </div>
            </div>

            {/* Actions for Sent */}
            <div className="flex items-center justify-center p-6 border-t border-neutral-100">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}