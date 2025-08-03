'use client';

import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export default function TestProdutosPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Teste - Página de Produtos</h1>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600">Esta é uma versão de teste da página de produtos.</p>
          <p className="text-sm text-gray-500 mt-2">
            Se esta página carregar corretamente, o problema está na página principal.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}