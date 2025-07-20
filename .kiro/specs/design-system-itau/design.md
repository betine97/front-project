# Design Document - Design System Inspirado no Itaú

## Overview

Este documento detalha a implementação de um design system moderno inspirado no visual do Banco Itaú, focando em criar uma experiência visual profissional, confiável e moderna para o sistema de gestão empresarial.

## Architecture

### Design Tokens

#### Paleta de Cores

**Cores Primárias:**
- Primary Orange: `#FF6600` (Cor principal do Itaú)
- Primary Orange Dark: `#EC6C00` (Variação mais escura)
- Primary Orange Light: `#FF8533` (Variação mais clara)

**Cores Secundárias:**
- White: `#FFFFFF`
- Gray 50: `#F8F9FA`
- Gray 100: `#E9ECEF`
- Gray 200: `#DEE2E6`
- Gray 300: `#CED4DA`
- Gray 400: `#ADB5BD`
- Gray 500: `#6C757D`
- Gray 600: `#495057`
- Gray 700: `#343A40`
- Gray 800: `#212529`

**Cores Semânticas:**
- Success: `#28A745`
- Warning: `#FFC107`
- Error: `#DC3545`
- Info: `#17A2B8`

#### Tipografia

**Font Family:**
- Primary: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

**Font Weights:**
- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

**Font Sizes:**
- xs: 12px
- sm: 14px
- base: 16px
- lg: 18px
- xl: 20px
- 2xl: 24px
- 3xl: 30px
- 4xl: 36px

#### Espaçamento

**Spacing Scale (baseado em 8px):**
- 1: 4px
- 2: 8px
- 3: 12px
- 4: 16px
- 5: 20px
- 6: 24px
- 8: 32px
- 10: 40px
- 12: 48px
- 16: 64px

#### Border Radius

- sm: 4px
- base: 8px
- md: 12px
- lg: 16px
- xl: 24px
- full: 9999px

#### Shadows

- sm: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- base: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`
- md: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
- lg: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
- xl: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`

## Components and Interfaces

### 1. Cards

**Design Specifications:**
```css
.card {
  background: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
}

.card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
```

**Variações:**
- Card com ícone colorido no topo
- Card com imagem de fundo
- Card com gradiente sutil
- Card com borda colorida (status)

### 2. Botões

**Botão Primário:**
```css
.btn-primary {
  background: linear-gradient(135deg, #FF6600 0%, #EC6C00 100%);
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  min-height: 44px;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #EC6C00 0%, #D85F00 100%);
  box-shadow: 0 4px 12px rgba(255, 102, 0, 0.3);
}
```

**Botão Secundário:**
```css
.btn-secondary {
  background: transparent;
  color: #FF6600;
  border: 2px solid #FF6600;
  border-radius: 8px;
  padding: 10px 24px;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
}

.btn-secondary:hover {
  background: #FF6600;
  color: #FFFFFF;
}
```

### 3. Ícones com Container

**Design Pattern:**
```css
.icon-container {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.icon-container.orange {
  background: linear-gradient(135deg, #FF6600 0%, #EC6C00 100%);
  color: #FFFFFF;
}

.icon-container.blue {
  background: linear-gradient(135deg, #17A2B8 0%, #138496 100%);
  color: #FFFFFF;
}
```

### 4. Inputs e Formulários

**Input Field:**
```css
.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #E9ECEF;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease-in-out;
  background: #FFFFFF;
}

.form-input:focus {
  border-color: #FF6600;
  box-shadow: 0 0 0 3px rgba(255, 102, 0, 0.1);
  outline: none;
}

.form-label {
  font-weight: 600;
  color: #343A40;
  margin-bottom: 8px;
  display: block;
}
```

### 5. Navigation Sidebar

**Design Specifications:**
```css
.sidebar {
  background: #FFFFFF;
  border-right: 1px solid #E9ECEF;
  width: 280px;
  height: 100vh;
  padding: 24px 0;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  color: #6C757D;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  border-radius: 0 24px 24px 0;
  margin-right: 24px;
}

.sidebar-item.active {
  background: linear-gradient(90deg, #FF6600 0%, #EC6C00 100%);
  color: #FFFFFF;
  box-shadow: 0 4px 12px rgba(255, 102, 0, 0.3);
}

.sidebar-item:hover:not(.active) {
  background: #F8F9FA;
  color: #FF6600;
}
```

