'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  User, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  QrCode, 
  Star, 
  TrendingUp, 
  Gift,
  Zap,
  Calculator,
  Percent,
  DollarSign,
  Clock,
  CheckCircle,
  Printer,
  Receipt,
  History,
  AlertTriangle,
  Package,
  Barcode,
  Camera,
  Headphones,
  Settings,
  Users,
  Calendar,
  Bell,
  Coffee,
  Pause,
  Play,
  RotateCcw,
  Save,
  FileText,
  Tag,
  Smartphone,
  Wifi,
  WifiOff,
  Battery,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Maximize,
  Minimize,
  RefreshCw,
  Filter,
  SortAsc,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Home,
  Building,
  CreditCard as CardIcon,
  Banknote,
  Coins,
  PiggyBank,
  TrendingDown,
  Award,
  Crown,
  Zap as Lightning,
  Heart,
  ThumbsUp,
  Share2,
  Download,
  Upload,
  Cloud,
  CloudOff,
  Database,
  Server,
  Monitor,
  Tablet,
  MousePointer,
  Keyboard,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Image,
  Music,
  PlayCircle,
  PauseCircle,
  StopCircle,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Volume,
  VolumeX as Mute,
  Bluetooth,
  Usb,
  HardDrive,
  Cpu,
  MemoryStick,
  Power,
  PowerOff,
  Zap as Electric,
  Activity,
  BarChart,
  PieChart,
  LineChart,
  Layers,
  Grid,
  List,
  Table,
  Columns,
  Rows,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Star as StarIcon,
  Heart as HeartIcon,
  Bookmark,
  Flag,
  Pin,
  Paperclip,
  Link,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUp,
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  CornerUpLeft,
  CornerUpRight,
  CornerDownLeft,
  CornerDownRight,
  Move,
  MousePointer2,
  Navigation,
  Compass,
  Map,
  Globe,
  Locate,
  Navigation2,
  Route,
  Signpost,
  Milestone,
  Target,
  Crosshair,
  Focus,
  Scan,
  QrCode as QR,
  Fingerprint,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Key,
  KeyRound,
  LockKeyhole,
  Unlock as UnlockIcon,
  UserCheck,
  UserX,
  UserPlus,
  UserMinus,
  Users2,
  UsersRound,
  UserCog,
  UserSearch,
  Contact,
  Phone as PhoneIcon,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  PhoneForwarded,
  Voicemail,
  MessageSquare,
  MessageCircle as MessageIcon,
  Mail as MailIcon,
  MailOpen,
  MailPlus,
  MailMinus,
  MailCheck,
  MailX,
  Inbox,
  Send,
  SendHorizontal,
  Reply,
  ReplyAll,
  Forward,
  Archive,
  ArchiveX,
  Trash,
  Delete,
  Edit,
  Edit2,
  Edit3,
  PenTool,
  Pencil,
  Eraser,
  Highlighter,
  Type,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List as ListIcon,
  ListOrdered,
  ListChecks,
  ListTodo,
  CheckSquare,
  Square as SquareIcon,
  CheckCircle2,
  Circle as CircleIcon,
  ToggleLeft,
  ToggleRight,
  Sliders,
  SlidersHorizontal,
  SlidersVertical,
  Gauge,
  Timer,
  AlarmClock,
  Clock as ClockIcon,
  Watch,
  Hourglass,
  CalendarDays,
  CalendarCheck,
  CalendarX,
  CalendarPlus,
  CalendarMinus,
  CalendarClock,
  CalendarHeart,
  CalendarRange,
  CalendarFold,
  CalendarSearch,
  CalendarX2,
  CalendarCheck2,
  CalendarOff,
  Copy,
  X
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

// Interface para clientes do ponto de venda
interface ClientePDV {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf_cnpj: string;
  tipo: 'pessoa_fisica' | 'pessoa_juridica';
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  data_cadastro: string;
  data_nascimento?: string;
  status: 'ativo' | 'inativo';
  observacoes?: string;
  pontos?: number;
  nivel?: string;
  desconto?: number;
  ultimaCompra?: string;
  totalCompras?: number;
  frequencia?: string;
  pets?: string[];
  aniversario?: string;
  preferencias?: string[];
}

interface ProdutoCarrinho {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  categoria: string;
  imagem?: string;
}

interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  pontos: number;
  nivel: string;
  desconto: number;
}

