'use client';

import React from 'react';

export function CardTwo() {
  return (
    <div className="card w-full" style={{ padding: '16px', height: '33.5rem' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div style={{ 
            width: '32px', 
            height: '32px', 
            backgroundColor: '#28A745', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Card Two</h3>
            <p className="text-xs text-gray-500">Componente Card Two</p>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">Conteúdo do Card Two</p>
        </div>
      </div>
    </div>
  );
}