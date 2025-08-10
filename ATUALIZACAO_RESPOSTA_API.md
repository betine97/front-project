# Atualização - Nova Estrutura de Resposta da API

## Mudança na API
A API de criação de campanhas agora retorna uma estrutura diferente:

**ANTES:**
```json
{
  "id": 18,
  "nome": "Campanha Black Friday 2025",
  "desc": "Promoção especial para pets",
  // ... outros campos da campanha
}
```

**DEPOIS:**
```json
{
  "message": "Campanha created successfully",
  "id_campanha": 18
}
```

## Atualizações Realizadas

### 1. **Serviço de Campanhas** (`lib/services/campanhas.service.ts`)
- ✅ Atualizado tipo de retorno de `criarCampanha()`
- ✅ Agora retorna `{ message: string; id_campanha: number }`
- ✅ Adicionado log da resposta da API

### 2. **Hook useCampanhas** (`hooks/useCampanhas.ts`)
- ✅ Atualizado tipo de retorno de `criarCampanha()`
- ✅ Após criar campanha, recarrega a lista automaticamente
- ✅ Retorna a resposta da API em vez de objeto Campanha

### 3. **Componente CampanhasMarketing** (`components/marketing/CampanhasMarketing.tsx`)
- ✅ Atualizado `handleCriarCampanha()` para usar nova resposta
- ✅ Mensagem de sucesso agora usa `resposta.message` e `resposta.id_campanha`
- ✅ Exemplo: "Campanha created successfully (ID: 18)"

### 4. **Componente de Debug** (`components/marketing/DebugAPI.tsx`)
- ✅ Adicionada informação sobre estrutura de resposta esperada
- ✅ Mostra exemplo da nova resposta no painel de informações

## Como Funciona Agora

### Fluxo de Criação:
1. **Usuário preenche** formulário na modal
2. **Dados enviados** para API via POST
3. **API responde** com `{ message: "...", id_campanha: 18 }`
4. **Hook recarrega** lista de campanhas automaticamente
5. **Usuário vê** mensagem de sucesso com ID da campanha

### Vantagens da Nova Estrutura:
- ✅ **Resposta mais rápida** - não precisa retornar objeto completo
- ✅ **Mensagem personalizada** - API pode enviar mensagem específica
- ✅ **ID disponível** - para referência imediata
- ✅ **Consistência** - padrão similar a outros endpoints

## Exemplo de Uso

```typescript
// Criar campanha
const resposta = await criarCampanha({
  nome: "Black Friday 2025",
  desc: "Promoção especial",
  data_criacao: "09/08/2025",
  data_lancamento: "15/08/2025",
  data_fim: "30/08/2025",
  status: "ativa"
});

// Resposta:
// {
//   message: "Campanha created successfully",
//   id_campanha: 18
// }

console.log(resposta.message); // "Campanha created successfully"
console.log(resposta.id_campanha); // 18
```

## Testes Recomendados

1. **Criar campanha** via modal
2. **Verificar mensagem** de sucesso
3. **Confirmar** que lista é recarregada
4. **Testar** componente de debug
5. **Verificar logs** no console do navegador

## Arquivos Modificados
- ✅ `lib/services/campanhas.service.ts`
- ✅ `hooks/useCampanhas.ts`
- ✅ `components/marketing/CampanhasMarketing.tsx`
- ✅ `components/marketing/DebugAPI.tsx`

A implementação está atualizada e compatível com a nova estrutura de resposta da API!