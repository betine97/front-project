'use client';

import React from 'react';

interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'orange' | 'green' | 'blue' | 'red';
}

export function ProgressBar({ 
  percentage, 
  showLabel = false, 
  size = 'sm',
  color = 'orange' 
}: ProgressBarProps) {
  // Garantir que o percentual está entre 0 e 100
  const normalizedPercentage = Math.min(Math.max(percentage, 0), 100);
  
  // Definir altura baseada no tamanho
  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };
  
  // Definir cores
  const colorClasses = {
    orange: 'bg-orange-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500'
  };
  
  // Definir cor baseada no percentual (opcional)
  const getColorByPercentage = (percent: number) => {
    if (percent >= 90) return 'bg-green-500';
    if (percent >= 70) return 'bg-orange-500';
    if (percent >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const progressColor = color === 'orange' && normalizedPercentage > 0 
    ? getColorByPercentage(normalizedPercentage) 
    : colorClasses[color];

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-700">Completude</span>
          <span className="text-xs font-medium text-gray-900">
            {normalizedPercentage.toFixed(0)}%
          </span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${heightClasses[size]} overflow-hidden`}>
        <div
          className={`${heightClasses[size]} rounded-full transition-all duration-300 ease-out ${progressColor}`}
          style={{ width: `${normalizedPercentage}%` }}
        />
      </div>
    </div>
  );
}