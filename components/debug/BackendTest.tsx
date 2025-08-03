'use client';

import React, { useState } from 'react';
import { apiRequest, API_CONFIG } from '@/lib/config/api';

export function BackendTest() {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [requestData, setRequestData] = useState<string>('');

  const testOptions = async () => {
    setIsLoading(true);
    setTestResult('Testando OPTIONS...');

    try {
      const response = await fetch('http://localhost:8080/register', {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:3000',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type',
        },
      });

      console.log('OPTIONS Response:', response.status, response.headers);
      
      setTestResult(`OPTIONS Status: ${response.status}\n`);
      setTestResult(prev => prev + `Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}`);
      
    } catch (error) {
      setTestResult(`Erro OPTIONS: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
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
      
      setRequestData(`Estrutura do serviço:\n${JSON.stringify({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
        dataLength: response.data.length
      }, null, 2)}`);
      
    } catch (error) {
      setTestResult(`Erro no serviço: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testPedidos = async () => {
    setIsLoading(true);
    setTestResult('Testando API de pedidos...');

    const token = localStorage.getItem('auth_token');
    setRequestData(`Token: ${token ? 'Presente' : 'Ausente'}`);

    try {
      const response = await fetch('http://localhost:8080/api/pedidos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        mode: 'cors',
      });

      setTestResult(`Pedidos Status: ${response.status} - ${response.statusText}\n`);
      
      if (response.ok) {
        const data = await response.json();
        setTestResult(prev => prev + `Tipo de dados: ${typeof data}\n`);
        setTestResult(prev => prev + `Tem descricao_pedido: ${!!data.descricao_pedido}\n`);
        setTestResult(prev => prev + `Total: ${data.total}\n`);
        
        if (data.descricao_pedido && Array.isArray(data.descricao_pedido)) {
          setTestResult(prev => prev + `Pedidos encontrados: ${data.descricao_pedido.length}\n`);
          setTestResult(prev => prev + `Primeiros pedidos:\n${JSON.stringify(data.descricao_pedido.slice(0, 2), null, 2)}`);
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

  const testFornecedores = async () => {
    setIsLoading(true);
    setTestResult('Testando API de fornecedores...');

    const token = localStorage.getItem('auth_token');
    setRequestData(`Token: ${token ? 'Presente' : 'Ausente'}`);

    try {
      const response = await fetch('http://localhost:8080/api/fornecedores', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        mode: 'cors',
      });

      setTestResult(`Fornecedores Status: ${response.status} - ${response.statusText}\n`);
      
      if (response.ok) {
        const data = await response.json();
        setTestResult(prev => prev + `Tipo de dados: ${typeof data}\n`);
        setTestResult(prev => prev + `Tem fornecedores: ${!!data.fornecedores}\n`);
        setTestResult(prev => prev + `Total: ${data.total}\n`);
        
        if (data.fornecedores && Array.isArray(data.fornecedores)) {
          setTestResult(prev => prev + `Fornecedores encontrados: ${data.fornecedores.length}\n`);
          setTestResult(prev => prev + `Primeiros fornecedores:\n${JSON.stringify(data.fornecedores.slice(0, 2), null, 2)}`);
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
        } else if (response.status === 404) {
          setTestResult(prev => prev + '\n🔍 Endpoint não encontrado - rota foi alterada ou não existe');
        } else if (response.status === 500) {
          setTestResult(prev => prev + '\n⚠️ Problema interno no servidor');
        }
      }
    } catch (error) {
      setTestResult(`Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      setTestResult(prev => prev + '\n🌐 Possível problema de rede ou CORS');
    } finally {
      setIsLoading(false);
    }
  };

  const testProdutosRaw = async () => {
    setIsLoading(true);
    setTestResult('Testando estrutura raw da API de produtos...');

    const token = localStorage.getItem('auth_token');
    setRequestData(`Token: ${token ? 'Presente' : 'Ausente'}`);

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

      setTestResult(`Raw API Status: ${response.status} - ${response.statusText}\n`);
      
      if (response.ok) {
        const data = await response.json();
        setTestResult(prev => prev + `Tipo de dados: ${typeof data}\n`);
        setTestResult(prev => prev + `É array: ${Array.isArray(data)}\n`);
        setTestResult(prev => prev + `Estrutura completa:\n${JSON.stringify(data, null, 2)}`);
      } else {
        const errorData = await response.text();
        setTestResult(prev => prev + 'Erro: ' + errorData);
      }
    } catch (error) {
      setTestResult(`Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testProdutos = async () => {
    setIsLoading(true);
    setTestResult('Testando API de produtos...');

    const token = localStorage.getItem('auth_token');
    setRequestData(`Token: ${token ? 'Presente' : 'Ausente'}`);

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

      setTestResult(`Produtos Status: ${response.status} - ${response.statusText}\n`);
      
      if (response.ok) {
        const data = await response.json();
        setTestResult(prev => prev + `Produtos encontrados: ${Array.isArray(data) ? data.length : 'N/A'}\n`);
        setTestResult(prev => prev + 'Primeiros produtos: ' + JSON.stringify(data.slice(0, 2), null, 2));
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

  const testLoginFail = async () => {
    setIsLoading(true);
    setTestResult('Testando login com credenciais incorretas...');

    const loginData = {
      email: 'teste@teste.com',
      password: 'senhaerrada'
    };

    setRequestData(JSON.stringify(loginData, null, 2));

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(loginData),
      });

      setTestResult(`Login Fail Status: ${response.status} - ${response.statusText}\n`);
      
      if (response.ok) {
        const data = await response.json();
        setTestResult(prev => prev + 'Resposta inesperada: ' + JSON.stringify(data, null, 2));
      } else {
        let errorData;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
        } else {
          errorData = await response.text();
        }
        
        setTestResult(prev => prev + 'Erro (esperado): ' + JSON.stringify(errorData, null, 2));
        setTestResult(prev => prev + '\n❌ Mensagem que será exibida: "E-mail ou senha não estão corretos"');
      }
    } catch (error) {
      setTestResult(`Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testLogin = async () => {
    setIsLoading(true);
    setTestResult('Testando login...');

    const loginData = {
      email: 'teste@teste.com',
      password: 'teste123!'
    };

    setRequestData(JSON.stringify(loginData, null, 2));

    try {
      console.log('=== DEBUG LOGIN TEST ===');
      console.log('URL:', 'http://localhost:8080/login');
      console.log('Dados enviados:', loginData);
      console.log('JSON string:', JSON.stringify(loginData));
      
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(loginData),
      });

      console.log('Login Response status:', response.status);
      console.log('Login Response headers:', Object.fromEntries(response.headers.entries()));

      setTestResult(`Login Status: ${response.status} - ${response.statusText}\n`);
      setTestResult(prev => prev + `Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}\n`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Login Response data:', data);
        setTestResult(prev => prev + 'Resposta: ' + JSON.stringify(data, null, 2));
        setTestResult(prev => prev + '\n✅ Login bem-sucedido! Em produção redirecionaria para /minha-empresa');
      } else {
        let errorData;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
        } else {
          errorData = await response.text();
        }
        
        console.log('Login Error data:', errorData);
        setTestResult(prev => prev + 'Erro: ' + JSON.stringify(errorData, null, 2));
      }
    } catch (error) {
      console.error('Login Fetch error:', error);
      setTestResult(`Erro de login: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testMinimal = async () => {
    setIsLoading(true);
    setTestResult('Testando dados mínimos...');

    const minimalData = {
      first_name: 'Jo', // Mínimo 2 caracteres
      last_name: 'Da', // Mínimo 2 caracteres
      email: 'a@b.com',
      city: 'SP', // Mínimo 2 caracteres
      password: '123456!' // Mínimo 6 + caractere especial obrigatório
    };

    setRequestData(JSON.stringify(minimalData, null, 2));

    try {
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(minimalData),
      });

      setTestResult(`Minimal Status: ${response.status} - ${response.statusText}\n`);
      
      if (response.ok) {
        const data = await response.json();
        setTestResult(prev => prev + 'Resposta: ' + JSON.stringify(data, null, 2));
      } else {
        const errorData = await response.text();
        setTestResult(prev => prev + 'Erro: ' + errorData);
      }
    } catch (error) {
      setTestResult(`Erro minimal: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    setIsLoading(true);
    setTestResult('Testando conexão...');

    const testData = {
      first_name: 'Teste',
      last_name: 'Usuario',
      email: 'teste@teste.com',
      city: 'Sao Paulo',
      password: 'teste123!' // Mínimo 6 chars + caractere especial obrigatório
    };

    setRequestData(JSON.stringify(testData, null, 2));

    try {
      console.log('=== DEBUG BACKEND TEST ===');
      console.log('URL:', 'http://localhost:8080/register');
      console.log('Dados enviados:', testData);
      console.log('JSON string:', JSON.stringify(testData));
      
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(testData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      setTestResult(`Status: ${response.status} - ${response.statusText}\n`);
      setTestResult(prev => prev + `Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}\n`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        setTestResult(prev => prev + 'Resposta: ' + JSON.stringify(data, null, 2));
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

  const testProdutosNew = async () => {
    setIsLoading(true);
    setTestResult('Testando nova API de produtos...');

    const token = localStorage.getItem('auth_token');
    setRequestData(`Token: ${token ? 'Presente' : 'Ausente'}`);

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

      setTestResult(`Produtos New Status: ${response.status} - ${response.statusText}\n`);
      
      if (response.ok) {
        const data = await response.json();
        setTestResult(prev => prev + `Tipo de dados: ${typeof data}\n`);
        setTestResult(prev => prev + `Tem products: ${!!data.products}\n`);
        setTestResult(prev => prev + `Total: ${data.total}\n`);
        setTestResult(prev => prev + `Page: ${data.page}\n`);
        setTestResult(prev => prev + `Limit: ${data.limit}\n`);
        
        if (data.products && Array.isArray(data.products)) {
          setTestResult(prev => prev + `Produtos encontrados: ${data.products.length}\n`);
          setTestResult(prev => prev + `Estrutura do primeiro produto:\n${JSON.stringify(data.products[0] || {}, null, 2)}`);
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

  const testCreateProduto = async () => {
    setIsLoading(true);
    setTestResult('Testando criação de produto...');

    const testData = {
      data_cadastro: new Date().toISOString().split('T')[0],
      codigo_barra: '7891234567890',
      nome_produto: 'Produto Teste API',
      sku: 'PROD-TEST-001',
      categoria: 'Alimentação',
      destinado_para: 'Cães',
      variacao: 'Adultos',
      marca: 'Teste',
      descricao: 'Produto de teste criado via API',
      status: 'ativo',
      preco_venda: 29.90
    };

    const token = localStorage.getItem('auth_token');
    setRequestData(JSON.stringify(testData, null, 2));

    try {
      console.log('=== TESTE CREATE PRODUTO ===');
      console.log('URL:', 'http://localhost:8080/api/produtos');
      console.log('Dados:', testData);

      const response = await fetch('http://localhost:8080/api/produtos', {
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

  const testDeleteProduto = async () => {
    setIsLoading(true);
    setTestResult('Testando exclusão de produto...');

    const testId = 1; // ID de teste
    const token = localStorage.getItem('auth_token');

    try {
      console.log('=== TESTE DELETE PRODUTO ===');
      console.log('URL:', `http://localhost:8080/api/produtos/${testId}`);

      const response = await fetch(`http://localhost:8080/api/produtos/${testId}`, {
        method: 'DELETE',
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
        
        if (response.status === 404) {
          setTestResult(prev => prev + '\n🔍 Produto não encontrado - ID pode não existir');
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setTestResult(`Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-lg">
      <h3 className="font-bold mb-2">Debug Backend</h3>
      <div className="flex gap-2 mb-2">
        <button
          onClick={testConnection}
          disabled={isLoading}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          {isLoading ? 'Testando...' : 'POST /register'}
        </button>
        <button
          onClick={testOptions}
          disabled={isLoading}
          className="bg-green-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          OPTIONS
        </button>
        <button
          onClick={testMinimal}
          disabled={isLoading}
          className="bg-purple-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          Minimal
        </button>
        <button
          onClick={testLogin}
          disabled={isLoading}
          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          Login OK
        </button>
        <button
          onClick={testLoginFail}
          disabled={isLoading}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          Login Fail
        </button>
        <button
          onClick={testProdutos}
          disabled={isLoading}
          className="bg-indigo-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          Produtos
        </button>
        <button
          onClick={testProdutosNew}
          disabled={isLoading}
          className="bg-cyan-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          Produtos New
        </button>
        <button
          onClick={testCreateProduto}
          disabled={isLoading}
          className="bg-emerald-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          Create Produto
        </button>
        <button
          onClick={testDeleteProduto}
          disabled={isLoading}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          Delete Produto
        </button>
        <button
          onClick={testProdutosRaw}
          disabled={isLoading}
          className="bg-teal-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          Raw API
        </button>
        <button
          onClick={testProdutosService}
          disabled={isLoading}
          className="bg-purple-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          Service
        </button>
        <button
          onClick={testPedidos}
          disabled={isLoading}
          className="bg-orange-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          Pedidos
        </button>
        <button
          onClick={testFornecedores}
          disabled={isLoading}
          className="bg-purple-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          Fornecedores
        </button>
      </div>
      
      {requestData && (
        <div className="mb-2">
          <h4 className="font-semibold text-sm">Dados Enviados:</h4>
          <pre className="text-xs bg-blue-50 p-2 rounded overflow-auto max-h-32">
            {requestData}
          </pre>
        </div>
      )}
      
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