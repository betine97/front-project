# Debug - Carregamento de Públicos na Modal

## Implementação Atual

### 1. **Endpoint Configurado**
- ✅ **URL**: `GET localhost:8080/api/publicos`
- ✅ **Parâmetros**: `?page=1&limit=30`
- ✅ **Resposta Esperada**:
```json
{
  "publicos": [
    {
      "id": 6,
      "nome": "CNPJ",
      "descricao": "Só clientes que possuem CNPJ",
      "data_criacao": "2025-08-09",
      "status": "Ativo"
    }
  ],
  "total": 4,
  "page": 1,
  "limit": 30,
  "total_pages": 1
}
```

### 2. **Serviço Configurado** (`lib/services/publicos.service.ts`)
- ✅ Usa `apiClient` com autenticação JWT
- ✅ Faz chamada para `/api/publicos?page=1&limit=30`
- ✅ Adapta resposta para formato esperado
- ✅ Logs detalhados para debug

### 3. **Hook Configurado** (`hooks/usePublicos.ts`)
- ✅ Gerencia estado dos públicos
- ✅ Função `fetchPublicos()` disponível
- ✅ Estados de loading e erro
- ✅ Logs detalhados para debug

### 4. **Modal Configurada** (`components/marketing/NovaCampanhaModal.tsx`)
- ✅ Importa hook `usePublicos`
- ✅ `useEffect` carrega públicos quando modal abre
- ✅ Interface de seleção implementada
- ✅ Debug visual com informações em tempo real

## Fluxo de Carregamento

### 1. **Abertura da Modal**
```typescript
// useEffect dispara quando isOpen = true
useEffect(() => {
  if (isOpen && publicos.length === 0) {
    fetchPublicos(); // Chama hook
  }
}, [isOpen, publicos.length, fetchPublicos]);
```

### 2. **Hook usePublicos**
```typescript
const fetchPublicos = async () => {
  setLoading('loading');
  const response = await publicosService.getPublicos({ page: 1, limit: 30 });
  setPublicos(response.publicos || []);
};
```

### 3. **Serviço PublicosService**
```typescript
async getPublicos(params) {
  const response = await apiClient.get('/api/publicos?page=1&limit=30');
  return {
    publicos: response.data.publicos || [],
    total: response.data.total || 0
  };
}
```

### 4. **ApiClient**
```typescript
// Faz requisição com JWT
GET http://localhost:8080/api/publicos?page=1&limit=30
Headers: {
  'Authorization': 'Bearer [JWT_TOKEN]',
  'Content-Type': 'application/json'
}
```

## Debug Implementado

### 1. **Console Logs**
- `[NovaCampanhaModal]` - Logs da modal
- `[usePublicos]` - Logs do hook
- `[PublicosService]` - Logs do serviço

### 2. **Debug Visual na Modal**
```
┌─ Debug: ──────────────────────────────────────┐
│ • Loading: Não                                │
│ • Públicos carregados: 4                      │
│ • Endpoint: GET localhost:8080/api/publicos   │
│ • Primeiro público: CNPJ                      │
│ [Recarregar Públicos]                         │
└───────────────────────────────────────────────┘
```

### 3. **Botão de Teste**
- Força recarregamento dos públicos
- Mostra estado de loading
- Permite testar a integração manualmente

## Como Testar

### 1. **Abrir Modal**
- Clique em "Nova Campanha"
- Verifique logs no console
- Observe seção de debug

### 2. **Verificar Carregamento**
- Loading deve aparecer como "Sim" inicialmente
- Depois mudar para "Não" quando carregar
- Contador de públicos deve mostrar quantidade

### 3. **Testar Manualmente**
- Use botão "Recarregar Públicos"
- Verifique logs detalhados no console
- Confirme se API está respondendo

### 4. **Verificar Seleção**
- Públicos devem aparecer na lista
- Checkboxes devem funcionar
- Contador deve atualizar

## Possíveis Problemas

### 1. **API não está rodando**
- Verificar se localhost:8080 está ativo
- Testar endpoint diretamente no browser/Postman

### 2. **Token JWT inválido**
- Verificar se usuário está logado
- Token pode ter expirado

### 3. **Estrutura de resposta diferente**
- API pode estar retornando formato diferente
- Logs mostrarão estrutura real

### 4. **CORS ou rede**
- Verificar se há bloqueios de CORS
- Problemas de conectividade

## Próximos Passos

1. **Testar a modal** e verificar logs
2. **Confirmar se API responde** corretamente
3. **Ajustar estrutura** se necessário
4. **Remover debug** quando funcionando
5. **Implementar tratamento de erro** mais robusto

A implementação está completa e com debug extensivo para identificar qualquer problema!