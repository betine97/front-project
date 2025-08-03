'use client';

import { useState, useEffect } from 'react';

export function useAuthCheck() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem('auth_token');
      setToken(storedToken);
      setIsAuthenticated(!!storedToken);
    };

    checkAuth();

    // Verificar mudanças no localStorage
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const requireAuth = () => {
    if (isAuthenticated === false) {
      window.location.href = '/login';
    }
  };

  return {
    isAuthenticated,
    token,
    requireAuth
  };
}