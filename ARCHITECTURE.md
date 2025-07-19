# Arquitetura do Projeto

## Visão Geral

Este projeto utiliza uma arquitetura **modular bem organizada** baseada em Next.js 13+ com App Router, seguindo princípios de separação de responsabilidades e reutilização de código.

## Estrutura de Pastas

```
/app                    # Roteamento (App Router do Next.js)
  /clientes            # Página de clientes
  /produtos            # Página de produtos
  /estoque             # Página de estoque
  /...                 # Outras páginas

/components             # Componentes React
  /ui                  # Design System (Button, Input, Modal)
  /shared              # Componentes reutilizáveis (DataTable, Pagination)
  /domain              # Componentes específicos por domínio
    /produtos          # Componentes específicos de produtos
    /clientes          # Componentes específicos de clientes
  /layout              # Componentes de layout

/lib                    # Lógica de negócio e utilitários
  /api                 # Cliente HTTP
  /services            # Serviços de negócio
  /utils               # Utilitários gerais
  /validators          # Validadores

/hooks                  # Custom hooks
/types                  # Tipagens TypeScript
/constants             # Constantes da aplicação
```

## Camadas da Arquitetura

### 1. **Apresentação (UI)**
- **Componentes UI**: Botões, inputs, modais reutilizáveis
- **Componentes Shared**: Tabelas, paginação, filtros
- **Componentes Domain**: Específicos por área de negócio

### 2. **Lógica de Negócio**
- **Services**: Operações CRUD e regras de negócio
- **Hooks**: Estado e lógica compartilhada
- **Validators**: Validação de dados

### 3. **Dados**
- **API Client**: Cliente HTTP centralizado
- **Types**: Tipagens para entidades e API

## Tecnologias Utilizadas

- **Next.js 13+** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Biblioteca de ícones

## Padrões Implementados

### 1. **Separação de Responsabilidades**
```typescript
// ❌ Antes: Lógica misturada no componente
function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  
  useEffect(() => {
    fetch('/api/produtos')
      .then(res => res.json())
      .then(setProdutos);
  }, []);
  
  // ... resto do componente
}

// ✅ Depois: Lógica separada em hook
function ProdutosPage() {
  const { produtos, loading, error } = useProdutos();
  // ... apenas UI
}
```

### 2. **Componentes Reutilizáveis**
```typescript
// ✅ DataTable genérica
<DataTable
  data={produtos}
  columns={columns}
  loading={loading}
  onSort={handleSort}
/>
```

### 3. **Tipagem Forte**
```typescript
// ✅ Interfaces bem definidas
interface Produto {
  id: string;
  nome: string;
  preco: number;
  categoria: string;
}
```

### 4. **Constantes Centralizadas**
```typescript
// ✅ Constantes organizadas
export const ROUTES = {
  PRODUTOS: '/produtos',
  CLIENTES: '/clientes',
} as const;
```

## Exemplos de Uso

### Criando um Novo Serviço
```typescript
// lib/services/vendas.service.ts
export class VendasService {
  private endpoint = '/vendas';

  async getAll(params?: VendasParams): Promise<PaginatedResponse<Venda>> {
    // implementação
  }
}
```

### Criando um Hook Customizado
```typescript
// hooks/useVendas.ts
export function useVendas(params: UseVendasParams = {}) {
  const [vendas, setVendas] = useState<Venda[]>([]);
  // ... lógica do hook
  
  return {
    vendas,
    loading,
    error,
    createVenda,
    updateVenda,
  };
}
```

### Usando Componentes Reutilizáveis
```typescript
// components/domain/vendas/VendasList.tsx
export function VendasList() {
  const { vendas, loading } = useVendas();
  
  return (
    <DataTable
      data={vendas}
      columns={columns}
      loading={loading}
    />
  );
}
```

## Benefícios da Arquitetura

### ✅ **Manutenibilidade**
- Código organizado por responsabilidade
- Fácil localização de funcionalidades
- Componentes pequenos e focados

### ✅ **Reutilização**
- Componentes UI reutilizáveis
- Hooks compartilhados
- Serviços centralizados

### ✅ **Testabilidade**
- Lógica separada da UI
- Funções puras
- Mocks facilitados

### ✅ **Escalabilidade**
- Estrutura preparada para crescimento
- Padrões consistentes
- Tipagem forte

### ✅ **Developer Experience**
- IntelliSense completo
- Refatoração segura
- Detecção precoce de erros

## Próximos Passos

1. **Testes**: Implementar testes unitários e de integração
2. **Estado Global**: Adicionar Zustand ou Redux Toolkit se necessário
3. **Cache**: Implementar React Query para cache de dados
4. **Monitoramento**: Adicionar logging e métricas
5. **Performance**: Implementar lazy loading e otimizações

## Convenções

### Nomenclatura
- **Componentes**: PascalCase (`ProductsList`)
- **Hooks**: camelCase com prefixo `use` (`useProducts`)
- **Services**: camelCase com sufixo `.service` (`products.service`)
- **Types**: PascalCase (`Product`, `ApiResponse`)

### Estrutura de Arquivos
- Um componente por arquivo
- Exports nomeados preferencialmente
- Index files para re-exports quando necessário

### Imports
```typescript
// ✅ Ordem recomendada
import React from 'react';           // React
import { NextPage } from 'next';     // Next.js
import { Button } from '@/components/ui/Button';  // Componentes
import { useProducts } from '@/hooks/useProducts'; // Hooks
import { Product } from '@/types/entities';        // Types
import { ROUTES } from '@/constants';              // Constants
```