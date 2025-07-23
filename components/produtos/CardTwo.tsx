'use client';

import React from 'react';
import styles from './cards.module.css';

export function CardTwo() {
  return (
    <div className={`${styles.cardBase} ${styles.cardTwo}`}>
      <div className={styles.cardHeader}>
        <div className="flex items-center space-x-2">
          <div className={`${styles.cardIconContainer} ${styles.green}`}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className={styles.cardTitle}>Card Two</h3>
            <p className={styles.cardSubtitle}>Componente Card Two</p>
          </div>
        </div>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardContentCenter}>
          <div className={styles.cardContentIconLarge}>
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className={styles.cardContentText}>Conteúdo do Card Two</p>
        </div>
      </div>
    </div>
  );
}