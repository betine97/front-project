'use client';

import { useState, useCallback } from 'react';
import { apiRequest, API_CONFIG } from '@/lib/config/api';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  companyName: string;
  businessCategory: string;
  businessNiche: string;
}

interface AuthState {
  isLoading: boolean;
  error: string | null;
  user: any | null;
}

interface AuthResult {
  success: boolean;
  data?: any;
  error?: string;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: null,
    user: null
  });

  const login = useCallback(async (data: LoginData): Promise<AuthResult> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Formatar dados conforme esperado pelo backend
      const loginData = {
        email: data.email.trim().toLowerCase(),
        password: data.password
      };
      
      console.log('=== LOGIN DEBUG ===');
      console.log('Dados originais:', data);
      console.log('Dados formatados para backend:', loginData);
      console.log('JSON string que será enviado:', JSON.stringify(loginData));
      
      // Chamada real para o endpoint de login
      const response = await apiRequest(API_CONFIG.ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        let errorData: any;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json().catch(() => ({}));
        } else {
          const textError = await response.text().catch(() => '');
          errorData = { message: textError || `Erro ${response.status}` };
        }
        
        console.error('Erro do servidor no login:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData,
          headers: Object.fromEntries(response.headers.entries())
        });
        
        // Mensagem específica para credenciais incorretas
        let errorMessage = 'E-mail ou senha não estão corretos';
        
        // Se o backend retornar uma mensagem específica, usar ela
        if (errorData.message) {
          errorMessage = errorData.message;
        }
        
        throw new Error(errorMessage);
      }

      const user = await response.json();
      console.log('Login realizado com sucesso:', user);
      
      // Armazenar token no localStorage se fornecido
      if (user.token) {
        localStorage.setItem('auth_token', user.token);
        console.log('Token armazenado:', user.token);
      }
      
      setAuthState({
        isLoading: false,
        error: null,
        user
      });

      // Redirecionar para página minha-empresa após login bem-sucedido
      console.log('Redirecionando para /minha-empresa...');
      window.location.href = '/minha-empresa';
      
      return { success: true, data: user };
      
    } catch (error) {
      console.error('Erro no login:', error);
      
      let errorMessage = 'E-mail ou senha não estão corretos';
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando e se o CORS está configurado.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setAuthState({
        isLoading: false,
        error: errorMessage,
        user: null
      });
      
      return { success: false, error: errorMessage };
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<AuthResult> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Formatar dados conforme esperado pelo backend (ordem igual ao struct Go)
      const backendData = {
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        nome_empresa: data.companyName.trim(),
        categoria: data.businessCategory.trim(),
        segmento: data.businessNiche.trim(),
        city: data.city.trim(),
        state: data.state.trim(),
        password: data.password
      };
      
      console.log('=== REGISTRO DEBUG ===');
      console.log('Dados originais:', data);
      console.log('Dados formatados para backend:', backendData);
      console.log('JSON string que será enviado:', JSON.stringify(backendData));
      console.log('Tamanho do JSON:', JSON.stringify(backendData).length);
      console.log('=== VERIFICAÇÃO CATEGORIA E SEGMENTO ===');
      console.log('businessCategory original:', data.businessCategory);
      console.log('businessNiche original:', data.businessNiche);
      console.log('categoria formatada:', backendData.categoria);
      console.log('segmento formatado:', backendData.segmento);
      
      // Validações conforme DTO do backend
      if (!backendData.email || !backendData.password || !backendData.first_name || !backendData.last_name || !backendData.city || !backendData.state || !backendData.nome_empresa || !backendData.categoria || !backendData.segmento) {
        console.log('=== ERRO DE VALIDAÇÃO ===');
        console.log('email:', backendData.email);
        console.log('password:', backendData.password ? '[PRESENTE]' : '[AUSENTE]');
        console.log('first_name:', backendData.first_name);
        console.log('last_name:', backendData.last_name);
        console.log('city:', backendData.city);
        console.log('state:', backendData.state);
        console.log('nome_empresa:', backendData.nome_empresa);
        console.log('categoria:', backendData.categoria);
        console.log('segmento:', backendData.segmento);
        throw new Error('Todos os campos obrigatórios devem ser preenchidos');
      }
      
      // Validação de tamanho dos campos
      if (backendData.first_name.length < 2 || backendData.first_name.length > 100) {
        throw new Error('Nome deve ter entre 2 e 100 caracteres');
      }
      
      if (backendData.last_name.length < 2 || backendData.last_name.length > 100) {
        throw new Error('Sobrenome deve ter entre 2 e 100 caracteres');
      }
      
      if (backendData.city.length < 2 || backendData.city.length > 100) {
        throw new Error('Cidade deve ter entre 2 e 100 caracteres');
      }
      
      if (backendData.state.length < 2 || backendData.state.length > 50) {
        throw new Error('Estado deve ter entre 2 e 50 caracteres');
      }
      
      if (backendData.nome_empresa.length < 2 || backendData.nome_empresa.length > 100) {
        throw new Error('Nome da empresa deve ter entre 2 e 100 caracteres');
      }
      
      if (!backendData.categoria || backendData.categoria.length === 0) {
        throw new Error('Categoria do negócio é obrigatória');
      }
      
      if (!backendData.segmento || backendData.segmento.length === 0) {
        throw new Error('Segmento do negócio é obrigatório');
      }
      
      // Validação de senha conforme backend
      if (backendData.password.length < 6) {
        throw new Error('Senha deve ter pelo menos 6 caracteres');
      }
      
      if (!/[!@#$%*]/.test(backendData.password)) {
        throw new Error('Senha deve conter pelo menos um dos caracteres especiais: !@#$%*');
      }
      
      // Chamada real para o endpoint de registro
      const response = await apiRequest(API_CONFIG.ENDPOINTS.REGISTER, {
        method: 'POST',
        body: JSON.stringify(backendData),
      });

      if (!response.ok) {
        let errorData;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json().catch(() => ({}));
        } else {
          const textError = await response.text().catch(() => '');
          errorData = { message: textError || `Erro ${response.status}` };
        }
        
        console.error('Erro do servidor:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData,
          headers: Object.fromEntries(response.headers.entries())
        });
        
        throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Cadastro realizado com sucesso:', result);
      
      setAuthState({
        isLoading: false,
        error: null,
        user: result
      });

      return { success: true, data: result };
      
    } catch (error) {
      console.error('Erro no cadastro:', error);
      
      let errorMessage = 'Erro ao criar conta';
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando e se o CORS está configurado.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setAuthState({
        isLoading: false,
        error: errorMessage,
        user: null
      });
      
      return { success: false, error: errorMessage };
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Aqui você implementaria a autenticação com Google
      // Exemplo usando Google OAuth ou Firebase Auth
      
      // Simular por enquanto
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = {
        id: '1',
        email: 'user@gmail.com',
        name: 'Usuário Google',
        provider: 'google'
      };
      
      setAuthState({
        isLoading: false,
        error: null,
        user
      });

      window.location.href = '/';
      
    } catch (error) {
      setAuthState({
        isLoading: false,
        error: 'Erro ao autenticar com Google',
        user: null
      });
    }
  }, []);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setAuthState({
      isLoading: false,
      error: null,
      user: null
    });
    window.location.href = '/login';
  }, []);

  const getToken = useCallback(() => {
    return localStorage.getItem('auth_token');
  }, []);

  return {
    ...authState,
    login,
    register,
    loginWithGoogle,
    logout,
    getToken,
    clearError
  };
}