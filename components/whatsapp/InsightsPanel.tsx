'use client';

import React, { useState } from 'react';
import { User, TrendingUp, Package, ChevronDown, ChevronUp, MessageSquare, Star, Heart } from 'lucide-react';



interface Pedido {
  data: string;
  valor: number;
  produtos: {
    nome: string;
    tipo: 'normal' | 'cross-sell' | 'up-sell';
  }[];
}

interface ProdutoSugerido {
  id: string;
  nome: string;
  preco: number;
  tipo: 'upsell' | 'crosssell';
  motivo: string;
  categoria: string;
}

interface RecompensaFidelidade {
  id: string;
  nome: string;
  pontosNecessarios: number;
  tipo: 'produto' | 'desconto';
  valor?: number;
  disponivel: boolean;
}



const perfilClienteCompra = {
  categoria: 'Recorrente',
  personalidade: 'Cuidadoso',
  frequencia: 'Quinzenal',
  diasUltimaCompra: 13,
  ticketMedio: 185.50,
  categoriaFavorita: 'Ração Premium',
  produtoMaisPedido: 'Golden Formula Premium 3kg',
  aceitacaoCrossSell: '78%',
  ticketMedioCrossSell: 89.40,
  formaPagamento: 'PIX',
  entrega: 'Retirada na loja'
};

const perfilPet = {
  nome: 'Rex',
  especie: 'Cão',
  raca: 'Golden Retriever',
  idade: '3 anos',
  sexo: 'Macho',
  castrado: 'Sim'
};

const programaFidelidade = {
  pontosAtuais: 1250,
  proximaRecompensa: 1500,
  nivel: 'Ouro',
  proximoNivel: 'Platina',
  pontosProximoNivel: 2000
};

const recompensasDisponiveis: RecompensaFidelidade[] = [
  {
    id: '1',
    nome: 'Petisco Natural 200g',
    pontosNecessarios: 500,
    tipo: 'produto',
    disponivel: true
  },
  {
    id: '2',
    nome: '10% de desconto',
    pontosNecessarios: 800,
    tipo: 'desconto',
    valor: 10,
    disponivel: true
  },
  {
    id: '3',
    nome: 'Brinquedo Kong Mini',
    pontosNecessarios: 1200,
    tipo: 'produto',
    disponivel: true
  },
  {
    id: '4',
    nome: '15% de desconto',
    pontosNecessarios: 1500,
    tipo: 'desconto',
    valor: 15,
    disponivel: false
  },
  {
    id: '5',
    nome: 'Ração Premium 3kg',
    pontosNecessarios: 2000,
    tipo: 'produto',
    disponivel: false
  }
];

const pedidosRecentes: Pedido[] = [
  {
    data: '28/11/2024',
    valor: 89.90,
    produtos: [
      { nome: 'Golden Formula 3kg', tipo: 'normal' },
      { nome: 'Petisco Natural', tipo: 'cross-sell' }
    ]
  },
  {
    data: '15/11/2024',
    valor: 156.80,
    produtos: [
      { nome: 'Ração Premium 10kg', tipo: 'up-sell' },
      { nome: 'Shampoo Hipoalergênico', tipo: 'cross-sell' },
      { nome: 'Brinquedo Kong', tipo: 'cross-sell' }
    ]
  },
  {
    data: '02/11/2024',
    valor: 203.45,
    produtos: [
      { nome: 'Royal Canin 15kg', tipo: 'normal' },
      { nome: 'Coleira Antipulgas', tipo: 'cross-sell' }
    ]
  }
];

