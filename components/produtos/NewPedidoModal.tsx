'use client'

import React, { useState, useEffect } from 'react'
import { X, Save, ShoppingCart } from 'lucide-react'
import { useFornecedores } from '@/hooks/useFornecedores'
import { useProdutos } from '@/hooks/useProdutos'
import { PedidoCompra, ItemPedido } from '@/types/entities'

interface NewPedidoModalProps {
  isOpen: boolean
  onClose: () => void
  pedido?: PedidoCompra | null
  onSave: (pedido: Omit<PedidoCompra, 'id_pedido'>) => void
}

interface FormItemPedido {
  id: number
  id_produto: number
  quantidade: number
  preco_unitario: number
  subtotal: number
}

interface FormData {
  id_fornecedor: number | ''
  data_pedido: string
  data_entrega: string
  valor_frete: number
  descricao_pedido: string
  status: string
  itens: FormItemPedido[]
}

export const NewPedidoModal: React.FC<NewPedidoModalProps> = ({ isOpen, onClose, pedido, onSave }) => {
  const { fornecedores = [] } = useFornecedores()
  const { produtos = [] } = useProdutos()
  
  const [formData, setFormData] = useState<FormData>({
    id_fornecedor: '',
    data_pedido: new Date().toISOString().split('T')[0],
    data_entrega: '',
    valor_frete: 0,
    descricao_pedido: '',
    status: 'pendente',
    itens: []
  })

  useEffect(() => {
    if (pedido) {
      setFormData({
        id_fornecedor: pedido.id_fornecedor,
        data_pedido: pedido.data_pedido.split('T')[0],
        data_entrega: pedido.data_entrega.split('T')[0],
        valor_frete: pedido.valor_frete,
        descricao_pedido: pedido.descricao_pedido,
        status: pedido.status,
        itens: (pedido.itens || []).map(item => ({
          id: item.id,
          id_produto: item.id_produto,
          quantidade: item.quantidade,
          preco_unitario: item.preco_unitario,
          subtotal: item.subtotal
        }))
      })
    } else {
      setFormData({
        id_fornecedor: '',
        data_pedido: new Date().toISOString().split('T')[0],
        data_entrega: '',
        valor_frete: 0,
        descricao_pedido: '',
        status: 'pendente',
        itens: []
      })
    }
  }, [pedido])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'valor_frete' || name === 'id_fornecedor'
        ? parseFloat(value) || (name === 'id_fornecedor' ? '' : 0)
        : value
    }))
  }

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      itens: [...prev.itens, {
        id: Date.now(),
        id_produto: 0,
        quantidade: 1,
        preco_unitario: 0,
        subtotal: 0
      }]
    }))
  }

  const updateItem = (index: number, field: keyof FormItemPedido, value: any) => {
    setFormData(prev => {
      const newItens = [...prev.itens]
      newItens[index] = { ...newItens[index], [field]: value }
      
      // Recalcular subtotal
      if (field === 'quantidade' || field === 'preco_unitario') {
        newItens[index].subtotal = newItens[index].quantidade * newItens[index].preco_unitario
      }
      
      return { ...prev, itens: newItens }
    })
  }

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itens: prev.itens.filter((_, i) => i !== index)
    }))
  }

  const calculateTotal = () => {
    const custoPedido = formData.itens.reduce((sum, item) => sum + item.subtotal, 0)
    return custoPedido + formData.valor_frete
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.id_fornecedor) return
    
    const custoPedido = formData.itens.reduce((sum, item) => sum + item.subtotal, 0)
    const valorTotal = custoPedido + formData.valor_frete
    
    onSave({
      id_fornecedor: formData.id_fornecedor as number,
      data_pedido: formData.data_pedido,
      data_entrega: formData.data_entrega,
      valor_frete: formData.valor_frete,
      custo_pedido: custoPedido,
      valor_total: valorTotal,
      descricao_pedido: formData.descricao_pedido,
      status: formData.status
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[85vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">
                {pedido ? 'Editar Pedido' : 'Novo Pedido de Compra'}
              </h2>
              <p className="text-sm text-neutral-500">
                {pedido ? `Editando pedido #${pedido.id_pedido}` : 'Preencha os dados do pedido'}
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
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Fornecedor</label>
                  <select
                    name="id_fornecedor"
                    value={formData.id_fornecedor}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  >
                    <option value="">Selecione um fornecedor</option>
                    {fornecedores.map(fornecedor => (
                      <option key={fornecedor.id} value={fornecedor.id}>{fornecedor.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Data do Pedido</label>
                  <input
                    type="date"
                    name="data_pedido"
                    value={formData.data_pedido}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Data de Entrega</label>
                  <input
                    type="date"
                    name="data_entrega"
                    value={formData.data_entrega}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="processando">Processando</option>
                    <option value="em_transporte">Em Transporte</option>
                    <option value="entregue">Entregue</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              {/* Valores */}
              <div className="space-y-4">
                <h3 className="text-base font-medium text-neutral-900 border-b pb-2">Valores</h3>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Valor do Frete (R$)</label>
                  <input
                    type="number"
                    name="valor_frete"
                    value={formData.valor_frete}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Custo dos Produtos:</span>
                      <span className="font-medium">R$ {(formData.itens.reduce((sum, item) => sum + item.subtotal, 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frete:</span>
                      <span className="font-medium">R$ {formData.valor_frete.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-base font-semibold border-t pt-2">
                      <span>Total:</span>
                      <span>R$ {calculateTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-4">
              <h3 className="text-base font-medium text-neutral-900 border-b pb-2">Descrição</h3>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Descrição do Pedido</label>
                <textarea
                  name="descricao_pedido"
                  value={formData.descricao_pedido}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Descreva os detalhes do pedido..."
                />
              </div>
            </div>

            {/* Itens do Pedido */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-neutral-900 border-b pb-2">Itens do Pedido</h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors duration-200 text-sm"
                >
                  Adicionar Item
                </button>
              </div>

              {formData.itens.map((item, index) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Produto</label>
                      <select
                        value={item.id_produto}
                        onChange={(e) => updateItem(index, 'id_produto', parseInt(e.target.value))}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                      >
                        <option value={0}>Selecione um produto</option>
                        {produtos.map(produto => (
                          <option key={produto.id} value={produto.id}>{produto.nome_produto}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Quantidade</label>
                      <input
                        type="number"
                        value={item.quantidade}
                        onChange={(e) => updateItem(index, 'quantidade', parseInt(e.target.value) || 0)}
                        min="1"
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Preço Unit. (R$)</label>
                      <input
                        type="number"
                        value={item.preco_unitario}
                        onChange={(e) => updateItem(index, 'preco_unitario', parseFloat(e.target.value) || 0)}
                        step="0.01"
                        min="0"
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                    <div className="flex items-end">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Subtotal</label>
                        <div className="px-2 py-1.5 bg-gray-50 border border-gray-300 rounded text-sm">
                          R$ {item.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="ml-2 px-2 py-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors duration-200 text-sm"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {formData.itens.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhum item adicionado ainda.</p>
                  <p className="text-sm">Clique em "Adicionar Item" para começar.</p>
                </div>
              )}
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
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Pedido</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 