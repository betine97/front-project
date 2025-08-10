# Correção de Autenticação - Campanhas de Marketing

## Problema Identificado
O serviço de campanhas não estava enviando o token JWT nas requisições, causando erro 401 (Token ausente ou malformado).

## Correções Implementadas

### 1. **Serviço de Campanhas** (`lib/services/campanhas.service.ts`)
**ANTES:**
- Usava `fetch` diretamente
- Não enviava token de autenticação
- Headers manuais

**DEPOIS:**
- Usa `apiClient` (que já tem autenticação implementada)
- Token JWT enviado automaticamente
- Logs detalhados para debug
- Tratamento de erros consistente

### 2. **Componente de Debug** (`components/marketing/DebugAPI.tsx`)
**ANTES:**
- Usava `fetch` diretamente
- Não mostrava status do token

**DEPOIS:**
- Usa `apiClient` com autenticação
- Mostra status do token JWT
- Informações detalhadas sobre autenticação
- Testes GET e POST com token

### 3. **Integração com apiClient**
O `apiClient` já estava implementado corretamente com:
- Captura automática do token do localStorage
- Header `Authorization: Bearer ${token}`
- Redirecionamento para login em caso de 401
- Tratamento de erros padronizado

## Como Funciona Agora

### Fluxo de Autenticação:
1. **Login**: Token salvo no `localStorage` como `auth_token`
2. **Requisições**: `apiClient` pega o token automaticamente
3. **Headers**: Adiciona `Authorization: Bearer ${token}`
4. **Erro 401**: Remove token e redireciona para login

### Logs do Backend (Esperados):
```
{"level":"info","ts":"...","caller":"middlewares/auth.go:15","msg":"🔐 Iniciando proteção JWT","ip":"127.0.0.1"}
{"level":"info","ts":"...","caller":"middlewares/auth.go:25","msg":"✅ Token válido","ip":"127.0.0.1"}
[16:06:15] 200 - GET /api/campanhas - 15ms
```

## Como Testar

### 1. **Verificar Token**
- Abra DevTools → Application → Local Storage
- Procure por `auth_token`
- Deve ter um valor JWT válido

### 2. **Usar Componente de Debug**
- Na página de Marketing, use o componente "Debug API Campanhas"
- Verifique se mostra "Token: Presente"
- Teste GET e POST
- Veja os logs no console

### 3. **Criar Campanha**
- Clique em "Nova Campanha"
- Preencha os dados
- Clique em "Criar Campanha"
- Deve funcionar sem erro 401

## Arquivos Modificados
- ✅ `lib/services/campanhas.service.ts` - Migrado para apiClient
- ✅ `components/marketing/DebugAPI.tsx` - Adicionado status do token
- ✅ `components/marketing/NovaCampanhaModal.tsx` - Removido teste manual

## Próximos Passos
1. Testar criação de campanhas
2. Verificar se outros serviços também usam apiClient
3. Remover componente de debug em produção
4. Implementar refresh token se necessário