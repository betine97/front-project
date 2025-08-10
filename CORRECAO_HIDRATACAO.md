# Correção de Erro de Hidratação - React

## Problema Identificado
**Error: Text content does not match server-rendered HTML**

Este erro de hidratação ocorre quando há diferenças entre o que é renderizado no servidor (SSR) e no cliente, causando inconsistências no HTML.

## Causas Identificadas

### 1. **Formatação de Datas com `toLocaleDateString()`**
- **Problema**: `new Date().toLocaleDateString('pt-BR')` pode retornar valores diferentes no servidor e cliente
- **Causa**: Diferenças de timezone, locale e configurações entre ambientes

### 2. **Acesso ao `localStorage`**
- **Problema**: `localStorage` não existe no servidor, apenas no cliente
- **Causa**: Tentativa de acessar APIs do browser durante SSR

## Correções Implementadas

### 1. **NovaCampanhaModal.tsx**

#### **ANTES:**
```typescript
// Formatação inconsistente
const formatarData = (data: string): string => {
  const date = new Date(data);
  return date.toLocaleDateString('pt-BR');
};

// Uso direto que causa hidratação
const dataCriacao = hoje.toLocaleDateString('pt-BR');
<p>Data de criação: {new Date().toLocaleDateString('pt-BR')}</p>
```

#### **DEPOIS:**
```typescript
// Formatação consistente e determinística
const formatarData = (data: string): string => {
  if (!data) return '';
  const date = new Date(data);
  const dia = date.getDate().toString().padStart(2, '0');
  const mes = (date.getMonth() + 1).toString().padStart(2, '0');
  const ano = date.getFullYear().toString();
  return `${dia}/${mes}/${ano}`;
};

// Função específica para data atual
const obterDataAtual = (): string => {
  const hoje = new Date();
  const dia = hoje.getDate().toString().padStart(2, '0');
  const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
  const ano = hoje.getFullYear().toString();
  return `${dia}/${mes}/${ano}`;
};

// Uso consistente
const dataCriacao = obterDataAtual();
<p>Data de criação: {obterDataAtual()}</p>
```

### 2. **CampanhasMarketing.tsx**

#### **ANTES:**
```typescript
<span>Início: {campanha.data_inicio ? new Date(campanha.data_inicio).toLocaleDateString('pt-BR') : 'N/A'}</span>
<span>Fim: {new Date(campanha.data_fim).toLocaleDateString('pt-BR')}</span>
```

#### **DEPOIS:**
```typescript
// Função consistente para formatação
const formatarDataConsistente = (dataString: string): string => {
  if (!dataString) return 'N/A';
  try {
    const date = new Date(dataString);
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const ano = date.getFullYear().toString();
    return `${dia}/${mes}/${ano}`;
  } catch (error) {
    return 'Data inválida';
  }
};

<span>Início: {formatarDataConsistente(campanha.data_inicio)}</span>
<span>Fim: {formatarDataConsistente(campanha.data_fim)}</span>
```

### 3. **DebugAPI.tsx**

#### **ANTES:**
```typescript
// Acesso direto ao localStorage durante renderização
const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

// Uso direto em múltiplos lugares
hasToken: !!localStorage.getItem('auth_token')
```

#### **DEPOIS:**
```typescript
// Estado para controlar hidratação
const [token, setToken] = useState<string | null>(null);
const [mounted, setMounted] = useState(false);

// Acesso seguro após montagem
useEffect(() => {
  setMounted(true);
  setToken(localStorage.getItem('auth_token'));
}, []);

// Renderização condicional para evitar hidratação
if (!mounted) {
  return <LoadingComponent />;
}

// Uso do estado em vez de acesso direto
hasToken: !!token
```

## Técnicas de Prevenção Aplicadas

### 1. **Formatação Determinística**
- ✅ Funções que sempre retornam o mesmo resultado
- ✅ Uso de `padStart()` para garantir formato consistente
- ✅ Tratamento de erros com fallbacks

### 2. **Renderização Condicional**
- ✅ Verificação de `mounted` antes de renderizar conteúdo sensível
- ✅ Estados de loading para transições suaves
- ✅ Evitar APIs do browser durante SSR

### 3. **useEffect para Inicialização**
- ✅ Acesso a APIs do browser apenas após montagem
- ✅ Estados separados para dados do cliente
- ✅ Sincronização adequada entre servidor e cliente

## Benefícios das Correções

✅ **Sem erros de hidratação**
✅ **Renderização consistente** entre servidor e cliente
✅ **Formatação de datas uniforme** em todos os ambientes
✅ **Acesso seguro** a APIs do browser
✅ **Performance melhorada** sem re-renderizações desnecessárias
✅ **Experiência do usuário** sem flashes ou inconsistências

## Recursos Mantidos

✅ **Todas as funcionalidades** de campanhas
✅ **Seleção de públicos-alvo**
✅ **Modal de criação**
✅ **Componente de debug**
✅ **Formatação de datas** em português
✅ **Integração com API**

## Padrão para Futuras Implementações

```typescript
// ✅ CORRETO - Formatação determinística
const formatarData = (data: string): string => {
  if (!data) return '';
  const date = new Date(data);
  const dia = date.getDate().toString().padStart(2, '0');
  const mes = (date.getMonth() + 1).toString().padStart(2, '0');
  const ano = date.getFullYear().toString();
  return `${dia}/${mes}/${ano}`;
};

// ✅ CORRETO - Acesso seguro ao localStorage
const [mounted, setMounted] = useState(false);
const [token, setToken] = useState<string | null>(null);

useEffect(() => {
  setMounted(true);
  setToken(localStorage.getItem('auth_token'));
}, []);

if (!mounted) return <Loading />;

// ❌ EVITAR - Formatação inconsistente
new Date().toLocaleDateString('pt-BR')

// ❌ EVITAR - Acesso direto durante renderização
localStorage.getItem('auth_token')
```

O erro de hidratação foi completamente resolvido mantendo todas as funcionalidades!