const produtosSugeridos: ProdutoSugerido[] = [
  // Alimentação
  {
    id: '1',
    nome: 'Golden Formula Premium 15kg',
    preco: 189.90,
    tipo: 'upsell',
    motivo: 'Versão maior da ração atual',
    categoria: 'Alimentação'
  },
  {
    id: '2',
    nome: 'Ração Royal Canin Digestive Care',
    preco: 245.90,
    tipo: 'upsell',
    motivo: 'Ração super premium para digestão',
    categoria: 'Alimentação'
  },
  {
    id: '3',
    nome: 'Petisco Natural Ossinho',
    preco: 24.90,
    tipo: 'crosssell',
    motivo: 'Complementa a ração premium',
    categoria: 'Alimentação'
  },
  // Brinquedos
  {
    id: '4',
    nome: 'Brinquedo Kong Classic',
    preco: 45.90,
    tipo: 'crosssell',
    motivo: 'Entretenimento para o pet',
    categoria: 'Brinquedos'
  },
  {
    id: '5',
    nome: 'Bola Interativa',
    preco: 29.90,
    tipo: 'crosssell',
    motivo: 'Estimula atividade física',
    categoria: 'Brinquedos'
  },
  // Higiene
  {
    id: '6',
    nome: 'Shampoo Hipoalergênico',
    preco: 32.50,
    tipo: 'crosssell',
    motivo: 'Para cuidados com o pet',
    categoria: 'Higiene'
  },
  {
    id: '7',
    nome: 'Escova Dental Pet',
    preco: 18.90,
    tipo: 'crosssell',
    motivo: 'Higiene bucal do pet',
    categoria: 'Higiene'
  },
  // Cuidados
  {
    id: '8',
    nome: 'Coleira Antipulgas Seresto',
    preco: 89.90,
    tipo: 'crosssell',
    motivo: 'Proteção contra pulgas e carrapatos',
    categoria: 'Cuidados'
  },
  {
    id: '9',
    nome: 'Vermífugo Drontal',
    preco: 45.50,
    tipo: 'crosssell',
    motivo: 'Prevenção de vermes',
    categoria: 'Cuidados'
  },
  // Novidades
  {
    id: '10',
    nome: 'Ração Hill\'s Science Diet Novo',
    preco: 299.90,
    tipo: 'upsell',
    motivo: 'Lançamento com fórmula inovadora',
    categoria: 'Novidades'
  },
  {
    id: '11',
    nome: 'Brinquedo Inteligente PetSafe',
    preco: 159.90,
    tipo: 'crosssell',
    motivo: 'Novidade em entretenimento pet',
    categoria: 'Novidades'
  },
  {
    id: '12',
    nome: 'Suplemento Probiótico Novo',
    preco: 89.90,
    tipo: 'crosssell',
    motivo: 'Lançamento para saúde intestinal',
    categoria: 'Novidades'
  },
  // Em Alta
  {
    id: '13',
    nome: 'Ração Pedigree Adulto',
    preco: 89.90,
    tipo: 'crosssell',
    motivo: 'Mais vendida da semana',
    categoria: 'Em Alta'
  },
  {
    id: '14',
    nome: 'Petisco Dreamies',
    preco: 12.90,
    tipo: 'crosssell',
    motivo: 'Favorito dos clientes',
    categoria: 'Em Alta'
  },
  {
    id: '15',
    nome: 'Areia Sanitária Pipicat',
    preco: 24.90,
    tipo: 'crosssell',
    motivo: 'Produto em alta procura',
    categoria: 'Em Alta'
  }
];

const mensagensPorCategoria = {
  entrega: [
    { id: '1', texto: 'Posso enviar no endereço cadastrado?' },
    { id: '2', texto: 'O prazo de entrega é de 1 a 2 dias úteis.' },
    { id: '3', texto: 'Fazemos entrega em toda a região metropolitana.' },
    { id: '4', texto: 'A taxa de entrega é calculada pela distância.' }
  ],
  estoque: [
    { id: '5', texto: 'Temos essa ração disponível em estoque.' },
    { id: '6', texto: 'Vou verificar a disponibilidade para você.' },
    { id: '7', texto: 'Este produto chegará na próxima semana.' },
    { id: '8', texto: 'Temos 15 unidades disponíveis.' }
  ],
  promocao: [
    { id: '9', texto: 'Você gostaria de conhecer nossa promoção atual?' },
    { id: '10', texto: 'Temos 20% de desconto em rações premium.' },
    { id: '11', texto: 'Na compra de 2 unidades, a 3ª sai pela metade.' },
    { id: '12', texto: 'Clientes VIP têm 15% de desconto adicional.' }
  ],
  atendimento: [
    { id: '13', texto: 'Posso ajudar com mais alguma coisa?' },
    { id: '14', texto: 'Fico à disposição para qualquer dúvida.' },
    { id: '15', texto: 'Obrigado pela preferência!' },
    { id: '16', texto: 'Tenha um ótimo dia!' }
  ],
  consulta: [
    { id: '17', texto: 'Qual a idade e porte do seu pet?' },
    { id: '18', texto: 'Seu pet tem alguma restrição alimentar?' },
    { id: '19', texto: 'Precisa de alguma recomendação específica?' },
    { id: '20', texto: 'Gostaria de falar com nosso veterinário?' }
  ]
};

