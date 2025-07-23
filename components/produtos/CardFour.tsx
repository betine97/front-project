'use client';

import React from 'react';

export function CardFour() {
  return (
    <div className="card w-full h-64" style={{ padding: '16px' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div style={{ 
            width: '32px', 
            height: '32px', 
            backgroundColor: '#8B5CF6', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Card Four</h3>
            <p className="text-xs text-gray-500">Componente Card Four</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div style={{ 
            width: '48px', 
            height: '48px', 
            backgroundColor: '#F3F4F6', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 12px' 
          }}>
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">Conteúdo do Card Four</p>
        </div>
      </div>
    </div>
  );
}