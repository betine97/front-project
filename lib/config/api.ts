// Configurações da API
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  ENDPOINTS: {
    REGISTER: '/cadastro',
    LOGIN: '/login',
    FORGOT_PASSWORD: '/forgot-password'
  },
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// Helper para construir URLs completas
export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper para fazer requisições com configuração padrão
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = getApiUrl(endpoint);
  
  const defaultOptions: RequestInit = {
    headers: API_CONFIG.HEADERS,
    mode: 'cors',
    ...options,
  };

  console.log(`[API] ${options.method || 'GET'} ${url}`, {
    body: options.body,
    headers: defaultOptions.headers
  });

  try {
    const response = await fetch(url, defaultOptions);
    
    console.log(`[API] Response: ${response.status} ${response.statusText}`);
    
    return response;
  } catch (error) {
    console.error(`[API] Error:`, error);
    throw error;
  }
};