export default function PontoDeVendaPage() {
  const [carrinho, setCarrinho] = useState<ProdutoCarrinho[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<ClientePDV | null>(null);
  const [buscarCliente, setBuscarCliente] = useState('');
  const [buscarProduto, setBuscarProduto] = useState('');
  const [metodoPagamento, setMetodoPagamento] = useState<'dinheiro' | 'cartao' | 'pix'>('dinheiro');
  const [desconto, setDesconto] = useState(0);
  const [showQRCode, setShowQRCode] = useState(false);
  
  // Novos estados
  const [vendaAtual, setVendaAtual] = useState<string>('');
  const [vendedor, setVendedor] = useState('João Silva');
  const [turno, setTurno] = useState<'manha' | 'tarde' | 'noite'>('manha');
  const [caixaAberto, setCaixaAberto] = useState(true);
  const [saldoCaixa, setSaldoCaixa] = useState(1250.50);
  const [vendasDia, setVendasDia] = useState(15);
  const [metaDia, setMetaDia] = useState(2500.00);
  const [showHistorico, setShowHistorico] = useState(false);
  const [showConfiguracoes, setShowConfiguracoes] = useState(false);
  const [showAjuda, setShowAjuda] = useState(false);
  const [modoEscuro, setModoEscuro] = useState(false);
  const [somAtivo, setSomAtivo] = useState(true);
  const [impressoraConectada, setImpressoraConectada] = useState(true);
  const [conexaoInternet, setConexaoInternet] = useState(true);
  const [leitorCodigoBarras, setLeitorCodigoBarras] = useState(true);
  const [pausaVenda, setPausaVenda] = useState(false);
  const [vendaSalva, setVendaSalva] = useState<any[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [ordenacao, setOrdenacao] = useState<'nome' | 'preco' | 'categoria'>('nome');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showEstoque, setShowEstoque] = useState(true);
  const [alertasEstoque, setAlertasEstoque] = useState(3);
  const [promocaoAtiva, setPromocaoAtiva] = useState(true);
  const [cupomDesconto, setCupomDesconto] = useState('');
  const [parcelamento, setParcelamento] = useState(1);
  const [valorRecebido, setValorRecebido] = useState(0);
  const [troco, setTroco] = useState(0);
  const [observacoes, setObservacoes] = useState('');
  const [entrega, setEntrega] = useState(false);
  const [enderecoEntrega, setEnderecoEntrega] = useState('');
  const [taxaEntrega, setTaxaEntrega] = useState(5.00);
  const [agendamento, setAgendamento] = useState('');
  const [garantia, setGarantia] = useState(false);
  const [seguro, setSeguro] = useState(false);
  const [fidelidade, setFidelidade] = useState(true);
  const [pontosGanhos, setPontosGanhos] = useState(0);
  const [nivelCliente, setNivelCliente] = useState('Bronze');
  const [proximoNivel, setProximoNivel] = useState(500);
  const [cashback, setCashback] = useState(0);
  const [comissaoVendedor, setComissaoVendedor] = useState(0);
  const [metaVendedor, setMetaVendedor] = useState(1500.00);
  const [rankingVendedor, setRankingVendedor] = useState(2);
  const [notificacoes, setNotificacoes] = useState(5);
  const [mensagensChat, setMensagensChat] = useState(2);
  const [suporteOnline, setSuporteOnline] = useState(true);
  const [backupAutomatico, setBackupAutomatico] = useState(true);
  const [sincronizacao, setSincronizacao] = useState('online');
  const [versaoSistema, setVersaoSistema] = useState('2.1.4');
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState('2024-01-15');
  const [licencaAtiva, setLicencaAtiva] = useState(true);
  const [suporteExpira, setSuporteExpira] = useState('2024-12-31');
  
  // Estados de tempo real
  const [horaAtual, setHoraAtual] = useState(() => new Date());
  const [vendaEmAndamento, setVendaEmAndamento] = useState(false);
  const [tempoVenda, setTempoVenda] = useState(0);
  
  // Atualizar hora a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setHoraAtual(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Timer da venda
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (vendaEmAndamento) {
      timer = setInterval(() => {
        setTempoVenda(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [vendaEmAndamento]);
  
  // Iniciar venda quando adicionar primeiro produto
  useEffect(() => {
    if (carrinho.length > 0 && !vendaEmAndamento) {
      setVendaEmAndamento(true);
      setTempoVenda(0);
    } else if (carrinho.length === 0 && vendaEmAndamento) {
      setVendaEmAndamento(false);
      setTempoVenda(0);
    }
  }, [carrinho.length, vendaEmAndamento]);

  // Dados mockados expandidos
  const produtos = [
    { id: 1, nome: 'Ração Premium Cães', preco: 89.90, categoria: 'Alimentação', estoque: 15, codigo: '001', promocao: false, margem: 35, fornecedor: 'PetFood Ltd', validade: '2024-12-31' },
    { id: 2, nome: 'Brinquedo Mordedor', preco: 24.90, categoria: 'Brinquedos', estoque: 8, codigo: '002', promocao: true, margem: 45, fornecedor: 'ToyPet Inc', validade: null },
    { id: 3, nome: 'Shampoo Pet', preco: 32.50, categoria: 'Higiene', estoque: 12, codigo: '003', promocao: false, margem: 40, fornecedor: 'CleanPet Co', validade: '2025-06-15' },
    { id: 4, nome: 'Coleira Ajustável', preco: 45.00, categoria: 'Acessórios', estoque: 6, codigo: '004', promocao: false, margem: 50, fornecedor: 'AccessPet', validade: null },
    { id: 5, nome: 'Petisco Natural', preco: 18.90, categoria: 'Petiscos', estoque: 20, codigo: '005', promocao: true, margem: 30, fornecedor: 'NaturalTreats', validade: '2024-08-20' },
    { id: 6, nome: 'Cama Pet Confort', preco: 125.00, categoria: 'Camas', estoque: 4, codigo: '006', promocao: false, margem: 55, fornecedor: 'ComfortPet', validade: null },
    { id: 7, nome: 'Antipulgas Premium', preco: 67.50, categoria: 'Medicamentos', estoque: 2, codigo: '007', promocao: false, margem: 25, fornecedor: 'VetMed', validade: '2024-10-30' },
    { id: 8, nome: 'Aquário 50L', preco: 189.90, categoria: 'Aquarismo', estoque: 3, codigo: '008', promocao: true, margem: 60, fornecedor: 'AquaPet', validade: null },
    { id: 9, nome: 'Gaiola Hamster', preco: 78.00, categoria: 'Habitação', estoque: 5, codigo: '009', promocao: false, margem: 45, fornecedor: 'HomePet', validade: null },
    { id: 10, nome: 'Vitamina Cães', preco: 34.90, categoria: 'Suplementos', estoque: 18, codigo: '010', promocao: false, margem: 35, fornecedor: 'VitaPet', validade: '2025-03-15' }
  ];

  const clientesMock: ClientePDV[] = [
    { 
      id: 1, 
      nome: 'Maria Silva', 
      email: 'maria@email.com', 
      telefone: '(11) 99999-9999',
      cpf_cnpj: '123.456.789-00',
      tipo: 'pessoa_fisica' as const,
      endereco: 'Rua das Flores, 123',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567',
      data_cadastro: '2023-01-15',
      status: 'ativo' as const,
      pontos: 1250, 
      nivel: 'Gold', 
      desconto: 10,
      ultimaCompra: '2024-01-10',
      totalCompras: 2890.50,
      frequencia: 'Alta',
      pets: ['Rex (Cão)', 'Mimi (Gato)'],
      aniversario: '15/03',
      preferencias: ['Ração Premium', 'Brinquedos']
    },
    { 
      id: 2, 
      nome: 'João Santos', 
      email: 'joao@email.com', 
      telefone: '(11) 88888-8888',
      cpf_cnpj: '987.654.321-00',
      tipo: 'pessoa_fisica' as const,
      endereco: 'Av. Central, 456',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-568',
      data_cadastro: '2023-02-20',
      status: 'ativo' as const,
      pontos: 850, 
      nivel: 'Silver', 
      desconto: 5,
      ultimaCompra: '2024-01-08',
      totalCompras: 1450.00,
      frequencia: 'Média',
      pets: ['Bolt (Cão)'],
      aniversario: '22/07',
      preferencias: ['Petiscos', 'Coleiras']
    },
    { 
      id: 3, 
      nome: 'Ana Costa', 
      email: 'ana@email.com', 
      telefone: '(11) 77777-7777',
      cpf_cnpj: '456.789.123-00',
      tipo: 'pessoa_fisica' as const,
      endereco: 'Rua do Comércio, 789',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-569',
      data_cadastro: '2023-03-10',
      status: 'ativo' as const,
      pontos: 2100, 
      nivel: 'Platinum', 
      desconto: 15,
      ultimaCompra: '2024-01-12',
      totalCompras: 4250.75,
      frequencia: 'Muito Alta',
      pets: ['Luna (Gato)', 'Thor (Cão)', 'Nemo (Peixe)'],
      aniversario: '05/11',
      preferencias: ['Medicamentos', 'Higiene', 'Aquarismo']
    }
  ];

  const sugestoes = [
    { id: 11, nome: 'Vitamina Pet', preco: 28.90, tipo: 'upsell', motivo: 'Complementa a ração premium', categoria: 'Suplementos' },
    { id: 12, nome: 'Escova Dental Pet', preco: 15.90, tipo: 'crosssell', motivo: 'Higiene bucal essencial', categoria: 'Higiene' },
    { id: 13, nome: 'Tapete Higiênico', preco: 22.50, tipo: 'crosssell', motivo: 'Clientes que compram shampoo também levam', categoria: 'Higiene' },
    { id: 14, nome: 'Comedouro Automático', preco: 89.90, tipo: 'upsell', motivo: 'Facilita a alimentação', categoria: 'Acessórios' },
    { id: 15, nome: 'Brinquedo Interativo', preco: 45.50, tipo: 'crosssell', motivo: 'Estimula a mente do pet', categoria: 'Brinquedos' }
  ];

  const historicoVendas = [
    { id: 'V001', cliente: 'Maria Silva', total: 156.80, itens: 3, horario: '14:30', pagamento: 'Cartão' },
    { id: 'V002', cliente: 'Cliente Avulso', total: 89.90, itens: 1, horario: '14:15', pagamento: 'PIX' },
    { id: 'V003', cliente: 'João Santos', total: 234.50, itens: 5, horario: '13:45', pagamento: 'Dinheiro' },
    { id: 'V004', cliente: 'Ana Costa', total: 445.20, itens: 7, horario: '13:20', pagamento: 'Cartão' },
    { id: 'V005', cliente: 'Cliente Avulso', total: 67.40, itens: 2, horario: '12:55', pagamento: 'PIX' }
  ];

  const alertas = [
    { tipo: 'estoque', mensagem: 'Antipulgas Premium com estoque baixo (2 unidades)', prioridade: 'alta' },
    { tipo: 'sistema', mensagem: 'Backup automático realizado com sucesso', prioridade: 'baixa' },
    { tipo: 'promocao', mensagem: 'Promoção de Brinquedos termina hoje', prioridade: 'media' },
    { tipo: 'cliente', mensagem: 'Aniversário de Maria Silva amanhã', prioridade: 'media' },
    { tipo: 'meta', mensagem: '78% da meta diária atingida', prioridade: 'baixa' }
  ];

  const categorias = ['Todas', 'Alimentação', 'Brinquedos', 'Higiene', 'Acessórios', 'Petiscos', 'Camas', 'Medicamentos', 'Aquarismo', 'Habitação', 'Suplementos'];

  const promocoes = [
    { id: 1, nome: 'Leve 3 Pague 2', categoria: 'Petiscos', desconto: 33, validade: '2024-01-31' },
    { id: 2, nome: '20% OFF Brinquedos', categoria: 'Brinquedos', desconto: 20, validade: '2024-01-25' },
    { id: 3, nome: 'Frete Grátis acima R$ 100', categoria: 'Geral', desconto: 0, validade: '2024-02-15' }
  ];

  // Funções do carrinho
  const adicionarProduto = (produto: any) => {
    const produtoExistente = carrinho.find(item => item.id === produto.id);
    if (produtoExistente) {
      setCarrinho(carrinho.map(item => 
        item.id === produto.id 
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      ));
    } else {
      setCarrinho([...carrinho, { ...produto, quantidade: 1 }]);
    }
  };

  const removerProduto = (id: number) => {
    setCarrinho(carrinho.filter(item => item.id !== id));
  };

  const alterarQuantidade = (id: number, novaQuantidade: number) => {
    if (novaQuantidade <= 0) {
      removerProduto(id);
    } else {
      setCarrinho(carrinho.map(item => 
        item.id === id 
          ? { ...item, quantidade: novaQuantidade }
          : item
      ));
    }
  };

  // Funções utilitárias
  const formatarTempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const calcularPontos = (valor: number) => {
    return Math.floor(valor / 10); // 1 ponto a cada R$ 10
  };

  const calcularCashback = (valor: number, nivel: string) => {
    const percentuais = { Bronze: 1, Silver: 2, Gold: 3, Platinum: 5 };
    return valor * (percentuais[nivel as keyof typeof percentuais] || 1) / 100;
  };

  const calcularComissao = (valor: number) => {
    return valor * 0.03; // 3% de comissão
  };

  const gerarCodigoVenda = () => {
    const agora = new Date();
    const codigo = `V${agora.getFullYear()}${(agora.getMonth() + 1).toString().padStart(2, '0')}${agora.getDate().toString().padStart(2, '0')}${agora.getHours().toString().padStart(2, '0')}${agora.getMinutes().toString().padStart(2, '0')}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    return codigo;
  };

  const aplicarPromocao = (produto: any) => {
    if (produto.promocao) {
      return produto.preco * 0.9; // 10% de desconto
    }
    return produto.preco;
  };

  const verificarEstoqueBaixo = (produto: any) => {
    return produto.estoque <= 5;
  };

  const calcularTaxaEntrega = (valor: number) => {
    if (valor >= 100) return 0; // Frete grátis acima de R$ 100
    return taxaEntrega;
  };

  const salvarVenda = () => {
    const vendaParaSalvar = {
      id: gerarCodigoVenda(),
      carrinho: [...carrinho],
      cliente: clienteSelecionado,
      subtotal,
      desconto: totalDesconto,
      total,
      timestamp: new Date().toISOString(),
      vendedor,
      observacoes
    };
    setVendaSalva([...vendaSalva, vendaParaSalvar]);
    localStorage.setItem('vendasSalvas', JSON.stringify([...vendaSalva, vendaParaSalvar]));
  };

  const recuperarVenda = (vendaId: string) => {
    const venda = vendaSalva.find(v => v.id === vendaId);
    if (venda) {
      setCarrinho(venda.carrinho);
      setClienteSelecionado(venda.cliente);
      setObservacoes(venda.observacoes);
    }
  };

  const limparVenda = () => {
    setCarrinho([]);
    setClienteSelecionado(null);
    setDesconto(0);
    setObservacoes('');
    setValorRecebido(0);
    setTroco(0);
    setCupomDesconto('');
    setParcelamento(1);
    setEntrega(false);
    setEnderecoEntrega('');
    setAgendamento('');
    setGarantia(false);
    setSeguro(false);
    setPausaVenda(false);
    setVendaEmAndamento(false);
    setTempoVenda(0);
  };

  const finalizarVenda = () => {
    const novaVenda = {
      id: gerarCodigoVenda(),
      cliente: clienteSelecionado?.nome || 'Cliente Avulso',
      total,
      itens: carrinho.reduce((acc, item) => acc + item.quantidade, 0),
      horario: horaAtual.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      pagamento: metodoPagamento === 'dinheiro' ? 'Dinheiro' : metodoPagamento === 'cartao' ? 'Cartão' : 'PIX'
    };
    
    // Adicionar ao histórico
    setVendasDia(prev => prev + 1);
    setSaldoCaixa(prev => prev + total);
    
    // Calcular pontos e cashback
    if (clienteSelecionado) {
      const pontosGanhos = calcularPontos(total);
      const cashbackGanho = calcularCashback(total, clienteSelecionado.nivel);
      setPontosGanhos(pontosGanhos);
      setCashback(cashbackGanho);
    }
    
    // Calcular comissão do vendedor
    setComissaoVendedor(prev => prev + calcularComissao(total));
    
    // Limpar venda
    limparVenda();
    
    // Tocar som de sucesso (se ativo)
    if (somAtivo) {
      // Aqui seria reproduzido um som de sucesso
      console.log('🔊 Som de venda finalizada');
    }
    
    // Imprimir cupom (se impressora conectada)
    if (impressoraConectada) {
      console.log('🖨️ Imprimindo cupom fiscal...');
    }
  };

  // Cálculos expandidos
  const subtotal = carrinho.reduce((total, item) => total + (aplicarPromocao(item) * item.quantidade), 0);
  const descontoCliente = clienteSelecionado ? (subtotal * clienteSelecionado.desconto / 100) : 0;
  const descontoAdicional = subtotal * desconto / 100;
  const descontoCupom = cupomDesconto ? subtotal * 0.05 : 0; // 5% de desconto com cupom
  const totalDesconto = descontoCliente + descontoAdicional + descontoCupom;
  const subtotalComDesconto = subtotal - totalDesconto;
  const taxaEntregaFinal = entrega ? calcularTaxaEntrega(subtotalComDesconto) : 0;
  const taxaGarantia = garantia ? subtotalComDesconto * 0.02 : 0; // 2% para garantia estendida
  const taxaSeguro = seguro ? subtotalComDesconto * 0.015 : 0; // 1.5% para seguro
  const total = subtotalComDesconto + taxaEntregaFinal + taxaGarantia + taxaSeguro;
  
  // Cálculo do troco
  useEffect(() => {
    if (valorRecebido > total) {
      setTroco(valorRecebido - total);
    } else {
      setTroco(0);
    }
  }, [valorRecebido, total]);

  // Filtrar e ordenar produtos
  const produtosFiltrados = produtos
    .filter(produto => {
      const matchNome = produto.nome.toLowerCase().includes(buscarProduto.toLowerCase());
      const matchCategoria = filtroCategoria === '' || filtroCategoria === 'Todas' || produto.categoria === filtroCategoria;
      return matchNome && matchCategoria;
    })
    .sort((a, b) => {
      switch (ordenacao) {
        case 'preco':
          return a.preco - b.preco;
        case 'categoria':
          return a.categoria.localeCompare(b.categoria);
        default:
          return a.nome.localeCompare(b.nome);
      }
    });

  return (
    <DashboardLayout>
      <div className="p-6 max-w-full overflow-x-hidden">
        {/* Header Expandido */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ponto de Venda</h1>
                <p className="text-sm text-gray-500">Sistema de vendas integrado</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  caixaAberto ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <Clock className="w-4 h-4 inline mr-1" />
                  {caixaAberto ? 'Aberto' : 'Fechado'}
                </div>
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  <User className="w-4 h-4 inline mr-1" />
                  {vendedor}
                </div>
                <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  <Sun className="w-4 h-4 inline mr-1" />
                  {turno === 'manha' ? 'Manhã' : turno === 'tarde' ? 'Tarde' : 'Noite'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Status de Conexões */}
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-lg ${conexaoInternet ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`} title="Internet">
                  {conexaoInternet ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                </div>
                <div className={`p-2 rounded-lg ${impressoraConectada ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`} title="Impressora">
                  <Printer className="w-4 h-4" />
                </div>
                <div className={`p-2 rounded-lg ${leitorCodigoBarras ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`} title="Leitor de Código">
                  <Barcode className="w-4 h-4" />
                </div>
                <div className={`p-2 rounded-lg ${somAtivo ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`} title="Som">
                  {somAtivo ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </div>
              </div>

              {/* Controles */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowHistorico(!showHistorico)}
                  className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  title="Histórico de Vendas"
                >
                  <History className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowConfiguracoes(!showConfiguracoes)}
                  className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  title="Configurações"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowAjuda(!showAjuda)}
                  className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  title="Ajuda"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
                <div className="relative">
                  <button className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                    <Bell className="w-4 h-4" />
                  </button>
                  {notificacoes > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notificacoes}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Informações do Caixa e Metas */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Saldo Caixa</p>
                  <p className="text-sm font-bold text-gray-900">{formatarMoeda(saldoCaixa)}</p>
                </div>
                <PiggyBank className="w-5 h-5 text-green-600" />
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Vendas Hoje</p>
                  <p className="text-sm font-bold text-gray-900">{vendasDia}</p>
                </div>
                <ShoppingCart className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Meta Dia</p>
                  <p className="text-sm font-bold text-gray-900">{Math.round((saldoCaixa / metaDia) * 100)}%</p>
                </div>
                <Target className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Comissão</p>
                  <p className="text-sm font-bold text-gray-900">{formatarMoeda(comissaoVendedor)}</p>
                </div>
                <Award className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Hora Atual</p>
                  <p className="text-sm font-bold text-gray-900">
                    {horaAtual.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <Clock className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Alertas</p>
                  <p className="text-sm font-bold text-gray-900">{alertasEstoque}</p>
                </div>
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>

          {/* Timer da Venda Atual */}
          {vendaEmAndamento && (
            <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-orange-800">Venda em andamento</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-mono text-orange-700">{formatarTempo(tempoVenda)}</span>
                  <button
                    onClick={() => setPausaVenda(!pausaVenda)}
                    className="p-1 text-orange-600 hover:text-orange-700"
                  >
                    {pausaVenda ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={salvarVenda}
                    className="p-1 text-orange-600 hover:text-orange-700"
                    title="Salvar Venda"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal - Produtos e Carrinho */}
          <div className="lg:col-span-2 space-y-6">
            {/* Busca de Produtos Expandida */}
            <div className="card">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Produtos</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                      className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      title={viewMode === 'grid' ? 'Visualização em Lista' : 'Visualização em Grade'}
                    >
                      {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setShowEstoque(!showEstoque)}
                      className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      title={showEstoque ? 'Ocultar Estoque' : 'Mostrar Estoque'}
                    >
                      {showEstoque ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      title="Escanear Código de Barras"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {/* Busca Principal */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Buscar produtos por nome ou código..."
                      value={buscarProduto}
                      onChange={(e) => setBuscarProduto(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  
                  {/* Filtros */}
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <select
                        value={filtroCategoria}
                        onChange={(e) => setFiltroCategoria(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      >
                        {categorias.map(categoria => (
                          <option key={categoria} value={categoria === 'Todas' ? '' : categoria}>
                            {categoria}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex-1">
                      <select
                        value={ordenacao}
                        onChange={(e) => setOrdenacao(e.target.value as 'nome' | 'preco' | 'categoria')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      >
                        <option value="nome">Ordenar por Nome</option>
                        <option value="preco">Ordenar por Preço</option>
                        <option value="categoria">Ordenar por Categoria</option>
                      </select>
                    </div>
                    
                    <button
                      onClick={() => {
                        setBuscarProduto('');
                        setFiltroCategoria('');
                        setOrdenacao('nome');
                      }}
                      className="px-3 py-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors text-sm flex items-center space-x-1"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Limpar</span>
                    </button>
                  </div>
                  
                  {/* Promoções Ativas */}
                  {promocaoAtiva && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                      <div className="flex items-center space-x-2">
                        <Gift className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm text-yellow-800 font-medium">Promoções Ativas:</span>
                        <div className="flex items-center space-x-2 text-xs">
                          {promocoes.map(promo => (
                            <span key={promo.id} className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                              {promo.nome}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4">
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {produtosFiltrados.map(produto => (
                      <div 
                        key={produto.id}
                        onClick={() => adicionarProduto(produto)}
                        className={`border rounded-lg p-3 hover:shadow-md transition-all cursor-pointer relative ${
                          verificarEstoqueBaixo(produto) 
                            ? 'border-red-300 bg-red-50' 
                            : produto.promocao 
                              ? 'border-yellow-300 bg-yellow-50' 
                              : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        {/* Badges */}
                        <div className="absolute top-2 right-2 flex flex-col space-y-1">
                          {produto.promocao && (
                            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                              PROMO
                            </span>
                          )}
                          {verificarEstoqueBaixo(produto) && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              BAIXO
                            </span>
                          )}
                        </div>
                        
                        <div className="w-full h-20 bg-gray-100 rounded-lg mb-2 flex items-center justify-center relative">
                          <ShoppingCart className="w-8 h-8 text-gray-400" />
                          <span className="absolute bottom-1 right-1 text-xs text-gray-500 bg-white px-1 rounded">
                            #{produto.codigo}
                          </span>
                        </div>
                        
                        <h4 className="font-medium text-sm text-gray-900 truncate mb-1" title={produto.nome}>
                          {produto.nome}
                        </h4>
                        <p className="text-xs text-gray-500 mb-2">{produto.categoria}</p>
                        
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className={`font-bold ${produto.promocao ? 'text-yellow-600' : 'text-orange-600'}`}>
                              {formatarMoeda(aplicarPromocao(produto))}
                            </span>
                            {produto.promocao && (
                              <span className="text-xs text-gray-500 line-through">
                                {formatarMoeda(produto.preco)}
                              </span>
                            )}
                          </div>
                          
                          {showEstoque && (
                            <div className="flex items-center justify-between text-xs">
                              <span className={`${verificarEstoqueBaixo(produto) ? 'text-red-600' : 'text-gray-500'}`}>
                                Est: {produto.estoque}
                              </span>
                              <span className="text-gray-400">
                                {produto.margem}% margem
                              </span>
                            </div>
                          )}
                          
                          {produto.validade && (
                            <div className="text-xs text-gray-400">
                              Val: {new Date(produto.validade).toLocaleDateString('pt-BR')}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {produtosFiltrados.map(produto => (
                      <div 
                        key={produto.id}
                        onClick={() => adicionarProduto(produto)}
                        className={`border rounded-lg p-3 hover:shadow-md transition-all cursor-pointer flex items-center space-x-4 ${
                          verificarEstoqueBaixo(produto) 
                            ? 'border-red-300 bg-red-50' 
                            : produto.promocao 
                              ? 'border-yellow-300 bg-yellow-50' 
                              : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 relative">
                          <Package className="w-6 h-6 text-gray-400" />
                          <span className="absolute bottom-0 right-0 text-xs text-gray-500 bg-white px-1 rounded">
                            #{produto.codigo}
                          </span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900 truncate">{produto.nome}</h4>
                            {produto.promocao && (
                              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                                PROMO
                              </span>
                            )}
                            {verificarEstoqueBaixo(produto) && (
                              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                ESTOQUE BAIXO
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mb-1">{produto.categoria} • {produto.fornecedor}</p>
                          {produto.validade && (
                            <p className="text-xs text-gray-400">
                              Validade: {new Date(produto.validade).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                        </div>
                        
                        <div className="text-right flex-shrink-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`font-bold text-lg ${produto.promocao ? 'text-yellow-600' : 'text-orange-600'}`}>
                              {formatarMoeda(aplicarPromocao(produto))}
                            </span>
                            {produto.promocao && (
                              <span className="text-sm text-gray-500 line-through">
                                {formatarMoeda(produto.preco)}
                              </span>
                            )}
                          </div>
                          {showEstoque && (
                            <div className="text-xs text-gray-500">
                              <div>Estoque: {produto.estoque}</div>
                              <div>Margem: {produto.margem}%</div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {produtosFiltrados.length === 0 && (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Nenhum produto encontrado</p>
                    <p className="text-sm text-gray-400">Tente ajustar os filtros de busca</p>
                  </div>
                )}
              </div>
            </div>

            {/* Carrinho Expandido */}
            <div className="card">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Carrinho ({carrinho.reduce((total, item) => total + item.quantidade, 0)} itens)
                  </h3>
                  <div className="flex items-center space-x-2">
                    {carrinho.length > 0 && (
                      <>
                        <button
                          onClick={salvarVenda}
                          className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                          title="Salvar Venda"
                        >
                          <Save className="w-4 h-4" />
                          <span>Salvar</span>
                        </button>
                        <button
                          onClick={() => setCarrinho([])}
                          className="text-red-600 hover:text-red-700 text-sm flex items-center space-x-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Limpar</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Informações da Venda */}
                {carrinho.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <div className="font-semibold text-gray-900">{formatarMoeda(subtotal)}</div>
                      <div className="text-xs text-gray-500">Subtotal</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <div className="font-semibold text-green-600">-{formatarMoeda(totalDesconto)}</div>
                      <div className="text-xs text-gray-500">Desconto</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-2 text-center">
                      <div className="font-semibold text-orange-600">{formatarMoeda(total)}</div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                {carrinho.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Carrinho vazio</p>
                    <p className="text-sm text-gray-400">Adicione produtos para começar a venda</p>
                    
                    {/* Vendas Salvas */}
                    {vendaSalva.length > 0 && (
                      <div className="mt-6">
                        <p className="text-sm font-medium text-gray-700 mb-3">Vendas Salvas:</p>
                        <div className="space-y-2">
                          {vendaSalva.slice(-3).map(venda => (
                            <button
                              key={venda.id}
                              onClick={() => recuperarVenda(venda.id)}
                              className="w-full p-2 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-blue-900">{venda.id}</span>
                                <span className="text-xs text-blue-600">{formatarMoeda(venda.total)}</span>
                              </div>
                              <div className="text-xs text-blue-700">
                                {venda.carrinho.length} itens • {venda.cliente?.nome || 'Cliente Avulso'}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {carrinho.map((item, index) => {
                      const produto = produtos.find(p => p.id === item.id);
                      const precoComPromocao = aplicarPromocao(item);
                      const temPromocao = produto?.promocao;
                      
                      return (
                        <div key={`${item.id}-${index}`} className={`p-3 rounded-lg border ${
                          temPromocao ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-gray-900 truncate">{item.nome}</h4>
                                {temPromocao && (
                                  <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                                    PROMO
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-sm text-gray-600">
                                  {formatarMoeda(precoComPromocao)} cada
                                </span>
                                {temPromocao && (
                                  <span className="text-xs text-gray-500 line-through">
                                    {formatarMoeda(item.preco)}
                                  </span>
                                )}
                                <span className="text-xs text-gray-400">
                                  #{produto?.codigo}
                                </span>
                              </div>
                              {produto && verificarEstoqueBaixo(produto) && (
                                <div className="text-xs text-red-600 mt-1">
                                  ⚠️ Estoque baixo ({produto.estoque} restantes)
                                </div>
                              )}
                            </div>
                            
                            <div className="text-right ml-4">
                              <div className="font-bold text-gray-900 mb-1">
                                {formatarMoeda(precoComPromocao * item.quantidade)}
                              </div>
                              {temPromocao && (
                                <div className="text-xs text-green-600">
                                  Economia: {formatarMoeda((item.preco - precoComPromocao) * item.quantidade)}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => alterarQuantidade(item.id, item.quantidade - 1)}
                                className="p-1 text-gray-400 hover:text-gray-600 rounded border border-gray-300 hover:border-gray-400"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-12 text-center font-medium bg-white border border-gray-300 rounded px-2 py-1">
                                {item.quantidade}
                              </span>
                              <button
                                onClick={() => alterarQuantidade(item.id, item.quantidade + 1)}
                                className="p-1 text-gray-400 hover:text-gray-600 rounded border border-gray-300 hover:border-gray-400"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  const novaObservacao = prompt('Observação para este item:', '');
                                  if (novaObservacao !== null) {
                                    // Aqui você salvaria a observação do item
                                    console.log(`Observação para ${item.nome}: ${novaObservacao}`);
                                  }
                                }}
                                className="p-1 text-gray-400 hover:text-blue-600 rounded"
                                title="Adicionar Observação"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => removerProduto(item.id)}
                                className="p-1 text-gray-400 hover:text-red-600 rounded"
                                title="Remover Item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Observações Gerais */}
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <label className="block text-sm font-medium text-blue-900 mb-2">
                        Observações da Venda:
                      </label>
                      <textarea
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                        placeholder="Adicione observações sobre esta venda..."
                        className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        rows={2}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Coluna Lateral - Cliente e Pagamento */}
          <div className="space-y-6">
            {/* Identificação do Cliente */}
            <div className="card">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Cliente</h3>
              </div>
              <div className="p-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar cliente por nome ou telefone..."
                    value={buscarCliente}
                    onChange={(e) => setBuscarCliente(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                {buscarCliente && (
                  <div className="space-y-2 mb-4">
                    {clientesMock.filter(cliente => 
                      cliente.nome.toLowerCase().includes(buscarCliente.toLowerCase()) ||
                      cliente.telefone.includes(buscarCliente)
                    ).map(cliente => (
                      <div 
                        key={cliente.id}
                        onClick={() => {
                          setClienteSelecionado(cliente);
                          setBuscarCliente('');
                        }}
                        className="p-2 border border-gray-200 rounded-lg hover:border-orange-300 cursor-pointer"
                      >
                        <div className="font-medium text-sm">{cliente.nome}</div>
                        <div className="text-xs text-gray-500">{cliente.telefone}</div>
                      </div>
                    ))}
                  </div>
                )}

                {clienteSelecionado ? (
                  <div className="space-y-4">
                    {/* Informações Principais do Cliente */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <User className="w-5 h-5 text-orange-600" />
                          <span className="font-medium text-gray-900">{clienteSelecionado.nome}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            clienteSelecionado.nivel === 'Platinum' ? 'bg-purple-100 text-purple-800' :
                            clienteSelecionado.nivel === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                            clienteSelecionado.nivel === 'Silver' ? 'bg-gray-100 text-gray-800' :
                            'bg-bronze-100 text-bronze-800'
                          }`}>
                            {clienteSelecionado.nivel}
                          </span>
                        </div>
                        <button
                          onClick={() => setClienteSelecionado(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Telefone:</span>
                            <span className="text-gray-900">{clienteSelecionado.telefone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Email:</span>
                            <span className="text-gray-900 truncate">{clienteSelecionado.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Última Compra:</span>
                            <span className="text-gray-900">{clienteSelecionado.ultimaCompra || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Compras:</span>
                            <span className="text-gray-900 font-medium">{formatarMoeda(clienteSelecionado.totalCompras || 0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Frequência:</span>
                            <span className={`font-medium ${
                              clienteSelecionado.frequencia === 'Muito Alta' ? 'text-green-600' :
                              clienteSelecionado.frequencia === 'Alta' ? 'text-blue-600' :
                              clienteSelecionado.frequencia === 'Média' ? 'text-yellow-600' :
                              'text-gray-600'
                            }`}>
                              {clienteSelecionado.frequencia || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Aniversário:</span>
                            <span className="text-gray-900">{clienteSelecionado.aniversario || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Pets do Cliente */}
                      {clienteSelecionado.pets && clienteSelecionado.pets.length > 0 && (
                        <div className="border-t border-orange-200 pt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Pets:</p>
                          <div className="flex flex-wrap gap-1">
                            {clienteSelecionado.pets.map((pet, index) => (
                              <span key={index} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                                {pet}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sistema de Pontos e Fidelidade */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900 flex items-center">
                          <Crown className="w-4 h-4 mr-2 text-purple-600" />
                          Programa de Fidelidade
                        </h4>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-bold text-purple-600">{clienteSelecionado.pontos}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Desconto Atual:</span>
                          <span className="text-green-600 font-bold">{clienteSelecionado.desconto}%</span>
                        </div>
                        
                        {carrinho.length > 0 && (
                          <>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">Pontos desta Compra:</span>
                              <span className="text-purple-600 font-medium">+{calcularPontos(total)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">Cashback:</span>
                              <span className="text-green-600 font-medium">
                                {formatarMoeda(calcularCashback(total, clienteSelecionado.nivel))}
                              </span>
                            </div>
                          </>
                        )}
                        
                        {/* Progresso para próximo nível */}
                        <div className="bg-white rounded-lg p-3 border border-purple-200">
                          <div className="flex justify-between items-center text-xs mb-2">
                            <span className="text-gray-600">Próximo Nível:</span>
                            <span className="text-purple-600 font-medium">
                              {proximoNivel - clienteSelecionado.pontos} pontos restantes
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(clienteSelecionado.pontos / proximoNivel) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Preferências e Histórico */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Heart className="w-4 h-4 mr-2 text-blue-600" />
                        Preferências
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {clienteSelecionado.preferencias?.map((pref, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {pref}
                          </span>
                        ))}
                      </div>
                      
                      {clienteSelecionado.endereco && (
                        <div className="mt-3 pt-3 border-t border-blue-200">
                          <div className="flex items-center space-x-2 text-sm">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span className="text-gray-700">{clienteSelecionado.endereco}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Ações Rápidas */}
                    <div className="grid grid-cols-2 gap-2">
                      <button className="flex items-center justify-center space-x-2 p-2 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-sm">
                        <Phone className="w-4 h-4 text-green-600" />
                        <span className="text-green-700">Ligar</span>
                      </button>
                      <button className="flex items-center justify-center space-x-2 p-2 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-sm">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-700">Email</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <User className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Nenhum cliente selecionado</p>
                    <p className="text-xs text-gray-400">Busque ou adicione um cliente</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sugestões de Upsell/Cross-sell */}
            {carrinho.length > 0 && (
              <div className="card">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                    Sugestões
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  {sugestoes.map(sugestao => (
                    <div key={sugestao.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm text-gray-900">{sugestao.nome}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          sugestao.tipo === 'upsell' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {sugestao.tipo === 'upsell' ? 'Upsell' : 'Cross-sell'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{sugestao.motivo}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-orange-600">R$ {sugestao.preco.toFixed(2)}</span>
                        <button
                          onClick={() => adicionarProduto(sugestao)}
                          className="bg-orange-600 text-white px-3 py-1 rounded text-xs hover:bg-orange-700 flex items-center space-x-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Adicionar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resumo e Pagamento Expandido */}
            {carrinho.length > 0 && (
              <div className="card">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Resumo da Venda</h3>
                    <span className="text-sm text-gray-500">#{gerarCodigoVenda()}</span>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  {/* Cálculos Expandidos */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal ({carrinho.reduce((acc, item) => acc + item.quantidade, 0)} itens):</span>
                        <span className="text-gray-900">{formatarMoeda(subtotal)}</span>
                      </div>
                      
                      {clienteSelecionado && descontoCliente > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Desconto {clienteSelecionado.nivel} ({clienteSelecionado.desconto}%):</span>
                          <span>-{formatarMoeda(descontoCliente)}</span>
                        </div>
                      )}
                      
                      {desconto > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Desconto Adicional ({desconto}%):</span>
                          <span>-{formatarMoeda(descontoAdicional)}</span>
                        </div>
                      )}
                      
                      {cupomDesconto && descontoCupom > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Cupom de Desconto (5%):</span>
                          <span>-{formatarMoeda(descontoCupom)}</span>
                        </div>
                      )}
                      
                      {entrega && (
                        <div className="flex justify-between text-blue-600">
                          <span>Taxa de Entrega:</span>
                          <span>{taxaEntregaFinal > 0 ? formatarMoeda(taxaEntregaFinal) : 'GRÁTIS'}</span>
                        </div>
                      )}
                      
                      {garantia && (
                        <div className="flex justify-between text-purple-600">
                          <span>Garantia Estendida (2%):</span>
                          <span>+{formatarMoeda(taxaGarantia)}</span>
                        </div>
                      )}
                      
                      {seguro && (
                        <div className="flex justify-between text-purple-600">
                          <span>Seguro do Produto (1.5%):</span>
                          <span>+{formatarMoeda(taxaSeguro)}</span>
                        </div>
                      )}
                      
                      <div className="border-t border-gray-300 pt-2 mt-2">
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total:</span>
                          <span className="text-orange-600">{formatarMoeda(total)}</span>
                        </div>
                      </div>
                      
                      {/* Informações de Pontos e Cashback */}
                      {clienteSelecionado && (
                        <div className="border-t border-gray-300 pt-2 mt-2 space-y-1">
                          <div className="flex justify-between text-purple-600">
                            <span>Pontos a Ganhar:</span>
                            <span>+{calcularPontos(total)} pontos</span>
                          </div>
                          <div className="flex justify-between text-green-600">
                            <span>Cashback:</span>
                            <span>{formatarMoeda(calcularCashback(total, clienteSelecionado.nivel))}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cupom de Desconto */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Cupom de Desconto:</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Digite o código do cupom"
                        value={cupomDesconto}
                        onChange={(e) => setCupomDesconto(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      />
                      <button
                        onClick={() => {
                          if (cupomDesconto.toLowerCase() === 'desconto5') {
                            alert('Cupom aplicado! 5% de desconto');
                          } else if (cupomDesconto) {
                            alert('Cupom inválido');
                            setCupomDesconto('');
                          }
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>

                  {/* Opções da Venda */}
                  <div className="space-y-3">
                    {/* Desconto Adicional */}
                    <div className="flex items-center space-x-2">
                      <Percent className="w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        placeholder="Desconto %"
                        value={desconto}
                        onChange={(e) => setDesconto(Number(e.target.value))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                        min="0"
                        max="100"
                      />
                    </div>

                    {/* Opções Extras */}
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={entrega}
                          onChange={(e) => setEntrega(e.target.checked)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">Entrega</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={garantia}
                          onChange={(e) => setGarantia(e.target.checked)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">Garantia</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={seguro}
                          onChange={(e) => setSeguro(e.target.checked)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">Seguro</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={fidelidade}
                          onChange={(e) => setFidelidade(e.target.checked)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">Fidelidade</span>
                      </label>
                    </div>

                    {/* Endereço de Entrega */}
                    {entrega && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Endereço de Entrega:</label>
                        <input
                          type="text"
                          placeholder="Digite o endereço completo"
                          value={enderecoEntrega}
                          onChange={(e) => setEnderecoEntrega(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                        />
                      </div>
                    )}

                    {/* Agendamento */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Agendamento (Opcional):</label>
                      <input
                        type="datetime-local"
                        value={agendamento}
                        onChange={(e) => setAgendamento(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Método de Pagamento Expandido */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-700">Método de Pagamento:</label>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setMetodoPagamento('dinheiro')}
                        className={`p-3 border rounded-lg text-xs font-medium transition-colors ${
                          metodoPagamento === 'dinheiro'
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        <Banknote className="w-5 h-5 mx-auto mb-1" />
                        Dinheiro
                      </button>
                      <button
                        onClick={() => setMetodoPagamento('cartao')}
                        className={`p-3 border rounded-lg text-xs font-medium transition-colors ${
                          metodoPagamento === 'cartao'
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        <CreditCard className="w-5 h-5 mx-auto mb-1" />
                        Cartão
                      </button>
                      <button
                        onClick={() => setMetodoPagamento('pix')}
                        className={`p-3 border rounded-lg text-xs font-medium transition-colors ${
                          metodoPagamento === 'pix'
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        <QrCode className="w-5 h-5 mx-auto mb-1" />
                        PIX
                      </button>
                    </div>

                    {/* Opções específicas por método de pagamento */}
                    {metodoPagamento === 'cartao' && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-3">
                        <div className="flex items-center space-x-2">
                          <label className="text-sm font-medium text-blue-900">Parcelamento:</label>
                          <select
                            value={parcelamento}
                            onChange={(e) => setParcelamento(Number(e.target.value))}
                            className="px-2 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {[1,2,3,4,5,6,7,8,9,10,11,12].map(parcela => (
                              <option key={parcela} value={parcela}>
                                {parcela}x {parcela === 1 ? 'à vista' : `de ${formatarMoeda(total / parcela)}`}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="text-xs text-blue-700">
                          {parcelamento > 1 && `Total parcelado: ${formatarMoeda(total)} em ${parcelamento}x`}
                        </div>
                      </div>
                    )}

                    {metodoPagamento === 'dinheiro' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-3">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-green-900">Valor Recebido:</label>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="0,00"
                            value={valorRecebido || ''}
                            onChange={(e) => setValorRecebido(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                          />
                        </div>
                        {troco > 0 && (
                          <div className="bg-green-100 border border-green-300 rounded-lg p-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-green-900">Troco:</span>
                              <span className="text-lg font-bold text-green-700">{formatarMoeda(troco)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Botões de Ação Expandidos */}
                  <div className="space-y-3">
                    {/* Botões específicos por método de pagamento */}
                    {metodoPagamento === 'pix' && (
                      <button
                        onClick={() => setShowQRCode(!showQRCode)}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <QrCode className="w-5 h-5" />
                        <span>{showQRCode ? 'Ocultar' : 'Gerar'} QR Code PIX</span>
                      </button>
                    )}

                    {metodoPagamento === 'cartao' && (
                      <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
                        <CreditCard className="w-5 h-5" />
                        <span>Processar Cartão</span>
                      </button>
                    )}

                    {/* Botões de ação secundários */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={salvarVenda}
                        className="flex items-center justify-center space-x-2 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        <Save className="w-4 h-4" />
                        <span>Salvar</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          if (impressoraConectada) {
                            console.log('🖨️ Imprimindo orçamento...');
                            alert('Orçamento enviado para impressão!');
                          } else {
                            alert('Impressora não conectada!');
                          }
                        }}
                        className="flex items-center justify-center space-x-2 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Orçamento</span>
                      </button>
                    </div>
                    
                    {/* Botão principal de finalização */}
                    <button 
                      onClick={finalizarVenda}
                      disabled={metodoPagamento === 'dinheiro' && valorRecebido < total}
                      className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-4 rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200 flex items-center justify-center space-x-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>
                        {metodoPagamento === 'dinheiro' && valorRecebido < total
                          ? `Faltam ${formatarMoeda(total - valorRecebido)}`
                          : 'Finalizar Venda'
                        }
                      </span>
                    </button>

                    {/* Informações adicionais */}
                    <div className="text-center text-xs text-gray-500 space-y-1">
                      <div>Vendedor: {vendedor} • Turno: {turno}</div>
                      <div>Comissão desta venda: {formatarMoeda(calcularComissao(total))}</div>
                      {vendaEmAndamento && (
                        <div className="text-orange-600 font-medium">
                          Tempo de atendimento: {formatarTempo(tempoVenda)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* QR Code PIX Expandido */}
                  {showQRCode && metodoPagamento === 'pix' && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 text-center">
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-blue-900 mb-2">Pagamento PIX</h4>
                        <p className="text-sm text-blue-700">Escaneie o código ou copie a chave</p>
                      </div>
                      
                      <div className="w-40 h-40 bg-white border-2 border-blue-300 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                        <QrCode className="w-24 h-24 text-blue-400" />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="bg-white border border-blue-200 rounded-lg p-3">
                          <div className="text-sm text-gray-600 mb-1">Valor a Pagar:</div>
                          <div className="text-2xl font-bold text-blue-900">{formatarMoeda(total)}</div>
                        </div>
                        
                        <div className="bg-white border border-blue-200 rounded-lg p-3">
                          <div className="text-sm text-gray-600 mb-2">Chave PIX:</div>
                          <div className="flex items-center space-x-2">
                            <code className="flex-1 text-xs bg-gray-100 p-2 rounded border text-gray-800">
                              petshop@exemplo.com.br
                            </code>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText('petshop@exemplo.com.br');
                                alert('Chave PIX copiada!');
                              }}
                              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                              title="Copiar Chave PIX"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-white border border-blue-200 rounded-lg p-2">
                            <div className="text-gray-600">Beneficiário:</div>
                            <div className="font-medium text-gray-900">Pet Shop Life</div>
                          </div>
                          <div className="bg-white border border-blue-200 rounded-lg p-2">
                            <div className="text-gray-600">CNPJ:</div>
                            <div className="font-medium text-gray-900">12.345.678/0001-90</div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-blue-600 space-y-1">
                          <div>• Pagamento confirmado automaticamente</div>
                          <div>• Disponível 24h por dia</div>
                          <div>• Sem taxas adicionais</div>
                        </div>
                        
                        {/* Timer de expiração */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                          <div className="text-xs text-yellow-800">
                            ⏰ Este QR Code expira em: <span className="font-mono font-bold">14:59</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal de Histórico */}
        {showHistorico && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Histórico de Vendas - Hoje</h3>
                <button
                  onClick={() => setShowHistorico(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="space-y-3">
                  {historicoVendas.map(venda => (
                    <div key={venda.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Receipt className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{venda.id}</div>
                            <div className="text-sm text-gray-500">{venda.cliente}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">{formatarMoeda(venda.total)}</div>
                          <div className="text-sm text-gray-500">{venda.itens} itens • {venda.horario}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            venda.pagamento === 'PIX' ? 'bg-blue-100 text-blue-800' :
                            venda.pagamento === 'Cartão' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {venda.pagamento}
                          </span>
                          <button className="p-2 text-gray-400 hover:text-orange-600 rounded-lg">
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Configurações */}
        {showConfiguracoes && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Configurações do PDV</h3>
                <button
                  onClick={() => setShowConfiguracoes(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
                {/* Configurações de Interface */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Interface</h4>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Modo Escuro</span>
                      <input
                        type="checkbox"
                        checked={modoEscuro}
                        onChange={(e) => setModoEscuro(e.target.checked)}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Sons do Sistema</span>
                      <input
                        type="checkbox"
                        checked={somAtivo}
                        onChange={(e) => setSomAtivo(e.target.checked)}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Mostrar Estoque nos Produtos</span>
                      <input
                        type="checkbox"
                        checked={showEstoque}
                        onChange={(e) => setShowEstoque(e.target.checked)}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                    </label>
                  </div>
                </div>

                {/* Configurações de Hardware */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Hardware</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Impressora</span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs ${impressoraConectada ? 'text-green-600' : 'text-red-600'}`}>
                          {impressoraConectada ? 'Conectada' : 'Desconectada'}
                        </span>
                        <button
                          onClick={() => setImpressoraConectada(!impressoraConectada)}
                          className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                        >
                          {impressoraConectada ? 'Desconectar' : 'Conectar'}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Leitor de Código</span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs ${leitorCodigoBarras ? 'text-green-600' : 'text-red-600'}`}>
                          {leitorCodigoBarras ? 'Ativo' : 'Inativo'}
                        </span>
                        <button
                          onClick={() => setLeitorCodigoBarras(!leitorCodigoBarras)}
                          className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                        >
                          {leitorCodigoBarras ? 'Desativar' : 'Ativar'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informações do Sistema */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Sistema</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Versão:</span>
                      <span className="text-gray-900">{versaoSistema}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Última Atualização:</span>
                      <span className="text-gray-900">{ultimaAtualizacao}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Licença:</span>
                      <span className={`${licencaAtiva ? 'text-green-600' : 'text-red-600'}`}>
                        {licencaAtiva ? 'Ativa' : 'Expirada'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Suporte até:</span>
                      <span className="text-gray-900">{suporteExpira}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Ajuda */}
        {showAjuda && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Central de Ajuda</h3>
                <button
                  onClick={() => setShowAjuda(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
                {/* Atalhos do Teclado */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Atalhos do Teclado</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nova Venda:</span>
                      <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">Ctrl + N</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Buscar Produto:</span>
                      <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">Ctrl + F</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Finalizar Venda:</span>
                      <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">F12</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Limpar Carrinho:</span>
                      <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">Ctrl + L</kbd>
                    </div>
                  </div>
                </div>

                {/* Dicas Rápidas */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Dicas Rápidas</h4>
                  <div className="space-y-3 text-sm">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="font-medium text-blue-900 mb-1">💡 Código de Barras</div>
                      <div className="text-blue-700">Use o leitor ou digite o código manualmente no campo de busca</div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="font-medium text-green-900 mb-1">🎯 Sugestões Inteligentes</div>
                      <div className="text-green-700">O sistema sugere produtos complementares automaticamente</div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <div className="font-medium text-purple-900 mb-1">⭐ Programa de Fidelidade</div>
                      <div className="text-purple-700">Clientes ganham pontos e descontos automáticos</div>
                    </div>
                  </div>
                </div>

                {/* Suporte */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Precisa de Ajuda?</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-700 text-sm">Ligar Suporte</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                      <MessageCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-700 text-sm">Chat Online</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}