interface InsightsPanelProps {
  conversaSelecionada: string | null;
}

export function InsightsPanel({ conversaSelecionada }: InsightsPanelProps) {
  const [expandedSections, setExpandedSections] = useState({
    perfilClienteCompra: true,
    perfilPet: true,
    pedidosRecentes: true,
    programaFidelidade: true,
    produtosSugeridos: true,
    mensagensProntas: true,
    historicoInteracoes: true
  });

  const [expandedCategories, setExpandedCategories] = useState({
    entrega: true,
    estoque: true,
    promocao: false,
    atendimento: false,
    consulta: false
  });

  const [expandedProdutoCategories, setExpandedProdutoCategories] = useState({
    alimentacao: true,
    brinquedos: true,
    higiene: false,
    cuidados: false,
    novidades: false,
    emalta: false
  });

  const [produtoIdBusca, setProdutoIdBusca] = useState('');

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleCategory = (category: keyof typeof expandedCategories) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleProdutoCategory = (category: keyof typeof expandedProdutoCategories) => {
    setExpandedProdutoCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Função para obter sugestões baseadas no produto ID
  const obterSugestoesPorProduto = (produtoId: string) => {
    if (!produtoId) {
      // Se não há ID, retorna sugestões baseadas no produto mais comprado
      return produtosSugeridos;
    }

    // Simulação de lógica de sugestões baseada no produto
    const produtoBase = produtosSugeridos.find(p => p.id === produtoId);
    if (!produtoBase) {
      return produtosSugeridos;
    }

    // Filtrar produtos relacionados (mesma categoria + cross-sells de outras categorias)
    const sugestoesContextuais = produtosSugeridos.filter(produto => {
      if (produto.id === produtoId) return false; // Não sugerir o mesmo produto

      // Se é da mesma categoria, sugerir up-sells
      if (produto.categoria === produtoBase.categoria) {
        return produto.tipo === 'upsell';
      }

      // De outras categorias, sugerir cross-sells
      return produto.tipo === 'crosssell';
    });

    return sugestoesContextuais;
  };

  // Obter produtos filtrados baseado na busca
  const produtosFiltrados = obterSugestoesPorProduto(produtoIdBusca);

  // Agrupar produtos por categoria
  const produtosPorCategoria = produtosFiltrados.reduce((acc, produto) => {
    const categoria = produto.categoria.toLowerCase()
      .replace('ç', 'c')
      .replace('ã', 'a')
      .replace(' ', '');
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(produto);
    return acc;
  }, {} as Record<string, ProdutoSugerido[]>);

  // Função para lidar com a busca por ID
  const handleProdutoIdSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const id = (e.target as HTMLInputElement).value;
      setProdutoIdBusca(id);
    }
  };

  if (!conversaSelecionada) {
    return (
      <div className="w-96 bg-gray-50 border-l border-gray-200 flex items-center justify-center flex-shrink-0" style={{ height: 'calc(100vh - 64px)' }}>
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">Selecione uma conversa para ver os insights do cliente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col flex-shrink-0" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200" style={{ minHeight: '77px' }}>
        <h2 className="text-lg font-semibold text-gray-900">Insights</h2>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto scrollbar-insights">
        <div className="p-4 space-y-6">
          {/* Perfil Cliente e Compra */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div
              className="flex items-center justify-between mb-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2 -m-2 transition-colors duration-150"
              onClick={() => toggleSection('perfilClienteCompra')}
            >
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-orange-500" />
                <h3 className="font-medium text-gray-900">Perfil Cliente e Compra</h3>
              </div>
              {expandedSections.perfilClienteCompra ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </div>
            {expandedSections.perfilClienteCompra && (
              <div className="space-y-2 text-sm transition-all duration-200 ease-in-out">
                <div className="flex justify-between">
                  <span className="text-gray-600">Categoria do cliente:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    {perfilClienteCompra.categoria}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Personalidade:</span>
                  <span className="font-medium text-gray-900">{perfilClienteCompra.personalidade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frequência:</span>
                  <span className="font-medium text-gray-900">{perfilClienteCompra.frequencia}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dias da última compra:</span>
                  <span className="font-medium text-gray-900">{perfilClienteCompra.diasUltimaCompra} dias</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ticket médio:</span>
                  <span className="font-medium text-gray-900">R$ {perfilClienteCompra.ticketMedio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Categoria favorita:</span>
                  <span className="font-medium text-gray-900">{perfilClienteCompra.categoriaFavorita}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Produto mais pedido:</span>
                  <span className="font-medium text-gray-900">{perfilClienteCompra.produtoMaisPedido}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Aceitação de cross-sell:</span>
                  <span className="font-bold text-orange-600">{perfilClienteCompra.aceitacaoCrossSell}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ticket médio em cross-sell:</span>
                  <span className="font-medium text-gray-900">R$ {perfilClienteCompra.ticketMedioCrossSell.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Forma de pagamento:</span>
                  <span className="font-medium text-gray-900">{perfilClienteCompra.formaPagamento}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Entrega:</span>
                  <span className="font-medium text-gray-900">{perfilClienteCompra.entrega}</span>
                </div>
              </div>
            )}
          </div>

          {/* Perfil do Pet */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div
              className="flex items-center justify-between mb-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2 -m-2 transition-colors duration-150"
              onClick={() => toggleSection('perfilPet')}
            >
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-orange-500" />
                <h3 className="font-medium text-gray-900">Perfil do Pet</h3>
              </div>
              {expandedSections.perfilPet ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </div>
            {expandedSections.perfilPet && (
              <div className="space-y-2 text-sm transition-all duration-200 ease-in-out">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nome:</span>
                  <span className="font-medium text-gray-900">{perfilPet.nome}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Espécie:</span>
                  <span className="font-medium text-gray-900">{perfilPet.especie}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Raça:</span>
                  <span className="font-medium text-gray-900">{perfilPet.raca}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Idade:</span>
                  <span className="font-medium text-gray-900">{perfilPet.idade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sexo:</span>
                  <span className="font-medium text-gray-900">{perfilPet.sexo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Castrado:</span>
                  <span className="font-medium text-gray-900">{perfilPet.castrado}</span>
                </div>
              </div>
            )}
          </div>

          {/* Resumo dos Pedidos */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div
              className="flex items-center justify-between mb-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2 -m-2 transition-colors duration-150"
              onClick={() => toggleSection('pedidosRecentes')}
            >
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <h3 className="font-medium text-gray-900">Últimas Compras</h3>
              </div>
              {expandedSections.pedidosRecentes ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </div>
            {expandedSections.pedidosRecentes && (
              <div className="space-y-3 transition-all duration-200 ease-in-out">
                {pedidosRecentes.map((pedido, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200">
                    <div className="p-3 border-b border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">{pedido.data}</span>
                        <span className="text-sm font-bold text-orange-600">R$ {pedido.valor.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="px-3 pb-3 space-y-2">
                      {pedido.produtos.map((produto, produtoIndex) => (
                        <div key={produtoIndex} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900 leading-tight">{produto.nome}</h4>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full font-medium bg-gray-100 text-gray-700">
                              {produto.tipo === 'normal' ? 'Recorrente' : produto.tipo === 'cross-sell' ? 'Cross-sell' : 'Up-sell'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Programa de Fidelidade */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div
              className="flex items-center justify-between mb-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2 -m-2 transition-colors duration-150"
              onClick={() => toggleSection('programaFidelidade')}
            >
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-orange-500" />
                <h3 className="font-medium text-gray-900">Programa de Fidelidade</h3>
              </div>
              {expandedSections.programaFidelidade ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </div>
            {expandedSections.programaFidelidade && (
              <div className="space-y-3 transition-all duration-200 ease-in-out">
                {/* Status dos Pontos */}
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900">Pontos Atuais</span>
                    <span className="text-lg font-bold text-orange-600">{programaFidelidade.pontosAtuais}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-600">Nível atual:</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                      {programaFidelidade.nivel}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(programaFidelidade.pontosAtuais / programaFidelidade.pontosProximoNivel) * 100}%`
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Próximo nível: {programaFidelidade.proximoNivel}</span>
                    <span>{programaFidelidade.pontosProximoNivel - programaFidelidade.pontosAtuais} pontos restantes</span>
                  </div>
                </div>

                {/* Recompensas Disponíveis */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">Recompensas Disponíveis</h4>
                  {recompensasDisponiveis.filter(recompensa => recompensa.disponivel).map((recompensa) => (
                    <div
                      key={recompensa.id}
                      className="bg-white rounded-lg p-3 border border-green-200 bg-green-50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-gray-900">{recompensa.nome}</h5>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-600">
                              {recompensa.pontosNecessarios} pontos
                            </span>
                            {recompensa.tipo === 'desconto' && (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                                {recompensa.valor}% OFF
                              </span>
                            )}
                            {recompensa.tipo === 'produto' && (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                                Produto
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <button className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded transition-colors">
                            Resgatar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Produtos Sugeridos */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div
              className="flex items-center justify-between mb-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2 -m-2 transition-colors duration-150"
              onClick={() => toggleSection('produtosSugeridos')}
            >
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-orange-500" />
                <h3 className="font-medium text-gray-900">Sugestões de Venda</h3>
              </div>
              {expandedSections.produtosSugeridos ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </div>
            {expandedSections.produtosSugeridos && (
              <>
                {/* Campo de busca por ID do produto */}
                <div className="mb-3 px-1">
                  <input
                    type="text"
                    placeholder="Digite o ID do produto para sugestões contextuais..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    onKeyDown={handleProdutoIdSubmit}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {produtoIdBusca
                      ? `Sugestões baseadas no produto ID: ${produtoIdBusca}`
                      : 'Sugestões baseadas no produto mais comprado pelo cliente'
                    }
                  </p>
                </div>
              </>
            )}
            {expandedSections.produtosSugeridos && (
              <div className="space-y-3 transition-all duration-200 ease-in-out">
                {/* Categoria Alimentação */}
                {produtosPorCategoria.alimentacao && (
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div
                      className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleProdutoCategory('alimentacao')}
                    >
                      <span className="text-sm font-medium text-gray-900">Alimentação</span>
                      {expandedProdutoCategories.alimentacao ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                    {expandedProdutoCategories.alimentacao && (
                      <div className="px-3 pb-3 space-y-2">
                        {produtosPorCategoria.alimentacao.map((produto) => (
                          <div key={produto.id} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-sm font-medium text-gray-900 leading-tight">{produto.nome}</h4>
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                {produto.tipo === 'upsell' ? 'Up-sell' : 'Cross-sell'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{produto.motivo}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-orange-600">R$ {produto.preco.toFixed(2)}</span>
                              <button className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded transition-colors">
                                Sugerir
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Categoria Brinquedos */}
                {produtosPorCategoria.brinquedos && (
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div
                      className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleProdutoCategory('brinquedos')}
                    >
                      <span className="text-sm font-medium text-gray-900">Brinquedos</span>
                      {expandedProdutoCategories.brinquedos ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                    {expandedProdutoCategories.brinquedos && (
                      <div className="px-3 pb-3 space-y-2">
                        {produtosPorCategoria.brinquedos.map((produto) => (
                          <div key={produto.id} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-sm font-medium text-gray-900 leading-tight">{produto.nome}</h4>
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                {produto.tipo === 'upsell' ? 'Up-sell' : 'Cross-sell'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{produto.motivo}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-orange-600">R$ {produto.preco.toFixed(2)}</span>
                              <button className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded transition-colors">
                                Sugerir
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Categoria Higiene */}
                {produtosPorCategoria.higiene && (
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div
                      className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleProdutoCategory('higiene')}
                    >
                      <span className="text-sm font-medium text-gray-900">Higiene</span>
                      {expandedProdutoCategories.higiene ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                    {expandedProdutoCategories.higiene && (
                      <div className="px-3 pb-3 space-y-2">
                        {produtosPorCategoria.higiene.map((produto) => (
                          <div key={produto.id} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-sm font-medium text-gray-900 leading-tight">{produto.nome}</h4>
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                {produto.tipo === 'upsell' ? 'Up-sell' : 'Cross-sell'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{produto.motivo}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-orange-600">R$ {produto.preco.toFixed(2)}</span>
                              <button className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded transition-colors">
                                Sugerir
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Categoria Cuidados */}
                {produtosPorCategoria.cuidados && (
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div
                      className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleProdutoCategory('cuidados')}
                    >
                      <span className="text-sm font-medium text-gray-900">Cuidados</span>
                      {expandedProdutoCategories.cuidados ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                    {expandedProdutoCategories.cuidados && (
                      <div className="px-3 pb-3 space-y-2">
                        {produtosPorCategoria.cuidados.map((produto) => (
                          <div key={produto.id} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-sm font-medium text-gray-900 leading-tight">{produto.nome}</h4>
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                {produto.tipo === 'upsell' ? 'Up-sell' : 'Cross-sell'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{produto.motivo}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-orange-600">R$ {produto.preco.toFixed(2)}</span>
                              <button className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded transition-colors">
                                Sugerir
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Categoria Novidades */}
                {produtosPorCategoria.novidades && (
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div
                      className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleProdutoCategory('novidades')}
                    >
                      <span className="text-sm font-medium text-gray-900">Novidades</span>
                      {expandedProdutoCategories.novidades ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                    {expandedProdutoCategories.novidades && (
                      <div className="px-3 pb-3 space-y-2">
                        {produtosPorCategoria.novidades.map((produto) => (
                          <div key={produto.id} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-sm font-medium text-gray-900 leading-tight">{produto.nome}</h4>
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                {produto.tipo === 'upsell' ? 'Up-sell' : 'Cross-sell'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{produto.motivo}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-orange-600">R$ {produto.preco.toFixed(2)}</span>
                              <button className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded transition-colors">
                                Sugerir
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Categoria Em Alta */}
                {produtosPorCategoria.emalta && (
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div
                      className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleProdutoCategory('emalta')}
                    >
                      <span className="text-sm font-medium text-gray-900">Em Alta</span>
                      {expandedProdutoCategories.emalta ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                    {expandedProdutoCategories.emalta && (
                      <div className="px-3 pb-3 space-y-2">
                        {produtosPorCategoria.emalta.map((produto) => (
                          <div key={produto.id} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-sm font-medium text-gray-900 leading-tight">{produto.nome}</h4>
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                {produto.tipo === 'upsell' ? 'Up-sell' : 'Cross-sell'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{produto.motivo}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-orange-600">R$ {produto.preco.toFixed(2)}</span>
                              <button className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded transition-colors">
                                Sugerir
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mensagens Prontas */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div
              className="flex items-center justify-between mb-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2 -m-2 transition-colors duration-150"
              onClick={() => toggleSection('mensagensProntas')}
            >
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-orange-500" />
                <h3 className="font-medium text-gray-900">Mensagens Prontas</h3>
              </div>
              {expandedSections.mensagensProntas ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </div>
            {expandedSections.mensagensProntas && (
              <div className="space-y-3 transition-all duration-200 ease-in-out">
                {/* Categoria Entrega */}
                <div className="bg-white rounded-lg border border-gray-200">
                  <div
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleCategory('entrega')}
                  >
                    <span className="text-sm font-medium text-gray-900">Entrega</span>
                    {expandedCategories.entrega ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  {expandedCategories.entrega && (
                    <div className="px-3 pb-3 space-y-2">
                      {mensagensPorCategoria.entrega.map((mensagem) => (
                        <div key={mensagem.id} className="p-2 bg-gray-50 rounded text-sm text-gray-700 hover:bg-orange-50 cursor-pointer transition-colors">
                          {mensagem.texto}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Categoria Estoque */}
                <div className="bg-white rounded-lg border border-gray-200">
                  <div
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleCategory('estoque')}
                  >
                    <span className="text-sm font-medium text-gray-900">Estoque</span>
                    {expandedCategories.estoque ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  {expandedCategories.estoque && (
                    <div className="px-3 pb-3 space-y-2">
                      {mensagensPorCategoria.estoque.map((mensagem) => (
                        <div key={mensagem.id} className="p-2 bg-gray-50 rounded text-sm text-gray-700 hover:bg-orange-50 cursor-pointer transition-colors">
                          {mensagem.texto}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Categoria Promoção */}
                <div className="bg-white rounded-lg border border-gray-200">
                  <div
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleCategory('promocao')}
                  >
                    <span className="text-sm font-medium text-gray-900">Promoção</span>
                    {expandedCategories.promocao ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  {expandedCategories.promocao && (
                    <div className="px-3 pb-3 space-y-2">
                      {mensagensPorCategoria.promocao.map((mensagem) => (
                        <div key={mensagem.id} className="p-2 bg-gray-50 rounded text-sm text-gray-700 hover:bg-orange-50 cursor-pointer transition-colors">
                          {mensagem.texto}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Categoria Atendimento */}
                <div className="bg-white rounded-lg border border-gray-200">
                  <div
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleCategory('atendimento')}
                  >
                    <span className="text-sm font-medium text-gray-900">Atendimento</span>
                    {expandedCategories.atendimento ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  {expandedCategories.atendimento && (
                    <div className="px-3 pb-3 space-y-2">
                      {mensagensPorCategoria.atendimento.map((mensagem) => (
                        <div key={mensagem.id} className="p-2 bg-gray-50 rounded text-sm text-gray-700 hover:bg-orange-50 cursor-pointer transition-colors">
                          {mensagem.texto}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Categoria Consulta */}
                <div className="bg-white rounded-lg border border-gray-200">
                  <div
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleCategory('consulta')}
                  >
                    <span className="text-sm font-medium text-gray-900">Consulta</span>
                    {expandedCategories.consulta ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  {expandedCategories.consulta && (
                    <div className="px-3 pb-3 space-y-2">
                      {mensagensPorCategoria.consulta.map((mensagem) => (
                        <div key={mensagem.id} className="p-2 bg-gray-50 rounded text-sm text-gray-700 hover:bg-orange-50 cursor-pointer transition-colors">
                          {mensagem.texto}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Histórico de Interações */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div
              className="flex items-center justify-between mb-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2 -m-2 transition-colors duration-150"
              onClick={() => toggleSection('historicoInteracoes')}
            >
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <h3 className="font-medium text-gray-900">Histórico de Interações</h3>
              </div>
              {expandedSections.historicoInteracoes ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </div>
            {expandedSections.historicoInteracoes && (
              <div className="space-y-2 text-sm transition-all duration-200 ease-in-out">
                <div className="bg-white rounded p-2 border border-gray-200">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-gray-900">WhatsApp</span>
                    <span className="text-gray-500">Hoje</span>
                  </div>
                  <p className="text-gray-600">Pergunta sobre ração premium</p>
                </div>

                <div className="bg-white rounded p-2 border border-gray-200">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-gray-900">WhatsApp</span>
                    <span className="text-gray-500">25/11</span>
                  </div>
                  <p className="text-gray-600">Consulta sobre horário de funcionamento</p>
                </div>
              </div>
            )}
          </div>


        </div>
      </div>
    </div>
  );
}