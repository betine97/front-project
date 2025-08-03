'use client';

import React, { useState } from 'react';

export function FornecedoresDebug() {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testFornecedoresAPI = async () => {
    setIsLoading(true);
    setTestResult('Testando API de fornecedores...');

    const token = localStorage.getItem('auth_token');

    try {
      console.log('=== TESTE FORNECEDORES API ===');
      console.log('URL:', 'http://localhost:8080/api/fornecedores');
      console.log('Token:', token ? 'Presente' : 'Ausente');

      const response = await fetch('http://localhost:8080/api/fornecedores', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        mode: 'cors',
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      setTestResult(`Status: ${response.status} - ${response.statusText}\n`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        
        setTestResult(prev => prev + `Tipo de dados: ${typeof data}\n`);
        setTestResult(prev => prev + `Tem fornecedores: ${!!data.fornecedores}\n`);
        setTestResult(prev => prev + `Total: ${data.total || 'N/A'}\n`);
        
        if (data.fornecedores && Array.isArray(data.fornecedores)) {
          setTestResult(prev => prev + `Fornecedores encontrados: ${data.fornecedores.length}\n`);
          setTestResult(prev => prev + `Estrutura do primeiro:\n${JSON.stringify(data.fornecedores[0] || {}, null, 2)}`);
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
        
        console.log('Error data:', errorData);
        setTestResult(prev => prev + 'Erro: ' + JSON.stringify(errorData, null, 2));
        
        if (response.status === 401) {
          setTestResult(prev => prev + '\n🔒 Token inválido ou expirado');
        } else if (response.status === 404) {
          setTestResult(prev => prev + '\n🔍 Endpoint não encontrado');
        } else if (response.status === 500) {
          setTestResult(prev => prev + '\n⚠️ Erro interno do servidor');
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setTestResult(`Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      setTestResult(prev => prev + '\n🌐 Verifique se o backend está rodando em localhost:8080');
    } finally {
      setIsLoading(false);
    }
  };

  const testFornecedoresService = async () => {
    setIsLoading(true);
    setTestResult('Testando serviço de fornecedores...');

    try {
      // Importar dinamicamente o serviço
      const { fornecedoresService } = await import('@/lib/services/fornecedores.service');
      
      const response = await fornecedoresService.getAll({ page: 1, limit: 10 });
      
      setTestResult(`Service Status: Sucesso\n`);
      setTestResult(prev => prev + `Fornecedores encontrados: ${response.data.length}\n`);
      setTestResult(prev => prev + `Total: ${response.total}\n`);
      setTestResult(prev => prev + `Página: ${response.page}\n`);
      setTestResult(prev => prev + `Páginas totais: ${response.totalPages}\n`);
      setTestResult(prev => prev + `Primeiros fornecedores:\n${JSON.stringify(response.data.slice(0, 2), null, 2)}`);
      
    } catch (error) {
      setTestResult(`Erro no serviço: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testCreateFornecedor = async () => {
    setIsLoading(true);
    setTestResult('Testando criação de fornecedor...');

    const testData = {
      nome: 'Fornecedor Teste',
      telefone: '(11) 99999-9999',
      email: 'teste@fornecedor.com',
      cidade: 'São Paulo',
      estado: 'São Paulo',
      status: 'Ativo',
      data_cadastro: new Date().toISOString().split('T')[0]
    };

    const token = localStorage.getItem('auth_token');

    try {
      console.log('=== TESTE CREATE FORNECEDOR ===');
      console.log('URL:', 'http://localhost:8080/api/fornecedores');
      console.log('Dados:', testData);

      const response = await fetch('http://localhost:8080/api/fornecedores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        mode: 'cors',
        body: JSON.stringify(testData),
      });

      console.log('Response status:', response.status);

      setTestResult(`Status: ${response.status} - ${response.statusText}\n`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        setTestResult(prev => prev + `Resposta: ${JSON.stringify(data, null, 2)}`);
      } else {
        let errorData;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
        } else {
          errorData = await response.text();
        }
        
        console.log('Error data:', errorData);
        setTestResult(prev => prev + 'Erro: ' + JSON.stringify(errorData, null, 2));
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setTestResult(`Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testChangeStatus = async () => {
    setIsLoading(true);
    setTestResult('Testando alteração de status...');

    const testId = 1; // ID de teste
    const token = localStorage.getItem('auth_token');

    try {
      console.log('=== TESTE CHANGE STATUS ===');
      console.log('URL:', `http://localhost:8080/api/fornecedores/changestatus/${testId}`);

      const response = await fetch(`http://localhost:8080/api/fornecedores/changestatus/${testId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        mode: 'cors',
      });

      console.log('Response status:', response.status);

      setTestResult(`Status: ${response.status} - ${response.statusText}\n`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        setTestResult(prev => prev + `Resposta: ${JSON.stringify(data, null, 2)}`);
      } else {
        let errorData;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
        } else {
          errorData = await response.text();
        }
        
        console.log('Error data:', errorData);
        setTestResult(prev => prev + 'Erro: ' + JSON.stringify(errorData, null, 2));
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setTestResult(`Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testChangeField = async () => {
    setIsLoading(true);
    setTestResult('Testando alteração de campo...');

    const testId = 1; // ID de teste
    const testData = {
      campo: 'nome',
      valor: 'Fornecedor Teste Editado'
    };
    const token = localStorage.getItem('auth_token');

    try {
      console.log('=== TESTE CHANGE FIELD ===');
      console.log('URL:', `http://localhost:8080/api/fornecedores/changefields/${testId}`);
      console.log('Dados:', testData);

      const response = await fetch(`http://localhost:8080/api/fornecedores/changefields/${testId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        mode: 'cors',
        body: JSON.stringify(testData),
      });

      console.log('Response status:', response.status);

      setTestResult(`Status: ${response.status} - ${response.statusText}\n`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        setTestResult(prev => prev + `Resposta: ${JSON.stringify(data, null, 2)}`);
      } else {
        let errorData;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
        } else {
          errorData = await response.text();
        }
        
        console.log('Error data:', errorData);
        setTestResult(prev => prev + 'Erro: ' + JSON.stringify(errorData, null, 2));
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setTestResult(`Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-lg z-50">
      <h3 className="font-bold mb-2">Debug Fornecedores</h3>
      <div className="flex gap-2 mb-2">
        <button
          onClick={testFornecedoresAPI}
          disabled={isLoading}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          {isLoading ? 'Testando...' : 'API Raw'}
        </button>
        <button
          onClick={testFornecedoresService}
          disabled={isLoading}
          className="bg-green-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          Service
        </button>
        <button
          onClick={testCreateFornecedor}
          disabled={isLoading}
          className="bg-purple-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          Create
        </button>
        <button
          onClick={testChangeStatus}
          disabled={isLoading}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          Status
        </button>
        <button
          onClick={testChangeField}
          disabled={isLoading}
          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          Field
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