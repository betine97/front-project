'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top',
  delay = 300 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const updateTooltipPosition = () => {
    if (!triggerRef.current) return;
    
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    
    // Estimativa do tamanho do tooltip (será ajustado depois que renderizar)
    const tooltipWidth = 220;
    const tooltipHeight = 70;
    
    let top = 0;
    let left = 0;
    
    switch (position) {
      case 'top':
        top = triggerRect.top + scrollY - tooltipHeight - 12;
        left = triggerRect.left + scrollX + (triggerRect.width / 2) - (tooltipWidth / 2);
        break;
      case 'bottom':
        top = triggerRect.bottom + scrollY + 12;
        left = triggerRect.left + scrollX + (triggerRect.width / 2) - (tooltipWidth / 2);
        break;
      case 'left':
        top = triggerRect.top + scrollY + (triggerRect.height / 2) - (tooltipHeight / 2);
        left = triggerRect.left + scrollX - tooltipWidth - 12;
        break;
      case 'right':
        top = triggerRect.top + scrollY + (triggerRect.height / 2) - (tooltipHeight / 2);
        left = triggerRect.right + scrollX + 12;
        break;
    }
    
    // Ajustar para manter dentro da viewport com margem de 20px
    const margin = 20;
    if (left < margin) left = margin;
    if (left + tooltipWidth > window.innerWidth - margin) {
      left = window.innerWidth - tooltipWidth - margin;
    }
    if (top < margin + scrollY) top = margin + scrollY;
    if (top + tooltipHeight > window.innerHeight + scrollY - margin) {
      top = window.innerHeight + scrollY - tooltipHeight - margin;
    }
    
    setTooltipPosition({ top, left });
  };

  const showTooltip = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
      // Use setTimeout to ensure the tooltip is rendered before measuring
      setTimeout(updateTooltipPosition, 0);
    }, delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  // Update position on window resize
  useEffect(() => {
    if (isVisible) {
      window.addEventListener('resize', updateTooltipPosition);
      window.addEventListener('scroll', updateTooltipPosition);
      
      return () => {
        window.removeEventListener('resize', updateTooltipPosition);
        window.removeEventListener('scroll', updateTooltipPosition);
      };
    }
  }, [isVisible]);

  return (
    <>
      <div 
        ref={triggerRef}
        className="inline-block"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {children}
      </div>
      
      {mounted && isVisible && createPortal(
        <div 
          ref={tooltipRef}
          className="fixed z-[1070]"
          style={{ 
            top: `${tooltipPosition.top}px`, 
            left: `${tooltipPosition.left}px`,
            pointerEvents: 'none'
          }}
        >
          <div className="bg-white text-gray-800 text-xs px-3 py-2 rounded-lg shadow-lg border border-gray-200" 
               style={{ minWidth: '200px', maxWidth: '280px', whiteSpace: 'normal' }}>
            {content}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};