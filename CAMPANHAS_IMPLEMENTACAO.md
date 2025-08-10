# Implementação de Campanhas de Marketing

## Funcionalidades Implementadas

### 1. Modal de Criação de Campanhas
- **Localização**: `components/marketing/NovaCampanhaModal.tsx`
- **Funcionalidades**:
  - Formulário com validação completa
  - Opção de campanha com prazo definido ou indeterminado
  - Campos obrigatórios: nome, data_lancamento
  - Campos opcionais: descrição (max 1000 chars), data_fim
  - Preview do JSON que será enviado para a API
  - Botão de teste da conexão com a API

### 2. Serviço de API
- **Localização**: `lib/services/campanhas.service.ts`
- **Endpoints**:
  - `GET /api/campanhas` - Listar campanhas (com paginação)
  - `POST /api/campanhas` - Criar nova campanha
  - `PUT /api/campanhas/:id` - Atualizar campanha
  - `DELETE /api/campanhas/:id` - Deletar campanha

### 3. Hook de Gerenciamento
- **Localização**: `hooks/useCampanhas.ts`
- **Funcionalidades**:
  - Estado de loading e erro
  - Suporte a paginação
  - Operações CRUD completas
  - Tratamento de erros

### 4. Integração na Interface
- **Localização**: `components/marketing/CampanhasMarketing.tsx`
- **Funcionalidades**:
  - Botão "Criar Campanha" abre a modal
  - Integração com API real
  - Fallback para dados mockados
  - Estados de loading e erro
  - Confirmação de exclusão

### 5. Componente de Debug
- **Localização**: `components/marketing/DebugAPI.tsx`
- **Funcionalidades**:
  - Teste de conexão GET e POST
  - Visualização de respostas da API
  - Diagnóstico de problemas de conexão

## Formato dos Dados

### Dados Enviados para a API (POST)
```json
{
  "nome": "Campanha Black Friday 2025",
  "desc": "Promoção especial para pets",
  "data_criacao": "08/08/2025",
  "data_lancamento": "15/08/2025",
  "data_fim": "30/08/2025",
  "status": "ativa"
}
```

### Validações Implementadas
- **nome**: Obrigatório, 2-255 caracteres
- **desc**: Opcional, máximo 1000 caracteres
- **data_criacao**: Gerada automaticamente no formato dd/mm/yyyy
- **data_lancamento**: Obrigatória
- **data_fim**: Obrigatória apenas para campanhas com prazo definido
- **status**: ativa, inativa, pausada, finalizada

### Funcionalidades da Modal
1. **Pergunta sobre tipo de prazo**: Definido ou Indeterminado
2. **Campos condicionais**: data_fim só aparece se prazo definido
3. **Validação de datas**: data_fim deve ser posterior à data_lancamento
4. **Preview em tempo real**: Mostra resumo e JSON que será enviado
5. **Teste de API**: Botão para testar conexão

## Como Usar

1. **Acessar**: Vá para a página de Marketing
2. **Criar Campanha**: Clique no botão "Nova Campanha" ou "Criar Campanha"
3. **Preencher Formulário**:
   - Nome da campanha (obrigatório)
   - Descrição (opcional)
   - Escolher tipo de prazo
   - Definir datas
   - Selecionar status inicial
4. **Testar API**: Use o botão "Testar Conexão API" para verificar se a API está funcionando
5. **Salvar**: Clique em "Criar Campanha"

## Endpoints da API

- **GET** `localhost:8080/api/campanhas` - Listar campanhas
- **POST** `localhost:8080/api/campanhas` - Criar campanha

## Componente de Debug

Na página de marketing há um componente de debug que permite:
- Testar conexão GET com a API
- Testar criação POST com dados de exemplo
- Ver respostas detalhadas da API
- Diagnosticar problemas de conexão

## Próximos Passos

1. Remover componente de debug em produção
2. Implementar edição de campanhas
3. Adicionar mais validações conforme necessário
4. Implementar filtros e busca
5. Adicionar métricas e relatórios