'use client';

import React from 'react';

export function CardThree() {
  return (
    <div className="card w-full" style={{ padding: '16px', height: '33.5rem' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div style={{ 
            width: '32px', 
            height: '32px', 
            backgroundColor: '#6C757D', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Card Three</h3>
            <p className="text-xs text-gray-500">Componente Card Three</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div style={{ 
            width: '64px', 
            height: '64px', 
            backgroundColor: '#F3F4F6', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 16px' 
          }}>
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">Conteúdo do Card Three</p>
        </div>
      </div>
    </div>
  );
}