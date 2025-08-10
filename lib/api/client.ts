// Cliente HTTP centralizado
import { ApiResponse, ApiError } from '@/types/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:8080') {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    // Obter token do localStorage
    const token = localStorage.getItem('auth_token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    console.log(`[API] ${options.method || 'GET'} ${url}`, {
      headers: config.headers,
      hasToken: !!token
    });

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        // Se for erro 401 (não autorizado), limpar token e redirecionar para login
        if (response.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
          throw new Error('Token inválido ou expirado. Faça login novamente.');
        }
        
        // Tentar capturar a mensagem de erro do backend
        let errorMessage = `HTTP error! status: ${response.status}`;
        let errorData = {};
        
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            errorData = await response.json();
            console.log('[API] Error data from backend:', errorData);
            
            if ((errorData as any)?.error) {
              errorMessage = (errorData as any).error;
            } else if ((errorData as any)?.message) {
              errorMessage = (errorData as any).message;
            }
          } else {
            // Se não for JSON, tentar como texto
            const errorText = await response.text();
            console.log('[API] Error text from backend:', errorText);
            if (errorText) {
              errorMessage = errorText;
            }
          }
        } catch (parseError) {
          console.log('[API] Could not parse error response:', parseError);
        }
        
        // Criar erro com informações completas
        const error = new Error(errorMessage) as any;
        error.response = {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        };
        
        throw error;
      }

      const data = await response.json();
      
      console.log(`[API] Response:`, data);

      // A API retorna dados diretamente, então vamos envolver em um formato padrão
      return {
        data,
        success: true
      };
    } catch (error) {
      console.error(`[API] Error:`, error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): ApiError {
    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'NETWORK_ERROR',
      };
    }
    return {
      message: 'Erro desconhecido',
      code: 'UNKNOWN_ERROR',
    };
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    console.log(`[API] POST ${endpoint} - Body being sent:`, JSON.stringify(data, null, 2));
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();