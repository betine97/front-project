'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { apiClient } from '../../lib/api/client';

export function DebugAPI() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [response, setResponse] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Evitar problemas de hidratação
  useEffect(() => {
    setMounted(true);
    setToken(localStorage.getItem('auth_token'));
  }, []);

  const testarAPI = async () => {
    setStatus('loading');
    setResponse(null);

    try {
      // Testar GET usando apiClient (com autenticação)
      const getResponse = await apiClient.get<any>('/api/campanhas');
      
      setStatus('success');
      setResponse({
        method: 'GET',
        success: true,
        data: getResponse.data,
        hasToken: !!token
      });
    } catch (error) {
      setStatus('error');
      setResponse({
        method: 'GET',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        hasToken: !!token
      });
    }
  };

  const testarPOST = async () => {
    setStatus('loading');
    setResponse(null);

    const exemploData = {
      nome: "Campanha Teste API",
      desc: "Teste de integração com a API",
      data_criacao: new Date().toLocaleDateString('pt-BR'),
      data_lancamento: new Date(Date.now() + 86400000).toLocaleDateString('pt-BR'), // amanhã
      data_fim: new Date(Date.now() + 7 * 86400000).toLocaleDateString('pt-BR'), // 7 dias
      status: "ativa"
    };

    try {
      // Testar POST usando apiClient (com autenticação)
      const postResponse = await apiClient.post<any>('/api/campanhas', exemploData);
      
      setStatus('success');
      setResponse({
        method: 'POST',
        success: true,
        sentData: exemploData,
        receivedData: postResponse.data,
        hasToken: !!token
      });
    } catch (error) {
      setStatus('error');
      setResponse({
        method: 'POST',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        sentData: exemploData,
        hasToken: !!token
      });
    }
  };

  // Evitar problemas de hidratação
  if (!mounted) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-900">Debug API Campanhas</h3>
        </div>
        <div className="mt-4 text-center">
          <Loader className="w-4 h-4 animate-spin mx-auto text-gray-400" />
          <p className="text-xs text-gray-500 mt-2">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">Debug API Campanhas</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${token ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs" style={{ color: '#6C757D' }}>
            Token: {token ? 'Presente' : 'Ausente'}
          </span>
        </div>
      </div>

      {/* Informações do Token */}
      <div className="bg-gray-50 rounded p-3 text-xs">
        <p><strong>Status da Autenticação:</strong></p>
        <p>• Token JWT: {token ? '✅ Encontrado' : '❌ Não encontrado'}</p>
        <p>• Endpoint: GET/POST localhost:8080/api/campanhas</p>
        <p>• Header: Authorization: Bearer {token ? '[TOKEN_PRESENTE]' : '[TOKEN_AUSENTE]'}</p>
        <p>• Resposta POST esperada: {`{"message": "Campanha created successfully", "id_campanha": 18}`}</p>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={testarAPI}
          disabled={status === 'loading'}
          className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-1 transition-all duration-200 hover:shadow-md font-medium"
        >
          {status === 'loading' ? <Loader className="w-4 h-4 animate-spin" /> : null}
          <span>Testar GET</span>
        </button>
        
        <button
          onClick={testarPOST}
          disabled={status === 'loading'}
          className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 flex items-center space-x-1 transition-all duration-200 hover:shadow-md font-medium"
        >
          {status === 'loading' ? <Loader className="w-4 h-4 animate-spin" /> : null}
          <span>Testar POST</span>
        </button>
      </div>

      {status === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded p-3">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Sucesso!</span>
          </div>
          <pre className="text-xs text-green-700 overflow-x-auto bg-green-100 p-2 rounded">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded p-3">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-800">Erro na API</span>
          </div>
          <pre className="text-xs text-red-700 overflow-x-auto bg-red-100 p-2 rounded">
            {JSON.stringify(response, null, 2)}
          </pre>
          <div className="mt-2 text-xs text-red-600">
            <p>Verifique se:</p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>A API está rodando em localhost:8080</li>
              <li>O endpoint /api/campanhas está disponível</li>
              <li>Não há problemas de CORS</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}