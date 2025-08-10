'use client';

import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Package, Truck, Calendar, DollarSign, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useProdutosFornecedores } from '../../hooks/useProdutosFornecedores';
import { apiClient } from '../../lib/api/client';

interface ItemPedido {
  id_produto: number;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
}

interface PedidoData {
  id_fornecedor: number;
  data_pedido: string;
  data_entrega: string;
  valor_frete: number;
  custo_pedido: number;
  valor_total: number;
  descricao_pedido: string;
  status: string;
}

interface NovoPedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

export function NovoPedidoModal({ isOpen, onClose, onSave }: NovoPedidoModalProps) {
  // Estados do formulário
  const [selectedProdutoId, setSelectedProdutoId] = useState<number | null>(null);
  const [selectedFornecedorId, setSelectedFornecedorId] = useState<number | null>(null);
  const [quantidade, setQuantidade] = useState<number>(1);
  const [precoUnitario, setPrecoUnitario] = useState<number>(0);
  const [valorFrete, setValorFrete] = useState<number>(0);
  const [descricaoPedido, setDescricaoPedido] = useState<string>('');
  
  // Estados de controle
  const [currentStep, setCurrentStep] = useState<'form' | 'summary'>('form');
  const [isCreating, setIsCreating] = useState(false);
  const [createdPedidoId, setCreatedPedidoId] = useState<number | null>(null);

  // Data atual para o pedido (não editável)
  const dataAtual = new Date().toISOString().split('T')[0];

  // Hook para buscar produtos e fornecedores
  const { 
    produtos, 
    fornecedores, 
    loadingProdutos, 
    loadingFornecedores,
    errorProdutos,
    errorFornecedores
  } = useProdutosFornecedores();

  // Produto selecionado
  const produtoSelecionado = produtos.find(p => p.id_produto === selectedProdutoId);

  // Fornecedores filtrados (todos os ativos)
  const fornecedoresFiltrados = fornecedores.filter(f => f.status === 'Ativo');

  // Produtos filtrados pelo fornecedor selecionado
  const produtosFiltrados = selectedFornecedorId 
    ? produtos.filter(p => p.id_fornecedor === selectedFornecedorId)
    : [];

  // Cálculos
  const custoPedido = quantidade * precoUnitario;
  const valorTotal = custoPedido + valorFrete;

  // Reset form quando modal abre/fecha
  useEffect(() => {
    if (isOpen) {
      setSelectedProdutoId(null);
      setSelectedFornecedorId(null);
      setQuantidade(1);
      setPrecoUnitario(0);
      setValorFrete(0);
      setDescricaoPedido('');
      setCurrentStep('form');
      setIsCreating(false);
      setCreatedPedidoId(null);
    }
  }, [isOpen]);

  // Atualizar preço unitário quando produto é selecionado
  useEffect(() => {
    if (produtoSelecionado) {
      setPrecoUnitario(produtoSelecionado.preco_venda);
    }
  }, [produtoSelecionado]);

  const handleProdutoChange = (produtoId: string) => {
    const id = parseInt(produtoId);
    setSelectedProdutoId(id);
  };

  const handleFornecedorChange = (fornecedorId: string) => {
    const id = parseInt(fornecedorId);
    setSelectedFornecedorId(id);
    setSelectedProdutoId(null); // Reset produto quando fornecedor muda
  };

  const handleQuantidadeChange = (value: string) => {
    const qty = parseInt(value) || 1;
    setQuantidade(qty);
  };

  const handlePrecoChange = (value: string) => {
    const preco = parseFloat(value) || 0;
    setPrecoUnitario(preco);
  };

  const handleFreteChange = (value: string) => {
    const frete = parseFloat(value) || 0;
    setValorFrete(frete);
  }; 
 // Validar se todos os campos obrigatórios estão preenchidos
  const isFormValid = () => {
    return selectedFornecedorId && 
           selectedProdutoId && 
           quantidade > 0 && 
           precoUnitario > 0 && 
           descricaoPedido.trim() !== '';
  };

  // Avançar para o resumo
  const handleAvancarParaResumo = () => {
    if (isFormValid()) {
      setCurrentStep('summary');
    }
  };

  // Voltar para o formulário
  const handleVoltarParaForm = () => {
    setCurrentStep('form');
  };

  // Criar pedido
  const handleCriarPedido = async () => {
    if (!selectedFornecedorId || !selectedProdutoId) return;

    try {
      setIsCreating(true);

      // 1. Preparar dados do pedido
      const pedidoData: PedidoData = {
        id_fornecedor: selectedFornecedorId,
        data_pedido: dataAtual,
        data_entrega: 'não informada',
        valor_frete: valorFrete,
        custo_pedido: custoPedido,
        valor_total: valorTotal,
        descricao_pedido: descricaoPedido,
        status: 'aguardando confirmação do fornecedor'
      };

      console.log('[NovoPedidoModal] Criando pedido:', pedidoData);

      // 2. Criar pedido
      const pedidoResponse = await apiClient.post<{message: string, id_pedido: number}>('/api/pedidos', pedidoData);
      
      console.log('[NovoPedidoModal] Pedido criado:', pedidoResponse.data);
      
      const pedidoId = pedidoResponse.data.id_pedido;
      setCreatedPedidoId(pedidoId);

      // 3. Preparar dados do item
      const itemData: ItemPedido = {
        id_produto: selectedProdutoId,
        quantidade: quantidade,
        preco_unitario: precoUnitario,
        subtotal: custoPedido
      };

      console.log('[NovoPedidoModal] Adicionando item ao pedido:', itemData);

      // 4. Adicionar item ao pedido
      const itemResponse = await apiClient.post(`/api/pedidos/${pedidoId}/itens`, itemData);
      
      console.log('[NovoPedidoModal] Item adicionado:', itemResponse.data);

      // 5. Sucesso - fechar modal e atualizar lista
      setTimeout(() => {
        onClose();
        if (onSave) {
          onSave();
        }
      }, 2000);

    } catch (error) {
      console.error('[NovoPedidoModal] Erro ao criar pedido:', error);
      alert('Erro ao criar pedido. Tente novamente.');
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;  return (

    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Novo Pedido de Compra</h2>
              <p className="text-sm text-gray-500">Crie um novo pedido selecionando produtos e fornecedores</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {currentStep === 'form' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Coluna Esquerda - Formulário */}
              <div className="space-y-6">
                {/* Informações Básicas */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-600" />
                    Informações do Pedido
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Data do Pedido
                      </label>
                      <input
                        type="date"
                        value={dataAtual}
                        disabled
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 text-sm cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Data de Entrega
                      </label>
                      <input
                        type="text"
                        value="não informada"
                        disabled
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 text-sm cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <input
                      type="text"
                      value="aguardando confirmação do fornecedor"
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 text-sm cursor-not-allowed"
                    />
                  </div>
                </div> 
               {/* Seleção de Fornecedor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Truck className="w-4 h-4 mr-2 text-gray-600" />
                    Fornecedor
                  </label>
                  {loadingFornecedores ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-200 border-t-orange-500"></div>
                      <span className="ml-2 text-sm text-gray-500">Carregando fornecedores...</span>
                    </div>
                  ) : errorFornecedores ? (
                    <div className="text-red-500 text-sm py-2">{errorFornecedores}</div>
                  ) : (
                    <select
                      value={selectedFornecedorId || ''}
                      onChange={(e) => handleFornecedorChange(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm"
                    >
                      <option value="">Selecione um fornecedor</option>
                      {fornecedoresFiltrados.map(fornecedor => (
                        <option key={fornecedor.id_fornecedor} value={fornecedor.id_fornecedor}>
                          {fornecedor.nome}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Seleção de Produto */}
                {selectedFornecedorId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                      <div className="flex items-center">
                        <Package className="w-4 h-4 mr-2 text-gray-600" />
                        Produto
                      </div>
                      {produtosFiltrados.length > 0 && (
                        <span className="text-xs text-gray-500">
                          {produtosFiltrados.length} {produtosFiltrados.length === 1 ? 'produto disponível' : 'produtos disponíveis'}
                        </span>
                      )}
                    </label>
                    {loadingProdutos ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-200 border-t-orange-500"></div>
                        <span className="ml-2 text-sm text-gray-500">Carregando produtos...</span>
                      </div>
                    ) : errorProdutos ? (
                      <div className="text-red-500 text-sm py-2">{errorProdutos}</div>
                    ) : produtosFiltrados.length === 0 ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <p className="text-sm text-yellow-800">
                            Este fornecedor não possui produtos cadastrados no sistema.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <select
                        value={selectedProdutoId || ''}
                        onChange={(e) => handleProdutoChange(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm"
                      >
                        <option value="">Selecione um produto</option>
                        {produtosFiltrados.map(produto => (
                          <option key={produto.id_produto} value={produto.id_produto}>
                            {produto.marca} - {produto.nome_produto}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}     
           {/* Quantidade e Preço */}
                {selectedFornecedorId && selectedProdutoId && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantidade
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={quantidade}
                        onChange={(e) => handleQuantidadeChange(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preço Unitário (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={precoUnitario}
                        onChange={(e) => handlePrecoChange(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Valor do Frete */}
                {selectedFornecedorId && selectedProdutoId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor do Frete (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={valorFrete}
                      onChange={(e) => handleFreteChange(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    />
                  </div>
                )}

                {/* Descrição do Pedido */}
                {selectedFornecedorId && selectedProdutoId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição do Pedido
                    </label>
                    <textarea
                      value={descricaoPedido}
                      onChange={(e) => setDescricaoPedido(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm resize-none"
                      placeholder="Descreva os detalhes do pedido..."
                    />
                  </div>
                )}
              </div> 
             {/* Coluna Direita - Resumo */}
              <div className="space-y-6">
                {/* Fornecedor Selecionado */}
                {selectedFornecedorId && (
                  <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                    <h3 className="text-sm font-medium text-green-900 mb-3">Fornecedor Selecionado</h3>
                    {(() => {
                      const fornecedor = fornecedores.find(f => f.id_fornecedor === selectedFornecedorId);
                      return fornecedor ? (
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Truck className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-green-900 text-sm">{fornecedor.nome}</p>
                            <p className="text-xs text-green-700">{fornecedor.cidade}, {fornecedor.estado}</p>
                            <p className="text-xs text-green-700">{fornecedor.telefone} • {fornecedor.email}</p>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}

                {/* Produto Selecionado */}
                {produtoSelecionado && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <h3 className="text-sm font-medium text-blue-900 mb-3">Produto Selecionado</h3>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-blue-900 text-sm">{produtoSelecionado.marca} - {produtoSelecionado.nome_produto}</p>
                        <p className="text-xs text-blue-700">
                          {produtoSelecionado.categoria} • {produtoSelecionado.destinado_para} • {produtoSelecionado.variacao}
                        </p>
                        <p className="text-xs text-blue-700">
                          SKU: {produtoSelecionado.sku} • Preço: R$ {produtoSelecionado.preco_venda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cálculos */}
                {selectedFornecedorId && selectedProdutoId && (
                  <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                    <h3 className="text-sm font-medium text-orange-900 mb-4 flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Resumo Financeiro
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Quantidade:</span>
                        <span className="font-medium text-gray-900">{quantidade} unidades</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Preço unitário:</span>
                        <span className="font-medium text-gray-900">
                          R$ {precoUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Subtotal produtos:</span>
                        <span className="font-medium text-gray-900">
                          R$ {custoPedido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Frete:</span>
                        <span className="font-medium text-gray-900">
                          R$ {valorFrete.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="border-t border-orange-200 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-orange-900">Total do Pedido:</span>
                          <span className="font-bold text-orange-600 text-lg">
                            R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>       
   ) : (
            // Etapa de Resumo
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Resumo do Pedido</h3>
                <p className="text-gray-500 text-sm">Revise as informações antes de criar o pedido</p>
              </div>

              {/* Resumo Completo */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informações do Pedido */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Informações do Pedido</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Data do Pedido:</span>
                        <span className="font-medium">{new Date(dataAtual).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Data de Entrega:</span>
                        <span className="font-medium">Não informada</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium">Aguardando confirmação</span>
                      </div>
                    </div>
                  </div>

                  {/* Fornecedor */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Fornecedor</h4>
                    {(() => {
                      const fornecedor = fornecedores.find(f => f.id_fornecedor === selectedFornecedorId);
                      return fornecedor ? (
                        <div className="space-y-2 text-sm">
                          <p className="font-medium">{fornecedor.nome}</p>
                          <p className="text-gray-600">{fornecedor.cidade}, {fornecedor.estado}</p>
                          <p className="text-gray-600">{fornecedor.telefone}</p>
                          <p className="text-gray-600">{fornecedor.email}</p>
                        </div>
                      ) : null;
                    })()}
                  </div>
                </div>

                {/* Produto */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-4">Produto</h4>
                  {produtoSelecionado && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{produtoSelecionado.marca} - {produtoSelecionado.nome_produto}</p>
                          <p className="text-sm text-gray-600">{produtoSelecionado.categoria} • {produtoSelecionado.destinado_para}</p>
                          <p className="text-sm text-gray-600">SKU: {produtoSelecionado.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Quantidade: {quantidade}</p>
                          <p className="text-sm text-gray-600">Preço Unit: R$ {precoUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                          <p className="font-medium text-gray-900">Subtotal: R$ {custoPedido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>     
           {/* Resumo Financeiro */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-4">Resumo Financeiro</h4>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal dos produtos:</span>
                        <span className="font-medium">R$ {custoPedido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Frete:</span>
                        <span className="font-medium">R$ {valorFrete.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-900">Total do Pedido:</span>
                          <span className="font-bold text-orange-600 text-lg">R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Descrição */}
                {descricaoPedido && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Descrição</h4>
                    <p className="text-sm text-gray-600 bg-white rounded-lg p-3 border border-gray-200">{descricaoPedido}</p>
                  </div>
                )}
              </div>

              {/* Estado de Criação */}
              {isCreating && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-200 border-t-blue-600"></div>
                    <div>
                      <p className="font-medium text-blue-900">Criando pedido...</p>
                      <p className="text-sm text-blue-700">Aguarde enquanto processamos seu pedido</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Sucesso */}
              {createdPedidoId && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Pedido criado com sucesso!</p>
                      <p className="text-sm text-green-700">Pedido #{createdPedidoId} foi criado e os itens foram adicionados</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>   
     {/* Footer com botões */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          {currentStep === 'form' ? (
            <div className="flex justify-between">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAvancarParaResumo}
                disabled={!isFormValid()}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <span>Avançar para Resumo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex justify-between">
              <button
                onClick={handleVoltarParaForm}
                disabled={isCreating}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>
              <button
                onClick={handleCriarPedido}
                disabled={isCreating || !!createdPedidoId}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Criando...</span>
                  </>
                ) : createdPedidoId ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Pedido Criado</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Criar Pedido</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}