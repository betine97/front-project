# Implementação - Vinculação de Públicos às Campanhas

## Fluxo Implementado

### 1. **Criação da Campanha**
- **Endpoint**: `POST localhost:8080/api/campanhas`
- **Resposta**: `{"message": "Campanha created successfully", "id_campanha": 18}`

### 2. **Vinculação de Públicos**
- **Endpoint**: `POST localhost:8080/api/campanhas/:id/publicos`
- **Formato**: `{"publicos": [1, 2, 3]}`
- **Onde**: `:id` = `id_campanha` retornado no passo 1

## Implementação Técnica

### 1. **Serviço de Campanhas** (`lib/services/campanhas.service.ts`)
```typescript
static async vincularPublicos(campanhaId: number, publicosIds: number[]): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>(
    `${this.endpoint}/${campanhaId}/publicos`,
    { publicos: publicosIds }
  );
  return response.data;
}
```

### 2. **Hook useCampanhas** (`hooks/useCampanhas.ts`)
```typescript
const criarCampanha = async (data: CriarCampanhaData, publicosIds?: number[]) => {
  // 1. Criar campanha
  const resposta = await CampanhasService.criarCampanha(data);
  
  // 2. Vincular públicos se selecionados
  if (publicosIds && publicosIds.length > 0) {
    await CampanhasService.vincularPublicos(resposta.id_campanha, publicosIds);
  }
  
  return resposta;
};
```

### 3. **Modal de Criação** (`components/marketing/NovaCampanhaModal.tsx`)
- ✅ Interface atualizada para aceitar públicos separadamente
- ✅ Preview mostra ambas as requisições que serão feitas
- ✅ Públicos selecionados passados como parâmetro separado

### 4. **Componente CampanhasMarketing** (`components/marketing/CampanhasMarketing.tsx`)
- ✅ Mensagem de sucesso inclui quantidade de públicos vinculados
- ✅ Tratamento de erro para ambas as operações

## Exemplo de Uso

### Dados Enviados:

#### 1. Criar Campanha:
```json
POST /api/campanhas
{
  "nome": "Black Friday Pet 2025",
  "desc": "Promoção especial para pets",
  "data_criacao": "09/08/2025",
  "data_lancamento": "15/08/2025",
  "data_fim": "30/08/2025",
  "status": "ativa"
}
```

#### 2. Vincular Públicos:
```json
POST /api/campanhas/18/publicos
{
  "publicos": [1, 2, 3]
}
```

## Preview na Modal

A modal agora mostra ambas as requisições que serão feitas:

```
┌─ Preview das Requisições ─────────────────────────┐
│ 1. Criar Campanha (POST /api/campanhas):         │
│ {                                                 │
│   "nome": "Black Friday Pet 2025",               │
│   "desc": "Promoção especial para pets",         │
│   "data_criacao": "09/08/2025",                  │
│   "data_lancamento": "15/08/2025",               │
│   "data_fim": "30/08/2025",                      │
│   "status": "ativa"                              │
│ }                                                 │
│                                                   │
│ 2. Vincular Públicos (POST /api/campanhas/18/publicos): │
│ {                                                 │
│   "publicos": [1, 2, 3]                         │
│ }                                                 │
└───────────────────────────────────────────────────┘
```

## Fluxo de Execução

1. **Usuário preenche** formulário da campanha
2. **Usuário seleciona** públicos-alvo desejados
3. **Usuário clica** "Criar Campanha"
4. **Sistema executa**:
   - Cria campanha → Recebe `id_campanha`
   - Vincula públicos → Envia IDs para `/api/campanhas/:id/publicos`
5. **Usuário recebe** confirmação com quantidade de públicos vinculados

## Mensagens de Sucesso

- **Sem públicos**: "Campanha created successfully (ID: 18)"
- **Com públicos**: "Campanha created successfully (ID: 18) com 3 público(s) vinculado(s)"

## Tratamento de Erros

- ✅ **Erro na criação**: Campanha não é criada, públicos não são vinculados
- ✅ **Erro na vinculação**: Campanha é criada, mas públicos não são vinculados
- ✅ **Mensagens claras** para o usuário em ambos os casos

## Validações

- ✅ **Públicos opcionais**: Campanha pode ser criada sem públicos
- ✅ **Múltiplos públicos**: Suporte a 1 ou mais públicos
- ✅ **IDs válidos**: Apenas IDs de públicos existentes são enviados

A implementação está completa e segue exatamente o fluxo especificado!