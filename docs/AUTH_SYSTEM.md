# Sistema de Autenticação

Este documento descreve o sistema de autenticação implementado com design inspirado no Itaú.

## 📁 Estrutura de Arquivos

```
app/
├── login/
│   ├── page.tsx              # Página principal de login/cadastro
│   └── login.module.css      # Estilos específicos
├── forgot-password/
│   └── page.tsx              # Página de recuperação de senha
components/
└── auth/
    └── PhoneInput.tsx        # Componente de input de telefone formatado
hooks/
└── useAuth.ts                # Hook personalizado para autenticação
```

## 🎨 Design System

O sistema utiliza a identidade visual do Itaú com:
- **Cor primária**: Laranja (#FF6600)
- **Gradientes**: Tons de laranja para botões e elementos principais
- **Tipografia**: Inter como fonte principal
- **Espaçamentos**: Sistema baseado em 8px
- **Bordas**: Cantos arredondados consistentes
- **Sombras**: Elevação sutil para cards e botões

## 🔐 Funcionalidades

### Login
- Campo de e-mail com validação
- Campo de senha com toggle de visibilidade
- Opção "Esqueci minha senha"
- Autenticação com Google
- Estados de loading e erro

### Cadastro
- Campos obrigatórios:
  - Nome e sobrenome
  - E-mail
  - Telefone (com formatação automática)
  - Data de nascimento
  - Senha com critérios de segurança
  - Confirmação de senha

### Critérios de Senha
- Mínimo 8 caracteres
- Pelo menos 1 letra maiúscula
- Pelo menos 1 letra minúscula
- Pelo menos 1 número
- Pelo menos 1 caractere especial

### Recuperação de Senha
- Envio de link por e-mail
- Feedback visual de sucesso
- Opção de reenvio

## 🛠️ Como Usar

### 1. Navegação
```typescript
// Para acessar a página de login
window.location.href = '/login';

// Ou usando Next.js Router
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/login');
```

### 2. Hook de Autenticação
```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { isLoading, error, user, login, register, loginWithGoogle } = useAuth();

  const handleLogin = async () => {
    await login({
      email: 'user@example.com',
      password: 'password123'
    });
  };

  return (
    <div>
      {isLoading && <p>Carregando...</p>}
      {error && <p>Erro: {error}</p>}
      {user && <p>Bem-vindo, {user.name}!</p>}
    </div>
  );
}
```

### 3. Componente de Telefone
```typescript
import { PhoneInput } from '@/components/auth/PhoneInput';

function MyForm() {
  const [phone, setPhone] = useState('');

  return (
    <PhoneInput
      value={phone}
      onChange={setPhone}
      required
      placeholder="(11) 99999-9999"
    />
  );
}
```

## 🔌 Integração com Backend

### Endpoints Necessários

```typescript
// POST /api/auth/login
interface LoginRequest {
  email: string;
  password: string;
}

// POST /api/auth/register
interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: string;
}

// POST /api/auth/forgot-password
interface ForgotPasswordRequest {
  email: string;
}
```

### Exemplo de Implementação (Next.js API Routes)

```typescript
// app/api/auth/login/route.ts
export async function POST(request: Request) {
  const { email, password } = await request.json();
  
  // Validar credenciais
  const user = await validateUser(email, password);
  
  if (!user) {
    return Response.json(
      { message: 'Credenciais inválidas' },
      { status: 401 }
    );
  }
  
  // Gerar token JWT
  const token = generateJWT(user);
  
  return Response.json({
    user,
    token
  });
}
```

## 🎯 Próximos Passos

1. **Implementar APIs reais** - Substituir simulações por chamadas reais
2. **Adicionar 2FA** - Implementar autenticação de dois fatores
3. **Integrar com OAuth** - Configurar Google OAuth real
4. **Adicionar testes** - Criar testes unitários e de integração
5. **Melhorar acessibilidade** - Adicionar ARIA labels e navegação por teclado
6. **Implementar rate limiting** - Proteger contra ataques de força bruta

## 🔒 Segurança

- Senhas são validadas no frontend e backend
- Implementar hash de senhas (bcrypt)
- Usar HTTPS em produção
- Implementar CSRF protection
- Validar dados no servidor
- Implementar rate limiting
- Usar tokens JWT seguros

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎨 Customização

Para personalizar o visual, edite:
- `styles/design-tokens.css` - Cores e tokens de design
- `app/login/login.module.css` - Estilos específicos da página
- Componentes individuais para ajustes pontuais