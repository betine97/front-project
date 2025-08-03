'use client';

import React, { useState } from 'react';

export function ProdutosDebug() {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testProdutosAPI = async () => {
    setIsLoading(true);
    setTestResult('Testando API de produtos...');

    const token = localStorage.getItem('auth_token');

    try {
      const response = await fetch('http://localhost:8080/api/produtos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        mode: 'cors',
      });

      setTestResult(`Status: ${response.status} - ${response.statusText}\n`);
      
      if (response.ok) {
        const data = await response.json();
        setTestResult(prev => prev + `Tipo de dados: ${typeof data}\n`);
        setTestResult(prev => prev + `Tem products: ${!!data.products}\n`);
        setTestResult(prev => prev + `Total: ${data.total}\n`);
        setTestResult(prev => prev + `Page: ${data.page}\n`);
        setTestResult(prev => prev + `Limit: ${data.limit}\n`);
        
        if (data.products && Array.isArray(data.products)) {
          setTestResult(prev => prev + `Produtos encontrados: ${data.products.length}\n`);
          setTestResult(prev => prev + `Primeiros produtos:\n${JSON.stringify(data.products.slice(0, 2), null, 2)}`);
        } else {
          setTestResult(prev => prev + `Estrutura completa:\n${JSON.stringify(data, null, 2)}`);
        }
      } else {
        let errorData;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
        } else {
          errorData = await response.text();
        }
        
        setTestResult(prev => prev + 'Erro: ' + JSON.stringify(errorData, null, 2));
        
        if (response.status === 401) {
          setTestResult(prev => prev + '\n🔒 Token inválido ou expirado - faça login primeiro!');
        }
      }
    } catch (error) {
      setTestResult(`Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testProdutosService = async () => {
    setIsLoading(true);
    setTestResult('Testando serviço de produtos...');

    try {
      // Importar dinamicamente o serviço
      const { produtosService } = await import('@/lib/services/produtos.service');
      
      const response = await produtosService.getAll({ page: 1, limit: 10 });
      
      setTestResult(`Service Status: Sucesso\n`);
      setTestResult(prev => prev + `Produtos encontrados: ${response.data.length}\n`);
      setTestResult(prev => prev + `Total: ${response.total}\n`);
      setTestResult(prev => prev + `Página: ${response.page}\n`);
      setTestResult(prev => prev + `Páginas totais: ${response.totalPages}\n`);
      setTestResult(prev => prev + `Primeiros produtos:\n${JSON.stringify(response.data.slice(0, 2), null, 2)}`);
      
    } catch (error) {
      setTestResult(`Erro no serviço: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-lg z-50">
      <h3 className="font-bold mb-2">Debug Produtos</h3>
      <div className="flex gap-2 mb-2">
        <button
          onClick={testProdutosAPI}
          disabled={isLoading}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          {isLoading ? 'Testando...' : 'API Raw'}
        </button>
        <button
          onClick={testProdutosService}
          disabled={isLoading}
          className="bg-green-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          Service
        </button>
      </div>
      
      {testResult && (
        <div>
          <h4 className="font-semibold text-sm">Resposta:</h4>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
            {testResult}
          </pre>
        </div>
      )}
    </div>
  );
}