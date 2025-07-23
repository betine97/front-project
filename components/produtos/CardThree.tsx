'use client';

import React from 'react';
import styles from './cards.module.css';

export function CardThree() {
  return (
    <div className={`${styles.cardBase} ${styles.cardThree}`}>
      <div className={styles.cardHeader}>
        <div className="flex items-center space-x-2">
          <div className={`${styles.cardIconContainer} ${styles.gray}`}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <div>
            <h3 className={styles.cardTitle}>Card Three</h3>
            <p className={styles.cardSubtitle}>Componente Card Three</p>
          </div>
        </div>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardContentCenter}>
          <div className={styles.cardContentIconLarge}>
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <p className={styles.cardContentText}>Conteúdo do Card Three</p>
        </div>
      </div>
    </div>
  );
}