### 6. Dashboard Cards

**Metric Card:**
```css
.metric-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #E9ECEF;
  position: relative;
  overflow: hidden;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #FF6600 0%, #EC6C00 100%);
}

.metric-value {
  font-size: 32px;
  font-weight: 700;
  color: #212529;
  margin: 8px 0;
}

.metric-label {
  font-size: 14px;
  color: #6C757D;
  font-weight: 500;
}
```

## Data Models

### Theme Configuration

```typescript
interface ThemeConfig {
  colors: {
    primary: {
      50: string;
      100: string;
      500: string; // Main orange
      600: string;
      700: string;
    };
    gray: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    semantic: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  typography: {
    fontFamily: string;
    fontSizes: Record<string, string>;
    fontWeights: Record<string, number>;
  };
}
```

## Error Handling

### Design System Fallbacks

1. **Cor não encontrada:** Fallback para cor neutra (#6C757D)
2. **Ícone não encontrado:** Fallback para ícone genérico
3. **Fonte não carregada:** Fallback para system fonts
4. **Imagem não carregada:** Placeholder com gradiente
5. **Componente quebrado:** Fallback para versão básica

## Testing Strategy

### Visual Regression Testing

1. **Snapshot Testing:** Capturar screenshots de componentes
2. **Cross-browser Testing:** Testar em Chrome, Firefox, Safari
3. **Responsive Testing:** Testar em diferentes tamanhos de tela
4. **Accessibility Testing:** Verificar contraste e navegação por teclado
5. **Performance Testing:** Medir tempo de carregamento de estilos

### Component Testing

```javascript
// Exemplo de teste para Card component
describe('Card Component', () => {
  it('should render with correct Itaú styling', () => {
    render(<Card />);
    
    expect(screen.getByRole('article')).toHaveStyle({
      borderRadius: '12px',
      backgroundColor: '#FFFFFF',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    });
  });

  it('should have hover effect', () => {
    render(<Card />);
    
    const card = screen.getByRole('article');
    fireEvent.mouseEnter(card);
    
    expect(card).toHaveStyle({
      transform: 'translateY(-2px)'
    });
  });
});
```

### Design Token Validation

```javascript
// Validação de tokens de design
const validateDesignTokens = () => {
  // Verificar se todas as cores estão definidas
  expect(theme.colors.primary[500]).toBe('#FF6600');
  
  // Verificar se espaçamentos seguem escala de 8px
  expect(theme.spacing[4]).toBe('16px');
  
  // Verificar se border-radius está consistente
  expect(theme.borderRadius.base).toBe('8px');
};
```

## Implementation Guidelines

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-primary-500: #FF6600;
  --color-primary-600: #EC6C00;
  --color-gray-50: #F8F9FA;
  --color-gray-500: #6C757D;
  
  /* Spacing */
  --spacing-4: 16px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  
  /* Border Radius */
  --radius-base: 8px;
  --radius-lg: 16px;
  
  /* Shadows */
  --shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF3E6',
          100: '#FFE6CC',
          500: '#FF6600',
          600: '#EC6C00',
          700: '#D85F00',
        },
        gray: {
          50: '#F8F9FA',
          100: '#E9ECEF',
          500: '#6C757D',
          600: '#495057',
          700: '#343A40',
        }
      },
      borderRadius: {
        'base': '8px',
        'lg': '16px',
      },
      boxShadow: {
        'base': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      }
    }
  }
}
```

### Component Library Structure

```
components/
├── ui/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.stories.tsx
│   │   └── Button.test.tsx
│   ├── Card/
│   ├── Input/
│   └── Icon/
├── layout/
│   ├── Sidebar/
│   ├── Header/
│   └── Dashboard/
└── domain/
    ├── produtos/
    ├── estoque/
    └── financeiro/
```

## Migration Strategy

### Fase 1: Design Tokens
- Implementar CSS custom properties
- Configurar Tailwind CSS
- Criar paleta de cores

### Fase 2: Componentes Base
- Refatorar Button, Card, Input
- Implementar novos estilos
- Testes visuais

### Fase 3: Layout Components
- Atualizar Sidebar
- Refatorar Dashboard
- Implementar grid system

### Fase 4: Domain Components
- Atualizar páginas de produtos
- Refatorar modais
- Aplicar novos padrões

### Fase 5: Refinamento
- Ajustes de acessibilidade
- Otimizações de performance
- Documentação final