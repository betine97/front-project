'use client';

import React from 'react';
import styles from './cards.module.css';

export function CardFour() {
  return (
    <div className={`${styles.cardBase} ${styles.cardFour}`}>
      <div className={styles.cardHeader}>
        <div className="flex items-center space-x-2">
          <div className={`${styles.cardIconContainer} ${styles.purple}`}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <h3 className={styles.cardTitle}>Card Four</h3>
            <p className={styles.cardSubtitle}>Componente Card Four</p>
          </div>
        </div>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardContentCenter}>
          <div className={styles.cardContentIcon}>
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <p className={styles.cardContentText}>Conteúdo do Card Four</p>
        </div>
      </div>
    </div>
  );
}