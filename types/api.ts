// Tipos para respostas da API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  allData?: T[];
}

// Tipos de erro da API
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}
