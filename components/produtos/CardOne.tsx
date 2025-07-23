'use client';

import React from 'react';
import styles from './cards.module.css';

export function CardOne() {
  return (
    <div className={`${styles.cardBase} ${styles.cardOne}`}>
      <div className={styles.cardHeader}>
        <div className="flex items-center space-x-2">
          <div className={`${styles.cardIconContainer} ${styles.orange}`}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className={styles.cardTitle}>Card One</h3>
            <p className={styles.cardSubtitle}>Componente Card One</p>
          </div>
        </div>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardContentCenter}>
          <div className={styles.cardContentIcon}>
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className={styles.cardContentText}>Conteúdo do Card One</p>
        </div>
      </div>
    </div>
  );
}