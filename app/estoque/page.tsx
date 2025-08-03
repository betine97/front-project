'use client';

import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export default function EstoquePage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Estoque</h1>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-600">Página de estoque em desenvolvimento.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}