import React from 'react';
import styles from './Card.module.css';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    interactive?: boolean;
}

export function Card({
    children,
    className = '',
    padding = 'md',
    interactive = false
}: CardProps) {
    return (
        <div className={`${styles.card} ${styles['p-' + padding]} ${interactive ? styles.interactive : ''} ${className}`}>
            {children}
        </div>
    );
}
